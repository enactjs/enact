import {forward} from '@enact/core/handle';
import Spotlight from '@enact/spotlight';
import {spottableClass} from '@enact/spotlight/Spottable';
import {getTargetByDirectionFromPosition} from '@enact/spotlight/src/target';
import {getRect, intersects} from '@enact/spotlight/src/utils';
import useDOM from '@enact/ui/Scrollable/useDOM';
import useEvent from '@enact/ui/Scrollable/useEvent';
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

	const {childAdapter, horizontalScrollbarRef, overscrollRefs, scrollableContainerRef, uiScrollableAdapter, verticalScrollbarRef} = instances;
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
	} = useScrollbar(props, instances, {isContent});

	useSpotlightConfig(props);

	useSpotlightRestore(props, instances);

	const {
		applyOverscrollEffect,
		checkAndApplyOverscrollEffectByDirection,
		clearOverscrollEffect
	} = useOverscrollEffect({}, instances);

	const {handleWheel, isWheeling} = useEventWheel(props, instances, {isScrollButtonFocused, type});

	const {calculateAndScrollTo, handleFocus, hasFocus} = useEventFocus(props, {...instances, spottable: variables}, {alertThumb, isWheeling, type});

	const {handleKeyDown, lastPointer, scrollByPageOnPointerMode} = useEventKey(props, {...instances, spottable: variables}, {checkAndApplyOverscrollEffectByDirection, hasFocus, isContent, type});

	useEventMonitor({}, instances, {lastPointer, scrollByPageOnPointerMode});

	const {handleFlick, handleMouseDown} = useEventMouse({}, instances, {isScrollButtonFocused, type});

	const {handleTouchStart} = useEventTouch({}, instances, {isScrollButtonFocused});

	const {
		addVoiceEventListener,
		removeVoiceEventListener,
		stopVoice
	} = useEventVoice(props, instances, {onScrollbarButtonClick});

	const {handleResizeWindow} = useEventResizeWindow();

	/*
	 * Functions
	 */

	function isContent (element) {
		return (element && useDOM().containsDangerously(uiScrollableAdapter.current.uiChildAdapter.current.childContainerRef, element));
	}

	function scrollTo (opt) {
		variables.current.indexToFocus = (opt.focus && typeof opt.index === 'number') ? opt.index : null;
		variables.current.nodeToFocus = (opt.focus && opt.node instanceof Object && opt.node.nodeType === 1) ? opt.node : null;
	}

	function start (animate) {
		if (type === 'Native' && !animate) {
			focusOnItem();
		}
	}

	function stop () {
		if (!props['data-spotlight-container-disabled']) {
			childAdapter.current.setContainerDisabled(false);
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
		if (variables.current.indexToFocus !== null && typeof childAdapter.current.focusByIndex === 'function') {
			childAdapter.current.focusByIndex(variables.current.indexToFocus);
			variables.current.indexToFocus = null;
		}
		if (variables.current.nodeToFocus !== null && typeof childAdapter.current.focusOnNode === 'function') {
			childAdapter.current.focusOnNode(variables.current.nodeToFocus);
			variables.current.nodeToFocus = null;
		}
		if (variables.current.pointToFocus !== null) {
			// no need to focus on pointer mode
			if (!Spotlight.getPointerMode()) {
				const {direction, x, y} = variables.current.pointToFocus;
				const position = {x, y};
				const elemFromPoint = document.elementFromPoint(x, y);
				const target =
					elemFromPoint && elemFromPoint.closest && getIntersectingElement(elemFromPoint.closest(`.${spottableClass}`), scrollableContainerRef.current) ||
					getTargetInViewByDirectionFromPosition(direction, position, scrollableContainerRef.current) ||
					getTargetInViewByDirectionFromPosition(reverseDirections[direction], position, scrollableContainerRef.current);

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
		if (uiScrollableAdapter.current.scrollToInfo === null) {
			const scrollHeight = uiScrollableAdapter.current.getScrollBounds().scrollHeight;

			if (scrollHeight !== uiScrollableAdapter.current.bounds.scrollHeight) {
				calculateAndScrollTo();
			}
		}

		// oddly, Scroller manages uiScrollableAdapter.current.bounds so if we don't update it here (it is also
		// updated in calculateAndScrollTo but we might not have made it to that point), it will be
		// out of date when we land back in this method next time.
		uiScrollableAdapter.current.bounds.scrollHeight = uiScrollableAdapter.current.getScrollBounds().scrollHeight;
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	function addEventListeners (childContainerRef) {
		useEvent('focusin').addEventListener(childContainerRef, handleFocus);
		if (childContainerRef.current) {
			addVoiceEventListener(childContainerRef);
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	function removeEventListeners (childContainerRef) {
		useEvent('focusin').removeEventListener(childContainerRef, handleFocus);
		if (childContainerRef.current) {
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
