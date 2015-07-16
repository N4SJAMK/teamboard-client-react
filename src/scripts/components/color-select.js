import React  from 'react/addons';
import Hammer from 'hammerjs';

import Ticket from '../models/ticket';

/**
 *
 */
const ColorButton = React.createClass({
	mixins: [ React.addons.PureRenderMixin ],

	propTypes: {
		color:    React.PropTypes.string.isRequired,
		active:   React.PropTypes.string.isRequired,
		onSelect: React.PropTypes.func.isRequired
	},

	componentDidMount() {
		new Hammer(this.getDOMNode()).on('tap', () => {
			this.props.onSelect(this.props.color);
		});
	},

	render() {
		let active = this.props.color == this.props.active ? 'option active' : 'option';
		return <div className={active}
			style={{ backgroundColor: this.props.color }} id={'color-' + this.props.color} />;
	}
});

/**
 *
 */
export default React.createClass({
	mixins: [ React.addons.PureRenderMixin ],

	propTypes: {
		color: React.PropTypes.shape({
			value:         React.PropTypes.string.isRequired,
			requestChange: React.PropTypes.func.isRequired
		}).isRequired
	},

	selectColor(newColor) {
		this.props.color.requestChange(newColor);
	},

	render: function() {
		let colors = Object.keys(Ticket.Color).map((c) => Ticket.Color[c]);
		return (
			<div className="color-select">
				<div className="value"
					style={{ backgroundColor: this.props.color.value }} />
				<div className="options">
					{colors.map((color) => {
						return <ColorButton key={color} color={color}
							active={this.props.color.value} onSelect={this.selectColor} />;
					})}
				</div>
			</div>
		);
	}
});
