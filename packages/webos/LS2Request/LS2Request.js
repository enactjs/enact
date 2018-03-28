/* eslint-disable no-console */
/* global console */
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

export default class LS2Request {
	timeoutJob = new Job(({onTimeout, timeout}) => {
		onTimeout({errorCode: -2, errorText: `Request timed out after ${timeout} ms.`, returnValue: false});
		// cancel the request
		this.cancel();
	});

	constructor () {
		this.bridge = null;
		this.cancelled = false;
		this.subscribe = false;
	}

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
	}) {
		if (!onFailure && !onComplete) {
			onFailure = failureHandler;
		}

		if (typeof window !== 'object' || !window.PalmServiceBridge) {
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
		this.bridge.call(adjustPath(service) + method, JSON.stringify(parameters));
		if (timeout) {
			this.timeoutJob.startAfter(timeout, {onTimeout, timeout});
		}
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
