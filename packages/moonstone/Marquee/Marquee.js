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
		className: React.PropTypes.string,
		clientRef: React.PropTypes.func,

		onMarqueeComplete: React.PropTypes.func,

		/**
		 * `children` is the text or components that should be scrolled by the
		 * {@link module:@enact/moonstone/Marquee~Marquee} component.
		 * This prop may be empty in some cases, which is OK.
		 *
		 * @type {Node|Node[]}
		 */
		children: React.PropTypes.node,

		animating: React.PropTypes.bool,
		distance: React.PropTypes.number,
		overflow: React.PropTypes.string,
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
