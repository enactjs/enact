/* eslint-disable no-console */
/* global console performance PalmServiceBridge */
/**
 * Provides an observer class for making luna service subscriptions on webOS platforms.
 *
 * @module webos/LunaObserver
 * @exports LunaObserver
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


/**
 * An observer class for luna service subscriptions.
 *
 * @memberof webos/luna
 * @class
 */
class LunaObserver {
	/**
	 * Create a new LunaObserver
	 *
	 * @memberof webos/luna.LunaObserver
	 * @constructor
	 */
	constructor (callback) {
		this.records = [];
		this.callback = record => {
			if (callback) callback(record, this);
		};
	}

	/**
	 * Observes a subscription to a luna service.
	 *
	 * @method
	 * @memberof webos/luna.LunaObserver.prototype
	 * @param {String} service The name of the luna service.  Do not include 'luna://'.
	 * @param {Object} options Options for the luna call
	 * @param {String} options.method The name of the method.
	 * @param {Object} options.parameters Any parameters required by the service method. Can
	 *   alternatively be embedded within the options object itself for convenience.
	 * @param {Number} options.timeout The delay in milliseconds to wait for the request to return.
	 * @returns {undefined}
	 * @public
	 */
	observe (service, {method, parameters, timeout = 0, ...rest} = {}) {
		if (this.observing) return;
		this.observing = true;

		if (typeof window !== 'object' || !window.PalmServiceBridge) {
			this.callback({errorCode: -1, errorText: 'PalmServiceBridge not found.', returnValue: false});
			console.error('PalmServiceBridge not found.');
		} else {
			const params = Object.assign({subscribe: true}, parameters || rest);
			this.ts = performance.now();
			refs[this.ts] = this;
			this.bridge = new PalmServiceBridge();
			this.bridge.onservicecallback = msg => {
				if (!this.observing) return;
				if (this.timeout) this.timeout.stop();

				if (msg == null) {
					msg = invalid(msg);
				} else {
					try {
						msg = JSON.parse(msg);
					} catch (e) {
						msg = invalid(msg);
					}
				}

				this.callback(msg);
			};

			if (timeout) {
				this.timeout = new Job(() => {
					this.disconnect();
					this.callback({errorCode: -2, errorText: `Request timed out after ${timeout} ms.`, returnValue: false});
				}, timeout);
			}

			refs[this.ts].bridge.call(adjustPath(service) + method, JSON.stringify(params));
		}
	}

	/**
	 * Disconnect the luna observer
	 *
	 * @method
	 * @memberof webos/luna.LunaObserver.prototype
	 * @returns {undefined}
	 * @public
	 */
	disconnect () {
		this.observing = false;
		if (this.timeout) this.timeout.stop();
		if (this.bridge) {
			this.bridge.cancel();
			this.bridge = null;
		}

		if (this.ts && refs[this.ts]) {
			delete refs[this.ts];
		}
	}
}

export default LunaObserver;
export {LunaObserver};
