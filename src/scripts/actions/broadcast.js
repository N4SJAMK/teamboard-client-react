import page from 'page';

import flux from '../utils/flux';

import Action    from '../actions';
import Broadcast from '../models/broadcast';

/**
 *
 */
export default flux.actionCreator({

	/**
	 * Add a 'broadcast' item! If the given 'broadcast' is an Error, special
	 * measures will be taken...
	 */
	add(broadcast, action = null) {
		if(broadcast instanceof Error) {
			broadcast.type    = Broadcast.Type.Error;
			broadcast.content = Broadcast.Type.Error.Message.From(
				broadcast, action
			);

			// Having this here is a bit hackish, but whatever tbh...
			if(broadcast.statusCode === 401) {
				this.dispatch(Action.User.Logout);
			}

			// More hacks
			if(broadcast.statusCode === 403 || broadcast.statusCode === 404) {
				page.redirect('/login');
			}
		}
		this.dispatch(Action.Broadcast.Add, broadcast);
	},

	/**
	 * Remove the given broadcast, usually you want to do this when the user
	 * dismisses that.
	 */
	remove(broadcast) {
		this.dispatch(Action.Broadcast.Remove, broadcast);
	}
});
