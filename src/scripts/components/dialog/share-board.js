import React from 'react/addons';

import Board       from '../../models/board';
import BoardAction from '../../actions/board';
import Dialog      from '../../components/dialog';

import localeMixin  from '../../mixins/locale';

/**
 *
 */
export default React.createClass({
	mixins: [
		React.addons.PureRenderMixin,
		React.addons.LinkedStateMixin,
		localeMixin()
	],

	propTypes: {
		board: (props) => {
			if(!props.board instanceof Board) throw new Error();
		},
		onDismiss: React.PropTypes.func.isRequired
	},

	submit(event) {
		event.preventDefault();
		return this.props.onDismiss();
	},

	hide() {
		BoardAction.revokeAccessCode({ id: this.props.board.id });
	},

	share() {
		BoardAction.generateAccessCode({ id: this.props.board.id });

		window.setTimeout(this.highlight, 50);
	},

	highlight() {
		let input = this.refs.shareInput.getDOMNode();
		input.setSelectionRange(0, input.value.length);
	},

	render() {
		let id   = this.props.board.id;
		let code = this.props.board.accessCode;

		let sharedURL = code !== null && code.length > 0
			? location.protocol + '//' + location.host + '/boards/' + id + '/access/' + code + ''
			: '';

		let shareButtonClass = sharedURL.length > 0 ? 'neutral' : 'secondary';
		let shareButtonClick = sharedURL.length > 0 ? this.hide : this.share;
		let shareButton = (
			<button className={`btn-${shareButtonClass}`}
					onClick={shareButtonClick}>
				{ sharedURL.length > 0 ?
					this.locale('SHAREBOARD_HIDE') :
					this.locale('SHAREBOARD_SHOW') }
			</button>
		);

		return (
			<Dialog className="dialog-edit-board"
					onDismiss={this.props.onDismiss[this.state.locale]}>
				<section className="dialog-header">
					{this.locale('SHAREBOARD_TITLE')}
				</section>
				<section className="dialog-content">

					<label htmlFor="board-share">
						{this.locale('SHAREBOARD_LINK')}
					</label>
					<section className="input-group">
						<input ref="shareInput"
							onClick={this.highlight}
							name="board-share"
							placeholder={this.locale('SHAREBOARD_LINK')}
							value={sharedURL}
							tabIndex={-1}/>
						{shareButton}
					</section>

				</section>
				<section className="dialog-footer">
					<button className="btn-primary" onClick={this.submit}>
						{this.locale('DONEBUTTON')}
					</button>
				</section>
			</Dialog>
		);
	}
});
