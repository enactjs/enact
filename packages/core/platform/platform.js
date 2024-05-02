/* global globalThis */
/**
 * Utilities for detecting basic platform capabilities.
 *
 * @module core/platform
 * @exports detect
 * @exports platform
 * @public
 */

import deprecate from '../internal/deprecate';

// Refer the following for more details: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
const browserEnvironment = () => !!globalThis.window;

// Note: Always true for Chrome v70 or higher: https://chromestatus.com/feature/4764225348042752
const featureTouchEvent = () => browserEnvironment() && ('TouchEvent' in globalThis);

// Refer https://patrickhlauke.github.io/touch/touchscreen-detection/
const deviceTouchScreen = () => browserEnvironment() && (
	// check if maxTouchPoints is greater than 0 first
	globalThis.navigator?.maxTouchPoints > 0 ||
	// check for any-pointer: coarse which mostly means touchscreen
	globalThis.matchMedia?.("(any-pointer: coarse)")?.matches
);

/*
 * Legacy Code to be removed in the next major release
 */
const hasGesture = () => {
	return Boolean(
		('ongesturestart' in window) || // non-standard and no major browser supports gesture events
		('onmsgesturestart' in window && ( // Internet Explorer 10 only
			window.navigator.msMaxTouchPoints > 1 || // Internet Explorer 10 only
			window.navigator.maxTouchPoints > 1
		))
	);
};

const hasTouch = () => {
	return Boolean(
		featureTouchEvent() ||
		('ontouchstart' in window) || // featureTouchEvent covers recent Firefox and Safari also, so no need when we deprecate old browsers
		window.navigator.msMaxTouchPoints || // Internet Explorer 10 only
		(window.navigator.msManipulationViewsEnabled && window.navigator.maxTouchPoints) // Internet Explorer only
	);
};

const webOSVersion = {
	38: 3,
	53: 4,
	68: 5,
	79: 6
};

const platforms = [
	// Windows Phone 7 - 10
	{platform: 'windowsPhone', regex: /Windows Phone (?:OS )?(\d+)[.\d]+/},
	// Edge
	{platform: 'edge', regex: /Chrome\/(\d+)[.\d]+.*Edg(?:e|A|iOS)?\/(\d+)[.\d]+/},
	{platform: 'edge', regex: /Edg(?:e|A|iOS)?\/(\d+)[.\d]+/},
	// Android 4+ using Chrome
	{platform: 'androidChrome', regex: /Android .* Chrome\/(\d+)[.\d]+/},
	// Android 2 - 4
	{platform: 'android', regex: /Android(?:\s|\/)(\d+)/},
	// Kindle Fire
	// Force version to 2, (desktop mode does not list android version)
	{platform: 'android', regex: /Silk\/1./, forceVersion: 2, extra: {silk: 1}},
	// Kindle Fire HD (Silk versions 2 or 3)
	// Force version to 4
	{platform: 'android', regex: /Silk\/2./, forceVersion: 4, extra: {silk: 2}},
	{platform: 'android', regex: /Silk\/3./, forceVersion: 4, extra: {silk: 3}},
	// IE 8 - 10
	{platform: 'ie', regex: /MSIE (\d+)/},
	// IE 11
	{platform: 'ie', regex: /Trident\/.*; rv:(\d+)/},
	// iOS 3 - 5
	// Apple likes to make this complicated
	{platform: 'ios', regex: /iP(?:hone|ad;(?: U;)? CPU) OS (\d+)/},
	// LG webOS
	{platform: 'webos', regex: /Web0S;.*Safari\/537.41/, forceVersion: 1},
	{platform: 'webos', regex: /Web0S;.*Safari\/538.2/, forceVersion: 2},
	{platform: 'webos', regex: /Web0S;.*Chrome\/(\d+)/},
	// LG webOS indeterminate versions
	{platform: 'webos', regex: /Web0S;/, forceVersion: -1},
	// LuneOS
	{platform: 'webos', regex: /LuneOS/, forceVersion: -1, extra: {luneos: 1}},
	// Palm/HP/Open webOS
	{platform: 'webos', regex: /WebAppManager|Isis|webOS\./, forceVersion: -1, extra: {legacy: 4}},
	{platform: 'webos', regex: /(?:web|hpw)OS\/1/, forceVersion: -1, extra: {legacy: 1}},
	{platform: 'webos', regex: /(?:web|hpw)OS\/2/, forceVersion: -1, extra: {legacy: 2}},
	{platform: 'webos', regex: /(?:web|hpw)OS\/3/, forceVersion: -1, extra: {legacy: 3}},
	// desktop Safari
	{platform: 'safari', regex: /Version\/(\d+)[.\d]+\s+Safari/},
	// desktop Chrome
	{platform: 'chrome', regex: /Chrome\/(\d+)[.\d]+/},
	// Firefox on Android
	{platform: 'androidFirefox', regex: /Android;.*Firefox\/(\d+)/},
	// FirefoxOS
	{platform: 'firefoxOS', regex: /Mobile;.*Firefox\/(\d+)/},
	// desktop Firefox
	{platform: 'firefox', regex: /Firefox\/(\d+)/},
	// Blackberry Playbook
	{platform: 'blackberry', regex: /PlayBook/i, forceVersion: 2},
	// Blackberry 10+
	{platform: 'blackberry', regex: /BB1\d;.*Version\/(\d+\.\d+)/},
	// Tizen
	{platform: 'tizen', regex: /Tizen (\d+)/}
];

