import page   from 'page';

import User   from '../models/user';
import Board  from '../models/board';
import Ticket from '../models/ticket';

import request from '../utils/request';

/**
 * NOTE We use a lot of Model.fromJS.toJS conversion here, this is so that we
 *      can be sure the data we resolve to is formatted properly. This is not
 *      necessarily the most clean way, but it will do for now.
 */
export default {
	login:           login,
	loginGuest:      loginGuest,
	logout:          logout,
	register:        register,
	giveBoardAccess: giveBoardAccess,
	getUser:         getUser,
	getBoard:        getBoard,
	getBoards:       getBoards,
	getTicket:       getTicket,
	getTickets:      getTickets,
    getComments:     getComments,

	updateUserPassword: updateUserPassword,
	updateUser:         updateUser,

	createBoard:   createBoard,
	createTicket:  createTicket,
	createComment: createComment,
	updateBoard:   updateBoard,
	updateTicket:  updateTicket,
	deleteBoard:   deleteBoard,
	deleteTicket:  deleteTicket,

	revokeAccessCode:     revokeAccessCode,
	generateAccessCode:   generateAccessCode,
	setUserBoardActivity: setUserBoardActivity,

	queryApiVersion:    queryApiVersion,
	queryImgVersion:    queryImgVersion

}

const API_URL = process.env.API_URL || 'http://localhost:9002/api';

function login(opts = {}) {
	let provider = 'basic';
	let auth = 'basic ' + new Buffer(opts.payload.email + ':' + opts.payload.password).toString('base64');
	let options = {
		url:  `${API_URL}/auth/`+ provider + `/login`,
		auth: auth
	}
	return request.get(options).then((res) => {
		return {
			user:  User.fromJS(res.body).toJS(),
			token: res.headers['x-access-token']
		}
	});
}

function logout(opts = {}) {
	let options = {
		url:   `${API_URL}/auth/logout`,
		token: opts.token
	}
	return request.post(options);
}

function register(opts = {}) {
	let options = {
		url:     `${API_URL}/auth/register`,
		payload: opts.payload
	}
	return request.post(options).then((res) => {
		return {
			user: User.fromJS(res.body).toJS()
		}
	});
}

function loginGuest(opts = {}) {
	let options = {
		url:     `${API_URL}/boards/${opts.id.board}/access/${opts.id.code}`,
		payload: opts.payload
	}
	return request.post(options).then((res) => {
		return {
			user:  User.fromJS(res.body).toJS(),
			token: res.headers['x-access-token']
		}
	});
}

function giveBoardAccess(opts = {}) {
	let options = {
		url:     `${API_URL}/boards/${opts.id.board}/access/${opts.id.code}/grantaccess`,
		token: opts.token
	}
	return request.put(options).then((res) => {
		return Board.fromJS(res.body).toJS();
	});
}

function getUser(opts = {}) {
	let options = {
		url:   `${API_URL}/auth`,
		token: opts.token
	}
	return request.get(options).then((res) => {
		return User.fromJS(res.body).toJS();
	});
}

function getBoard(opts = {}) {
	let options = {
		url:   `${API_URL}/boards/${opts.id.board}`,
		token: opts.token
	}
	return request.get(options).then((res) => {
		let board = Board.fromJS(res.body).toJS();
		// Remove the empty 'tickets' collection to prevent overwriting.
		delete board.tickets;
		return board;
	});
}

function getBoards(opts = {}) {
	let options = {
		url:   `${API_URL}/boards`,
		token: opts.token
	}
	return request.get(options).then((res) => {
		return res.body.map((board) => {
			board = Board.fromJS(board).toJS();
			// Remove the empty 'tickets' collection to prevent overwriting.
			delete board.tickets;
			return board;
		});
	});
}

function getTicket(opts = {}) {
	let options = {
		url:   `${API_URL}/boards/${opts.id.board}/tickets/${opts.id.ticket}`,
		token: opts.token
	}
	return request.get(options).then((res) => {
		return Ticket.fromJS(res.body).toJS();
	});
}

function getTickets(opts = {}) {
	let options = {
		url:   `${API_URL}/boards/${opts.id.board}/tickets`,
		token: opts.token
	}
	return request.get(options).then((res) => {
		return res.body.map((ticket) => {
			return Ticket.fromJS(ticket).toJS();
		});
	});
}

