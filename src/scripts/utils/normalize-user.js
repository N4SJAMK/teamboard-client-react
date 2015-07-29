/**
 * Utility to use with 'Avatar' components, extracts information irregardless
 * of whether the given user is of type 'Map' or 'Object' or 'Record'...
 */
export default function(user) {
	let name = has(user, 'name')
		? user.name
		: user.name || user.get('name');

	let type = has(user, 'type')
		? user.type
		: user.type || user.get('type');

	let avatar = has(user, 'avatar')
		? user.avatar
		: user.avatar || user.get('avatar');

	return { name, type, avatar }

	function has(obj, prop) {
		return obj.hasOwnProperty(prop)
	}
}
