import React    from 'react/addons';
import Carousel from 'nuka-carousel';
import markdown from 'markdown';
import throttle from 'lodash.throttle';
import page     from 'page';
import immutable from 'immutable';

import Board from '../models/board';

import Dialog      from '../components/dialog';
import Avatar      from '../components/avatar';
import Navigation  from '../components/navigation';

import listener from '../mixins/listener';

import CommentAction from '../actions/comment';
import CommentStore  from '../stores/comment';
import BoardStore    from '../stores/board';

import BoardAction      from '../actions/board';
import BroadcastAction  from '../actions/broadcast';

/**
 *
 */
export default React.createClass({
	mixins: [ Carousel.ControllerMixin, listener(CommentStore, BoardStore) ],

	propTypes: {
		boardID: React.PropTypes.string.isRequired
	},

	getInitialState() {
		return Object.assign(this.getState());
	},

	getState() {
		return {
			board: BoardStore.getBoard(this.props.boardID) || new Board()
		}
	},

	onChange() {
		this.setState(this.getState());
	},

	backToBoard() {
		page.show(`/boards/${this.props.boardID}`);
	},

	componentDidMount() {
		BoardAction.load(this.props.boardID);
	},

	sendTicketsForReview() {
		return this.filterTickets().size > 0 ? this.filterTickets() :
		immutable.List([{
				heading: 'Nothing here.',
				content: 'Create some tickets to review them here.',
				color: '#72BDBB'
		}]);
	},

	filterTickets() {
		return this.state.board.tickets.filter((ticket) => {
			return ticket.heading || ticket.content || ticket.comments > 0
		});
	},

	getDecorations() {
		return [
			{
				component: React.createClass({
					onKeyDown(e) {
						let key = e.keyCode ? e.keyCode : e.which;
						if (key === 39) {
							this.props.nextSlide();
						}else if (key === 37) {
							this.props.previousSlide();
						}
					},

					componentDidMount() {
						document.addEventListener('keydown', this.onKeyDown);
					},

					componentWillUnmount() {
						document.removeEventListener('keydown', this.onKeyDown);
					},

					render() {
						let style = { opacity: 0 };

						if(this.props.currentSlide !== 0 && this.props.slideCount > 0) {
							style = { opacity: 1, cursor: 'pointer' }
						}
						return (
							<span style={ style }
							onClick={this.props.previousSlide}
							className="fa fa-chevron-left" />
						);
					}
				}),

				position: 'CenterLeft',

				style: { padding: 10 }
			},
			{
				component: React.createClass({
					render() {
						let style = { opacity: 0 };
						if(this.props.currentSlide !== --this.props.slideCount) {
							style = { opacity: 1, cursor: 'pointer' }
						}
						return (
							<span style={style}
							onClick={this.props.nextSlide}
							className="fa fa-chevron-right" />
						);
					}
				}),

				position: 'CenterRight',

				style: { padding: 10 }
			}
		];
	},

	renderComments(ticket, index, currentSlide) {
		if(currentSlide === index) {
			if(CommentStore.getComments(ticket.id).size === 0) {
						
				// this is kind of anti-pattern since, we are not using any
				// special component for the ticket ...
				CommentAction.loadComments(this.props.boardID, ticket.id);
			}
			return CommentStore.getComments(ticket.id).map((comment) => {
				let user     = comment.createdBy;
				let content  = comment.message;
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
			});
		}
	},

	renderTickets() {
		let currentSlide = this.state.carousels.carousel ?
			this.state.carousels.carousel.state.currentSlide : 0;

		//this has to be converted to JS... the carousel module uses the deprecated
		//.length somewhere and will drown the whole view in
		//warnings if it is given immutable data. Dunno lol
		return this.sendTicketsForReview().toJS().map((ticket, index) => {
			if(!ticket.heading && !ticket.content) ticket.heading = "Empty ticket";

			let markupContent = markdown.markdown.toHTML(ticket.content).replace(/<a href="/g, '<a target="_blank" href="');
			let dialogClasses = index !== currentSlide ? 'review-dialog'
					: 'review-dialog active';
			let ticketColor = { backgroundColor: ticket.color };
			let ticketNumber = <span className="ticket-number">
					{ `${index+1} / ${this.sendTicketsForReview().size}` }
				</span>;
			return (
				<div key={ticket.id} className="review-dialog-container">
					<div className={dialogClasses}>
						<section style={ticketColor}
							className="review-dialog-header"/>
						<div className="content-wrapper">
							{ticketNumber}
							<p className="ticket-header-text"
									title={ticket.heading}>
								{ticket.heading}
							</p>
							<span className="review-dialog-content"
								dangerouslySetInnerHTML={{ __html: markupContent }}>
							</span>
							<section className="review-dialog-comments">
								<section className="review-comment-wrapper">
									{this.renderComments(ticket, index, currentSlide)}
								</section>
							</section>
						</div>
					</div>
				</div>
			);
		})
	},

	render() {
		console.log('huehu')
		if(!this.state.board || !this.state.board.tickets.size) return null;

		return (
			<div className="review">
				<Navigation title={this.state.board.name} />
				<span onClick={this.backToBoard}
				className="fa fa-fw fa-arrow-left board-link">
					To board
				</span>
				<div id="content">
					<Carousel ref="carousel" className="infocarousel"
							data={this.setCarouselData.bind(this, 'carousel')}
							decorators={this.getDecorations()}
							slideWidth={0.70}
							cellAlign="center"
							dragging={true}>
						{this.renderTickets()}
					</Carousel>
				</div>
			</div>
		);
	}
});
