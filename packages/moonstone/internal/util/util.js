/**
 * Removes voice control related props from `props` and returns them in a new object.
 *
 * @function
 * @param   {Object}    props    Props object
 *
 * @returns {Object}             voice control related props
 * @memberof moonstone/internal/util
 * @private
 */
const extractVoiceProps = function (props) {
	const obj = {};
	Object.keys(props).forEach(key => {
		if (key.indexOf('data-webos-voice-') === 0) {
			obj[key] = props[key];
			delete props[key];
		}
	});

	return obj;
};

export {
	extractVoiceProps
};
