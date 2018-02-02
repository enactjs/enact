/**
 * Provides Moonstone-themed Image component that supports multiple resolution sources.
 *
 * @example
 * <Image src="https://dummyimage.com/64/e048e0/0011ff" style={{height: 64, width: 64}} />
 *
 * @module moonstone/Image
 * @exports Image
 * @exports ImageBase
 * @exports ImageDecorator
 */

import kind from '@enact/core/kind';
import UiImage from '@enact/ui/Image';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import Skinnable from '../Skinnable';

import componentCss from './Image.less';

/**
 * A Moonstone-styled image component without any behavior
 *
 * @class ImageBase
 * @memberof moonstone/Image
 * @ui
 * @public
 */
const ImageBase = kind({
	name: 'Image',

	propTypes: /** @lends moonstone/Image.ImageBase.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `image` - The root component class for Image
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object
	},

	styles: {
		css: componentCss,
		publicClassNames: ['image']
	},

	render: ({css, ...rest}) => {
		return (
			<UiImage
				{...rest}
				css={css}
			/>
		);
	}
});

/**
 * Moonstone-specific behaviors to apply to [Image]{@link moonstone/Image.ImageBase}.
 *
 * @hoc
 * @memberof moonstone/Image
 * @mixes ui/Skinnable.Skinnable
 * @public
 */
const ImageDecorator = compose(
	Pure,
	Skinnable
);

/**
 * A Moonstone-styled image component
 *
 * ```
 * <Image
 *   src={{
 *     'hd': 'https://dummyimage.com/64/e048e0/0011ff',
 *     'fhd': 'https://dummyimage.com/128/e048e0/0011ff',
 *     'uhd': 'https://dummyimage.com/256/e048e0/0011ff'
 *   }}
 * >
 * ```
 *
 * @class Image
 * @memberof moonstone/Image
 * @extends moonstone/Image.ImageBase
 * @mixes moonstone/Image.ImageDecorator
 * @ui
 * @public
 */
const Image = ImageDecorator(ImageBase);


export default Image;
export {
	Image,
	ImageBase,
	ImageDecorator
};
