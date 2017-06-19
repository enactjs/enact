/**
 * Exports the {@link webos/platform.platform} object that contains basic device
 * type information for webOS platforms.  For detection of non-webOS platforms,
 * use the {@link core/platform} module.
 *
 * @module webos/platform
 */

function is (type) {
	return window.navigator.userAgent.indexOf(type) > -1;
}

let _platform;

/**
 * {@link webos/platform.detect} returns the {@link webos/platform.platform} object.
 *
 * @type {Function}
 * @returns {Object} the {@link webos/platform.platform} object
 *
 * @method detect
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
 * {@link webos/platform.platform} provides identification of webOS variants.
 *
 * @readonly
 * @type {object}
 * @property {?boolean} tv - Set true for LG webOS SmartTV
 * @property {?boolean} watch - Set true for LG webOS SmartWatch
 * @property {?boolean} open - Set true for Open webOS
 * @property {?boolean} legacy - Set true for legacy webOS (Palm and HP hardware)
 * @property {?boolean} unknown - Set true for any unknown system
 *
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
export {detect, platform};
