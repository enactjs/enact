export const reducedComputed = (props, initialContext = {}) => {
	return Object.keys(props).reduce(function (context, key) {
		return {
			...context,
			[key]: props[key](context)
		};
	}, initialContext);
};
