import api  from '../utils/api';
import uid  from '../utils/uid';
import flux from '../utils/flux';

import Board           from '../models/board';
import Action          from '../actions';
import UserStore       from '../stores/user';
import BoardStore      from '../stores/board';
import BroadcastAction from '../actions/broadcast';

/**
 * Action Creator for Board related actions.
 */
export default flux.actionCreator({
	/**
	 * Add a board.
	 *
	 * NOTE This method does not hit servers and is meant to be used when
	 *      informing the client of change.
	 */
	add(board) {
		this.dispatch(Action.Board.Add, { board });
	},

	/**
	 * Edit the given board.
	 *
	 * NOTE This method does not hit servers and is meant to be used when
	 *      informing the client of change.
	 */
	edit(board) {
		this.dispatch(Action.Board.Edit, { board });
	},

	/**
	 * Remove the given board.
	 *
	 * NOTE This method does not hit servers and is meant to be used when
	 *      informing the client of change.
	 */
	remove(board) {
		this.dispatch(Action.Board.Remove, { board });
	},

	/**
	 * Fetch board data from the server. If given an 'id', will fetch data for
	 * the Board specified by it.
	 */
	load(boardID = undefined) {
		let token   = UserStore.getToken();
		let request = boardID === undefined
			? api.getBoards.bind(null, { token })
			: api.getBoard.bind(null, { token, id: { board: boardID } });

		request()
			.then((board) => {
				this.dispatch(Action.Board.Add, { board });

				// We gradually inform the store that it should emit change as
				// it receives the tickets belonging to it.
				(board instanceof Array ? board : [ board ]).map((board) => {
					// Perform the request for each board to get their tickets.
					api.getTickets({ token, id: { board: board.id } })
						.then((ticket) => {
							this.dispatch(Action.Ticket.Add, { board, ticket });
						})
						.catch((err) => {
							BroadcastAction.add(err, Action.Ticket.Load);
						});
				});
			})
			.catch((err) => {
				BroadcastAction.add(err, Action.Board.Load);
			});
	},

	/**
	 * Create a board, persisting it on the server.
	 */
	create(board) {
		let token   = UserStore.getToken();
		let payload = Object.assign(board, { id: uid() });

		this.dispatch(Action.Board.Add, { board: payload });

		api.createBoard({ token, payload })
			.then((board) => {
				this.dispatch(Action.Board.Add, { board }, { silent: true });
				this.dispatch(Action.Board.Remove, { board: payload });
			})
			.catch((err) => {
				this.dispatch(Action.Board.Remove, { board: payload });
				BroadcastAction.add(err, Action.Board.Add);
			});
	},

	/**
	 * Update a board, persisting the changes to the server.
	 */
	update(board) {
		let token    = UserStore.getToken();
		let previous = BoardStore.getBoard(board.id).toJS();

		this.dispatch(Action.Board.Edit, { board });

		api.updateBoard({ token, payload: board, id: { board: board.id } })
			.catch((err) => {
				this.dispatch(Action.Board.Edit, { board: previous });
				BroadcastAction.add(err, Action.Board.Edit);
			});
	},

	/**
	 * Delete a board, persisting the removal to the server.
	 */
	delete(board) {
		let token    = UserStore.getToken();
		let existing = BoardStore.getBoard(board.id).toJS();

		this.dispatch(Action.Board.Remove, { board });

		api.deleteBoard({ token, id: { board: board.id } })
			.catch((err) => {
				this.dispatch(Action.Board.Add, { board: existing });
				BroadcastAction.add(err, Action.Board.Remove);
			});
	},

	/**
	 * Sets the user either active or away in a board
	 */
	setUserBoardActivity(boardId, isActive, isPoll) {
		let token = UserStore.getToken();

		return api.setUserBoardActivity({ token: token,
			isPoll:       isPoll,
			id: { board:  boardId},
			payload: {isActive: isActive}})
			.then(() => {
				return Promise.resolve();
			})
			.catch((err) => {
				BroadcastAction.add(err, Action.Board.setUserBoardActivity);
				return Promise.reject();
			});
	},
	/**
	 * Generate an 'access-code' for the given board, allowing the board to be
	 * shared to ther users.
	 */
	generateAccessCode(board) {
		let token = UserStore.getToken();

		api.generateAccessCode({ token, id: { board: board.id } })
			.then((res) => {
				this.dispatch(Action.Board.Edit, {
					board: {
						id:         board.id,
						accessCode: res.accessCode
					}
				});
			})
			.catch((err) => {
				BroadcastAction.add(err, Action.Board.Edit);
			});
	},

	/**
	 * Revoke the 'access-code' of the given board, essentially making it
	 * hidden to other users.
	 */
	revokeAccessCode(board) {
		let token    = UserStore.getToken();
		let existing = BoardStore.getBoard(board.id);

		this.dispatch(Action.Board.Edit, {
			board: {
				id: board.id, accessCode: null
			}
		});

		api.revokeAccessCode({ token, id: { board: board.id } })
			.catch((err) => {
				this.dispatch(Action.Board.Edit, {
					board: {
						id: board.id, accessCode: existing.accessCode
					}
				});
				BroadcastAction.add(err, Action.Board.Edit);
			});
	}
});
