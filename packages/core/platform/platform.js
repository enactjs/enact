/**
 * Exports the {@link core/platform.detect} method and the {@link core/platform.platform}
 * object to get information about the current platform.  The default export is
 * {@link core/platform.platform}.
 *
 * @module core/platform
 */

const uniq = list => list.reduce((result, v) => {
	if (result.indexOf(v) === -1) result.push(v);
	return result;
}, []);

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
		('ontouchstart' in window) ||
		window.navigator.msMaxTouchPoints ||
		(window.navigator.msManipulationViewsEnabled && window.navigator.maxTouchPoints)
	);
};

const platforms = [
	// Windows Phone 7 - 10
	{platform: 'windowsPhone', regex: /Windows Phone (?:OS )?(\d+)[.\d]+/},
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
	// Edge
	{platform: 'edge', regex: /Edge\/(\d+)/},
	// iOS 3 - 5
	// Apple likes to make this complicated
	{platform: 'ios', regex: /iP(?:hone|ad;(?: U;)? CPU) OS (\d+)/},
	// webOS 1 - 3
	{platform: 'webos', regex: /(?:web|hpw)OS\/(\d+)/},
	// webOS 4 / OpenWebOS
	{platform: 'webos', regex: /WebAppManager|Isis|webOS\./, forceVersion: 4},
	// Open webOS release LuneOS
	{platform: 'webos', regex: /LuneOS/, forceVersion: 4, extra: {luneos: 1}},
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

/**
 * {@link core/platform.detect} returns the {@link core/platform.platform} object.
 *
 * @type {Function}
 * @returns {Object} the {@link core/platform.platform} object
 *
 * @method detect
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

	_platform = {
		gesture: hasGesture(),
		node: false,
		touch: hasTouch(),
		unknown: true
	};

	for (let i = 0, p, m, v; (p = platforms[i]); i++) {
		m = p.regex.exec(userAgent);
		if (m) {
			_platform.unknown = false;

			if (p.forceVersion) {
				v = p.forceVersion;
			} else {
				v = Number(m[1]);
			}
			_platform[p.platform] = v;
			if (p.extra) {
				_platform = {
					..._platform,
					...p.extra
				};
			}
			_platform.platformName = p.platform;
			break;
		}
	}

	return _platform;
};

/**
 * {@link core/platform.platform} provides basic information about the running platform.
 *
 * @readonly
 * @type {Object}
 * @property {Boolean} gesture - Set `true` if the platform has native double-finger events
 * @property {Boolean} node - Set `true` only if `window` is `undefined`
 * @property {String} platformName - Set to the name of the platform
 * @property {Boolean} touch - Set `true` if the platform has native single-finger events
 * @property {Boolean} unknown - Set `true` for any unknown system
 *
 * @memberof core/platform
 * @public
 */

const platform = {};
[
	'gesture',
	'node',
	'platformName',
	'touch',
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
export {detect, platform};
