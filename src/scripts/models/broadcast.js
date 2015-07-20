import immutable from 'immutable';
import Action    from '../actions';

import Translations from '../translations';
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
	[Action.User.Login]: {
		status: {
			[401]: 'LOGIN_INVALID_CREDENTIALS'
		},
		default: 'LOGIN_FAILED'
	},
	[Action.User.Register]: {
		status: {
			[400]: 'LOGIN_BAD_CREDENTIALS',
			[409]: 'LOGIN_ALREADY_EXISTS',
		},
		default: 'LOGIN_REGISTER_FAILED'
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