const parseUserAgentLegacy = (userAgent) => {
	let plat = {
		gesture: hasGesture(),
		node: false,
		touch: hasTouch(),
		touchscreen: deviceTouchScreen(),
		unknown: true
	};

	for (let i = 0, p, m, v; (p = platforms[i]); i++) {
		m = p.regex.exec(userAgent);

		if (m) {
			plat.unknown = false;

			if ('forceVersion' in p) {
				v = p.forceVersion;
			} else if (p.platform  === 'webos') {
				v = webOSVersion[m[1]] || -1;

				if (v >= 7 || v === -1) {
					plat.chrome = Number(m[1]);
				}
			} else if (p.platform === 'edge' && m[2]) {
				plat.chrome = Number(m[1]);
				v = Number(m[2]);
			} else {
				v = Number(m[1]);
			}
			plat[p.platform] = v;
			if (p.extra) {
				plat = {
					...plat,
					...p.extra
				};
			}
			plat.platformName = p.platform;

			break;
		}
	}

	if ('webos' === plat.platformName) {
		deprecate({
			name: plat.platformName,
			message: 'Refer `@enact/webos`\'s `platform` for webOS specific information.',
			until: '5.0.0'
		});
	} else if (!['chrome', 'safari', 'firefox'].includes(plat.platformName)) {
		deprecate({
			name: plat.platformName,
			until: '5.0.0'
		});
	}

	return plat;
};

/*
 * The end of Legacy Code to be removed in the next major release
 */

