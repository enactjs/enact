import hoc from '@enact/core/hoc';
import {forward} from '@enact/core/handle';
import {childrenEquals} from '@enact/core/util';
import React from 'react';

import Marquee from './Marquee';
import {contextTypes} from './MarqueeController';

/**
 * Default configuration parameters for {@link moonstone/Marquee.MarqueeDecorator}
 *
 * @type {Object}
 * @memberof moonstone/Marquee.MarqueeDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Property containing the callback to stop the animation when `marqueeOn` is `'focus'`
	 *
	 * @type {String}
	 * @default 'onBlur'
	 * @memberof moonstone/Marquee.MarqueeDecorator.defaultConfig
	 */
	blur: 'onBlur',

	/**
	 * Optional CSS class to apply to the marqueed element
	 *
	 * @type {String}
	 * @default null
	 * @memberof moonstone/Marquee.MarqueeDecorator.defaultConfig
	 */
	className: null,

	/**
	 * Property containing the callback to start the animation when `marqueeOn` is `'hover'`
	 *
	 * @type {String}
	 * @default 'onMouseEnter'
	 * @memberof moonstone/Marquee.MarqueeDecorator.defaultConfig
	 */
	enter: 'onMouseEnter',

	/**
	 * Property containing the callback to start the animation when `marqueeOn` is `'focus'`
	 *
	 * @type {String}
	 * @default 'onFocus'
	 * @memberof moonstone/Marquee.MarqueeDecorator.defaultConfig
	 */
	focus: 'onFocus',

	/**
	* Invalidate the distance if any property (like 'inline') changes.
	* Expects an array of props which on change trigger invalidateMetrics.
	*
	* @type {Array}
	* @default null
	* @memberof moonstone/Marquee.MarqueeDecorator.defaultConfig
	*/
	invalidateProps: null,

	/**
	 * Property containing the callback to stop the animation when `marqueeOn` is `'hover'`
	 *
	 * @type {String}
	 * @default 'onMouseLeave'
	 * @memberof moonstone/Marquee.MarqueeDecorator.defaultConfig
	 */
	leave: 'onMouseLeave'
};

/**
 * Checks whether any of the invalidateProps has changed or not
 *
 * @param {Array} propList An array of invalidateProps
 * @param {Object} prev Previous props
 * @param {Object} next Next props
 * @returns {Boolean} `true` if any of the props changed
 * @private
 */
const didPropChange = (propList, prev, next) => {
	const hasPropsChanged = propList.map(i => prev[i] !== next[i]);
	return hasPropsChanged.indexOf(true) !== -1;
};

/**
 * {@link moonstone/Marquee.MarqueeDecorator} is a Higher-order Component which makes
 * the Wrapped component's children marquee.
 *
 * @class MarqueeDecorator
 * @memberof moonstone/Marquee
 * @hoc
 * @public
 */
const MarqueeDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {blur, className: marqueeClassName, enter, focus, invalidateProps, leave} = config;

	// Generate functions to forward events to containers
	const forwardBlur = forward(blur);
	const forwardFocus = forward(focus);
	const forwardEnter = forward(enter);
	const forwardLeave = forward(leave);

	return class extends React.Component {
		static displayName = 'MarqueeDecorator'

		static contextTypes = contextTypes

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
			 * Forces the `direction` of the marquee. Valid values are `rtl` and `ltr`. This includes non-text elements as well.
			 *
			 * @type {String}
			 * @public
			 */
			forceDirection: React.PropTypes.oneOf(['rtl', 'ltr']),

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
			 * Number of milliseconds to wait before resetting the marquee after it finishes. A
			 * minimum of 40 milliseconds is enforced.
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
			this.sync = false;

			this.invalidateMetrics();
		}

		componentDidMount () {
			if (this.context.register) {
				this.sync = true;
				this.context.register(this, {
					start: this.start,
					stop: this.stop
				});
			}

			if (this.props.marqueeOn === 'render') {
				this.startAnimation(this.props.marqueeOnRenderDelay);
			}
		}

		componentWillReceiveProps (next) {
			const {marqueeOn, marqueeDisabled, marqueeSpeed} = this.props;
			if ((!childrenEquals(this.props.children, next.children)) || (invalidateProps && didPropChange(invalidateProps, this.props, next))) {
				this.invalidateMetrics();
				this.cancelAnimation();
			} else if (next.marqueeOn !== marqueeOn || next.marqueeDisabled !== marqueeDisabled || next.marqueeSpeed !== marqueeSpeed) {
				this.cancelAnimation();
			}
		}

		componentDidUpdate () {
			if (this.shouldStartMarquee()) {
				this.startAnimation(this.props.marqueeDelay);
			}
		}

		componentWillUnmount () {
			this.clearTimeout();
			if (this.sync) {
				this.sync = false;
				this.context.unregister(this);
			}
		}

		/**
		 * Clears the timer
		 *
		 * @returns {undefined}
		 */
		clearTimeout () {
			if (window && this.timer) {
				window.clearTimeout(this.timer);
				this.timer = null;
			}
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
			return (
				!this.sync && (
					this.props.marqueeOn === 'render' ||
					(this.isFocused && this.props.marqueeOn === 'focus') ||
					(this.isHovered && this.props.marqueeOn === 'hover')
				)
			);
		}

		/**
		 * Invalidates marquee metrics requiring them to be recalculated
		 *
		 * @returns {undefined}
		 */
		invalidateMetrics () {
			// Null distance is the special value to allow recalculation
			this.distance = null;
			// Assume the marquee does not fit until calculations show otherwise
			this.contentFits = false;
		}

		/**
		* Determines if the component should marquee and the distance to animate
		*
		* @returns {undefined}
		*/
		calculateMetrics () {
			const node = this.node;

			// TODO: absolute showing check (or assume that it won't be rendered if it isn't showing?)
			if (node && this.distance == null && !this.props.disabled && !this.props.marqueeDisabled) {
				this.distance = this.calculateDistance(node);
				this.contentFits = !this.shouldAnimate(this.distance);
				if(this.sync && this.contentFits) {
					this.context.complete(this);
				}
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
		 * Starts the animation without synchronizing
		 *
		 * @param	{Number}	[delay]	Milleseconds to wait before animating
		 * @returns	{undefined}
		 */
		start = (delay = this.props.marqueeDelay) => {
			if (this.props.disabled || this.props.marqueeDisabled || this.contentFits) {
				// if marquee isn't necessary (contentFits), do not set `animating` but return
				// `true` to mark it complete if its synchronized so it doesn't block other
				// instances.
				return true;
			} else if (!this.state.animating) {
				this.setTimeout(() => {
					this.calculateMetrics();
					if (!this.contentFits) {
						this.setState({
							animating: true
						});
					}
				}, delay);
			}
		}

		/**
		 * Stops the animation
		 *
		 * @returns	{undefined}
		 */
		stop = () => {
			this.clearTimeout();
			this.setState({
				animating: false
			});
		}

		/**
		 * Starts marquee animation with synchronization
		 *
		 * @param {Number} [delay] Milleseconds to wait before animating
		 * @returns {undefined}
		 */
		startAnimation = (delay) => {
			if (this.state.animating) return;

			if (this.sync) {
				this.context.start(this);
			}

			this.start(delay);
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
			// synchronized Marquees defer to the controller to restart them
			if (this.sync) {
				this.context.complete(this);
			} else {
				this.startAnimation();
			}
		}

		/**
		 * Resets and restarts the marquee after `marqueeResetDelay` milliseconds
		 *
		 * @returns {undefined}
		 */
		resetAnimation = () => {
			const marqueeResetDelay = Math.max(40, this.props.marqueeResetDelay);
			this.setTimeout(this.restartAnimation, marqueeResetDelay);
		}

		/**
		 * Cancels the marquee
		 *
		 * @returns {undefined}
		 */
		cancelAnimation = () => {
			if (this.sync) {
				this.context.cancel(this);
			}

			this.stop();
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
				disabled,
				forceDirection,
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
						distance={this.distance}
						forceDirection={forceDirection}
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
