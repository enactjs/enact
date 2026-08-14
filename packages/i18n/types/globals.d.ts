/* eslint-disable-next-line spaced-comment -- triple-slash reference directive, not a comment */
/// <reference path="../node_modules/@enact/core/types/global.d.ts" />

/*
 * Build-time and platform globals used by @enact/i18n.
 *
 * The ILIB_* constants are injected by Enact CLI (webpack DefinePlugin) at
 * build time; source code must always guard access with
 * `typeof X !== 'undefined'` since they may not be defined.
 *
 * The reference above pulls in @enact/core's own `__DEV__`/`ErrorConstructor.
 * captureStackTrace` globals: this package's tsc run resolves @enact/core's
 * real .ts source (not a published .d.ts) via the workspace symlink, so it
 * type-checks those files' bodies too and needs the same ambient globals
 * core declares for itself. There's no TS project-references setup in this
 * monorepo, so this reference does that wiring by hand.
 */

declare const ILIB_BASE_PATH: string;
declare const ILIB_RESOURCES_PATH: string;
declare const ILIB_ADDITIONAL_RESOURCES_PATH: string;
declare const ILIB_CACHE_ID: string;

interface Window {
	// webOS platform globals
	webOSSystem?: object;
	PalmSystem?: object;
	// system UI locale hack (see src/glue.ts, GF-1581)
	UILocale?: string;
}

declare const global: typeof globalThis & {
	// external ilib/resbundle data injected by the platform
	ilibData?: {[key: string]: any};
	resBundleData?: {[key: string]: any};
};
