import immutable from 'immutable';

const UserType = {
	User:  'standard',
	Guest: 'temporary'
}

// A lot of these fields are not really needed (_id, vid)
// and some are reduntary. This is because MongoDB returns
// the whole record on .populates()'s and doesn't run
// it through the JSON sanitizing function in the API schema,
// which is annoying to say the least...
const User = immutable.Record({
	id:           '',
	_id:          null,
	__v:          null, 
	type:         UserType.Guest,
	account_type: UserType.Guest,
	access:       '',
	username:     '',
	name:         '',
	edited_at:    null,
	created_at:   null,
	boards:       [],
	providers:    null
});

User.Type = UserType;

/**
 * Simple factoryish function to make sure we get a properly formatted record.
 */
User.fromJS = function fromJS(user) {
	user.type = user.type || user.account_type;
	user.type = user.type === UserType.User
		? UserType.User
		: UserType.Guest;

	return new User(user);
}

export default User;
