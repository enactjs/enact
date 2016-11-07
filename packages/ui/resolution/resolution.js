/**
 * Exports a number of useful methods for resolution independence
 *
 * @module ui/resolution
 */

let baseScreen,
	orientation,
	riRatio,
	screenType,
	screenTypes = [{
		name: 'standard',
		pxPerRem: 16,
		width: (typeof window === 'object') ? window.innerWidth : 1920,
		height: (typeof window === 'object') ? window.innerHeight : 1080,
		aspectRatioName: 'standard',
		base: true
	}],	// Assign one sane type in case defineScreenTypes is never run.
	screenTypeObject,
	config;

/**
 * Object that stores all of the pixel conversion factors to each keyed unit.
 *
 * @memberof ui/resolution
 * @public
 */
const unitToPixelFactors = {
		'rem': 12,
		'in': 96
	},
	configDefaults = {
		orientationHandling: 'normal'
	};

/**
 * Fetch the screenType object
 *
 * @memberof ui/resolution
 * @param  {String} type The key string for the screen type object.
 *
 * @returns {Object}     screenTypeObject
 * @private
 */
function getScreenTypeObject (type) {
	type = type || screenType;
	if (screenTypeObject && screenTypeObject.name === type) {
		return screenTypeObject;
	}
	return screenTypes.filter(function (elem) {
		return (type === elem.name);
	})[0];
}

/**
 * Sets up screen resolution scaling capabilities by defining an array of all the screens
 * being used. These should be listed in order from smallest to largest, according to
 * width.
 *
 * The `name`, `pxPerRem`, `width`, and `aspectRatioName` properties are required for
 * each screen type in the array. Setting `base: true` on a screen type marks it as the
 * default resolution, upon which everything else will be based.
 *
 * Executing this method also initializes the rest of the resolution-independence code.
 *
 * ```
 * var resolution = require('enyo/resolution');
 *
 * resolution.defineScreenTypes([
 * 	{name: 'vga',     pxPerRem: 8,  width: 640,  height: 480,  aspectRatioName: 'standard'},
 * 	{name: 'xga',     pxPerRem: 16, width: 1024, height: 768,  aspectRatioName: 'standard'},
 * 	{name: 'hd',      pxPerRem: 16, width: 1280, height: 720,  aspectRatioName: 'hdtv'},
 * 	{name: 'fhd',     pxPerRem: 24, width: 1920, height: 1080, aspectRatioName: 'hdtv', base: true},
 * 	{name: 'uw-uxga', pxPerRem: 24, width: 2560, height: 1080, aspectRatioName: 'cinema'},
 * 	{name: 'uhd',     pxPerRem: 48, width: 3840, height: 2160, aspectRatioName: 'hdtv'}
 * ]);
 * ```
 *
 * @memberof ui/resolution
 * @param {Array} types - An array of objects containing screen configuration data, as in the
 * preceding example.
 * @returns {undefined}
 * @public
 */
function defineScreenTypes (types) {
	screenTypes = types;
	for (let i = 0; i < screenTypes.length; i++) {
		if (screenTypes[i]['base']) baseScreen = screenTypes[i];
	}
	init();
}

/**
 * Fetches the name of the screen type that best matches the current screen size. The best
 * match is defined as the screen type that is the closest to the screen resolution without
 * going over. ("The Price is Right" style.)
 *
 * @memberof ui/resolution
 * @param {Object} [rez] - Optional measurement scheme. Must include `height` and `width` properties.
 * @returns {String} Screen type (e.g., `'fhd'`, `'uhd'`, etc.)
 * @public
 */
function getScreenType (rez) {
	rez = rez || {
		height: (typeof window === 'object') ? window.innerHeight : 1080,
		width: (typeof window === 'object') ? window.innerWidth : 1920
	};

	const types = screenTypes;
	let bestMatch = types[types.length - 1].name;

	orientation = 'landscape';

	if (rez.height > rez.width) {
		orientation = 'portrait';
		const swap = rez.width;
		rez.width = rez.height;
		rez.height = swap;
	}

	// loop thorugh resolutions
	for (let i = types.length - 1; i >= 0; i--) {
		// find the one that matches our current size or is smaller. default to the first.
		if (rez.width <= types[i].width) {
			bestMatch = types[i].name;
		}
	}
	// return the name of the resolution if we find one.
	return bestMatch;
}

