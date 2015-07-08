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
import Scrollable  from '../../components/dialog/scrollable';

import settingsMixin from '../../mixins/settings';

/**
 *
 */
export default React.createClass({
	mixins: [ React.addons.LinkedStateMixin, settingsMixin() ],

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

	commentTimeFormatter(value, unit, suffix) {
		if(value !== 1){
			unit += 's'
		}

		switch(unit) {
			case 'second':  {unit = this.state.locale.TIME_SECOND; break;}
			case 'seconds': {unit = this.state.locale.TIME_SECONDS; break;}

			case 'minute':  {unit = this.state.locale.TIME_MINUTE; break;}
			case 'minutes': {unit = this.state.locale.TIME_MINUTES; break;}

			case 'hour':  {unit = this.state.locale.TIME_HOUR; break;}
			case 'hours': {unit = this.state.locale.TIME_HOURS; break;}

			case 'day':  {unit = this.state.locale.TIME_DAY; break;}
			case 'days': {unit = this.state.locale.TIME_DAYS; break;}

			case 'week': {unit = this.state.locale.TIME_WEEK; break;}
			case 'weeks': {unit = this.state.locale.TIME_WEEKS; break;}

			case 'month': {unit = this.state.locale.TIME_MONTH; break;}
			case 'months': {unit = this.state.locale.TIME_MONTHS; break;}

			case 'year': {unit = this.state.locale.TIME_YEAR; break;}
			case 'years': {unit = this.state.locale.TIME_YEARS; break;}
		}

		suffix = this.state.locale.TIME_SUFFIX;

		return value + ' ' + unit + ' ' + suffix;
	},

	render() {
		let headerArea = null;
		let contentArea = null;
		let commentArea = (
			<section className="dialog-comments">
				<section className="new-comment-section">
					<input className="comment-input"
						   maxLength={40}
						   valueLink={this.linkState('newComment')} placeholder={this.state.locale.EDITTICKET_YOURCOMMENT}
						   tabIndex={2}/>
					<button className="btn-primary" onClick={this.comment}>{this.state.locale.EDITTICKET_ADDCOMMENT}</button>
				</section>
				<section className="comment-wrapper">
					<Scrollable>
						{
							this.props.ticket.comments.map((comment) => {
								let user     = comment.get('user').toJS();
								let username = user.name || user.username;
								let avatar   = user.avatar;
								let usertype = user.account_type || user.type;

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
											<TimeAgo className="comment-timestamp" date={timestamp} formatter={this.commentTimeFormatter}/>
											<p className="comment-username">{username}</p>
										</section>
										<p className="comment-message">{msg}</p>
									</div>
								);
							})}
					</Scrollable>
				</section>
			</section>
		)

		if(!this.state.isEditing && this.state.content !== '') {
			let content = this.state.content;
			let markupContent = markdown.markdown.toHTML(content);

			// Add target="_blank" attribute to links so they open in a new tab
			if (markupContent.includes('<a href=')) {
				markupContent = markupContent.replace(/<a href="/g, '<a target="_blank" href="');
			}

			contentArea = (
				<section className="dialog-content">
					<Scrollable>
						<span dangerouslySetInnerHTML={{__html: markupContent}}
							  onClick={this.toggleEdit}/>
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
								  tabIndex={2}
								  placeholder={'Ticket content'}/>
					</Scrollable>
				</section>
			);

			headerArea = (
				<section className="dialog-heading">
					<input valueLink={this.linkState('heading')}
						   placeholder={'Ticket heading'}
						   tabIndex={1}/>
				</section>
			);
		}

		return (
			<Dialog className="edit-ticket-dialog"
					onDismiss={this.props.onDismiss}>
				<Scrollable>
					<section className="dialog-header">
						<ColorSelect color={this.linkState('color')} />
					</section>
					<section onClick={this.state.isEditing ? this.toggleEdit : null}>
						{headerArea}
						{contentArea}
						{commentArea}
						<section className="dialog-footer">
							<button className="btn-neutral" id={"ticket-dialog-cancel"} onClick={this.cancel}
									tabIndex={3}>
								{this.state.locale.CANCELBUTTON}
							</button>
							<button className="btn-primary" id={"ticket-dialog-save"} onClick={this.update}
									tabIndex={4}>
								{this.state.locale.EDITTICKET_SAVE}
							</button>
						</section>
						<span className="deleteicon fa fa-trash-o" id={"ticket-dialog-delete"} onClick={this.remove}>{this.state.locale.EDITTICKET_DELETE}</span>
					</section>
				</Scrollable>
			</Dialog>
		);
	}
});
