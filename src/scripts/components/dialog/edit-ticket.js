import React     from 'react/addons';
import immutable from 'immutable';
import TimeAgo   from 'react-timeago';
import markdown  from 'markdown';
import throttle  from 'lodash.throttle';
import listener  from '../../mixins/listener';

import Board         from '../../models/board';
import Ticket        from '../../models/ticket';
import TicketAction  from '../../actions/ticket';
import UserStore     from '../../stores/user';
import CommentStore  from '../../stores/comment';
import CommentAction from '../../actions/comment';

import ActivityStore  from '../../stores/ticket-activity';
import ActivityAction from '../../actions/activity';

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
		listener(CommentStore),
		localeMixin()
	],

	propTypes: {
		ticket: (props) => {
			if(!props.ticket instanceof Ticket) throw new Error();
		},
		board: (props) => {
			if(!props.board instanceof Board) throw new Error();
		},
		onDismiss: React.PropTypes.func.isRequired,
		editing:   React.PropTypes.func
	},

	getInitialState() {
		return {
			comments:   CommentStore.getComments(this.props.ticket.id),
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
			z: this.props.ticket.position.z
		};
		return CommentAction.loadComments(this.props.board.id, this.props.ticket.id);
	},

	onChange() {
		this.setState({
			comments: CommentStore.getComments(this.props.ticket.id)
		});
	},

	copy(event) {
		let size = {
			width:  this.props.board.size.width  * Ticket.Width,
			height: this.props.board.size.height * Ticket.Height
		}
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

	onSubmitComment(event) {
		event.preventDefault();

		if(this.state.newComment !== '') {
			let boardID  = this.props.board.id;
			let ticketID = this.props.ticket.id;

			CommentAction.createComment(
				boardID, ticketID, this.state.newComment);

			this.setState({ newComment: '' });
			React.findDOMNode(this.refs.save).focus();
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

	commentKeyDown(event) {
		let enter = 13;
		if(event.keyCode == enter) {
			return this.onSubmitComment(event);
		}
	},

	contentKeyDown(event) {
		let enter = 13;
		if(event.keyCode == enter) {
			React.findDOMNode(this.refs.save).focus();
		}
	},

	getComment(comment) {
		let avatar   = comment.createdBy.avatar;
		let username = comment.createdBy.name         || comment.createdBy.username;
		let usertype = comment.createdBy.account_type || comment.createdBy.type;

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

	createLinkWithActivity(attr) {
		return {
			value: this.state[attr],
			requestChange: (value) => {
				ActivityAction.createTicketActivity(this.props.board.id, this.props.ticket.id);
				this.setState({ [attr]: value });
			}
		}
	},

	getEditors() {
		if(this.props.editors.size > 0) {
			let avatars = this.props.editors.map((user) => {
				return (
					<Avatar size={24} name={user.username}
						imageurl={user.avatar}
						usertype={user.type}
						isOnline={true}>
					</Avatar>
				);
			});
			return (
				<section className="editor-area">
					<span>{this.locale('EDITTICKET_EDITING')}</span>
					<section className="edit-ticket-avatars">
						{avatars}
					</section>
				</section>
			);
		}
		else {
			let person = this.props.ticket.lastEditedBy === null
				? {
					action: this.locale('EDITTICKET_CREATEDBY'), body: this.props.ticket.createdBy
				}
				: {
					action: this.locale('EDITTICKET_MODIFIEDBY'), body: this.props.ticket.lastEditedBy.toJS()
				}
			return (
				<section className="editor-area">
					<span>{person.action}</span>
					<section className="edit-ticket-avatars">
					<Avatar size={24} name={person.body.username}
						imageurl={person.body.avatar}
						usertype={person.body.account_type}
						isOnline={true}>
					</Avatar>
					</section>
				</section>
			);
		}
	},
	getHeaderArea() {
		return this.state.isEditing || this.state.content === '' ?
			(
				<section className="dialog-heading">
					<input valueLink={this.createLinkWithActivity('heading')}
						type="text"
						maxLength={40}
						tabIndex={1}
						placeholder={this.locale('EDITTICKET_HEADER')}
						onKeyDown={this.contentKeyDown}/>
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
						<textarea valueLink={this.createLinkWithActivity('content')}
							tabIndex={2}
							placeholder={this.locale('EDITTICKET_CONTENT')}/>
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
						tabIndex={2}
						onKeyDown={this.commentKeyDown}/>
					<button id="addCommentButton" className="btn-primary" onClick={this.onSubmitComment}>
						{this.locale('EDITTICKET_ADDCOMMENT')}
					</button>
				</section>
				<section className="comment-wrapper">
					<Scrollable>
						{ this.state.comments.reverse().map(this.getComment) }
					</Scrollable>
				</section>
			</section>
		)
	},

	render() {
		return (
			<Dialog className="edit-ticket-dialog"
					onDismiss={this.props.onDismiss}>
				<section className="dialog-header">
					<ColorSelect color={this.createLinkWithActivity('color')} />
				</section>
				<section onClick={this.state.isEditing ? this.toggleEdit : null}>
					{this.getHeaderArea()}
					{this.getContentArea()}
					<section className="dialog-footer">
						<button className="btn-neutral"
								id={"ticket-dialog-cancel"}
								onClick={this.cancel}
								tabIndex={3}>
							{this.locale('CANCELBUTTON')}
						</button>
						<button className="btn-primary"
								id={"ticket-dialog-save"}
								ref={"save"}
								onClick={this.update}
								tabIndex={4}>
							{this.locale('SAVEBUTTON')}
						</button>
					</section>
					<div className="dialog-ticket-additional">
						<span className="deleteicon fa fa-trash-o" id={"ticket-dialog-delete"} onClick={this.remove}>
							{this.locale('DELETEBUTTON')}
						</span>
						<span className="deleteicon fa fa-copy" id={"ticket-dialog-copy"} onClick={this.copy}>
							{this.locale('COPYBUTTON')}
						</span>
					</div>
					{this.getEditors()}
					{this.getCommentArea()}
				</section>
			</Dialog>
		);
	}
});
