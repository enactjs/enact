/* eslint-disable no-console */
/* global console */

/**
 * Fetches the appID of the caller app
 * @returns {String} AppID of the app.
 */
const fetchAppId = () => {
	if (window.PalmSystem && window.PalmSystem.identifier) {
		// PalmSystem.identifier: <appid> <processid>
		return window.PalmSystem.identifier.split(' ')[0];
	}
};

/**
 * @callback webOS~appInfoCallback
 * @param {?object} info - JSON data object read from the app's "appinfo.json" file. Undefined if not found.
 */
let appInfo = {};
/**
 * Fetches the appinfo.json data of the caller app with a cache saved to webOS.appInfo
 * @param {webOS~appInfoCallback} callback - The function to called upon completion
 * @param {String} [path] - An optional relative filepath from the current document to a specific appinfo to read
 * @returns {undefined}
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
					parseInfo({status:404});
				}
			}
		};
		try {
			req.open('GET', path || 'appinfo.json', true);
			req.send(null);
		} catch (e) {
			parseInfo({status:404});
		}
	} else if (callback) {
		callback(appInfo);
	}
};

/**
 * Fetches the full root URI path of the caller app
 * @returns {String} App's URI path the app is within.
 */
const fetchAppRootPath = () => {
	let base = window.location.href;
	if ('baseURI' in window.document) {
		base = window.document.baseURI;
	} else {
		let baseTags = window.document.getElementsByTagName('base');
		if (baseTags.length > 0) {
			base = baseTags[0].href;
		}
	}
	let match = base.match(new RegExp('.*:\/\/[^#]*\/'));
	if (match) {
		return match[0];
	}
	return '';
};

/**
 * Emulate the back key to move backwards 1 level.
 * @returns {undefined}
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
