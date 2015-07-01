import React from 'react';

const DropdownItem = React.createClass({
	propTypes: {
		icon:     React.PropTypes.string,
		onClick:  React.PropTypes.func,
		disabled: React.PropTypes.bool
	},

	getDefaultProps() {
		return {
			onClick:  () => {},
			disabled: false
		}
	},

	shouldComponentUpdate() {
		return false;
	},

	render() {
		let itemClasses = React.addons.classSet({
			item:     true,
			disabled: this.props.disabled
		});
		let icon = !this.props.icon ? null : (
			<span className={`fa fa-fw fa-${this.props.icon}`} />
		);
		return (
			<li className={itemClasses} id={"options-" + this.props.icon} onClick={this.props.onClick}>
				{icon}{this.props.content}
			</li>
		);
	}

});

export default React.createClass({
	propTypes: {
		show:  React.PropTypes.bool.isRequired,
		items: React.PropTypes.array,
		className: React.PropTypes.string
	},

	getDefaultProps() {
		return { items: [ ] }
	},

	shouldComponentUpdate(nextProps) {
		// We know the items won't change over time, at least with the current
		// implementation of the Navigation component...
		return this.props.show !== nextProps.show;
	},

	render() {
		return !this.props.show ? null : (
			<ul className={`dropdown ${this.props.className}`}>
				{this.props.items.map((item, index) => {
					return <DropdownItem key={index} {...item} />;
				})}
			</ul>
		);
	}
});
