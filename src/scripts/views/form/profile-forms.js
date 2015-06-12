import page            from 'page';
import UserAction      from '../../actions/user';
import BroadcastAction from '../../actions/broadcast';

/*
 *
 */

export default {
		fieldNames: [
			'oldEmail',
			'newEmail',
			'oldPassword',
			'newPassword',
			'name',
			'uploadfile'
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
					name:     'submitPassword',
					type:     'submit',
					className: 'btn-primary',
					action:    'Change Password'
				}
			],
			submit: (state) => {
				return UserAction.updatePassword(state.newPassword, state.oldPassword).then(() => {
					BroadcastAction.add({
						type:    'broadcast',
						content: 'Successfully updated account information'
					});
				});
			},
			action: 'Save changes'
		},
		profileSettings: {
			title: 'Profile information',
			fields: [
				{
					name:     'name',
					type:     'text',
					label:    'name',
					required: true
				},
				{
					name:     'newEmail',
					type:     'email',
					label:    'Enter a new Email',
					required: true
				},
				{
					name:     'submitProfile',
					type:     'submit',
					className: 'btn-primary',
					action:    'Modify Profile'
				}
			],
			submit: (state) => {
				return UserAction.updateName(state.name, state.newEmail).then(() => {
					BroadcastAction.add({
						type:    'broadcast',
						content: 'Successfully updated account information'
					});
				});
			},
			action: 'Save changes'
		},
	linkItems: [
			{
				name: 'Change your account information',
				onClick: () => {
					return page.show('/profile');
				}
			},
			{
				name: 'Change your login settings',
				onClick: () => {
					return page.show('/profile/login');
				}
			}
	]
}