import React		from 'react/addons';
import Carousel		from 'nuka-carousel';
import Dialog		from '../../components/dialog';
import Dropdown 	from '../dropdown';

import BoardStore from '../../stores/board';
import UserStore  from '../../stores/user';

/**
 *
 */

export default React.createClass({
	propTypes: {
		board: (props) => {
			if(!props.board instanceof Board) throw new Error();
		}
	},

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
		let role = BoardStore.getUserRole(this.props.board.id, UserStore.getUser().id) === 'admin' ?
						'admin' : 'user';

		this.el.className =
			`info-view-active slide-${this.state.carousels.carousel.state.currentSlide}-${role}`;

		this.currentSlide = this.state.carousels.carousel.state.currentSlide;
	},

	getDecorator() {
		return [{
	    component: React.createClass({
	      render() {
	        var self = this;
	        var indexes = this.getIndexes(self.props.slideCount, self.props.slidesToScroll);
	        return (
	          <ul>
	            {
	              indexes.map(function(index) {
	                return (
	                  <li style={{ listStyleType: 'none',display: 'inline-block' }}
						  className={(self.props.currentSlide === index) ? 'info-button info-button-active' : 'info-button'}
						  key={index}>
	                    <button
	                      onClick={self.props.goToSlide.bind(null, index)}>
	                      &bull;
	                    </button>
	                  </li>
	                )
	              })
	            }
	          </ul>
	        )
	      },
	      getIndexes(count, inc) {
	        var arr = [];
	        for (var i = 0; i < count; i += inc) {
	          arr.push(i);
	        }
	        return arr;
	      }
	    }),
	    position: 'BottomCenter'
	  }]
	},

	render() {
		let dropitems = [
			{ icon: 'user',            content: 'Profile'  },
			{ icon: 'language',        content: 'Localization'  },
			{ icon: 'bullhorn',        content: 'Feedback'  },
			{ icon: 'question-circle', content: 'About' },
			{ icon: 'sign-out',        content: 'Logout'  }
		];

		/*
		Second layer arrays represent the slides. First one of the
		third layer arrays contain anything other than textbox-components
		while the second ones contain the textboxes' props.
		*/
		let slidesUser = [
			(
				<section>
					<p className='pos pos-control-review-user'>Review mode</p>
					<p className='pos pos-control-export-user'>Export board</p>
					<p className='pos pos-control-magnet-user'>Snap the tickets to the grid</p>
					<p className='pos pos-control-minimap-user'>Toggle minimap</p>
				</section>
			),
			(
				<section>
					<Dropdown className='dropdown info-dropdown' show={true} items={dropitems}/>
					<p className='pos pos-dropdown-profile'>Edit your profile</p>
					<p className='pos pos-dropdown-localization'>Change language</p>
					<p className='pos pos-dropdown-feedback'>Send feedback to the developers</p>
					<p className='pos pos-dropdown-about'>Show information about Contriboard</p>
					<p className='pos pos-dropdown-logout'>Log out</p>
				</section>
			),
			(
				<section>
					<p className='pos pos-ticket-click'>Double tap the board to create a ticket</p>

					<img draggable="false" className="info-img ticket" src="/dist/assets/img/info/ticket.png" />
					<p className='pos pos-ticket-new-click'>You can double click the ticket to edit it</p>

					<img draggable="false" className="info-img ticket-new" src="/dist/assets/img/info/ticket-new.png" />
					<p className='pos pos-ticket-color'>Ticket color</p>
					<p className='pos pos-ticket-header'>Ticket header</p>
					<p className='pos pos-ticket-content'>Ticket content</p>
					<p className='pos pos-ticket-comments'>Amount of comments on the ticket</p>
				</section>
			),
			(
				<section>
					<img draggable="false" className="info-img ticket-edit" src="/dist/assets/img/info/edit-ticket.png" />
					<p className='pos pos-ticket-edit-color'>Select the ticket's color</p>
					<p className='pos pos-ticket-edit-header'>Edit the ticket's title</p>
					<p className='pos pos-ticket-edit-content'>Edit the ticket's content</p>
					<p className='pos pos-ticket-edit-comment-add'>Add a comment to the ticket</p>
					<p className='pos pos-ticket-edit-comment-area'>Comments added to the ticket</p>
					<p className='pos pos-ticket-edit-cancel'>Cancel changes and return to the board'</p>
					<p className='pos pos-ticket-edit-done'>Save the changes and return to the board</p>
					<p className='pos pos-ticket-edit-delete'>Delete the ticket</p>
				</section>
			),
			(
				<section>
					<img draggable="false" className="info-img review" src="/dist/assets/img/info/review-ticket.png" />
					<p className='pos pos-review-content'>Tickets in Review Mode</p>
					<p className='pos pos-review-arrows'>Use the arrows to navigate the presentation mode </p>
				</section>
			),
			(
				<section>
					<img draggable="false" className="info-img board-export" src="/dist/assets/img/info/export-board.png" />
					<p className='pos pos-export-format'>Select an file format and download the board</p>
					<p className='pos pos-export-done'>Return to the board</p>
				</section>
			)
		];

		let slidesAdmin = [
			(
				<section>
					<p className='pos pos-control-back-admin'>Return to workspace</p>
					<p className='pos pos-control-edit-admin'>Edit board</p>
					<p className='pos pos-control-share-admin'>Share board</p>
					<p className='pos pos-control-review-admin'>Review mode</p>
					<p className='pos pos-control-export-admin'>Export board</p>
					<p className='pos pos-control-magnet-admin'>Snap the tickets to the grid</p>
					<p className='pos pos-control-minimap-admin'>Toggle minimap</p>
				</section>
			),
			(
				<section>
					<Dropdown className='dropdown info-dropdown' show={true} items={dropitems}/>
					<p className='pos pos-dropdown-profile'>Edit your profile</p>
					<p className='pos pos-dropdown-localization'>Change language</p>
					<p className='pos pos-dropdown-feedback'>Send feedback to the developers</p>
					<p className='pos pos-dropdown-about'>Show information about Contriboard</p>
					<p className='pos pos-dropdown-logout'>Log out</p>
				</section>
			),
			(
				<section>
					<p className='pos pos-ticket-click'>Double tap the board to create a ticket</p>

					<img draggable="false" className="info-img ticket" src="/dist/assets/img/info/ticket.png" />
					<p className='pos pos-ticket-new-click'>You can double click the ticket to edit it</p>

					<img draggable="false" className="info-img ticket-new" src="/dist/assets/img/info/ticket-new.png" />
					<p className='pos pos-ticket-color'>Ticket color</p>
					<p className='pos pos-ticket-header'>Ticket header</p>
					<p className='pos pos-ticket-content'>Ticket content</p>
					<p className='pos pos-ticket-comments'>Amount of comments on the ticket</p>
				</section>
			),
			(
				<section>
					<img draggable="false" className="info-img ticket-edit" src="/dist/assets/img/info/edit-ticket.png" />
					<p className='pos pos-ticket-edit-color'>Select the ticket\'s color</p>
					<p className='pos pos-ticket-edit-header'>Edit the ticket\'s title</p>
					<p className='pos pos-ticket-edit-content'>Edit the ticket\'s content</p>
					<p className='pos pos-ticket-edit-comment-add'>Add a comment to the ticket</p>
					<p className='pos pos-ticket-edit-comment-area'>Comments added to the ticket</p>
					<p className='pos pos-ticket-edit-cancel'>Cancel changes and return to the board'</p>
					<p className='pos pos-ticket-edit-done'>Save the changes and return to the board</p>
					<p className='pos pos-ticket-edit-delete'>Delete the ticket</p>
				</section>
			),
			(
				<section>
					<img draggable="false" className="info-img board-edit" src="/dist/assets/img/info/edit-board.png" />
					<p className='pos pos-board-name'>Edit the name of the board</p>
					<p className='pos pos-board-minimap'>Toggles a minimap of the board</p>
					<p className='pos pos-board-background'>Change the background of the board</p>
					<p className='pos pos-board-background-custom'>Enter a URL to a custom background image</p>
					<p className='pos pos-board-size'>Set the width and the height of your board</p>
					<p className='pos pos-board-done'>Save your changes and return to the board</p>
				</section>
			),
			(
				<section>
					<img draggable="false" className="info-img board-share" src="/dist/assets/img/info/share-board.png" />
					<p className='pos pos-share-link'>Generate a share link to share the board</p>
					<p className='pos pos-share-done'>Return to the board</p>
				</section>
			),
			(
				<section>
					<img draggable="false" className="info-img review" src="/dist/assets/img/info/review-ticket.png" />
					<p className='pos pos-review-content'>Tickets in Review Mode</p>
					<p className='pos pos-review-arrows'>Use the arrows to navigate the presentation mode </p>
				</section>
			),
			(
				<section>
					<img draggable="false" className="info-img board-export" src="/dist/assets/img/info/export-board.png" />
					<p className='pos pos-export-format'>Select an file format and download the board</p>
					<p className='pos pos-export-done'>Return to the board</p>
				</section>
			)
		];

		let slides = BoardStore.getUserRole(this.props.board.id, UserStore.getUser().id) === 'admin' ?
						slidesAdmin : slidesUser;
		return (
			<Dialog viewProfile='info' onDismiss={this.props.onDismiss}>
				<Carousel ref='carousel' className='carousel-info'
						  data={this.setCarouselData.bind(this, 'carousel')}
						  dragging={true}
						  decorators={this.getDecorator()}>

					{slides.map((slide, index) => {
						return (
							<div className="infospace" key={index}>
								{slide}
							</div>
					);
				})}
				</Carousel>
			</Dialog>
		);
	}
});