/**
 * Calculate the base rem font size. This is how the magic happens. This accepts an
 * optional screenType name. If one isn't provided, the currently detected screen type is used.
 * This uses the config option "orientationHandling", which when set to "scale" and the screen is
 * in portrait orientation, will dynamically calculate what the base font size should be, if the
 * width were proportionally scaled down to fit in the portrait space.
 *
 * To use, put the following in your application code:
 * ```
 * 	var RI = require('moonstone/resolution');
 *
 * 	RI.config.orientationHandling = 'scale';
 * 	RI.init();
 * ```
 *
 * This has no effect if the screen is in landscape, or if orientationHandling is unset.
 *
 * @memberof ui/resolution
 * @param {String} type - Screen type to base size the calculation on. If no
 *     screen type is provided, the current screen type will be used.
 * @returns {String} The calculated pixel size (with unit suffix. Ex: "24px").
 * @public
 */
function calculateFontSize (type) {
	const scrObj = getScreenTypeObject(type);
	let size;

	if (orientation === 'portrait' && config.orientationHandling === 'scale') {
		size = scrObj.height / scrObj.width * scrObj.pxPerRem;
	} else {
		size = scrObj.pxPerRem;
	}
	return size + 'px';
}

/**
 * @memberof ui/resolution
 * @param {String} size A valid CSS measurement to be applied as the base document font size.
 * @private
 * @returns {null} n/a
 */
function updateBaseFontSize (size) {
	if (typeof window === 'object') {
		document.documentElement.style.fontSize = size;
	}
}

/**
 * Returns the CSS classes for the given `type`
 *
 * @memberof ui/resolution
 * @param {String} type Screen type
 * @returns {String} classes CSS class names
 * @public
 */
function getResolutionClasses (type = screenType) {
	const classes = [];
	if (orientation) {
		classes.push('enact-orientation-' + orientation);
	}
	if (type) {
		classes.push('enact-res-' + type.toLowerCase());
		const scrObj = getScreenTypeObject(type);
		if (scrObj.aspectRatioName) {
			classes.push('enact-aspect-ratio-' + scrObj.aspectRatioName.toLowerCase());
		}
	}
	return classes.join(' ');
}

/**
 * Returns the ratio of pixels per rem for the given `type` to the pixels per rem for the base type
 *
 * @memberof ui/resolution
 * @param  {String} [type] Screen type
 *
 * @returns {Number}      ratio
 */
function getRiRatio (type = screenType) {
	if (type && baseScreen) {
		const ratio = getUnitToPixelFactors(type) / getUnitToPixelFactors(baseScreen.name);
		if (type === screenType) {
			// cache this if it's for our current screen type.
			riRatio = ratio;
		}
		return ratio;
	}
	return 1;
}

/**
 * Returns the pixels per rem for the given `type`
 *
 * @memberof ui/resolution
 * @param  {String} [type] Screen type
 *
 * @returns {Number}      pixels per rem
 */
function getUnitToPixelFactors (type = screenType) {
	if (type) {
		return getScreenTypeObject(type).pxPerRem;
	}
	return 1;
}

/**
 * Calculates the aspect ratio of the specified screen type. If no screen type is provided,
 * the current screen type is used.
 *
 * @param {String} type - Screen type whose aspect ratio will be calculated. If no screen
 * type is provided, the current screen type is used.
 * @returns {Number} The calculated screen ratio (e.g., `1.333`, `1.777`, `2.333`, etc.)
 * @public
 */
function getAspectRatio (type) {
	const scrObj = getScreenTypeObject(type);
	if (scrObj.width && scrObj.height) {
		return (scrObj.width / scrObj.height);
	}
	return 1;
}

/**
 * Returns the name of the aspect ratio for a specified screen type, or for the default
 * screen type if none is provided.
 *
 * @memberof ui/resolution
 * @param {String} type - Screen type whose aspect ratio name will be returned. If no
 * screen type is provided, the current screen type will be used.
 * @returns {String} The name of the screen type's aspect ratio
 * @public
 */
function getAspectRatioName (type) {
	const scrObj = getScreenTypeObject(type);
	return scrObj.aspectRatioName || 'standard';
}

/**
 * Takes a provided pixel value and performs a scaling operation based on the current
 * screen type.
 *
 * @memberof ui/resolution
 * @param {Number} px - The quantity of standard-resolution pixels to scale to the
 * current screen resolution.
 * @returns {Number} The scaled value based on the current screen scaling factor
 * @public
 */
function scale (px) {
	return (riRatio || getRiRatio()) * px;
}

