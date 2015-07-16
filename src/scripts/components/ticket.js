import React      from 'react/addons';
import Hammer     from 'hammerjs';
import immutable  from 'immutable';
import TweenState from 'react-tween-state';
import markdown   from 'markdown';

import gridify   from '../utils/gridify';
import doubletap from '../utils/doubletap';

import Ticket       from '../models/ticket';
import Board        from '../models/board';
import TicketAction from '../actions/ticket';

import DraggableMixin   from '../mixins/draggable';
import EditTicketDialog from '../components/dialog/edit-ticket';

/**
 *
 */
export default React.createClass({
	mixins: [ DraggableMixin, TweenState.Mixin ],

	propTypes: {
		ticket: (props) => {
			if(!props.ticket instanceof Ticket) throw new Error();
		},
		board: (props) => {
			if(!props.board instanceof Board) throw new Error();
		},
		snap:  React.PropTypes.bool
	},

	getDefaultProps() {
		return { snap: false }
	},

	getInitialState() {
		return {
			x: this.props.ticket.position.x,
			y: this.props.ticket.position.y,
			showEditDialog: false
		}
	},

	shouldComponentUpdate(nextProps, nextState) {
		let prevProps = this.props;
		let prevState = this.state;

		let hasStateChanged = (
			prevState.x                 !== nextState.x              ||
			prevState.y                 !== nextState.y              ||
			prevState.showEditDialog    !== nextState.showEditDialog
		);

		let havePropsChanged = (
			prevProps.snap  !== nextProps.snap                ||
			prevProps.board.id !== nextProps.board.id               ||
			!immutable.is(prevProps.ticket, nextProps.ticket)
		);

		let isTweening = nextState.tweenQueue.length > 0;

		return hasStateChanged || havePropsChanged || isTweening;
	},

	componentDidMount() {
		this.hammer = doubletap(this.getDOMNode());
		this.hammer.on('doubletap', this.toggleEditDialog);

		this.draggable.on('dragEnd', () => {
			if(this.draggable && !this.props.ticket.id.startsWith('dirty_')) {
				let position = this.draggable.position;

				if (this.state.x === position.x && this.state.y === position.y) {
					return;
				}

				// Snap the position if necessary...
				position = this.props.snap ? gridify(position) : position;

				// If we are snapping the ticket, we 'tween' the position to the
				// end value, else we just set the state directly.
				if (this.props.snap) {
					this.tween(position, this.draggable.position, 100);
				}
				else this.setState({ x: position.x, y: position.y });

				TicketAction.update({ id: this.props.board.id }, {
					id: this.props.ticket.id,
					position: { x: this.state.x, y: this.state.y }
				});
			}
		});

	},

	componentWillUnmount() {
		this.hammer.destroy();
		this.hammer = null;
	},

	componentWillReceiveProps(next) {
		// Prevent tweening, if there is a 'drag' currently going on.
		if(this.state.isDragging) return null;

		// Prevent unnecessary tweening.
		if(this.state.x !== next.ticket.position.x ||
				this.state.y !== next.ticket.position.y) {
			return this.tween(next.ticket.position);
		}
	},

	toggleEditDialog() {
		if(!this.props.ticket.id.startsWith('dirty_')) {
			this.setState({ showEditDialog: !this.state.showEditDialog });
		}
	},

	tween(to, from, duration) {
		[ 'x', 'y' ].map((axis) => {
			let tweeningOpts = {
				duration:   duration || 500,
				endValue:   to[axis],
				beginValue: from ? from[axis] : null
			}
			return this.tweenState(axis, tweeningOpts);
		});
	},

	render() {
		let style = {
			ticket: {
				top:    this.getTweeningValue('y'),
				left:   this.getTweeningValue('x'),
				zIndex: this.props.ticket.position.z
			},
			color: {
				backgroundColor: this.props.ticket.color
			}
		}
		let editTicketDialog = !this.state.showEditDialog ? null : (
			<EditTicketDialog board={this.props.board}
				ticket={this.props.ticket}
				onDismiss={this.toggleEditDialog} />
		);

		let markupContent = markdown.markdown.toHTML(this.props.ticket.content);

		// Add target="_blank" attribute to links
		if (markupContent.includes('<a href=')) {
			markupContent = markupContent.replace(/<a href="/g, '<a target="_blank" href="');
		}

		let commentCount = null;

		if (this.props.ticket.comments.size < 100) {
			commentCount = this.props.ticket.comments.size
		} else {
			commentCount = '99+';
		}

		return (
			<div className="ticket" style={style.ticket}>
				<div className="color" style={style.color}></div>
				<div className="heading">
					{this.props.ticket.heading}
				</div>
				<div className="content">
					<span dangerouslySetInnerHTML={{ __html: markupContent }} />
					<span className="count-icon">
						<span className="fa fa-2x fa-comment comment">
							<span className="count">{commentCount}</span>
						</span>
					</span>
				</div>
				{editTicketDialog}
			</div>
		);
	}
});
