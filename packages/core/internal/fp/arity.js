const HOP = Object.prototype.hasOwnProperty;

function arity (fn, _arity) {
	if (__DEV__) {
		let type = typeof fn;
		if (type !== 'function') {
			throw new Error(`arity expects the first argument to be a function. Received ${type} instead`);
		}

		type = typeof _arity;
		if (type !== 'number' && type !== 'undefined') {
			throw new Error(`arity expects the second argument to be a number or undefined. Received ${type} instead`);
		}
	}

	switch (arguments.length) {
		case 0:
			throw new Error('arity expects at least one argument');
		case 1:
			fn.__arity = HOP.call(fn, '__arity') ? fn.__arity : fn.length;

			return fn.__arity;
		default:
			fn.__arity = _arity;

			return fn;
	}
}

export default arity;
export {
	arity
};
