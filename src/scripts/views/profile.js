import React           from 'react';
import UserStore       from '../stores/user';
import Avatar          from '../components/avatar';
import Navigation      from '../components/navigation';
import Broadcaster     from '../components/broadcaster';
import ProfileForms    from '../views/form/profile-forms';
import BroadcastAction from '../actions/broadcast';
import localeMixin     from '../mixins/locale';
/**
 *
 */

export default React.createClass({
	mixins: [
		React.addons.LinkedStateMixin,
		localeMixin()
	],

	propTypes: {
		formProfile: React.PropTypes.string.isRequired
	},
	getInitialState() {
		return 	ProfileForms.fieldNames.reduce((state, field) => {
				state[field] = field !== 'avatar' ?
					'' : UserStore.getUser().avatar;
					return state;
				}, {});
	},

	getFieldType(field, index, controlattrs) {
		let userNameContent = this.state.name === '' || !this.state.name ?
			UserStore.getUser().username :
			this.state.name;

		switch(field.type){
			case 'submit': return (
					<input name={field.name} type={"submit"} {...controlattrs}></input>
				);
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
					<h4>{this.locale(field.title)}</h4>
					<p>{userNameContent}</p>
				</section>
			);
			case 'avatar': return (
				<section>
					<h4>{this.locale(field.title)}</h4>
					<div className="avatar-wrapper">
						<Avatar size={64} name={userNameContent}
								imageurl={this.state.avatar}
								isOnline={true}>
						</Avatar>
					</div>
					<label htmlFor={field.label}>{this.locale(field.label)}</label>
					<input autoFocus={index === 0} type={field.type}
						{...controlattrs} valueLink={this.linkState(field.name)} />
				</section>
			);
		}
	},

	checkPasswords(){
		if(this.props.formProfile === 'loginSettings' &&
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

	toggleNav() {
		document.getElementById("menu").classList.toggle('active');
	},

	renderSidelinks() {
		return ProfileForms.linkItems.map((field) => {
			let provider = localStorage.getItem('provider');
			if(provider !== null && field.activeWhile !== 'loginSettings' || provider === null) {
				let className = field.activeWhile === this.props.formProfile ? 'active' : null;
				return (
					<li id={field.name} className={className}>
						<p  onClick={field.onClick}>
						<span className={`fa fa-${field.icon}`}></span>
						{this.locale(field.name)}
						</p>
					</li>
				);
			}
		});
	},

	renderForm(formType){
		return (
			<div className="view-settings">
				<Navigation showHelp={false} title="Contriboard" />
				<Broadcaster />
				<div className="content-settings">
					<div className="settings-nav">
						<div className="menu-div" onClick={this.toggleNav}>
							<span className="menu-link fa fa-bars" />
						</div>
						<nav id="menu" className="navigation">
							<ul>
								{this.renderSidelinks()}
							</ul>
						</nav>
					</div>
					<div className="form-container">
						<form className="login-info"
							onSubmit={this.submitPrimary(formType)}>
							<h3>{this.locale(formType.title)}</h3>
							{this.renderFields(formType.fields)}
							<article className="help">{formType.help}</article>
							<section className="secondary-content">
								{this.checkPasswords()}
							</section>
						</form>
					</div>
				</div>
			</div>
		);
	},

	render() {
		return this.renderForm(ProfileForms[this.props.formProfile])
	}
});
