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
		return FormData.fieldNames.reduce((state, field) => {
			state[field] = '';
			return state;
		}, {});
	},

	checkPasswords(){
		if(this.props.formProfile === 'registerForm' &&
			this.state.passwordAgain.length > 7) {
			return this.state.passwordAgain !== this.state.passwordRegister
				? <span className="fa fa-times mismatch">Password mismatch!</span>
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
	//passwords given in registration do not match.
	submitPrimary(currentForm, ...rest) {
		if(this.props.formProfile !== 'registerForm' ||
			this.state.passwordAgain === this.state.passwordRegister) {
		let fields = currentForm.fields.reduce((fields, field) => {
			fields[field.name] = this.state[field.name];
			return fields;
		}, {});
			return (event) => {
				if(this.props.formProfile === 'registerForm')
					fields.password = fields.passwordRegister;
					let submitParams = [ fields ].concat(rest);
					currentForm.submit.apply(null, submitParams);
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

	renderForm(formType) {
		let width = {width: 40};
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
		return (
			<div className="view view-form">
				<Broadcaster />
				<div className="content">
					<form className="form"
						onSubmit={this.submitPrimary(formType, this.props.boardID,
							this.props.accessCode)}>
						<div className="logo">
							<img src="/dist/assets/img/logo.svg" />
							<h1>Contriboard</h1>
						</div>
						{this.renderFields(formType.fields)}
						{this.checkPasswords()}
						<input type="submit" className="btn-primary"
							value={formType.action} />
						<a style={border} href="https://localhost:9002/api/auth/google/login">
							<img style={width} src="/src/assets/img/providers/google.png" />
						</a>
						<a style={border} href="http://localhost:9002/api/auth/github/login">
							<img style={width} src="/src/assets/img/providers/google.png" />
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
