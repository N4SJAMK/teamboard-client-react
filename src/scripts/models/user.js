import immutable from 'immutable';

const UserType = {
	User:  'standard',
	Guest: 'temporary'
}

const User = immutable.Record({
	id:       '',
	type:     UserType.Guest,
	access:   '',
	username: ''
});

User.Type = UserType;

/**
 * Simple factoryish function to make sure we get a properly formatted record.
 */
User.fromJS = function fromJS(user) {
	user.type = user.type === UserType.User
		? UserType.User
		: UserType.Guest;
	return new User(user);
}

export default User;
