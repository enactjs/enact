import Spotlight from '@enact/spotlight';
import {useEffect, useRef} from 'react';

const getNumberValue = (index) => index | 0;

const useRestoreSpotlight = (instance, props) => {
	const {
		uiRefCurrent
	} = instance.current;
	const {
		spotlightId
	} = props;

	const variables = useRef({
		preservedIndex: false,
		restoreLastFocused: false
	});

	const containerNode = uiRefCurrent && uiRefCurrent.containerRef && uiRefCurrent.containerRef.current || null;

	// componentDidUpdate
	useEffect(restoreFocus);	// TODO : Handle exhaustive-deps ESLint rule.

	// Exported
	function handlePlaceholderFocus (ev) {
		const placeholder = ev.currentTarget;

		if (placeholder) {
			const index = placeholder.dataset.index;

			if (index) {
				variables.current.preservedIndex = getNumberValue(index);
				variables.current.restoreLastFocused = true;
			}
		}
	}

	function isPlaceholderFocused () {
		const current = Spotlight.getCurrent();

		if (current && current.dataset.vlPlaceholder && containerNode && containerNode.contains(current)) {
			return true;
		}

		return false;
	}

	function restoreFocus () {
		if (
			variables.current.restoreLastFocused &&
			!isPlaceholderFocused()
		) {
			const node = containerNode && containerNode.querySelector(
					`[data-spotlight-id="${spotlightId}"] [data-index="${variables.current.preservedIndex}"]`
			);

			if (node) {
				// if we're supposed to restore focus and virtual list has positioned a set of items
				// that includes lastFocusedIndex, clear the indicator
				variables.current.restoreLastFocused = false;

				// try to focus the last focused item
				instance.current.isScrolledByJump = true;
				const foundLastFocused = Spotlight.focus(node);
				instance.current.isScrolledByJump = false;

				// but if that fails (because it isn't found or is disabled), focus the container so
				// spotlight isn't lost
				if (!foundLastFocused) {
					variables.current.restoreLastFocused = true;
					Spotlight.focus(spotlightId);
				}
			}
		}
	}

	// Exported
	function handleRestoreLastFocus ({firstIndex, lastIndex}) {
		if (variables.current.restoreLastFocused && variables.current.preservedIndex >= firstIndex && variables.current.preservedIndex <= lastIndex) {
			restoreFocus();
		}
	}

	// Exported
	function updateStatesAndBounds ({dataSize, moreInfo, numOfItems}) {
		// TODO check preservedIndex
		// const {preservedIndex} = this;

		return (variables.current.restoreLastFocused && numOfItems > 0 && variables.current.preservedIndex < dataSize && (
			variables.current.preservedIndex < moreInfo.firstVisibleIndex || variables.current.preservedIndex > moreInfo.lastVisibleIndex
		));
	}

	// Exported
	function preserveLastFocus (index) {
		variables.current.preservedIndex = index;
		variables.current.restoreLastFocused = true;
	}

	return {
		handlePlaceholderFocus,
		handleRestoreLastFocus,
		preserveLastFocus,
		updateStatesAndBounds,
	}
};

export {
	useRestoreSpotlight
};
