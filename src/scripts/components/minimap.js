import React      from 'react/addons';
import immutable  from 'immutable';
import classNames from 'classnames';

import Board  from '../models/board';
import Ticket from '../models/ticket';

/**
 *
 */
const Marker = React.createClass({
	propTypes: {
		ticket: (props) => {
			if(!props.ticket instanceof Ticket) throw new Error();
		},
		scale: React.PropTypes.number.isRequired
	},

	shouldComponentUpdate(nextProps) {
		let prevProps = this.props;
		let havePropsChanged = (
			prevProps.scale !== nextProps.scale               ||
			!immutable.is(prevProps.ticket, nextProps.ticket)
		);
		return havePropsChanged;
	},

	render() {
		let style = {
			top:  Math.round(this.props.scale * this.props.ticket.position.y),
			left: Math.round(this.props.scale * this.props.ticket.position.x),

			width:  Math.round(this.props.scale * Ticket.Width),
			height: Math.round(this.props.scale * Ticket.Height),

			zIndex:          this.props.ticket.position.z,
			backgroundColor: this.props.ticket.color
		}
		return <div className="marker" style={style} />;
	}
});

/**
 *
 */
export default React.createClass({
	propTypes: {
		board: (props) => {
			if(!props.board instanceof Board) throw new Error();
		},
		show: React.PropTypes.bool,
		isTicketSized: React.PropTypes.bool
	},

	getDefaultProps() {
		return { show: true, isTicketSized: true }
	},

	shouldComponentUpdate(nextProps) {
		let prevProps = this.props;

		// If the map is not going to be shown, why bother updating it.
		if(!prevProps.show && !nextProps.show) return false;

		let havePropsChanged = (
			prevProps.show !== nextProps.show               ||
			!immutable.is(prevProps.board, nextProps.board)
		);
		return havePropsChanged;
	},

	resizeCursor(screen) {
		// If the map is not shown, why bother updating the cursor size.
		if(!this.props.show) return null;

		let $this   = this.getDOMNode();
		let $cursor = this.refs.cursor.getDOMNode();

		let scale = {
			x: screen.width  / (this.props.board.size.width  * Ticket.Width),
			y: screen.height / (this.props.board.size.height * Ticket.Height)
		}

		$cursor.style.width  = Math.round(scale.x * $this.clientWidth);
		$cursor.style.height = Math.round(scale.y * $this.clientHeight);
	},

	render() {
		let board   = this.props.board;
		let classes = classNames({
			minimap: true, hidden: !this.props.show
		});

		// Recalculate the size of the minimap while retaining the aspect ratio
		// of the minimap, which is 'Ticket.Width / Ticket.Height'.

		let size = {
			width:  board.size.width  * Ticket.Width,
			height: board.size.height * Ticket.Height
		}

		let width   = Ticket.Width;
		let height  = (size.height / size.width) * width;
		let scaling = 1.0;

		if(board.size.height > board.size.width) {
			if(!this.props.isTicketSized) {
				scaling = width / height;
			} else {
				scaling = board.size.width / board.size.height;
			}
		}

		let background    = Board.Background[board.background];
		let backgroundURL = background.url
			? `url(${background.url})` : '';

		if(background === Board.Background.CUSTOM) {
			backgroundURL = board.customBackground
				? `url(${board.customBackground})` : '';
		}

		let style = {
			width:           scaling * width,
			height:          scaling * height,
			backgroundImage: backgroundURL
		}

		return (
			<div className={classes} style={style}>
				<div ref="cursor" className="cursor" />
				{this.renderMarkers(style.width / size.width)}
			</div>
		);
	},

	renderMarkers(scale) {
		return this.props.board.tickets.map(function(ticket) {
			return <Marker key={ticket.id} scale={scale} ticket={ticket} />;
		});
	}
});
