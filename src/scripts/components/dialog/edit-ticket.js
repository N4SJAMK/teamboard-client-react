import React     from 'react/addons';
import immutable from 'immutable';
import TimeAgo   from 'react-timeago';
import TextArea  from 'react-autosize-textarea';
import markdown  from 'markdown';

import Ticket        from '../../models/ticket';
import TicketAction  from '../../actions/ticket';
import UserStore     from '../../stores/user';
import CommentAction from '../../actions/comment';

import Avatar      from '../avatar';
import Dialog      from '../dialog';
import ColorSelect from '../color-select';

import Scrollable  from './scrollable';
import localeMixin from '../../mixins/locale';

/**
 *
 */
export default React.createClass({
	mixins: [
		React.addons.LinkedStateMixin,
		localeMixin()
	],

	propTypes: {
		ticket: (props) => {
			if(!props.ticket instanceof Ticket) throw new Error();
		},
		board: (props) => {
			if(!props.board instanceof Board) throw new Error();
		},
		comments: (props) => {
			if(!props.comments instanceof immutable.List) throw new Error();
		},
		onDismiss: React.PropTypes.func.isRequired
	},

	getInitialState() {
		return {
			color:      this.props.ticket.color,
			content:    this.props.ticket.content,
			heading:    this.props.ticket.heading,
			isEditing:  this.props.ticket.content === '',
			newComment: ''
		}
	},

	componentDidMount() {
		this.position = {
			x: this.props.ticket.position.x + Ticket.Width / 5,
			y: this.props.ticket.position.y + Ticket.Height / 2.5,
			z: this.props.ticket.position.z,
		};
	},

	copy(event) {
		let size = {
				width:  this.props.board.size.width  * Ticket.Width,
				height: this.props.board.size.height * Ticket.Height
		};
		this.position.x = (this.position.x + Ticket.Width * 1.2) > size.width
			? size.width - Ticket.Width
			: this.position.x + Ticket.Width / 5;
		this.position.y = (this.position.y + Ticket.Height * 1.4) > size.height
			? size.height - Ticket.Height
			: this.position.y + Ticket.Height / 2.5;

		event.preventDefault();
		TicketAction.create({ id: this.props.board.id }, {
			color:     this.state.color,
			content:   this.state.content,
			heading:   this.state.heading,
			position:  this.position
		});
	},

	remove(event) {
		event.preventDefault();
		TicketAction.delete({ id: this.props.board.id }, {
			id: this.props.ticket.id
		});
		return this.props.onDismiss();
	},

	update(event) {
		event.preventDefault();
		TicketAction.update({ id: this.props.board.id }, {
			id:      this.props.ticket.id,
			color:   this.state.color,
			content: this.state.content,
			heading: this.state.heading
		});
		return this.props.onDismiss();
	},

	cancel(event) {
		event.preventDefault();
		return this.props.onDismiss();
	},

	onSubmitComment() {
		event.preventDefault();

		if(this.state.newComment !== '') {
			let boardID  = this.props.board.id;
			let ticketID = this.props.ticket.id;

			CommentAction.createComment(
				boardID, ticketID, this.state.newComment);

			this.setState({ newComment: '' });
		}
		return event.stopPropagation();
	},

	toggleEdit(event) {
		// This handler is a no-op if we are clicking on the text-area or text
		// input. Also don't exit editing mode if we click a link or if ticket
		// has no content.
		if(event.target instanceof HTMLTextAreaElement
		|| event.target instanceof HTMLInputElement
		|| event.target instanceof HTMLAnchorElement
		|| this.state.content === '') {
			return null;
		}

		this.setState({ isEditing: !this.state.isEditing });
		event.stopPropagation();
	},

	getMarkup(content) {
		let markupContent = markdown.markdown.toHTML(content);

		markupContent = markupContent.replace(/<a href="/g, '<a target="_blank" href="');

		return markupContent;
	},

	timeFormatter(value, unit, suffix) {
		if(value !== 1) {
			unit = `${unit}s`;
		}

		unit = this.locale(`TIME_${unit.toUpperCase()}`);
		suffix = this.locale('TIME_SUFFIX');

		return `${value} ${unit} ${suffix}`;
	},

	getComment(comment) {
		let avatar   = comment.createdBy.avatar;
		let username = comment.createdBy.name || comment.createdBy.username;
		let usertype = comment.createdBy.type || comment.createdBy.account_type;

		let timestamp = comment.get('created_at');
		let msg       = comment.get('content');

		return (
			<div className="comment" key={comment.id}>
				<section className="comment-top">
					<Avatar size={32} name={username}
							imageurl={avatar}
							usertype={usertype}
							isOnline={true}>
					</Avatar>
					<span className="comment-timestamp">
						<TimeAgo date={comment.createdAt}
								live={true}
								formatter={this.timeFormatter} />
					</span>
					<p className="comment-username">{username}</p>
				</section>
				<p className="comment-message">{comment.message}</p>
			</div>
		);
	},

	getHeaderArea() {
		return this.state.isEditing || this.state.content === '' ?
			(
				<section className="dialog-heading">
					<input  valueLink={this.linkState('heading')}
						maxLength={40}
						placeholder={this.locale('EDITTICKET_HEADER')}
						tabIndex={1}/>
				</section>
			) :
			(
				<section className="dialog-heading">
					<span onClick={this.toggleEdit}>{this.state.heading}</span>
				</section>
			);
	},

	getContentArea() {
		return this.state.isEditing || this.state.content === '' ?
			(
				<section className="dialog-content">
					<Scrollable>
						<TextArea valueLink={this.linkState('content')}
							tabIndex={2}
							placeholder={this.locale('EDITTICKET_CONTENT')} />
					</Scrollable>
				</section>
			) :
			(
				<section className="dialog-content">
					<Scrollable>
						<span dangerouslySetInnerHTML={{ __html: this.getMarkup(this.state.content) }}
							onClick={this.toggleEdit} />
					</Scrollable>
				</section>
			);
	},

	getCommentArea() {
		return (
			<section className="dialog-comments">
				<section className="new-comment-section">
					<input className="comment-input"
						maxLength={140}
						valueLink={this.linkState('newComment')}
						placeholder={this.locale('EDITTICKET_YOURCOMMENT')}
						tabIndex={2}/>
					<button className="btn-primary" onClick={this.onSubmitComment}>
						{this.locale('EDITTICKET_ADDCOMMENT')}
					</button>
				</section>
				<section className="comment-wrapper">
					<Scrollable>
						{ this.props.comments.reverse().map(this.getComment) }
					</Scrollable>
				</section>
			</section>
		)
	},

	render() {
		let ticketCreationData = {
			createdBy:    this.props.ticket.createdBy.username,
			lastEditedBy: this.props.ticket.lastEditedBy
		}
		return (
			<Dialog className="edit-ticket-dialog"
					onDismiss={this.props.onDismiss}>
				<section className="dialog-header">			
					<ColorSelect color={this.linkState('color')} ticketData={ticketCreationData}/>
				</section>
				<section onClick={this.state.isEditing ? this.toggleEdit : null}>
					{this.getHeaderArea()}
					{this.getContentArea()}
					{this.getCommentArea()}
					<section className="dialog-footer">
						<button className="btn-neutral"
								id={"ticket-dialog-cancel"}
								onClick={this.cancel}
								tabIndex={3}>
							{this.locale('CANCELBUTTON')}
						</button>
						<button className="btn-primary"
								id={"ticket-dialog-save"}
								onClick={this.update}
								tabIndex={4}>
							{this.locale('SAVEBUTTON')}
						</button>
					</section>
					<span className="deleteicon fa fa-trash-o" id={"ticket-dialog-delete"} onClick={this.remove}>
						{this.locale('DELETEBUTTON')}
					</span>
					<span className="deleteicon fa fa-copy" id={"ticket-dialog-copy"} onClick={this.copy}> Clone this ticket</span>
				</section>
			</Dialog>
		);
	}
});
