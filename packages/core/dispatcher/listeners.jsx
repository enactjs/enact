// Simple Map polyfill mapping targets to a hash of names->handler[]
const targets = [];
const events = [];

const getListeners = function (target, name) {
	let targetIndex = targets.indexOf(target);
	if (targetIndex === -1) {
		targetIndex = targets.push(target) - 1;
	}
	const listeners = events[targetIndex] = events[targetIndex] || {};
	return (listeners[name] = listeners[name] || []);
};

const addListener = function (target, name, fn) {
	const listeners = getListeners(target, name);

	if (listeners.indexOf(fn) === -1) {
		listeners.push(fn);
		return true;
	}
	return false;
};

export default getListeners;
export {getListeners, addListener};
