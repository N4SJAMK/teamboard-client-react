import Immutable from 'immutable';

import flux   from '../utils/flux';
import User   from '../models/user';
import Action from '../actions';

let activity = Immutable.Map();

/**
 *
 */
export default flux.store({

	getActivity() {
		return activity;
	},

	handlers: {
		[Action.Activity.Add](payload) {
			activity = activity.set(payload.ticket,
				activity.get(payload.ticket, Immutable.List())
					.push(Immutable.Map({
						id: payload.id,
						user: User.fromJS(payload.user).toJS(),
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
