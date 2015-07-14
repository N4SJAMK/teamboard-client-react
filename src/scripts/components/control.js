import React  	  from 'react';
import Hammer 	  from 'hammerjs';
import classNames from 'classnames';

/**
 *
 */
export default React.createClass({
	propTypes: {
		icon:    React.PropTypes.string.isRequired,
		active:  React.PropTypes.bool,
		onClick: React.PropTypes.func.isRequired
	},

	getDefaultProps() {
		return { active: false }
	},

	shouldComponentUpdate(nextProps) {
		return this.props.active !== nextProps.active;
	},

	componentDidMount() {
		new Hammer(this.getDOMNode()).on('tap', this.props.onClick);
	},

	render() {
		let controlClasses = classNames({
			control: true,
			active:  this.props.active
		});
		let iconClasses = `fa fa-fw fa-${this.props.icon}`;
		return (
			<div className={controlClasses}>
				<span className={iconClasses}></span>
			</div>
		);
	}
});
