/**
 * Provides the `deprecate` method
 *
 * @module core/internal/deprecate
 * @private
 */

// Utility method to format deprecate message
const formatMsg = ({message, name, until, replacedBy, since}) => {
	let msg = 'DEPRECATED:';

	if (name) {
		msg += ` ${name}`;
	}
	if (since) {
		msg += ` since ${since}`;
	}
	if (until) {
		if (name || since) {
			msg += '.';
		}
		msg += ` Will be removed in ${until}`;
	}
	if (replacedBy) {
		if (name || since || until) {
			msg += '.';
		}
		msg += ` Replaced by ${replacedBy}`;
	}
	if (name || since || until || replacedBy) {
		msg += '.';
	}
	if (message) {
		msg += ` ${message}.`;
	}
	return msg;
};

// Utility method for console warning
const warn = (msg) => {
	if (typeof console !== 'undefined') {
		console.warn(msg);	// eslint-disable-line no-console
	}
};

/**
 * Marks a function, component or property (via `propTypes`) as deprecated. Deprecated items will
 * log a message on first invocation. Can also be used 'stand-alone' to issue a deprecation warning.
 * In stand-alone mode it currently will log every time.  In production mode, the deprecation
 * warning disappears.
 *
 * @function
 * @param {*} thing - The thing to be wrapped, or the deprecation config in stand-alone
 * @param {Object?} config - The deprecation config
 * @param {String?} config.name - An optional name for the deprecated item
 * @param {String?} config.message - An optional message to display
 * @param {String?} config.since - The version where deprecation started (optional)
 * @param {String?} config.until - The version where the functionality will be removed (optional)
 * @param {String?} config.replacedBy - An optional alternative
 * @param {Boolean?} config.alwaysWarn - If `true`, a warning will be issued for every access
 * @returns {*} Either a wrapped version of `thing` or an unwrapped version of `thing` in
 *	production or stand-alone mode
 * @memberof core/internal/deprecate
 * @private
 */
const deprecate = function (thing, config) {
	if (__DEV__) {
		if (!config) {	// If no config, config only invocation, just log message
			const msg = formatMsg(thing);
			warn(msg);
			return thing;
		} else {
			let displayed, msg;
			return (...args) => {
				if (!displayed || config.alwaysWarn) {
					if (!msg) {
						msg = formatMsg(config);
					}
					warn(msg);
					displayed = true;
				}
				return thing(...args);
			};
		}
	} else {
		/* istanbul ignore next */
		return thing;
	}
};

export default deprecate;
export {deprecate};
