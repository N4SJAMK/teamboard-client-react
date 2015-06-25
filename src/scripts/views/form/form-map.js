import page            from 'page';
import Action          from '../../actions';
import UserAction      from '../../actions/user';
import BroadcastAction from '../../actions/broadcast';

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
			submit: (state) => {
				return UserAction.login(state).then(() => {
					return page.show('/boards');
				});
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
			submit: (state, boardID, accessCode) => {
				let credentials = Object.assign(state, {
					boardID:    boardID,
					accessCode: accessCode
				});
				return UserAction.login(credentials, true).then(() => {
					return page.show(`/boards/${boardID}`);
				});
			},
			action: 'Login as Guest'
		}
	}
