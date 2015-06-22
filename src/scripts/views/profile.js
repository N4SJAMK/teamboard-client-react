import React      from 'react';
import UserStore  from '../stores/user';
import Navigation   from '../components/navigation';
import Broadcaster  from '../components/broadcaster';
import ProfileForms from '../views/form/profile-forms';

/**
 *
 */

export default React.createClass({
	mixins: [ React.addons.LinkedStateMixin ],
	propTypes: {
		formProfile: React.PropTypes.string.isRequired
	},
	getInitialState() {
		return 	ProfileForms.fieldNames.reduce((state, field) => {
					state[field] = '';
					return state;
				}, {});
	},

	getFieldType(field, index, controlattrs) {
		let userNameContent = this.state.name === '' || !this.state.name ?
		UserStore.getUser().username :
		this.state.name;
		switch(field.type){
			case 'submit': return (
					<input name={field.name} type='submit'
					value={field.action} {...controlattrs} />
				);
			case 'text':
			case 'password':
			case 'file': return (
					<input autoFocus={index === 0} name={field.name}
					type={field.type} {...controlattrs}
					valueLink={this.linkState(field.name)} />
				);
			case 'email': return (
				<section>
				<h4>{field.title}</h4>
				<p>{userNameContent}</p>
				</section>
			);
		}
	},

	checkPasswords(){
		if(this.props.formProfile === 'loginSettings' &&
			this.state.newPasswordAgain.length > 7) {
			return this.state.newPasswordAgain !== this.state.newPassword ?
				<span className="fa fa-times mismatch">Password mismatch!</span>
				: <span className="fa fa-check match">Passwords match!</span>;
		}
	},

	renderFields(fields) {
		return fields.map((field, index) => {
			let controlattrs = {
				title:     field.title,
				pattern:   field.pattern,
				required:  field.required,
				className: field.className,
				value:     field.buttonaction,
				onChange:  field.onChange
			}
			return (
				<section key={field.name} className="input">
					<label htmlFor={field.name}>{field.label}</label>
					{this.getFieldType(field, index, controlattrs)}
				</section>
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
		}
		else return (event) => {
			BroadcastAction.add({
				type:    'Error',
				content: 'Password mismatch!'
			});
			return event.preventDefault();
		}
	},

	toggleNav() {
		document.getElementById("menu").classList.toggle('active');
	},

	renderSidelinks() {
		return ProfileForms.linkItems.map((field, index) => {
			let className = field.activeWhile === this.props.formProfile ? 'active' : null;
			return (
				<li className={className}>
					<p  onClick={field.onClick}>
					<span className={`fa fa-${field.icon}`}></span>
					{field.name}
					</p>
				</li>
			);
		});
	},

	renderForm(formType){
		return (
			<div className="view-settings">
				<Navigation showHelp={false} title="Contriboard" />
				<Broadcaster />
				<div className="content-settings">
					<div className="settings-nav">
						<span className="menu-link fa fa-bars" onClick={this.toggleNav} />
						<nav id="menu" className="navigation">
							<ul>
								{this.renderSidelinks()}
							</ul>
						</nav>
					</div>
					<div className="form-container">
						<form className="login-info"
							onSubmit={this.submitPrimary(formType)}>
							<h3>{formType.title}</h3>
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
