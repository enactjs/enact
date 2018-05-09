import $L from '../internal/$L';

/**
 * Determines the `aria-label` for an Input
 *
 * @method
 * @memberof moonstone/Input
 * @param   {String}  prefix   Text to precede the value in the aria-label
 * @param   {String}  type     `type` of the Input
 * @param   {String}  [value]  Current value of the input
 * @returns {String}           `aria-label` value
 */
const calcAriaLabel = function (prefix, type, value = '') {
	const hint = $L('Input field');

	if (type === 'password' && value) {
		const character = value.length > 1 ? $L('characters') : $L('character');
		value = `${value.length} ${character}`;
	}

	return `${prefix} ${value} ${hint}`;
};

/**
 * Removes `<input>` related props from `props` and returns them in a new object.
 *
 * Useful when redirecting `<input>` related props from a non-input root element to the `<input>`
 * element.
 *
 * @method
 * @memberof moonstone/Input
 * @param   {Object} props  Props object
 * @returns {Object}        input related props
 */
const extractInputProps = function (props) {
	const inputProps = {};
	Object.keys(props).forEach(key => {
		switch (key) {
			case 'autoComplete':
			case 'list':
			case 'maxLength':
			case 'minLength':
			case 'pattern':
			case 'required':
			case 'size':
				inputProps[key] = props[key];
				delete props[key];
		}
	});

	return inputProps;
};

export {
	calcAriaLabel,
	extractInputProps
};
