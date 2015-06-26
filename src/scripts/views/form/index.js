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
		return FormData.registerForm.fields.reduce((state, field) => {
			state[field.name] = '';
			return state;
		}, {});
	},

	checkPasswords(){
		if(this.props.formProfile === 'registerForm' && this.state.passwordAgain !== '') {
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
			currentForm.secondary.submit(this.state);
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
		let width = {width: 32};
		let border = {border: 0};
		let secondaryContent = !formType.secondary ? null : (
			<section className="secondary">
				<p>{formType.secondary.description}</p>
				<button className="btn-secondary"
						onClick={this.submitSecondary(formType)}>
					{formType.secondary.action}
				</button>
			</section>
		);
		let primarySubmit = this.props.formProfile !== 'guestLoginForm' ?
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
						{this.renderFields(formType.fields)}
						{this.checkPasswords()}
						<input type="submit" className="btn-primary"
							value={formType.action} />
						<a style={border} href="http://localhost:9002/api/auth/google/login">
							<img style={width} src="/src/assets/img/providers/google.png" />
						</a>
						<a style={border} href="http://localhost:9002/api/auth/github/login">
							<img style={width} src="/src/assets/img/providers/github.png" />
						</a>
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
