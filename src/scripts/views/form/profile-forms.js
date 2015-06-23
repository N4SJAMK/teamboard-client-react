import page            from 'page';
import UserAction      from '../../actions/user';
import BroadcastAction from '../../actions/broadcast';
/*
 *
 */

export default {
		fieldNames: [
			'oldPassword',
			'newPassword',
			'newPasswordAgain',
			'name',
			'currentView'
		],
		loginSettings: {
			title: 'Login information',
			fields: [
				{
					name:     'oldPassword',
					type:     'password',
					label:    'Enter your old password',
					pattern:  '.{8,}',
					required: true
				},
				{
					name:     'newPassword',
					type:     'password',
					label:    'Enter a new password',
					pattern:  '.{8,}',
					required: true
				},
				{
					name:     'newPasswordAgain',
					type:     'password',
					label:    'Confirm new password',
					pattern:  '.{8,}',
					required: true
				},
				{
					name:     'submitPassword',
					type:     'submit',
					className: 'btn-primary',
					action:    'Change Password'
				}
			],
			submit: (state) => {
				return UserAction.updatePassword(state.newPassword, state.oldPassword)
			},
			action: 'Save changes'
		},
		profileSettings: {
			title: 'Profile information',
			fields: [
				{
					name:     'name',
					type:     'text',
					label:    'Enter a username',
					required: true
				},
				{
					type:     'email',
					title:    'Your username:'
				},
				{
					name:     'submitProfile',
					type:     'submit',
					className: 'btn-primary',
					action:    'Modify Profile'
				}
			],
			submit: (state) => {
				return UserAction.updateName(state.name)
			},
			action: 'Save changes'
		},
	linkItems: [
			{
				class: 'profileSettings',
				name: 'Change your account information',
				onClick: () => {
					return page.show('/profile');
				}
			},
			{
				class: 'loginSettings',
				name: 'Change your login settings',
				onClick: () => {
					return page.show('/profile/login');
				}
			}
	]
}