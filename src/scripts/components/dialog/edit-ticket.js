import React     from 'react/addons';
import immutable from 'immutable';
import TimeAgo   from 'react-timeago';
import TextArea  from 'react-autosize-textarea';
import markdown  from 'markdown';

import Ticket       from '../../models/ticket';
import TicketAction from '../../actions/ticket';
import UserStore    from '../../stores/user';

import Avatar      from '../../components/avatar';
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
				id: this.props.ticket.id
			}, this.state.newComment);

			this.setState({newComment: ''});
		}
		return event.stopPropagation();
	},

	toggleEdit(event) {
		// This handler is a no-op if we are clicking on the text-area or text input.
		// Also, don't exit editing mode if we click a link or if ticket has no content
		if( event.target instanceof HTMLTextAreaElement ||
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
                                       valueLink={this.linkState('newComment')} placeholder="Your comment"
										tabIndex={2}/>
								<button className="btn-primary" id={"new-comment"} onClick={this.comment}>Add comment</button>
							</section>
							<section className="comment-wrapper">
							{
								this.props.ticket.comments.map((comment) => {

								let user     = comment.get('user');
								let username = null;
								let avatar   = null;
								let usertype = null;

								// Sometimes ImmutableJS likes to turn our user into a Map
								// instead of a Record. This is a hack to get our way around that.
								if(user.constructor.name === 'Map') {
									user     = user.toJS();
									username = user.name || user.username;
									avatar   = user.avatar;
									usertype = user.account_type;
								} else {
									username = user.get('username');
									avatar   = user.get('avatar');
									usertype = user.get('account_type');
								}
								let timestamp = comment.get('created_at');
								let msg       = comment.get('content');
								let timeProps = {date: timestamp};

								return (
									<div className="comment" key={comment.id}>
										<section className="comment-top">
												<Avatar size={32} name={username}
														imageurl={avatar}
														usertype={usertype}
														isOnline={true}>
												</Avatar>
											<span className="comment-timestamp">{React.createElement(TimeAgo, timeProps)}</span>
											<p className="comment-username">{username}</p>
										</section>
										<p className="comment-message">{msg}</p>
									</div>
								);
							})}
							</section>
						</section>
						<section className="dialog-footer">
							<button className="btn-neutral" id={"ticket-dialog-cancel"} onClick={this.cancel}
									tabIndex={3}>
								Cancel
							</button>
							<button className="btn-primary" id={"ticket-dialog-save"} onClick={this.update}
									tabIndex={4}>
								Save
							</button>
						</section>
					<span className="deleteicon fa fa-trash-o" id={"ticket-dialog-delete"} onClick={this.remove}> Delete</span>

					</section>
			</Dialog>
		);
	}
});
