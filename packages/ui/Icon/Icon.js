/**
 * Exports the [Icon]{@link ui/Icon.Icon} and [IconBase]{@link ui/Icon.IconBase} components.
 *
 * The default export is [Icon]{@link ui/Icon.Icon}.
 *
 * @module ui/Icon
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import ri from '../resolution';

import componentCss from './Icon.less';

/**
 * Merges consumer styles with the image `src` resolved through the resolution independence module.
 *
 * @param	{Object}		style	Style object
 * @param	{String|Object}	src		URI to image or object of URIs
 *
 * @returns	{Object}				Original style object with backgroundImage updated
 * @private
 */
const mergeStyle = function (style, src) {
	let updated = Object.assign({}, style);
	let source = ri.selectSrc(src);
	if (src && src !== 'none' && src !== 'inherit' && src !== 'initial') {
		source = `url(${source})`;
	}

	updated.backgroundImage = source;
	return updated;
};

/**
 * Tests if a character is a single printable character
 *
 * @param	{String}	c	Character to test
 *
 * @returns	{Boolean}		`true` if c is a single character
 * @private
 */
const isSingleCharacter = function (c) {
	return	c.length === 1 ||
			// check for 4-byte Unicode character
			c.length === 2 && c.charCodeAt() !== c.codePointAt();
};

/**
 * [IconBase]{@link ui/Icon.IconBase} is a basic icon component structure without any behaviors
 * applied to it.
 *
 * @class IconBase
 * @memberof ui/Icon
 * @ui
 * @public
 */
const IconBase = kind({
	name: 'ui/Icon',

	propTypes: /** @lends ui/Icon.IconBase.prototype */ {
		/**
		 * The icon content.
		 *
		 * May be specified as either:
		 *
		 * * A string that represents an icon from the [iconList]{@link ui/Icon.IconBase.iconList},
		 * * An HTML entity string, Unicode reference or hex value (in the form '0x...'),
		 * * A URL specifying path to an icon image, or
		 * * An object representing a resolution independent resource (See {@link ui/resolution}).
		 *
		 * @type {String|Object}
		 * @public
		 */
		children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

		/**
		 * Appends CSS classes to the nodes and components with {@link ui/Icon.IconBase}.
		 *
		 * The following classes are supported:
		 *
		 * * `icon` - The root component class
		 * * `dingbat` - Applied when the value of [`icon`]{@link ui/Icon.IconBase.icon} is not
		 *   found in [iconList]{@link ui/Icon.IconBase.iconList}
		 * * `small` - Applied for a [small]{@link ui/Icon.IconBase.small} icon
		 * * `pressed` - Applied for a [pressed]{@link ui/Icon.IconBase.pressed} icon
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * The full list (hash) of supported icons.
		 *
		 * The keys of this hash are the unique names of each icon. The values are the unicode
		 * character to insert in the icon. These will typically map to glyphs in your icon-font.
		 * The format of the keys can be character, glyph, or entity reference that correctly
		 * renders in a React + JSX string.
		 *
		 * @type {Object}
		 */
		iconList: PropTypes.object,

		/**
		 * Applies the `pressed` CSS class to the [IconBase]{@link ui/Icon.IconBase}
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		pressed: PropTypes.bool,

		/**
		 * Applies the `small` CSS class to the [IconBase]{@link ui/Icon.IconBase}
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		small: PropTypes.bool
	},

	defaultProps: {
		iconList: {},
		pressed: false,
		small: false
	},

	styles: {
		css: componentCss,
		className: 'icon',
		publicClassNames: true
	},

	computed: {
		className: ({children: icon, iconList, pressed, small, styler}) => styler.append({
			// If the icon isn't in our known set, apply our custom font class
			dingbat: !(icon in iconList),
			pressed,
			small
		}),
		iconProps: ({children: iconProp, iconList, style}) => {
			let icon = iconList[iconProp];

			if (!icon) {
				if (typeof iconProp == 'string') {
					if (iconProp.indexOf('&#x') === 0) {
						// Converts a hex reference in HTML entity form: &#x99999;
						icon = parseInt(iconProp.slice(3, -1), 16);
					} else if (iconProp.indexOf('&#') === 0) {
						// Convert an HTML entity: &#99999;
						icon = parseInt(iconProp.slice(2, -1));
					} else if (iconProp.indexOf('\\u') === 0) {
						// Convert a unicode reference: \u99999;
						icon = parseInt(iconProp.slice(2), 16);
					} else if (iconProp.indexOf('0x') === 0) {
						// Converts a hex reference in string form
						icon = String.fromCodePoint(iconProp);
					} else if (isSingleCharacter(iconProp)) {
						// A single character is assumed to be an explicit icon string
						icon = iconProp;
					} else {
						// for a path or URI, add it to style
						style = mergeStyle(style, iconProp);
					}
				} else if (typeof iconProp === 'object') {
					style = mergeStyle(style, iconProp);
				}
			}

			if (typeof icon == 'number') {
				// Converts a hex reference in number form
				icon = String.fromCodePoint(icon);
			}

			return {
				children: icon,
				style
			};
		}
	},

	render: ({iconProps, ...rest}) => {
		delete rest.iconList;
		delete rest.pressed;
		delete rest.small;

		return (
			<div
				aria-hidden
				{...rest}
				{...iconProps}
			/>
		);
	}
});

/**
 * [Icon]{@link ui/Icon.Icon} is a minimally-styled icon component
 *
 * @class Icon
 * @extends ui/Icon.IconBase
 * @memberof ui/Icon
 * @ui
 * @public
 */

export default IconBase;
export {
	IconBase as Icon,
	IconBase
};
