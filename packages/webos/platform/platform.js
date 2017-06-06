/**
 * Exports the {@link webos/platform.platform} object that contains basic device
 * type information for webOS platforms.  For detection of non-webOS platforms,
 * use the {@link core/platform} module.
 *
 * @module webos/platform
 */

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

if (typeof window === 'object' && window.PalmSystem) {
	if (window.navigator.userAgent.indexOf('SmartWatch') > -1) {
		platform.watch = true;
	} else if ((window.navigator.userAgent.indexOf('SmartTV') > -1) || (window.navigator.userAgent.indexOf('Large Screen') > -1)) {
		platform.tv = true;
	} else {
		try {
			let legacyInfo = JSON.parse(window.PalmSystem.deviceInfo || '{}');
			if (legacyInfo.platformVersionMajor && legacyInfo.platformVersionMinor) {
				let major = parseInt(legacyInfo.platformVersionMajor);
				let minor = parseInt(legacyInfo.platformVersionMinor);
				if (major < 3 || (major === 3 && minor <= 0)) {
					platform.legacy = true;
				} else {
					platform.open = true;
				}
			}
		} catch (e) {
			platform.open = true;
		}
		window.Mojo = window.Mojo || {relaunch: function () {}};
		if (window.PalmSystem.stageReady) window.PalmSystem.stageReady();
	}
} else {
	platform.unknown = true;
}

export default platform;
export {platform};
