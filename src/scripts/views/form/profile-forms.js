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
					view: 'profileSettings'
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
					name:     'avatarImage',
					type:     'avatar'
				},
				{
					name:     'avatar',
					type:     'text',
					label:    'PROFILE_ENTERURL'
				},
				{
					name:     'name',
					type:     'text',
					label:    'PROFILE_ENTERUSER'
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
				activeWhile: 'profileSettings',
				name: 'PROFILE_SETTINGS',
				className:  'link-profile'
			},
			{
				activeWhile: 'loginSettings',
				name: 'PROFILE_CHANGEPASSWORD',
				className:  'link-password'
			},
			{
				onClick: (props)=> {
					return props.onDismiss();
				},
				icon: 		'times',
				className:  'link-exit'
			}
	]
}
