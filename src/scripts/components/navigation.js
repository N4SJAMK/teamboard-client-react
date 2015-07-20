import page  	  from 'page';
import React 	  from 'react';
import classNames from 'classnames';

import Action          from '../actions';
import UserAction      from '../actions/user';
import SettingsAction  from '../actions/settings';
import BroadcastAction from '../actions/broadcast';

import UserStore    from '../stores/user';
import Avatar       from '../components/avatar';
import Dropdown     from '../components/dropdown';
import MemberDialog from '../components/dialog/board-members';

import UserVoice from '../components/user-voice';
import InfoView  from './dialog/view-info';
import AboutView from './dialog/view-about';

import Board from '../models/board';

import localeMixin from '../mixins/locale';

/**
 *
 */
export default React.createClass({
	mixins: [
		localeMixin()
	],

	propTypes: {
		title: React.PropTypes.string.isRequired,
		showHelp: React.PropTypes.bool,
		reviewActive: React.PropTypes.bool,
		killReview: React.PropTypes.func,
		board: (props) => {
			if(!props.board instanceof Board) throw new Error();
		}
	},

	getInitialState() {
		return {
			dropdown: false, localesDropdown: false,
			feedback: false, infoActive: false,
			aboutActive: false, membersActive: false
		}
	},

	showWorkspace() {
		return page.show('/boards');
	},

	toggleMembersDialog() {
		this.setState({ membersActive: !this.state.membersActive });
	},

	toggleDropdown() {
		this.setState({ dropdown: !this.state.dropdown });
		if(this.state.localesDropdown) {
			this.setState({ localesDropdown: !this.state.localesDropdown });
		}
	},

	toggleInfoView() {
		this.setState({ infoActive: !this.state.infoActive });
	},

	toggleAboutView() {
		this.setState({ aboutActive: !this.state.aboutActive });
	},

	CancelReview(){
		return !this.props.reviewActive ? null : (
			<div onClick={() => {
				this.props.killReview(false)
			}}
			className="review active">
				<span className="fa fa-fw fa-times"></span>
			</div>
		);
	},

	render() {
		let infoDialog = null;
		let aboutDialog = null;
		let infoIcon = null;

		if(!this.state.infoActive) {
			infoIcon = 'question';
			infoDialog = null;
		} else {
			infoIcon = 'times';
			infoDialog = <InfoView onDismiss = { this.toggleInfoView }  board={this.props.board}/>;
		}

		if(!this.state.aboutActive) {
			aboutDialog = null;
		} else {
			aboutDialog = <AboutView onDismiss = { this.toggleAboutView } />;
		}

		let infoButtonClass =
			classNames({
				infobutton: true,
				active: this.state.infoActive
			});

		let userButtonClass =
			classNames({
				'avatar-wrapper': true,
				active: this.state.dropdown
			});

		let membersButtonClass =
			classNames({
				members: true,
				active: this.state.membersActive
			});

		let boardMembersDialog = null;

		if (this.state.membersActive) {
			boardMembersDialog = <MemberDialog board={this.props.board} onDismiss={this.toggleMembersDialog}/>
		}

		let showBoardMembers = !this.props.showBoardMembers ? null : (
			<div id="members" onClick={this.toggleMembersDialog} className={membersButtonClass}>
				<span className="fa fa-fw fa-users">
					<span className="user-amount">
						{
							this.props.board.members.filter((member) => {
								return member.get('isActive');
							}).size
						}
					</span>
				</span>
			</div>
		);

		let showInfo = !this.props.showHelp ? null : (
			<div id="info" onClick={this.toggleInfoView} className={infoButtonClass}>
				<span className={`fa fa-fw fa-${infoIcon}`}></span>
			</div>
			);

		// If userstore is empty then go back to login
		if(!UserStore.getUser()) {
			page.redirect('/login');
		}

		let isProfileDisabled = UserStore.getUser().type === 'standard';
		let items = [
			{
				disabled: true,
				customclass: 'profile-name',
				content: `${this.locale('DROPDOWN_HELLO')}, ${UserStore.getUser().username}`
			},
			{
				icon: 'user',
				content: this.locale('DROPDOWN_PROFILE'),
				disabled: !isProfileDisabled,
				onClick: () => {
					if(isProfileDisabled) {
						return page.show('/profile');
					}
				}
			},
			{
				icon: 'language',
				content: this.locale('DROPDOWN_LOCALE'),
				onClick: () => {
					this.setState({ localesDropdown: !this.state.localesDropdown });
				}
			},
			{
				icon: 'bullhorn',
				nospan: true,
				content: (
					<UserVoice>
						{this.locale('DROPDOWN_FEEDBACK')}
					</UserVoice>
				)
			},
			{
				icon: 'info',
				content: this.locale('DROPDOWN_ABOUT'),
				onClick: () => {
					this.toggleAboutView();
				}
			},
			{
				icon: 'sign-out',
				content: this.locale('DROPDOWN_LOGOUT'),
				onClick: () => {
					UserAction.logout()
						.catch((err) => {
							BroadcastAction.add(err, Action.User.Logout);
						});
				}
			}
		];
		let locales = [
			{
				flag: 'gb',
				content: 'English',
				onClick: () => {
					SettingsAction.setSetting('locale', 'en');
					this.toggleDropdown();
				}
			},
			{
				flag: 'fi',
				content: 'Suomi',
				onClick: () => {
					SettingsAction.setSetting('locale', 'fi');
					this.toggleDropdown();
				}
			},
			{
				flag: 'se',
				content: 'Svenska',
				onClick: () => {
					SettingsAction.setSetting('locale', 'se');
					this.toggleDropdown();
				}
			},
			{
				flag: 'dk',
				content: 'Dansk',
				onClick: () => {
					SettingsAction.setSetting('locale', 'dk');
					this.toggleDropdown();
				}
			},
			{
				flag: 'jp',
				content: '日本語',
				onClick: () => {
					SettingsAction.setSetting('locale', 'jp');
					this.toggleDropdown();
				}
			}
		];

		let user      = UserStore.getUser();
		let name      = user.get('username');
		let avatarURL = user.get('avatar');
		let userType  = user.get('type');

		return (
			<nav id="nav" className="nav">
				<img className="logo" src="/dist/assets/img/logo.svg"
					onClick={this.showWorkspace} />
				<h1 className="title">{this.props.title}</h1>
				{this.CancelReview()}
				{showBoardMembers}
				{showInfo}
				<div id="avatar" onClick={this.toggleDropdown} className={userButtonClass}>
						<Avatar size={30} name={name}
								imageurl={avatarURL}
								isOnline={true}
								usertype={userType}>
						</Avatar>
				</div>
				<Dropdown className="options" show={this.state.dropdown} items={items} />
				<Dropdown className="locales" show={this.state.localesDropdown} items={locales} />
				{infoDialog}
				{boardMembersDialog}
				{aboutDialog}
			</nav>
		);
	}
});
