import {useState, useMemo} from 'react';

function nop () {}

// Generate a handler that hides the controlled value from users, supports functional callbacks,
// and is memoized by the onChange provided by useState
function createHandler () {
	return (onChange, currentValue, controlled) => {
		if (controlled) {
			return nop;
		}

		return (value) => {
			if (value !== currentValue) {
				onChange(value);
			}
		};
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
	const [isControlled] = useState(controlled);

	// Store both the value and the "controlled" flag in a state hook
	const [value, onChange] = useState(defaultValue);

	const memoOnChange = useMemo(() => createHandler(), []);

	return [
		calcValue(defaultValue, propValue, value, isControlled),
		memoOnChange(onChange, value, isControlled)
	];
}

export default useControlledState;
export {
	useControlledState
};
