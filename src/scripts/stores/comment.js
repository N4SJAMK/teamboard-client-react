import flux      from '../utils/flux';
import Immutable from 'immutable';

import User   from '../models/user';
import Action from '../actions';

let Comment = Immutable.Record({
	id: '', message: '', createdBy: new User(), createdAt: new Date()
});

Comment.fromJS = function fromJS(comment) {
	return new Comment({
		id:        comment.id,
		message:   comment.message,
		createdBy: new User(comment.createdBy),
		createdAt: new Date(comment.createdAt)
	});
}

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
				return comments = comments.set(payload.ticket.id,
					Immutable.List(payload.comment.map(Comment.fromJS)));
			}

			let cft = comments.get(payload.ticket.id, Immutable.List())

			// single objects add to the collection if they are not already
			// present in it
			if(cft.findIndex(c => c.id === payload.comment.id) < 0) {
				comments = comments.set(payload.ticket.id,
					cft.push(Comment.fromJS(payload.comment)));
			}
		},

		[Action.Comment.Remove](payload) {
			// retrieve the index of the comment if it exists at all
			let index = comments.get(payload.ticket.id, Immutable.List())
				.findIndex(comment => payload.comment.id === comment.id);

			if(index >= 0) {
				// assuming the comment exists, remove it from the list
				comments = comments.set(payload.ticket.id,
					comments.get(payload.ticket.id, Immutable.List())
						.remove(index));
			}
		}
	}
});
