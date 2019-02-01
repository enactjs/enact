
const objectify = (arg) => {
	// undefined, null, empty string case
	// bail early
	if (!arg) return {};

	if (typeof arg === 'string') {
		// String case
		arg = arg.split(' ');
		// Process as array below
	} else if (typeof arg === 'object' && !(arg instanceof Array)) {
		// It's just an object already.
		// return it unaltered
		return arg;
	} else if (!(arg instanceof Array)) {
		return {};
	}

	// only dealing with arrays now
	return arg.reduce((obj, a) => {
		obj[a] = true;
		return obj;
	}, {});
};

const preferDefined = (a, b) => ((a != null) ? a : b);

export {
	objectify,
	preferDefined
};
