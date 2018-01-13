/**
 * Provides Moonstone-themed Image component that supports multiple resolution sources.
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
import PropTypes from 'prop-types';
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

	propTypes: /** @lends moonstone/Image.ImageBase.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `size` - The size of Image
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object
	},

	styles: {
		css: componentCss,
		publicClassNames: ['size']
	},

	render: ({css, ...rest}) => {
		return (
			<UiImage
				css={css}
				{...rest}
			/>
		);
	}
});

const Image = Pure(
	ImageBase
);

export default Image;
export {
	Image,
	ImageBase
};
