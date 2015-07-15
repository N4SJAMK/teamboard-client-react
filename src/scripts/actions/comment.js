import api             from '../utils/api';
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

	addComment(boardID, ticketID, message) {

	},

	createComment(boardID, ticketID, message) {

	}
});
