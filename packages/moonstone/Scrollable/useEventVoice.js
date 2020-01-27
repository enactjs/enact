import platform from '@enact/core/platform';
import Spotlight from '@enact/spotlight';
import useDOM from '@enact/ui/Scrollable/useDOM';
import useEvent from '@enact/ui/Scrollable/useEvent';
import {useRef} from 'react';

const useEventVoice = (props, instances, context) => {
	const {direction} = props;
	const {scrollableContainerRef, uiScrollableAdapter} = instances;
	const {onScrollbarButtonClick} = context;

	// Mutable value

	const variables = useRef({
		isVoiceControl: false,
		voiceControlDirection: 'vertical'
	});

	// Functions

	const updateFocusAfterVoiceControl = () => {
		const
			spotItem = Spotlight.getCurrent(),
			scrollableContainerNode = scrollableContainerRef.current;

		if (useDOM().containsDangerously(scrollableContainerNode, spotItem)) {
			const
				viewportBounds = scrollableContainerNode.getBoundingClientRect(),
				spotItemBounds = spotItem.getBoundingClientRect(),
				nodes = Spotlight.getSpottableDescendants(scrollableContainerNode.dataset.spotlightId),
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

	const isReachedEdge = (scrollPos, ltrBound, rtlBound, isRtl = false) => {
		const bound = isRtl ? rtlBound : ltrBound;
		return (bound === 0 && scrollPos === 0) || (bound > 0 && scrollPos >= bound - 1);
	}

	const handleVoice = (e) => {
		const
			isHorizontal = (direction === 'horizontal'),
			isRtl = uiScrollableAdapter.current.rtl,
			{scrollTop, scrollLeft} = uiScrollableAdapter.current,
			{maxLeft, maxTop} = uiScrollableAdapter.current.getScrollBounds(),
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
				uiScrollableAdapter.current.scrollTo({align: verticalDirection.includes(scroll) && scroll || (scroll === 'leftmost' && isRtl || scroll === 'rightmost' && !isRtl) && 'right' || 'left'});
			}

			e.preventDefault();
		}
	}

	function addVoiceEventListener (uiChildContainerRef) {
		if (platform.webos) {
			useEvent('webOSVoice').addEventListener(uiChildContainerRef, handleVoice);
			uiChildContainerRef.current.setAttribute('data-webos-voice-intent', 'Scroll');
		}
	}

	function removeVoiceEventListener (uiChildContainerRef) {
		if (platform.webos) {
			useEvent('webOSVoice').removeEventListener(uiChildContainerRef, handleVoice);
			uiChildContainerRef.current.removeAttribute('data-webos-voice-intent');
		}
	}

	// Return

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
