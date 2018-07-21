export const addInternalProp = function (props, name, value) {
	Object.defineProperty(props, name, {
		value,
		enumerable: false,
		writable: true
	});

	return props;
};
