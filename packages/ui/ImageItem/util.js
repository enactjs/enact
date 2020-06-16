// We can't use the previous computed values in a function of a `kind`'s `computed` objects.
// To allow it, a `reducedComputed` function is provided. A computed object will be passed
// to the first parameter of the function as the object next prop's value.
// Warning: Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://fb.me/rules-of-hooks

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
