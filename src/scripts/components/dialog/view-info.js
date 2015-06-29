import React		from 'react/addons';
import Carousel		from 'nuka-carousel';
import Dialog		from '../../components/dialog';
import TextBoxes	from './text-box';
import Dropdown 	from '../dropdown';

/**
 *
 */

export default React.createClass({
	mixins: [ Carousel.ControllerMixin ],
	getInitialState(){
		return { currentSlide: null }
	},

	componentDidMount() {
		localStorage.setItem('infovisited', true);
		this.el = document.getElementById('application');
		this.el.className = 'info-view-active';
		this.avatar = document.getElementById('avatar');
		this.infobutton = document.getElementById('info');
		this.infobutton.className = 'infobutton active';
	},

	componentWillUnmount() {
		this.el.className = '';
	},

	componentDidUpdate(){
		this.el.className =
			`info-view-active slide-${this.state.carousels.carousel.state.currentSlide}`;
	},

	render() {
		let dropitems = [
			{ icon: 'user',     content: 'Profile'  },
			{ icon: 'language', content: 'Localization'  },
			{ icon: 'bullhorn', content: 'Feedback'  },
			{ icon: 'sign-out', content: 'Logout'  }
		];

		/*
		Second layer arrays represent the slides. First one of the
		third layer arrays contain anything other than textbox-components
		while the second ones contain the textboxes' props.
		*/
		let objects = [
			[
				[ <Dropdown className='infodrop' show={true} items={dropitems} /> ],
				[
					{ content: 'Return to workspace', className: 'pos-back' },
					{ content: 'Edit board', className:'pos-edit' },
					{ content: 'Share board', className:'pos-share' },
					{ content: 'Export board', className:'pos-export' },
					{ content: 'Make tickets snap to grid', className:'pos-magnet' },
					{ content: 'Toggle board overview and navigate', className:'pos-minimap' },
					{ content: 'Edit your profile', className:'pos-profile' },
					{ content: 'Change operating language', className:'pos-localization' },
					{ content: 'Send feedback to developers', className:'pos-feedback' },
					{ content: 'Logout', className:'pos-logout' }
				]
			],
			[
				[ <img draggable="false" className="imgTicket" src="/dist/assets/img/ticket.png"/>,
				<img draggable="false" className="imgEditTicket" src="/dist/assets/img/edit-ticket.png"/> ],
				[
					{ content: 'Double tap board to create a ticket.', className: 'pos-click' },
					{ content: 'Double tap a ticket to edit it.', className:'pos-ticket' },
					{ content: 'Select a color for your ticket.', className:'pos-color' },
					{ content: 'Edit the contents of a ticket.', className:'pos-content' }
				]
			],
			[
				[ <img draggable="false" className="imgInfo" src="/dist/assets/img/edit-board.png"/> ],
				[
					{ content: 'Create or edit the name of this board.', className: 'pos-boardname' },
					{ content: 'Board preview.', className:'pos-boardpreview' },
					{ content: 'Edit the background appearance of this board.', className:'pos-boardbg' },
					{ content: 'Change the size of this board.', className:'pos-boardmeasures' }
				]
			],
			[
				[ <img draggable="false" className="imgInfo" src="/dist/assets/img/share-board.png"/> ],
				[
					{ content: 'Hit Share to get the URL of this board for sharing.', className: 'pos-format' }
				]
			],
			[
				[ <img draggable="false" className="imgInfo" src="/dist/assets/img/export-board.png"/> ],
				[
					{ content: 'Select an export format and hit Export to download the file.', className: 'pos-format' }
				]
			]
		];

		return (
			<Dialog className="info" viewProfile="info"
					onDismiss={this.props.onDismiss}>
				<Carousel ref="carousel" className="infocarousel"
					data={this.setCarouselData.bind(this, 'carousel')}>

					{objects.map((item) => {
					return (
					<div>
						<TextBoxes items={item[1]} objects={item[0]}/>
					</div>
					);
				})}
				</Carousel>
			</Dialog>
		);
	}
});
