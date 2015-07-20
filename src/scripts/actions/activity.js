import flux         from '../utils/flux';
import Action       from '../actions';
import UserStore    from '../stores/user';
import SocketAction from '../actions/socket';

/**
 *
 */
export default flux.actionCreator({

	addPing(pingData) {
		this.dispatch(Action.Board.Ping, pingData);
	},

	createPing(boardID) {
		let data = {
			user: UserStore.getUser().toJS(), board: boardID
		}
		this.dispatch(Action.Board.Ping,  data);
		SocketAction.create('board:ping', data);
	}
});
