import React		from 'react/addons';
import Carousel		from 'nuka-carousel';
import Dialog		from '../../components/dialog';
import Dropdown 	from '../dropdown';

import BoardStore from '../../stores/board';
import UserStore  from '../../stores/user';

import Board from '../../models/board';

import localeMixin from '../../mixins/locale';

/**
 *
 */
export default React.createClass({
	mixins: [
		Carousel.ControllerMixin,
		localeMixin()
	],

	propTypes: {
		board: (props) => {
			if(!props.board instanceof Board) throw new Error();
		}
	},

	getInitialState(){
		return {
			currentSlide: 0,
			role:         this.getRole()
		}
	},

	componentDidMount() {
		this.el = document.getElementById('application');
		this.el.className = 'info-view-active';
	},

	componentWillUnmount() {
		this.el.className = null;
	},

	componentDidUpdate() {
		if (this.state.currentSlide !== this.state.carousels.carousel.state.currentSlide) {
			this.setState({
				currentSlide: this.state.carousels.carousel.state.currentSlide
			});
		}

		this.el.className = `info-view-active slide-${this.state.currentSlide}-${this.state.role}`;
	},

	getRole() {
		return BoardStore.getUserRole(this.props.board.id, UserStore.getUser().id)
					=== 'admin' ? 'admin' : 'user';
	},

	getDecorator() {
		return [
		{
			component: React.createClass({
				getIndexes(count, inc) {
					let arr = [];
					for (let i = 0; i < count; i += inc) {
						arr.push(i);
					}
					return arr;
				},

				getClass(currentSlide, index) {
					return (currentSlide === index) ? 'info-button info-button-active' : 'info-button';
				},

				render() {
					let indexes = this.getIndexes(this.props.slideCount, this.props.slidesToScroll);
					return (
						<ul>
							{
								indexes.map((index) => {
									return (
										<li style={{ listStyleType: 'none', display: 'inline-block' }}
											className={this.getClass(this.props.currentSlide, index)}
											key={index}>
											<button onClick={this.props.goToSlide.bind(null, index)}>
												&bull;
											</button>
										</li>
									)
								})
							}
						</ul>
					)
				}
			}),
			position: 'BottomCenter'
		}
		];
	},

	getSlides() {
		let dropdownItems = [
			{
				disabled: true,
				customclass: 'profile-name',
				content: `${this.locale('DROPDOWN_HELLO')}, ${UserStore.getUser().name}`
			},
			{
				icon: 'user',
				content: this.locale('DROPDOWN_PROFILE')
			},
			{
				icon: 'language',
				content: this.locale('DROPDOWN_LOCALE')
			},
			{
				icon: 'bullhorn',
				content: this.locale('DROPDOWN_FEEDBACK')
			},
			{
				icon: 'question-circle',
				content: this.locale('DROPDOWN_ABOUT')
			},
			{
				icon: 'sign-out',
				content: this.locale('DROPDOWN_LOGOUT')
			}
		];

		if(this.state.role === 'admin') {
			return [
			(
				<section>
					<Dropdown className="dropdown info-dropdown" show={true} items={dropdownItems}/>
					<p className="pos pos-dropdown-profile">{this.locale('INFO_DROPDOWN_PROFILE')}</p>
					<p className="pos pos-dropdown-localization">{this.locale('INFO_DROPDOWN_LOCALE')}</p>
					<p className="pos pos-dropdown-feedback">{this.locale('INFO_DROPDOWN_FEEDBACK')}</p>
					<p className="pos pos-dropdown-about">{this.locale('INFO_DROPDOWN_ABOUT')}</p>
					<p className="pos pos-dropdown-logout">{this.locale('INFO_DROPDOWN_LOGOUT')}</p>
				</section>
			),
			(
				<section>
					<p className="pos pos-ticket-click">{this.locale('INFO_TICKET_CREATENEW')}</p>

					<img draggable="false" className="info-img ticket" src="/dist/assets/img/info/ticket.png" />
					<p className="pos pos-ticket-new-click">{this.locale('INFO_TICKET_TICKETEDIT')}</p>

					<img draggable="false" className="info-img ticket-new" src="/dist/assets/img/info/ticket-new.png" />
					<p className="pos pos-ticket-color">{this.locale('INFO_TICKET_COLOR')}</p>
					<p className="pos pos-ticket-header">{this.locale('INFO_TICKET_HEADER')}</p>
					<p className="pos pos-ticket-content">{this.locale('INFO_TICKET_CONTENT')}</p>
					<p className="pos pos-ticket-comments">{this.locale('INFO_TICKET_COMMENTS')}</p>
				</section>
			),
			(
				<section>
					<img draggable="false" className="info-img ticket-edit" src="/dist/assets/img/info/edit-ticket.png" />
					<p className="pos pos-ticket-edit-color">{this.locale('INFO_EDITTICKET_COLOR')}</p>
					<p className="pos pos-ticket-edit-header">{this.locale('INFO_EDITTICKET_HEADER')}</p>
					<p className="pos pos-ticket-edit-content">{this.locale('INFO_EDITTICKET_CONTENT')}</p>
					<p className="pos pos-ticket-edit-comment-add">{this.locale('INFO_EDITTICKET_COMMENTADD')}</p>
					<p className="pos pos-ticket-edit-comment-area">{this.locale('INFO_EDITTICKET_COMMENTAREA')}</p>
					<p className="pos pos-ticket-edit-cancel">{this.locale('INFO_EDITTICKET_CANCEL')}</p>
					<p className="pos pos-ticket-edit-done">{this.locale('INFO_EDITTICKET_SAVE')}</p>
					<p className="pos pos-ticket-edit-delete">{this.locale('INFO_EDITTICKET_DELETE')}</p>
				</section>
			),
			(
				<section>
					<p className="pos pos-control-back-admin">{this.locale('INFO_CONTROLS_WORKSPACE')}</p>
					<p className="pos pos-control-edit-admin">{this.locale('INFO_CONTROLS_EDITBOARD')}</p>
					<p className="pos pos-control-share-admin">{this.locale('INFO_CONTROLS_SHAREBOARD')}</p>
					<p className="pos pos-control-review-admin">{this.locale('INFO_CONTROLS_REVIEWBOARD')}</p>
					<p className="pos pos-control-export-admin">{this.locale('INFO_CONTROLS_EXPORTBOARD')}</p>
					<p className="pos pos-control-magnet-admin">{this.locale('INFO_CONTROLS_SNAP')}</p>
					<p className="pos pos-control-minimap-admin">{this.locale('INFO_CONTROLS_MINIMAP')}</p>
				</section>
			),
			(
				<section>
					<img draggable="false" className="info-img board-edit" src="/dist/assets/img/info/edit-board.png" />
					<p className="pos pos-board-name">{this.locale('INFO_EDITBOARD_NAME')}</p>
					<p className="pos pos-board-minimap">{this.locale('INFO_EDITBOARD_MINIMAP')}</p>
					<p className="pos pos-board-background">{this.locale('INFO_EDITBOARD_BACKGROUND')}</p>
					<p className="pos pos-board-background-custom">{this.locale('INFO_EDITBOARD_BACKGROUNDCUSTOM')}</p>
					<p className="pos pos-board-size">{this.locale('INFO_EDITBOARD_SIZE')}</p>
					<p className="pos pos-board-done">{this.locale('INFO_EDITBOARD_DONE')}</p>
				</section>
			),
			(
				<section>
					<img draggable="false" className="info-img board-share" src="/dist/assets/img/info/share-board.png" />
					<p className="pos pos-share-link">{this.locale('INFO_SHAREBOARD_LINK')}</p>
					<p className="pos pos-share-done">{this.locale('INFO_SHAREBOARD_DONE')}</p>
				</section>
			),
			(
				<section>
					<img draggable="false" className="info-img review" src="/dist/assets/img/info/review-ticket.png" />
					<p className="pos pos-review-content">{this.locale('INFO_REVIEW_CONTENT')}</p>
					<p className="pos pos-review-arrows">{this.locale('INFO_REVIEW_ARROWS')}</p>
				</section>
			),
			(
				<section>
					<img draggable="false" className="info-img board-export" src="/dist/assets/img/info/export-board.png" />
					<p className="pos pos-export-format">{this.locale('INFO_EXPORTBOARD_FORMAT')}</p>
					<p className="pos pos-export-done">{this.locale('INFO_EXPORTBOARD_DONE')}</p>
				</section>
			)
			];
		}

		return [
			(
				<section>
					<Dropdown className="dropdown info-dropdown" show={true} items={dropdownItems}/>
					<p className="pos pos-dropdown-profile">{this.locale('INFO_DROPDOWN_PROFILE')}</p>
					<p className="pos pos-dropdown-localization">{this.locale('INFO_DROPDOWN_LOCALE')}</p>
					<p className="pos pos-dropdown-feedback">{this.locale('INFO_DROPDOWN_FEEDBACK')}</p>
					<p className="pos pos-dropdown-about">{this.locale('INFO_DROPDOWN_ABOUT')}</p>
					<p className="pos pos-dropdown-logout">{this.locale('INFO_DROPDOWN_LOGOUT')}</p>
				</section>
			),
			(
				<section>
					<p className="pos pos-ticket-click">{this.locale('INFO_TICKET_CREATENEW')}</p>

					<img draggable="false" className="info-img ticket" src="/dist/assets/img/info/ticket.png" />
					<p className="pos pos-ticket-new-click">{this.locale('INFO_TICKET_TICKETEDIT')}</p>

					<img draggable="false" className="info-img ticket-new" src="/dist/assets/img/info/ticket-new.png" />
					<p className="pos pos-ticket-color">{this.locale('INFO_TICKET_COLOR')}</p>
					<p className="pos pos-ticket-header">{this.locale('INFO_TICKET_HEADER')}</p>
					<p className="pos pos-ticket-content">{this.locale('INFO_TICKET_CONTENT')}</p>
					<p className="pos pos-ticket-comments">{this.locale('INFO_TICKET_COMMENTS')}</p>
				</section>
			),
			(
				<section>
					<img draggable="false" className="info-img ticket-edit" src="/dist/assets/img/info/edit-ticket.png" />
					<p className="pos pos-ticket-edit-color">{this.locale('INFO_EDITTICKET_COLOR')}</p>
					<p className="pos pos-ticket-edit-header">{this.locale('INFO_EDITTICKET_HEADER')}</p>
					<p className="pos pos-ticket-edit-content">{this.locale('INFO_EDITTICKET_CONTENT')}</p>
					<p className="pos pos-ticket-edit-comment-add">{this.locale('INFO_EDITTICKET_COMMENTADD')}</p>
					<p className="pos pos-ticket-edit-comment-area">{this.locale('INFO_EDITTICKET_COMMENTAREA')}</p>
					<p className="pos pos-ticket-edit-cancel">{this.locale('INFO_EDITTICKET_CANCEL')}</p>
					<p className="pos pos-ticket-edit-done">{this.locale('INFO_EDITTICKET_SAVE')}</p>
					<p className="pos pos-ticket-edit-delete">{this.locale('INFO_EDITTICKET_DELETE')}</p>
				</section>
			),
			(
				<section>
					<p className="pos pos-control-back-admin">{this.locale('INFO_CONTROLS_WORKSPACE')}</p>
					<p className="pos pos-control-edit-admin">{this.locale('INFO_CONTROLS_EDITBOARD')}</p>
					<p className="pos pos-control-share-admin">{this.locale('INFO_CONTROLS_SHAREBOARD')}</p>
					<p className="pos pos-control-review-admin">{this.locale('INFO_CONTROLS_REVIEWBOARD')}</p>
					<p className="pos pos-control-export-admin">{this.locale('INFO_CONTROLS_EXPORTBOARD')}</p>
					<p className="pos pos-control-magnet-admin">{this.locale('INFO_CONTROLS_SNAP')}</p>
					<p className="pos pos-control-minimap-admin">{this.locale('INFO_CONTROLS_MINIMAP')}</p>
				</section>
			),
			(
				<section>
					<img draggable="false" className="info-img review" src="/dist/assets/img/info/review-ticket.png" />
					<p className="pos pos-review-content">{this.locale('INFO_REVIEW_CONTENT')}</p>
					<p className="pos pos-review-arrows">{this.locale('INFO_REVIEW_ARROWS')}</p>
				</section>
			),
			(
				<section>
					<img draggable="false" className="info-img board-export" src="/dist/assets/img/info/export-board.png" />
					<p className="pos pos-export-format">{this.locale('INFO_EXPORTBOARD_FORMAT')}</p>
					<p className="pos pos-export-done">{this.locale('INFO_EXPORTBOARD_DONE')}</p>
				</section>
			)
		];
	},

	render() {
		return (
			<Dialog viewProfile="info" onDismiss={this.props.onDismiss}>
				<Carousel ref="carousel" className="carousel-info"
						data={this.setCarouselData.bind(this, 'carousel')}
						dragging={true}
						decorators={this.getDecorator()}>

					{
						this.getSlides().map((slide, index) => {
							return (
								<div className="infospace" key={index}>
									{slide}
								</div>
							);
						})
					}
				</Carousel>
			</Dialog>
		);
	}
});
