/* eslint-disable no-console */
/* global console */
/**
 * Provides a class for making LS2 service requests on webOS platforms.
 *
 * @module webos/LS2Request
 * @exports LS2Request
 */

import {Job} from '@enact/core/util';

const refs = {};

const adjustPath = (path) => {
	if (path.slice(-1) !== '/') {
		path += '/';
	}
	return path;
};

// default handlers
const failureHandler = ({errorText}) => console.error(`LS2Request: ${errorText}`);
const timeoutHandler = ({errorText}) => console.warn(`LS2Request: ${errorText}`);

/**
 * A class for managing LS2 Requests.
 *
 * @memberof webos/LS2Request
 * @class
 */
export default class LS2Request {
	timeoutJob = new Job(({onTimeout, timeout}) => {
		onTimeout({errorCode: -2, errorText: `Request timed out after ${timeout} ms.`, returnValue: false});
		// cancel the request
		this.cancel();
	});

	/**
	 * Create a new LS2 request
	 *
	 * @memberof webos/LS2Request.LS2Request
	 * @constructor
	 */
	constructor () {
		this.bridge = null;
		this.subscribe = false;
	}

	/**
	 * Send a request to an LS2 service method.
	 *
	 * @method
	 * @memberof webos/LS2Request.LS2Request.prototype
	 * @param {Object} options Options for the LS2 Request call
	 * @param {String} options.service The name of the LS2 service.  Do not include 'luna://'.
	 * @param {String} options.method The name of the method.
	 * @param {Object} options.parameters Any parameters required by the service method.
	 * @param {Function} options.onSuccess The success handler for the request.
	 * @param {Function} options.onFailure The failure handler for the request.
	 * @param {Function} options.onComplete The handler to run when the request
	 *	is completed, regardless of return status.
	 * @param {Function} options.onTimeout The handler to run when the request
	 *	times out.  Used in conjunction with `timeout`.
	 * @param {Boolean} options.subscribe Subscribe to service methods that support subscription.
	 * @param {Number} options.timeout The delay in milliseconds to wait for the request to return.
	 * @param {Object} options.mockData The mock data to return when PalmServiceBridge not found.
	 * @returns {webos/LS2Request}
	 * @public
	 */
	send ({
		service = '',
		method = '',
		parameters = {},
		onSuccess = null,
		onFailure = null,
		onComplete = null,
		onTimeout = timeoutHandler,
		subscribe = false,
		timeout = 0,
		mockData = null
	}) {
		this.cancelled = false;

		if (!onFailure && !onComplete) {
			onFailure = failureHandler;
		}

		if (typeof window !== 'object' || !window.PalmServiceBridge) {
			if (mockData) {
				if (mockData.errorCode || mockData.returnValue === false) {
					onFailure && onFailure(mockData);
				} else {
					onSuccess && onSuccess(mockData);
				}
				onComplete && onComplete(mockData);
				return;
			}
			/* eslint no-unused-expressions: ["error", { "allowShortCircuit": true }]*/
			onFailure && onFailure({errorCode: -1, errorText: 'PalmServiceBridge not found.', returnValue: false});
			onComplete && onComplete({errorCode: -1, errorText: 'PalmServiceBridge not found.', returnValue: false});
			console.error('PalmServiceBridge not found.');
			return;
		}

		if (this.ts && refs[this.ts]) {
			delete refs[this.ts];
		}

		this.subscribe = subscribe;
		if (this.subscribe) {
			parameters.subscribe = this.subscribe;
		}
		if (parameters.subscribe) {
			this.subscribe = parameters.subscribe;
		}

		// eslint-disable-next-line no-undef
		this.ts = performance.now();
		refs[this.ts] = this;

		// eslint-disable-next-line no-undef
		this.bridge = new PalmServiceBridge();
		this.bridge.onservicecallback = this.callback.bind(this, onSuccess, onFailure, onComplete);
		if (timeout) {
			this.timeoutJob.startAfter(timeout, {onTimeout, timeout});
		}
		this.bridge.call(adjustPath(service) + method, JSON.stringify(parameters));
		return this;
	}

	callback (onSuccess, onFailure, onComplete, msg) {
		if (this.cancelled) {
			return;
		}

		// remove timeout job
		this.timeoutJob.stop();

		let parsedMsg;
		try {
			parsedMsg = JSON.parse(msg);
		} catch (e) {
			parsedMsg = {
				errorCode: -1,
				errorText: msg,
				returnValue: false
			};
		}

		if ((parsedMsg.errorCode || parsedMsg.returnValue === false)) {
			if (onFailure) {
				onFailure(parsedMsg);
			}
		} else if (onSuccess) {
			onSuccess(parsedMsg);
		}

		if (onComplete) {
			onComplete(parsedMsg);
		}
		if (!this.subscribe) {
			this.cancel();
		}
	}

	/**
	 * Cancel the current LS2 request.
	 *
	 * @method
	 * @memberof webos/LS2Request.LS2Request.prototype
	 * @returns {undefined}
	 * @public
	 */
	cancel () {
		// remove timeout job
		this.timeoutJob.stop();

		this.cancelled = true;
		if (this.bridge) {
			this.bridge.cancel();
			this.bridge = null;
		}

		if (this.ts && refs[this.ts]) {
			delete refs[this.ts];
		}
	}
}
