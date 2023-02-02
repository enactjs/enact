import invariant from 'invariant';

const windowCallbacks = [];

function isWindowReady () {
	return typeof window !== 'undefined';
}

function onWindowReady (callback) {
	if (isWindowReady()) {
		callback();
	} else {
		windowCallbacks.push(callback);
	}
}

function windowReady () {
	invariant(
		isWindowReady(),
		'windowReady cannot be run until the window is available'
	);

	windowCallbacks.forEach(f => f());
}

export default onWindowReady;
export {
	isWindowReady,
	onWindowReady,
	windowReady
};
