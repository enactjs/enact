import {select as selectKnob} from '@storybook/addon-knobs';

import nullify from '../utils/nullify.js';

/*
 * `select` is used just like the standard `selectV2` knob, but instead a `Config` object is passed
 * in to determine the default value and possibly other future things! Values are automatically
 * nullified if they're blank (empty strings).
 *
 * The config object has a `defaultProps` key which is an object with keys that correlate to the
 * `name` argument.
 *
 * Arguments:
 * * knob/property name string
 * * collection of selectable values, array or object/hash
 * * Config object with at least a `defaultProps` key containing a map of props and their default values
 * * (Optional) a sample-specific initially selected value
*/

const defaultString = ' (Default)';

const select = (name, items, Config, selectedValue) => {
	const labels = {};

	if (typeof Config === 'string' || Config == null) {
		// Config wasn't set, or was omitted, causing the selectedValue to be the last value. Reassignment dipsy-doodle.
		selectedValue = Config;
		Config = {};
	}

	// If there is no `defaultProps` object on the Config object
	if (!Config.defaultProps) {
		Config.defaultProps = {};
	}

	const defaultValue = selectedValue ||
		(typeof selectedValue !== 'string' && Config.defaultProps[name] ) ||
		'';

	const defaultAppender = (key, label = key) => {
		return (key || ' ') + (Config.defaultProps[name] === label ? defaultString : '');
	};

	if (items instanceof Array) {
		// An array of items
		items.forEach((item) => {
			labels[defaultAppender(item)] = item;
		});
	} else {
		// Items is an object
		for (const item in items) {
			labels[defaultAppender(item, items[item])] = items[item];
		}
	}

	return nullify(selectKnob(name, labels, defaultValue, Config.groupId));
};

export default select;
export {
	select
};
