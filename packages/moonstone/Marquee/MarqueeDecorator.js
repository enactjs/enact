import deprecate from '@enact/core/internal/deprecate';
import hoc from '@enact/core/hoc';
import {forward} from '@enact/core/handle';
import {childrenEquals} from '@enact/core/util';
import {isRtlText} from '@enact/i18n/util';
import React from 'react';
import PropTypes from 'prop-types';

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
	* @default ['remeasure']
	* @memberof moonstone/Marquee.MarqueeDecorator.defaultConfig
	*/
	invalidateProps: ['remeasure'],

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

/*
 * There's only one timer shared for Marquee so we need to keep track of what we may be using it
 * for. We may need to clean up certain things as we move among states.
 */
const TimerState = {
	CLEAR: 0,				// No timers pending
	START_PENDING: 1,		// A start request is pending
	RESET_PENDING: 2,		// Marquee finished, waiting for reset delay
	SYNCSTART_PENDING: 3	// Waiting to alert Controller that we want to start marqueeing
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
			 * Text alignment value of the marquee. Valid values are `'left'`, `'right'` and `'center'`.
			 *
			 * @type {String}
			 * @public
			 */
			alignment: PropTypes.oneOf(['left', 'right', 'center']),

			/**
			 * Children to be marqueed
			 *
			 * @type {Node}
			 * @public
			 */
			children: PropTypes.node,

			/**
			 * Disables all marquee behavior except when `marqueeOn` is `'hover'` or `'focus'`. Will
			 * be forwarded onto the wrapped component as well.
			 *
			 * @type {Boolean}
			 * @public
			 */
			disabled: PropTypes.bool,

			/**
			 * Forces the `direction` of the marquee. Valid values are `'rtl'` and `'ltr'`. This
			 * includes non-text elements as well. The default behavior, if this prop is unset, is
			 * to evaluate the text content for directionality using {@link i18n/util.isRtlText}.
			 *
			 * @type {String}
			 * @public
			 */
			forceDirection: PropTypes.oneOf(['rtl', 'ltr']),

			/**
			 * When `true`, the contents will be centered regardless of the text directionality.
			 *
			 * @type {Boolean}
			 * @public
			 * @deprecated replaced by `alignment`
			 */
			marqueeCentered: PropTypes.bool,

			/**
			 * Number of milliseconds to wait before starting marquee when `marqueeOn` is `'hover'` or
			 * `'focus'` or before restarting any marquee.
			 *
			 * @type {Number}
			 * @default 1000
			 * @public
			 */
			marqueeDelay: PropTypes.number,

			/**
			 * Disables all marquee behavior and removes supporting markup.
			 *
			 * @type {Boolean}
			 */
			marqueeDisabled: PropTypes.bool,

			/**
			 * Determines what triggers the marquee to start its animation. Valid values are
			 * `'focus'`, `'hover'` and `'render'`. The default is `'focus'`.
			 *
			 * @type {String}
			 * @default 'focus'
			 * @public
			 */
			marqueeOn: PropTypes.oneOf(['focus', 'hover', 'render']),

			/**
			 * Number of milliseconds to wait before starting marquee the first time. Has no effect
			 * if `marqueeOn` is not `'render'`
			 *
			 * @type {Number}
			 * @default 1000
			 * @public
			 */
			marqueeOnRenderDelay: PropTypes.number,

			/**
			 * Number of milliseconds to wait before resetting the marquee position after it
			 * finishes. A minimum of 40 milliseconds is enforced.
			 *
			 * @type {Number}
			 * @default 1000
			 * @public
			 */
			marqueeResetDelay: PropTypes.number,

			/**
			 * Rate of marquee measured in pixels/second.
			 *
			 * @type {Number}
			 * @default 60
			 * @public
			 */
			marqueeSpeed: PropTypes.number,

			/**
			 * Used to signal for a remeasurement inside of marquee. The value
			 * must change for the remeasurement to take place. The value
			 * type is `any` because it does not matter. It is only used to
			 * check for changes.
			 *
			 * @private
			 */
			remeasure: PropTypes.any
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
				animating: false,
				overflow: 'ellipsis',
				rtl: null
			};
			this.sync = false;
			this.forceRestartMarquee = false;
			this.timerState = TimerState.CLEAR;

			this.invalidateMetrics();

			if (this.props.marqueeCentered) {
				deprecate({name: 'marqueeCentered', since: '1.7.0', message: 'Use `alignment` instead', until: '2.0.0'});
			}
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
			const {forceDirection, marqueeOn, marqueeDisabled, marqueeSpeed} = this.props;
			if (forceDirection !== next.forceDirection) {
				this.setState({rtl: next.forceDirection ? (next.forceDirection === 'rtl') : null});
			}
			if ((!childrenEquals(this.props.children, next.children)) || (invalidateProps && didPropChange(invalidateProps, this.props, next))) {
				this.invalidateMetrics();
				this.cancelAnimation();
				this.setState({rtl: null});
			} else if (next.marqueeOn !== marqueeOn || next.marqueeDisabled !== marqueeDisabled || next.marqueeSpeed !== marqueeSpeed) {
				this.cancelAnimation();
			}
		}

		componentDidUpdate () {
			if (this.state.rtl == null) {
				const rtl = this.checkRtl();
				// eslint-disable-next-line react/no-did-update-set-state
				this.setState({rtl});
			}
			if (this.distance === null) {
				this.calculateMetrics();
			}
			if (this.shouldStartMarquee()) {
				this.tryStartingAnimation(this.props.marqueeOn === 'render' ? this.props.marqueeOnRenderDelay : this.props.marqueeDelay);
			}
			this.forceRestartMarquee = false;
		}

		componentWillUnmount () {
			this.clearTimeout();
			if (this.sync) {
				this.sync = false;
				this.context.unregister(this);
			}
		}

		/*
		 * Clears the timer
		 *
		 * @returns {undefined}
		 */
		clearTimeout () {
			if (window && this.timer) {
				window.clearTimeout(this.timer);
				this.timer = null;
			}
			this.timerState = TimerState.CLEAR;
		}

		/*
		 * Starts a new timer
		 *
		 * @param {Function} fn   Callback
		 * @param {Number}   time Delay in milliseconds
		 * @returns {undefined}
		 */
		setTimeout (fn, time = 0, state = TimerState.CLEAR) {
			this.clearTimeout();
			if (window) {
				this.timerState = state;
				this.timer = window.setTimeout(() => {
					this.timerState = TimerState.CLEAR;
					fn();
				}, time);
			}
		}

		/*
		 * Checks to see if the children changed during a condition that should cause us to re-check
		 * the animation state
		 *
		 * @returns {Boolean} - `true` if a possible marquee condition exists
		 */
		shouldStartMarquee () {
			return (
				// restart un-synced marquees or marqueeOn="render" synced marquees that were
				// cancelled due to a prop change
				(!this.sync || this.forceRestartMarquee) && (
					this.props.marqueeOn === 'render' ||
					(this.isFocused && this.props.marqueeOn === 'focus') ||
					(this.isHovered && this.props.marqueeOn === 'hover')
				)
			);
		}

		/*
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

		/*
		* Determines if the component should marquee and the distance to animate
		*
		* @returns {undefined}
		*/
		calculateMetrics () {
			const node = this.node;

			// TODO: absolute showing check (or assume that it won't be rendered if it isn't showing?)
			if (node && this.distance == null && !this.props.marqueeDisabled) {
				this.distance = this.calculateDistance(node);
				this.contentFits = !this.shouldAnimate(this.distance);
				this.setState({overflow: this.calculateTextOverflow(this.distance)});
			}
		}

		/*
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

		/*
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

		/*
		 * Calculates if the marquee should animate
		 *
		 * @param	{Number}	distance	Amount of overflow in pixels
		 * @returns	{Boolean}				`true` if it should animated
		 */
		shouldAnimate (distance) {
			return distance > 0;
		}

		/*
		 * Starts the animation without synchronizing
		 *
		 * @param	{Number}	[delay]	Milliseconds to wait before animating
		 * @returns	{undefined}
		 */
		start = (delay = this.props.marqueeDelay) => {
			if (this.props.marqueeDisabled || this.contentFits) {
				// if marquee isn't necessary (contentFits), do not set `animating` but return
				// `true` to mark it complete if its synchronized so it doesn't block other
				// instances.
				return true;
			} else if (!this.state.animating) {
				// Don't need to worry about this.timerState because if we're sync, we were just
				// told to start, so our state is correct already. If we're not sync, this will
				// restart us anyhow. If we were waiting to tell sync to start us, someone else in
				// our group already did it.
				this.setTimeout(() => {
					this.calculateMetrics();
					if (!this.contentFits) {
						this.setState({
							animating: true
						});
					} else if (this.sync) {
						this.context.complete(this);
					}
				}, delay, TimerState.START_PENDING);
			}
		}

		/*
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

		/*
		 * Starts marquee animation with synchronization, if not already animating
		 *
		 * @param {Number} [delay] Milliseconds to wait before animating
		 * @returns {undefined}
		 */
		tryStartingAnimation = (delay) => {
			if (this.state.animating) return;

			this.startAnimation(delay);
		}

		/*
		 * Starts marquee animation with synchronization
		 *
		 * @param {Number} [delay] Milliseconds to wait before animating
		 * @returns {undefined}
		 */
		startAnimation = (delay) => {
			if (this.sync) {
				// If we're running a timer for anything, we should let that finish, unless it's
				// another syncstart request.  We should probably check to see if the start request
				// is further in the future than we are so we can choose the nearer one. But, we're
				// assuming the condition is we're waiting on render delay and someone just hovered
				// us, so we can start with the (hopefully) faster hover delay.
				if (this.timerState !== TimerState.CLEAR &&
						this.timerState !== TimerState.SYNCSTART_PENDING) {
					return;
				}
				this.setTimeout(() => {
					this.context.start();
				}, delay, TimerState.SYNCSTART_PENDING);
			} else {
				this.start(delay);
			}
		}

		/*
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
				this.setState((prevState) => {
					if (!prevState.animating) {
						this.startAnimation();
					}
					return null;
				});
			}
		}

		/*
		 * Resets and restarts the marquee after `marqueeResetDelay` milliseconds
		 *
		 * @returns {undefined}
		 */
		resetAnimation = () => {
			const marqueeResetDelay = Math.max(40, this.props.marqueeResetDelay);
			// If we're already timing a start action, don't reset.  Start actions will clear us if
			// sync.
			if (this.timerState === TimerState.CLEAR) {
				this.setTimeout(this.restartAnimation, marqueeResetDelay, TimerState.RESET_PENDING);
			}
		}

		/*
		 * Cancels the marquee
		 *
		 * @returns {undefined}
		 */
		cancelAnimation = () => {
			if (this.sync) {
				this.forceRestartMarquee = true;
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
			this.setState((prevState) => {
				if (!prevState.animating) {
					this.startAnimation();
				}
				return null;
			});
			forwardFocus(ev, this.props);
		}

		handleBlur = (ev) => {
			this.isFocused = false;
			this.cancelAnimation();
			forwardBlur(ev, this.props);
		}

		handleEnter = (ev) => {
			this.isHovered = true;
			this.setState((prevState) => {
				if (!prevState.animating) {
					this.startAnimation();
				}
				return null;
			});
			forwardEnter(ev, this.props);
		}

		handleLeave = (ev) => {
			this.isHovered = false;
			this.cancelAnimation();
			forwardLeave(ev, this.props);
		}

		cacheNode = (node) => {
			this.node = node;
			this.setState({rtl: this.checkRtl()});
		}

		checkRtl = () => {
			const {forceDirection} = this.props;
			const textContent = this.node && this.node.textContent;
			// If forceDirection is set, check if it is RTL; otherwise, determine the directionality
			return (forceDirection ? (forceDirection === 'rtl') : isRtlText(textContent));
		}

		renderMarquee () {
			const {
				alignment,
				children,
				disabled,
				forceDirection,
				marqueeOn,
				marqueeSpeed,
				...rest
			} = this.props;

			const marqueeOnFocus = marqueeOn === 'focus';
			const marqueeOnHover = marqueeOn === 'hover';
			const marqueeOnRender = marqueeOn === 'render';

			if (marqueeOnFocus && !disabled) {
				rest[focus] = this.handleFocus;
				rest[blur] = this.handleBlur;
			}

			// TODO: cancel others on hover
			if (marqueeOnHover || (disabled && marqueeOnFocus)) {
				rest[enter] = this.handleEnter;
				rest[leave] = this.handleLeave;
			}

			if (marqueeOnRender) {
				rest[enter] = this.handleEnter;
			}

			delete rest.marqueeCentered;
			delete rest.marqueeDelay;
			delete rest.marqueeDisabled;
			delete rest.marqueeOnRenderDelay;
			delete rest.marqueeResetDelay;
			delete rest.marqueeSpeed;
			delete rest.remeasure;

			return (
				<Wrapped {...rest} disabled={disabled}>
					<Marquee
						alignment={alignment}
						animating={this.state.animating}
						className={marqueeClassName}
						clientRef={this.cacheNode}
						distance={this.distance}
						forceDirection={forceDirection}
						onMarqueeComplete={this.handleMarqueeComplete}
						overflow={this.state.overflow}
						rtl={this.state.rtl}
						speed={marqueeSpeed}
					>
						{children}
					</Marquee>
				</Wrapped>
			);
		}

		renderWrapped () {
			const props = Object.assign({}, this.props);

			delete props.alignment;
			delete props.marqueeCentered;
			delete props.marqueeDelay;
			delete props.marqueeDisabled;
			delete props.marqueeOn;
			delete props.marqueeOnRenderDelay;
			delete props.marqueeResetDelay;
			delete props.marqueeSpeed;
			delete props.remeasure;

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
