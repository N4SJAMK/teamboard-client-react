import React		from 'react/addons';
import Carousel		from 'nuka-carousel';
import Dialog		from '../../components/dialog';
import markdown     from 'markdown';
import Scrollable   from './scrollable';

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

	render() {
	var Decorators = [{
	component: React.createClass({
		render() {
			let style = this.props.currentSlide === 0 ?
				  {opacity: 0.1}
				: {opacity: 1,
				   cursor: 'pointer'}
		return (
			<span style={style}
			onClick={this.props.previousSlide} className="fa fa-chevron-left" />
		)
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
			let style = this.props.currentSlide === --this.props.slideCount ?
				  {opacity: 0.1}
				: {opacity: 1,
				   cursor: 'pointer'}
		return (
			<span style={style}
			onClick={this.props.nextSlide} className="fa fa-chevron-right" />
		)
		}
	}),
	position: 'CenterRight',
	style: {
		padding: 10
	}
	}];
		return (
			<Dialog className="info" viewProfile="review"
					onDismiss={this.props.onDismiss}>
				<Carousel ref="carousel" className="infocarousel"
					data={this.setCarouselData.bind(this, 'carousel')}
					decorators={Decorators} slideWidth={0.70} cellAlign="center">
					{this.props.tickets.map((item, index) => {
						let markupContent = markdown.markdown.toHTML(item.content);
						if (markupContent.includes('<a href='))
							markupContent =
								markupContent.replace(/<a href="/g, '<a target="_blank" href="');
						let dialogClasses = index !== this.currentSlide ?
							'review-dialog'
							: 'review-dialog active';
						let ticketColor = {backgroundColor: item.color, height: 30};
						console.log(this.state);
					return (
					<div className="review-dialog-container">
						<div className={dialogClasses}>
							<div style={ticketColor}/>
							<section className="review-dialog-header">
								<p>{item.heading}</p>
							</section>
							<section className="review-dialog-content">
								<span dangerouslySetInnerHTML={{__html: markupContent}}/>
							</section>
							<section className="review-dialog-comments">
								<section className="review-comment-wrapper">
									{item.comments.map((comment) => {
										return (
											<div className="review-comment" key={comment.id}>
												<section>
													<p className="review-comment-username">{comment.user.username}</p>
												</section>
												<p className="review-comment-message">{comment.content}</p>
											</div>
										);
									})}
								</section>
							</section>
						</div>
					</div>
					);
				})}
				</Carousel>
			</Dialog>
		);
	}
});
