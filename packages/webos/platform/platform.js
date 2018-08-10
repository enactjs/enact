/**
 * Utilities for webOS platform detection.
 *
 * @module webos/platform
 * @exports detect
 * @exports platform
 */

function is (type) {
	return window.navigator.userAgent.indexOf(type) > -1;
}

let _platform;

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
	} else if (typeof window === 'undefined' || !window.PalmSystem) {
		// if window isn't available (in prerendering or snapshot runs), bail out early
		return {
			unknown: true
		};
	}

	// build out our cached platform determination for future usage
	_platform = {};

	if (is('SmartWatch')) {
		_platform.watch = true;
	} else if (is('SmartTV') || is('Large Screen')) {
		_platform.tv = true;
	} else {
		try {
			let legacyInfo = JSON.parse(window.PalmSystem.deviceInfo || '{}');
			if (legacyInfo.platformVersionMajor && legacyInfo.platformVersionMinor) {
				let major = parseInt(legacyInfo.platformVersionMajor);
				let minor = parseInt(legacyInfo.platformVersionMinor);
				if (major < 3 || (major === 3 && minor <= 0)) {
					_platform.legacy = true;
				} else {
					_platform.open = true;
				}
			} else {
				_platform.unknown = true;
			}
		} catch (e) {
			_platform.open = true;
		}

		// TODO: clean these up. They shouldn't be here
		window.Mojo = window.Mojo || {relaunch: function () {}};
		if (window.PalmSystem.stageReady) window.PalmSystem.stageReady();
	}

	return _platform;
}


/**
 * Provides identification of webOS variants.
 *
 * @readonly
 * @type {Object}
 * @property {Boolean} tv `true` for LG webOS SmartTV
 * @property {Boolean} watch `true` for LG webOS SmartWatch
 * @property {Boolean} open `true` for Open webOS
 * @property {Boolean} legacy `true` for legacy webOS (Palm and HP hardware)
 * @property {Boolean} unknown `true` for any unknown system
 * @memberof webos/platform
 * @public
 */
const platform = {};

[
	'tv',
	'watch',
	'open',
	'legacy',
	'unknown'
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
	platform
};
