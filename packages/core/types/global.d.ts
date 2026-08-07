declare global {
	interface ErrorConstructor {
		captureStackTrace(thisArg: any, func?: any): void;
	}

	const __DEV__: boolean;
}

export {};
