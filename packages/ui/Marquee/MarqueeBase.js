import kind from '@enact/core/kind';
import {forProp, forward, handle, stop} from '@enact/core/handle';
import PropTypes from 'prop-types';
import React from 'react';

import css from './Marquee.module.less';

const isEventSource = (ev) => ev.target === ev.currentTarget;

const shouldFade = (distance, overflow) => distance > 0 && overflow === 'clip';

/**
 * Marquees the children of the component.
 *
 * For automated marquee calculations use {@link ui/Marquee.Marquee}.
 *
 * @class MarqueeBase
 * @memberof ui/Marquee
 * @ui
 * @public
 */
const MarqueeBase = kind({
	name: 'ui:Marquee',

	propTypes: /** @lends ui/Marquee.MarqueeBase.prototype */ {

		/**
		 * Text alignment value of the marquee
		 *
		 * Valid values are:
		 *
		 * * `'left'`,
		 * * `'right'`, and
		 * * `'center'`
		 *
		 * @type {String}
		 * @public
		 */
		alignment: PropTypes.oneOf(['left', 'right', 'center']),

		/**
		 * Applies animating styles such as removing the ellipsis.
		 *
		 * @type {Boolean}
		 * @public
		 */
		animating: PropTypes.bool,

		/**
		 * The text or a set of components that should be marqueed
		 *
		 * This prop may be empty in some cases, which is OK.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Called when mounting or unmounting with a reference to the client node
		 *
		 * @type {Function}
		 * @public
		 */
		clientRef: PropTypes.func,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `marquee` - The root component class
		 * * `animate` - Applied to the inner content node when the text is animating
		 * * `fade` - Applied to the root when `overflow="clip"` and text overflows
		 * * `padding` - The spacing node used between the repeated content
		 * * `rtl` - Applied to the root when `rtl` prop is set
		 * * `text` - The inner content node
		 * * `willAnimate` - Applied to the inner content node shortly before animation
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Distance to animate the marquee
		 *
		 * Usually, the `distance` is the width of the text minus the width of the container
		 *
		 * @type {Number}
		 * @public
		 */
		distance: PropTypes.number,

		/**
		 * Called when the marquee completes its animation
		 *
		 * @type {Function}
		 * @public
		 */
		onMarqueeComplete: PropTypes.func,

		/**
		 * Text overflow setting. Either `'clip'` or `'ellipsis'`
		 *
		 * @type {('clip','ellipsis')}
		 * @public
		 */
		overflow: PropTypes.oneOf(['clip', 'ellipsis']),

		/**
		 * Amount of padding, in pixels, between the instances of the content
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		padding: PropTypes.number,

		/**
		 * `true` if the directionality of the content is right-to-left
		 *
		 * @type {Boolean}
		 * @public
		 * @default false
		 */
		rtl: PropTypes.bool,

		/**
		 * Speed of marquee animation in pixels/second.
		 *
		 * @type {Number}
		 * @public
		 */
		speed: PropTypes.number,

		/**
		 * Indicates the marquee will animate soon.
		 *
		 * Should be used by the component to prepare itself for animation such as promoting
		 * composite layers for improved performance.
		 *
		 * @type {Boolean}
		 * @public
		 * @default false
		 */
		willAnimate: PropTypes.bool
	},

	defaultProps: {
		padding: 0,
		rtl: false,
		willAnimate: false
	},

	styles: {
		css,
		className: 'marquee',
		publicClassNames: true
	},

	handlers: {
		onMarqueeComplete: handle(
			forProp('animating', true),
			isEventSource,
			stop,
			(ev, props) => forward('onMarqueeComplete', {type: 'onMarqueeComplete'}, props)
		)
	},

	computed: {
		className: ({animating, distance, overflow, rtl, willAnimate, styler}) => styler.append({
			animate: animating,
			fade: shouldFade(distance, overflow),
			rtl,
			willAnimate
		}),
		clientStyle: ({alignment, animating, distance, overflow, padding, rtl, speed}) => {
			// If the components content directionality doesn't match the context, we need to set it
			// inline
			const direction = rtl ? 'rtl' : 'ltr';
			const sideProperty = rtl ? 'left' : 'right';
			const style = {
				direction,
				textAlign: alignment,
				textOverflow: overflow,
				'--ui-marquee-padding': padding
			};

			if (animating) {
				const duration = distance / speed;

				style[sideProperty] = `${distance}px`;
				style.transitionDuration = `${duration}s`;
			} else {
				style[sideProperty] = 0;
			}

			return style;
		},
		duplicate: ({distance, overflow, willAnimate}) => {
			return willAnimate && shouldFade(distance, overflow);
		}
	},

	render: ({children, clientRef, clientStyle, duplicate, onMarqueeComplete, ...rest}) => {
		delete rest.alignment;
		delete rest.animating;
		delete rest.distance;
		delete rest.onMarqueeComplete;
		delete rest.overflow;
		delete rest.padding;
		delete rest.rtl;
		delete rest.speed;
		delete rest.willAnimate;

		return (
			<div {...rest}>
				<div
					className={css.text}
					ref={clientRef}
					style={clientStyle}
					onTransitionEnd={onMarqueeComplete}
				>
					{children}
					{duplicate ? (
						<React.Fragment>
							<div className={css.padding} />
							{children}
						</React.Fragment>
					) : null}
				</div>
			</div>
		);
	}
});

export default MarqueeBase;
export {
	MarqueeBase
};
