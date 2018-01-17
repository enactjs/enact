import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import css from './Marquee.less';

const animated = css.text + ' ' + css.animate;

/**
 * {@link ui/Marquee.MarqueeBase} is a container element which implements a text cut-off followed by
 * an ellipsis character.
 *
 * @class MarqueeBase
 * @memberof ui/Marquee
 * @ui
 * @public
 */
const MarqueeBase = kind({
	name: 'Marquee',

	propTypes: /** @lends ui/Marquee.MarqueeBase.prototype */ {

		/**
		 * Text alignment value of the marquee. Valid values are `'left'`, `'right'` and `'center'`.
		 *
		 * @type {String}
		 * @public
		 */
		alignment: PropTypes.oneOf(['left', 'right', 'center']),

		/**
		 * `true` when the component should be animating
		 *
		 * @type {Boolean}
		 * @public
		 */
		animating: PropTypes.bool,

		/**
		 * `children` is the text or a set of components that should be scrolled by the
		 * {@link ui/Marquee.MarqueeBase} component.
		 * This prop may be empty in some cases, which is OK.
		 *
		 * @type {Node|Node[]}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Function to capture a reference to the client node
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
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Distance to animate the marquee which is generally the width of the text minus the
		 * width of the container.
		 *
		 * @type {Number}
		 * @public
		 */
		distance: PropTypes.number,

		/**
		 * Callback function for when the marquee completes its animation
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
		speed: PropTypes.number
	},

	defaultProps: {
		rtl: false
	},

	styles: {
		css,
		className: 'marquee',
		publicClassNames: true
	},

	computed: {
		clientClassName: ({animating}) => animating ? animated : css.text,
		clientStyle: ({alignment, animating, distance, overflow, rtl, speed}) => {
			// If the components content directionality doesn't match the context, we need to set it
			// inline
			let direction = rtl ? 'rtl' : 'ltr';

			const style = {
				direction,
				textAlign: alignment,
				textOverflow: overflow
			};

			if (animating) {
				const adjustedDistance = rtl ? distance : distance * -1;
				const duration = distance / speed;

				style.transform = `translate3d(${adjustedDistance}px, 0, 0)`;
				style.transition = `transform ${duration}s linear`;
				style.WebkitTransition = `transform ${duration}s linear`;
				style.willChange = 'transform';
			}

			return style;
		}
	},

	render: ({children, className, clientClassName, clientRef, clientStyle, onMarqueeComplete}) => {
		return (
			<div className={className}>
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
export {MarqueeBase as Marquee, MarqueeBase};
