import Spotlight from '@enact/spotlight';
import utilDOM from '@enact/ui/Scrollable/utilDOM';
import {useEffect, useRef} from 'react';

const useSpotlightConfig = (props, instances) => {
	const {spottable: {current: {lastFocusedIndex}}} = instances;

	// Hooks

	useEffect(() => {
		const lastFocusedPersist = () => {
			if (lastFocusedIndex != null) {
				return {
					container: false,
					element: true,
					key: lastFocusedIndex
				};
			}
		};

		function configureSpotlight () {
			const {spacing, spotlightId} = props;

			Spotlight.set(spotlightId, {
				enterTo: 'last-focused',
				/*
				 * Returns the data-index as the key for last focused
				 */
				lastFocusedPersist,
				/*
				 * Restores the data-index into the placeholder if its the only element. Tries to find a
				 * matching child otherwise.
				 */
				lastFocusedRestore,
				/*
				 * Directs spotlight focus to favor straight elements that are within range of `spacing`
				 * over oblique elements, like scroll buttons.
				 */
				obliqueMultiplier: spacing > 0 ? spacing : 1
			});
		}

		configureSpotlight();
	}, [lastFocusedIndex]);

	// Functions

	/*
	 * Restores the data-index into the placeholder if it exists. Tries to find a matching child
	 * otherwise.
	 */
	function lastFocusedRestore ({key}, all) {
		const placeholder = all.find(el => 'vlPlaceholder' in el.dataset);

		if (placeholder) {
			placeholder.dataset.index = key;

			return placeholder;
		}

		return all.reduce((focused, node) => {
			return focused || Number(node.dataset.index) === key && node;
		}, null);
	}
};

const getNumberValue = (index) => index | 0;

const useSpotlightRestore = (props, instances) => {
	const {spottable, uiChildAdapter, uiChildContainerRef} = instances;

	// Mutable value

	const mutableRef = useRef({
		preservedIndex: false,
		restoreLastFocused: false
	});

	// Hooks

	useEffect(restoreFocus);

	// Functions

	function handlePlaceholderFocus (ev) {
		const placeholder = ev.currentTarget;

		if (placeholder) {
			const index = placeholder.dataset.index;

			if (index) {
				mutableRef.current.preservedIndex = getNumberValue(index);
				mutableRef.current.restoreLastFocused = true;
			}
		}
	}

	function isPlaceholderFocused () {
		const current = Spotlight.getCurrent();

		if (current && current.dataset.vlPlaceholder && utilDOM.containsDangerously(uiChildContainerRef.current, current)) {
			return true;
		}

		return false;
	}

	function restoreFocus () {
		if (
			mutableRef.current.restoreLastFocused &&
			!isPlaceholderFocused()
		) {
			const
				{spotlightId} = props,
				node = uiChildContainerRef.current.querySelector(
					`[data-spotlight-id="${spotlightId}"] [data-index="${mutableRef.current.preservedIndex}"]`
				);

			if (node) {
				// if we're supposed to restore focus and virtual list has positioned a set of items
				// thatx includes lastFocusedIndex, clear the indicator
				mutableRef.current.restoreLastFocused = false;

				// try to focus the last focused item
				spottable.current.isScrolledByJump = true;
				const foundLastFocused = Spotlight.focus(node);
				spottable.current.isScrolledByJump = false;

				// but if that fails (because it isn't found or is disabled), focus the container so
				// spotlight isn't lost
				if (!foundLastFocused) {
					mutableRef.current.restoreLastFocused = true;
					Spotlight.focus(spotlightId);
				}
			}
		}
	}

	function handleRestoreLastFocus ({firstIndex, lastIndex}) {
		if (mutableRef.current.restoreLastFocused && mutableRef.current.preservedIndex >= firstIndex && mutableRef.current.preservedIndex <= lastIndex) {
			restoreFocus();
		}
	}

	function updateStatesAndBounds ({dataSize, moreInfo, numOfItems}) {
		return (mutableRef.current.restoreLastFocused && numOfItems > 0 && mutableRef.current.preservedIndex < dataSize && (
			mutableRef.current.preservedIndex < moreInfo.firstVisibleIndex || mutableRef.current.preservedIndex > moreInfo.lastVisibleIndex
		));
	}

	function preserveLastFocus (index) {
		mutableRef.current.preservedIndex = index;
		mutableRef.current.restoreLastFocused = true;
	}

	// Return

	return {
		handlePlaceholderFocus,
		handleRestoreLastFocus,
		preserveLastFocus,
		updateStatesAndBounds
	};
};

export {
	useSpotlightConfig,
	useSpotlightRestore
};
