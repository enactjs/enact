/**
 * Utilities for webOS platform detection.
 *
 * @module webos/platform
 * @exports detect
 * @exports platform
 */

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
	{chrome: 94, version: 23},
	// Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.211 Safari/537.36 WebAppManager
	{chrome: 108, version: 24},
	// Mozilla/5.0 (Web0S; Linux/SmartTV) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.270 Safari/537.36 WebAppManager
	{chrome: 120, version: 25}
];

const platforms = [
	// LG webOS using Chrome (from version 3)
	...webOSVersion.map(({chrome, version}) => ({regex: new RegExp(`Web0S;.*Chrome/${chrome}`), version, chrome})),
	{regex: /Web0S;.*Chrome\/(\d+)/},
	// Fallback
	{regex: /Web0S;/}
];

const parseUserAgent = (userAgent) => {
	// build out our cached platform determination for future usage
	const platformInfo = {webos: false};

	if (userAgent.indexOf('SmartTV') > -1) {
		platformInfo.tv = true;
	} else {
		const webOSSystem = window.webOSSystem ?? window.PalmSystem;
		try {
			let legacyInfo = JSON.parse(webOSSystem.deviceInfo || '{}');
			if (typeof legacyInfo.platformVersionMajor !== 'undefined' && typeof legacyInfo.platformVersionMinor !== 'undefined') {
				platformInfo.open = true;
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
 * @property {Boolean} [open] `true` for Open webOS
 * @property {Boolean} [unknown] `true` for any unknown system
 * @property {Number}  [version] The version of the platform if detected
 * @property {Number}  [chrome] The version of Chrome if detected
 * @memberof webos/platform
 * @public
 */
const platform = {};

[
	'tv',
	'open',
	'unknown',
	'version',
	'chrome'
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
