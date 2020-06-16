export const reducedComputed = (props, initialContext = {}) => {
	return Object.keys(props).reduce(function (context, key, index, keys) {
		if (index === keys.length - 1) {
			return props[key](context);
		} else {
			return {
				...context,
				[key]: props[key](context)
			};
		}
	}, initialContext);
};
