import flux      from '../utils/flux'
import immutable from 'immutable'

import Board  from '../models/board';
import Ticket from '../models/ticket';
import Action from '../actions';

/**
 * The immutable state of our application.
 */
let boards = immutable.List();

/**
 * Handles the 'Board' and 'Ticket' related state of the application.
 */
export default flux.store({

	getBoards() {
		return boards;
	},

	getBoard(boardID) {
		return boards.find((board) => board.id === boardID);
	},

	getTickets(boardID) {
		let board = this.getBoard(boardID);
		return board ? board.tickets : immutable.List();
	},

	getTicket(boardID, ticketID) {
		let tickets = this.getTickets(boardID);
		return tickets.find((ticket) => ticket.id === ticketID);
	},

	getUserRole(boardID, userID) {
		let board = this.getBoard(boardID);

		let role = null;
		if (board) {
			let members = board.members;
			if (members.constructor.name === "List")
			 {
			 	members = members.toJS();
			 }
			members.map(function(member) {
				if (member.user.id == userID) {
					role = member.role;
				}
			})
		}
		return role;
	},

	getBoardAdmin(boardID) {
		let board = this.getBoard(boardID);

		let adminUser = null;
		if (board) {
			if (board.members) {
				let members = board.members;
				adminUser = members.find(function(obj){return obj.get('role') === 'admin';});
			}
		}

		return adminUser;
	},

	handlers: {
		[Action.User.Logout]() {
			boards = immutable.List();
		},

		[Action.Board.Add](payload) {
			if(payload.board instanceof Array) {
				return boards = initialize(Board.fromJS, payload.board, boards);
			}
			if(has(boards, payload.board)) {
				return boards = edit(boards, payload.board);
			}
			return boards = add(boards, Board.fromJS(payload.board));
		},

		[Action.Board.Edit](payload) {
			if(has(boards, payload.board)) {
				return boards = edit(boards, payload.board);
			}
			return boards = add(boards, Board.fromJS(payload.board));
		},

		[Action.Board.Remove](payload) {
			if(has(boards, payload.board)) {
				return boards = remove(boards, payload.board);
			}
			//throw new Error('Board not found!');
		},

		[Action.Ticket.Add](payload) {
			if(!has(boards, payload.board)) {
				throw new Error('Board not found!');
			}
			return boards = edit(boards, payload.board, (board) => {
				if(payload.ticket instanceof Array) {
					return board.set('tickets',
						calcz(initialize(Ticket.fromJS, payload.ticket)));
				}
				return board.set('tickets', has(board.tickets, payload.ticket)
					? calcz(edit(board.tickets, payload.ticket))
					: calcz(add(board.tickets, Ticket.fromJS(payload.ticket)))
				);
			});
		},

		[Action.Ticket.Edit](payload) {
			if(!has(boards, payload.board)) {
				throw new Error('Board not found!');
			}
			return boards = edit(boards, payload.board, (board) => {
				return board.set('tickets', has(board.tickets, payload.ticket)
					? calcz(edit(board.tickets, payload.ticket))
					: calcz(add(board.tickets, Ticket.fromJS(payload.ticket)))
				);
			});
		},

		[Action.Ticket.Remove](payload) {
			if(!has(boards, payload.board)) {
				throw new Error('Board not found!');
			}
			return boards = edit(boards, payload.board, (board) => {
				return board.set('tickets', has(board.tickets, payload.ticket)
					? remove(board.tickets, payload.ticket)
					: board.tickets
				);
			});
		}
	}
});

/**
 * Find the 'index' of the given 'record' from 'collection', based on the 'id'
 * attribute.
 */
function id(collection, record) {
	return collection.findIndex((r) => r.id === record.id);
}

/**
 * Check if the given 'record' exists in the 'collection'.
 */
function has(collection, record) {
	return id(collection, record) >= 0;
}

/**
 * Add the given 'record' to the 'collection'.
 */
function add(collection, record) {
	return collection.push(record);
}

/**
 * Edit the given 'record' in the 'collection', using 'mergeDeep'. If given a
 * separate 'updater' function, it is used instead of 'mergeDeep'.
 */
function edit(collection, record, updater) {
	return collection.update(id(collection, record), (existing) => {
		return updater ? updater(existing) : existing.mergeDeep(record);
	});
}

/**
 * Remove the given 'record' from the 'collection'.
 */
function remove(collection, record) {
	return collection.remove(id(collection, record));
}

/**
 * Initialize a plain JS collection into an immutable list, using the 'factory'
 * function to transform the plain objects into something more.
 */
function initialize(factory, collection, fromCollection = immutable.List()) {
	return immutable.List(collection.map((record) => {
		if(has(fromCollection, record)) {
			return fromCollection
				.get(id(fromCollection, record)).mergeDeep(record);
		}
		return factory(record);
	}));
}

/**
 * For the given 'tickets', calculate a 'position.z' value based on the time
 * they were last updated at.
 *
 * TODO This should probably be cleaned up a bit, now the function is really
 *      messy and it's not necessary clear to others what a heck is happening.
 */
function calcz(tickets) {
	let z = tickets.sortBy((t) => t.ua).map((t) => t.id).toMap().flip();
	return tickets.map((t) => {
		return t.setIn([ 'position', 'z' ], z.get(t.id));
	});
}
