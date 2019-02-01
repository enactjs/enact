
const objectify = (arg) => {
	// undefined, null, empty string case
	// bail early
	if (!arg) return {};

	if (typeof arg === 'string') {
		// String case, convert to array for processing
		arg = arg.split(' ');
	}

	if (arg instanceof Array) {
		// Convert array values into object properties
		return arg.reduce((obj, a) => {
			obj[a] = true;
			return obj;
		}, {});
	} else if (typeof arg === 'object') {
		// Can just return objects as-is
		return arg;
	} else {
		// Invalid, return an empty object
		return {};
	}
};

const preferDefined = (a, b) => ((a != null) ? a : b);

export {
	objectify,
	preferDefined
};