/**
 * Convert to various unit formats. Useful for converting pixels to a resolution-independent
 * measurement method, like "rem". Other units are available if defined in the
 * {@link ui/resolution.unitToPixelFactors} object.
 *
 * ```javascript
 * var
 * 	dom = require('enyo/dom');
 *
 * // Do calculations and get back the desired CSS unit.
 * var frameWidth = 250,
 *     frameWithMarginInches = dom.unit( 10 + frameWidth + 10, 'in' ),
 *     frameWithMarginRems = dom.unit( 10 + frameWidth + 10, 'rem' );
 * // '2.8125in' == frameWithMarginInches
 * // '22.5rem' == frameWithMarginRems
 * ```
 *
 * @memberof ui/resolution
 * @param {(String|Number)} pixels - The the pixels or math to convert to the unit.
 *	("px" suffix in String format is permitted. ex: `'20px'`)
 * @param {(String)} toUnit - The name of the unit to convert to.
 * @returns {(Number|undefined)} Resulting conversion, in case of malformed input, `undefined`
 * @public
 */
function unit (pixels, toUnit) {
	if (!toUnit || !unitToPixelFactors[toUnit]) return;
	if (typeof pixels === 'string' && pixels.substr(-2) === 'px') pixels = parseInt(pixels.substr(0, pixels.length - 2), 10);
	if (typeof pixels !== 'number') return;

	return (pixels / unitToPixelFactors[toUnit]) + '' + toUnit;
}

/**
 * The default configurable [options]{@link ui/resolution.selectSrc#options}.
 *
 * @typedef {Object} ui/resolution.selectSrc
 * @property {String} hd - HD / 720p Resolution image asset source URI/URL
 * @property {String} fhd - FHD / 1080p Resolution image asset source URI/URL
 * @property {String} uhd - UHD / 4K Resolution image asset source URI/URL
 */

/**
 * Selects the ideal image asset from a set of assets, based on various screen
 * resolutions: HD (720p), FHD (1080p), UHD (4k). When a `src` argument is
 * provided, `selectSrc()` will choose the best image with respect to the current
 * screen resolution. `src` may be either the traditional string, which will pass
 * straight through, or a hash/object of screen types and their asset sources
 * (keys:screen and values:src). The image sources will be used when the screen
 * resolution is less than or equal to the provided screen types.
 *
 * ```
 * // Take advantage of the multi-res mode
 * var
 * 	kind = require('enyo/kind'),
 * 	Image = require('enyo/Image');
 *
 * {kind: Image, src: {
 * 	'hd': 'http://lorempixel.com/64/64/city/1/',
 * 	'fhd': 'http://lorempixel.com/128/128/city/1/',
 * 	'uhd': 'http://lorempixel.com/256/256/city/1/'
 * }, alt: 'Multi-res'},
 *
 * // Standard string `src`
 * {kind: Image, src: http://lorempixel.com/128/128/city/1/', alt: 'Large'},
 * ```
 *
 * @memberof ui/resolution
 * @param {(String|ui/resolution.selectSrcSrc)} src - A string containing
 * a single image source or a key/value hash/object containing keys representing screen
 * types (`'hd'`, `'fhd'`, `'uhd'`, etc.) and values containing the asset source for
 * that target screen resolution.
 * @returns {String} The chosen source, given the string or hash provided
 * @public
 */
function selectSrc (src) {
	if (typeof src != 'string' && src) {
		let newSrc = src.fhd || src.uhd || src.hd;
		const types = screenTypes;

		// loop through resolutions
		for (let i = types.length - 1; i >= 0; i--) {
			let t = types[i].name;
			if (screenType === t && src[t]) newSrc = src[t];
		}
		src = newSrc;
	}
	return src;
}

/**
 * This will need to be re-run any time the screen size changes, so all the values can be
 * re-cached.
 *
 * @memberof ui/resolution
 * @returns {undefined} [description]
 * @public
 */
function init () {
	screenType = getScreenType();
	screenTypeObject = getScreenTypeObject();
	unitToPixelFactors.rem = getUnitToPixelFactors();
	riRatio = getRiRatio();
	updateBaseFontSize(calculateFontSize());
}

/**
 * The current configuration
 *
 * @memberof ui/resolution
 */
config = Object.assign({}, configDefaults);

export {
	calculateFontSize,
	config,
	defineScreenTypes,
	getAspectRatio,
	getAspectRatioName,
	getResolutionClasses,
	getScreenTypeObject,
	getScreenType,
	init,
	scale,
	selectSrc,
	unit,
	unitToPixelFactors
};
