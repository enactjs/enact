/**
 * Unstyled image item components and behaviors to be customized by a theme or application.
 *
 * @module ui/ImageItem
 * @exports ImageItem
 */

import kind from '@enact/core/kind';
import EnactPropTypes from '@enact/core/internal/prop-types';
import PropTypes from 'prop-types';
import React from 'react';

import ComponentOverride from '../ComponentOverride';
import Image from '../Image';
import {Cell, Column, Row} from '../Layout';

import componentCss from './ImageItem.module.less';

// Adapts ComponentOverride to work within Cell since both use the component prop
function ImageOverride ({imageComponent, ...rest}) {
	return ComponentOverride({
		component: imageComponent,
		...rest
	});
}

/**
 * A basic image item without any behavior.
 *
 * @class ImageItem
 * @memberof ui/ImageItem
 * @ui
 * @public
 */
const ImageItem = kind({
	name: 'ui:ImageItem',

	propTypes: /** @lends ui/ImageItem.ImageItem.prototype */ {
		/**
		 * The caption string or a node to be displayed with the image.
		 *
		 * @type {Node}
		 * @public
		 */
		caption: PropTypes.node,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `image` - The image component class
		 * * `selected` - Applied when `selected` prop is `true`
		 * * `caption` - The caption component class
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * The component used to render the image component.
		 *
		 * @type {Component|Element}
		 * @public
		 */
		imageComponent: EnactPropTypes.componentOverride,

		/**
		 * The layout orientation of the component.
		 *
		 * Valid values are:
		 * * `'horizontal'`, and
		 * * `'vertical'`.
		 *
		 * @type {String}
		 * @default 'vertical'
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * Placeholder image used while [source]{@link ui/ImageItem.ImageItem#source}
		 * is loaded.
		 *
		 * @type {String}
		 * @public
		 */
		placeholder: PropTypes.string,

		/**
		 * Applies a selected visual effect to the image, but only if `selectionOverlayShowing`
		 * is also `true`.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * String value or Object of values used to determine which image will appear on
		 * a specific screenSize.
		 *
		 * @type {String|Object}
		 * @public
		 */
		src: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
	},

	defaultProps: {
		imageComponent: Image,
		orientation: 'vertical',
		selected: false
	},

	styles: {
		css: componentCss,
		className: 'imageItem',
		publicClassNames: true
	},

	computed: {
		className: ({orientation, selected, styler}) => styler.append({
			selected,
			horizontal: orientation === 'horizontal',
			vertical: orientation === 'vertical'
		})
	},

	render: ({caption, css, imageComponent, orientation, placeholder, src, ...rest}) => {
		delete rest.selected;

		const isHorizontal = orientation === 'horizontal';
		const Component = isHorizontal ? Row : Column;

		return (
			<Component {...rest}>
				<Cell
					className={css.image}
					component={ImageOverride}
					imageComponent={imageComponent}
					placeholder={placeholder}
					shrink={isHorizontal}
					src={src}
				/>
				{caption ? (
					<Cell
						className={css.caption}
						shrink={!isHorizontal}
						// eslint-disable-next-line no-undefined
						align={isHorizontal ? 'center' : undefined}
					>
						{caption}
					</Cell>
				) : null}
			</Component>
		);
	}
});

export default ImageItem;
export {ImageItem};
