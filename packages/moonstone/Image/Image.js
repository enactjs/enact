/**
 * Exports the {@link moonstone/Image.Image} component.
 *
 * @module moonstone/Image
 */

import factory from '@enact/core/factory';
import {ImageFactory as UiImageFactory} from '@enact/ui/Image';

import componentCss from './Image.less';

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

const ImageBaseFactory = factory({css: componentCss}, ({css}) => {
	// console.group('Moon Image');
	// for (const key in componentCss) {
	// 	if (componentCss[key] !== css[key]) console.log(key, ':', componentCss[key], '   VS   ', css[key]);
	// }
	// console.groupEnd();
	return UiImageFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/Button.ImageFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			image: css.image
		}
	});
});

const ImageBase = ImageBaseFactory();

export default ImageBase;
export {
	ImageBase as Image,
	// ImageBase,
	ImageBaseFactory as ImageFactory,
	ImageBaseFactory
};
