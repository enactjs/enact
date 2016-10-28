/**
 * Exports the {@link module:@enact/moonstone/Image~Image} component.
 *
 * @module @enact/moonstone/Image
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';
import {selectSrc} from '@enact/ui/resolution';

import css from './Image.less';

/**
 * {@link module:@enact/moonstone/Image~Image} is a component designed to display images
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
 * @ui
 * @public
 */

const ImageBase = kind({
	name: 'Image',

	propTypes: {
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

	render: ({imageSrc, style, ...rest}) => {
		delete rest.src;
		delete rest.sizing;

		return (
			<div {...rest} style={{...style, backgroundImage: `url(${imageSrc})`}} />
		);
	}
});

export default ImageBase;
export {ImageBase as Image, ImageBase};
