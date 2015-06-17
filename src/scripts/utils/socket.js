import io   from 'socket.io-client';
import utf8 from 'utf8';

import Action          from '../actions';
import BoardStore      from '../stores/board';
import BoardAction     from '../actions/board';
import TicketAction    from '../actions/ticket';
import BroadcastAction from '../actions/broadcast';
import UserAction      from '../actions/user';

export default {
	connect:    connect,
	disconnect: disconnect
}

const IO_URL        = process.env.IO_URL || 'http://localhost:9001';
const IO_URL_PATH   = process.env.IO_URL_PATH || '/socket.io';
const JOIN_EVENT    = 'board:join';
const DATA_EVENT    = 'board:event';

let rooms  = [ ];
let socket = null;

/**
 * Creates a new 'socket.io' connection. Doesn't do anything if a connection is
 * already present.
 *
 * Note that this also attaches the event handlers for listening to changes, so
 * don't worry about them. We also keep track of the boards currently in store,
 * so we can join their respective rooms.
 *
 * @param {object} opts        Options for the connection.
 * @param {string} opts.token  Handshake token sent as a query parameter.
 *
 * @returns {Promise}  Resolved when a connection is established. Rejected if
 *                     an error occurs with the connection.
 */
function connect(opts = {}) {
	let options = {
		'query':                `access-token=${opts.token}`,
		'multiplex':            false,
		'force new connection': true,
		'path':                 IO_URL_PATH
	}
	return new Promise((resolve, reject) => {
		if(socket && socket.connected) {
			return resolve();
		}

		socket = io(IO_URL, options);

		// Don't log out if IO is down, simply spam error msgs...
		socket.on('connect_error', (err) => {
			BroadcastAction.add(err, Action.Socket.ConnectFail);
		});

		// Way to handle invalid token and other funkyness by logging out
		socket.on('error', (err) => {
			UserAction.logout()
				.then(() => {
					return page.show('/login');
				});
			BroadcastAction.add(err, Action.Socket.Error);
			return reject();
		});

		socket.on('connect', () => {
			joinBoards();
			BoardStore.addChangeListener(joinBoards);
			socket.on(DATA_EVENT, handleIncomingEvent);
			return resolve();

		});

		// This is a bit of a hack in order to make sure we get new data if we
		// disconnect and regain connection later on.
		socket.on('reconnect', () => {
			rooms = [ ];
			BoardAction.load();
		});
	});
}

/**
 * Disconnect the client from the 'socket.io' server. Also clears any stored
 * socket state in the client.
 *
 * @returns {Promise}  Resolved upon disconnecting.
 */
function disconnect() {
	return new Promise((resolve) => {
		if(socket && socket.connected) {
			socket.disconnect();
		}

		rooms  = [];
		socket = null;

		BoardStore.removeChangeListener(joinBoards);
		return resolve();
	});
}

/**
 * Each board represents a 'room', as far as the socket connection cares. When
 * the state of the 'BoardStore' changs, we make sure to sync our room status
 * with the store.
 */
function joinBoards() {
	if(!socket || !socket.connected) {
		return null;
	}

	let boards   = BoardStore.getBoards();
	let boardIDs = boards.map((board) => board.id)
		.filter((boardID) => rooms.indexOf(boardID) < 0);

	boardIDs.forEach((boardID) => {
		// If the board is 'dirty', not yet approved by the server, we don't
		// join it because the 'id' property will change.
		if(boardID.substring(0, 'dirty'.length) === 'dirty') {
			return null;
		}

		rooms.push(boardID);
		socket.emit(JOIN_EVENT, { board: boardID }, (err) => {
			if(err) {
				rooms = rooms.filter((id) => id !== boardID);
				return BroadcastAction.add(err, Action.Socket.Join);
			}
		});
	});
}

/**
 * Defines the types of 'events' we receive.
 */
const Event = {
	Board: {
		Update: 'BOARD_EDIT'
	},
	Ticket: {
		Create: 'TICKET_CREATE',
		Update: 'TICKET_EDIT',
		Delete: 'TICKET_REMOVE'
	}
}

/**
 * The implementation of the 'event' handlers.
 */
const PayloadHandler = {
	[Event.Board.Update](payload) {
		let board = Object.assign({ id: payload.board },
			payload.data.newAttributes);
		board.name = utf8.decode(board.name);
		return BoardAction.edit(board);
	},
	[Event.Ticket.Create](payload) {
		let board = {
			id: payload.board
		}
		let ticket = payload.data;
		if(!BoardStore.getTicket(board.id, ticket.id)) {
			ticket.content = utf8.decode(ticket.content);
			return TicketAction.add(board, ticket);
		}
	},
	[Event.Ticket.Update](payload) {
		let board = {
			id: payload.board
		}
		let ticket = Object.assign({ id: payload.data.id },
			payload.data.newAttributes);
		ticket.content = utf8.decode(ticket.content);
		return TicketAction.edit(board, ticket);
	},
	[Event.Ticket.Delete](payload) {
		let board = {
			id: payload.board
		}
		let ticket = payload.data;
		return TicketAction.remove(board, ticket);
	}
}

/**
 * The received data is in the format of 'events'. We simply dispatch a few
 * actions when new data is received and we should have real time stuff...
 *
 * NOTE See the implementation of the handlers below...
 */
function handleIncomingEvent(event) {
	if(PayloadHandler[event.type]) {
		return PayloadHandler[event.type](event);
	}
}
