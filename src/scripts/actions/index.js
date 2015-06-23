import flux from '../utils/flux';

/**
 * The action types available in the application.
 */
export default flux.actions({
	User: {
		Load:     null,
		Login:    null,
		Logout:   null,
		Register: null,
		UpdateName: null,
		UpdatePassword: null
	},
	Socket: {
		Join:        null,
		Leave:       null,
		Connect:     null,
		ConnectFail: null,
		Error:       null,
		Disconnect:  null
	},
	Settings: {
		Edit: null,
	},
	Broadcast: {
		Add:    null,
		Remove: null
	},
	Board: {
		Add:    null,
		Load:   null,
		Edit:   null,
		Remove: null
	},
	Ticket: {
		Add:    null,
		Load:   null,
		Edit:   null,
		Remove: null
	}
});
