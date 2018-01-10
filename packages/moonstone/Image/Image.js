/**
 * Provides Moonstone-themed Image component.
 *
 * @example
 * <Image src={{'hd': 'https://dummyimage.com/64/e048e0/0011ff', 'fhd': 'https://dummyimage.com/128/e048e0/0011ff', 'uhd': 'https://dummyimage.com/256/e048e0/0011ff'}}>
 *
 * @module moonstone/Image
 * @exports Image
 * @exports ImageBase
 */

import kind from '@enact/core/kind';
import UiImage from '@enact/ui/Image';
import Pure from '@enact/ui/internal/Pure';
import React from 'react';

import componentCss from './Image.less';

/**
 * Renders a moonstone-styled Image.
 *
 * @class ImageBase
 * @memberof moonstone/Image
 * @ui
 * @public
 */
const ImageBase = kind({
	name: 'Image',

	render: (props) => (
		<UiImage
			{...props}
			css={componentCss}
		/>
	)
});

const Image = Pure(
	ImageBase
);

export default Image;
export {
	Image,
	ImageBase
};
