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
		this.el.className =
			`info-view-active slide-${this.state.carousels.carousel.state.currentSlide}`;

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
	                  <li style={{ listStyleType: 'none',display: 'inline-block' }} key={index}>
	                    <button className={self.getButtonClass(self.props.currentSlide === index)}
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
	      },
	      getListStyles() {
	        return {
	          position: 'relative',
	          margin: 0,
	          top: -10,
	          padding: 0
	        }
	      },
	      getButtonClass(active) {
	        return active  ? 'info-button info-button-active' : 'info-button'
	      }
	    }),
	    position: 'BottomCenter'
	  }]
	},

	/**
	 * Used for checking if user has limited or full controls
	 */
	controlsRole(){
		let currentRole = BoardStore.getUserRole(this.props.board.id, UserStore.getUser().id);

		if(currentRole === 'admin') {
			return (
				<section>
					<p className='pos pos-control-back-admin'>Return to workspace</p>
					<p className='pos pos-control-edit-admin'>Edit board</p>
					<p className='pos pos-control-share-admin'>Share board</p>
					<p className='pos pos-control-export-admin'>Export board</p>
					<p className='pos pos-control-magnet-admin'>Make tickets snap to grid</p>
					<p className='pos pos-control-minimap-admin'>Toggle board minimap</p>
				</section>
			);
		}

		return (
			<section>
				<p className='pos pos-control-export-user'>Export board</p>
				<p className='pos pos-control-magnet-user'>Make tickets snap to grid</p>
				<p className='pos pos-control-minimap-user'>Toggle board overview and navigate</p>
			</section>
		);
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
		let slides = [
			this.controlsRole(),
			(
				<section>
					<Dropdown className='dropdown info-dropdown' show={true} items={dropitems}/>
					<p className='pos pos-dropdown-profile'>Edit your profile</p>
					<p className='pos pos-dropdown-localization'>Change operating language</p>
					<p className='pos pos-dropdown-feedback'>Send feedback to developers</p>
					<p className='pos pos-dropdown-about'>Shows information about Contriboard</p>
					<p className='pos pos-dropdown-logout'>Logout</p>
				</section>
			),
			(
				<section>
					<p className='pos pos-ticket-click'>Double tap board to create a ticket</p>

					<img draggable="false" className="info-img ticket" src="/dist/assets/img/info/ticket.png" />
					<p className='pos pos-ticket-new'>This is how your new ticket looks like</p>
					<p className='pos pos-ticket-new-click'>You can double click ticket to edit it</p>

					<img draggable="false" className="info-img ticket-new" src="/dist/assets/img/info/ticket-new.png" />
					<p className='pos pos-ticket-color'>Ticket color</p>
					<p className='pos pos-ticket-header'>Ticket header</p>
					<p className='pos pos-ticket-content'>Ticket content</p>
					<p className='pos pos-ticket-comments'>Ticket comments amount</p>
				</section>
			),
			(	<section>
					<img draggable="false" className="info-img ticket-edit" src="/dist/assets/img/info/edit-ticket.png" />
					<p className='pos pos-ticket-edit-color'>Select ticket color</p>
					<p className='pos pos-ticket-edit-header'>Change ticket header</p>
					<p className='pos pos-ticket-edit-content'>Change ticket text</p>
					<p className='pos pos-ticket-edit-comment-input'>Write your comment here</p>
					<p className='pos pos-ticket-edit-comment-add'>Add comment by pressing "Add comment"</p>
					<p className='pos pos-ticket-edit-comment-all'>This area shows all ticket comments</p>
					<p className='pos pos-ticket-edit-cancel'>Pressing "Cancel" returns to board view without saving</p>
					<p className='pos pos-ticket-edit-done'>Pressing "Save" save your edits and returns to board view</p>
					<p className='pos pos-ticket-edit-delete'>Pressing "Delete" deletes this ticket from board</p>
				</section>
			),
			(
				<section>
					<img draggable="false" className="info-img ticket-edit" src="/dist/assets/img/info/edit-board.png" />
					<p className='pos pos-board-name'>Create or edit the name of this board</p>
					<p className='pos pos-board-minimap'>Shows minimap of your board</p>
					<p className='pos pos-board-background'>Select board background</p>
					<p className='pos pos-board-background-custom'>Input image URL to show custom background</p>
					<p className='pos pos-board-size'>Set width and height of your board</p>
					<p className='pos pos-board-done'>Pressing "Done" saves your edits and returns you to board view</p>
				</section>
			),
			(
				<section>
					<img draggable="false" className="info-img board-share" src="/dist/assets/img/info/share-board.png" />
					<p className='pos pos-share-link'>Link you can share for other to invite them to your board</p>
					<p className='pos pos-share-button'>Hit "Share" to generate URL for inviting other users to your board</p>
					<p className='pos pos-share-done'>Pressing "Done" returns you to board view</p>
				</section>
			),
			(
				<section>
					<img draggable="false" className="info-img board-export" src="/dist/assets/img/info/export-board.png" />
					<p className='pos pos-export-format'>Select an export format</p>
					<p className='pos pos-export-button'>Hit "Export" to export board in selected format</p>
					<p className='pos pos-export-done'>Pressing "Done" returns you to board view</p>
				</section>
			)
		];

		return (
			<Dialog className="info" infoView={true}
					onDismiss={this.props.onDismiss}>
				<Carousel ref="carousel" className="infocarousel"
						  data={this.setCarouselData.bind(this, 'carousel')}
						  dragging={true}
						  decorators={this.getDecorator()}>

					{slides.map((slide) => {
						return (
							<div className="infospace">
								{slide}
							</div>
					);
				})}
				</Carousel>
			</Dialog>
		);
	}
});
