/* eslint-disable no-console */
/* global console */

/**
 * Provides a collection of functions for fetching application metadata.
 *
 * @module webos/application
 * @exports fetchAppId,
 * @exports fetchAppInfo,
 * @exports fetchAppRootPath,
 * @exports platformBack
 */

let appInfo = {};

/**
 * Fetches the appID of the caller app.
 *
 * @function
 * @returns {String} AppID of the app
 * @memberof webos/application
 * @public
 */
const fetchAppId = () => {
	if (window.PalmSystem && window.PalmSystem.identifier) {
		// PalmSystem.identifier: <appid> <processid>
		return window.PalmSystem.identifier.split(' ')[0];
	}
};

/**
 * The callback signature for `fetchAppInfo`
 *
 * @callback appInfoCallback
 * @param {?object} info - JSON data object read from the app's *appinfo.json* file. `undefined` if not found.
 * @memberof webos/application
 */

/**
 * Fetches the *appinfo.json* data of the caller app.
 *
 * @function
 * @param {webos/application~appInfoCallback} callback - Called upon completion
 * @param {String} [path] - Optional relative filepath to a specific *appinfo.json* to read
 * @returns {undefined}
 * @memberof webos/application
 * @public
 */
const fetchAppInfo = (callback, path) => {
	if (Object.keys(appInfo).length === 0) {
		const parseInfo = (err, info) => {
			if (!err && info) {
				try {
					appInfo = JSON.parse(info);
					if (callback) callback(appInfo);
				} catch (e) {
					console.error('Unable to parse appinfo.json file for ' + fetchAppId);
					if (callback) callback();
				}
			} else if (callback) {
				callback();
			}
		};
		const req = new window.XMLHttpRequest();
		req.onreadystatechange = function () {
			if (req.readyState === 4) {
				if ((req.status >= 200 && req.status < 300) || req.status === 0) {
					parseInfo(null, req.responseText);
				} else {
					parseInfo({status: 404});
				}
			}
		};
		try {
			req.open('GET', path || 'appinfo.json', true);
			req.send(null);
		} catch (e) {
			parseInfo({status: 404});
		}
	} else if (callback) {
		callback(appInfo);
	}
};

/**
 * Fetches the full root URI (path) of the caller app.
 *
 * @function
 * @returns {String} App's URI (application install path)
 * @memberof webos/application
 * @public
 */
const fetchAppRootPath = () => {
	let base = window.location.href;
	if ('baseURI' in window.document) {
		base = window.document.baseURI;
	} else {
		const baseTags = window.document.getElementsByTagName('base');
		if (baseTags.length > 0) {
			base = baseTags[0].href;
		}
	}
	const match = base.match(new RegExp('.*://[^#]*/'));
	if (match) {
		return match[0];
	}
	return '';
};

/**
 * Emulate the remote *back* key.
 *
 * @function
 * @returns {undefined}
 * @memberof webos/application
 * @public
 */
const platformBack = () => {
	if (window.PalmSystem && window.PalmSystem.platformBack) {
		return window.PalmSystem.platformBack();
	}
};

export {
	fetchAppId,
	fetchAppInfo,
	fetchAppRootPath,
	platformBack
};
