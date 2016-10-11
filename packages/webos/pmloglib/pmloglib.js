// Convenience wrapper around PmLogLib logging API

// Log level constants
const levelEmergency = 0;
const levelAlert = 1;
const levelCritical = 2;
const levelError = 3;
const levelWarning = 4;
const levelNotice = 5;
const levelInfo = 6;
const levelDebug = 7;

const isObject = (obj) => !!obj && (typeof obj === 'object') && (Object.prototype.toString.call(obj) !== '[object Array]');

// Log function stringifies and escapes keyVals, and passes to PmLogString
const log = (level, messageId, keyVals, freeText) => {
	if (window.PalmSystem) {
		if (keyVals && !isObject(keyVals)) {
			level = levelError;
			keyVals = {msgid: messageId};
			messageId = 'MISMATCHED_FMT';
			freeText = null;
			console.warn('webOSLog called with invalid format: keyVals must be an object');
		}
		if (!messageId && level !== levelDebug) {
			console.warn('webOSLog called with invalid format: messageId was empty');
		}
		if (keyVals) {
			keyVals = JSON.stringify(keyVals);
		}
		if (window.PalmSystem.PmLogString) {
			if (level === levelDebug) { // debug only accepts 2 arguments
				window.PalmSystem.PmLogString(level, null, null, freeText);
			} else {
				window.PalmSystem.PmLogString(level, messageId, keyVals, freeText);
			}
		} else {
			console.error('Unable to send log; PmLogString not found in this version of PalmSystem');
		}
	}
};

/**
 * Logs with PmLogLib at the "emergency" level
 * @param {String} messageId - Short string that uniquely identifies the log message within a component.
 * @param {Object} keyVals - Key-value pairs to log
 * @param {String} freeText - Text string to log
 * @returns {undefined}
 */
const emergency = (messageId, keyVals, freeText) => {
	log(levelEmergency, messageId, keyVals, freeText);
};

/**
 * Logs with PmLogLib at the "alert" level
 * @param {String} messageId - Short string that uniquely identifies the log message within a component.
 * @param {Object} keyVals - Key-value pairs to log
 * @param {String} freeText - Text string to log
 * @returns {undefined}
 */
const alert = (messageId, keyVals, freeText) => {
	log(levelAlert, messageId, keyVals, freeText);
};

/**
 * Logs with PmLogLib at the "critical" level
 * @param {String} messageId - Short string that uniquely identifies the log message within a component.
 * @param {Object} keyVals - Key-value pairs to log
 * @param {String} freeText - Text string to log
 * @returns {undefined}
 */
const critical = (messageId, keyVals, freeText) => {
	log(levelCritical, messageId, keyVals, freeText);
};

/**
 * Logs with PmLogLib at the "error" level
 * @param {String} messageId - Short string that uniquely identifies the log message within a component.
 * @param {Object} keyVals - Key-value pairs to log
 * @param {String} freeText - Text string to log
 * @returns {undefined}
 */
const error = (messageId, keyVals, freeText) => {
	log(levelError, messageId, keyVals, freeText);
};

/**
 * Logs with PmLogLib at the "warning" level
 * @param {String} messageId - Short string that uniquely identifies the log message within a component.
 * @param {Object} keyVals - Key-value pairs to log
 * @param {String} freeText - Text string to log
 * @returns {undefined}
 */
const warning = (messageId, keyVals, freeText) => {
	log(levelWarning, messageId, keyVals, freeText);
};

/**
 * Logs with PmLogLib at the "notice" level
 * @param {String} messageId - Short string that uniquely identifies the log message within a component.
 * @param {Object} keyVals - Key-value pairs to log
 * @param {String} freeText - Text string to log
 * @returns {undefined}
 */
const notice = (messageId, keyVals, freeText) => {
	log(levelNotice, messageId, keyVals, freeText);
};

/**
 * Logs with PmLogLib at the "info" level
 * @param {String} messageId - Short string that uniquely identifies the log message within a component.
 * @param {Object} keyVals - Key-value pairs to log
 * @param {String} freeText - Text string to log
 * @returns {undefined}
 */
const info = (messageId, keyVals, freeText) => {
	log(levelInfo, messageId, keyVals, freeText);
};

/**
 * Logs with PmLogLib at the "debug" level
 * @param {String} freeText - Text string to log
 * @returns {undefined}
 */
const debug = (freeText) => {
	log(levelDebug, '', '', freeText);
};

export {
	emergency,
	alert,
	critical,
	error,
	warning,
	notice,
	info,
	debug
};
