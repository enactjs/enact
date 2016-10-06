/**
 * Exports the {@link module:@enact/moonstone/Marquee~Marquee} and {@link module:@enact/moonstone/Marquee~MarqueeBase}
 * components. The default export is {@link module:@enact/moonstone/Marquee~Marquee}.
 *
 * @module @enact/moonstone/Marquee
 */

import kind from '@enact/core/kind';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import React from 'react';

import css from './Marquee.less';

const animated = css.text + ' ' + css.animate;

/**
 * {@link module:@enact/moonstone/Marquee~MarqueeBase} is a stateless text container element which
 * implements a text cut-off followed by an ellipsis character.
 *
 * @class MarqueeBase
 * @ui
 * @public
 */
const MarqueeBase = kind({
	name: 'Marquee',

	propTypes: {
		/**
		 * `true` when the component should be animating
		 *
		 * @type {Boolean}
		 * @public
		 */
		animating: React.PropTypes.bool,

		/**
		 * `children` is the text or components that should be scrolled by the
		 * {@link module:@enact/moonstone/Marquee~Marquee} component.
		 * This prop may be empty in some cases, which is OK.
		 *
		 * @type {Node|Node[]}
		 * @public
		 */
		children: React.PropTypes.node,

		/**
		 * CSS class name for the root node
		 *
		 * @type {String}
		 * @public
		 */
		className: React.PropTypes.string,

		/**
		 * Function to capture a reference to the client node
		 *
		 * @type {Function}
		 * @public
		 */
		clientRef: React.PropTypes.func,

		/**
		 * Distance to animate the marquee which is generally the width of the text minus the
		 * width of the container.
		 *
		 * @type {Number}
		 * @public
		 */
		distance: React.PropTypes.number,

		/**
		 * Callback function for when the marquee completes its animation
		 *
		 * @type {Function}
		 * @public
		 */
		onMarqueeComplete: React.PropTypes.func,

		/**
		 * Text overflow setting. Either `clip` or `ellipsis`
		 *
		 * @type {String}
		 * @public
		 */
		overflow: React.PropTypes.oneOf(['clip', 'ellipsis']),

		/**
		 * Speed of marquee animation in pixels/second.
		 *
		 * @type {Number}
		 * @public
		 */
		speed: React.PropTypes.number
	},

	styles: {
		css,
		className: 'marquee'
	},

	computed: {
		clientClassName: ({animating}) => animating ? animated : css.text,
		clientStyle: ({animating, distance, overflow, speed}, {rtl}) => {
			const duration = distance / speed;
			const adjustedDistance = rtl ? distance : distance * -1;

			const style = {
				textOverflow: overflow,
				transform: 'translateZ(0)'
			};

			if (animating) {
				style.transform = `translate3d(${adjustedDistance}px, 0, 0)`;
				style.transition = `transform ${duration}s linear`;
				style.WebkitTransition = `transform ${duration}s linear`;
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

MarqueeBase.contextTypes = contextTypes;

export default MarqueeBase;
export {MarqueeBase as Marquee, MarqueeBase};
