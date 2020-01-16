import {forward} from '@enact/core/handle';
import Spotlight from '@enact/spotlight';
import {spottableClass} from '@enact/spotlight/Spottable';
import {getTargetByDirectionFromPosition} from '@enact/spotlight/src/target';
import {getRect, intersects} from '@enact/spotlight/src/utils';
import {useContext, useRef} from 'react';

import {SharedState} from '../internal/SharedStateDecorator';

import useEventFocus from './useEventFocus';
import useEventKey from './useEventKey';
import useEventMonitor from './useEventMonitor';
import useEventMouse from './useEventMouse';
import useEventResizeWindow from './useEventResizeWindow';
import useEventTouch from './useEventTouch';
import useEventVoice from './useEventVoice';
import useEventWheel from './useEventWheel';
import useOverscrollEffect from './useOverscrollEffect';
import useScrollbar from './useScrollbar';
import useSpotlightConfig from './useSpotlightConfig';
import useSpotlightRestore from './useSpotlightRestore';

/**
 * The name of a custom attribute which indicates the index of an item in
 * [VirtualList]{@link moonstone/VirtualList.VirtualList} or
 * [VirtualGridList]{@link moonstone/VirtualList.VirtualGridList}.
 *
 * @constant dataIndexAttribute
 * @memberof moonstone/Scrollable
 * @type {String}
 * @private
 */
const dataIndexAttribute = 'data-index';

const
	reverseDirections = {
		down: 'up',
		up: 'down'
	};

const isIntersecting = (elem, container) => elem && intersects(getRect(container), getRect(elem));
const getIntersectingElement = (elem, container) => isIntersecting(elem, container) && elem;
const getTargetInViewByDirectionFromPosition = (direction, position, container) => {
	const target = getTargetByDirectionFromPosition(direction, position, Spotlight.getActiveContainer());
	return getIntersectingElement(target, container);
};

