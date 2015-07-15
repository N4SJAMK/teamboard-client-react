import flux      from '../utils/flux';
import Immutable from 'immutable';

import User   from '../models/user';
import Action from '../actions';


let Comment = Immutable.Record({
	id:        '',
	message:   '',
	createdBy: new User(),
	createdAt: new Date()
});

let comments = Immutable.Map();

/**
 *
 */
export default flux.store({

	getComments(ticketID) {
		// the second argument to get will make it so that if comments for the
		// given ticket are not found we return an empty immutable list instead
		return comments.get(ticketID, Immutable.List());
	},

	handlers: {
		[Action.Comment.Add](payload) {
			// arrays are treated as if they're here to replace stuff
			if(payload.comment instanceof Array) {
				comments = comments.set(payload.ticket.id, Immutable.List(
					payload.comment.map(comment => new Comment(comment))));
			}

			// single objects just append to the collection
			comments = comments.set(payload.ticket.id,
				comments.get(payload.ticket.id, Immutable.List())
					.push(new Comment(payload.comment)));
		}
	}
});
