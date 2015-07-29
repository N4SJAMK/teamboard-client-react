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
	name:         '',
	type:         UserType.Guest,
	access:       '',
	avatar:       null,
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
	delete user._id;
	delete user.__v;

	user.name = ((user.username || '').length > 0)
		? user.username : user.name;
	delete user.username;

	user.type = ((user.account_type || '').length > 0)
		? user.account_type : user.type;
	delete user.account_type;

	user.avatar = (user.avatar || '').length > 0 ? user.avatar : null;

	return new User(user);
}

export default User;
