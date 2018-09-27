import kind from '@enact/core/kind';
import {forward, handle, stop} from '@enact/core/handle';
import PropTypes from 'prop-types';
import React from 'react';

import css from './Marquee.less';

const isEventSource = (ev) => ev.target === ev.currentTarget;

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
		 * @type {String}
		 * @public
		 */
		overflow: PropTypes.oneOf(['clip', 'ellipsis']),

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
			isEventSource,
			stop,
			(ev, props) => forward('onMarqueeComplete', {type: 'onMarqueeComplete'}, props)
		)
	},

	computed: {
		clientClassName: ({animating, willAnimate, styler}) => styler.join({
			animate: animating,
			text: true,
			willAnimate
		}),
		clientStyle: ({alignment, animating, distance, overflow, rtl, speed}) => {
			// If the components content directionality doesn't match the context, we need to set it
			// inline
			const direction = rtl ? 'rtl' : 'ltr';
			const sideProperty = rtl ? 'left' : 'right';
			const style = {
				direction,
				textAlign: alignment,
				textOverflow: overflow
			};

			if (animating) {
				const duration = distance / speed;

				style[sideProperty] = `${distance}px`;
				style.transitionDuration = `${duration}s`;
			} else {
				style[sideProperty] = 0;
			}

			return style;
		}
	},

	render: ({children, clientClassName, clientRef, clientStyle, onMarqueeComplete, ...rest}) => {
		delete rest.alignment;
		delete rest.animating;
		delete rest.distance;
		delete rest.onMarqueeComplete;
		delete rest.overflow;
		delete rest.rtl;
		delete rest.speed;
		delete rest.willAnimate;

		return (
			<div {...rest}>
				<div
					className={clientClassName}
					ref={clientRef}
					style={clientStyle}
					onTransitionEnd={onMarqueeComplete}
				>
					{children}
				</div>
			</div>
		);
	}
});

export default MarqueeBase;
export {
	MarqueeBase
};
