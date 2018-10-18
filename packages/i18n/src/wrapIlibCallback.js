
const invoke = (fn, options, callback) => {
	const {onLoad} = options;

	fn({
		...options,
		onLoad: (result) => {
			callback(result);
			if (onLoad) onLoad(result);
		}
	});
};

const wrapIlibCallback = (fn, options = {}) => {
	const {sync = false} = options;

	if (!fn) {
		return sync ? null : Promise.resolve(null);
	}

	if (sync) {
		let value = null;
		invoke(fn, options, (v) => (value = v));

		return value;
	}

	return new Promise(resolve => invoke(fn, options, resolve));
};

export default wrapIlibCallback;
export {
	wrapIlibCallback
};
