import api  from '../utils/api';
import flux from '../utils/flux';

import User            from '../models/user';
import Action          from '../actions';
import UserStore       from '../stores/user';
import Broadcast       from '../models/broadcast';
import BroadcastAction from '../actions/broadcast';

/**
 * NOTE Contrary to the other action creators, these methods tend to return
 *      Promises... This is something that should probably be redone, but it is
 *      what it is for now.
 */
export default flux.actionCreator({
	/**
	 *
	 */
	load() {
		return api.getUser({ token: UserStore.getToken() })
			.then((user) => {
				this.dispatch(Action.User.Load, { user });
				return Promise.resolve();
			})
			.catch((err) => {
				BroadcastAction.add(err, Action.User.Load);
				return Promise.reject();
			});
	},

	/**
	 *
	 */
	login(credentials, loginAsGuest = false) {
		let loginPromise = loginAsGuest
			? api.loginGuest({
				id: {
					code:  credentials.accessCode,
					board: credentials.boardID
				},
				payload: {
					username: credentials.username
				}
			})
			: api.login({ payload: credentials });
		if(UserStore.getUser() && UserStore.getToken()) {
			return page.redirect('/boards');
		}
		return loginPromise
			.then((response) => {
				this.dispatch(Action.User.Login, {
					user:  response.user,
					token: response.token
				});
				return Promise.resolve();
			})
			.catch((err) => {
				BroadcastAction.add(err, Action.User.Login);
				return Promise.reject();
			});
	},

	giveBoardAccess(boardId, accessCode) {
		let token = UserStore.getToken();
		return api.giveBoardAccess({ token: token, id: {
                                     board:    boardId,
                                     code: accessCode} })
			.then(() => {
				return Promise.resolve();
			})
			.catch((err) => {
				BroadcastAction.add(err, Action.User.GiveBoardAccess);
				return Promise.reject();
			});
	},

	/**
	 *
	 */
	logout() {
		let user  = UserStore.getUser();
		let token = UserStore.getToken();

		if(!token || !user || user.type === User.Type.Guest) {
			return new Promise((resolve) => {
				this.dispatch(Action.User.Logout);
				return resolve();
			});
		}
		return api.logout({ token })
			.then(() => {
				this.dispatch(Action.User.Logout);
				return Promise.resolve();
			})
			.catch((err) => {
				BroadcastAction.add(err, Action.User.Logout);
				return Promise.reject();
			});
	},

	/**
	 *
	 */
	register(credentials) {
		if(UserStore.getUser() && UserStore.getToken()) {
			return page.redirect('/boards');
		}
		return api.register({ payload: credentials })
			.then((user) => {
				this.dispatch(Action.User.Register, { user });
				return Promise.resolve();
			})
			.catch((err) => {
				BroadcastAction.add(err, Action.User.Register);
				return Promise.reject();
			});
	},

	/**
	 *
	 */
	updateUser(name, avatar) {
		let token = UserStore.getToken();

		return api.updateUser({ token: token, payload: { name: name, avatar: avatar }})
			.then((user) => {
				this.dispatch(Action.User.Update, { user });
				return Promise.resolve();
			})
			.catch((err) => {
				BroadcastAction.add(err, Action.User.Update);
				return Promise.reject();
			});
	},

	/**
	 *
	 */
	updatePassword(newPassword, oldPassword) {
		let token = UserStore.getToken();

		return api.updateUserPassword({ token: token, payload: { new_password: newPassword, old_password: oldPassword } })
			.then((user) => {
				this.dispatch(Action.User.Update, { user });
				return Promise.resolve();
			})
			.catch((err) => {
				BroadcastAction.add(err, Action.User.Update);
				return Promise.reject();
			});
	}
});
