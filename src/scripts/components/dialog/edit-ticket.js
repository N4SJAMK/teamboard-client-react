import React     from 'react/addons';
import immutable from 'immutable';
import TimeAgo   from 'react-timeago';
import TextArea  from 'react-autosize-textarea';
import markdown  from 'markdown';

import Ticket        from '../../models/ticket';
import TicketAction  from '../../actions/ticket';
import UserStore     from '../../stores/user';
import CommentAction from '../../actions/comment';

import Avatar      from '../../components/avatar';
import Dialog      from '../../components/dialog';
import ColorSelect from '../../components/color-select';
import Scrollable  from '../../components/dialog/scrollable';

/**
 *
 */
export default React.createClass({
	mixins: [ React.addons.LinkedStateMixin ],

	propTypes: {
		ticket: (props) => {
			if(!props.ticket instanceof Ticket) throw new Error();
		},
		comments: (props) => {
			if(!props.comments instanceof immutable.List) throw new Error();
		},
		board:     React.PropTypes.string.isRequired,
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

	remove(event) {
		event.preventDefault();
		TicketAction.delete({ id: this.props.board }, {
			id: this.props.ticket.id
		});
		return this.props.onDismiss();
	},

	update(event) {
		event.preventDefault();

		TicketAction.update({ id: this.props.board }, {
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
			let boardID  = this.props.board;
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
		return event.stopPropagation();
	},

	render() {
		let headerArea  = null;
		let contentArea = null;

		let commentArea = (
			<section className="dialog-comments">
				<section className="new-comment-section">
					<input className="comment-input"
						maxLength={140} tabIndex={2} placeholder="Your comment"
						valueLink={this.linkState('newComment')} />
					<button className="btn-primary"
							onClick={this.onSubmitComment}>
						Add comment
					</button>
				</section>
				<section className="comment-wrapper">
					<Scrollable>
						{this.props.comments.reverse().map((comment) => {
							let username  = comment.createdBy.name || comment.createdBy.username;
							let usertype  = comment.createdBy.type || comment.createdBy.account_type;
							let avatarURL = comment.createdBy.avatar;

							let message = comment.message;
							let timeago = { date: comment.createdAt }

							return (
								<div className="comment" key={comment.id}>
									<section className="comment-top">
										<Avatar size={32} name={username}
											imageurl={avatarURL}
											usertype={usertype}
											isOnline={true}>
										</Avatar>
										<span className="comment-timestamp">
											{React.createElement(TimeAgo, timeago)}
										</span>
										<p className="comment-username">
											{username}
										</p>
									</section>
									<p className="comment-message">{message}</p>
								</div>
							);
						})}
					</Scrollable>
				</section>
			</section>
		);

		if(!this.state.isEditing && this.state.content !== '') {
			let content       = this.state.content;
			let markupContent = markdown.markdown.toHTML(content);

			// Add target="_blank" attribute to links so they open in a new tab
			if (markupContent.includes('<a href=')) {
				markupContent = markupContent.replace(
					/<a href="/g, '<a target="_blank" href="');
			}

			contentArea = (
				<section className="dialog-content">
					<Scrollable>
						<span
							dangerouslySetInnerHTML={{ __html: markupContent }}
							onClick={this.toggleEdit} />
					</Scrollable>
				</section>
			);

			headerArea = (
				<section className="dialog-heading">
					<span onClick={this.toggleEdit}>{this.state.heading}</span>
				</section>
			);
		} else {
			contentArea = (
				<section className="dialog-content">
					<Scrollable>
						<TextArea valueLink={this.linkState('content')}
							tabIndex={2} placeholder="Ticket content"/>
					</Scrollable>
				</section>
			);

			headerArea = (
				<section className="dialog-heading">
					<input  valueLink={this.linkState('heading')}
						maxLength={40} tabIndex={1}
						placeholder="Ticket heading" />
				</section>
			);
		}

		return (
			<Dialog className="edit-ticket-dialog"
					onDismiss={this.props.onDismiss}>
				<section className="dialog-header">
					<ColorSelect color={this.linkState('color')} />
				</section>
				<section onClick={this.state.isEditing
						? this.toggleEdit : null}>
					{headerArea}
					{contentArea}
					{commentArea}
					<section className="dialog-footer">
						<button className="btn-neutral"
								id={"ticket-dialog-cancel"}
								onClick={this.cancel}
								tabIndex={3}>
							Cancel
						</button>
						<button className="btn-primary"
								id={"ticket-dialog-save"}
								onClick={this.update}
								tabIndex={4}>
							Save
						</button>
					</section>
					<span className="deleteicon fa fa-trash-o"
							id={"ticket-dialog-delete"}
							onClick={this.remove}>
						Delete
					</span>
				</section>
			</Dialog>
		);
	}
});
