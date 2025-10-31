/**
 * Unstyled card components and behaviors to be customized by a theme or application.
 *
 * @module ui/Card
 * @exports Card
 * @exports CardBase
 * @exports CardDecorator
 */

import EnactPropTypes from '@enact/core/internal/prop-types';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';

import ComponentOverride from '../ComponentOverride';
import ForwardRef from '../ForwardRef';
import Image from '../Image';
import {Cell, Column, Row} from '../Layout';

import componentCss from './Card.module.less';

function ImageOverride ({imageComponent, ...rest}) {
	return ComponentOverride({
		component: imageComponent,
		...rest
	});
}

/**
 * A basic card without any behavior.
 *
 * @class CardBase
 * @memberof ui/Card
 * @ui
 * @public
 */
const CardBase = kind({
	name: 'ui:Card',

	propTypes: /** @lends ui/Card.CardBase.prototype */ {
		/**
		 * Determines whether the caption will be placed over the image or not.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		captionOverlay: PropTypes.bool,

		/**
		 * The caption node to be displayed with the image.

		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Called with a reference to the root component.
		 *
		 * When using {@link ui/Card.Card}, the `ref` prop is forwarded to this component
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
		 * The following classes are supported.
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Fits the image to its height and width and positions it on the center of the Card
		 *
		 * @type {Boolean}
		 * @public
		 */
		fitImage: PropTypes.bool,

		/**
		 * The component used to render the image component.
		 *
		 * @type {Component|Element}
		 * @default {@link ui/Image.Image}
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
		 * Splits the captions in two sections. This prop is only used when
		 * `captionOverlayOnFocus` or `captionOverlay` is `true` and `orientation` is `'vertical'`.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		splitCaption: PropTypes.bool,

		/**
		 * String value or object of values used to determine which image will appear on a specific
		 * screenSize.
		 *
		 * @type {String|Object}
		 * @public
		 */
		src: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
	},

	defaultProps: {
		imageComponent: Image,
		orientation: 'vertical'
	},

	styles: {
		css: componentCss,
		className: 'card',
		publicClassNames: true
	},

	computed: {
		className: ({captionOverlay, fitImage, orientation, splitCaption, selected, styler}) => styler.append({
			captionOverlay: captionOverlay && orientation === 'vertical',
			selected,
			fitImage,
			horizontal: orientation === 'horizontal',
			splitCaption: splitCaption && orientation === 'vertical',
			vertical: orientation === 'vertical'
		})
	},

	render: ({captionOverlay, children, componentRef, css, imageComponent, orientation, placeholder, src, ...rest}) => {
		delete rest.fitImage;
		delete rest.splitCaption;

		const isHorizontal = orientation === 'horizontal';
		const isCaptionOverlay = captionOverlay && !isHorizontal;
		const Component = isHorizontal ? Row : Column;

		const Wrapped = (
			<>
				<Cell
					className={css.image}
					component={ImageOverride}
					imageComponent={imageComponent}
					placeholder={placeholder}
					shrink
					src={src}
				/>
				{children ? (
					<Cell
						className={css.children}
						shrink={!isHorizontal}
						// eslint-disable-next-line no-undefined
						align={isHorizontal ? 'center' : undefined}
					>
						{children}
					</Cell>
				) : null}
			</>
		);

		return (
			<Component {...rest} ref={componentRef}>
				{isCaptionOverlay ?
					<div className={css.imageContainer}>
						{Wrapped}
					</div> : Wrapped
				}
			</Component>
		);
	}
});

/**
 * A higher-order component that adds behaviors to an {@link ui/Card.CardBase|Card}.
 *
 * @hoc
 * @memberof ui/Card
 * @mixes ui/ForwardRef.ForwardRef
 * @public
 */
const CardDecorator = compose(
	ForwardRef({prop: 'componentRef'})
);

/**
 * A minimally styled Card ready for customization by a theme.
 *
 * @class Card
 * @memberof ui/Card
 * @extends ui/Card.CardBase
 * @mixes ui/Card.CardDecorator
 * @omit componentRef
 * @ui
 * @public
 */
const Card = CardDecorator(CardBase);

export default Card;
export {
	Card,
	CardBase,
	CardDecorator
};
