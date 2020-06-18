/*  eslint-disable react-hooks/rules-of-hooks */
/*  eslint-disable react-hooks/exhaustive-deps */
// To use `React.useMemo` in a kind, the above eslint rules have been disabled.

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

import  {MemoPropsContextConsumer, MemoPropsDecorator, MemoPropsThemeContextConsumer, MemoPropsThemeDecorator} from './MemoPropsDecorator';

import componentCss from './ImageItem.module.less';

// Adapts ComponentOverride to work within Cell since both use the component prop
function ImageOverride ({imageComponent, ...rest}) {
	return MemoPropsContextConsumer((context) => {
		return ComponentOverride({
			...rest,
			component: imageComponent,
			src: context && context.src
		});
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
		selected: PropTypes.bool
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
		className: ({orientation, selected, styler}) => styler.append({
			selected,
			horizontal: orientation === 'horizontal',
			vertical: orientation === 'vertical'
		}),
		memoizedImageCell: ({css, imageComponent, orientation, placeholder}) => {
			const isHorizontal = orientation === 'horizontal';

			return React.useMemo(() => {
				return (
					<Cell
						className={css.image}
						component={ImageOverride}
						imageComponent={imageComponent}
						key="image"
						placeholder={placeholder}
						shrink={isHorizontal}
					/>
				);
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, [css.image, imageComponent, isHorizontal, placeholder]);
		},
		memoizedChildrenCell: ({css, orientation}) => {
			const isHorizontal = orientation === 'horizontal';

			return React.useMemo(() => {
				return (
					<Cell
						// eslint-disable-next-line no-undefined
						align={isHorizontal ? 'center' : undefined}
						className={css.caption}
						key="children"
						shrink={!isHorizontal}
					>
						{MemoPropsContextConsumer((context) => {
							return context && context.children;
						})}
					</Cell>
				);
			}, [css.caption, isHorizontal]);
		}
	},

	render: ({className, memoizedChildrenCell, memoizedImageCell, orientation, ...rest}) => {
		delete rest.css;
		delete rest.imageComponent;
		delete rest.placeholder;
		delete rest.selected;

		const isHorizontal = orientation === 'horizontal';
		const Component = isHorizontal ? Row : Column;

		return (
			<div {...rest} className={className}>
				{React.useMemo(() => {
					return (
						<Component>
							{[memoizedImageCell, memoizedChildrenCell]}
						</Component>
					);
				}, [Component])}
			</div>
		);
	}
});

const ImageItem = MemoPropsDecorator({filter: ['children', 'src']})(ImageItemBase);

/**
 * The caption displayed with the image.
 *
 * @name children
 * @memberof ui/ImageItem.ImageItemBase.prototype
 * @type {Node}
 * @public
 */

/**
 * String value or Object of values used to determine which image will appear on a specific
 * screenSize.
 *
 * @name src
 * @memberof ui/ImageItem.ImageItemBase.prototype
 * @type {String|Object}
 * @public
 */

export default ImageItem;
export {
	ImageItem,
	ImageItemBase,
	MemoPropsDecorator,
	MemoPropsThemeContextConsumer,
	MemoPropsThemeDecorator
};
