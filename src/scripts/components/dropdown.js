import React      from 'react';
import classNames from 'classnames';

const DropdownItem = React.createClass({
	propTypes: {
		flag:     React.PropTypes.string,
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
		let itemClasses = classNames({
			item:     true,
			disabled: this.props.disabled
		});
		let flag = !this.props.flag ? null : (
			<img src={`/src/assets/img/flag/${this.props.flag}.png`} alt="flag"/>
		);
		let icon = !this.props.icon ? null : (
			<span className={`fa fa-fw fa-${this.props.icon}`} />
		);

		let contentClass = this.props.customclass ?
							this.props.customclass :
							'dropdown-content';

		let content = this.props.nospan ?
						this.props.content :
						(<span className={contentClass}>{this.props.content}</span>);
		return (
			<li className={itemClasses} id={`options-${this.props.icon}`} onClick={this.props.onClick}>
				{flag}{icon}{content}
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
		let additionalClass = !this.props.className ? null : this.props.className
		return !this.props.show ? null : (
			<ul className={`dropdown ${additionalClass}`}>
				{this.props.items.map((item, index) => {
					return <DropdownItem key={index} {...item} />;
				})}
			</ul>
		);
	}
});
