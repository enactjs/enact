import {boolean as booleanKnob} from '@storybook/addon-knobs';

import nullify from '../utils/nullify.js';

/*
 * `boolean` is used just like the standard `boolean` knob, but instead a `Config` object is passed
 * in to determine the default value and possibly other future things! Values are automatically
 * nullified if they're false, null, or undefind.
 *
 * The config object has a `defaultProps` key which is an object with keys that correlate to the
 * `name` argument.
 *
 * Arguments:
 * * knob/property name string
 * * Config object with at least a `defaultProps` key containing a map of props and their default values
 * * (Optional) a sample-specific initially selected value
*/

const boolean = (name, Config, preferredValue) => {
	if (typeof Config === 'string' || Config == null) {
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

	return nullify(booleanKnob(name, (preferredValue != null ? preferredValue : Config.defaultProps[name]), Config.groupId));
};

export default boolean;
export {
	boolean
};