const useSpottable = (props, instances, dependencies) => {
	/*
	 * Dependencies
	 */

	const {childRef, overscrollRefs, uiRef} = instances;
	const {type} = dependencies;

	const context = useContext(SharedState);

	/*
	 * Instance
	 */

	const variables = useRef({
		animateOnFocus: false,
		indexToFocus: null,
		lastScrollPositionOnFocus: null,
		nodeToFocus: null,
		pointToFocus: null
	});

	/*
	 * Hooks
	 */

	const {
		alertThumb,
		isScrollButtonFocused,
		onScrollbarButtonClick,
		scrollAndFocusScrollbarButton,
		scrollbarProps
	} = useScrollbar(props, {uiRef}, {isContent});

	useSpotlightConfig(props);

	useSpotlightRestore(props, {uiRef});

	const {
		applyOverscrollEffect,
		checkAndApplyOverscrollEffectByDirection,
		clearOverscrollEffect
	} = useOverscrollEffect({}, {overscrollRefs, uiRef});

	const {handleWheel, isWheeling} = useEventWheel(props, {childRef, uiRef}, {isScrollButtonFocused, type});

	const {calculateAndScrollTo, handleFocus, hasFocus} = useEventFocus(props, {childRef, spottable: variables, uiRef}, {alertThumb, isWheeling, type});

	const {handleKeyDown, lastPointer, scrollByPageOnPointerMode} = useEventKey(props, {childRef, spottable: variables, uiRef}, {checkAndApplyOverscrollEffectByDirection, hasFocus, isContent, type});

	useEventMonitor({}, {childRef, uiRef}, {lastPointer, scrollByPageOnPointerMode});

	const {handleFlick, handleMouseDown} = useEventMouse({}, {uiRef}, {isScrollButtonFocused, type});

	const {handleTouchStart} = useEventTouch({}, {}, {isScrollButtonFocused});

	const {
		addVoiceEventListener,
		removeVoiceEventListener,
		stopVoice
	} = useEventVoice(props, {uiRef}, {onScrollbarButtonClick});

	const {handleResizeWindow} = useEventResizeWindow();

	/*
	 * Functions
	 */

	function isContent (element) {
		return (element && uiRef.current && uiRef.current.childRefCurrent.containerRef.current.contains(element));
	}

	function scrollTo (opt) {
		variables.current.indexToFocus = (opt.focus && typeof opt.index === 'number') ? opt.index : null;
		variables.current.nodeToFocus = (opt.focus && opt.node instanceof Object && opt.node.nodeType === 1) ? opt.node : null;
	}

	function start (animate) {
		if (type === 'Native' && !animate) {
			this.focusOnItem();
		}
	}

	function stop () {
		if (!props['data-spotlight-container-disabled']) {
			childRef.current.setContainerDisabled(false);
		}
		focusOnItem();
		variables.current.lastScrollPositionOnFocus = null;
		variables.current.isWheeling = false;
		stopVoice();
	}

	function scrollStopOnScroll () {
		stop();
	}

	function focusOnItem () {
		if (variables.current.indexToFocus !== null && typeof childRef.current.focusByIndex === 'function') {
			childRef.current.focusByIndex(variables.current.indexToFocus);
			variables.current.indexToFocus = null;
		}
		if (variables.current.nodeToFocus !== null && typeof childRef.current.focusOnNode === 'function') {
			childRef.current.focusOnNode(variables.current.nodeToFocus);
			variables.current.nodeToFocus = null;
		}
		if (variables.current.pointToFocus !== null) {
			// no need to focus on pointer mode
			if (!Spotlight.getPointerMode()) {
				const {direction, x, y} = variables.current.pointToFocus;
				const position = {x, y};
				const {current: {containerRef: {current}}} = uiRef;
				const elemFromPoint = document.elementFromPoint(x, y);
				const target =
					elemFromPoint && elemFromPoint.closest && getIntersectingElement(elemFromPoint.closest(`.${spottableClass}`), current) ||
					getTargetInViewByDirectionFromPosition(direction, position, current) ||
					getTargetInViewByDirectionFromPosition(reverseDirections[direction], position, current);

				if (target) {
					Spotlight.focus(target);
				}
			}
			variables.current.pointToFocus = null;
		}
	}

	function handleScroll (ev) {
		const {scrollLeft: x, scrollTop: y} = ev;
		const {id} = props;
		forward('onScroll', ev, props);
		if (id && context && context.set) {
			context.set(ev, props);
			context.set(`${id}.scrollPosition`, {x, y});
		}
	}

	// Callback for scroller updates; calculate and, if needed, scroll to new position based on focused item.
	function handleScrollerUpdate () {
		if (uiRef.current.scrollToInfo === null) {
			const scrollHeight = uiRef.current.getScrollBounds().scrollHeight;
			if (scrollHeight !== uiRef.current.bounds.scrollHeight) {
				calculateAndScrollTo();
			}
		}

		// oddly, Scroller manages uiRef.current.bounds so if we don't update it here (it is also
		// updated in calculateAndScrollTo but we might not have made it to that point), it will be
		// out of date when we land back in this method next time.
		uiRef.current.bounds.scrollHeight = uiRef.current.getScrollBounds().scrollHeight;
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	function addEventListeners (childContainerRef) {
		if (childContainerRef.current && childContainerRef.current.addEventListener) {
			childContainerRef.current.addEventListener('focusin', handleFocus);
			addVoiceEventListener(childContainerRef);
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	function removeEventListeners (childContainerRef) {
		if (childContainerRef.current && childContainerRef.current.removeEventListener) {
			childContainerRef.current.removeEventListener('focusin', handleFocus);
			removeVoiceEventListener(childContainerRef);
		}
	}

	/*
	 * Return
	 */

	return {
		addEventListeners,
		applyOverscrollEffect,
		clearOverscrollEffect,
		handleFlick,
		handleFocus,
		handleKeyDown,
		handleMouseDown,
		handleResizeWindow,
		handleScroll,
		handleScrollerUpdate,
		handleTouchStart,
		handleWheel,
		removeEventListeners,
		scrollAndFocusScrollbarButton,
		scrollbarProps,
		scrollByPageOnPointerMode,
		scrollStopOnScroll,
		scrollTo,
		start,
		stop
	};
};

export default useSpottable;
export {
	dataIndexAttribute,
	useSpottable
};
