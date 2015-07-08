import React      from 'react/addons';
import Carousel   from 'nuka-carousel';
import markdown   from 'markdown';

import Dialog     from '../../components/dialog';
import Avatar     from '../../components/avatar';

/**
 *
 */

export default React.createClass({
	mixins: [ Carousel.ControllerMixin ],
	propTypes: {
		tickets: React.PropTypes.array
	},

	componentWillUpdate() {
		this.currentSlide = this.state.carousels.carousel.state.currentSlide;
	},

	getDecorations() {
		return [
			{
				component: React.createClass({
					render() {
						let style = {opacity: 0};

						if(this.props.currentSlide !== 0 && this.props.slideCount > 0) {
							style = { opacity: 1, cursor: 'pointer'}
						}

						return (
							<span style={style}
							onClick={this.props.previousSlide} className="fa fa-chevron-left" />
						);
					}
				}),
				position: 'CenterLeft',
				style: {
					padding: 10
				}
			},
			{
				component: React.createClass({
					render() {
						let style = {opacity: 0};

						if(this.props.currentSlide !== --this.props.slideCount) {
							style = { opacity: 1, cursor: 'pointer'}
						}

						return (
							<span style={style}
							onClick={this.props.nextSlide} className="fa fa-chevron-right" />
						);
					}
				}),
				position: 'CenterRight',
				style: {
					padding: 10
				}
			}
		];
	},

	renderComments(ticket) {
		return ticket.comments.map((comment) => {

			let user     = comment.get('user').toJS();
			let content  = comment.toJS().content;
			let username = user.username || user.name;
			let avatar   = user.avatar;
			let usertype = user.account_type || user.type;

			return (
				<div className="review-comment" key={comment.id}>
					<Avatar size={32} name={username}
							imageurl={avatar}
							usertype={usertype}
							isOnline={true}>
					</Avatar>
					<p className="review-comment-username">{username}</p>
					<p className="review-comment-message">{content}</p>
				</div>
			);
		})
	},

	renderTickets() {
		return this.props.tickets.map((ticket, index) => {
			let markupContent = markdown.markdown.toHTML(ticket.content).replace(/<a href="/g, '<a target="_blank" href="');
			let dialogClasses = index !== this.currentSlide ? 'review-dialog' : 'review-dialog active';
			let ticketColor = {backgroundColor: ticket.color};

			return (
				<div className="review-dialog-container">
					<div className={dialogClasses}>
						<section style={ticketColor} className="review-dialog-header">
							<p className="review-dialog-header-text" title={ticket.heading}>{ticket.heading}</p>
						</section>
						<div className="content-wrapper">
							<span className="review-dialog-content"
								  dangerouslySetInnerHTML={{__html: markupContent}}/>
							<section className="review-dialog-comments">
								<section className="review-comment-wrapper">
									{this.renderComments(ticket)}
								</section>
							</section>
						</div>
					</div>
				</div>
			);
		})
	},

	render() {
		return (
			<Dialog className="info" viewProfile="review"
					onDismiss={this.props.onDismiss}>
				<Carousel ref="carousel" className="infocarousel"
					      data={this.setCarouselData.bind(this, 'carousel')}
					      decorators={this.getDecorations()}
						  slideWidth={0.70}
					      cellAlign="center"
						  dragging={true}>
					{this.renderTickets()}
				</Carousel>
			</Dialog>
		);
	}
});