import EnactPropTypes from '@enact/core/internal/prop-types';
import {forProp, forwardCustom, handle, stop} from '@enact/core/handle';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import {Children, Fragment} from 'react';

import componentCss from './Marquee.module.less';
import {useMarqueeAnimation} from './useMarqueeAnimation';

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
		 * Sets the value of the `aria-label` attribute for the wrapped component.
		 *
		 * @memberof ui/Marquee.MarqueeBase.prototype
		 * @type {String}
		 * @public
		 */
		'aria-label': PropTypes.string,

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
		 * @type {Object|Function}
		 * @public
		 */
		clientRef: EnactPropTypes.ref,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal elements and states of this component.
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

	functional: true,

	styles: {
		css: componentCss,
		className: 'marquee',
		publicClassNames: true
	},

	handlers: {
		applyOffset: (node, {distance, rtl, spacing}) => {
			if (!node || !global.IntersectionObserver) return;

			const root = node.parentNode;
			new global.IntersectionObserver(function (entries, observer) {
				const {left, right} = entries[0].boundingClientRect;
				const {left: rootLeft, right: rootRight} = entries[0].rootBounds;
				const scale = (root.getBoundingClientRect().width / root.offsetWidth) || 1;

				const textWidth = (rtl ? rootRight - right : left - rootLeft) / scale;
				const offset = distance - (textWidth + spacing);

				node.style.setProperty('--ui-marquee-offset', offset);

				observer.disconnect();
			}, {root}).observe(node);
		},
		onMarqueeComplete: handle(
			forProp('animating', true),
			isEventSource,
			stop,
			forwardCustom('onMarqueeComplete')
		)
	},

	computed: {
		'aria-label': ({'aria-label': aria, children, distance, willAnimate}) => {
			if (children != null && aria == null && willAnimate && distance > 0) {
				return Children.map(children, c => typeof c === 'string' && c)
					.filter(Boolean)
					.join(' ') || aria;
			} else {
				return aria;
			}
		},
		clientClassName: ({animating, willAnimate, styler}) => styler.join({
			animate: animating,
			text: true,
			willAnimate
		}),
		clientStyle: ({alignment, animating, overflow, rtl, spacing}) => {
			const direction = rtl ? 'rtl' : 'ltr';
			const rtlDirectionMultiplier = rtl ? 1 : -1;
			return {
				'--ui-marquee-spacing': spacing,
				direction,
				textAlign: alignment,
				textOverflow: overflow,
				willChange: animating ? 'transform' : undefined,
				transition: 'none'
			};
		},
		duplicate: ({distance, willAnimate}) => {
			return willAnimate && distance > 0;
		}
	},

	render: ({animating, distance, speed, applyOffset, children, clientClassName, clientRef, clientStyle, css, duplicate, onMarqueeComplete, rtl, ...rest}) => {
		delete rest.alignment;
		delete rest.animating;
		delete rest.distance;
		delete rest.onMarqueeComplete;
		delete rest.overflow;
		delete rest.spacing;
		delete rest.speed;
		delete rest.willAnimate;

		const marqueeRef = useMarqueeAnimation({animating, distance, speed, rtl});
console.log("1")
		return (
			<div {...rest} >
				<div ref={marqueeRef}>
					<div
						className={clientClassName}
						ref={clientRef}
						style={clientStyle}
						onTransitionEnd={onMarqueeComplete}

					>
						{children}
						{duplicate ? (
							<Fragment>
								<div className={css.spacing} ref={applyOffset} />
								<span dir={rtl ? "rtl" : "ltr"}>
								{children}
							</span>
							</Fragment>
						) : null}
					</div>
				</div>

			</div>
		);
	}
});

export default MarqueeBase;
export {
	MarqueeBase
};
