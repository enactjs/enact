let baseScreen,
	orientation,
	riRatio,
	screenType,
	workspaceBounds = {
		width: (typeof window === 'object') ? window.innerWidth : 1920,
		height: (typeof window === 'object') ? window.innerHeight : 1080
	},
	screenTypes = [{
		name: 'standard',
		pxPerRem: 16,
		width: workspaceBounds.width,
		height: workspaceBounds.height,
		aspectRatioName: 'standard',
		base: true
	}],	// Assign one sane type in case defineScreenTypes is never run.
	screenTypeObject,
	config;

/**
 * Object that stores the pixel conversion factors to each keyed unit.
 *
 * @type {Object}
 * @memberof ui/resolution
 * @public
 */
const unitToPixelFactors = {
	'rem': 12,
	'in': 96
};

/**
 * Enumerates the available reporting types for linear scaling.
 *
 * @enum {String}
 * @memberof ui/resolution
 * @public
 */
const linearScalingType = {
	baseScreen: 'baseScreen',
	currentScreen: 'currentScreen'
};

/**
 * Default configuration values.
 *
 * See {@link ui/resolution.config} for full documentation.
 *
 * @type {Object}
 * @memberof ui/resolution
 * @private
 */
const configDefaults = {
	fontSizeHandling: 'scale',
	orientationHandling: 'normal',
	linearScaling: {
		active: false,
		type: linearScalingType.currentScreen
	}
};

/**
 * Calculates a linearly scaled size for 1rem based on the current workspace dimensions.
 *
 * The calculation determines a scaling factor using the geometric mean of horizontal
 * and vertical scale factors relative to a reference screen (either the `baseScreen`
 * or the currently matched `screenTypeObject`).
 *
 * The resulting size is rounded to one decimal place and constrained to a minimum
 * of 1px and a maximum of the `pxPerRem` value defined for the largest screen type
 * (the last element in `screenTypes`).
 *
 * @function
 * @memberof ui/resolution
 * @returns {Number} The calculated pixel size for 1rem, clamped between 1 and the
 *                   maximum defined pxPerRem.
 * @private
 */
function getLinearSize () {
	const isCurrentScreen = config.linearScaling.type === linearScalingType.currentScreen;
	const reportScreen = isCurrentScreen ? screenTypeObject : baseScreen;
	const maxSize = screenTypes.at(-1).pxPerRem;

	const scaleX = workspaceBounds.width / reportScreen.width;
	const scaleY = workspaceBounds.height / reportScreen.height;

	const ratio = Math.sqrt(scaleX * scaleY);
	const size = Math.round(reportScreen.pxPerRem * ratio * 10) / 10;

	return Math.max(1, Math.min(size, maxSize));
}

/**
 * Determines if the current workspace should be scaled based on the screen type,
 * orientation, and configuration settings.
 *
 * @function
 * @memberof ui/resolution
 * @param {Object} scrObj 			The screen type object to compare against.
 *
 * @returns {boolean}
 * @private
 */
const getShouldScale = (scrObj = screenTypeObject) => {
	if (!scrObj) return false;

	const isPortrait = orientation === 'portrait';
	const isLandscape = orientation === 'landscape';
	const shouldScale = workspaceBounds.width < scrObj.width && workspaceBounds.height < scrObj.height;

	const shouldScaleLandscape = (config.fontSizeHandling === 'scale') && isLandscape && shouldScale;
	const shouldScalePortrait = (config.orientationHandling === 'scale') && isPortrait && shouldScale;

	return shouldScaleLandscape || shouldScalePortrait;
};

/**
 * Calculates the scale factor and determines if scaling is necessary
 * for the landscape or portrait workspace based on the screen type.
 *
 * @function
 * @memberof ui/resolution
 * @param {String} [type=screenType] 	The screen type identifier used to retrieve dimensions. Defaults to the global
 * 										or scoped `screenType`.
 * @returns {Object} 					Returns an object containing the scaling data.
 * @private
 */
