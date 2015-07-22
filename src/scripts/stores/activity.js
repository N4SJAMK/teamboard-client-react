import Immutable from 'immutable';

import flux   from '../utils/flux';
import User   from '../models/user';
import Action from '../actions';

let members  = Immutable.Map();
let activity = Immutable.Map();

/**
 *
 */
export default flux.store({
	getActiveMembers(boardID) {
		return members.get(boardID, Immutable.List());
	},

	getActivity(ticketID) {
		let activities = activity.get(ticketID, Immutable.List());
		activities = activities.groupBy(act => act.get('user').id).toList()
			.map((act) => act.first());
		return activities;
	},

	handlers: {
		[Action.Board.Tap]() {
			
		}
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
		},

		[Action.Activity.Add](payload) {
			activity = activity.set(payload.ticket,
				activity.get(payload.ticket, Immutable.List())
					.push(Immutable.Map({
						id: payload.id,
						user: User.fromJS(payload.user),
						ticket: payload.ticket
					})));
		},

		[Action.Activity.Remove](payload) {
			let activities = activity.get(payload.ticket, Immutable.List());
			let actidx     = activities.findIndex(activity => activity.get('id') === payload.id);

			if(actidx >= 0) {
				activity = activity.set(payload.ticket, activities.remove(actidx));
			}
		}
	}
});
