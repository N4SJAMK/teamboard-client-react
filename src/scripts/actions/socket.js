import events from 'event-emitter';

let emitter = events();

/**
 * Used to bridge utils/socket and actions/activity together without causing a
 * circular reference.
 */
export default {
	create(event, data) {
		emitter.emit('event', { name: event, data: data });
	},

	addListener(callback) {
		emitter.on('event', callback);
	}
}