const getScaleFactor = (type = screenType) => {
	if (!type) return {shouldScale: false, factor: 1};

	const scrObj = getScreenTypeObject(type);
	const shouldScale = getShouldScale(scrObj);

	return {shouldScale, factor: workspaceBounds.height / scrObj.height};
};

/**
 * Gets the closest resolution type based on the provided resolution by calculating a distance score.
 *
 * The score is determined by the Euclidean distance between the widths and heights of the
 * resolutions, plus a weighted penalty for the difference in aspect ratios. This ensures that
 * the matched resolution is not only close in size but also has a similar shape.
 *
 * @function
 * @memberOf ui/resolution
 * @param {Object} resolution  The resolution object (must include `height` and `width` properties).
 * @param {Object[]} types     The resolution types object (must include `name`, `width`, `height`, and `aspectRatioName` properties).
 * @returns {String}           Screen type (e.g., `'fhd'`, `'uhd'`, etc.).
 * @private
 */
const getClosestResolutionType = (resolution, types) => {
	// Calculates a score for a candidate resolution based on proximity to the target. A lower score indicates a better match.
	const getDistanceScore = (p) => {
		const distance = Math.sqrt(Math.pow(p.width - resolution.width, 2) + Math.pow(p.height - resolution.height, 2));
		const inputRatio = resolution.width / resolution.height;
		const candidateRatio = getAspectRatio(p.name);
		// Apply a weighted penalty (x1000) for aspect ratio mismatch.
		// This ensures that even if a resolution is close in size, it won't be chosen
		// if its shape (e.g., UltraWide vs. Standard) is significantly different.
		const ratioPenalty = Math.abs(inputRatio - candidateRatio) * 1000;

		return distance + ratioPenalty;
	};

	// Compares the calculated distance scores and returns the closest resolution type name that matches the current resolution.
	const {name} = types.reduce((prev, curr) => {
		const currScore = getDistanceScore(curr);
		const prevScore = getDistanceScore(prev);

		return currScore < prevScore ? curr : prev;
	});

	return name;
};

/**
 * Update the common measured boundary object.
 *
 * This object is used as "what size screen are we looking at". Providing no arguments has no
 * effect and updates nothing.
 *
 * @function
 * @memberOf ui/resolution
 * @param {Node}    measurementNode    A standard DOM node or the `window` node.
 *
 * @returns {undefined}
 * @private
 */
const updateWorkspaceBounds = (measurementNode) => {
	if (measurementNode) {
		if (measurementNode.clientHeight || measurementNode.clientWidth) {
			workspaceBounds = {height: measurementNode.clientHeight, width: measurementNode.clientWidth};
		} else if (measurementNode.innerHeight || measurementNode.innerWidth) {
			// A backup for if measurementNode is actually `window` and not a normal node
			workspaceBounds = {height: measurementNode.innerHeight, width: measurementNode.innerWidth};
		}
	}
};

