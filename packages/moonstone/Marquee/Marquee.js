/*
 * Exports the {@link moonstone/Marquee.Marquee} and {@link moonstone/Marquee.MarqueeBase}
 * components. The default export is {@link moonstone/Marquee.Marquee}.
 *
 * note: not jsdoc on purpose, exports in index.js
 */

import kind from '@enact/core/kind';
import {isRtlText} from '@enact/i18n';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import React from 'react';

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
		 * `true` when the component should be animating
		 *
		 * @type {Boolean}
		 * @public
		 */
		animating: React.PropTypes.bool,

		/**
		 * When `true`, the contents will be centered regardless of the text directionality.
		 *
		 * @type {Boolean}
		 * @public
		 */
		centered: React.PropTypes.bool,

		/**
		 * `children` is the text or a set of components that should be scrolled by the
		 * {@link moonstone/Marquee.Marquee} component.
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
		 * Forces the `direction` of the marquee. Valid values are `rtl` and `ltr`. This includes non-text elements as well.
		 *
		 * @type {String}
		 * @public
		 */
		forceDirection: React.PropTypes.oneOf(['rtl', 'ltr']),

		/**
		 * Callback function for when the marquee completes its animation
		 *
		 * @type {Function}
		 * @public
		 */
		onMarqueeComplete: React.PropTypes.func,

		/**
		 * Text overflow setting. Either `'clip'` or `'ellipsis'`
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
		clientStyle: ({animating, centered, children, distance, forceDirection, overflow, speed}, {rtl: contextRtl}) => {
			let rtl = isRtlText(children);

			if (forceDirection === 'rtl') {
				rtl = true;
			} else if (forceDirection === 'ltr') {
				rtl = false;
			}

			const overrideRtl = contextRtl !== rtl;

			// We only attempt to set the textAlign of this control if the locale's directionality
			// differs from the directionality of our current marqueeable control (as determined by
			// the control's content) and it will marquee.
			let textAlign = null;
			if (centered) {
				textAlign = 'center';
			} else if (overrideRtl && distance > 0) {
				if (rtl) {
					textAlign = 'right';
				} else {
					textAlign = 'left';
				}
			}

			// If the components content directionality doesn't match the context, we need to set it
			// inline
			let direction = 'inherit';
			if (overrideRtl) {
				direction = rtl ? 'rtl' : 'ltr';
			}

			const style = {
				direction,
				textAlign,
				textOverflow: overflow,
				transform: 'translateZ(0)'
			};

			if (animating) {
				const adjustedDistance = rtl ? distance : distance * -1;
				const duration = distance / speed;

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
