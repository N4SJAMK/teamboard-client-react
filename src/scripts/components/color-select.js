import React  from 'react/addons';
import Hammer from 'hammerjs';
import TimeAgo   from 'react-timeago';
import Ticket from '../models/ticket';

/**
 *
 */
const ColorButton = React.createClass({
	mixins: [ React.addons.PureRenderMixin ],

	propTypes: {
		color:    React.PropTypes.string.isRequired,
		onSelect: React.PropTypes.func.isRequired
	},

	componentDidMount() {
		new Hammer(this.getDOMNode()).on('tap', () => {
			this.props.onSelect(this.props.color);
		});
	},

	render() {
		return <div className={`option ${this.props.active}`}
			style={{ backgroundColor: this.props.color }} id={"color-" + this.props.color} />;
	}
});

/**
 *
 */
export default React.createClass({
	mixins: [ React.addons.PureRenderMixin ],

	propTypes: {
		ticketData: React.PropTypes.object,
		color: React.PropTypes.shape({
			value:         React.PropTypes.string.isRequired,
			requestChange: React.PropTypes.func.isRequired
		}).isRequired
	},

	selectColor(newColor) {
		this.activeColor=newColor;
		this.props.color.requestChange(newColor);
	},

	render() {
		let colors = Object.keys(Ticket.Color).map((c) => Ticket.Color[c]);
		let active = '';
		return (
			<div className="color-select">
				<div className="value"
					style={{ backgroundColor: this.props.color.value }} />
					<span className="creator">{`Created by ${this.props.ticketData.createdBy}`}</span>
				<div className="options">
					{colors.map((color) => {
						active = this.activeColor === color ? ' active' : '';
						return <ColorButton active={active}  key={color} color={color}
							onSelect={this.selectColor} />;
					})}
				</div>
			</div>
		);
	}
});
