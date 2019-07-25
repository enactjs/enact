/* eslint-disable no-console */
/* global console performance PalmServiceBridge */
/**
 * Provides a utility function for making luna service requests on webOS platforms.
 *
 * @module webos/luna
 * @exports luna
 */

import {Job} from '@enact/core/util';

const refs = {};

const adjustPath = path => {
	if (path.slice(-1) !== '/') {
		path += '/';
	}
	return path;
};

const invalid = msg => ({
	errorCode: -1,
	errorText: `Invalid response: ${msg}`,
	returnValue: false
});

const cancel = key => {
	if (refs[key] && refs[key].bridge) {
		refs[key].bridge.cancel();
		refs[key].bridge = null;
	}
};

/**
 * A Promise-based function for luna service requests
 *
 * @method
 * @memberof webos/luna
 * @param {String} service The name of the luna service.  Do not include 'luna://'.
 * @param {Object} options Options for the luna call
 * @param {String} options.method The name of the method.
 * @param {Object} options.parameters Any parameters required by the service method. Can
 *   alternatively be embedded within the options object itself for convenience.
 * @param {Number} options.timeout The delay in milliseconds to wait for the request to return.
 * @returns {Promise}
 * @public
 */
function luna (service, {method, parameters, timeout = 0, ...rest} = {}) {
	return new Promise((resolve, reject) => {
		if (typeof window !== 'object' || !window.PalmServiceBridge) {
			reject({errorCode: -1, errorText: 'PalmServiceBridge not found.', returnValue: false});
			console.error('PalmServiceBridge not found.');
		} else {
			const ts = performance.now();
			refs[ts] = {bridge: new PalmServiceBridge()};
			refs[ts].bridge.onservicecallback = function (msg) {
				if (!refs[ts]) return;
				if (refs[ts].timeout) refs[ts].timeout.stop();
				delete refs[ts];

				if (msg == null) {
					msg = invalid(msg);
				} else {
					try {
						msg = JSON.parse(msg);
					} catch (e) {
						msg = invalid(msg);
					}
				}

				if ((msg.errorCode || msg.returnValue === false)) {
					reject(msg);
				} else {
					resolve(msg);
				}
			};

			if (timeout) {
				refs[ts].timeout = new Job(() => {
					cancel(refs[ts]);
					delete refs[ts];
					reject({errorCode: -2, errorText: `Request timed out after ${timeout} ms.`, returnValue: false});
				}, timeout);
			}

			refs[ts].bridge.call(adjustPath(service) + method, JSON.stringify(parameters || rest));
		}
	});
}

export default luna;
export {luna};
