/**
 * Utilities for webOS platform detection.
 *
 * @module webos/platform
 * @exports detect
 * @exports platform
 */

import deprecate from '@enact/core/internal/deprecate';

const webOSVersion = [
	// Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/5.2.1 Chrome/38.0.2125.122 Safari/537.36 WebAppManager
	{chrome: 38, version: 3},
	// Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.34 Safari/537.36 WebAppManager
	{chrome: 53, version: 4},
	// Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36 WebAppManager
	{chrome: 68, version: 5},
	// Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36 WebAppManager
	{chrome: 79, version: 6},
	// Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 WebAppManager
	{chrome: 87, version: 22},
	// Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.128 Safari/537.36 WebAppManager
	{chrome: 94, version: 23}
];

const platforms = [
	// LG webOS before adapting Chrome
	{regex: /Web0S;.*Safari\/537.41/, version: 1}, // using WebKit 537.41 for WebAppManager, using Chrome 26 for the browser app
	{regex: /Web0S;.*Safari\/538.2/, version: 2},  // using WebKit 538.2  for WebAppManager, using Chrome 34 for the browser app
	// LG webOS using Chrome
	...webOSVersion.map(({chrome, version}) => ({regex: new RegExp(`Web0S;.*Chrome/${chrome}`), version, chrome})),
	{regex: /Web0S;.*Chrome\/(\d+)/},
	// Fallback
	{regex: /Web0S;/}
];

const parseUserAgent = (userAgent) => {
	// build out our cached platform determination for future usage
	const platformInfo = {webos: false};

	if (userAgent.indexOf('SmartWatch') > -1) {
		platformInfo.watch = true;
	} else if (userAgent.indexOf('SmartTV') > -1) {
		platformInfo.tv = true;
	} else if (userAgent.indexOf('Large Screen') > -1) {
		deprecate({
			name: 'Detecting webOS TV by "Large Screen" from the user agent string',
			until: '5.0.0'
		});
		platformInfo.tv = true;
	} else {
		const webOSSystem = window.webOSSystem ?? window.PalmSystem;
		try {
			let legacyInfo = JSON.parse(webOSSystem.deviceInfo || '{}');
			if (legacyInfo.platformVersionMajor && legacyInfo.platformVersionMinor) {
				let major = parseInt(legacyInfo.platformVersionMajor);
				let minor = parseInt(legacyInfo.platformVersionMinor);
				if (major < 3 || (major === 3 && minor <= 0)) {
					platformInfo.legacy = true;
				} else {
					platformInfo.open = true;
				}
			} else {
				platformInfo.unknown = true;
			}
		} catch (e) {
			platformInfo.open = true;
		}

		webOSSystem?.stageReady?.();
	}

	for (let index = 0, p, match; (p = platforms[index]); index++) {
		match = p.regex.exec(userAgent);
		if (match) {
			platformInfo.webos = true;
			if (p.version) {
				platformInfo.version = p.version;
			}
			if (p.chrome) {
				platformInfo.chrome = p.chrome;
			} else if (match[1]) { // if a chrome version is detected
				platformInfo.chrome = Number(match[1]);
			}

			break;
		}
	}

	return platformInfo;
};

let _platform = null;

/**
 * Returns the {@link webos/platform.platform} object.
 *
 * @function
 * @returns {Object} The {@link webos/platform.platform} object
 * @memberof webos/platform
 * @public
 */
function detect () {
	if (_platform) {
		// if we've already determined the platform, we'll use that determination
		return _platform;
	} else if (typeof window === 'undefined' || (!window.webOSSystem && !window.PalmSystem)) {
		// if window isn't available (in prerendering or snapshot runs), bail out early
		return {
			unknown: true
		};
	}

	_platform = parseUserAgent(window.navigator.userAgent || '');

	return _platform;
}


/**
 * Provides identification of webOS variants.
 *
 * @readonly
 * @type {Object}
 * @property {Boolean} webos `true` for webOS
 * @property {Boolean} [tv] `true` for LG webOS SmartTV
 * @property {Boolean} [watch] `true` for LG webOS SmartWatch. Deprecated: will be removed in 5.0.0.
 * @property {Boolean} [open] `true` for Open webOS
 * @property {Boolean} [legacy] `true` for legacy webOS (Palm and HP hardware). Deprecated: will be removed in 5.0.0.
 * @property {Boolean} [unknown] `true` for any unknown system
 * @property {Number}  [version] The version of the platform if detected
 * @property {Number}  [chrome] The version of Chrome if detected
 * @memberof webos/platform
 * @public
 */
const platform = {};

[
	'tv',
	'watch',
	'open',
	'legacy',
	'unknown',
	'version',
	'chrome'
].forEach(name => {
	Object.defineProperty(platform, name, {
		enumerable: true,
		get: () => {
			if (name === 'watch' || name === 'legacy') {
				deprecate({name, until: '5.0.0'});
			}

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
