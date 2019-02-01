
const objectify = (arg) => {
	// undefined, null, empty string case
	// bail early
	if (!arg) return {};

	if (typeof arg === 'string') {
		// String case, convert to array for processing
		arg = arg.split(' ');
	}

	if (arg instanceof Array) {
		return arg.reduce((obj, a) => {
			obj[a] = true;
			return obj;
		}, {});
	} else if (typeof arg === 'object') {
		return arg;
	} else {
		return {};
	}
};

const preferDefined = (a, b) => ((a != null) ? a : b);

export {
	objectify,
	preferDefined
};