/**
 * Fetch the screenType object
 *
 * @function
 * @memberof ui/resolution
 * @param  {String}    type    The key string for the screen type object. If falsy, the current
 *                             screenType is used
 *
 * @returns {Object}           screenTypeObject
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
 * being used.
 *
 * These should be listed in order from smallest to largest, according to
 * width.
 *
 * The `name`, `pxPerRem`, `width`, and `aspectRatioName` properties are required for
 * each screen type in the array. Setting `base: true` on a screen type marks it as the
 * default resolution, upon which everything else will be based.
 *
 * Executing this method also initializes the rest of the resolution-independence code.
 *
 * Example:
 * ```
 * import ri from 'enact/ui/resolution';
 *
 * ri.defineScreenTypes([
 * 	{name: 'vga',     pxPerRem: 8,  width: 640,  height: 480,  aspectRatioName: 'standard'},
 * 	{name: 'xga',     pxPerRem: 16, width: 1024, height: 768,  aspectRatioName: 'standard'},
 * 	{name: 'hd',      pxPerRem: 16, width: 1280, height: 720,  aspectRatioName: 'hdtv'},
 * 	{name: 'uw-hd',   pxPerRem: 16, width: 1920, height: 804,  aspectRatioName: 'cinema'},
 * 	{name: 'fhd',     pxPerRem: 24, width: 1920, height: 1080, aspectRatioName: 'hdtv', base: true},
 * 	{name: 'uw-uxga', pxPerRem: 24, width: 2560, height: 1080, aspectRatioName: 'cinema'},
 * 	{name: 'qhd',     pxPerRem: 32, width: 2560, height: 1440, aspectRatioName: 'hdtv'},
 * 	{name: 'wqhd',    pxPerRem: 32, width: 3440, height: 1440, aspectRatioName: 'cinema'},
 * 	{name: 'uhd',     pxPerRem: 48, width: 3840, height: 2160, aspectRatioName: 'hdtv'},
 * 	{name: 'uhd2',    pxPerRem: 96, width: 7680, height: 4320, aspectRatioName: 'hdtv'}
 * ]);
 * ```
 *
 * @function
 * @memberof ui/resolution
 * @param {Object[]}    types    An array of objects containing screen configuration data, as in the
 *                            preceding example.
 * @returns {undefined}
 * @public
 */
function defineScreenTypes (types) {
	if (types) screenTypes = types;
	for (let i = 0; i < screenTypes.length; i++) {
		if (screenTypes[i]['base']) baseScreen = screenTypes[i];
	}
	init();
}

/**
 * Fetches the name of the screen type that best matches the current screen size.
 *
 * The best match is defined as the screen type that is the closest to the screen resolution without
 * going over. ("The Price is Right" style.)
 *
 * @function
 * @memberof ui/resolution
 * @param {Object}    rez    Optional measurement scheme. Must include `height` and `width` properties.
 * @returns {String}         Screen type (e.g., `'fhd'`, `'uhd'`, etc.)
 * @public
 */
function getScreenType (rez) {
	rez = rez || workspaceBounds;

	const types = screenTypes;

	orientation = 'landscape';

	if (rez.height > rez.width) {
		orientation = 'portrait';
		const swap = rez.width;
		rez.width = rez.height;
		rez.height = swap;
	}

	// Loop through resolutions, last->first, largest->smallest and return in case of exact match.
	for (let i = types.length - 1; i >= 0; i--) {
		if (rez.height === types[i].height && rez.width === types[i].width) {
			return types[i].name;
		}
	}

	// Return the name of the closest fitting set of dimensions.
	return getClosestResolutionType(rez, types);
}

/**
 * Calculate the base rem font size.
 *
 * This is how the magic happens. This accepts an optional `screenType` name. If one isn't provided,
 * the currently detected screen type is used. When the workspace is smaller than the matched screen
 * type in both dimensions, the base font size is scaled proportionally based on the workspace height.
 * This scaling is gated by the config options `fontSizeHandling` (landscape orientation) and
 * `orientationHandling` (portrait orientation, such as after screen rotation); when the relevant
 * option is set to `'scale'` the size is calculated dynamically, otherwise the screen type's
 * `pxPerRem` value is used directly.
 *
 * To use, put the following in your application code:
 * ```
 * import ri from '@enact/ui/resolution';
 *
 * ri.config.orientationHandling = 'scale';
 * ri.init();
 * ```
 *
 * This configuration is particularly useful for applications that support screen rotation and need
 * to maintain consistent scaling when the device orientation changes from landscape to portrait or vice versa.
 *
 * @function
 * @memberof ui/resolution
 * @param {String}    type    Screen type to base size the calculation on. If no
 *                            screen type is provided, the current screen type will be used.
 * @returns {String}          The calculated pixel size (with unit suffix. Ex: "24px").
 * @public
 */
