/**
 * Unstyled image item components and behaviors to be customized by a theme or application.
 *
 * @module ui/ImageItem
 * @exports ImageItem
 * @exports ImageItemBase
 * @exports ImageItemDecorator
 */

import EnactPropTypes from '@enact/core/internal/prop-types';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';

import ComponentOverride from '../ComponentOverride';
import ForwardRef from '../ForwardRef';
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
 * @class ImageItemBase
 * @memberof ui/ImageItem
 * @ui
 * @public
 */
const ImageItemBase = kind({
	name: 'ui:ImageItem',

	propTypes: /** @lends ui/ImageItem.ImageItemBase.prototype */ {
		/**
		 * The caption displayed with the image.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Called with a reference to the root component.
		 *
		 * When using {@link ui/ImageItem.ImageItem}, the `ref` prop is forwarded to this component
		 * as `componentRef`.
		 *
		 * @type {Object|Function}
		 * @public
		 */
		componentRef: EnactPropTypes.ref,

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

	render: ({children, componentRef, css, imageComponent, orientation, placeholder, src, ...rest}) => {
		delete rest.selected;

		const isHorizontal = orientation === 'horizontal';
		const Component = isHorizontal ? Row : Column;

		return (
			<Component {...rest} ref={componentRef}>
				<Cell
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
			</Component>
		);
	}
});

/**
 * A higher-order component that adds behaviors to an
 * {@link ui/ImageItem.ImageItemBase|ImageItemBase}.
 *
 * @hoc
 * @memberof ui/ImageItem
 * @mixes ui/ForwardRef.ForwardRef
 * @public
 */
const ImageItemDecorator = compose(
	ForwardRef({prop: 'componentRef'})
);

/**
 * A minimally styled ImageItem ready for customization by a theme.
 *
 * @class ImageItem
 * @memberof ui/ImageItem
 * @extends ui/ImageItem.ImageItemBase
 * @mixes ui/ImageItem.ImageItemDecorator
 * @omit componentRef
 * @ui
 * @public
 */
const ImageItem = ImageItemDecorator(ImageItemBase);

export default ImageItem;
export {
	ImageItem,
	ImageItemBase,
	ImageItemDecorator
};
