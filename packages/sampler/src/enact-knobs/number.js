import {number as numberKnob} from '@storybook/addon-knobs';

// import nullify from '../utils/nullify.js';

/*
 * Enact `number` is used just like the `number` knob, but instead a `Config` object is passed in to
 * determine the default value and possibly other future things! Values are automatically nullified
 * if they're blank (empty strings).
 *
 * The config object has a `defaultProps` key which has keys that correlate to the `name` argument.
 *
 * Arguments:
 * * knob/property name string
 * * Config object with at least a `defaultProps` key containing a map of props and their default values
 * * number-specific knob options (opts from the standard Knobs docs)
 * * (Optional) a sample-specific initially selected value
*/

const number = (name, Config, opts, preferredValue) => {
	if (typeof opts === 'number') {
		// opts was omitted, causing the preferredValue to be the last value. Reassignment dipsy-doodle.
		preferredValue = opts;
		opts = {};
	}
	if (typeof Config === 'number' || typeof Config === 'string' || Config == null) {
		// Config wasn't set, or was omitted, causing the preferredValue to be the last value. Reassignment dipsy-doodle.
		preferredValue = Config;
		Config = {
			defaultProps: {}
		};
	}

	// If there's no group ID but there is a display name, use that for the group ID
	if (Config.displayName && !Config.groupId) {
		Config.groupId = Config.displayName;
	}

	// console.log(name + ':', Config.defaultProps);

	return numberKnob(name, (preferredValue != null ? preferredValue : Config.defaultProps[name]), opts, Config.groupId);
};

export default number;
export {
	number
};