function calculateFontSize (type) {
	// If linear scaling is enabled, bypass standard screen-type-based calculation and use the dynamic linear size
	if (config.linearScaling.active && !type) {
		return getLinearSize() + 'px';
	}

	const scrObj = getScreenTypeObject(type);
	const shouldScaleFontSize = getShouldScale(scrObj);
	let size;

	if (shouldScaleFontSize) {
		size = workspaceBounds.height * scrObj.pxPerRem / scrObj.height;
	} else {
		size = scrObj.pxPerRem;
	}

	return size + 'px';
}

/**
 * @function
 * @memberof ui/resolution
 * @param {String}    size     A valid CSS measurement to be applied as the base document font size.
 * @returns {undefined}
 * @private
 */
function updateBaseFontSize (size) {
	if (typeof window === 'object') {
		document.documentElement.style.fontSize = size;
	}
}

/**
 * Returns the CSS classes for the given `type`.
 *
 * This function generates CSS class names that can be used to style components based on
 * the current screen resolution, orientation, and aspect ratio. The returned classes are
 * particularly useful for responsive layouts and handling screen rotation scenarios.
 *
 * The following CSS classes are returned:
 * - **Orientation class**: `enact-orientation-landscape` or `enact-orientation-portrait`
 *   - Applied based on the current screen orientation
 *   - Updates automatically when device rotation occurs (if dynamic mode is enabled)
 * - **Resolution class**: `enact-res-{screentype}`
 *   - Examples: `enact-res-fhd`, `enact-res-uhd`, `enact-res-hd`, `enact-res-qhd`
 *   - Applied based on the matched screen type
 * - **Aspect ratio class**: `enact-aspect-ratio-{aspectRatioName}`
 *   - Examples: `enact-aspect-ratio-hdtv`, `enact-aspect-ratio-cinema`, `enact-aspect-ratio-standard`
 *   - Applied based on the screen type's aspect ratio name
 *
 * Example return value: `'enact-orientation-landscape enact-res-fhd enact-aspect-ratio-hdtv'`
 *
 * @function
 * @memberof ui/resolution
 * @param {String}    type    Screen type
 * @returns {String}          CSS class names
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
 * Returns the ratio of pixels per rem for the given `type` to the pixels per rem for the base type.
 *
 * @function
 * @memberof ui/resolution
 * @param  {String}    type    Screen type
 *
 * @returns {Number}           ratio
 */
function getRiRatio (type = screenType) {
	if (type && baseScreen) {
		let ratio = getUnitToPixelFactors(type) / getUnitToPixelFactors(baseScreen.name);
		const {shouldScale, factor} = getScaleFactor(type);

		if (shouldScale) {
			ratio *= factor;
		}

		if (type === screenType) {
			// cache this if it's for our current screen type.
			riRatio = ratio;
		}
		return ratio;
	}
	return 1;
}

/**
 * Returns the pixels per rem for the given `type`.
 *
 * @memberof ui/resolution
 * @param {String}    type    Screen type
 *
 * @returns {Number}          pixels per rem
 */
function getUnitToPixelFactors (type = screenType) {
	// Use linear scaling for the current screen type if active.
	if (config.linearScaling.active && (!type || type === screenType)) {
		return getLinearSize();
	}

	if (type) {
		return getScreenTypeObject(type).pxPerRem;
	}
	return 1;
}

/**
 * Calculates the aspect ratio of the specified screen type.
 *
 * If no screen type is provided, the current screen type is used.
 *
 * @function
 * @memberof ui/resolution
 * @param {String}    type    Screen type whose aspect ratio will be calculated. If no screen
 *                            type is provided, the current screen type is used.
 * @returns {Number}          The calculated screen ratio (e.g., `1.333`, `1.777`, `2.333`, etc.)
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
 * @function
 * @memberof ui/resolution
 * @param {String}    type    Screen type whose aspect ratio name will be returned. If no
 *                            screen type is provided, the current screen type will be used.
 * @returns {String}          The name of the screen type's aspect ratio
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
 * @function
 * @memberof ui/resolution
 * @param {Number}    px    The quantity of standard-resolution pixels to scale to the
 *                          current screen resolution.
 * @returns {Number}        The scaled value based on the current screen scaling factor
 * @public
 */
