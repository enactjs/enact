import React from 'react';

// Generate a handler that hides the controlled value from users, supports functional callbacks,
// and is memoized by the onChange provided by useState
function createHandler () {
	return (onChange) => (value) => {
		onChange(prevState => ({
			value: typeof value === 'function' ? value(prevState.value) : value,
			controlled: prevState.controlled
		}));
	};
}

// always return the prop value when controlled and the state value when not
function calcValue (defaultValue, propValue, stateValue, controlled) {
	if (!controlled) {
		return stateValue;
	}

	// eslint-disable-next-line no-undefined
	return propValue !== undefined ? propValue : defaultValue;
}

function useControlledState (defaultValue, propValue, controlled) {
	// Store both the value and the "controlled" flag in a state hook
	const [state, onChange] = React.useState({
		value: defaultValue,
		controlled
	});

	return [
		calcValue(defaultValue, propValue, state.value, state.controlled),
		React.useMemo(createHandler, [onChange])(onChange)
	];
}

export default useControlledState;
export {
	useControlledState
};
