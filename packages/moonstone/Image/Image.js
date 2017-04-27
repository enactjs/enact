/**
 * Exports the {@link moonstone/Image.Image} component.
 *
 * @module moonstone/Image
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import {selectSrc} from '@enact/ui/resolution';

import css from './Image.less';

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
 * Image is based on the `div` element, but it uses `img` to provide `onError`
 * and `onLoad` events. The image that you see on screen is a `background-image`
 * from the `div` element, not the `img` element.
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
		 * String value or Object of values used to determine which image will appear on
		 * a specific screenSize.
		 *
		 * @type {String | Object}
		 * @required
		 * @public
		 */
		src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,

		/**
		 * Sets the aria-label for the image. If unset, it defaults to the value of `alt`
		 *
		 * @type {String}
		 * @public
		 * @memberof moonstone/Image.Image.prototype
		 */
		// Quoting this (necessary) makes it alphabetically sort differently...
		'aria-label': PropTypes.string,

		/**
		 * String value for the alt attribute of the image.
		 *
		 * @type {String}
		 * @public
		 */
		alt: PropTypes.string,

		/**
		 * Function that will run if the image has an error.
		 *
		 * @type {Function}
		 * @public
		 */
		onError: PropTypes.func,

		/**
		 * Function that will run once the image is loaded.
		 *
		 * @type {Function}
		 * @public
		 */
		onLoad: PropTypes.func,

		/**
		 * A placeholder image to be displayed before the image is loaded.
		 * For performance purposes, it should be pre-loaded or be a data url.
		 *
		 * @type {String}
		 * @default ''
		 * @public
		 */
		placeholder: PropTypes.string,

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
		placeholder: '',
		sizing: 'fill'
	},

	styles: {
		css,
		className: 'image'
	},

	computed: {
		bgImage: ({src, placeholder}) => {
			const imageSrc = selectSrc(src);
			return placeholder ? `url("${imageSrc}"), url("${placeholder}")` : `url("${imageSrc}")`;
		},
		className: ({className, sizing, styler}) => {
			return sizing !== 'none' ? styler.append(sizing) : className;
		},
		imgSrc: ({src}) => selectSrc(src)
	},

	render: ({alt, 'aria-label': ariaLabel, bgImage, imgSrc, onError, onLoad, style, ...rest}) => {
		delete rest.placeholder;
		delete rest.sizing;
		delete rest.src;

		return (
			<div role="img" {...rest} aria-label={ariaLabel || alt} style={{...style, backgroundImage: bgImage}}>
				<img className={css.img} src={imgSrc} alt={alt} onLoad={onLoad} onError={onError} />
			</div>
		);
	}
});

export default ImageBase;
export {ImageBase as Image, ImageBase};