function scale (px) {
	return (riRatio || getRiRatio()) * px;
}

/**
 * Convert to various unit formats.
 *
 * Useful for converting pixels to a resolution-independent
 * measurement method, like "rem". Other units are available if defined in the
 * {@link ui/resolution.unitToPixelFactors} object.
 *
 * Example:
 * ```
 * import ri from '@enact/ui/resolution';
 *
 * // Do calculations and get back the desired CSS unit.
 * var frameWidth = 250,
 *     frameWithMarginInches = ri.unit( 10 + frameWidth + 10, 'in' ), // '2.8125in' == frameWithMarginInches
 *     frameWithMarginRems = ri.unit( 10 + frameWidth + 10, 'rem' ); // '22.5rem' == frameWithMarginRems
 * ```
 *
 * @function
 * @memberof ui/resolution
 * @param {String|Number}     pixels    The pixels or math to convert to the unit ("px" suffix in String
 *                                       format is permitted. ex: `'20px'`)
 * @param {String}            toUnit    The name of the unit to convert to.
 *
 * @returns {String|undefined}          Resulting conversion in CSS safe format, in case of malformed input, `undefined`
 * @public
 */
function unit (pixels, toUnit) {
	if (!toUnit || !unitToPixelFactors[toUnit]) return;
	if (typeof pixels === 'string' && pixels.substring(-2) === 'px') pixels = parseInt(pixels.substring(0, pixels.length - 2));
	if (typeof pixels !== 'number') return;

	const {shouldScale, factor} = getScaleFactor();

	if (shouldScale) {
		return (pixels / factor / unitToPixelFactors[toUnit]) + '' + toUnit;
	}

	return (pixels / unitToPixelFactors[toUnit]) + '' + toUnit;
}

/**
 * Shorthand for when you know you need to scale some pixel value and have it converted to "rem" for
 * proper scaling.
 *
 * This runs {@link ui/resolution.scale} and {@link ui/resolution.unit} together.
 *
 * @function
 * @memberof ui/resolution
 * @param {Number}    pixels    The quantity of standard-resolution pixels to scale to rems
 *
 * @returns {String|undefined}  Resulting conversion or, in case of malformed input, `undefined`
 * @public
 */
const scaleToRem = (pixels) => unit(scale(pixels), 'rem');

/**
 * The default configurable options for {@link ui/resolution.selectSrc}. Additional resolutions
 * may be added.
 *
 * @typedef {Object} selectSrcOptions
 * @memberof ui/resolution
 * @property {String}    [hd]    HD / 720p Resolution image asset source URI/URL
 * @property {String}    [fhd]   FHD / 1080p Resolution image asset source URI/URL
 * @property {String}    [uhd]   UHD / 4K Resolution image asset source URI/URL
 */

/**
 * Selects the ideal image asset from a set of assets, based on various screen
 * resolutions: HD (720p), FHD (1080p), UHD (4k).
 *
 * When a `src` argument is provided, `selectSrc()` will choose the best image with
 * respect to the current screen resolution. `src` may be either the traditional
 * string, which will pass straight through, or a hash/object of screen types and
 * their asset sources (keys:screen and values:src). The image sources will be used
 * when the screen resolution is less than or equal to the provided screen types.
 *
 * Example:
 * ```
 * // Take advantage of the multi-res mode
 * import {Image} from '@enact/ui/Image';
 *
 * const src = {
 *     'hd': 'http://lorempixel.com/64/64/city/1/',
 *     'fhd': 'http://lorempixel.com/128/128/city/1/',
 *     'uhd': 'http://lorempixel.com/256/256/city/1/'
 * };
 * ...
 * <Image src={src} ... />
 * ...
 * ```
 *
 * @function
 * @memberof ui/resolution
 * @param {String|ui/resolution.selectSrcSrcOptions} src       A string containing a single image
 *                                                             source or a key/value hash/object
 *                                                             containing keys representing screen
 *                                                             types (`'hd'`, `'fhd'`, `'uhd'`,
 *                                                             etc.) and values containing the asset
 *                                                             source for that target screen
 *                                                             resolution.
 *
 * @returns {String}                                           The chosen source, given the string
 *                                                             or hash provided
 * @public
 */
