import curry1 from './curry1';

function curry2 (fn) {
	return function f2 (a, b) {
		switch (arguments.length) {
			case 0:
				return f2;
			case 1:
				return curry1(function (_b) {
					return fn(a, _b);
				});
			default:
				return fn(a, b);
		}
	};
}

export default curry2;
export {
	curry2
};
