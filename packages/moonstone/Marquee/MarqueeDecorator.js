import hoc from '@enact/core/hoc';
import {forward} from '@enact/core/handle';
import {childrenEquals} from '@enact/core/util';
import React from 'react';

import Marquee from './Marquee';

/**
 * Default configuration parameters for {@link moonstone/Marquee.MarqueeDecorator}
 *
 * @type {Object}
 * @memberof moonstone/marquee
 */
const defaultConfig = {
	/**
	 * Property containing the callback to stop the animation when `marqueeOn` is 'focus'
	 *
	 * @type {String}
	 * @default 'onBlur'
	 */
	blur: 'onBlur',

	/**
	 * Optional CSS class to apply to the marqueed element
	 *
	 * @type {String}
	 * @default null
	 */
	className: null,

	/**
	 * Property containing the callback to start the animation when `marqueeOn` is 'hover'
	 *
	 * @type {String}
	 * @default 'onMouseEnter'
	 */
	enter: 'onMouseEnter',

	/**
	 * Property containing the callback to start the animation when `marqueeOn` is 'focus'
	 *
	 * @type {String}
	 * @default 'onFocus'
	 */
	focus: 'onFocus',

	/**
	 * Property containing the callback to stop the animation when `marqueeOn` is 'hover'
	 *
	 * @type {String}
	 * @default 'onMouseLeave'
	 */
	leave: 'onMouseLeave'
};

/**
 * {@link moonstone/Marquee.MarqueeDecorator} is a Higher-order Component which makes
 * the Wrapped component's children marquee.
 *
 * @class MarqueeDecorator
 * @memberof moonstone/marquee
 * @hoc
 * @public
 */
const MarqueeDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {blur, className: marqueeClassName, enter, focus, leave} = config;

	// Generate functions to forward events to containers
	const forwardBlur = forward(blur);
	const forwardFocus = forward(focus);
	const forwardEnter = forward(enter);
	const forwardLeave = forward(leave);

	return class extends React.Component {
		static displayName = 'MarqueeDecorator'

		static propTypes = /** @lends moonstone/Marquee.MarqueeDecorator.prototype */ {
			/**
			 * Children to be marqueed
			 *
			 * @type {Node}
			 * @public
			 */
			children: React.PropTypes.node,

			/**
			 * Disables all marquee behavior except when `marqueeOn` is 'hover'. Will be forwarded
			 * onto the wrapped component as well.
			 *
			 * @type {Boolean}
			 * @public
			 */
			disabled: React.PropTypes.bool,

			/**
			 * When set to `true` marquee will be shown with RTL styling.
			 *
			 * @type {Boolean}
			 * @public
			 */
			forceRTL: React.PropTypes.bool,

			/**
			 * When `true`, the contents will be centered regardless of the text directionality.
			 *
			 * @type {Boolean}
			 * @public
			 */
			marqueeCentered: React.PropTypes.bool,

			/**
			 * Number of milliseconds to wait before starting marquee when `marqueeOn` is 'hover' or
			 * 'focus' or before restarting any marquee.
			 *
			 * @type {Number}
			 * @default 1000
			 * @public
			 */
			marqueeDelay: React.PropTypes.number,

			/**
			 * Disables all marquee behavior and removes supporting markup.
			 *
			 * @type {Boolean}
			 */
			marqueeDisabled: React.PropTypes.bool,

			/**
			 * Determines what trigger the marquee to start its animation
			 *
			 * @type {String}
			 * @default 'focus'
			 * @public
			 */
			marqueeOn: React.PropTypes.oneOf(['focus', 'hover', 'render']),

			/**
			 * Number of milliseconds to wait before starting marquee the first time. Has no effect
			 * if `marqueeOn` is not 'render'
			 *
			 * @type {Number}
			 * @default 1000
			 * @public
			 */
			marqueeOnRenderDelay: React.PropTypes.number,

			/**
			 * Number of milliseconds to wait before resetting the marquee after it finishes.
			 *
			 * @type {Number}
			 * @default 1000
			 * @public
			 */
			marqueeResetDelay: React.PropTypes.number,

			/**
			 * Rate of marquee measured in pixels/second.
			 *
			 * @type {Number}
			 * @default 60
			 * @public
			 */
			marqueeSpeed: React.PropTypes.number
		}

		static defaultProps = {
			marqueeDelay: 1000,
			marqueeOn: 'focus',
			marqueeOnRenderDelay: 1000,
			marqueeResetDelay: 1000,
			marqueeSpeed: 60
		}

		constructor (props) {
			super(props);
			this.state = {
				overflow: 'ellipsis'
			};

			this.invalidateMetrics();
		}

		componentDidMount () {
			this.initMarquee(this.props.marqueeOnRenderDelay);
		}

		componentWillReceiveProps (next) {
			const {marqueeOn, marqueeDisabled} = this.props;
			if (!childrenEquals(this.props.children, next.children)) {
				this.invalidateMetrics();
				this.cancelAnimation();
			} else if (next.marqueeOn !== marqueeOn || next.marqueeDisabled !== marqueeDisabled) {
				this.cancelAnimation();
			}
		}

		componentDidUpdate () {
			this.initMarquee(this.props.marqueeDelay);
		}

		componentWillUnmount () {
			this.clearTimeout();
		}

		/**
		 * Clears the timer
		 *
		 * @returns {undefined}
		 */
		clearTimeout () {
			if (window) {
				window.clearTimeout(this.timer);
			}
			this.timer = null;
		}

		/**
		 * Starts a new timer
		 *
		 * @param {Function} fn   Callback
		 * @param {Number}   time Delay in milliseconds
		 * @returns {undefined}
		 */
		setTimeout (fn, time) {
			this.clearTimeout();
			if (window) {
				this.timer = window.setTimeout(fn, time);
			}
		}

		/**
		 * Checks to see if the children changed during a condition that should cause us to re-check
		 * the animation state
		 *
		 * @returns {Boolean} - `true` if a possible marquee condition exists
		 */
		shouldStartMarquee () {
			return	this.distance === null && !this.props.disabled && !this.props.marqueeDisabled &&
					this.props.marqueeOn === 'render' ||
					(this.isFocused && this.props.marqueeOn === 'focus') ||
					(this.isHovered && this.props.marqueeOn === 'hover');
		}

		/**
		 * Initializes the marquee by calculating the distance and conditionally starting the
		 * animation
		 *
		 * @param {Number} delay Milliseconds until animation should start
		 * @returns {undefined}
		 */
		initMarquee (delay) {
			// shouldStartMarquee relies on a `null` distance to indicate the metrics have been
			// invalidated so we have to calculate after this check.
			if (this.shouldStartMarquee()) {
				this.calculateMetrics();
				this.startAnimation(delay);
			} else {
				this.calculateMetrics();
			}
		}

		/**
		 * Invalidates marquee metrics requiring them to be recalculated
		 *
		 * @returns {undefined}
		 */
		invalidateMetrics () {
			// Null distance is the special value to allow recalculation
			this.distance = null;
			// Assume the marquee fits until calculations show otherwise
			this.contentFits = true;
		}

		/**
		* Determines if the component should marquee and the distance to animate
		*
		* @returns {undefined}
		*/
		calculateMetrics () {
			const node = this.node;

			// TODO: absolute showing check (or assume that it won't be rendered if it isn't showing?)
			if (node && this.distance == null) {
				this.distance = this.calculateDistance(node);
				this.contentFits = !this.shouldAnimate(this.distance);
				this.setState({
					overflow: this.calculateTextOverflow(this.distance)
				});
			}
		}

		/**
		 * Calculates the distance the marquee must travel to reveal all of the content
		 *
		 * @param	{DOMNode}	node	DOM Node to measure
		 * @returns	{Number}			Distance to travel in pixels
		 */
		calculateDistance (node) {
			const rect = node.getBoundingClientRect();
			const distance = Math.floor(Math.abs(node.scrollWidth - rect.width));

			return distance;
		}

		/**
		 * Calculates the text overflow to use to correctly render the ellipsis. If the distance is
		 * exactly 0, then the ellipsis is most likely hiding the content, and marquee does not need
		 * to animate.
		 *
		 * @param	{Number}	distance	Amount of overflow in pixels
		 * @returns	{String}				text-overflow value
		 */
		calculateTextOverflow (distance) {
			return distance === 0 ? 'clip' : 'ellipsis';
		}

		/**
		 * Calculates if the marquee should animate
		 *
		 * @param	{Number}	distance	Amount of overflow in pixels
		 * @returns	{Boolean}				`true` if it should animated
		 */
		shouldAnimate (distance) {
			return distance > 0;
		}

		/**
		* Starts marquee animation.
		*
		* @param {Number} [delay] Milleseconds to wait before animating
		* @returns {undefined}
		*/
		startAnimation = (delay = this.props.marqueeDelay) => {
			if (this.state.animating || this.contentFits) return;

			this.setTimeout(() => {
				this.setState({
					animating: true
				});
			}, delay);
		}

		/**
		 * Resets the marquee and restarts it after `marqueeDelay` millisecons.
		 *
		 * @returns {undefined}
		 */
		restartAnimation = () => {
			this.setState({
				animating: false
			});
			this.startAnimation();
		}

		/**
		 * Resets and restarts the marquee after `marqueeResetDelay` milliseconds
		 *
		 * @returns {undefined}
		 */
		resetAnimation = () => {
			this.setTimeout(this.restartAnimation, this.props.marqueeResetDelay);
		}

		/**
		 * Cancels the marquee
		 *
		 * @returns {undefined}
		 */
		cancelAnimation = () => {
			this.clearTimeout();
			this.setState({
				animating: false
			});
		}

		handleMarqueeComplete = (ev) => {
			this.resetAnimation();
			ev.stopPropagation();
		}

		handleFocus = (ev) => {
			this.isFocused = true;
			this.startAnimation();
			forwardFocus(ev, this.props);
		}

		handleBlur = (ev) => {
			this.isFocused = false;
			this.cancelAnimation();
			forwardBlur(ev, this.props);
		}

		handleEnter = (ev) => {
			this.isHovered = true;
			this.startAnimation();
			forwardEnter(ev, this.props);
		}

		handleLeave = (ev) => {
			this.isHovered = false;
			this.cancelAnimation();
			forwardLeave(ev, this.props);
		}

		cacheNode = (node) => {
			this.node = node;
		}

		renderMarquee () {
			const {
				children,
				forceRTL,
				disabled,
				marqueeCentered,
				marqueeOn,
				marqueeSpeed,
				...rest
			} = this.props;

			const marqueeOnFocus = marqueeOn === 'focus';
			const marqueeOnHover = marqueeOn === 'hover';

			if (marqueeOnFocus && !disabled) {
				rest[focus] = this.handleFocus;
				rest[blur] = this.handleBlur;
			}

			// TODO: cancel others on hover
			if (marqueeOnHover || (disabled && marqueeOnFocus)) {
				rest[enter] = this.handleEnter;
				rest[leave] = this.handleLeave;
			}

			delete rest.marqueeDelay;
			delete rest.marqueeDisabled;
			delete rest.marqueeOnRenderDelay;
			delete rest.marqueeResetDelay;
			delete rest.marqueeSpeed;

			return (
				<Wrapped {...rest} disabled={disabled}>
					<Marquee
						animating={this.state.animating}
						centered={marqueeCentered}
						className={marqueeClassName}
						clientRef={this.cacheNode}
						forceRTL={forceRTL}
						distance={this.distance}
						onMarqueeComplete={this.handleMarqueeComplete}
						overflow={this.state.overflow}
						speed={marqueeSpeed}
					>
						{children}
					</Marquee>
				</Wrapped>
			);
		}

		renderWrapped () {
			const props = Object.assign({}, this.props);

			delete props.marqueeCentered;
			delete props.marqueeDelay;
			delete props.marqueeDisabled;
			delete props.marqueeOn;
			delete props.marqueeOnRenderDelay;
			delete props.marqueeResetDelay;
			delete props.marqueeSpeed;

			return <Wrapped {...props} />;
		}

		render () {
			if (this.props.marqueeDisabled) {
				return this.renderWrapped();
			} else {
				return this.renderMarquee();
			}
		}
	};

});

export default MarqueeDecorator;
export {MarqueeDecorator};
