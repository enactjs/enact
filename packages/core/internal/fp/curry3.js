import curry1 from './curry1';
import curry2 from './curry2';

function curry3 (fn) {
	return function f3 (a, b, c) {
		switch (arguments.length) {
			case 0:
				return f3;
			case 1:
				return curry2(function (_b, _c) {
					return fn(a, _b, _c);
				});
			case 2:
				return curry1(function (_c) {
					return fn(a, b, _c);
				});
			default:
				return fn(a, b, c);
		}
	};
}

export default curry3;
export {
	curry3
};
