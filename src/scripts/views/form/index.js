import page  from 'page';
import React from 'react';

import Broadcaster     from '../../components/broadcaster';
import FormData        from '../../views/form/form-map';
import BroadcastAction from '../../actions/broadcast';
import settingsMixin   from '../../mixins/settings';
/**
 *
 */

export default React.createClass({
	mixins: [ React.addons.LinkedStateMixin, settingsMixin() ],
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

	submitButton(button) {
		button.action(this.state, this.props)
	},

	renderSocials(socials) {
		if(!socials) {
			return (<section></section>);
		}

		return socials.map((social, index) => {
			return(
				<section key={social.header}>
					<section className='social'>
						<a className='provider' href={social.url}>
							<img name={social.header} className='provider' src={social.logo} />
						</a>
					</section>
				</section>
			);
		});
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
					<label htmlFor={field.name}>{this.state.locale[field.label]}</label>
					<input autoFocus={index === 0} name={field.name}
						type={field.type} {...controlattrs}
						valueLink={this.linkState(field.name)} />
				</section>
			);
		});
	},

	renderPrimaryButtons(buttons) {
		return buttons.map((button, index) => {
			let submit = this.submitButton.bind(this, button);
			if(button.type === 'primary') {
				return (
					<button className="btn-primary"
						    onClick={submit} key={button.text}>
						{this.state.locale[button.text]}
					</button>
				);
			}
		});
	},

	renderSecondaryButtons(buttons) {
		return buttons.map((button, index) => {
			let submit = this.submitButton.bind(this, button);
			if(button.type === 'secondary') {
				return (
					<section key={index} className="secondary">
						<p>{this.state.locale[button.description]}</p>
						<button className="btn-secondary"
								onClick={submit} >
							{this.state.locale[button.text]}
						</button>
					</section>
				);
			}
		});
	},

	onEachFrameHandler(formType) {
		if(formType.onEachFrame) {
			return formType.onEachFrame(this.state);
		}
		return (<span></span>);
	},


	render() {
		let formType = FormData[this.props.formProfile];
		return (
			<div className="view view-form">
				<Broadcaster />
				<div className="content">
					<div className="form">
						<div className="logo">
							<img src="/dist/assets/img/logo.svg" />
							<h1>Contriboard</h1>
						</div>
						{this.renderSocials(formType.socials)}
						{this.renderFields(formType.fields)}
						{this.onEachFrameHandler(formType)}
						{this.renderPrimaryButtons(formType.buttons)}
						<article className="help">{formType.help}</article>
						<section className="secondary-content">
							{this.renderSecondaryButtons(formType.buttons)}
						</section>
					</div>
				</div>
			</div>
		);
	}
});
