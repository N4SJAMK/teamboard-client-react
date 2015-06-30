import superagent from 'superagent/lib/client';
import page       from 'page';
import BroadcastAction from '../actions/broadcast';
/**
 * Simple helper module to make HTTP requests.
 */
export default {
	get:  request.bind(null, superagent.get),
	put:  request.bind(null, superagent.put),
	del:  request.bind(null, superagent.del),
	post: request.bind(null, superagent.post)
}

/**
 * Simple helper function to make HTTP requests. Note that you don't call this
 * directly but instead use one of the pre-bound methods above.a
 */
function request(to, options = {}) {
	return new Promise((resolve, reject) => {
		let request = to(options.url)
			.set('Accept',        'application/json')
			.set('Content-Type',  'application/json')
			.set('Authorization', options.auth || `Bearer ${options.token}`);

		if(options.payload) {
			request = request.send(options.payload)
		} else {
			// Prevents IE returning bad request message
			request = request.send({})
		}

		return request.end((err, res) => {
			if(err) {
				err.statusCode = err.status || res ? res.status : 0;
				return reject(err);
			}
			return resolve({ body: res.body, headers: res.headers });
		});
	});
}
