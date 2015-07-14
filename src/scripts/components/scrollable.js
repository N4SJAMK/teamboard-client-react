import React   from 'react/addons';
import IScroll from 'iscroll';

import Board   from '../models/board';
import Minimap from '../components/minimap';

/**
 * TODO Remove the dependency of 'Board', just a simple component which makes
 *      a 'Scrollable' area and attaches the given 'minimap' to it.
 */
export default React.createClass({
	propTypes: {
		board: (props) => {
			if(!props.board instanceof Board) throw new Error();
		},
		minimap:  React.PropTypes.bool,
		children: React.PropTypes.element.isRequired
	},

	getDefaultProps() {
		return { minimap: false }
	},

	getInitialState() {
		return { offset: { x: 0, y: 0 } }
	},

	componentDidMount() {
		// Attach 'IScroll' to this element. Note that we also attach a Minimap
		// in the form of 'indicators', with an interactive Cursor.
		this.scroller = new IScroll(this.getDOMNode(), {
			scrollX:    true,
			scrollY:    true,
			freeScroll: true,
			indicators: {
				el:          this.refs.minimap.getDOMNode(),
				shrink:      false,
				resize:      false,
				interactive: true
			}
		});

		// Force the initial calculation of size for the 'cursor'.
		this.resizeMinimapCursor();

		// If we want to support IE8 and below, we have to use 'attachEvent'
		// instead of 'addEventListener', but let's not...
		window.addEventListener('resize', this.resizeMinimapCursor);

		// Keep track of the scroll position, which is transferred via 'props'
		// to the 'scrollable' element.
		this.scroller.on('scrollEnd', () => {
			// TODO Do we need to try and reuse the same object reference? This
			//      could probably prevent some unnecessary re-renders.
			this.setState({
				offset: { x: this.scroller.x, y: this.scroller.y }
			});
		});
	},

	componentWillUnmount() {
		this.scroller.destroy();
		this.scroller = null;

		window.removeEventListener('resize', this.resizeMinimapCursor);
	},

	componentDidUpdate(prev) {
		// If the minimap was toggled 'shown', we need to recalculate.
		if(!prev.minimap && this.props.minimap) {
			return this.resizeMinimapCursor();
		}

		let prevsize = prev.board.size;
		let nextsize = this.props.board.size;

		// If the size of the board changes, we need to refresh the scroller.
		let deltaWidth  = prevsize.width  - nextsize.width;
		let deltaHeight = prevsize.height - nextsize.height;

		if(deltaWidth !== 0 || deltaHeight !== 0) {
			return this.resizeMinimapCursor();
		}
	},

	/**
	 * Resizes the width and height for the 'cursor' element so that it matches
	 * the window size and orientation. Additionally invokes the 'refresh'
	 * method for the attached 'IScroll' instance.
	 */
	resizeMinimapCursor() {
		if(this.props.minimap) {
			this.refs.minimap.resizeCursor({
				width:  this.getDOMNode().clientWidth,
				height: this.getDOMNode().clientHeight
			});
		}
		return this.scroller.refresh();
	},

	render() {
		let props = {
			minimap: {
				show:          this.props.minimap,
				board:         this.props.board,
				isTicketSized: true
			}
		}
		return (
			<div className="scrollable">
				{this.renderScrollableElement()}
				<Minimap ref="minimap" {...props.minimap} />
			</div>
		);
	},

	/**
	 * Renders the 'scrollable' element. The child is enhanced with an 'offset'
	 * property.
	 */
	renderScrollableElement() {
		return React.Children.map(this.props.children, (child) => {
			return React.addons.cloneWithProps(child, {
				offset: this.state.offset
			});
		});
	}
});
