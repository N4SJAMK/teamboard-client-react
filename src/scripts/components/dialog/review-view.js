import React		from 'react/addons';
import Carousel		from 'nuka-carousel';
import Dialog		from '../../components/dialog';
import markdown     from 'markdown';

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
		return (
			<Dialog className="info" viewProfile="review"
					onDismiss={this.props.onDismiss}>
				<Carousel ref="carousel" className="infocarousel"
					data={this.setCarouselData.bind(this, 'carousel')}>

					{this.props.tickets.map((item, index) => {
						let markupContent = markdown.markdown.toHTML(item.content);
						if (markupContent.includes('<a href='))
							markupContent =
								markupContent.replace(/<a href="/g, '<a target="_blank" href="');
						let dialogClasses = index !== this.currentSlide ?
							'review-dialog'
							: 'review-dialog active';
							console.log(this.currentSlide)
					return (
					<div className={dialogClasses}>
						<section className="review-dialog-header">
							{item.heading}
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
					);
				})}
				</Carousel>
			</Dialog>
		);
	}
});
