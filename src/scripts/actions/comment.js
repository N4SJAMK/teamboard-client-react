import api             from '../utils/api';
import uid             from '../utils/uid';
import flux            from '../utils/flux';
import Action          from '../actions';
import UserStore       from '../stores/user';
import BroadcastAction from '../actions/broadcast';

/**
 *
 */
export default flux.actionCreator({

	loadComments(boardID, ticketID) {
		let options = {
			id: {
				board:  boardID,
				ticket: ticketID
			},
			token: UserStore.getToken()
		}
		api.getComments(options)
			.then(comments => {
				this.dispatch(Action.Comment.Add, {
					ticket: { id: ticketID }, comment: comments
				});
			})
			.catch(err => BroadcastAction.add(err, Action.Comment.Load));
	},

	addComment(ticketID, comment) {
		this.dispatch(Action.Comment.Add, {
			ticket: { id: ticketID }, comment: comment });
	},

	createComment(boardID, ticketID, message) {
		// create the ticket with client generated values, don't worry we'll
		// replace this once we get something back from the server
		let dirtyComment = {
			id:        uid(),
			message:   message,
			createdBy: UserStore.getUser(),
			createdAt: Date.now()
		}

		// dispatch an action, which will optimistically add the comment to the
		// specified ticket
		this.dispatch(Action.Comment.Add, {
			ticket: { id: ticketID }, comment: dirtyComment });

		// define the parameters etc. sent to the api
		let options = {
			id: {
				board:  boardID,
				ticket: ticketID
			},
			payload: {
				message: message
			},
			token: UserStore.getToken()
		}

		api.createComment(options)
			// on a succesful create, we'll just replace the dirty comment with
			// the one received from the server
			.then(comment => {
				// remove the dirty comment silently
				this.dispatch(Action.Comment.Remove, {
					ticket: { id: ticketID }, comment: { id: dirtyComment.id }
				}, {
					// make sure the store does not emit change for this
					// operation, since it's tied to the one below
					silent: true
				});
				// add the server approved comment
				this.dispatch(Action.Comment.Add, {
					ticket: { id: ticketID }, comment: comment });
			})
			.catch(err => BroadcastAction.add(err, Action.Comment.Add));
	}
});
