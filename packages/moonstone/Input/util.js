const inputPropNames = ['autoComplete', 'list', 'maxLength', 'minLength', 'pattern', 'required', 'size'];

/**
 * Removes `<input>` related props from `props` and returns them in a new object.
 * Useful when redirecting `<input>` related props from a non-input root element to the
 * `<input>` element.
 *
 * @method
 * @memberof moonstone/Input/util
 * @param   {Object} props  Props object
 * @returns {Object}        input related props
 */
const extractInputProps = function (props) {
	const inputProps = {};
	Object.keys(props).forEach(key => {
		if (inputPropNames.indexOf(key) > -1) {
			inputProps[key] = props[key];
			delete props[key];
		}
	});

	return inputProps;
};

export {
	extractInputProps
};
