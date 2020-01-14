
import handle, {forward} from '@enact/core/handle';
import Spotlight, {getDirection} from '@enact/spotlight';
import {spottableClass} from '@enact/spotlight/Spottable';
import {getRect, intersects} from '@enact/spotlight/src/utils';
import {constants} from '@enact/ui/Scrollable';
import {useContext, useEffect, useRef} from 'react';

import {SharedState} from '../internal/SharedStateDecorator';

import {useFocus} from './useFocus';
import {useKey} from './useKey';
import {useMouse} from './useMouse';
import {useOverscrollEffect} from './useOverscrollEffect';
import {useRestoreSpotlight} from './useRestoreSpotlight';
import {useResizeWindow} from './useResizeWindow';
import {useScrollbar} from './useScrollbar';
import {useSpotlightConfig} from './useSpotlightConfig';
import {useTouch} from './useTouch';
import {useVoice} from './useVoice';
import {useWheel} from './useWheel';

const
	{
		animationDuration,
		isPageDown,
		isPageUp,
		paginationPageMultiplier
	} = constants,
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

const useSpottable = ({}, props, {
	childRef,
	overscrollRefs,
	uiRef
}) => {
	const {
		'data-spotlight-id': spotlightId
	} = props;

	const variables = useRef({
		animateOnFocus: false,

		// status
		isWheeling: false,

		// spotlight
		lastScrollPositionOnFocus: null,
		indexToFocus: null,
		nodeToFocus: null,
		pointToFocus: null,
	});

	const context = useContext(SharedState);

	// useEffects

	const {
		isScrollButtonFocused,
		onScrollbarButtonClick,
		scrollAndFocusScrollbarButton,
		scrollbarProps
	} = useScrollbar({}, props, {
		isContent,
		uiRef
	});

	useSpotlightConfig({}, props);

	useRestoreSpotlight({}, props, {uiRef});

	const {
		applyOverscrollEffect,
		checkAndApplyOverscrollEffectByDirection,
		clearOverscrollEffect
	} = useOverscrollEffect({}, {}, {overscrollRefs});

	const {
		handleFocus,
		hasFocus
	} = useFocus({}, {}, {
		childRef,
		uiRef
	});

	const {
		handleKeyDown,
		scrollByPageOnPointerMode
	} = useKey({}, {}, {
		checkAndApplyOverscrollEffectByDirection,
		hasFocus,
		isContent,
		uiRef
	});

	const {
		handleFlick,
		handleMouseDown
	} = useMouse({}, {}, {uiRef});

	const {
		handleWheel
	} = useWheel({}, props, {
		childRef,
		isScrollButtonFocused,
		uiRef
	});

	const {
		handleTouchStart
	} = useTouch({}, {}, {
		isScrollButtonFocused
	});

	const {
		addVoiceEventListener,
		removeVoiceEventListener,
		stopVoice,
	} = useVoice({}, props, {onScrollbarButtonClick, uiRef});

	const {
		handleResizeWindow
	} = useResizeWindow();

	// functions

	function isContent (element) {
		return (element && uiRef.current && uiRef.current.childRefCurrent.containerRef.current.contains(element));
	}

	function scrollTo (opt) {
		variables.current.indexToFocus = (opt.focus && typeof opt.index === 'number') ? opt.index : null;
		variables.current.nodeToFocus = (opt.focus && opt.node instanceof Object && opt.node.nodeType === 1) ? opt.node : null;
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

	const handleScroll = handle(
		forward('onScroll'),
		(ev, {id}, context) => id && context && context.set,
		({scrollLeft: x, scrollTop: y}, {id}, context) => {
			context.set(`${id}.scrollPosition`, {x, y});
		}
	);

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
		scrollTo,
		stop
	};
}

export {
	useSpottable
};
