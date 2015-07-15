import api  from '../utils/api';
import uid  from '../utils/uid';
import flux from '../utils/flux';

import Action          from '../actions';
import UserStore       from '../stores/user';
import BoardStore      from '../stores/board';
import BroadcastAction from '../actions/broadcast';

/**
 *
 */
export default flux.actionCreator({
	/**
	 * Add a ticket to the given board.
	 *
	 * NOTE This method does not hit servers and is meant to be used when
	 *      informing the client of change.
	 */
	add(board, ticket) {
		ticket.ua = Date.now();
		this.dispatch(Action.Ticket.Add, { board, ticket });
	},

	/**
	 * Edit the given ticket.
	 *
	 * NOTE This method does not hit servers and is meant to be used when
	 *      informing the client of change.
	 */
	edit(board, ticket) {
		ticket.ua = Date.now();
		this.dispatch(Action.Ticket.Edit, { board, ticket });
	},

	/**
	 * Remove the given ticket.
	 *
	 * NOTE This method does not hit servers and is meant to be used when
	 *      informing the client of change.
	 */
	remove(board, ticket) {
		this.dispatch(Action.Ticket.Remove, { board, ticket });
	},

	/**
	 * Create a ticket on the given board, persisting it on the server.
	 */
	create(board, ticket) {
		let token   = UserStore.getToken();
		let payload = Object.assign(ticket, { id: uid(), ua: Date.now() });
		this.dispatch(Action.Ticket.Add, { board, ticket: payload });

		api.createTicket({ token, payload, id: { board: board.id } })
			.then((ticket) => {
				// Let's just ignore the stuff server gives us, expect the id,
				// because why the hell not! This is not good... But what is?
				let dirty = { id: payload.id }
				let clean = Object.assign(payload, { id: ticket.id });
				clean.comments = [];
				this.dispatch(Action.Ticket.Add, { board, ticket: clean }, {
					silent: true
				});
				this.dispatch(Action.Ticket.Remove, { board, ticket: dirty });
			})
			.catch((err) => {
				this.dispatch(Action.Ticket.Remove, { board, ticket: payload });
				BroadcastAction.add(err, Action.Ticket.Add);
			});
	},

	/**
	 * Posts a new comment to the ticket.
	 */
	comment(board, ticket, newcomment) {
		let token    = UserStore.getToken();
		let payload  = Object.assign(ticket, { ua: Date.now(), comment: newcomment});
		let previous = BoardStore.getTicket(board.id, ticket.id).toJS();

		api.createComment({ token, payload, id: { board: board.id, ticket: payload.id }})
			.catch((err) => {
				this.dispatch(Action.Ticket.Edit, { board, ticket: previous });
				BroadcastAction.add(err, Action.Ticket.Edit);
			});
	},

	/**
	 * Update the given ticket, persisting the changes to the server.
	 */
	update(board, ticket) {
		let token    = UserStore.getToken();
		let payload  = Object.assign(ticket, { ua: Date.now() });
		let previous = BoardStore.getTicket(board.id, ticket.id).toJS();

		this.dispatch(Action.Ticket.Edit, { board, ticket: payload });

		return api.updateTicket({
			token, payload, id: { board: board.id, ticket: payload.id }
			})
		.then((response) => {
				return Promise.resolve()
		})
		.catch((err) => {
				this.dispatch(Action.Ticket.Edit, { board, ticket: previous });
				BroadcastAction.add(err, Action.Ticket.Edit);
				return Promise.reject()
			});
	},

	/**
	 * Delete the given ticket, persisting the changes to the server.
	 */
	delete(board, ticket) {
		let token    = UserStore.getToken();
		let existing = BoardStore.getTicket(board.id, ticket.id).toJS();

		this.dispatch(Action.Ticket.Remove, { board, ticket });

		api.deleteTicket({ token, id: { board: board.id, ticket: ticket.id } })
			.catch((err) => {
				this.dispatch(Action.Ticket.Add, { board, ticket: existing });
				BroadcastAction.add(err, Action.Ticket.Remove);
			});
	}
});
