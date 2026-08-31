/* eslint-disable-next-line spaced-comment -- triple-slash reference directive, not a comment */
/// <reference path="../node_modules/@enact/core/types/global.d.ts" />

/*
 * webOS platform globals used by @enact/webos.
 *
 * The reference above pulls in @enact/core's own `__DEV__`/`ErrorConstructor.
 * captureStackTrace` globals: this package's tsc run resolves @enact/core's
 * real .ts source (not a published .d.ts) via the workspace symlink, so it
 * type-checks those files' bodies too and needs the same ambient globals
 * core declares for itself.
 */

interface WebOSServiceBridge {
	onservicecallback: ((msg: string) => void) | null;
	call: (uri: string, params: string) => void;
	cancel: () => void;
}

interface WebOSServiceBridgeConstructor {
	new (): WebOSServiceBridge;
}

interface WebOSSystem {
	identifier?: string;
	deviceInfo?: string;
	platformBack?: () => void;
	isKeyboardVisible?: boolean;
	PmLogString?: (level: number, messageId: string | null, keyVals: string | null, freeText?: string | null) => void;
	PmLogInfoWithClock?: (messageId: string, perfType: string, perfGroup: string) => void;
	getIdentifier?: () => string;
	stageReady?: () => void;
}

interface Window {
	webOSSystem?: WebOSSystem;
	PalmSystem?: WebOSSystem;
	WebOSServiceBridge?: WebOSServiceBridgeConstructor;
	PalmServiceBridge?: WebOSServiceBridgeConstructor;
}
