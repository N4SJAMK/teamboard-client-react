import React     from 'react/addons';
import immutable from 'immutable';
import TextArea  from 'react-textarea-autosize';
import TimeAgo   from 'react-timeago';
import markdown  from 'markdown';

import Ticket       from '../../models/ticket';
import TicketAction from '../../actions/ticket';
import UserStore    from '../../stores/user';

import Dialog      from '../../components/dialog';
import ColorSelect from '../../components/color-select';

/**
 *
 */
export default React.createClass({
	mixins: [ React.addons.LinkedStateMixin ],

	propTypes: {
		ticket: (props) => {
			if(!props.ticket instanceof Ticket) throw new Error();
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

	comment(event) {
		event.preventDefault();
		if (this.state.newComment !== '') {
			TicketAction.comment({id: this.props.board}, {
				id: this.props.ticket.id,
			}, this.state.newComment);

			let currentUser = UserStore.getUser();

			this.props.ticket.comments.push({
				content: this.state.newComment,
				created_at: Date.now(),
				user: {
					username: currentUser.username
				}
			});

			this.setState({newComment: ''});
		}
		return event.stopPropagation();
	},

	toggleEdit(event) {
		// This handler is a no-op if we are clicking on the text-area or text input.
		// Also, don't exit editing mode if we click a link or if ticket has no content
		if(     event.target instanceof HTMLTextAreaElement ||
			event.target instanceof HTMLInputElement ||
			event.target instanceof HTMLAnchorElement ||
			this.state.content === '')  {
			return;
		}

		this.setState({ isEditing: !this.state.isEditing });
		return event.stopPropagation();
	},

	render() {
		let editDialogContent  = null;
		let editDialogHeader   = null;

		if(!this.state.isEditing && this.state.content !== '') {
			let content = this.state.content;
			let markupContent = markdown.markdown.toHTML(content);

			// Add target="_blank" attribute to links so they open in a new tab
			if (markupContent.includes('<a href=')) {
				markupContent = markupContent.replace(/<a href="/g, '<a target="_blank" href="');
			}
			editDialogContent = <span dangerouslySetInnerHTML={{__html: markupContent}}
                                      onClick={this.toggleEdit}/>

			editDialogHeader = <span onClick={this.toggleEdit}>{this.state.heading}</span>
		}

		else if(this.state.isEditing) {
			editDialogContent = <TextArea valueLink={this.linkState('content')}
                                          tabIndex={2}
                                          placeholder={'Ticket content'}/>

			editDialogHeader = <input valueLink={this.linkState('heading')}
                                      placeholder={'Ticket heading'}
                                      tabIndex={1}/>
		}

		return (
			<Dialog className="edit-ticket-dialog"
					onDismiss={this.props.onDismiss}>
				<section className="dialog-header">
					<ColorSelect color={this.linkState('color')} />
				</section>
				<section onClick={this.state.isEditing ? this.toggleEdit : null}>
				<section className="dialog-heading">
					{editDialogHeader}
				</section>
						<section className="dialog-content">
							{editDialogContent}
						</section>
						<section className="dialog-comments">
							<section className="new-comment-section">
								<input className="comment-input"
									   maxLength={40}
									   valueLink={this.linkState('newComment')} placeholder="Your comment" />
								<button className="btn-primary" onClick={this.comment}>Add comment</button>
							</section>
							<section className="comment-wrapper">
							{this.props.ticket.comments.map((comment, index) => {
								let timeProps = {date: comment.created_at};

								return (
									<div className="comment">
										<section>
											<span className="comment-timestamp">{React.createElement(TimeAgo,timeProps)}</span>
											<p className="comment-username">{comment.user.username}</p>
										</section>
										<p className="comment-message">{comment.content}</p>
									</div>
								);
							})}
							</section>
						</section>
						<section className="dialog-footer">
							<button className="btn-neutral" onClick={this.cancel}
									tabIndex={3}>
								Cancel
							</button>
							<button className="btn-primary" onClick={this.update}
									tabIndex={4}>
								Save
							</button>
						</section>
					<i className="deleteicon fa fa-trash-o" onClick={this.remove}> Delete</i>

					</section>
			</Dialog>
		);
	}
});
