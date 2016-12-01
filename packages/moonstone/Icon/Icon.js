/**
 * Exports the {@link moonstone/Icon.Icon} component and the list of icon constants as
 * [iconList]{@link moonstone/Icon.iconList}.
 *
 * @module moonstone/Icon
 */

import kind from '@enact/core/kind';
import ri from '@enact/ui/resolution';
import React, {PropTypes} from 'react';

import iconList from './IconList.js';

import css from './Icon.less';

/**
 * Merges consumer styles with the image `src` resolved through the resolution independence module.
 *
 * @param	{Object}		style	Style object
 * @param	{String|Object}	src		URI to image or object of URIs
 *
 * @returns	{Object}				Original style object with backgroundImage updated
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
 */
const isSingleCharacter = function (c) {
	return	c.length === 1 ||
			// check for 4-byte Unicode character
			c.length === 2 && c.charCodeAt() !== c.codePointAt();
};

/**
 * {@link moonstone/Icon.Icon} is a component that displays an icon image.  You may
 * specify an image, by setting the `src` property, or a font-based icon, by setting the child to a
 * string from the [IconList]{@link moonstone/Icon.IconList}.  If both `src` and
 * children are specified, both will be rendered.
 *
 * Usage:
 * ```
 * <Icon small>
 *     plus
 * </Icon>
 * ```
 *
 * @class Icon
 * @memberof moonstone/Icon
 * @ui
 * @public
 */
const IconBase = kind({
	name: 'Icon',

	propTypes: /** @lends moonstone/Icon.Icon.prototype */ {
		/**
		 * The icon specified as either:
		 *
		 * * A string that represents an icon from the [IconList]{@link moonstone/Icon.IconList},
		 * * An HTML entity string, Unicode reference or hex value (in the form '0x...'),
		 * * A URL specifying path to an icon image, or
		 * * An object representing a resolution independent resource (See {@link ui/resolution}).
		 *
		 * @type {String|Object}
		 * @public
		 */
		children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

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
		small: false
	},

	styles: {
		css,
		className: 'icon'
	},

	computed: {
		className: ({children: icon, pressed, small, styler}) => styler.append(
			!iconList[icon] && css.dingbat,	// If the icon isn't in our known set, apply our custom font class
			{pressed, small}
		),
		iconProps: ({children: iconProp, style}) => {
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
		delete rest.small;

		return <div {...rest} {...iconProps} />;
	}
});

/**
 * {@link moonstone/Icon.iconList} is an object whose keys can be used as the child of an
 * {@link moonstone/Icon.Icon} component.
 *
 * @name iconList
 * @memberof moonstone/Icon
 * @type Object
 * @ui
 * @public
 */

export default IconBase;
export {IconBase as Icon, IconBase, iconList as icons};
