/*
 * Build-time and platform globals used by @enact/i18n.
 *
 * The ILIB_* constants are injected by Enact CLI (webpack DefinePlugin) at
 * build time; source code must always guard access with
 * `typeof X !== 'undefined'` since they may not be defined.
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
