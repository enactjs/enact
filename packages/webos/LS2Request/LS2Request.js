/* eslint-disable no-console */
/* global console */

const refs = {};

const adjustPath = (path) => {
	if (path.slice(-1) !== '/') {
		path += '/';
	}
	return path;
};

export default class LS2Request {
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
		subscribe = false
	}) {
		if (typeof window !== 'object' || !window.PalmServiceBridge) {
			/* eslint no-unused-expressions: ["error", { "allowShortCircuit": true }]*/
			onFailure && onFailure({errorCode:-1, errorText:'PalmServiceBridge not found.', returnValue: false});
			onComplete && onComplete({errorCode:-1, errorText:'PalmServiceBridge not found.', returnValue: false});
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

		return this;
	}

	callback (onSuccess, onFailure, onComplete, msg) {
		if (this.cancelled) {
			return;
		}
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