function parseCommentFromEvent(event) {
    return {
        id:        event.id,
        message:   event.data.message,
        createdBy: event.user,
        createdAt: event.createdAt
    }
}

function getComments(opts = {}) {
    let options = {
        url:   `${API_URL}/boards/${opts.id.board}/tickets/${opts.id.ticket}/comments`,
        token: opts.token
    }
    return request.get(options)
        .then(res => res.body.map(parseCommentFromEvent));
}

function createComment(opts = {}) {
    let options = {
        url:     `${API_URL}/boards/${opts.id.board}/tickets/${opts.id.ticket}/comments`,
        token:   opts.token,
        payload: opts.payload
    }
    return request.post(options).then(res => parseCommentFromEvent(res.body));
}

function createBoard(opts = {}) {
	let options = {
		url:     `${API_URL}/boards`,
		token:   opts.token,
		payload: opts.payload
	}
	return request.post(options).then((res) => {
		return Board.fromJS(res.body).toJS();
	});
}

function createTicket(opts = {}) {
	let options = {
		url:     `${API_URL}/boards/${opts.id.board}/tickets`,
		token:   opts.token,
		payload: opts.payload
	}
	return request.post(options).then((res) => {
		return Ticket.fromJS(res.body).toJS();
	});
}

function updateUser(opts = {}) {
	let options = {
		url:     `${API_URL}/user/edit`,
		token:   opts.token,
		payload: opts.payload
	}
	return request.put(options).then((res) => {
		return User.fromJS(res.body).toJS();
	});
}

function updateUserPassword(opts = {}) {
	let options = {
		url:     `${API_URL}/user/changepw`,
		token:   opts.token,
		payload: opts.payload
	}
	return request.put(options).then((res) => {
		return User.fromJS(res.body).toJS();
	});
}

function updateBoard(opts = {}) {
	let options = {
		url:     `${API_URL}/boards/${opts.id.board}`,
		token:   opts.token,
		payload: opts.payload
	}
	return request.put(options).then((res) => {
		let board = Board.fromJS(res.body).toJS();
		// Remove the empty 'tickets' collection to prevent overwriting.
		delete board.tickets;
		return board;
	});
}

function updateTicket(opts = {}) {
	let options = {
		url:     `${API_URL}/boards/${opts.id.board}/tickets/${opts.id.ticket}`,
		token:   opts.token,
		payload: opts.payload
	}
	return request.put(options).then((res) => {
		return Ticket.fromJS(res.body).toJS();
	});
}

function deleteBoard(opts = {}) {
	let options = {
		url:   `${API_URL}/boards/${opts.id.board}`,
		token: opts.token
	}
	return request.del(options).then((res) => {
		let board = Board.fromJS(res.body).toJS();
		// Remove the empty 'tickets' collection to prevent overwriting.
		delete board.tickets;
		return board;
	});
}

function deleteTicket(opts = {}) {
	let options = {
		url:   `${API_URL}/boards/${opts.id.board}/tickets/${opts.id.ticket}`,
		token: opts.token
	}
	return request.del(options).then((res) => {
		return Ticket.fromJS(res.body).toJS();
	});
}

function setUserBoardActivity(opts = {}) {
	let options = {
		url:   `${API_URL}/boards/${opts.id.board}/setactivity`,
		token: opts.token,
		payload: opts.payload
	}

	if(opts.isPoll) {
		return request.put(options);
	} else {
		return request.post(options);
	}
}

function generateAccessCode(opts = {}) {
	let options = {
		url:   `${API_URL}/boards/${opts.id.board}/access`,
		token: opts.token
	}
	return request.post(options).then((res) => {
		let board = Board.fromJS(res.body).toJS();
		// Remove the empty 'tickets' collection to prevent overwriting.
		delete board.tickets;
		return board;
	});
}

function revokeAccessCode(opts = {}) {
	let options = {
		url:   `${API_URL}/boards/${opts.id.board}/access`,
		token: opts.token
	}
	return request.del(options);
}

function queryApiVersion(opts = {}) {
	let options = {
		url:   `${API_URL}/version/api`,
		token: opts.token
	}
	return request.get(options).then((res) => {
		return res.body;
	});
}

function queryImgVersion(opts = {}) {
	let options = {
		url:   `${API_URL}/version/img`,
		token: opts.token
	}
	return request.get(options).then((res) => {
		return res.body;
	});
}
