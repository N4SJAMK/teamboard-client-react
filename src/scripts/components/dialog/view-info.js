import React		from 'react/addons';
import Carousel		from 'nuka-carousel';
import Dialog		from '../../components/dialog';
import TextBoxes	from './text-box';
import Dropdown 	from '../dropdown';

import settingsMixin from '../../mixins/settings';

/**
 *
 */

export default React.createClass({
	mixins: [ Carousel.ControllerMixin, settingsMixin() ],
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
			{ icon: 'user', 		   content: this.state.locale.DROPDOWN_PROFILE},
			{ icon: 'language',  	   content: this.state.locale.DROPDOWN_LOCALE},
			{ icon: 'bullhorn',        content: this.state.locale.DROPDOWN_FEEDBACK},
			{ icon: 'question-circle', content: this.state.locale.DROPDOWN_ABOUT},
			{ icon: 'sign-out', 	   content: this.state.locale.DROPDOWN_LOGOUT}
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
					{ content: 'INFO_TOWS', className: 'pos-back' },
					{ content: 'INFO_EDITBOARD', className:'pos-edit' },
					{ content: 'INFO_SHAREBOARD', className:'pos-share' },
					{ content: 'INFO_EXPORTBOARD', className:'pos-export' },
					{ content: 'INFO_SNAP', className:'pos-magnet' },
					{ content: 'INFO_MINIMAP', className:'pos-minimap' },
					{ content: 'INFO_PROFILE', className:'pos-profile' },
					{ content: 'INFO_LOCALE', className:'pos-localization' },
					{ content: 'INFO_FEEDBACK', className:'pos-feedback' },
					{ content: 'INFO_ABOUT', className:'pos-about' },
					{ content: 'INFO_LOGOUT', className:'pos-logout' }
				]
			],
			[
				[ <img draggable="false" className="imgTicket" src="/dist/assets/img/ticket.png"/>,
				<img draggable="false" className="imgEditTicket" src="/dist/assets/img/edit-ticket.png"/> ],
				[
					{ content: 'INFO_TAPBOARD', className: 'pos-click' },
					{ content: 'INFO_TAPTICKET', className:'pos-ticket' },
					{ content: 'INFO_TICKETCOLOR', className:'pos-color' },
					{ content: 'INFO_EDITTICKET', className:'pos-content' }
				]
			],
			[
				[ <img draggable="false" className="imgInfo" src="/dist/assets/img/edit-board.png"/> ],
				[
					{ content: 'INFO_EDITNAME', className: 'pos-boardname' },
					{ content: 'INFO_PREVIEWBOARD', className:'pos-boardpreview' },
					{ content: 'INFO_EDITBG', className:'pos-boardbg' },
					{ content: 'INFO_CHANGESIZE', className:'pos-boardmeasures' }
				]
			],
			[
				[ <img draggable="false" className="imgInfo" src="/dist/assets/img/share-board.png"/> ],
				[
					{ content: 'INFO_SHAREURL', className: 'pos-format' }
				]
			],
			[
				[ <img draggable="false" className="imgInfo" src="/dist/assets/img/export-board.png"/> ],
				[
					{ content: 'INFO_GETEXPORT', className: 'pos-format' }
				]
			]
		];

		return (
			<Dialog className="info" infoView={true}
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
