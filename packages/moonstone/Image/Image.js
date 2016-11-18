/**
 * Exports the {@link moonstone/Image.Image} component.
 *
 * @module moonstone/Image
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';
import {selectSrc} from '@enact/ui/resolution';

import css from './Image.less';

const defaultPlaceholder =
	'data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC' +
	'9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48cmVjdCB3aWR0aD0iMTAw' +
	'JSIgaGVpZ2h0PSIxMDAlIiBzdHlsZT0ic3Ryb2tlOiAjNDQ0OyBzdHJva2Utd2lkdGg6IDE7IGZpbGw6ICNhYW' +
	'E7IiAvPjxsaW5lIHgxPSIwIiB5MT0iMCIgeDI9IjEwMCUiIHkyPSIxMDAlIiBzdHlsZT0ic3Ryb2tlOiAjNDQ0' +
	'OyBzdHJva2Utd2lkdGg6IDE7IiAvPjxsaW5lIHgxPSIxMDAlIiB5MT0iMCIgeDI9IjAiIHkyPSIxMDAlIiBzdH' +
	'lsZT0ic3Ryb2tlOiAjNDQ0OyBzdHJva2Utd2lkdGg6IDE7IiAvPjwvc3ZnPg==';

/**
 * {@link moonstone/Image.Image} is a component designed to display images
 * conditionally based on screen size. This component has a default size but should have a size
 * specified for its particular usage using a CSS `className` or inline `style`.
 *
 * Usage:
 *
 * ```
 *const src = {
 *  'hd': 'http://lorempixel.com/64/64/city/1/',
 *  'fhd': 'http://lorempixel.com/128/128/city/1/',
 *  'uhd': 'http://lorempixel.com/256/256/city/1/'
 *};
 *
 * <Image className={css.myImage} src={src} sizing={'fill'} />
 * ```
 *
 * > If you need a naturally sized image, you can use the native `<img>` element instead.
 *
 * @class Image
 * @memberof moonstone/Image
 * @ui
 * @public
 */

const ImageBase = kind({
	name: 'Image',

	propTypes: /** @lends moonstone/Image.Image.prototype */ {
		/**
		 * A placeholder image to be displayed before the image is loaded.
		 * For performance purposes, it should be pre-loaded or be a data url.
		 *
		 * @type {String}
		 * @default defaultPlaceholder
		 * @public
		 */
		placeholder: PropTypes.string,

		/**
		 * String value or Object of values used to determine which image will appear on
		 * a specific screenSize.
		 *
		 * @type {String | Object}
		 * @required
		 * @public
		 */
		src: PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.object]).isRequired,

		/**
		 * Used to set the `background-size` of an Image.
		 *
		 * * `'fill'` - sets `background-size: cover`
		 * * `'fit'` - sets `background-size: contain`
		 * * `'none'` - uses the image's natural size
		 *
		 * @type {String}
		 * @default 'fill'
		 * @public
		 */
		sizing: PropTypes.oneOf(['fit', 'fill', 'none'])
	},

	defaultProps: {
		placeholder: defaultPlaceholder,
		sizing: 'fill'
	},

	styles: {
		css,
		className: 'image'
	},

	computed: {
		className: ({className, sizing, styler}) => {
			return sizing !== 'none' ? styler.append(sizing) : className;
		},
		imageSrc: ({src}) => selectSrc(src)
	},

	render: ({imageSrc, placeholder, style, ...rest}) => {
		delete rest.src;
		delete rest.sizing;

		return (
			<div {...rest} style={{...style, backgroundImage: `url(${imageSrc}), url(${placeholder})`}} />
		);
	}
});

export default ImageBase;
export {ImageBase as Image, ImageBase};
