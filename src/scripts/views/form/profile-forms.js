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
			'currentView',
			'avatar'
		],
		loginSettings: {
			title: 'PROFILE_CHANGEPASSWORD',
			fields: [
				{
					name:     'oldPassword',
					type:     'password',
					label:    'PROFILE_CURRENTPASSWORD',
					pattern:  '.{8,}',
					required: true
				},
				{
					name:     'newPassword',
					type:     'password',
					label:    'PROFILE_NEWPASSWORD',
					pattern:  '.{8,}',
					required: true
				},
				{
					name:     'newPasswordAgain',
					type:     'password',
					label:    'PROFILE_CONFIRMPASSWORD',
					pattern:  '.{8,}',
					required: true
				},
				{
					name:     'submitPassword',
					type:     'submit',
					className: 'btn-primary',
					action:    'PROFILE_SAVECHANGES'
				}
			],
			submit: (state) => {
				return UserAction.updatePassword(state.newPassword, state.oldPassword).then(() => {
					BroadcastAction.add({
						type:    'broadcast',
						content: 'SUCCESS'
					});
				}).catch(() => {});
			},
			action: 'Save changes'
		},
		profileSettings: {
			title: 'PROFILE_INFO',
			fields: [
				{
					name:     'avatar',
					type:     'avatar',
					title:    'PROFILE_YOURAVATAR',
					label:    'PROFILE_ENTERURL'
				},
				{
					type:     'email',
					title:    'PROFILE_YOURNAME'
				},
				{
					name:     'name',
					type:     'text',
					label:    'PROFILE_ENTERUSER'
				},
				{
					name:     'submitProfile',
					type:     'submit',
					className: 'btn-primary',
					action:    'PROFILE_SAVECHANGES'
				}
			],
			submit: (state) => {
				return UserAction.updateUser(state.name, state.avatar).then(() => {
					BroadcastAction.add({
						type:    'broadcast',
						content: 'SUCCESS'
					});
				}).catch(() => {});
			},
			action: 'PROFILE_SAVECHANGES'
		},
	linkItems: [
			{
				activeWhile: '',
				icon: 'arrow-left',
				name: 'PROFILE_WORKSPACE',
				onClick: () => {
					return page.show('/boards');
				}
			},
			{
				activeWhile: 'profileSettings',
				name: 'PROFILE_SETTINGS',
				onClick: () => {
					return page.show('/profile');
				}
			},
			{
				activeWhile: 'loginSettings',
				name: 'PROFILE_CHANGEPASSWORD',
				onClick: () => {
					return page.show('/profile/login');
				}
			}
	]
}
