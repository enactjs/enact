/* global ResizeObserver */

import {on, off} from '@enact/core/dispatcher';
import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {is} from '@enact/core/keymap';
import {checkPropTypes, Job, setDefaultProps, shallowEqual} from '@enact/core/util';
import {isRtlText} from '@enact/i18n/util';
import PropTypes from 'prop-types';
import {memo, use, useLayoutEffect, useRef, useState} from 'react';
import {flushSync} from 'react-dom';
import warning from 'warning';

import {scale} from '../resolution';
import {ResizeContext} from '../Resizable';

import MarqueeBase from './MarqueeBase';
import {MarqueeControllerContext} from './MarqueeController';
import {mergeCss} from './utils';
import {cloneContentInto, measureNode, prefersReducedMotion, round2} from './verticalMeasure';

import componentCss from './Marquee.module.less';

// The minimum number of milliseconds to wait before resetting the marquee position after it finishes.
const MINIMUM_MARQUEE_RESET_DELAY = 40;

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
	 * The base marquee component wrapping the content.
	 *
	 * @type {Component}
	 * @default ui/Marquee.Marquee
	 * @memberof ui/Marquee.MarqueeDecorator.defaultConfig
	 */
	component: MarqueeBase,

	/**
	 * Customizes the component by mapping the supplied collection of CSS class names to the
	 * corresponding internal elements and states of this component.
	 *
	 * The following classes are supported:
	 *
	 * * `marquee` - The root component class
	 * * `animate` - Applied to the inner content node when the text is animating
	 * * `content` - The content node of a vertical marquee
	 * * `spacing` - The spacing node used between the repeated content
	 * * `text` - The inner content node
	 * * `vertical` - The root modifier for a vertical marquee
	 * * `willAnimate` - Applied to the inner content node shortly before animation
	 *
	 * @type {Object}
	 * @default null
	 * @memberof ui/Marquee.MarqueeDecorator.defaultConfig
	 */
	css: null,

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
	marqueeDirection: (str) => isRtlText(str) ? 'rtl' : 'ltr',

	/**
	 * Direction the marquee scrolls.
	 *
	 * `'vertical'` scrolls overflowing wrapped text by its laid-out block height.
	 * `'horizontal'` is the single-line marquee.
	 *
	 * This is a config option rather than a prop so a wrapped component can keep its own
	 * `orientation` prop.
	 *
	 * @type {('horizontal'|'vertical')}
	 * @default 'horizontal'
	 * @memberof ui/Marquee.MarqueeDecorator.defaultConfig
	 */
	orientation: 'horizontal'
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

const marqueeDefaultProps = {
	marqueeDelay: 1000,
	marqueeMaxLines: 3,
	marqueeOn: 'focus',
	marqueeOnRenderDelay: 1000,
	marqueeResetDelay: 1000,
	marqueeSpacing: '50%',
	marqueeSpeed: 60
};

/*
 * Class `setState` merges a partial update and skips the render when the updater returns null.
 * `useState` replaces state, so mirror that merge here.
 */
const mergeState = (setState) => (updater) => {
	setState(prev => {
		const partial = typeof updater === 'function' ? updater(prev) : updater;
		if (partial == null) return prev;

		const next = {...prev, ...partial};
		const keys = Object.keys(partial);
		for (let i = 0; i < keys.length; i++) {
			if (!Object.is(prev[keys[i]], next[keys[i]])) return next;
		}
		return prev;
	});
};

/**
 * A higher-order component that provides marquee functionalities.
 *
 * Note: This HoC passes additional properties to the wrapped component and wraps the `children`
 * prop with an additional component necessary for rendering the marquee.
 *
 * @class MarqueeDecorator
 * @memberof ui/Marquee
 * @hoc
 * @public
 */
const MarqueeDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {blur, component: MarqueeComponent, css, enter, focus, invalidateProps, leave, marqueeDirection, orientation} = config;
	const vertical = orientation === 'vertical';

	// Generate functions to forward events to containers
	const forwardBlur = forward(blur);
	const forwardFocus = forward(focus);
	const forwardEnter = forward(enter);
	const forwardLeave = forward(leave);

	const determineTextDirection = (node, rtl, forceDirection) => {
		// Text directionality is a function of locale direction (rtl), content (node.textContent),
		// and props (forceDirection) in increasing order of significance.
		if (forceDirection) {
			rtl = forceDirection === 'locale' ? rtl : forceDirection === 'rtl';
		} else if (node) {
			rtl = marqueeDirection(node.textContent) === 'rtl';
		}

		return rtl;
	};

	/*
	 * Mutable instance carried across renders. It replaces the class fields: measurement results,
	 * timers, hover/focus flags, and the identity registered with MarqueeController.
	 */
	function createMarquee (setState) {
		const inst = {
			sync: false,
			timerState: TimerState.CLEAR,
			timer: null,
			distance: null,
			contentFits: null,
			resizeRegistry: null,
			resizeObserver: null,
			hasStartedRender: false,
			clipHeight: 0,
			measuredLayout: null,
			measurer: null,
			duplicateNode: null,
			removeFonts: null,
			node: null,
			isFocused: false,
			isHovered: false,
			committed: false,
			prevProps: null,
			props: null,
			state: null,
			context: null,
			resizeRegister: null
		};

		inst.setMergedState = mergeState(setState);

		inst.promoteJob = new Job(() => {
			if (inst.contentFits === false) {
				inst.setMergedState(state => state.promoted ? null : {promoted: true});
			}
		});

		inst.demoteJob = new Job(() => {
			inst.setMergedState(state => (!state.animating && state.promoted) ? {promoted: false} : null);
		});

		inst.demote = () => {
			inst.promoteJob.stop();
			if (inst.state.promoted) {
				inst.demoteJob.idle();
			}
		};

		inst.promote = (delay = inst.props.marqueeDelay) => {
			inst.demoteJob.stop();
			inst.promoteJob.startAfter(Math.max(0, delay - 200));
		};

		/*
		 * Clears the timer
		 *
		 * @returns {undefined}
		 */
		inst.clearTimeout = () => {
			if (window && inst.timer) {
				window.clearTimeout(inst.timer);
				inst.timer = null;
			}
			inst.timerState = TimerState.CLEAR;
		};

		/*
		 * Starts a new timer
		 *
		 * @param {Function} fn   Callback
		 * @param {Number}   time Delay in milliseconds
		 * @returns {undefined}
		 */
		inst.setTimeout = (fn, time = 0, timerState = TimerState.CLEAR) => {
			inst.clearTimeout();
			if (window) {
				inst.timerState = timerState;
				inst.timer = window.setTimeout(() => {
					inst.timerState = TimerState.CLEAR;
					fn();
				}, time);
			}
		};

		/*
		 * Checks to see if the children changed during a condition that should cause us to re-check
		 * the animation state
		 *
		 * @returns {Boolean} - `true` if a possible marquee condition exists
		 */
		inst.shouldStartMarquee = () => {
			const {disabled, marqueeDisabled, marqueeOn} = inst.props;
			return !marqueeDisabled && (
				(marqueeOn === 'render' && !inst.hasStartedRender) ||
				!inst.sync && (
					(inst.isFocused && marqueeOn === 'focus' && !disabled) ||
					(inst.isHovered && (marqueeOn === 'hover' || marqueeOn === 'focus' && disabled))
				)
			);
		};

		/*
		 * Invalidates marquee metrics requiring them to be recalculated
		 *
		 * @returns {undefined}
		 */
		inst.invalidateMetrics = () => {
			inst.spacing = 0;
			// Null distance is the special value to allow recalculation
			inst.distance = null;
			// Assume the marquee does not fit until calculations show otherwise
			inst.contentFits = null;

			inst.setMergedState(state => {
				if (state.overflow === 'ellipsis' && state.promoted === false) return null;

				return {
					overflow: 'ellipsis',
					promoted: false
				};
			});
		};

		inst.moveChildren = (from, to) => {
			while (from.childNodes.length) {
				to.appendChild(from.childNodes.item(0));
			}
		};

		inst.measureWidths = () => {
			if (inst.node.querySelector(`.${componentCss.marquee}`)) {
				warning(false, 'Marquee should not be nested inside another Marquee');

				return {scrollWidth: inst.node.scrollWidth, width: inst.node.getBoundingClientRect().width};
			}

			// move all the children into the wrapper node ...
			const wrapper = document.createElement('span');
			inst.moveChildren(inst.node, wrapper);
			inst.node.appendChild(wrapper);

			// measure it to find the precise floating point width of the content ...
			const {width: scrollWidth} = wrapper.getBoundingClientRect();
			const {width} = inst.node.getBoundingClientRect();

			// and move all the children back and remove the wrapper
			inst.node.removeChild(wrapper);
			inst.moveChildren(wrapper, inst.node);

			return {scrollWidth, width};
		};

		inst.isVertical = () => vertical;

		inst.visibleLines = () => {
			const {marqueeMaxLines} = inst.props;
			return Number.isFinite(marqueeMaxLines) && marqueeMaxLines > 0 ? Math.floor(marqueeMaxLines) : 1;
		};

		inst.cacheMeasurer = (node) => {
			inst.measurer = node;
		};

		inst.cacheDuplicate = (node) => {
			inst.duplicateNode = node;
		};

		inst.watchFonts = () => {
			const fonts = typeof document !== 'undefined' ? document.fonts : null;
			if (!fonts || typeof fonts.addEventListener !== 'function') return;

			const onFonts = () => {
				if (inst.state.animating || inst.timerState !== TimerState.CLEAR) return;
				inst.invalidateMetrics();
			};
			fonts.addEventListener('loadingdone', onFonts);
			inst.removeFonts = () => fonts.removeEventListener('loadingdone', onFonts);
		};

		inst.syncVerticalDuplicate = () => {
			if (!inst.isVertical() || !inst.state.promoted || !(inst.distance > 0)) return;

			const content = inst.node;
			const duplicate = inst.duplicateNode;
			if (content && duplicate && (duplicate.childNodes.length === 0 || duplicate.textContent !== content.textContent)) {
				cloneContentInto(content, duplicate);
			}
		};

		inst.calculateVerticalMetrics = () => {
			const content = inst.node;
			const measurer = inst.measurer;
			if (!content || !measurer || inst.distance != null || inst.props.marqueeDisabled) return;

			cloneContentInto(content, measurer);

			let metrics;
			try {
				metrics = measureNode(measurer, inst.visibleLines());
			} finally {
				measurer.replaceChildren();
			}

			const basis = metrics.clipHeight > 0 ? metrics.clipHeight : metrics.lineHeight * inst.visibleLines();
			inst.spacing = inst.getSpacing(basis);
			inst.distance = metrics.overflows ? round2(metrics.contentHeight + inst.spacing) : 0;
			inst.contentFits = !inst.shouldAnimate(inst.distance);
			inst.clipHeight = metrics.clipHeight;

			const overflow = inst.calculateTextOverflow(inst.distance);
			inst.setMergedState(state => state.overflow === overflow ? null : {overflow});
		};

		/*
		 * Determines if the component should marquee and the distance to animate
		 *
		 * @returns {undefined}
		 */
		inst.calculateMetrics = () => {
			if (inst.isVertical()) {
				inst.calculateVerticalMetrics();
				return;
			}

			const node = inst.node;

			// TODO: absolute showing check (or assume that it won't be rendered if it isn't showing?)
			if (node && inst.distance == null && !inst.props.marqueeDisabled) {
				const {width, scrollWidth} = inst.measureWidths();

				inst.spacing = inst.getSpacing(width);
				inst.distance = inst.calculateDistance(width, scrollWidth, inst.spacing);
				inst.contentFits = !inst.shouldAnimate(inst.distance);

				const overflow = inst.calculateTextOverflow(inst.distance);
				inst.setMergedState(state => {
					return state.overflow === overflow ? null : {overflow};
				});
			}
		};

		/*
		 * Calculates the distance the marquee must travel to reveal all of the content
		 *
		 * @param	{Number}  width        Width of the node
		 * @param	{Number}  scrollWidth  Width of the node if it were unbounded
		 * @param	{Number}  spacing      Horizontal spacing
		 * @returns	{Number}               Distance to travel in pixels
		 */
		inst.calculateDistance = (width, scrollWidth, spacing) => {
			const overflow = scrollWidth - width;

			if (inst.shouldAnimate(overflow)) {
				return scrollWidth + spacing;
			}

			return 0;
		};

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
		inst.calculateTextOverflow = (distance) => {
			return distance === 0 ? 'clip' : 'ellipsis';
		};

		inst.getSpacing = (width) => {
			const {marqueeSpacing} = inst.props;

			if (typeof marqueeSpacing === 'string') {
				if (/^\d+(\.\d+)?%$/.test(marqueeSpacing)) {
					return width * Number.parseFloat(marqueeSpacing) / 100;
				}

				// warning for invalid string value;
				return 0;
			}

			return scale(marqueeSpacing);
		};

		/*
		 * Calculates if the marquee should animate
		 *
		 * @param	{Number}	distance	Amount of overflow in pixels
		 * @returns	{Boolean}				`true` if it should animate
		 */
		inst.shouldAnimate = (distance) => {
			return distance > 0;
		};

		/*
		 * Starts the animation without synchronizing
		 *
		 * @param	{Number}	[delay]	Milliseconds to wait before animating
		 * @returns	{undefined}
		 */
		inst.start = (delay = inst.props.marqueeDelay) => {
			if (inst.props.marqueeDisabled) {
				// if marquee isn't necessary, do not set `animating` but return `true` to mark it
				// complete if it's synchronized so it doesn't block other instances.
				return true;
			} else if (inst.isVertical() && (prefersReducedMotion() || !(inst.props.marqueeSpeed > 0))) {
				inst.calculateMetrics();
				return true;
			} else if (!inst.state.animating) {
				// Don't need to worry about this.timerState because if we're sync, we were just
				// told to start, so our state is correct already. If we're not sync, this will
				// restart us anyhow. If we were waiting to tell sync to start us, someone else in
				// our group already did it.
				inst.setTimeout(() => {
					inst.calculateMetrics();
					if (inst.contentFits === false) {
						inst.setMergedState({
							promoted: true,
							animating: true
						});
					} else if (inst.sync) {
						inst.context.complete(inst);
					}
				}, delay, TimerState.START_PENDING);
			}
		};

		/*
		 * Stops the animation
		 *
		 * @returns	{undefined}
		 */
		inst.stop = () => {
			inst.clearTimeout();

			if (inst.isVertical()) {
				inst.promoteJob.stop();
				inst.demoteJob.stop();
				if (inst.state.animating || inst.state.promoted) {
					inst.setMergedState({
						animating: false,
						promoted: false
					});
				}
				return;
			}

			if (inst.state.animating) {
				inst.setMergedState({
					animating: false
				});
			}

			inst.demote();
		};

		/*
		 * Restarts the animation
		 *
		 * @returns	{undefined}
		 */
		inst.restart = () => {
			inst.restartAnimation();
		};

		/*
		 * Starts marquee animation with synchronization, if not already animating and a timer is
		 * not already active to start.
		 *
		 * @param {Number} [delay] Milliseconds to wait before animating
		 * @returns {undefined}
		 */
		inst.tryStartingAnimation = (delay) => {
			if (inst.state.animating || inst.timerState !== TimerState.CLEAR) return;

			inst.startAnimation(delay);
		};

		/*
		 * Starts marquee animation with synchronization
		 *
		 * @param {Number} [delay] Milliseconds to wait before animating
		 * @returns {undefined}
		 */
		inst.startAnimation = (delay) => {
			inst.promote(delay);
			if (inst.sync) {
				// If we're running a timer for anything, we should let that finish, unless it's
				// another syncstart request.  We should probably check to see if the start request
				// is further in the future than we are so we can choose the nearer one. But, we're
				// assuming the condition is we're waiting on render delay and someone just hovered
				// us, so we can start with the (hopefully) faster hover delay.
				if (inst.timerState !== TimerState.CLEAR &&
						inst.timerState !== TimerState.SYNCSTART_PENDING) {
					return;
				}
				inst.setTimeout(() => {
					inst.context.start();
				}, delay, TimerState.SYNCSTART_PENDING);
			} else {
				inst.start(delay);
			}
		};

		/*
		 * Resets the marquee and restarts it after `marqueeDelay` milliseconds.
		 *
		 * @returns {undefined}
		 */
		inst.restartAnimation = (delay = MINIMUM_MARQUEE_RESET_DELAY) => {
			flushSync(() => {
				inst.setMergedState({
					animating: false
				});
			});
			// synchronized Marquees defer to the controller to restart them
			if (inst.sync) {
				// Even in sync mode, it is necessary to apply a minimum reset delay.
				// In detail, the timer with 40ms delay needs to be applied only when marqueeDelay is less than 40,
				// but for consistency, we decided to apply 40ms in all cases.
				inst.setTimeout(() => {
					inst.context.complete(inst);
				}, MINIMUM_MARQUEE_RESET_DELAY, TimerState.RESET_PENDING);
			} else if (!inst.state.animating) {
				inst.startAnimation(delay);
			}
		};

		/*
		 * Resets and restarts the marquee after `marqueeResetDelay` milliseconds
		 *
		 * @returns {undefined}
		 */
		inst.resetAnimation = () => {
			const delay = Math.max(MINIMUM_MARQUEE_RESET_DELAY, inst.props.marqueeResetDelay + inst.props.marqueeDelay);
			// If we're already timing a start action, don't reset.  Start actions will clear us if
			// sync.
			if (inst.timerState === TimerState.CLEAR) {
				// If invoked immediately, the setState call in restartAnimation is batched and will
				// break any non-marquee-on-render instances because the subsequent startAnimation
				// isn't invoked. By setting a brief timeout, we decouple from the `onTransitionEnd`
				// event and setState is synchronous allowing the startAnimation to be called
				// immediately.
				//
				// This would be better moved into componentDidUpdate with more expansive state
				// values to indicate we need to reset an animation vs starting fresh.
				inst.setTimeout(() => {
					inst.restartAnimation(delay);
				}, 0, TimerState.RESET_PENDING);
			}
		};

		/*
		 * Cancels the marquee
		 *
		 * @returns {undefined}
		 */
		inst.cancelAnimation = (retryStartingAnimation = false) => {
			if (inst.sync) {
				inst.context.cancel(retryStartingAnimation);
				return;
			}

			inst.stop();
		};

		inst.handleResize = () => {
			if (inst.node && !inst.props.marqueeDisabled) {
				if (inst.isVertical()) {
					// Toggling the line clamp only changes the height. A new width or text size can rewrap.
					const {fontSize, lineHeight} = window.getComputedStyle(inst.node);
					const layout = `${round2(inst.node.getBoundingClientRect().width)} ${fontSize} ${lineHeight}`;
					if (layout === inst.measuredLayout) return;
					inst.measuredLayout = layout;
				}

				inst.invalidateMetrics();
				if (inst.state.animating) {
					inst.cancelAnimation();
					inst.resetAnimation();
				}
			}
		};

		inst.handleMarqueeComplete = () => {
			// Snap back before the reset timer so a vertical pause is visible immediately.
			// The reset itself stays on a timeout so the restart is not batched with this update.
			if (inst.isVertical() && inst.state.animating) {
				inst.setMergedState({animating: false});
			}
			inst.resetAnimation();
		};

		inst.handleFocus = (ev) => {
			inst.isFocused = true;
			if (!inst.sync) {
				if (!inst.state.animating) {
					if (inst.isVertical() && inst.contentFits === true) {
						inst.invalidateMetrics();
					}
					inst.startAnimation();
				}
			}
			forwardFocus(ev, inst.props);
		};

		inst.handleBlur = (ev) => {
			inst.promoteJob.stop();
			forwardBlur(ev, inst.props);
			if (inst.isFocused) {
				inst.isFocused = false;
				if (!inst.sync && !(inst.isHovered && inst.props.marqueeOn === 'hover')) {
					inst.cancelAnimation();
				}
			}
		};

		inst.handleEnter = (ev) => {
			inst.isHovered = true;
			if (inst.props.marqueeOn === 'hover') {
				if (inst.sync) {
					inst.context.enter(inst);
				} else if (!inst.state.animating) {
					inst.startAnimation();
				}
			}
			forwardEnter(ev, inst.props);
		};

		inst.handleLeave = (ev) => {
			inst.promoteJob.stop();
			inst.handleUnhover();
			forwardLeave(ev, inst.props);
		};

		inst.handlePointerHide = ({keyCode}) => {
			if (is('pointerHide', keyCode)) {
				inst.handleUnhover();
			}
		};

		inst.handleUnhover = () => {
			inst.isHovered = false;
			if (inst.props.marqueeOn === 'hover') {
				if (inst.sync) {
					inst.context.leave(inst);
				} else {
					inst.cancelAnimation();
				}
			}
		};

		inst.cacheNode = (node) => {
			inst.node = node;
		};

		inst.validateTextDirection = () => {
			inst.setMergedState((state) => {
				const rtl = determineTextDirection(inst.node, inst.props.rtl, inst.props.forceDirection);
				return state.rtl === rtl ? null : {rtl};
			});
		};

		function renderMarquee () {
			const {
				alignment,
				children,
				css: instanceCss,
				disabled,
				marqueeOn,
				marqueeSpeed,
				...rest
			} = inst.props;

			const marqueeOnFocus = marqueeOn === 'focus';
			const marqueeOnHover = marqueeOn === 'hover';
			const marqueeOnRender = marqueeOn === 'render';
			const mergedCss = mergeCss(css, instanceCss);

			if (marqueeOnFocus) {
				rest[focus] = inst.handleFocus;
			}

			// TODO: cancel others on hover
			if (marqueeOnHover || marqueeOnFocus) {
				rest[enter] = inst.handleEnter;
				rest[leave] = inst.handleLeave;
			}

			if (marqueeOnRender) {
				rest[enter] = inst.handleEnter;
			}

			delete rest.forceDirection;
			delete rest.locale;
			delete rest.marqueeCentered;
			delete rest.marqueeDelay;
			delete rest.marqueeDisabled;
			delete rest.marqueeOnRenderDelay;
			delete rest.marqueeSpacing;
			delete rest.marqueeResetDelay;
			delete rest.marqueeSpeed;
			delete rest.marqueeMaxLines;
			delete rest.ref;
			delete rest.remeasure;
			delete rest.rtl;
			// The css prop styles the wrapped component. Only the marquee gets the merged map.
			// A DOM element has no css prop, so the map would end up as an attribute.
			if (instanceCss != null && typeof Wrapped !== 'string') {
				rest.css = instanceCss;
			}

			return (
				<Wrapped {...rest} onBlur={inst.handleBlur} disabled={disabled}>
					<MarqueeComponent
						alignment={alignment}
						animating={inst.state.animating}
						clientRef={inst.cacheNode}
						clipHeight={inst.clipHeight}
						css={mergedCss}
						distance={inst.distance}
						duplicateRef={inst.cacheDuplicate}
						maxLines={inst.visibleLines()}
						measurerRef={inst.cacheMeasurer}
						onMarqueeComplete={inst.handleMarqueeComplete}
						orientation={orientation}
						overflow={inst.state.overflow}
						spacing={inst.spacing}
						rtl={inst.state.rtl}
						speed={marqueeSpeed}
						willAnimate={inst.state.promoted}
					>
						{children}
					</MarqueeComponent>
				</Wrapped>
			);
		}
		inst.renderMarquee = renderMarquee;

		function renderWrapped () {
			const props = Object.assign({}, inst.props);

			delete props.alignment;
			delete props.forceDirection;
			delete props.locale;
			delete props.marqueeCentered;
			delete props.marqueeDelay;
			delete props.marqueeDisabled;
			delete props.marqueeOn;
			delete props.marqueeOnRenderDelay;
			delete props.marqueeSpacing;
			delete props.marqueeResetDelay;
			delete props.marqueeSpeed;
			delete props.marqueeMaxLines;
			delete props.ref;
			delete props.remeasure;
			delete props.rtl;
			// Keep css for a wrapped component that styles itself with it, as when the marquee runs.
			if (typeof Wrapped === 'string') {
				delete props.css;
			}

			return <Wrapped {...props} />;
		}
		inst.renderWrapped = renderWrapped;

		inst.handleMount = () => {
			if (inst.context && inst.context.register) {
				inst.sync = true;
				inst.context.register(inst, {
					restart: inst.restart,
					start: inst.start,
					stop: inst.stop
				});
			}

			inst.validateTextDirection();
			if (typeof ResizeObserver === 'function' && inst.node) {
				inst.resizeObserver = new ResizeObserver(() => {
					inst.handleResize();
				});
				inst.resizeObserver.observe(inst.node);
			}

			if (inst.isVertical()) {
				inst.watchFonts();
			}

			if (inst.props.marqueeOn === 'render') {
				if (!inst.props.marqueeDisabled) {
					inst.hasStartedRender = true;
				}
				inst.startAnimation(inst.props.marqueeOnRenderDelay);
			}
			on('keydown', inst.handlePointerHide, document);
		};

		inst.handleUnmount = () => {
			inst.clearTimeout();
			inst.promoteJob.stop();
			inst.demoteJob.stop();
			if (inst.sync) {
				inst.context.unregister(inst);
			}

			if (inst.resizeRegistry) {
				inst.resizeRegistry.unregister(inst.handleResize);
				inst.resizeRegistry = null;
			}

			if (inst.resizeObserver) {
				inst.resizeObserver.disconnect();
				inst.resizeObserver = null;
			}

			off('keydown', inst.handlePointerHide, document);
			if (inst.removeFonts) inst.removeFonts();
			inst.committed = false;
		};

		inst.handleUpdate = (prevProps) => {
			const {children, disabled, forceDirection, locale, marqueeOn, marqueeDisabled, marqueeSpacing, marqueeMaxLines, marqueeSpeed, rtl} = inst.props;
			let forceRestartMarquee = false;

			if (!prevProps.marqueeDisabled && marqueeDisabled && inst.isVertical()) {
				inst.isFocused = false;
				inst.isHovered = false;
			}
			if (
				prevProps.locale !== locale ||
				prevProps.rtl !== rtl ||
				prevProps.marqueeSpacing !== marqueeSpacing ||
				prevProps.marqueeMaxLines !== marqueeMaxLines ||
				!shallowEqual(prevProps.children, children) ||
				(invalidateProps && didPropChange(invalidateProps, prevProps, inst.props))
			) {
				forceRestartMarquee = marqueeOn === 'render' || (
					inst.sync && (inst.state.animating || inst.timerState > TimerState.CLEAR)
				);

				if (forceRestartMarquee && marqueeOn === 'render') {
					inst.hasStartedRender = false;
				}

				inst.invalidateMetrics();
				inst.cancelAnimation(forceRestartMarquee);
				if (forceRestartMarquee && marqueeOn === 'focus') {
					inst.resetAnimation();
				}
			} else if (
				prevProps.marqueeOn !== marqueeOn ||
				prevProps.marqueeDisabled !== marqueeDisabled ||
				prevProps.marqueeSpeed !== marqueeSpeed ||
				prevProps.forceDirection !== forceDirection
			) {
				if (prevProps.marqueeDisabled && !marqueeDisabled) {
					inst.invalidateMetrics();
				}
				if (
					inst.sync ||
					inst.state.animating ||
					inst.state.promoted ||
					inst.timerState !== TimerState.CLEAR
				) {
					inst.cancelAnimation();
				}
				if (marqueeOn === 'render' && !marqueeDisabled) {
					inst.hasStartedRender = false;
				}
			} else if (disabled && inst.isHovered && marqueeOn === 'focus' && inst.sync) {
				inst.context.enter(inst);
			}

			inst.validateTextDirection();
			if (forceRestartMarquee || inst.shouldStartMarquee()) {
				inst.tryStartingAnimation(inst.props.marqueeOn === 'render' ? inst.props.marqueeOnRenderDelay : inst.props.marqueeDelay);
			}
			inst.syncVerticalDuplicate();
		};

		return inst;
	}

	function MarqueeDecoratorComponent (incomingProps) {
		const props = setDefaultProps(incomingProps, marqueeDefaultProps);
		checkPropTypes(MarqueeDecoratorComponent, props);

		const context = use(MarqueeControllerContext);
		const resizeRegister = use(ResizeContext);

		const [state, setState] = useState(() => ({
			animating: false,
			overflow: 'ellipsis',
			promoted: false,
			rtl: determineTextDirection(null, props.rtl, props.forceDirection)
		}));

		const instRef = useRef(null);
		if (instRef.current == null) {
			instRef.current = createMarquee(setState);
		}

		// Latest props, state, and context for timers, jobs, and controller callbacks.
		// Reading and writing the ref here is intentional: measured distance lives on the instance
		// and is read while rendering, the same way the class read `this.distance`.
		const inst = instRef.current;
		inst.props = props;
		inst.state = state;
		inst.context = context;
		inst.resizeRegister = resizeRegister;

		useLayoutEffect(() => {
			const current = instRef.current;
			current.handleMount();

			return () => {
				current.handleUnmount();
			};
		}, []);

		useLayoutEffect(() => {
			const current = instRef.current;

			if (!current.resizeRegistry && typeof current.resizeRegister === 'function') {
				current.resizeRegistry = current.resizeRegister(current.handleResize);
			}

			if (!current.committed) {
				current.committed = true;
				current.prevProps = current.props;
				return;
			}

			const prevProps = current.prevProps;
			current.prevProps = current.props;
			current.handleUpdate(prevProps);
		});

		if (props.marqueeDisabled) {
			return inst.renderWrapped();
		}

		return inst.renderMarquee();
	}

	MarqueeDecoratorComponent.displayName = 'ui:MarqueeDecorator';

	MarqueeDecoratorComponent.propTypes = /** @lends ui/Marquee.MarqueeDecorator.prototype */ {
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
		 * Customizes the marquee's internal elements.
		 *
		 * The following classes are supported:
		 *
		 * * `marquee` - The root component class
		 * * `animate` - Applied to the inner content node when the text is animating
		 * * `content` - The content node of a vertical marquee
		 * * `spacing` - The spacing node used between the repeated content
		 * * `text` - The inner content node
		 * * `vertical` - The root modifier for a vertical marquee
		 * * `willAnimate` - Applied to the inner content node shortly before animation
		 *
		 * An app class is appended to the class from
		 * {@link ui/Marquee.MarqueeDecorator.defaultConfig.css}.
		 *
		 * When the decorator wraps a component, such as a `Button`, that component also receives
		 * `css` to style itself. Because the same map is merged into the marquee, a `marquee`,
		 * `text`, `animate`, `spacing` or `willAnimate` class in it also applies to the marquee's
		 * internal elements.
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

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
		 * Valid values are `'rtl'`, `'ltr'`, and `'locale'`. This includes non-text elements as well.
		 * The default behavior, if this prop is unset, is to evaluate the text content for
		 * directionality using {@link i18n/util.isRtlText}.
		 *
		 * If `'locale'`, the `direction` is determined by the locale, same as {@link ui/Marquee.MarqueeDecorator.rtl}.
		 * In other words, it will not consider the text content for determining the direction.
		 *
		 * @type {String}
		 * @public
		 */
		forceDirection: PropTypes.oneOf(['rtl', 'ltr', 'locale']),

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
		 * Number of text lines that stay visible when the decorator is configured with
		 * `orientation: 'vertical'`.
		 *
		 * @type {Number}
		 * @default 3
		 * @public
		 */
		marqueeMaxLines: PropTypes.number,

		/**
		 * Determines what triggers the marquee to start its animation.
		 *
		 * @type {('focus'|'hover'|'render')}
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
		 * Amount of spacing between the instances of the content when animating.
		 *
		 * May either be a number indicating the number of pixels or a string indicating the
		 * percentage relative to the width of the component.
		 *
		 * *Note:* When using a number, the value should be based on 1920x1080 display and
		 * will be scaled automatically for the current resolution using {@link ui/resolution}.
		 *
		 * @type {String | Number}
		 * @default '50%'
		 * @public
		 */
		marqueeSpacing: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

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
	};

	const MemoizedMarqueeDecorator = memo(MarqueeDecoratorComponent);
	MemoizedMarqueeDecorator.displayName = 'ui:MarqueeDecorator';
	MemoizedMarqueeDecorator.propTypes = MarqueeDecoratorComponent.propTypes;

	return MemoizedMarqueeDecorator;
});

export default MarqueeDecorator;
export {
	MarqueeDecorator
};
