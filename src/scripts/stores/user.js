import flux from '../utils/flux';

import User   from '../models/user';
import Action from '../actions';

// Create a reference and just 'merge' from there on out. This way if nothing
// changes we don't actually trigger any re-renders, as it often should be.
let user = new User();

/**
 *
 */
export default flux.store({
	getUser() {
		// The reason this method is fairly long for a simple operation, is in
		// the fact that over time there might've been some bugs (and probably
		// still are) with how the user was stored... This means that for some
		// users the data stored in localStorage might be of erroneous format.
		if(localStorage.getItem('user')) {
			// First we make sure that the 'user' stored in localStorage is in
			// fact, a JSON formatted string, which can be parsed to an object.
			let storedUser = null;
			try {
				storedUser = JSON.parse(localStorage.getItem('user'));
			} catch(err) {
				localStorage.removeItem('user');
				localStorage.removeItem('token');
				return null;
			}
			// Next we must make sure the object parsed from JSON has the right
			// fields, e.g. is in the format of a 'user'.
			let isOfValidFormat = (
				storedUser.hasOwnProperty('id')   &&
				storedUser.hasOwnProperty('type')
			);
			if(!isOfValidFormat) {
				localStorage.removeItem('user');
				localStorage.removeItem('token');
				return null;
			}
			return user.merge({
				id:       storedUser.id,
				type:     storedUser.type,
				access:   storedUser.access,
				username: storedUser.username || storedUser.name
			});
		}
		return null;
	},

	getToken() {
		return localStorage.getItem('token');
	},

	handlers: {
		[Action.User.Load](payload) {
			let user = {
				id:       payload.user.id,
				type:     payload.user.type,
				access:   payload.user.access,
				username: payload.user.username
			}
			localStorage.setItem('user', JSON.stringify(user));
		},

		[Action.User.Login](payload) {
			let user = {
				id:       payload.user.id,
				type:     payload.user.type,
				access:   payload.user.access,
				username: payload.user.username
			}
			localStorage.setItem('user',  JSON.stringify(user));
			localStorage.setItem('token', payload.token);
		},

		[Action.User.UpdateName](payload) {
			localStorage.setItem('user', JSON.stringify(payload.user));
		},

		[Action.User.UpdatePassword](payload) {
			localStorage.setItem('user', JSON.stringify(payload.user));
		},

		[Action.User.Logout]() {
			localStorage.removeItem('user');
			localStorage.removeItem('token');
		}
	}
});
