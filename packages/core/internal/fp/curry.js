import arity from './arity';
import curry1 from './curry1';
import curry2 from './curry2';
import curry3 from './curry3';

function curry (fn) {
	const length = arity(fn);

	if (length === 0) {
		return fn;
	}

	return arity(function f (...args) {
		if (args.length === 0) {
			return f;
		}

		if (args.length >= length) {
			return fn(...args);
		}

		const remaining = length - args.length;

		switch (remaining) {
			case 1:
				return curry1(function f1 (a) {
					return fn(...args, a);
				});
			case 2:
				return curry2(function f2 (a, b) {
					return fn(...args, a, b);
				});
			case 3:
				return curry3(function f3 (a, b, c) {
					return fn(...args, a, b, c);
				});
			default:
				return curry(arity(function (...moreArgs) {
					return fn(...args, ...moreArgs);
				}, remaining));
		}
	}, length);
}

export default curry;
export {
	curry
};
