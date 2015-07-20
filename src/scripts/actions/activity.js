import uid          from '../utils/uid';
import flux         from '../utils/flux';
import Action       from '../actions';
import UserStore    from '../stores/user';
import SocketAction from '../actions/socket';

/**
 *
 */
const ActivityActionCreator = flux.actionCreator({

	addPing(pingData) {
		this.dispatch(Action.Board.Ping, pingData);
	},

	createPing(boardID) {
		let data = {
			user: UserStore.getUser().toJS(), board: boardID
		}
		this.dispatch(Action.Board.Ping,  data);
		SocketAction.create('board:ping', data);
	},

	addTicketActivity(activity) {
		activity.id = uid();
		this.dispatch(Action.Activity.Add, activity);

		return setTimeout(
			ActivityActionCreator.removeTicketActivity
				.bind(this, activity.ticket, activity.id),
			5000
		);
	},

	removeTicketActivity(ticketID, activityID) {
		this.dispatch(Action.Activity.Remove, {
			id: activityID, ticket: ticketID
		});
	},

	createTicketActivity(boardID, ticketID) {
		let data = {
			user: UserStore.getUser().toJS(),
			board: boardID, ticket: ticketID
		}
		SocketAction.create('ticket:activity', data);
		ActivityActionCreator.addTicketActivity(data);
	}
});

export default ActivityActionCreator;
