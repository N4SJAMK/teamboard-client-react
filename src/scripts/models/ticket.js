import immutable from 'immutable';

const Color = {
	RED:    '#eb584a',
	BLUE:   '#4f819a',
	VIOLET: '#724a7f',
	YELLOW: '#dcc75b'
}

const Position = immutable.Record({
	x: 0, y: 0, z: 0
});

const Ticket = immutable.Record({
	id:       '',
	ua:       Date.now(),
	color:    Color.VIOLET,
	content:  '',
	heading:  '',
	comments: [],
	position: new Position()
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
	let hascolor = Object.keys(Ticket.Color)
		.map((color) => Ticket.Color[color] === ticket.color)
		.reduce((has, color) => has || color, false);
	ticket.color    = hascolor ? ticket.color : Ticket.Color.VIOLET;
	ticket.position = new Position(ticket.position);
	return new Ticket(ticket);
}

export default Ticket;
