import React from 'react';

import UserStore  from '../stores/user';
import BoardStore from '../stores/board';

import BoardAction from '../actions/board';

import listener from '../mixins/listener';

import Navigation   from '../components/navigation';
import Broadcaster  from '../components/broadcaster';
import BoardPreview from '../components/board-preview';

/**
 *
 */
export default React.createClass({
	mixins: [
		listener(UserStore, BoardStore)
	],

	onChange() {
		return this.setState(this.getState());
	},

	getState() {
		return {
			boards: BoardStore.getBoards()
		}
	},

	getInitialState() {
		return this.getState();
	},

	componentDidMount() {
		BoardAction.load();
	},

	createBoard() {
		return BoardAction.create({ size: { width: 10, height: 10 } });
	},

	render() {
		return (
			<div className="view view-workspace">
				<Broadcaster />
				<Navigation showHelp={false} title="Contriboard" />
				<div id="content" className="content">
					<div className="new-board board-preview"
							onClick={this.createBoard}>
						<span className="fa fa-fw fa-plus" />
					</div>
					{this.renderBoardPreviews()}
				</div>
			</div>
		);
	},

	renderBoardPreviews() {
		return this.state.boards.reverse().map(function(board) {
			return <BoardPreview key={board.id} board={board} />;
		});
	}
});
