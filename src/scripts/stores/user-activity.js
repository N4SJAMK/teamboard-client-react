import Immutable from 'immutable';

import flux   from '../utils/flux';
import User   from '../models/user';
import Action from '../actions';

let members  = Immutable.Map();

/**
 *
 */
export default flux.store({
	getMembers(boardID) {
		return members.get(boardID, Immutable.List());
	},

	handlers: {
		[Action.Board.Ping](payload) {
			let users   = members.get(payload.board, Immutable.List());
			let useridx = users.findIndex((m) => {
				return m.get('user').id === payload.user.id
			});

			if(useridx < 0) {
				users = users.push(Immutable.Map({
					user: User.fromJS(payload.user), date: new Date() }));
			}
			else {
				users = users.update(useridx, () => {
					return Immutable.Map({
						user: User.fromJS(payload.user), date: new Date() });
				});
			}
			members = members.set(payload.board, users);
		}
	}
});