function selectSrc (src) {
	if (typeof src != 'string' && src) {
		let newSrc = src.fhd || src.uhd || src.hd;
		const types = screenTypes;

		// loop through resolutions
		for (let i = types.length - 1; i >= 0; i--) {
			let t = types[i].name;

			// return exact match
			if (screenType === t && src[t]) return src[t];
		}

		const srcResolutions = types.filter((type) => type.name in src);
		const currentScreenTypeResolution = getScreenTypeObject();

		if (srcResolutions.length && currentScreenTypeResolution) {
			const closestType = getClosestResolutionType(currentScreenTypeResolution, srcResolutions);
			newSrc = src[closestType];
		}

		src = newSrc;
	}
	return src;
}

/**
 * This will need to be re-run any time the screen size changes, so all the values can be re-cached.
 *
 * @function
 * @memberof ui/resolution
 * @param {Object}    args    A hash of options. The key `measurementNode` is used to as the node,
 *                            typically the root element, to measure and use as the dimensions for
 *                            the `screenType`.
 *
 * @returns {undefined}
 * @public
 */
function init (args = {}) {
	const {measurementNode} = args;
	updateWorkspaceBounds(measurementNode);
	screenType = getScreenType();
	screenTypeObject = getScreenTypeObject();
	unitToPixelFactors.rem = getUnitToPixelFactors();
	riRatio = getRiRatio();
	updateBaseFontSize(calculateFontSize());
}

/**
 * @typedef {Object} LinearScalingConfig
 * @memberof ui/resolution
 * @property {Boolean} active - Enables linear scaling calculation for
 *           font sizes and unit conversions. Default: `true`.
 * @property {ui/resolution.linearScalingType} type - Determines the
 *           reference screen used for linear scaling calculation.
 *           Default: `linearScalingType.currentScreen`.
 */

/**
 * Configuration options for resolution independence behavior.
 *
 * @typedef {Object} ResolutionConfig
 * @memberof ui/resolution
 * @property {('normal'|'scale')} fontSizeHandling - Determines how to calculate
 *           font-size. When set to `'scale'` and the screen is in landscape orientation,
 *           calculates font-size linearly based on screen resolution. When set to `'normal'`,
 *           the font-size will be the pxPerRem value of the best match screen type.
 *           Default: `'scale'`
 * @property {('normal'|'scale')} orientationHandling - Determines how to handle screen
 *           orientation and rotation. When set to `'scale'` and the screen is in portrait
 *           orientation (due to screen rotation), dynamically calculates the base font size
 *           based on proportional scaling. When set to `'normal'`, uses the standard pxPerRem
 *           value. This is particularly useful for supporting device rotation scenarios.
 *           Default: `'normal'`
 * @property {LinearScalingConfig} linearScaling - Configuration for linear scaling mode.
 * @public
 */

/**
 * Configuration object for resolution independence behavior.
 *
 * This object controls how the resolution independence system handles different screen sizes,
 * orientations, and screen rotation scenarios.
 * See the details in {@link ui/resolution.ResolutionConfig|ResolutionConfig}
 *
 * @type {ui/resolution.ResolutionConfig}
 * @memberof ui/resolution
 * @public
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
	linearScalingType,
	scale,
	scaleToRem,
	selectSrc,
	unit,
	unitToPixelFactors
};
