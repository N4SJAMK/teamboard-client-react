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

	getInitialState(){
		return { currentSlide: null }
	},

	componentWillMount() {
		this.el = document.getElementById('application');
		this.el.className = 'review-active';
	},

	componentWillUnmount(){
		this.el.className = '';
	},

	render() {
		return (
			<Dialog className="info" viewProfile="review"
					onDismiss={this.props.onDismiss}>
				<Carousel ref="carousel" className="infocarousel"
					data={this.setCarouselData.bind(this, 'carousel')}>

					{this.props.tickets.map((item) => {
						let markupContent = markdown.markdown.toHTML(item.content);
						if (markupContent.includes('<a href='))
							markupContent =
								markupContent.replace(/<a href="/g, '<a target="_blank" href="');

					return (
					<div className="review-dialog">
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
