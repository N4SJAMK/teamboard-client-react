import React           from 'react';
import classNames      from 'classnames';

import UserStore       from '../../stores/user';

import Avatar          from '../avatar';
import Broadcaster     from '../broadcaster';
import ProfileForms    from '../../views/form/profile-forms';

import BroadcastAction from '../../actions/broadcast';

import localeMixin     from '../../mixins/locale';
import Dialog          from '../../components/dialog';
/**
 *
 */

export default React.createClass({
	mixins: [
		React.addons.LinkedStateMixin,
		localeMixin()
	],

	propTypes: {
		formProfile: React.PropTypes.string.isRequired,
		onDismiss: React.PropTypes.func.isRequired
	},
	getInitialState() {
		console.log(UserStore.getUser());

		return	ProfileForms.fieldNames.reduce((state, field) => {
			state[field] = field === 'avatar' ?
				UserStore.getUser().avatar : field === 'currentView' ?
				'profileSettings' : '';
				return state;
		}, {});
	},

	changeView(view) {
		let newView = ProfileForms.linkItems[view].activeWhile;
		this.setState({ currentView: newView });
	},

	getFieldType(field, index, controlattrs) {
		let userNameContent = this.state.name === '' || !this.state.name ?
			UserStore.getUser().name :
			this.state.name;

		switch(field.type){
			case 'text':
			case 'password':
			case 'file': return (
				<section key={index} className="input">
					<label htmlFor={field.name}>{this.locale(field.label)}</label>
					<input autoFocus={index === 0} name={field.name}
					type={field.type} {...controlattrs}
					valueLink={this.linkState(field.name)} />
				</section>
			);
			case 'email': return (
				<section key={index} className="input">
					<p>{userNameContent}</p>
				</section>
			);
			case 'avatar': return (
				<section>
					<div className="avatar-wrapper">
						<Avatar size={64} name={userNameContent}
								usertype={UserStore.getUser().type}
								imageurl={this.state.avatar}
								isOnline={true}>
						</Avatar>
						<h4>{userNameContent}</h4>
					</div>
				</section>
			);
		}
	},

	checkPasswords(){
		if(this.state.currentView === 'loginSettings' &&
			this.state.newPasswordAgain.length > 7) {
			return this.state.newPasswordAgain !== this.state.newPassword ?
				<span className="fa fa-times mismatch">{this.locale('PASSWORDMISMATCH')}</span>
				: <span className="fa fa-check match">{this.locale('PASSWORDMATCH')}</span>;
		}
	},

	renderFields(fields) {
		return fields.map((field, index) => {
			let controlattrs = {
				title:     field.title,
				pattern:   field.pattern,
				required:  field.required,
				className: field.className,
				value:     this.locale(field.action),
				onChange:  field.onChange
			}
			return (
				this.getFieldType(field, index, controlattrs)
			);
		});
	},

	close(event) {
		event.preventDefault();
		return this.props.onDismiss();
	},

	//submit will execute in all cases other than when
	//passwords given do not match
	submitPrimary(currentForm) {
		if(this.props.formProfile !== 'loginSettings' ||
			this.state.newPasswordAgain === this.state.newPassword) {
			return (event) => {
				currentForm.submit(this.state);
				return event.preventDefault();
			}
		} else {
			return (event) => {
				BroadcastAction.add({
					type:    'Error',
					content: this.locale('PASSWORDMISMATCH')
				});
				return event.preventDefault();
			}
		}
	},

	renderSidelinks() {
		return ProfileForms.linkItems.map((field, i) => {
			let provider = localStorage.getItem('provider');
			let userType = UserStore.getUser().type;
			if(
				(provider || userType !== 'standard') &&
 				field.activeWhile !== 'loginSettings' ||
				(!provider && userType === 'standard')
			) {
				let className =
					classNames(
						field.className,
						{ active: field.activeWhile === this.state.currentView }
					);
				let onClick = field.onClick ? field.onClick.bind(this, this.props) : this.changeView.bind(this, i);

				return (
					<li id={field.name} key={i} className={className}>
						<p  onClick={onClick}>
						<span className={`fa fa-${field.icon}`}></span>
						{this.locale(field.name)}
						</p>
					</li>
				);
			}
		});
	},

	renderForm(){
		return [ 'profileSettings', 'loginSettings' ].map((type) => {

			let profileFormType = ProfileForms[type];
			let className =
				classNames(
					'login-info',
					{ hidden: type !== this.state.currentView }
				);

			return (
				<form className={className}
						onSubmit={this.submitPrimary(profileFormType)}>
					{this.renderFields(profileFormType.fields)}
					<section className="secondary-content">
						{this.checkPasswords()}
					</section>
					<input name="submitPassword" type="submit" className="btn-primary" value={this.locale('PROFILE_SAVECHANGES')} />
				</form>
			);

		});
	},

	render() {
		return (
			<Dialog viewProfile="profile" onDismiss={this.props.onDismiss}>
				<Broadcaster />
				<div className="form-container dialog">
					{this.renderSidelinks()}
					{this.renderForm()}
				</div>
			</Dialog>
			);
	}
});
