import immutable from 'immutable';
import Action    from '../actions';

/**
 *
 */
const BroadcastType = {
	Error:     new String('error'),
	Broadcast: new String('broadcast')
}

/**
 *
 */
BroadcastType.Error.Message = {
	[Action.Ticket.Add]: {
		status: {
			[404]: 'BROADCAST_BOARD_NOTFOUND'
		},
		default: 'BROADCAST_BOARD_ERROR'
	},
	[Action.Ticket.Edit]: {
		status: {
			[404]: 'BROADCAST_BOARD_NOTFOUND'
		},
		default: 'BROADCAST_BOARD_ERROR'
	},
	[Action.User.Login]: {
		status: {
			[401]: 'BROADCAST_INVALID_CREDENTIALS'
		},
		default: 'BROADCAST_LOGIN_FAILED'
	},
	[Action.User.Register]: {
		status: {
			[400]: 'BROADCAST_BAD_CREDENTIALS',
			[409]: 'BROADCAST_USER_EXISTS',
		},
		default: 'BROADCAST_REGISTER_FAILED'
	}
}

/**
 *
 */
BroadcastType.Error.Message.From = function(err, action) {
	if(BroadcastType.Error.Message[action]) {
		let message = BroadcastType.Error.Message[action];
		if(err.statusCode && message.status[err.statusCode]) {
			return message.status[err.statusCode];
		}
		return message.default;
	}
	else return err.message;
}

/**
 *
 */
const Broadcast = immutable.Record({
	id: '', content: '', type: BroadcastType.Broadcast
});

Broadcast.Type = BroadcastType;

export default Broadcast;
