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
		return ProfileForms.fieldNames.reduce((state, field) => {
			state[field.name] = '';
			return state;
		}, {});
	},

	getInputType(field, index, ...controlattrs){
		switch(field.type){
			case 'submit': return (
					<input name={field.name} className={field.className}
					type='submit' {...controlattrs} value={field.action}/>
				); break;
			case 'text':
			case 'password':
			case 'email':
			case 'file': return (
					<input autoFocus={index === 0} name={field.name}
					type={field.type} {...controlattrs}
					valueLink={this.linkState(field.name)} />
				); break;	
		}
	},

	renderFields(fields) {
		return fields.map((field, index) => {
			let controlattrs = {
				title:     field.title,
				pattern:   field.pattern,
				required:  field.required,
				className: field.className,
				value:     field.buttonaction
			}
			return (
				<section key={field.name} className="input">
					<label htmlFor={field.name}>{field.label}</label>
					{this.getInputType(field, index, controlattrs)}
				</section>
			);
		});
	},

	submitPrimary(currentForm) {
		return (event) => {
			currentForm.submit(this.state);
			return event.preventDefault();
		}
	},

	renderSidelinks() {
		return ProfileForms.linkItems.map((field, index) => {
			return (
				<li>
					<button onClick={field.onClick}>{field.name}</button>
				</li>
			);
		});
	},

	renderForm(formType){
		return (
			<div className="view view-workspace">
				<Navigation showHelp={false} title="Contriboard" />
				<Broadcaster />
				<div className="content">
				<ul>
				{this.renderSidelinks()}
				</ul>
					<form className="form"
						onSubmit={this.submitPrimary(formType)}>
						<h3>{formType.title}</h3>
						{this.renderFields(formType.fields)}
						<article className="help">{formType.help}</article>
						<section className="secondary-content">
						</section>
					</form>
				</div>
			</div>
		);
	},

	render() {
		return this.renderForm(ProfileForms[this.props.formProfile])

	}
});
