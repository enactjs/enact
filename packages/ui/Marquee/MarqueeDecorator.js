import direction from 'direction';
import {on, off} from '@enact/core/dispatcher';
import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {is} from '@enact/core/keymap';
import {Job} from '@enact/core/util';
import PropTypes from 'prop-types';
import React from 'react';
import shallowEqual from 'recompose/shallowEqual';

import MarqueeBase from './MarqueeBase';
import {contextTypes} from './MarqueeController';
import {ResizeContext} from '../Remeasurable';

/**
 * Default configuration parameters for {@link ui/Marquee.MarqueeDecorator}
 *
 * @type {Object}
 * @memberof ui/Marquee.MarqueeDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Property containing the callback to stop the animation when `marqueeOn` is `'focus'`
	 *
	 * @type {String}
	 * @default 'onBlur'
	 * @memberof ui/Marquee.MarqueeDecorator.defaultConfig
	 */
	blur: 'onBlur',

	/**
	 * Optional CSS class name to customize the marquee `component`
	 *
	 * @type {String}
	 * @default null
	 * @memberof ui/Marquee.MarqueeDecorator.defaultConfig
	 */
	className: null,

	/**
	 * The base marquee component wrapping the content.
	 *
	 * @type {Component}
	 * @default ui/Marquee.Marquee
	 * @memberof ui/Marquee.MarqueeDecorator.defaultConfig
	 */
	component: MarqueeBase,

	/**
	 * Property containing the callback to start the animation when `marqueeOn` is `'hover'`
	 *
	 * @type {String}
	 * @default 'onMouseEnter'
	 * @memberof ui/Marquee.MarqueeDecorator.defaultConfig
	 */
	enter: 'onMouseEnter',

	/**
	 * Property containing the callback to start the animation when `marqueeOn` is `'focus'`
	 *
	 * @type {String}
	 * @default 'onFocus'
	 * @memberof ui/Marquee.MarqueeDecorator.defaultConfig
	 */
	focus: 'onFocus',

	/**
	* Invalidate the distance if any property (like 'inline') changes.
	* Expects an array of props which on change trigger invalidateMetrics.
	*
	* @type {String[]}
	* @default ['remeasure']
	* @memberof ui/Marquee.MarqueeDecorator.defaultConfig
	*/
	invalidateProps: ['remeasure'],

	/**
	 * Property containing the callback to stop the animation when `marqueeOn` is `'hover'`
	 *
	 * @type {String}
	 * @default 'onMouseLeave'
	 * @memberof ui/Marquee.MarqueeDecorator.defaultConfig
	 */
	leave: 'onMouseLeave',

	/**
	 * A function that determines the text directionality of a string.
	 *
	 * Returns:
	 * * `'rtl'` if the text should marquee to the right
	 * * `'ltr'` if the text should marquee to the left
	 *
	 * @type {Function}
	 * @kind member
	 * @memberof ui/Marquee.MarqueeDecorator.defaultConfig
	 */
	marqueeDirection: (str) => direction(str) === 'rtl' ? 'rtl' : 'ltr'
};

/*
 * Checks whether any of the invalidateProps has changed or not
 *
 * @param {String[]} propList An array of invalidateProps
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
 * A higher-order component that provides marquee functionalities.
 *
 * @class MarqueeDecorator
 * @memberof ui/Marquee
 * @hoc
 * @public
 */
const MarqueeDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {blur, className: configClassName, component: MarqueeComponent, enter, focus, invalidateProps, leave, marqueeDirection} = config;

	// Generate functions to forward events to containers
	const forwardBlur = forward(blur);
	const forwardFocus = forward(focus);
	const forwardEnter = forward(enter);
	const forwardLeave = forward(leave);

	const determineTextDirection = (node, rtl, forceDirection) => {
		// Text directionality is a function of locale direction (rtl), content (node.textContent),
		// and props (forceDirection) in increasing order of significance.
		if (forceDirection) {
			rtl = forceDirection === 'rtl';
		} else if (node) {
			rtl = marqueeDirection(node.textContent) === 'rtl';
		}

		return rtl;
	};

	return class extends React.Component {
		static displayName = 'ui:MarqueeDecorator'

		static propTypes = /** @lends ui/Marquee.MarqueeDecorator.prototype */ {
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
			 * Passed through to the wrapped component.
			 *
			 * Does not affect Marquee behavior except that components that are `marqueeOn="focus"`
			 * will be treated as if they were `marqueeOn="hover"`, to allow disabled (and thus,
			 * unfocusable) components to marquee.
			 *
			 * @type {Boolean}
			 * @public
			 */
			disabled: PropTypes.bool,

			/**
			 * Forces the `direction` of the marquee.
			 *
			 * Valid values are `'rtl'` and `'ltr'`. This includes non-text elements as well.
			 * The default behavior, if this prop is unset, is to evaluate the text content for
			 * directionality using {@link i18n/util.isRtlText}.
			 *
			 * @type {String}
			 * @public
			 */
			forceDirection: PropTypes.oneOf(['rtl', 'ltr']),

			/**
			 * The current locale as a
			 * {@link https://tools.ietf.org/html/rfc5646|BCP 47 language tag}.
			 *
			 * @type {String}
			 * @public
			 */
			locale: PropTypes.string,

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
			 * Determines what triggers the marquee to start its animation.
			 *
			 * Valid values are `'focus'`, `'hover'` and `'render'`. The default is `'focus'`.
			 *
			 * @type {String}
			 * @default 'focus'
			 * @public
			 */
			marqueeOn: PropTypes.oneOf(['focus', 'hover', 'render']),

			/**
			 * Number of milliseconds to wait before starting marquee the first time.
			 *
			 * Has no effect if `marqueeOn` is not `'render'`
			 *
			 * @type {Number}
			 * @default 1000
			 * @public
			 */
			marqueeOnRenderDelay: PropTypes.number,

			/**
			 * Number of milliseconds to wait before resetting the marquee position after it
			 * finishes.
			 *
			 * A minimum of 40 milliseconds is enforced.
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
			 * Used to signal for a remeasurement inside of marquee.
			 *
			 * The value must change for the remeasurement to take place. The value
			 * type is `any` because it does not matter. It is only used to check for changes.
			 *
			 * @private
			 */
			remeasure: PropTypes.any,

			/**
			 * Indicates the text directionality of the current locale is right-to-left
			 *
			 * @type {String}
			 * @public
			 */
			rtl: PropTypes.bool
		}

		static contextTypes = {
			...contextTypes
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
				promoted: false,
				rtl: determineTextDirection(null, props.rtl, props.forceDirection)
			};
			this.sync = false;
			this.forceRestartMarquee = false;
			this.timerState = TimerState.CLEAR;
			this.distance = null;
			this.contentFits = false;
			this.registry = null;
		}

		componentDidMount () {
			if (this.context.register) {
				this.sync = true;
				this.context.register(this, {
					start: this.start,
					stop: this.stop
				});
			}

			this.validateTextDirection();
			if (this.props.marqueeOn === 'render') {
				this.startAnimation(this.props.marqueeOnRenderDelay);
			}
			on('keydown', this.handlePointerHide);
		}

		componentWillReceiveProps (next) {
			const {forceDirection, locale, marqueeOn, marqueeDisabled, marqueeSpeed, rtl} = this.props;
			if (
				locale !== next.locale ||
				rtl !== next.rtl ||
				!shallowEqual(this.props.children, next.children) ||
				(invalidateProps && didPropChange(invalidateProps, this.props, next))
			) {
				// restart marqueeOn="render" marquees or synced marquees that were animating
				this.forceRestartMarquee = next.marqueeOn === 'render' || (
					this.sync && (this.state.animating || this.timerState > TimerState.CLEAR)
				);

				this.invalidateMetrics();
				this.cancelAnimation();
			} else if (
				next.marqueeOn !== marqueeOn ||
				next.marqueeDisabled !== marqueeDisabled ||
				next.marqueeSpeed !== marqueeSpeed ||
				next.forceDirection !== forceDirection
			) {
				this.cancelAnimation();
			} else if (next.disabled && this.isHovered && marqueeOn === 'focus' && this.sync) {
				this.context.enter(this);
			}
		}

		shouldComponentUpdate (nextProps, nextState) {
			return (
				!shallowEqual(this.state, nextState) ||
				!shallowEqual(this.props, nextProps)
			);
		}

		componentDidUpdate () {
			this.validateTextDirection();
			if (this.shouldStartMarquee()) {
				this.tryStartingAnimation(this.props.marqueeOn === 'render' ? this.props.marqueeOnRenderDelay : this.props.marqueeDelay);
			}
			this.forceRestartMarquee = false;
		}

		componentWillUnmount () {
			this.clearTimeout();
			this.promoteJob.stop();
			this.demoteJob.stop();
			if (this.sync) {
				this.sync = false;
				this.context.unregister(this);
			}

			off('keydown', this.handlePointerHide);
		}

		promoteJob = new Job(() => {
			this.setState(state => state.promoted ? null : {promoted: true});
		})

		demoteJob = new Job(() => {
			this.setState(state => (!state.animating && state.promoted) ? {promoted: false} : null);
		})

		demote () {
			this.promoteJob.stop();
			this.demoteJob.idle();
		}

		promote (delay = this.props.marqueeDelay) {
			this.demoteJob.stop();
			this.promoteJob.startAfter(Math.max(0, delay - 200));
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
			const {disabled, marqueeDisabled, marqueeOn} = this.props;
			return !marqueeDisabled && (
				marqueeOn === 'render' ||
				this.forceRestartMarquee ||
				!this.sync && (
					(this.isFocused && marqueeOn === 'focus' && !disabled) ||
					(this.isHovered && (marqueeOn === 'hover' || marqueeOn === 'focus' && disabled))
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

			this.setState(state => {
				return state.overflow === 'ellipsis' ? null : {overflow: 'ellipsis'};
			});
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

				const overflow = this.calculateTextOverflow(this.distance);
				this.setState(state => {
					return state.overflow === overflow ? null : {overflow};
				});
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
			const distance = Math.abs(node.scrollWidth - rect.width);
			return distance;
		}

		/*
		 * A custom overflow-determining method to reflect real-world truncation/ellipsis
		 * calculation. This catches an edge case that the browser typically does not, where the
		 * size of the text area is the same size as the container (zero distance difference), but
		 * the browser still inserts an ellipsis due to a non-visible part of the last glyph's
		 * render box overflowing the parent container size.
		 * This scenario should not induce a marquee animation or ellipsis, so we directly set
		 * Marquee to not use an ellipsis, and instead just clip the non-visible part of the glyph.
		 *
		 * @param	{Number}	distance	Amount of overflow in pixels
		 * @returns	{String}				text-overflow value
		 */
		calculateTextOverflow (distance) {
			return distance < 1 ? 'clip' : 'ellipsis';
		}

		/*
		 * Calculates if the marquee should animate
		 *
		 * @param	{Number}	distance	Amount of overflow in pixels
		 * @returns	{Boolean}				`true` if it should animated
		 */
		shouldAnimate (distance) {
			return distance >= 1;
		}

		/*
		 * Starts the animation without synchronizing
		 *
		 * @param	{Number}	[delay]	Milliseconds to wait before animating
		 * @returns	{undefined}
		 */
		start = (delay = this.props.marqueeDelay) => {
			if (this.props.marqueeDisabled) {
				// if marquee isn't necessary, do not set `animating` but return `true` to mark it
				// complete if it's synchronized so it doesn't block other instances.
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
							promoted: true,
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

			if (this.state.animating) {
				this.setState({
					animating: false
				});
			}

			this.demote();
		}

		/*
		 * Starts marquee animation with synchronization, if not already animating and a timer is
		 * not already active to start.
		 *
		 * @param {Number} [delay] Milliseconds to wait before animating
		 * @returns {undefined}
		 */
		tryStartingAnimation = (delay) => {
			if (this.state.animating || this.timerState !== TimerState.CLEAR) return;

			this.startAnimation(delay);
		}

		/*
		 * Starts marquee animation with synchronization
		 *
		 * @param {Number} [delay] Milliseconds to wait before animating
		 * @returns {undefined}
		 */
		startAnimation = (delay) => {
			this.promote(delay);
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
			} else if (!this.state.animating) {
				this.startAnimation();
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
				this.context.cancel(this);
				return;
			}

			this.stop();
		}

		handleResize = () => {
			if (this.node && !this.props.marqueeDisabled) {
				this.invalidateMetrics();
				if (this.state.animating) {
					this.cancelAnimation();
					this.resetAnimation();
				}
			}
		}

		handleMarqueeComplete = () => {
			this.resetAnimation();
		}

		handleFocus = (ev) => {
			this.isFocused = true;
			if (!this.sync) {
				if (!this.state.animating) {
					this.startAnimation();
				}
			}
			forwardFocus(ev, this.props);
		}

		handleBlur = (ev) => {
			this.promoteJob.stop();
			forwardBlur(ev, this.props);
			if (this.isFocused) {
				this.isFocused = false;
				if (!this.sync &&
						!(this.isHovered && (this.props.disabled || this.props.marqueeOn === 'hover'))) {
					this.cancelAnimation();
				}
			}
		}

		handleEnter = (ev) => {
			this.isHovered = true;
			if (this.props.disabled || this.props.marqueeOn === 'hover') {
				if (this.sync) {
					this.context.enter(this);
				} else if (!this.state.animating) {
					this.startAnimation();
				}
			}
			forwardEnter(ev, this.props);
		}

		handleLeave = (ev) => {
			this.promoteJob.stop();
			this.handleUnhover();
			forwardLeave(ev, this.props);
		}

		handlePointerHide = ({keyCode}) => {
			if (is('pointerHide', keyCode)) {
				this.handleUnhover();
			}
		}

		handleUnhover () {
			this.isHovered = false;
			if (this.props.disabled || this.props.marqueeOn === 'hover') {
				if (this.sync) {
					this.context.leave(this);
				} else {
					this.cancelAnimation();
				}
			}
		}

		cacheNode = (node) => {
			this.node = node;
		}

		validateTextDirection () {
			this.setState((state, props) => {
				const rtl = determineTextDirection(this.node, props.rtl, props.forceDirection);
				return state.rtl === rtl ? null : {rtl};
			});
		}

		renderMarquee () {
			const {
				alignment,
				children,
				disabled,
				marqueeOn,
				marqueeSpeed,
				...rest
			} = this.props;

			const marqueeOnFocus = marqueeOn === 'focus';
			const marqueeOnHover = marqueeOn === 'hover';
			const marqueeOnRender = marqueeOn === 'render';

			if (marqueeOnFocus && !disabled) {
				rest[focus] = this.handleFocus;
			}

			// TODO: cancel others on hover
			if (marqueeOnHover || marqueeOnFocus) {
				rest[enter] = this.handleEnter;
				rest[leave] = this.handleLeave;
			}

			if (marqueeOnRender) {
				rest[enter] = this.handleEnter;
			}

			delete rest.forceDirection;
			delete rest.locale;
			delete rest.marqueeCentered;
			delete rest.marqueeDelay;
			delete rest.marqueeDisabled;
			delete rest.marqueeOnRenderDelay;
			delete rest.marqueeResetDelay;
			delete rest.marqueeSpeed;
			delete rest.remeasure;
			delete rest.rtl;

			return (
				<Wrapped {...rest} onBlur={this.handleBlur} disabled={disabled}>
					<MarqueeComponent
						alignment={alignment}
						animating={this.state.animating}
						className={configClassName}
						clientRef={this.cacheNode}
						distance={this.distance}
						onMarqueeComplete={this.handleMarqueeComplete}
						overflow={this.state.overflow}
						rtl={this.state.rtl}
						speed={marqueeSpeed}
						willAnimate={this.state.promoted}
					>
						{children}
					</MarqueeComponent>
				</Wrapped>
			);
		}

		renderWrapped () {
			const props = Object.assign({}, this.props);

			delete props.alignment;
			delete props.forceDirection;
			delete props.locale;
			delete props.marqueeCentered;
			delete props.marqueeDelay;
			delete props.marqueeDisabled;
			delete props.marqueeOn;
			delete props.marqueeOnRenderDelay;
			delete props.marqueeResetDelay;
			delete props.marqueeSpeed;
			delete props.remeasure;
			delete props.rtl;

			return <Wrapped {...props} />;
		}

		render () {
			return (

				<ResizeContext.Consumer>
					{(value) => {
						if (!this.registry && value) {
							this.registry = value;
							this.registry.register(this.handleResize);
						}

						if (this.props.marqueeDisabled) {
							return this.renderWrapped();
						} else {
							return this.renderMarquee();
						}
					}}
				</ResizeContext.Consumer>
			);
		}
	};
});

export default MarqueeDecorator;
export {
	MarqueeDecorator
};
