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

export default getListeners;
export {getListeners};
