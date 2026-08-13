/*
 * Build-time and platform globals used by @enact/spotlight.
 */

interface WebOSCursor {
	visibility?: boolean;
}

interface WebOSSystem {
	cursor?: WebOSCursor;
	[key: string]: unknown;
}

interface Window {
	webOSSystem?: WebOSSystem;
	PalmSystem?: WebOSSystem;
}

interface Document {
	dataset?: DOMStringMap;
}

declare const global: typeof globalThis;

declare const process: {
	env: {
		NODE_ENV?: string;
		[key: string]: string | undefined;
	};
};

// Injected by the build (e.g. webpack DefinePlugin) to strip dev-only code from production bundles.
declare const __DEV__: boolean;
