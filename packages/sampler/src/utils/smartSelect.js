import {select} from '@storybook/addon-knobs';

import nullify from './nullify.js';

/*
 *
 * `smartSelect` is used just like the `select` knob, but instead a `Config` object is passed in to
 * determine the default value and possibly other future things! Values are automatically nullified
 * if they're blank (empty strings).
 *
 * The config object has a `defaultProps` key which has keys that correlate to the `name` argument.
 *
 * Arguments:
 * * knob/property name string
 * * collection of selectable values, array or object/hash
 * * Config object with at least a `defaultProps` key containing a map of props and their default values
 * * (Optional) a sample-specific initially selected value
 *
*/

const defaultString = ' (Default)';

const smartSelect = (name, items, Config, customDefault) => {
	const labels = {};
	if (typeof Config === 'string' || Config == null) {
		// Config wasn't set, or was omitted, causing the customDefault to be the last value. Reassignment dipsy-doodle.
		customDefault = Config;
		Config = {
			defaultProps: {}
		};
	}

	const defaultAppender = (item) =>
		item + (Config.defaultProps[name] === item ? defaultString : '');


	if (items instanceof Array) {
		// An array of items
		items.forEach((item) => {
			labels[item] = defaultAppender(item);
		});
	} else {
		// Items is an object (hash, probably?)
		for (const item in items) {
			labels[item] = defaultAppender(item);
		}
	}
	return nullify(select(name, labels, customDefault || Config.defaultProps[name]));
};

export default smartSelect;
export {
	smartSelect
};
