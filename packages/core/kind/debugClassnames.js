/* !
  classnames Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/

const hasProp = {}.hasOwnProperty;

// When passed as strings (not in objects!), these strings are acceptable globals
const allowedGlobalClasses = ['neutral', 'highContrast', 'spottable', 'enact-fit'];

// Filter out class names passed as strings that should be checked. These include strings with
// underscores (already obfuscated), spaces (combined classes passed from other components) or from
// the allowed global class list
const shouldWarn = str => !(str.match(/[ _]/) || allowedGlobalClasses.includes(str));

function debugClassnames () {
	const moduleName = Object.keys(this)[0] || 'unknown';	// best guess?
	let classes = [];

	for (let i = 0; i < arguments.length; i++) {
		let arg = arguments[i];
		if (!arg) continue;

		let argType = typeof arg;

		if (argType === 'string' || argType === 'number') {
			// eslint-disable-next-line no-console
			classes.push(this && this[arg] || (shouldWarn(arg) && console.warn(`${moduleName}: global class ${arg}`)) || arg);
		} else if (Array.isArray(arg)) {
			classes.push(debugClassnames.apply(this, arg));
		} else if (argType === 'object') {
			if (arg.toString !== Object.prototype.toString) {
				classes.push(arg.toString());
			} else {
				for (let key in arg) {
					if (hasProp.call(arg, key) && arg[key]) {
						// eslint-disable-next-line no-console
						classes.push(this && this[key] || console.warn(`${moduleName}: global class ${key}`) || key);
					}
				}
			}
			// Perhaps attempting to access undefined value in css object?
		} else if (argType === 'undefined') {
			// eslint-disable-next-line no-console
			console.warn(`${moduleName}: Received 'undefined'`);
		}
	}

	return classes.join(' ');
}

export default debugClassnames;
