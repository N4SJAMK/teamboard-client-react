import page            from 'page';
import Action          from '../../actions';
import UserAction      from '../../actions/user';
import BroadcastAction from '../../actions/broadcast';

import UserStore       from '../../stores/user';

const API_URL = process.env.API_URL || 'http://localhost:9002/api';
/**
 *
 */

export default {
	stateVariables: [
		'email',
		'passwordRegister',
		'passwordAgain'
	],

	registerForm: {
		fields: [
			{
				name:     'email',
				type:     'email',
				label:    'Email',
				required: true
			},
			{
				name:     'passwordRegister',
				type:     'password',
				label:    'Password',
				title:    'Minimum of 8 characters required.',
				pattern:  '.{8,}',
				required: true
			},
			{
				name:     'passwordAgain',
				type:     'password',
				label:    'Confirm password',
				title:    'Minimum of 8 characters required.',
				pattern:  '.{8,}',
				required: true
			}
		],

		secondary: {
			submit: () => {
				return page.show('/login');
			},
			action:      'Login',
			description: 'Already registered?'
		},

		submit: (state) => {
			return UserAction.register(state).then(() => {
				return UserAction.login(state).then(() => {
					BroadcastAction.add({
						type:    'broadcast',
						content: 'Welcome!'
					});
					return page.show('/boards');
				});
			});
		},

		help:   'Passwords must be at least 8 characters long.',
		action: 'Register'
	},

	loginForm: {
		fields: [
			{
				name:     'email',
				type:     'email',
				label:    'Email',
				required: true
			},
			{
				name:     'password',
				type:     'password',
				label:    'Password',
				required: true
			}
		],

		secondary: {
			submit: () => {
				return page.show('/register');
			},
			action:      'Register',
			description: 'Not registered?'
		},

		social: {
			header: 'Login',
			subHeader: 'or',
			googleUrl: API_URL+'/auth/google/login',
			googleLogo: '/dist/assets/img/providers/google.png'
		},

		submit: (state) => {
			return UserAction.login(state)
				.then(() => page.show('/boards'));
		},

		action: 'Login'
	},

	guestLoginForm: {
		fields: [
			{
				name:     'username',
				type:     'text',
				label:    'Username',
				title:    'Username must be at least 3 characters.',
				pattern:  '.{3,}',
				required: true
			}
		],

		secondary: {
			submit: (formType, boardID, accessCode) => {
				if(UserStore.getToken()) {
					return UserAction.giveBoardAccess(boardID, accessCode)
						.then(() => page.show(`/boards/${boardID}`));
				}
				return page.show(
					`/userlogin/boards/${boardID}/access/${accessCode}`);
			},
			action:      'Log in',
			description: 'Got an account?'
		},

		submit: (state, boardID, accessCode) => {
			let credentials = Object.assign(state, {
				boardID:    boardID,
				accessCode: accessCode
			});
			return UserAction.login(credentials, true)
				.then(() => page.show(`/boards/${boardID}`));
		},

		action: 'Login as Guest'
	},

	userAccessForm: {
		fields: [
			{
				name:     'email',
				type:     'email',
				label:    'Email',
				required: true
			},
			{
				name:     'password',
				type:     'password',
				label:    'Password',
				required: true
			}
		],

		social: {
			header: 'Login',
			subHeader: 'or',
			googleUrl: API_URL+'/auth/google/login',
			googleLogo: '/dist/assets/img/providers/google.png'
		},

		secondary: {
			submit: (formType, boardID, accessCode) => {
				localStorage.removeItem('share_board');
				localStorage.removeItem('share_accessCode');
				return page.show(`/boards/${boardID}/access/${accessCode}`);
			},
			action:      'Guest login',
			description: 'No account?'
		},

		submit: (state, boardID, accessCode) => {
			return UserAction.login(state).then(() => {
				return UserAction.giveBoardAccess(boardID, accessCode)
					.then(() => {
						localStorage.removeItem('share_board');
						localStorage.removeItem('share_accessCode');
						return page.show(`/boards/${boardID}`);
					});
			}, () => page.redirect(`/boards/${boardID}/access/${accessCode}`));

		},

		action: 'Login'
	}
}
