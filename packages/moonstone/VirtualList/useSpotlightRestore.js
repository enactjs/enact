import Spotlight from '@enact/spotlight';
import {useEffect, useRef} from 'react';

const getNumberValue = (index) => index | 0;

const useSpotlightRestore = (props, instances) => {
	/*
	 * Dependencies
	 */

	const {spotlightId} = props;
	const {spottable, uiChildAdapter} = instances;

	/*
	 * Instance
	 */

	const variables = useRef({
		preservedIndex: false,
		restoreLastFocused: false
	});

	/*
	 * Hooks
	 */

	useEffect(restoreFocus);

	/*
	 * Functions
	 */

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
		const containerNode = uiChildAdapter.current.containerRef.current;
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
			const containerNode = uiChildAdapter.current.containerRef.current;
			const node = containerNode && containerNode.querySelector(
				`[data-spotlight-id="${spotlightId}"] [data-index="${variables.current.preservedIndex}"]`
			);

			if (node) {
				// if we're supposed to restore focus and virtual list has positioned a set of items
				// thatx includes lastFocusedIndex, clear the indicator
				variables.current.restoreLastFocused = false;

				// try to focus the last focused item
				spottable.current.isScrolledByJump = true;
				const foundLastFocused = Spotlight.focus(node);
				spottable.current.isScrolledByJump = false;

				// but if that fails (because it isn't found or is disabled), focus the container so
				// spotlight isn't lost
				if (!foundLastFocused) {
					variables.current.restoreLastFocused = true;
					Spotlight.focus(spotlightId);
				}
			}
		}
	}

	function handleRestoreLastFocus ({firstIndex, lastIndex}) {
		if (variables.current.restoreLastFocused && variables.current.preservedIndex >= firstIndex && variables.current.preservedIndex <= lastIndex) {
			restoreFocus();
		}
	}

	function updateStatesAndBounds ({dataSize, moreInfo, numOfItems}) {
		// TODO check preservedIndex
		// const {preservedIndex} = this;

		return (variables.current.restoreLastFocused && numOfItems > 0 && variables.current.preservedIndex < dataSize && (
			variables.current.preservedIndex < moreInfo.firstVisibleIndex || variables.current.preservedIndex > moreInfo.lastVisibleIndex
		));
	}

	function preserveLastFocus (index) {
		variables.current.preservedIndex = index;
		variables.current.restoreLastFocused = true;
	}

	/*
	 * Return
	 */

	return {
		handlePlaceholderFocus,
		handleRestoreLastFocus,
		preserveLastFocus,
		updateStatesAndBounds
	};
};

export default useSpotlightRestore;
export {
	useSpotlightRestore
};
