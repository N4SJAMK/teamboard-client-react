import immutable from 'immutable'
import Ticket    from '../models/ticket';

const Background = {
	NONE: {
		url:         null,
		description: 'Blank'
	},
	CUSTOM: {
		url:         null,
		description: 'Custom'
	},
	PLAY: {
		url:         '/dist/assets/img/bg/play.png',
		description: 'Play!'
	},
	SWOT: {
		url:         '/dist/assets/img/bg/swot.png',
		description: 'SWOT'
	},
	SCRUM: {
		url:         '/dist/assets/img/bg/scrum.png',
		description: 'Scrum'
	},
	KANBAN: {
		url:         '/dist/assets/img/bg/kanban.png',
		description: 'Kanban'
	},
	KEEP_DROP_TRY: {
		url:         '/dist/assets/img/bg/keep_drop_try.png',
		description: 'Keep, Drop, Try'
	},
	CUSTOMER_JOURNEY_MAP: {
		url:         '/dist/assets/img/bg/customer_journey_map.png',
		description: 'Customer Journey Map'
	},
	BUSINESS_MODEL_CANVAS: {
		url:         '/dist/assets/img/bg/business_model_canvas.png',
		description: 'Business Model Canvas'
	}
}

const Size = immutable.Record({
	width:  0,
	height: 0
});

const Board = immutable.Record({
	id:               '',
	name:             '',
	size:             new Size(),
	tickets:          immutable.List(),
	background:       'NONE',
	accessCode:       null,
	customBackground: null,
	members:          immutable.List()
});

Board.Size       = Size;
Board.Background = Background;

/**
 * Simple factoryish function to make sure we get properly formatted Board
 * records. Note that this also invokes 'Ticket.fromJS' for any Tickets in the
 * Board, and places them in a list.
 */
Board.fromJS = function fromJS(board) {
	board.size    = new Board.Size(board.size);
	board.tickets = board.tickets || [ ];
	board.members = board.members || [ ];

	board.tickets = board.tickets.reduce((collection, record) => {
		return collection.push(Ticket.fromJS(record));
	}, immutable.List());

	if(!Board.Background.hasOwnProperty(board.background)) {
		board.background = 'NONE';
	}

	console.log(new Board(board));
	return new Board(board);
}

export default Board;