// Refer https://www.whatismybrowser.com/guides/the-latest-user-agent/ for latest user agents of major browsers
const userAgentPatterns = [
	// Normal cases except iOS
	{browserName: 'safari',  regex: /\s+Version\/(\d+)(?:\.(\d+))?\s+Safari/},
	{browserName: 'chrome',  regex: /\s+Chrome\/(\d+)[.\d]+/},
	{browserName: 'firefox', regex: /\s+Firefox\/(\d+)[.\d]+/},
	// iOS
	{browserName: 'safari',  regex: /\((?:iPhone|iPad);.+\sOS\s(\d+)_(\d+)/}
];

// The base supported versions: Used in DEPRECATED warning
const supportedVersions = {safari: 15.6, chrome: 94, firefox: 115};

const parseUserAgent = (userAgent) => {
	const detectedInfo = {
		type: 'unknown',
		browserName: 'unknown',
		browserVersion: 0
	};
	let index;

	for (index = 0; index < userAgentPatterns.length; index++) {
		const testPlatform = userAgentPatterns[index];
		const match = testPlatform.regex.exec(userAgent);

		if (match) {
			detectedInfo.browserName = testPlatform.browserName;
			detectedInfo.browserVersion = Number(`${match[1]}.${match[2] || 0}`);
			break;
		}
	}

	if (index < userAgentPatterns.length) {
		if (userAgent.includes('Web0S;')) {
			detectedInfo.type = 'webos';
		} else if (userAgent.includes(' Mobile')) {
			// Note that we don't catch 'Tablet' of Firefox as it can't be normalized with other browsers
			detectedInfo.type = 'mobile';
		} else {
			detectedInfo.type = 'desktop';
		}

		detectedInfo[detectedInfo.browserName] = detectedInfo.browserVersion;
	}

	// deprecation warning for browser versions older than our support policy
	if (supportedVersions[detectedInfo.browserName] > detectedInfo.browserVersion) {
		deprecate({name: `supporting ${detectedInfo.browserName} version before ${supportedVersions[detectedInfo.browserName]}`, until: '5.0.0'});
	}

	// Merge legacy platform info
	return {...parseUserAgentLegacy(userAgent), ...detectedInfo};
};

/**
 * @typedef {Object} PlatformDescription
 * @property {String} browserName - The name of the detected browser
 * @property {Number} browserVersion - The version of the detected browser
 * @property {Number} chrome - The version of the detected browser, if chrome browser is detected
 * @property {Object} [extra] - Additional information about the detected platform. Deprecated: will be removed in 5.0.0.
 * @property {Number} firefox - The version of the detected browser, if firefox browser is detected
 * @property {Boolean} gesture - `true` if the platform has native double-finger events. Deprecated: will be removed in 5.0.0.
 * @property {Boolean} node - `true` only if `window` is `undefined`. Deprecated: will be removed in 5.0.0. Use `type` instead.
 * @property {String} [platformName] - The name of the platform, if detected. Deprecated: will be removed in 5.0.0. Use `browserName` instead for browser names.
 * @property {Number} safari - The version of the detected browser, if safari browser is detected
 * @property {Boolean} touch - `true` if the platform has native single-finger events. Deprecated: will be removed in 5.0.0. Use `touchEvent` instead.
 * @property {Boolean} touchEvent - `true` if the browser has native touch events
 * @property {Boolean} touchscreen - `true` if the platform has a touch screen. Deprecated: will be removed in 5.0.0. Use `touchScreen` instead.
 * @property {Boolean} touchScreen - `true` if the platform has a touch screen
 * @property {String} type - The type of the detected platform. One of 'desktop', 'mobile', 'webos', 'node', or 'unknown'
 * @property {Boolean} unknown - `true` for any unknown system. Deprecated: will be removed in 5.0.0. Use `type` instead.
 *
 * @memberof core/platform
 * @public
 */
let detectedPlatform = null;

/**
 * Returns the {@link core/platform.platform} object.
 *
 * @function detect
 * @returns {PlatformDescription}     The {@link core/platform.platform} object
 * @memberof core/platform
 * @public
 */
const detect = () => {
	if (detectedPlatform !== null) {
		// once detected, don't bother detecting again
		return detectedPlatform;
	}

	// Parse User Agent string first
	if (browserEnvironment()) {
		detectedPlatform = parseUserAgent(globalThis.navigator?.userAgent || '');
	} else {
		// node or compatible environment (e.g. prerendering or snapshot runs)
		detectedPlatform = {
			// the following properties are deprecated and will be removed in the next major release
			gesture: false,
			node: true,
			touch: false,
			unknown: true,
			// the following properties are new and will be available in the next major release
			type: 'node',
			browserName: 'unknown',
			browserVersion: 0 /* magic number for unknown */
		};
	}

	// Detect features
	detectedPlatform.touchEvent = featureTouchEvent();

	// Detect devices
	detectedPlatform.touchScreen = deviceTouchScreen();

	return detectedPlatform;
};

/**
 * Provides basic information about the running platform.
 *
 * @type {PlatformDescription}
 * @memberof core/platform
 * @public
 */
const platform = {};

[
	// the following properties are deprecated and will be removed in the next major release
	'gesture',
	'node',
	'platformName',
	'touch',
	'touchscreen',
	'unknown',
	// the following properties are new and will be available in the next major release
	'browserName',
	'browserVersion',
	'touchEvent',
	'touchScreen',
	'type',
	...(new Set(platforms.map(p => p.platform)))
].forEach(name => {
	Object.defineProperty(platform, name, {
		enumerable: true,
		get: () => {
			if (name === 'gesture' || name === 'unknown') {
				deprecate({
					name,
					until: '5.0.0'
				});
			}
			if (name === 'node') {
				deprecate({name, until: '5.0.0', replacedBy: 'type'});
			}
			if (name === 'platformName') {
				deprecate({name, until: '5.0.0', replacedBy: 'browserName'});
			}
			if (name === 'touch') {
				deprecate({name, until: '5.0.0', replacedBy: 'touchEvent'});
			}
			if (name === 'touchscreen') {
				deprecate({name, until: '5.0.0', replacedBy: 'touchScreen'});
			}

			const p = detect();
			return p[name];
		},
		set: (value) => {
			const p = detect();
			if (p.unknown === true) p[name] = value;
		}
	});
});

export default platform;
export {
	detect,
	parseUserAgent,
	platform
};
