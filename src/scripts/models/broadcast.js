import immutable from 'immutable';
import Action    from '../actions';

import Translation from '../translations';
import Settings from '../stores/settings';

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
			[404]: Translation.BROADCAST_BOARD_NOTFOUND[Settings.getLocale()]
		},
		default: Translation.BROADCAST_BOARD_ERROR[Settings.getLocale()]
	},
	[Action.Ticket.Edit]: {
		status: {
			[404]: Translation.BROADCAST_BOARD_NOTFOUND[Settings.getLocale()]
		},
		default: Translation.BROADCAST_BOARD_ERROR[Settings.getLocale()]
	},
	[Action.User.Login]: {
		status: {
			[401]: Translation.BROADCAST_INVALID_CREDENTIALS[Settings.getLocale()]
		},
		default: Translation.BROADCAST_LOGIN_FAILED[Settings.getLocale()]
	},
	[Action.User.Register]: {
		status: {
			[400]: Translation.BROADCAST_BAD_CREDENTIALS[Settings.getLocale()],
			[409]: Translation.BROADCAST_USER_EXISTS[Settings.getLocale()]
		},
		default: Translation.BROADCAST_REGISTER_FAILED[Settings.getLocale()]
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
