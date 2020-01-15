import platform from '@enact/core/platform';
import Spotlight from '@enact/spotlight';
import {useRef} from 'react';

const useEventVoice = (props, instances, dependencies) => {
	/*
	 * Dependencies
	 */

	const {
		direction,
		rtl
	} = props;
	const {
		uiRef
	} = instances;
	const {
		onScrollbarButtonClick
	} = dependencies

	/*
	 * Instance
	 */

	const variables = useRef({
		isVoiceControl: false,
		voiceControlDirection: 'vertical',
	});

	/*
	 * Functions
	 */

	function updateFocusAfterVoiceControl () {
		const spotItem = Spotlight.getCurrent();
		if (spotItem && uiRef.current.containerRef.current.contains(spotItem)) {
			const
				viewportBounds = uiRef.current.containerRef.current.getBoundingClientRect(),
				spotItemBounds = spotItem.getBoundingClientRect(),
				nodes = Spotlight.getSpottableDescendants(uiRef.current.containerRef.current.dataset.spotlightId),
				first = variables.current.voiceControlDirection === 'vertical' ? 'top' : 'left',
				last = variables.current.voiceControlDirection === 'vertical' ? 'bottom' : 'right';

			if (spotItemBounds[last] < viewportBounds[first] || spotItemBounds[first] > viewportBounds[last]) {
				for (let i = 0; i < nodes.length; i++) {
					const nodeBounds = nodes[i].getBoundingClientRect();
					if (nodeBounds[first] > viewportBounds[first] && nodeBounds[last] < viewportBounds[last]) {
						Spotlight.focus(nodes[i]);
						break;
					}
				}
			}
		}
	}

	function stopVoice () {
		if (variables.current.isVoiceControl) {
			variables.current.isVoiceControl = false;
			updateFocusAfterVoiceControl();
		}
	}

	function isReachedEdge (scrollPos, ltrBound, rtlBound, isRtl = false) {
		const bound = isRtl ? rtlBound : ltrBound;
		return (bound === 0 && scrollPos === 0) || (bound > 0 && scrollPos >= bound - 1);
	}

	function handleVoice (e) {
		const
			isHorizontal = (direction === 'horizontal'),
			isRtl = uiRef.current.rtl,
			{scrollTop, scrollLeft} = uiRef.current,
			{maxLeft, maxTop} = uiRef.current.getScrollBounds(),
			verticalDirection = ['up', 'down', 'top', 'bottom'],
			horizontalDirection = isRtl ? ['right', 'left', 'rightmost', 'leftmost'] : ['left', 'right', 'leftmost', 'rightmost'],
			movement = ['previous', 'next', 'first', 'last'];

		let
			scroll = e && e.detail && e.detail.scroll,
			index = movement.indexOf(scroll);

		if (index > -1) {
			scroll = isHorizontal ? horizontalDirection[index] : verticalDirection[index];
		}

		variables.current.voiceControlDirection = verticalDirection.includes(scroll) && 'vertical' || horizontalDirection.includes(scroll) && 'horizontal' || null;

		// Case 1. Invalid direction
		if (variables.current.voiceControlDirection === null) {
			variables.current.isVoiceControl = false;
		// Case 2. Cannot scroll
		} else if (
			(['up', 'top'].includes(scroll) && isReachedEdge(scrollTop, 0)) ||
			(['down', 'bottom'].includes(scroll) && isReachedEdge(scrollTop, maxTop)) ||
			(['left', 'leftmost'].includes(scroll) && isReachedEdge(scrollLeft, 0, maxLeft, isRtl)) ||
			(['right', 'rightmost'].includes(scroll) && isReachedEdge(scrollLeft, maxLeft, 0, isRtl))
		) {
			if (window.webOSVoiceReportActionResult) {
				window.webOSVoiceReportActionResult({voiceUi: {exception: 'alreadyCompleted'}});
				e.preventDefault();
			}
		// Case 3. Can scroll
		} else {
			variables.current.isVoiceControl = true;
			if (['up', 'down', 'left', 'right'].includes(scroll)) {
				const isPreviousScrollButton = (scroll === 'up') || (scroll === 'left' && !isRtl) || (scroll === 'right' && isRtl);
				onScrollbarButtonClick({isPreviousScrollButton, isVerticalScrollBar: verticalDirection.includes(scroll)});
			} else { // ['top', 'bottom', 'leftmost', 'rightmost'].includes(scroll)
				uiRef.current.scrollTo({align: verticalDirection.includes(scroll) && scroll || (scroll === 'leftmost' && isRtl || scroll === 'rightmost' && !isRtl) && 'right' || 'left'});
			}
			e.preventDefault();
		}
	}

	function addVoiceEventListener (childContainerRef) {
		if (platform.webos) {
			childContainerRef.current.addEventListener('webOSVoice', handleVoice);
			childContainerRef.current.setAttribute('data-webos-voice-intent', 'Scroll');
		}
	}

	function removeVoiceEventListener (childContainerRef) {
		if (platform.webos) {
			childContainerRef.current.removeEventListener('webOSVoice', handleVoice);
			childContainerRef.current.removeAttribute('data-webos-voice-intent');
		}
	}

	/*
	 * Return
	 */

	return {
		addVoiceEventListener,
		removeVoiceEventListener,
		stopVoice
	};
};

export default useEventVoice;
export {
	useEventVoice
};
