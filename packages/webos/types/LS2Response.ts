/**
 * Parsed JSON payload returned by an LS2 service method.
 */
export type LS2Response = {
	returnValue?: boolean;
	errorCode?: number;
	errorText?: string;
	[key: string]: any;
};

/**
 * Callback invoked with an LS2 service response.
 */
export type LS2Callback = (msg: LS2Response) => void;

/**
 * Options for {@link webos/LS2Request.LS2Request#send}.
 */
export type LS2RequestOptions = {
	service?: string;
	method?: string;
	parameters?: Record<string, any>;
	onSuccess?: LS2Callback | null;
	onFailure?: LS2Callback | null;
	onComplete?: LS2Callback | null;
	onTimeout?: LS2Callback;
	subscribe?: boolean;
	timeout?: number;
};
