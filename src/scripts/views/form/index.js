import page  from 'page';
import React from 'react';

import Broadcaster     from '../../components/broadcaster';
import FormData        from '../../views/form/form-map';
import BroadcastAction from '../../actions/broadcast';

/**
 *
 */

export default React.createClass({
	mixins: [ React.addons.LinkedStateMixin ],
	propTypes: {
		formProfile: React.PropTypes.string.isRequired,
		boardID: React.PropTypes.string,
		accessCode: React.PropTypes.string
	},

	getInitialState() {
		return FormData.stateVariables.reduce((state, variable) => {
			state[variable] = '';
			return state;
		}, {});
	},

	checkPasswords(){
		if(this.props.formProfile === 'registerForm' && this.state.passwordAgain.length > 7) {
			return this.state.passwordAgain !== this.state.passwordRegister ?
				<span className="fa fa-times mismatch">Password mismatch!</span>
				: <span className="fa fa-check match">Passwords match!</span>;
		}
	},

	renderFields(fields) {
		return fields.map((field, index) => {
			let controlattrs = {
				title:    field.title,
				pattern:  field.pattern,
				required: field.required
			}
			return (
				<section key={field.name} className="input">
					<label htmlFor={field.name}>{field.label}</label>
					<input autoFocus={index === 0} name={field.name}
						type={field.type} {...controlattrs}
						valueLink={this.linkState(field.name)} />
				</section>
			);
		});
	},
	//submit will execute in all cases other than when
	//passwords given in registration do not match
	submitPrimary(currentForm) {
		if(this.props.formProfile !== 'registerForm' ||
			this.state.passwordAgain === this.state.passwordRegister) {
			return (event) => {
				if(this.props.formProfile === 'registerForm')
					this.state.password = this.state.passwordRegister;
				currentForm.submit(this.state);
				return event.preventDefault();
			}
		}
		else return (event) => {
			BroadcastAction.add({
				type:    'Error',
				content: 'Passwords entered do not match!'
			});
			return event.preventDefault();
		}
	},

	submitSecondary(currentForm) {
		return (event) => {
			if (this.props.formProfile !== 'guestLoginForm') {
				currentForm.secondary.submit(this.state, this.props.boardID, this.props.accessCode);
			}
			else {
				currentForm.secondary.submit(this.state, this.props.boardID, this.props.accessCode);
			}
			return event.preventDefault();
		}
	},

	submitGuest(currentForm, accessCode, boardID){
		return (event) => {
			currentForm.submit(this.state, boardID, accessCode);
			return event.preventDefault();
		}
	},
	renderForm(formType) {
		let secondaryContent = !formType.secondary ? null : (
			<section className="secondary">
				<p>{formType.secondary.description}</p>
				<button className="btn-secondary"
						onClick={this.submitSecondary(formType, this.props.boardID,
							this.props.accessCode)}>
					{formType.secondary.action}
				</button>
			</section>
		);
		let socialLogin = !formType.social ? null : (
			<div>
				<section className="social">
					<h2>{formType.social.header}</h2>
					<a className="provider" href={formType.social.facebookUrl}>
						<img className="provider" src={formType.social.facebookLogo} />
					</a>
					<a className="provider" href={formType.social.googleUrl}>
						<img className="provider" src={formType.social.googleLogo} />
					</a>
				</section>
				<p className="basic-login">{formType.social.subHeader}</p>
			</div>
		);
		let primarySubmit = this.props.formProfile !== 'guestLoginForm' && this.props.formProfile !== 'userAccessForm' ?
			this.submitPrimary(formType) :
			this.submitGuest(formType, this.props.accessCode, this.props.boardID)
		return (
			<div className="view view-form">
				<Broadcaster />
				<div className="content">
					<form className="form"
						onSubmit={primarySubmit}>
						<div className="logo">
							<img src="/dist/assets/img/logo.svg" />
							<h1>Contriboard</h1>
						</div>
						{socialLogin}
						{this.renderFields(formType.fields)}
						{this.checkPasswords()}
						<input type="submit" className="btn-primary"
							value={formType.action} />
						<article className="help">{formType.help}</article>
						<section className="secondary-content">
							{secondaryContent}
						</section>
					</form>
				</div>
			</div>
		);
	},

	render() {
		return this.renderForm(FormData[this.props.formProfile]);
	}
});
