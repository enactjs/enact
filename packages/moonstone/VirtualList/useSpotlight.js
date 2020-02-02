import Spotlight from '@enact/spotlight';
import utilDOM from '@enact/ui/Scrollable/utilDOM';
import {useEffect, useRef} from 'react';

const useSpotlightConfig = (props, instances) => {
	const {spottable: {current: {lastFocusedIndex}}} = instances;
	const {spacing, spotlightId} = props;

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
	}, [lastFocusedIndex, spacing, spotlightId]);

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
	const {spotlightId} = props;
	const {spottable, uiChildContainerRef} = instances;

	// Mutable value

	const variables = useRef({
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
				variables.current.preservedIndex = getNumberValue(index);
				variables.current.restoreLastFocused = true;
			}
		}
	}

	function isPlaceholderFocused () {
		const
			childContainerNode = uiChildContainerRef.current,
			current = Spotlight.getCurrent();

		if (current && current.dataset.vlPlaceholder && utilDOM.containsDangerously(childContainerNode, current)) {
			return true;
		}

		return false;
	}

	function restoreFocus () {
		if (
			variables.current.restoreLastFocused &&
			!isPlaceholderFocused()
		) {
			const
				{spotlightId} = this.props,
				node = this.uiRefCurrent.containerRef.current.querySelector(
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
		return (variables.current.restoreLastFocused && numOfItems > 0 && variables.current.preservedIndex < dataSize && (
			variables.current.preservedIndex < moreInfo.firstVisibleIndex || variables.current.preservedIndex > moreInfo.lastVisibleIndex
		));
	}

	function preserveLastFocus (index) {
		variables.current.preservedIndex = index;
		variables.current.restoreLastFocused = true;
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
	useSpotlightConfig
	useSpotlightRestore
};
