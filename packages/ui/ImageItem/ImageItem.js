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

import ComponentOverride from '../ComponentOverride';
import Image from '../Image';
import {Cell, Column, Row} from '../Layout';
import {selectSrc} from '../resolution';

import  {
	MemoChildrenContext,
	MemoChildrenDecorator,
	MemoChildrenDOMAttributesContext
} from './MemoChildrenDecorator';

import componentCss from './ImageItem.module.less';

const useMemo = (...args) => {
	return React.useMemo(...args);
};

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
		imageComponent: Image,
		orientation: 'vertical',
		selected: false
	},

	functional: true,

	styles: {
		css: componentCss,
		className: 'imageItem',
		publicClassNames: true
	},

	computed: {
		className: ({orientation, selected, styler}) => {
			return styler.append(
				useMemo(
					() => ({
						selected,
						horizontal: orientation === 'horizontal',
						vertical: orientation === 'vertical'
					}),
					[orientation, selected]
				)
			);
		},
		isHorizntal: ({orientation}) => (orientation === 'horizontal'),
		imgCompWithoutSrc: ({css, imageComponent, isHorizntal, placeholder, src}) => {
			return useMemo(() => {
				return (
					<Cell
						className={css.image}
						component={ImageOverride}
						imageComponent={imageComponent}
						placeholder={placeholder}
						shrink={isHorizntal}
						src={src}
					/>
				);
				// We don't need the dependency of the `src` because it will be passed through a context.
				// We compare imageComponent.type for dependency instead of imageComponent.
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, [css.image, imageComponent.type.displayName, isHorizntal, placeholder]);
		},
		imgComp: ({imgCompWithoutSrc}) => {
			return useMemo(() => {
				return (
					<MemoChildrenDOMAttributesContext attr={['src']} selector="img" value={{src: selectSrc}}>
						{imgCompWithoutSrc}
					</MemoChildrenDOMAttributesContext>
				);
			}, [imgCompWithoutSrc]);
		},
		children: ({css, isHorizntal}) => {
			return useMemo(() => {
				return (
					<Cell
						className={css.caption}
						shrink={!isHorizntal}
						// eslint-disable-next-line no-undefined
						align={isHorizntal ? 'center' : undefined}
					>
						<MemoChildrenContext.Consumer>
							{({children}) => (children)}
						</MemoChildrenContext.Consumer>
					</Cell>
				);
			}, [css.caption, isHorizntal]);
		},
		imageItem: ({children, imgComp, orientation, ...rest}) => {
			delete rest.css;
			delete rest.imageComponent;
			delete rest.imgCompWithoutSrc;
			delete rest.isHorizntal;
			delete rest.orientation;
			delete rest.placeholder;
			delete rest.selected;
			delete rest.src;

			const Component = orientation === 'horizontal' ? Row : Column;

			const item = useMemo(() => {
				return (
					<Component {...rest}>
						{imgComp}
						{children}
					</Component>
				);
			}, [imgComp]);

			return (
				<MemoChildrenDOMAttributesContext attr={['data-index']}>
					{React.cloneElement(item, {...rest})}
				</MemoChildrenDOMAttributesContext>
			);
		}
	},

	render: ({imageItem}) => {
		return imageItem;
	}
});

export default ImageItemBase;
export {
	ImageItemBase as ImageItem,
	ImageItemBase,
	MemoChildrenDecorator,
	MemoChildrenContext,
	MemoChildrenDOMAttributesContext
};
