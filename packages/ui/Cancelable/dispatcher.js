const events = {};

const dispatcher = function (ev) {
	const name = ev.type;
	const listeners = events[name];

	if (listeners) {
		listeners.forEach((fn) => fn(ev));
	}
};

const on = function (name, fn) {
	let listeners = events[name];

	if (!listeners) {
		listeners = events[name] = [];
	}

	listeners.push(fn);
	if (listeners.length === 1) {
		document.addEventListener(name, dispatcher);
	}
};

const off = function (name, fn) {
	const listeners = events[name];

	if (listeners) {
		const index = listeners.indexOf(fn);

		if (index >= 0) {
			listeners.splice(index, 1);
			if (listeners.length === 0) {
				document.removeEventListener(name, dispatcher);
			}
		}
	}
};

export {on, off};
