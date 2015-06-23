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
			'name'
		],
		loginSettings: {
			title: 'Change password',
			fields: [
				{
					name:     'oldPassword',
					type:     'password',
					label:    'Enter current password',
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
					action:    'Update Password'
				}
			],
			submit: (state) => {
				return UserAction.updatePassword(state.newPassword, state.oldPassword).then(() => {
					BroadcastAction.add({
						type:    'broadcast',
						content: 'Success!'
					});
				}).catch(() => {});
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
				return UserAction.updateName(state.name).then(() => {
					BroadcastAction.add({
						type:    'broadcast',
						content: 'Success!'
					});
				}).catch(() => {});
			},
			action: 'Save changes'
		},
	linkItems: [
			{
				activeWhile: '',
				icon: 'arrow-left',
				name: 'Workspace',
				onClick: () => {
					return page.show('/boards');
				}
			},
			{
				activeWhile: 'profileSettings',
				name: 'Profile settings',
				onClick: () => {
					return page.show('/profile');
				}
			},
			{
				activeWhile: 'loginSettings',
				name: 'Password',
				onClick: () => {
					return page.show('/profile/login');
				}
			}
	]
}