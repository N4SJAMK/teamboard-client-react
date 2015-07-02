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
			buttons: [
				{
					type: 'primary',
					text: 'Register',
					action: (state, props, event) => {
						if(state.passwordRegister == state.passwordAgain) {
							return UserAction.register(state).then(() => {
								return UserAction.login(state).then(() => {
									BroadcastAction.add({
										type:    'broadcast',
										content: 'Welcome!'
									});
									return page.show('/boards');
								});
							});
						}

						BroadcastAction.add({
							type:    'Error',
							content: 'Passwords entered do not match!'
						});
						return event.preventDefault();
					}
				},
				{
					type: 'secondary',
					text: 'Login',
					description: 'Already registered?',
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
					<span className="fa fa-times mismatch">Password mismatch!</span>
					: <span className="fa fa-check match">Passwords match!</span>;
			}
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
			buttons: [
				{
					type: 'primary',
					text: 'Login',
					action: (state, props, event) => {
						return UserAction.login(state).then(() => {
							return page.show('/boards');
						});
					}
				},
				{
					type: 'secondary',
					text: 'Register',
					description: 'Not registered?',
					action: () => {
						return page.show('/register');
					}
				}
			],
			socials: [
				{
					header: 'Google',
					googleUrl: API_URL + '/auth/google/login',
					googleLogo: '/src/assets/img/providers/google.png'
				}
			],
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
		buttons: [
			{
				type: 'primary',
				text: 'Login as Guest',
				action: (state, props, event) => {
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
				text: 'Register/Login',
				description: 'Got an account?',
				action: (state, props, event) => {
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
		buttons: [
			{
				type: 'primary',
				text: 'Login',
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
		]
	}
}
