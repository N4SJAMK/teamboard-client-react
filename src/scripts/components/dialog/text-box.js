import React from 'react';

import settingsMixin from '../../mixins/settings';

/**
 *
 */
// This is the textbox used in the infolayer.
const SingleBox = React.createClass({
	mixins: [ settingsMixin() ],

	propTypes: {
		content: React.PropTypes.string,
		className:  React.PropTypes.string
	},

	getDefaultProps() {
		return {
			content: 'Content',
			className: ''
		}
	},

	render() {
		return (
			<div className={`pos ${this.props.className}`}>
				<p>{this.state.locale[this.props.content]}</p>
			</div>
		);
	}
});

// The objects other than textboxes to be shown in the infolayer and
// the instances of SingleBoxes are passed here as props and mapped
export default React.createClass({
	propTypes: {
		items: React.PropTypes.array,
		objects: React.PropTypes.array
	},

	getDefaultProps() {
		return { items: [ ], objects: [ ] }
	},

	render() {
		return (
			<div className="infospace">
				{this.props.objects}
				{this.props.items.map((item, index) => {
					return <SingleBox key={index} {...item} />;
				})}
			</div>
		);
	}
});
