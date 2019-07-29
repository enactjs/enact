/**
 * An unstyled icon component to be customized by a theme or application.
 *
 * @module ui/Icon
 * @exports Icon
 */

import kind from '@enact/core/kind';
import {cap} from '@enact/core/util';
import PropTypes from 'prop-types';
import React from 'react';

import ri from '../resolution';

import componentCss from './Icon.module.less';

/**
 * Merges consumer styles with the image `src` resolved through the resolution independence module.
 *
 * @function
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
 * Tests if a string appears to be a URI/URL.
 *
 * @function
 * @param	{String}	c	Character to test
 *
 * @returns	{Boolean}		`true` if c looks like a URL
 * @private
 */
const isUri = function (c) {
	return (c.indexOf('/') > -1) || (c.indexOf('.') > -1);
};

/**
 * A basic icon component structure without any behaviors applied to it.
 *
 * @class Icon
 * @memberof ui/Icon
 * @ui
 * @public
 */
const Icon = kind({
	name: 'ui:Icon',

	propTypes: /** @lends ui/Icon.Icon.prototype */ {
		/**
		 * The icon content.
		 *
		 * May be specified as either:
		 *
		 * * A string that represents an icon from the [iconList]{@link ui/Icon.Icon.iconList},
		 * * An HTML entity string, Unicode reference or hex value (in the form '0x...'),
		 * * A URL specifying path to an icon image, or
		 * * An object representing a resolution independent resource (See {@link ui/resolution}).
		 *
		 * @type {String|Object}
		 * @public
		 */
		children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `icon` - The root component class
		 * * `dingbat` - Applied when the value of [`icon`]{@link ui/Icon.Icon.icon} is not
		 *   found in [iconList]{@link ui/Icon.Icon.iconList}
		 * * `large` - Applied when `size` prop is `'large'`
		 * * `pressed` - Applied when `pressed` prop is `true`
		 * * `small` - Applied when `size` prop is `'small'`
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Flip the icon horizontally, vertically or both.
		 *
		 * @type {('both'|'horizontal'|'vertical')}
		 * @public
		 */
		flip: PropTypes.string,

		/**
		 * The full list (hash) of supported icons.
		 *
		 * The keys of this hash are the unique names of each icon. The values are the unicode
		 * characters to insert in the icon. These will typically map to glyphs in your icon-font.
		 * The format of the keys can be character, glyph, or entity reference that correctly
		 * renders in a React + JSX string.
		 *
		 * @type {Object}
		 * @default {}
		 * @public
		 */
		iconList: PropTypes.object,

		/**
		 * Applies the `pressed` CSS class.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		pressed: PropTypes.bool,

		/**
		 * The size of the button.
		 *
		 * Applies either the `small` or `large` CSS class which can be customized by
		 * [theming]{@link /docs/developer-guide/theming/}.
		 *
		 * @type {('small'|'large')}
		 * @default 'small'
		 * @public
		 */
		size: PropTypes.string
	},

	defaultProps: {
		iconList: {},
		pressed: false,
		size: 'small'
	},

	styles: {
		css: componentCss,
		className: 'icon',
		publicClassNames: true
	},

	computed: {
		className: ({children: icon, flip, iconList, pressed, size, styler}) => {
			return styler.append(
				{
					// If the icon isn't in our known set, apply our custom font class
					dingbat: !(icon in iconList),
					pressed
				},
				flip ? `flip${cap(flip)}` : null,
				size
			);
		},
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
					} else if (!isUri(iconProp)) {
						// A "simple" string is assumed to be an icon-name string
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
		delete rest.size;

		return (
			<div
				aria-hidden
				{...rest}
				{...iconProps}
			/>
		);
	}
});

export default Icon;
export {
	Icon
};
