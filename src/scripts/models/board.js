import immutable from 'immutable'
import Ticket    from '../models/ticket';
import User      from '../models/user';

const Background = {
	DEFAULT: {
		url:         '/dist/assets/img/bg/1.png',
		description: 'Welcome'
	},
	CUSTOM: {
		url:         null,
		description: 'Choose our own'
	},
	BLANK: {
		url:         null,
		description: 'Blank'
	},
	SWOT: {
		url:         '/dist/assets/img/bg/4.png',
		description: 'Example 1 - SWOT'
	},
	PLAY: {
		url:         '/dist/assets/img/bg/5.png',
		description: 'Example 2 - Play Ground'
	},
	KANBAN: {
		url:         '/dist/assets/img/bg/6.png',
		description: 'Example 3 - Kanban'
	},
	KEEP_DROP_TRY: {
		url:         '/dist/assets/img/bg/7.png',
		description: 'Example 4 - Keep, Drop and Try'
	},
	SMOOTH_BRAINSTORMING: {
		url:         '/dist/assets/img/bg/8.gif',
		description: 'Example 5 - Smooth Brainstorming'
	},
	LEAN_CANVAS: {
		url:         '/dist/assets/img/bg/9.png',
		description: 'Example 6 - Lean Canvas'
	},
	IDEA_GATHERING: {
		url:         '/dist/assets/img/bg/10.png',
		description: 'Example 7 - Idea Gathering'
	}
}

const Size = immutable.Record({
	width:  0,
	height: 0
});

const Member = immutable.Record({
	_id:      '',
	isActive: null,
	role:     '',
	lastSeen: null,
	user:     new User()
});

const Board = immutable.Record({
	id:               '',
	name:             '',
	size:             new Size(),
	tickets:          immutable.List(),
	background:       'DEFAULT',
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

	board.tickets = board.tickets.reduce((collection, record) => {
		return collection.push(Ticket.fromJS(record));
	}, immutable.List());

	if (board.members) {
		board.members = board.members.reduce((collection, record) => {
			if (record.user !== null && typeof record.user === 'object') {
				record.user  = new User(record.user);
			}
			let member = new Member(record);
			return collection.push(member);
		}, immutable.List());
	}

	if(!Board.Background.hasOwnProperty(board.background)) {
		board.background = 'DEFAULT';
	}

	// User might have old background in use so we need to
	// change it to new default
	if(! Background[board.background]) {
		board.background = 'DEFAULT';
	}

	return new Board(board);
}

export default Board;
