import React		from 'react/addons';
import Carousel		from 'nuka-carousel';
import Dialog		from '../../components/dialog';

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

	render() {

		/*
		Second layer arrays represent the slides. First one of the
		third layer arrays contain anything other than textbox-components
		while the second ones contain the textboxes' props.
		*/
		return (
			<Dialog className="info" infoView={true}
					onDismiss={this.props.onDismiss}>
				<Carousel ref="carousel" className="infocarousel"
					data={this.setCarouselData.bind(this, 'carousel')}>

					{this.props.tickets.map((item) => {
					return (
					<div>
						<div>
							{item.content}
						</div>
						<div>
							{item.comments}
						</div>
					</div>
					);
				})}
				</Carousel>
			</Dialog>
		);
	}
});
