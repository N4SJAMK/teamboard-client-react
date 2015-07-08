import React from 'react/addons';

import Board       from '../../models/board';
import BoardAction from '../../actions/board';

import Dialog from '../../components/dialog';

import settingsMixin from '../../mixins/settings';

/**
 *
 */
export default React.createClass({
	mixins: [ React.addons.PureRenderMixin, React.addons.LinkedStateMixin, settingsMixin() ],

	propTypes: {
		board: (props) => {
			if(!props.board instanceof Board) throw new Error();
		},
		onDismiss: React.PropTypes.func.isRequired
	},

	remove(event) {
		event.preventDefault();
		BoardAction.delete(this.props.board);
		return this.props.onDismiss();
	},

	dismiss(event) {
		if(event) {
			event.preventDefault();
		}
		return this.props.onDismiss();
	},

	getContentText(){
		if(this.props.board.name) {
			return this.state.locale.REMOVEBOARD_WITHNAME.replace('{board_name}', this.props.board.name);
		}

		return this.state.locale.REMOVEBOARD_WITHOUTNAME;
	},

	render() {
		let remove  = this.remove;
		let dismiss = this.dismiss;

		return (
			<Dialog className="dialog-remove-board" onDismiss={dismiss}>
				<section className="dialog-header">
					{this.state.locale.REMOVEBOARD_TITLE}
				</section>
				<section className="dialog-content">
					<p>{this.getContentText()}</p>
				</section>
				<section className="dialog-footer">
					<button className="btn-neutral" onClick={dismiss}>
						{this.state.locale.CANCELBUTTON}
					</button>
					<button className="btn-danger" onClick={remove}>
						{this.state.locale.REMOVEBOARD_REMOVE}
					</button>
				</section>
			</Dialog>
		);
	}
});
