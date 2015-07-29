import page      from 'page';
import React     from 'react';
import immutable from 'immutable';

import Board        from '../models/board';
import BoardStore   from '../stores/board';
import UserStore    from '../stores/user';
import TicketAction from '../actions/ticket';

import Control           from '../components/control';
import Minimap           from '../components/minimap';
import EditBoardDialog   from '../components/dialog/edit-board';
import RemoveBoardDialog from '../components/dialog/remove-board';

import localeMixin from '../mixins/locale';
/**
 *
 */
export default React.createClass({
	mixins: [
			localeMixin()
	],

	propTypes: {
		board: (props) => {
			if(!props.board instanceof Board) throw Error();
		}
	},

	getInitialState() {
		return {
			showEditBoardDialog:   false,
			showRemoveBoardDialog: false
		}
	},

	componentDidMount() {
		// If userstore is empty then go back to login
		if (!UserStore.getUser()) return page.redirect('/login');
	},

	shouldComponentUpdate(nextProps, nextState) {
		let prevProps = this.props;
		let prevState = this.state;

		let havePropsChanged = (
			!immutable.is(prevProps.board, nextProps.board)
		);
		let hasStateChanged = (
			prevState.showEditBoardDialog   !== nextState.showEditBoardDialog ||
			prevState.showRemoveBoardDialog !== nextState.showRemoveBoardDialog
		);
		return havePropsChanged || hasStateChanged;
	},

	showBoard() {
		if(!this.props.board.id.startsWith('dirty_')) {
			return page.show(`/boards/${this.props.board.id}`);
		}
	},

	showDialog(dialog) {
		if(!this.props.board.id.startsWith('dirty_')) {
			this.setState({ [`show${dialog}`]: !this.state[`show${dialog}`] });
		}
	},

	render() {
		let board = this.props.board;

		let editBoardDialog = !this.state.showEditBoardDialog ? null : (
			<EditBoardDialog board={board}
				onDismiss={this.showDialog.bind(this, 'EditBoardDialog')} />
		);
		let removeBoardDialog = !this.state.showRemoveBoardDialog ? null : (
			<RemoveBoardDialog board={board}
				onDismiss={this.showDialog.bind(this, 'RemoveBoardDialog')} />
		);

		return (
			<div className="board-preview">
				<div className="minimap-container" onClick={this.showBoard}>
					<Minimap board={board} />
				</div>
				<div className="name" onClick={this.showBoard}>
					{board.name}
				</div>
				{editBoardDialog}
				{removeBoardDialog}
				{this.renderControls()}
			</div>
		);
	},

	renderControls() {
		let controls = [
			{
				icon:    'trash',
				active:  this.state.showRemoveBoardDialog,
				onClick: this.showDialog.bind(this, 'RemoveBoardDialog')
			},
			{
				icon:    'pencil',
				active:  this.state.showEditBoardDialog,
				onClick: this.showDialog.bind(this, 'EditBoardDialog')
			}
		];

		let user  = UserStore.getUser();
		let admin = BoardStore.getBoardAdmin(this.props.board.id);

		if(admin.user && admin.user.id === user.id) {
			return (
				<div className="controls">
					{controls.map(function(ctrl, index) {
						return <Control key={index} {...ctrl} />;
					})}
				</div>
			);
		}

		return (
			<div className="controls ownedby">
				{`${this.locale('OWNEDBY')}: ${admin.user.name}`}
			</div>
		);
	}
});
