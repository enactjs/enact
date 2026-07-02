export const bindInlineHandlers = (props, handlers, handlerKeys, context) => {
	if (!handlerKeys?.length) {
		return props;
	}

	const snapshot = {...props};

	return handlerKeys.reduce((_props, key) => {
		_props[key] = (ev) => handlers[key](ev, snapshot, context);
		return _props;
	}, props);
};

export const addInternalProp = function (props, name, value) {
	Object.defineProperty(props, name, {
		value,
		enumerable: false,
		writable: true
	});

	return props;
};
