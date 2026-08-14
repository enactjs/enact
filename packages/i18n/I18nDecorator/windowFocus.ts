import {on} from '@enact/core/dispatcher';
import {onWindowReady} from '@enact/core/snapshot';

let focused = false;
const queue = new Set<() => void>();

const invoke = (fn: () => void) => {
	try {
		fn();
	} catch {
		// failing silently
	}
};

const flush = () => queue.forEach(invoke);

const onWindowFocus = (handler: () => void) => {
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
	}, window as unknown as Node);

	on('blur', () => {
		focused = false;
	}, window as unknown as Node);
});

export {
	onWindowFocus
};
