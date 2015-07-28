import React  from 'react/addons';
import Hammer from 'hammerjs';

/**
 *
 */
export default React.createClass({
	mixins: [ React.addons.PureRenderMixin ],
	//Since this component is used for the infolayer, infoView is true while it
	//is active and dictates whether a form gets rendered within the dialog
	//or not.
	propTypes: {
		viewProfile: React.PropTypes.string,
		className: React.PropTypes.string,
		onDismiss: React.PropTypes.func
	},

	getDefaultProps() {
		return {
			viewProfile: '',
			className: '',
			onDismiss: () => {}
		}
	},

	componentDidMount() {
		// Create a container for the actual modal content from 'renderDialog'
		// and render it into the DOM tree.
		let container       = document.createElement('div');
		container.className = 'dialog-container';

		this.target = document.body.appendChild(container);
		React.render(this.renderDialog(), this.target);

		// Make sure any clicks, taps and whatever on the 'overlay' trigger the
		// 'onDismiss' handler. Pointer events on the 'content' should not
		// trigger the 'onDismiss' handler.
		this.hammer = new Hammer(this.target.firstChild);
		this.hammer.on('tap', (event) => {
			if(event.target.className === 'dialog-overlay') {
				return this.props.onDismiss();
			}
		});
	},

	componentWillUnmount() {
		React.unmountComponentAtNode(this.target);
		document.body.removeChild(this.target);
	},

	componentDidUpdate() {
		if(this.isMounted() && this.target) {
			React.render(this.renderDialog(), this.target);
		}
	},

	onSubmit(event) {
		return event.preventDefault();
	},

	render() {
		return (
			<span className="dialog-placeholder" />
		);
	},

	renderDialog() {
		let classForm = this.props.viewProfile === 'info' ?
				'info ' : `dialog ${this.props.className}`;

		if(this.props.viewProfile === 'profile'){
			return (
				<div className="dialog-overlay">
						{this.props.children}
				</div>
			);
		} else {
			return (
				<div className="dialog-overlay">
					<form className={classForm}
							onSubmit={this.onSubmit}>
						{this.props.children}
					</form>
				</div>
			);
		}
	}
});
