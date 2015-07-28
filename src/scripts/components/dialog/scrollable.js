import React        from 'react';
import ReactIScroll from 'react-iscroll';
import iScroll      from 'iscroll';

/**
 * NOTE Why do we need a separate 'react-iscroll' module?
 */
export default React.createClass({
	getDefaultProps() {
		return {
			options: {
				mouseWheel:     true,
				scrollbars:     true,
				preventDefault: true,
				bounce:         false
			},
			style: {
				position:                  'relative',
				width:                     '100%',
				overflow:                  'hidden',
				'WebkitOverflowScrolling': 'touch'
			}
		}
	},

	render: function() {
		return (
			<ReactIScroll iscroll={iScroll}
					options={this.props.options} style={this.props.style}>
				{this.props.children}
			</ReactIScroll>
		);
	}
});
