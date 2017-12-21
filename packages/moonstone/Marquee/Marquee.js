/*
 * Exports the {@link moonstone/Marquee.Marquee} and {@link moonstone/Marquee.MarqueeBase}
 * components. The default export is {@link moonstone/Marquee.Marquee}.
 *
 * note: not jsdoc on purpose, exports in index.js
 */

import deprecate from '@enact/core/internal/deprecate';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import css from './Marquee.less';

const animated = css.text + ' ' + css.animate;

/**
 * {@link moonstone/Marquee.Marquee} is a stateless text container element which
 * implements a text cut-off followed by an ellipsis character.
 *
 * @class Marquee
 * @memberof moonstone/Marquee
 * @ui
 * @public
 */
const MarqueeBase = kind({
	name: 'Marquee',

	propTypes: /** @lends moonstone/Marquee.Marquee.prototype */ {

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
		 * When `true`, the contents will be centered regardless of the text directionality.
		 *
		 * @type {Boolean}
		 * @public
		 * @deprecated replaced by `alignment`
		 */
		centered: PropTypes.bool,

		/**
		 * `children` is the text or a set of components that should be scrolled by the
		 * {@link moonstone/Marquee.Marquee} component.
		 * This prop may be empty in some cases, which is OK.
		 *
		 * @type {Node|Node[]}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * CSS class name for the root node
		 *
		 * @type {String}
		 * @public
		 */
		className: PropTypes.string,

		/**
		 * Function to capture a reference to the client node
		 *
		 * @type {Function}
		 * @public
		 */
		clientRef: PropTypes.func,

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
		className: 'marquee'
	},

	computed: {
		clientClassName: ({animating}) => animating ? animated : css.text,
		clientStyle: ({alignment, animating, centered, distance, overflow, rtl, speed}) => {
			let textAlign = null;

			if (centered) {
				deprecate({name: 'centered', since: '1.7.0', message: 'Use `alignment` instead', until: '2.0.0'});
				textAlign = 'center';
			}

			if (alignment) {
				textAlign = alignment;
			}

			// If the components content directionality doesn't match the context, we need to set it
			// inline
			let direction = rtl ? 'rtl' : 'ltr';

			const style = {
				direction,
				textAlign,
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
