import kind from '@enact/core/kind';
import {forProp, forward, handle, stop} from '@enact/core/handle';
import PropTypes from 'prop-types';
import React from 'react';

import componentCss from './Marquee.module.less';

const isEventSource = (ev) => ev.target === ev.currentTarget;

const Spacing = kind({
	name: 'Spacing',

	propTypes: {
		rtl: PropTypes.bool
	},

	styles: {
		className: 'spacing',
		css: componentCss
	},

	handlers: {
		ref: (node) => {
			if (!node || !global.IntersectionObserver) return;

			const root = node.parentNode;
			new global.IntersectionObserver(function (entries, observer) {
				const {left} = entries[0].boundingClientRect;
				const offset = Math.round(left) - left;
				node.style.setProperty('--ui-marquee-offset', offset);

				observer.disconnect();
			}, {root}).observe(node);
		}
	},

	computed: {
		className: ({rtl, styler}) => styler.append({rtl})
	},

	render: (props) => {
		delete props.rtl;

		return (
			<span {...props} />
		);
	}
});

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
		 * * `spacing` - The spacing node used between the repeated content
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
		 * @type {('clip'|'ellipsis')}
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
		 * Amount of spacing, in pixels, between the instances of the content
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		spacing: PropTypes.number,

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
		spacing: 0,
		rtl: false,
		willAnimate: false
	},

	styles: {
		css: componentCss,
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
		clientClassName: ({animating, willAnimate, styler}) => styler.join({
			animate: animating,
			text: true,
			willAnimate
		}),
		clientStyle: ({alignment, animating, distance, overflow, rtl, spacing, speed}) => {
			// If the components content directionality doesn't match the context, we need to set it
			// inline
			const direction = rtl ? 'rtl' : 'ltr';
			const sideProperty = rtl ? 'left' : 'right';
			const style = {
				'--ui-marquee-spacing': spacing,
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
		},
		duplicate: ({distance, willAnimate}) => {
			return willAnimate && distance > 0;
		}
	},

	render: ({children, clientClassName, clientRef, clientStyle, duplicate, onMarqueeComplete, rtl, ...rest}) => {
		delete rest.alignment;
		delete rest.animating;
		delete rest.distance;
		delete rest.onMarqueeComplete;
		delete rest.overflow;
		delete rest.spacing;
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
					{duplicate ? (
						<Spacing rtl={rtl}>
							{children}
						</Spacing>
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
