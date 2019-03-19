import {on} from '@enact/core/dispatcher';
import {onWindowReady} from '@enact/core/snapshot';

let focused = false;
const queue = new Set();

const invoke = (fn) => {
	try {
		fn();
	} catch (e) {
		// failing silently
	}
};

const flush = () => queue.forEach(invoke);

const onWindowFocus = (handler) => {
	if (focused) {
		handler();
	} else {
		queue.add(handler);
	}
};

onWindowReady(() => {
	focused = true;	// Treat window as initially focused once ready
	flush();
	on('focus', () => {
		focused = true;
		flush();
	}, window);

	on('blur', () => {
		focused = false;
	}, window);
});

export {
	onWindowFocus
};
