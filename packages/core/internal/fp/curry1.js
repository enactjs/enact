function curry1 (fn) {
	return function f1 (a) {
		switch (arguments.length) {
			case 0:
				return f1;
			default:
				return fn(a);
		}
	};
}

export default curry1;
export {
	curry1
};
