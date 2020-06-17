/*  eslint-disable react-hooks/rules-of-hooks */
/*  eslint-disable react-hooks/exhaustive-deps */
//
// React Hook "useMemo" is called in the function of the "computed" object properly,
// which is neither a React function component or a custom React Hook function.
// We might support `useComputed` or something like that later.

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

import  {
	MemoPropsContext,
	MemoPropsDecorator,
	MemoPropsDOMAttributesContext
} from './MemoPropsDecorator';
import {reducedComputed} from './util';

import componentCss from './ImageItem.module.less';

let placeholderElement = null;

// Adapts ComponentOverride to work within Cell since both use the component prop
function ImageOverride ({imageComponent, placeholder, src, ...rest}) {
	placeholderElement = placeholderElement || placeholder && ComponentOverride({
		...rest,
		component: imageComponent,
		placeholder,
		src: null
	}) || null;

	return (
		<MemoPropsContext.Consumer>
			{(context) => {
				const imageSrc = context && context.src || src;

				return (src || placeholder) ? ComponentOverride({
					...rest,
					component: imageComponent,
					placeholder,
					src: imageSrc
				}) : placeholderElement;
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
		computedProps: ({children, css, imageComponent, orientation, placeholder, src, ...rest}) => (reducedComputed({
			isHorizntal: () => (orientation === 'horizontal'),
			memoImage: ({isHorizntal}) => {
				return React.useMemo(() => {
					return (
						<Cell
							className={css.image}
							component={ImageOverride}
							imageComponent={imageComponent}
							key="image"
							placeholder={placeholder}
							shrink={isHorizntal}
							src={src}
						/>
					);
					// We don't need the dependency of the `src` because it will be passed through a context.
					// eslint-disable-next-line react-hooks/exhaustive-deps
				}, [css.image, imageComponent, isHorizntal, placeholder]);
			},
			memoCaption: () => {
				return children ? React.useMemo(() => {
					return children;
				}, [children]) : null;
			},
			memoChildren: ({memoCaption, isHorizntal}) => {
				return memoCaption ? React.useMemo(() => {
					return (
						<Cell
							// eslint-disable-next-line no-undefined
							align={isHorizntal ? 'center' : undefined}
							className={css.caption}
							key="children"
							shrink={!isHorizntal}
						>
							{memoCaption}
						</Cell>
					);
				}, [css.caption, isHorizntal, memoCaption]) : null;
			},
			computedProps: ({isHorizntal, memoChildren, memoImage}) => ({isHorizntal, memoChildren, memoImage, rest})
		}))
	},

	render: ({className, computedProps: {isHorizntal, memoChildren, memoImage, rest}}) => {
		const Component = isHorizntal ? Row : Column;

		delete rest.className;
		delete rest.selected;

		return (
			<MemoPropsDOMAttributesContext attr={['data-index']}>
				{
					React.useMemo(() => {
						return (
							<Component {...rest} className={className}>
								<MemoPropsContext.Consumer>
									{() => ([memoImage, memoChildren])}
								</MemoPropsContext.Consumer>
							</Component>
						);
					}, [className])
				}
			</MemoPropsDOMAttributesContext>
		);
	}
});

export default ImageItemBase;
export {
	ImageItemBase as ImageItem,
	ImageItemBase,
	MemoPropsDecorator,
	MemoPropsContext,
	MemoPropsDOMAttributesContext,
	reducedComputed
};
