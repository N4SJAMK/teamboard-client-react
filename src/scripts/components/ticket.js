import React      from 'react/addons';
import Hammer     from 'hammerjs';
import throttle   from 'lodash.throttle';
import immutable  from 'immutable';
import TweenState from 'react-tween-state';
import markdown   from 'markdown';

import gridify   from '../utils/gridify';
import doubletap from '../utils/doubletap';

import Ticket       from '../models/ticket';
import Board        from '../models/board';
import TicketAction from '../actions/ticket';

import listener      from '../mixins/listener';
import CommentStore  from '../stores/comment';
import CommentAction from '../actions/comment';

import ActivityStore  from '../stores/activity';
import ActivityAction from '../actions/activity';

import DraggableMixin   from '../mixins/draggable';
import EditTicketDialog from '../components/dialog/edit-ticket';
import Avatar      from './avatar';

/**
 *
 */
export default React.createClass({
	mixins: [ DraggableMixin,
		TweenState.Mixin, listener(CommentStore, ActivityStore) ],

	propTypes: {
		ticket: (props) => {
			if(!props.ticket instanceof Ticket) throw new Error();
		},
		board: (props) => {
			if(!props.board instanceof Board) throw new Error();
		},
		snap: React.PropTypes.bool
	},

	onChange() {
		this.setState({
			activity: ActivityStore.getActivity(this.props.ticket.id),
			comments: CommentStore.getComments(this.props.ticket.id)
		});
	},

	getDefaultProps() {
		return { snap: false }
	},

	getInitialState() {
		return {
			x: this.props.ticket.position.x,
			y: this.props.ticket.position.y,
			activity: ActivityStore.getActivity(this.props.ticket.id),
			comments: CommentStore.getComments(this.props.ticket.id),
			showEditDialog: false
		}
	},

	getEditors() {
		let editIcon = this.state.activity.size === 0 ? null
			: <span className="fa fa-pencil-square-o edit-icon" />
		let avatars = this.state.activity.toJS().map((item) => {
			let user = item.user;
			return (
				<Avatar size={16} name={user.username}
					imageurl={user.avatar}
					usertype={user.type}
					isOnline={true}>
				</Avatar>
			);
		});
			return (
				<section className="ticket-avatars">
					{editIcon}
					{avatars}
				</section>
			);
	},

	shouldComponentUpdate(nextProps, nextState) {
		let prevProps = this.props;
		let prevState = this.state;

		let hasStateChanged = (
			prevState.x              !== nextState.x              ||
			prevState.y              !== nextState.y              ||
			prevState.showEditDialog !== nextState.showEditDialog ||
			!immutable.is(prevState.comments, nextState.comments) ||
			!immutable.is(prevState.activity, nextState.activity)
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

		// dragging the ticket will continuously send activity notifications
		this.draggable.on('dragMove', () => {
			ActivityAction.createTicketActivity(this.props.board.id, this.props.ticket.id);
		});

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

	componentWillMount() {
		if(!this.props.ticket.id.startsWith('dirty')) {
			CommentAction.loadComments(this.props.board.id, this.props.ticket.id);
		}
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
				comments={this.state.comments}
				onDismiss={this.toggleEditDialog} />
		);

		let markupContent = markdown.markdown.toHTML(this.props.ticket.content);

		// Add target="_blank" attribute to links
		if (markupContent.includes('<a href=')) {
			markupContent = markupContent.replace(/<a href="/g, '<a target="_blank" href="');
		}
		let numComments = this.state.comments.size > 99
			? '99+' : `${this.state.comments.size}`;
		return (
			<div className="ticket" style={style.ticket}>
				<div className="color" style={style.color}></div>
				<div className="heading">
					{this.props.ticket.heading}
				</div>
				<div className="content">
					<span dangerouslySetInnerHTML={{__html: markupContent}} />
				</div>
					<section className="ticket-footer">
					<span className="count">
						{numComments}
					</span>
						<section style={{marginRight: 3}}>
							<span className="fa fa-2x fa-comment comment"/>
							{this.getEditors()}
						</section>
					</section>
				{editTicketDialog}
			</div>
		);
	}
});
