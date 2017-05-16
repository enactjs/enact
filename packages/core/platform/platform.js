const hasGesture = Boolean(('ongesturestart' in window) || ('onmsgesturestart' in window && (window.navigator.msMaxTouchPoints > 1 || window.navigator.maxTouchPoints > 1)));

const hasTouch = Boolean(('ontouchstart' in window) || window.navigator.msMaxTouchPoints || (window.navigator.msManipulationViewsEnabled && window.navigator.maxTouchPoints));

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

const ua = navigator ? navigator.userAgent : '';

/**
 * Platform identification by user agent
 * @readonly
 * @type {object}
 * @property {?boolean} touch - Set true if the platform has native double-finger [events]{@glossary event}
 * @property {?boolean} gesture - Set true if the platform has native double-finger [events]{@glossary event}
 * @property {?boolean} unknown - Set true for any unknown system
 */

let platform = {
	gesture: hasGesture,
	touch: hasTouch,
	unknown: true
};

for (let i = 0, p, m, v; (p = platforms[i]); i++) {
	m = p.regex.exec(ua);
	if (m) {
		delete platform.unknown;

		if (p.forceVersion) {
			v = p.forceVersion;
		} else {
			v = Number(m[1]);
		}
		platform[p.platform] = v;
		if (p.extra) {
			platform = Object.extend(platform, p.extra);
		}
		platform.platformName = p.platform;
		break;
	}
}

export default platform;
export {platform};
