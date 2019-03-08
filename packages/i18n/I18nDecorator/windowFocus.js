import {on} from '@enact/core/dispatcher';
import {onWindowReady} from '@enact/core/snapshot';

let focused = true;
const queue = new Set();

const flush = () => {
	queue.forEach(fn => fn());
};

const onWindowFocus = (handler) => {
	if (focused) {
		handler();
	} else {
		queue.add(handler);
	}
};

onWindowReady(() => {
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
