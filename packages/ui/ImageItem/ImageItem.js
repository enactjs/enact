/*  eslint-disable react-hooks/rules-of-hooks */
/*  eslint-disable react-hooks/exhaustive-deps */
// To use `React.useMemo` in a kind, the eslint rules above has benn blocked.

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

import  {MemoPropsContext, MemoPropsDecorator} from './MemoPropsDecorator';

import componentCss from './ImageItem.module.less';

// Adapts ComponentOverride to work within Cell since both use the component prop
function ImageOverride ({imageComponent, placeholder, src, ...rest}) {
	return (
		<MemoPropsContext.Consumer>
			{(context) => {
				return ComponentOverride({
					...rest,
					component: imageComponent,
					placeholder: context && context.placeholder || placeholder,
					src: context && context.src || src
				});
			}}
		</MemoPropsContext.Consumer>
	);
}

ImageOverride.propTypes = {
	/**
	 * The component used to render the image component.
	 *
	 * @type {Component|Element}
	 * @private
	 */
	imageComponent: EnactPropTypes.componentOverride,

	/**
	 * A placeholder image to be displayed before the image is loaded.
	 *
	 * @type {String}
	 * @private
	 */
	placeholder: PropTypes.string,

	/**
	 * String value or Object of values used to determine which image will appear on a specific
	 * screenSize.
	 *
	 * @type {String|Object}
	 * @private
	 */
	src: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

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
		className: ({orientation, selected, styler}) => styler.append({
			selected,
			horizontal: orientation === 'horizontal',
			vertical: orientation === 'vertical'
		}),
		memoizedImageCell: ({css, imageComponent, orientation, placeholder, src}) => {
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
						src={src}
					/>
				);
				// We don't need the dependency of the `src` because it will be updated through a context.
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, [css.image, imageComponent, isHorizontal, placeholder]);
		},
		memoizedChildren: ({children}) => {
			return children ? React.useMemo(() => {
				return children;
			}, [children]) : null;
		}
	},

	render: ({className, css, memoizedChildren, memoizedImageCell, orientation, ...rest}) => {
		delete rest.children;
		delete rest.className;
		delete rest.imageComponent;
		delete rest.placeholder;
		delete rest.selected;
		delete rest.src;

		const isHorizontal = orientation === 'horizontal';
		const Component = isHorizontal ? Row : Column;

		const memoizedChildrenCell = memoizedChildren ? React.useMemo(() => {
			return (
				<Cell
					// eslint-disable-next-line no-undefined
					align={isHorizontal ? 'center' : undefined}
					className={css.caption}
					key="children"
					shrink={!isHorizontal}
				>
					{memoizedChildren}
				</Cell>
			);
		}, [css.caption, isHorizontal, memoizedChildren]) : null;

		return (
			<div {...rest} className={className}>
				{React.useMemo(() => {
					return (
						<Component>
							<MemoPropsContext.Consumer>
								{() => ([memoizedImageCell, memoizedChildrenCell])}
							</MemoPropsContext.Consumer>
						</Component>
					);
				}, [])}
			</div>
		);
	}
});

export default ImageItemBase;
export {
	ImageItemBase as ImageItem,
	ImageItemBase,
	MemoPropsDecorator,
	MemoPropsContext,
};
