import page            from 'page';
import React           from 'react';
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
					title:    'LOGIN_PASSWORDLENGTH',
					pattern:  '.{8,}',
					required: true
				},
				{
					name:     'passwordAgain',
					type:     'password',
					label:    'PROFILE_CONFPW',
					title:    'LOGIN_PASSWORDLENGTH',
					pattern:  '.{8,}',
					required: true
				}
			],
			buttons: [
				{
					type: 'primary',
					text: 'LOGIN_REGISTER',
					action: (state, props) => {
						if(state.passwordRegister == state.passwordAgain) {
							return UserAction.register(state).then(() => {
								return UserAction.login(state).then(() => {
									BroadcastAction.add({
										type:    'broadcast',
										content: state.locale.SUCCESS
									});
									return page.show('/boards');
								});
							});
						}

						BroadcastAction.add({
							type:    'Error',
							content: 'PASSWORDMISMATCH'
						});
						return event.preventDefault();
					}
				},
				{
					type: 'secondary',
					text: 'LOGIN_LOGIN',
					description: 'LOGIN_ALREADYREGISTERED',
					action: () => {
						return page.show('/login');
					}
				}
			],
			onEachFrame: (state, props) => {
				if(state.passwordAgain === '' && state.passwordRegister === '') {
					return <span></span>;
				}

				return state.passwordAgain !== state.passwordRegister ?
					<span className="fa fa-times mismatch">{state.locale.PASSWORDMATCH}</span>
					: <span className="fa fa-check match">{state.locale.PASSWORDMISMATCH}</span>;
			}
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
			buttons: [
				{
					type: 'primary',
					text: 'LOGIN_LOGIN',
					action: (state, props) => {
						return UserAction.login(state).then(() => {
							return page.show('/boards');
						});
					}
				},
				{
					type: 'secondary',
					text: 'LOGIN_REGISTER',
					description: 'LOGIN_NOTREGISTERED',
					action: () => {
						return page.show('/register');
					}
				},
			],
			socials: [
				{
					header: 'Google',
					url: API_URL + '/auth/google/login',
					logo: '/dist/assets/img/providers/google.png'
				}
			]
		},
	guestLoginForm: {
		fields: [
			{
				name:     'username',
				type:     'text',
				label:    'LOGIN_GUEST_USERNAME',
				title:    'LOGIN_GUEST_USERNAMELENGTH',
				pattern:  '.{3,}',
				required: true
			}
		],
		buttons: [
			{
				type: 'primary',
				text: 'LOGIN_GUEST_LOGINASGUEST',
				action: (state, props) => {
					let credentials = Object.assign(state, {
						boardID:    props.boardID,
						accessCode: props.accessCode
					});
					return UserAction.login(credentials, true).then(() => {
						return page.show(`/boards/${boardID}`);
					}, (err) => {});
				}
			},
			{
				type: 'secondary',
				text: 'LOGIN_REGISTER',
				description: 'LOGIN_NOTREGISTERED',
				action: (state, props) => {
					if(UserStore.getToken()) {
						return UserAction.giveBoardAccess(props.boardID, props.accessCode).then(() => {
							return page.show(`/boards/${boardID}`);
						}, (err) => {console.log(err)});
					}
					else {
						return page.show(`/userlogin/boards/${boardID}/access/${accessCode}`);
					}
				}
			}
		]
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
		buttons: [
			{
				type: 'primary',
				text: 'LOGIN_LOGIN',
				action: (state, boardID, accessCode) => {
					return UserAction.login(state).then(() => {
						return UserAction.giveBoardAccess(boardID, accessCode).then(() => {
							localStorage.removeItem('share_board');
							localStorage.removeItem('share_accessCode');
							return page.show(`/boards/${boardID}`);
						}, (err) => {console.log(err)});
					}, (err) => {
						return page.redirect(`/boards/${boardID}/access/${accessCode}`)
					});
				}
			}
		],
		socials: [
			{
				header: 'Google',
				url: API_URL + '/auth/google/login',
				logo: '/dist/assets/img/providers/google.png'
			}
		]
	}
}
