/* eslint-disable no-console */
/**
 * Provides a class for making LS2 service requests on webOS platforms.
 *
 * @module webos/LS2Request
 * @exports LS2Request
 */

import {Job} from '@enact/core/util';

import type {LS2Callback, LS2RequestOptions, LS2Response} from '../types';

const refs: Record<number, LS2Request> = {};

const adjustPath = (path: string) => {
	if (!/^(luna|palm):\/\//.test(path)) path = 'luna://' + path;
	if (path.slice(-1) !== '/') path += '/';
	return path;
};

// default handlers
const failureHandler: LS2Callback = ({errorText}) => console.error(`LS2Request: ${errorText}`);
const timeoutHandler: LS2Callback = ({errorText}) => console.warn(`LS2Request: ${errorText}`);

type TimeoutJobArgs = {
	onTimeout: LS2Callback;
	timeout: number;
};

/**
 * A class for managing LS2 Requests.
 *
 * @memberof webos/LS2Request
 * @class
 */
export default class LS2Request {
	timeoutJob = new Job(({onTimeout, timeout}: TimeoutJobArgs) => {
		onTimeout({errorCode: -2, errorText: `Request timed out after ${timeout} ms.`, returnValue: false});
		// cancel the request
		this.cancel();
	}, 0);

	bridge: WebOSServiceBridge | null;
	subscribe: boolean;
	cancelled?: boolean;
	ts?: number;

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
	 * @param {String} options.service The name of the LS2 service.
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
		timeout = 0
	}: LS2RequestOptions) {
		const WebOSServiceBridge = typeof window === 'object' ? (window.WebOSServiceBridge ?? window.PalmServiceBridge) : null;

		this.cancelled = false;

		if (!onFailure && !onComplete) {
			onFailure = failureHandler;
		}

		if (typeof WebOSServiceBridge !== 'function') {
			const errorText = 'WebOSServiceBridge not found.';
			/* eslint no-unused-expressions: ["error", { "allowShortCircuit": true }]*/
			if (onFailure) onFailure({errorCode: -1, errorText, returnValue: false});
			if (onComplete) onComplete({errorCode: -1, errorText, returnValue: false});
			console.error(errorText);
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

		this.ts = performance.now();
		refs[this.ts] = this;

		this.bridge = new WebOSServiceBridge();
		this.bridge.onservicecallback = this.callback.bind(this, onSuccess, onFailure, onComplete);
		if (timeout) {
			this.timeoutJob.startAfter(timeout, {onTimeout, timeout});
		}
		this.bridge.call(adjustPath(service) + method, JSON.stringify(parameters));
		return this;
	}

	callback (onSuccess: LS2Callback | null, onFailure: LS2Callback | null, onComplete: LS2Callback | null, msg?: string | null) {
		if (this.cancelled) {
			return;
		}

		// remove timeout job
		this.timeoutJob.stop();

		let parsedMsg: LS2Response;

		if (msg == null) {
			parsedMsg = {
				errorCode: -1,
				errorText: `Invalid response: ${msg}`,
				returnValue: false
			};
		} else {
			try {
				parsedMsg = JSON.parse(msg);
			} catch {
				parsedMsg = {
					errorCode: -1,
					errorText: msg,
					returnValue: false
				};
			}
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
