/**
 * Unstyled image item components and behaviors to be customized by a theme or application.
 *
 * @module ui/ImageItem
 * @exports ImageItem
 */

import EnactPropTypes from '@enact/core/internal/prop-types';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import {CacheReactElementWithPropContextDecorator} from '../CacheReactElementDecorator';
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
const ImageItemBase = kind({
	name: 'ui:ImageItem',

	propTypes: /** @lends ui/ImageItem.ImageItem.prototype */ {
		/**
		 * Cache React elements.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		cached: PropTypes.bool,

		/**
		 * The caption displayed with the image.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `imageItem` - The root component class
		 * * `caption` - The caption component class
		 * * `horizontal` - Applied when `orientation="horizontal"
		 * * `image` - The image component class
		 * * `selected` - Applied when `selected` prop is `true`
		 * * `vertical` - Applied when `orientation="vertical"
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
		 * @type {('horizontal'|'vertical')}
		 * @default 'vertical'
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * A placeholder image to be displayed before the image is loaded.
		 *
		 * @type {String}
		 * @public
		 */
		placeholder: PropTypes.string,

		/**
		 * Applies a selected visual effect to the image.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * String value or Object of values used to determine which image will appear on a specific
		 * screenSize.
		 *
		 * @type {String|Object}
		 * @public
		 */
		src: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
	},

	defaultProps: {
		cached: true,
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

	render: ({cached, children, css, imageComponent, orientation, placeholder, src, ...rest}) => {
		delete rest.selected;

		const isHorizontal = orientation === 'horizontal';
		const Component = isHorizontal ? Row : Column;
		const ContextComponent = cached ? CacheReactElementWithPropContextDecorator({filterProps: ['data-index', 'src']})(Component) : Component;
		const ContextCell = cached ? CacheReactElementWithPropContextDecorator({filterProps: ['src']})(Cell) : Cell;

		return (
			<ContextComponent {...rest}>
				<ContextCell
					className={css.image}
					component={ImageOverride}
					imageComponent={imageComponent}
					placeholder={placeholder}
					shrink={isHorizontal}
					src={src}
				/>
				{children ? (
					<Cell
						className={css.caption}
						shrink={!isHorizontal}
						// eslint-disable-next-line no-undefined
						align={isHorizontal ? 'center' : undefined}
					>
						{children}
					</Cell>
				) : null}
			</ContextComponent>
		);
	}
});

export default ImageItemBase;
export {
	ImageItemBase as ImageItem,
	ImageItemBase
};
