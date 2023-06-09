/**
 * Utilities for detecting basic platform capabilities.
 *
 * @module core/platform
 * @exports detect
 * @exports platform
 * @public
 */

import uniq from 'ramda/src/uniq';

import deprecate from '../internal/deprecate';

const hasGesture = () => {
	return Boolean(
		('ongesturestart' in window) ||
		('onmsgesturestart' in window && (
			window.navigator.msMaxTouchPoints > 1 ||
			window.navigator.maxTouchPoints > 1
		))
	);
};

const hasTouch = () => {
	return Boolean(
		('TouchEvent' in window) ||
		('ontouchstart' in window) ||
		window.navigator.msMaxTouchPoints ||
		(window.navigator.msManipulationViewsEnabled && window.navigator.maxTouchPoints)
	);
};

// Adapted from https://patrickhlauke.github.io/touch/touchscreen-detection/
// I've omitted the touch event fallback since that is covered by hasTouch and we're less concerned
// with legacy browsers used in touchscreen environments.
const hasTouchScreen = () => {
	return (
		// if Pointer Events are supported, just check maxTouchPoints
		(window.PointerEvent && ('maxTouchPoints' in window.navigator) && window.navigator.maxTouchPoints > 0) ||
		// check for any-pointer:coarse which mostly means touchscreen
		(window.matchMedia && window.matchMedia('(any-pointer:coarse)').matches)
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
	// LG webOS of indeterminate versionre
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

const ua = () => {
	return window.navigator ? window.navigator.userAgent : '';
};

let _platform;

const parseUserAgent = (userAgent) => {
	let plat = {
		gesture: hasGesture(),
		node: false,
		touch: hasTouch(),
		touchscreen: hasTouchScreen(),
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

	if (plat.platformName === 'windowsPhone') {
		deprecate({
			name: 'Windows Phone platform',
			until: '5.0.0'
		});
	}

	return plat;
};

/**
 * @typedef {Object} PlatformDescription
 * @property {Object} [extra] - Additional information about the detected platform
 * @property {Boolean} gesture - `true` if the platform has native double-finger events
 * @property {Boolean} node - `true` only if `window` is `undefined`
 * @property {String} [platformName] - The name of the platform, if detected
 * @property {Boolean} touch - `true` if the platform has native single-finger events
 * @property {Boolean} touchscreen - `true` if the platform has a touch screen
 * @property {Boolean} unknown - `true` for any unknown system
 *
 * @memberof core/platform
 * @public
 */

/**
 * Returns the {@link core/platform.platform} object.
 *
 * @function detect
 * @returns {PlatformDescription}     The {@link core/platform.platform} object
 * @memberof core/platform
 * @public
 */
const detect = () => {
	if (_platform) {
		// if we've already determined the platform, we'll use that determination
		return _platform;
	} else if (typeof window === 'undefined') {
		return {
			gesture: false,
			node: true,
			touch: false,
			unknown: true
		};
	}

	const userAgent = ua();

	return (_platform = parseUserAgent(userAgent));
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
	'gesture',
	'node',
	'platformName',
	'touch',
	'touchscreen',
	'unknown',
	...uniq(platforms.map(p => p.platform))
].forEach(name => {
	Object.defineProperty(platform, name, {
		enumerable: true,
		get: () => {
			const p = detect();
			return p[name];
		}
	});
});

export default platform;
export {
	detect,
	parseUserAgent,
	platform
};
