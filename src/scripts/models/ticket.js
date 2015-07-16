import immutable from 'immutable';
import User      from './user';

const Color = {
	RED:    '#eb584a',
	BLUE:   '#4f819a',
	VIOLET: '#724a7f',
	YELLOW: '#dcc75b'
}

const Position = immutable.Record({
	x: 0, y: 0, z: 0
});

const Comment = immutable.Record({
	_id:        '',
	content:	'',
	created_at: Date.now(),
	user:       new User()
});

const Ticket = immutable.Record({
	id:       '',
	ua:       Date.now(),
	color:    Color.VIOLET,
	content:  '',
	heading:  '',
	createdBy: new User(),
	lastEditedBy: new User(),
	comments: immutable.List(),
	position: new Position(),
});

Ticket.Width    = 192;
Ticket.Height   = 108;
Ticket.Color    = Color;
Ticket.Position = Position;

/**
 * Simple factoryish function to make sure we get properly formatted Ticket
 * records.
 */
Ticket.fromJS = function fromJS(ticket) {
	ticket.comments = ticket.comments || [ ];
	let hascolor = Object.keys(Ticket.Color)
		.map((color) => Ticket.Color[color] === ticket.color)
		.reduce((has, color) => has || color, false);
	ticket.color    = hascolor ? ticket.color : Ticket.Color.VIOLET;
	ticket.position = new Position(ticket.position);
	
	if(ticket.createdBy instanceof String) {
		delete ticket.createdBy;
	}

	if(ticket.createdBy) {
		ticket.createdBy = new User(ticket.createdBy);
	}

	if(ticket.lastEditedBy instanceof String) {
		delete ticket.lastEditedBy;
	}

	if(ticket.lastEditedBy) ticket.lastEditedBy = new User(ticket.lastEditedBy);

	if(ticket.comments) {
		ticket.comments = ticket.comments.reduce((collection, record) => {

			if (record.user !== null && typeof record.user === 'object') {
				record.user  = new User(record.user);
			}
			let comment = new Comment(record);
			return collection.push(comment);
		}, immutable.List());
	}
	return new Ticket(ticket);
}

export default Ticket;
