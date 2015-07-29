import page            from 'page';
import Action          from '../../actions';
import UserAction      from '../../actions/user';
import BroadcastAction from '../../actions/broadcast';

import UserStore       from '../../stores/user';

const API_URL = process.env.API_URL || 'http://localhost:9002/api';
/**
 *
 */

export default
	{
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
					label:    'EMAIL',
					required: true
				},
				{
					name:     'passwordRegister',
					type:     'password',
					label:    'PASSWORD',
					title:    'Minimum of 8 characters required.',
					pattern:  '.{8,}',
					required: true
				},
				{
					name:     'passwordAgain',
					type:     'password',
					label:    'LOGIN_CONFIRMPASSWORD',
					title:    'LOGIN_PASSWORDLENGTH',
					pattern:  '.{8,}',
					required: true
				}
			],
			secondary: {
				submit: () => {
					return page.show('/login');
				},
				action:      'LOGIN_LOGIN',
				description: 'LOGIN_ALREADYREGISTERED'
			},
			submit: (state) => {
				return UserAction.register(state).then(() => {
					return UserAction.login(state).then(() => {
						BroadcastAction.add({
							type:    'broadcast',
							content: 'SUCCESS'
						});
						return page.show('/boards');
					});
				});
			},
			help:   'LOGIN_PASSWORDLENGTH',
			action: 'LOGIN_REGISTER'
		},
		loginForm: {
			fields: [
				{
					name:     'email',
					type:     'email',
					label:    'EMAIL',
					required: true
				},
				{
					name:     'password',
					type:     'password',
					label:    'PASSWORD',
					required: true
				}
			],
			secondary: {
				submit: () => {
					return page.show('/register');
				},
				action:      'LOGIN_REGISTER',
				description: 'LOGIN_NOTREGISTERED'
			},
			social: {
				header: 'LOGIN_LOGIN',
				subHeader: '',
				googleUrl: API_URL+'/auth/google/login',
				googleLogo: '/dist/assets/img/providers/google.png',
				facebookUrl: API_URL+'/auth/facebook/login',
				facebookLogo: '/dist/assets/img/providers/facebook.png'
			},
			submit: (state) => {
				return UserAction.login(state).then(() => {
					return page.show('/boards');
				});
			},
			action: 'LOGIN_LOGIN'
		},
	guestLoginForm: {
		fields: [
			{
				name:     'username',
				type:     'text',
				label:    'LOGIN_GUEST_USERNAME',
				title:    'LOGIN_GUEST_USERNAMELENGTH',
				pattern:  '[^-\\s]{3,}',
				required: true
			}
		],
		secondary: {
			submit: (formType, boardID, accessCode) => {
				if(UserStore.getToken()) {
					return UserAction.giveBoardAccess(boardID, accessCode).then(() => {
						return page.show(`/boards/${boardID}`);
					}, (err) => {console.log(err)});
				} else {
					return page.show(`/userlogin/boards/${boardID}/access/${accessCode}`);
				}
			},
			action:      'LOGIN_LOGIN',
			description: 'LOGIN_GUEST_GOTACCOUNT'
		},
		submit: (state, boardID, accessCode) => {
			let credentials = Object.assign(state, {
				boardID:    boardID,
				accessCode: accessCode
			});
			return UserAction.login(credentials, true).then(() => {
				return page.show(`/boards/${boardID}`);
			}, () => {});
		},
		action: 'LOGIN_GUEST_LOGINASGUEST'
	},
	userAccessForm: {
		fields: [
			{
				name:     'email',
				type:     'email',
				label:    'EMAIL',
				required: true
			},
			{
				name:     'password',
				type:     'password',
				label:    'PASSWORD',
				required: true
			}
		],
		social: {
				header: 'LOGIN_LOGIN',
				subHeader: '',
				googleUrl: API_URL+'/auth/google/login',
				googleLogo: '/dist/assets/img/providers/google.png',
				facebookUrl: API_URL+'/auth/facebook/login',
				facebookLogo: '/dist/assets/img/providers/facebook.png'
			},
		secondary: {
			submit: (formType, boardID, accessCode) => {
				localStorage.removeItem('share_board');
				localStorage.removeItem('share_accessCode');
				return page.show(`/boards/${boardID}/access/${accessCode}`);
			},
			action:      'LOGIN_GUEST_LOGINASGUEST',
			description: 'LOGIN_NOTREGISTERED'
		},
		submit: (state, boardID, accessCode) => {
			return UserAction.login(state).then(() => {
				return UserAction.giveBoardAccess(boardID, accessCode).then(() => {
					localStorage.removeItem('share_board');
					localStorage.removeItem('share_accessCode');
					return page.show(`/boards/${boardID}`);
				}, () => {});
			}, () => {
				return page.redirect(`/boards/${boardID}/access/${accessCode}`)
			});
		},
		action: 'LOGIN_LOGIN'
	}
	}
