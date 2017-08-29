/**
 * Exports the {@link ui/IconFactory.IconFactory} component factory
 *
 * @module ui/IconFactory
 */

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import ri from '@enact/ui/resolution';
import React from 'react';
import PropTypes from 'prop-types';

import componentCss from './IconFactory.less';

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
 * A Factory for creating Icons that allows overriding certain classes at design time. The following
 * are properties of the `css` member of the argument to the factory.
 *
 * @class IconFactory
 * @memberof ui/IconFactory
 * @factory
 * @ui
 * @public
 */
const IconFactory = factory({css: componentCss}, (config) => {
	const {css} = config;

	return kind({
		name: 'Icon',

		propTypes: /** @lends ui/IconFactory.IconFactory.prototype */ {
			/**
			 * The icon specified as either:
			 *
			 * * A string that represents an icon from the
			 * [IconList]{@link ui/IconFactory.IconFactory.IconList},
			 * * An HTML entity string, Unicode reference or hex value (in the form '0x...'),
			 * * A URL specifying path to an icon image, or
			 * * An object representing a resolution independent resource (See {@link ui/resolution}).
			 *
			 * @type {String|Object}
			 * @public
			 */
			children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

			/**
			 * The full list (hash) of supported icons. The keys of this hash are the unique names
			 * of each icon. The values are the unicode character to insert in the icon. These will
			 * typically map to glyphs in your icon-font. The format of the keys can be character,
			 * glyph, or entity reference that correctly renders in a React + JSX string.
			 *
			 * @type {Object}
			 */
			iconList: PropTypes.object,

			/**
			 * If `true`, apply a pressed styling
			 *
			 * @type {Boolean}
			 * @public
			 */
			pressed: PropTypes.bool,

			/**
			 * If `true`, apply the 'small' class.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			small: PropTypes.bool
		},

		defaultProps: {
			iconList: {},
			small: false
		},

		styles: {
			css,
			className: 'icon'
		},

		computed: {
			className: ({children: icon, iconList, pressed, small, styler}) => styler.append(
				!iconList[icon] && css.dingbat,	// If the icon isn't in our known set, apply our custom font class
				{pressed, small}
			),
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
			delete rest.small;

			return <div {...rest} {...iconProps} />;
		}
	});
});

export default IconFactory;
export {
	IconFactory
};

