export const addInternalProp = function (props, name, value) {
	if (name in props) {
		props[name] = value;
	} else {
		Object.defineProperty(props, name, {
			value,
			enumerable: false,
			writable: true
		});
	}

	return props;
};
