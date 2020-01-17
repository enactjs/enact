import Spotlight, {getDirection} from '@enact/spotlight';
import Accelerator from '@enact/spotlight/Accelerator';
import Pause from '@enact/spotlight/Pause';
import {Spottable, spottableClass} from '@enact/spotlight/Spottable';
import {useCallback, useEffect, useRef} from 'react';

import {dataIndexAttribute} from '../Scrollable';

import useEventKey from './useEventKey';
import useOverscrollEffect from './useOverscrollEffect';
import useSpotlightConfig from './useSpotlightConfig';
import useSpotlightRestore from './useSpotlightRestore';

const SpotlightAccelerator = new Accelerator();
const SpotlightPlaceholder = Spottable('div');

const
	dataContainerDisabledAttribute = 'data-spotlight-container-disabled',
	JS = 'JS',
	// using 'bitwise or' for string > number conversion based on performance: https://jsperf.com/convert-string-to-number-techniques/7
	getNumberValue = (index) => index | 0,
	spottableSelector = `.${spottableClass}`;

const useSpottable = (props, instances, dependencies) => {
	/*
	 * Dependencies
	 */

	const {virtualListBase} = instances;
	const {type} = dependencies;

	/*
	 * Instance
	 */

	const variables = useRef({
		isScrolledBy5way: false,
		isScrolledByJump: false,
		lastFocusedIndex: null,
		nodeIndexToBeFocused: false,
		pause: new Pause('VirtualListBase')
	});

	const containerNode =
		virtualListBase.current &&
		virtualListBase.current.uiRefCurrent &&
		virtualListBase.current.uiRefCurrent.containerRef &&
		virtualListBase.current.uiRefCurrent.containerRef.current || null;
	const {pause} = variables.current;

	/*
	 * Hooks
	 */

	useSpotlightConfig(props, {spottable: variables});

	const [isOverscrollEffect, setOverscrollEffect] = useOverscrollEffect();

	const {addGlobalKeyDownEventListener, removeGlobalKeyDownEventListener} = useEventKey(props, {virtualListBase}, {
		containerNode,
		handlePageUpDownKeyDown: () => {
			variables.current.isScrolledBy5way = false;
		},
		handleDirectionKeyDown: (ev, eventType, param) => {
			const
				{keyCode} = ev,
				direction = getDirection(keyCode);

			switch (eventType) {
				case 'acceleratedKeyDown': onAcceleratedKeyDown(param); break;
				case 'keyDown':
					if (Spotlight.move(direction)) {
						const nextTargetIndex = Spotlight.getCurrent().dataset.index;

						ev.preventDefault();
						ev.stopPropagation();

						if (typeof nextTargetIndex === 'string') {
							onAcceleratedKeyDown({...param, nextIndex: getNumberValue(nextTargetIndex)});
						}
					}
					break;
				case 'keyLeave': SpotlightAccelerator.reset(); break;
			}
		},
		handle5WayKeyUp: () => {
			SpotlightAccelerator.reset();
		},
		SpotlightAccelerator
	});

	const {
		handlePlaceholderFocus,
		handleRestoreLastFocus,
		preserveLastFocus,
		updateStatesAndBounds
	} = useSpotlightRestore(props, instances);

	const setContainerDisabled = useCallback((bool) => {
		if (containerNode) {
			containerNode.setAttribute(dataContainerDisabledAttribute, bool);

			if (bool) {
				addGlobalKeyDownEventListener(handleGlobalKeyDown);
			} else {
				removeGlobalKeyDownEventListener();
			}
		}
	}, [addGlobalKeyDownEventListener, containerNode, handleGlobalKeyDown, removeGlobalKeyDownEventListener]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	function handleGlobalKeyDown () {
		setContainerDisabled(false);
	}

	useEffect(() => {
		return () => {
			// TODO: Fix eslint
			pause.resume(); // eslint-disable-line react-hooks/exhaustive
			SpotlightAccelerator.reset();

			setContainerDisabled(false);
		};
	}, [pause, setContainerDisabled]);

	/*
	 * Functions
	 */

	function getNodeIndexToBeFocused () {
		return variables.current.nodeIndexToBeFocused;
	}

	function setNodeIndexToBeFocused (index) {
		variables.current.nodeIndexToBeFocused = index;
	}

	function isNeededScrollingPlaceholder () {
		return variables.current.nodeIndexToBeFocused != null && Spotlight.isPaused();
	}

	function onAcceleratedKeyDown ({isWrapped, keyCode, nextIndex, repeat, target}) {
		const {cbScrollTo, dataSize, spacing, wrap} = props;
		const {dimensionToExtent, primary: {clientSize, gridSize}, scrollPositionTarget} = virtualListBase.current.uiRefCurrent;
		const index = getNumberValue(target.dataset.index);

		variables.current.isScrolledBy5way = false;
		variables.current.isScrolledByJump = false;

		if (nextIndex >= 0) {
			const
				row = Math.floor(index / dimensionToExtent),
				nextRow = Math.floor(nextIndex / dimensionToExtent),
				start = virtualListBase.current.uiRefCurrent.getGridPosition(nextIndex).primaryPosition,
				end = virtualListBase.current.uiRefCurrent.getGridPosition(nextIndex).primaryPosition + gridSize;
			let isNextItemInView = false;

			if (props.itemSizes) {
				isNextItemInView = virtualListBase.current.uiRefCurrent.itemPositions[nextIndex].position >= scrollPositionTarget &&
					virtualListBase.current.uiRefCurrent.getItemBottomPosition(nextIndex) <= scrollPositionTarget + clientSize;
			} else {
				const
					firstFullyVisibleIndex = Math.ceil(scrollPositionTarget / gridSize) * dimensionToExtent,
					lastFullyVisibleIndex = Math.min(
						dataSize - 1,
						Math.floor((scrollPositionTarget + clientSize + spacing) / gridSize) * dimensionToExtent - 1
					);
				isNextItemInView = nextIndex >= firstFullyVisibleIndex && nextIndex <= lastFullyVisibleIndex;
			}

			variables.current.lastFocusedIndex = nextIndex;

			if (isNextItemInView) {
				// The next item could be still out of viewport. So we need to prevent scrolling into view with `isScrolledBy5way` flag.
				variables.current.isScrolledBy5way = true;
				focusByIndex(nextIndex);
				variables.current.isScrolledBy5way = false;
			} else if (row === nextRow && (start < scrollPositionTarget || end > scrollPositionTarget + clientSize)) {
				focusByIndex(nextIndex);
			} else {
				variables.current.isScrolledBy5way = true;
				setOverscrollEffect(isWrapped);

				if (isWrapped && (
					containerNode.querySelector(`[data-index='${nextIndex}']${spottableSelector}`) == null
				)) {
					if (wrap === true) {
						pause.pause();
						target.blur();
					} else {
						focusByIndex(nextIndex);
					}

					setNodeIndexToBeFocused(nextIndex);
				} else {
					focusByIndex(nextIndex);
				}

				cbScrollTo({
					index: nextIndex,
					stickTo: index < nextIndex ? 'end' : 'start',
					animate: !(isWrapped && wrap === 'noAnimation')
				});
			}
		} else if (!repeat && Spotlight.move(getDirection(keyCode))) {
			SpotlightAccelerator.reset();
		}
	}

	/**
	 * Focus on the Node of the VirtualList item
	 */

	function focusOnNode (node) {
		if (node) {
			Spotlight.focus(node);
		}
	}

	function focusByIndex (index) {
		const item = containerNode.querySelector(`[data-index='${index}']${spottableSelector}`);

		if (!item && index >= 0 && index < props.dataSize) {
			// Item is valid but since the the dom doesn't exist yet, we set the index to focus after the ongoing update
			preserveLastFocus(index);
		} else {
			if (isOverscrollEffect) {
				SpotlightAccelerator.reset();
				setOverscrollEffect(false);
			}

			pause.resume();
			focusOnNode(item);
			setNodeIndexToBeFocused(null);
			variables.current.isScrolledByJump = false;
		}
	}

	function initItemRef (ref, index) {
		if (ref) {
			if (type === JS) {
				focusByIndex(index);
			} else {
				// If focusing the item of VirtuallistNative, `onFocus` in Scrollable will be called.
				// Then VirtualListNative tries to scroll again differently from VirtualList.
				// So we would like to skip `focus` handling when focusing the item as a workaround.
				variables.current.isScrolledByJump = true;
				focusByIndex(index);
			}
		}
	}

	function calculatePositionOnFocus ({item, scrollPosition = virtualListBase.current.uiRefCurrent.scrollPosition}) {
		const
			{pageScroll} = props,
			{numOfItems} = virtualListBase.current.uiRefCurrent.state,
			{primary} = virtualListBase.current.uiRefCurrent,
			offsetToClientEnd = primary.clientSize - primary.itemSize,
			focusedIndex = getNumberValue(item.getAttribute(dataIndexAttribute));

		if (!isNaN(focusedIndex)) {
			let gridPosition = virtualListBase.current.uiRefCurrent.getGridPosition(focusedIndex);

			if (numOfItems > 0 && focusedIndex % numOfItems !== variables.current.lastFocusedIndex % numOfItems) {
				const node = virtualListBase.current.uiRefCurrent.getItemNode(variables.current.lastFocusedIndex);

				if (node) {
					node.blur();
				}
			}
			setNodeIndexToBeFocused(null);
			variables.current.lastFocusedIndex = focusedIndex;

			if (primary.clientSize >= primary.itemSize) {
				if (gridPosition.primaryPosition > scrollPosition + offsetToClientEnd) { // forward over
					gridPosition.primaryPosition -= pageScroll ? 0 : offsetToClientEnd;
				} else if (gridPosition.primaryPosition >= scrollPosition) { // inside of client
					if (type === JS) {
						gridPosition.primaryPosition = scrollPosition;
					} else {
						// This code uses the trick to change the target position slightly which will not affect the actual result
						// since a browser ignore `scrollTo` method if the target position is same as the current position.
						gridPosition.primaryPosition = scrollPosition + (virtualListBase.current.uiRefCurrent.scrollPosition === scrollPosition ? 0.1 : 0);
					}
				} else { // backward over
					gridPosition.primaryPosition -= pageScroll ? offsetToClientEnd : 0;
				}
			}

			// Since the result is used as a target position to be scrolled,
			// scrondaryPosition should be 0 here.
			gridPosition.secondaryPosition = 0;

			return virtualListBase.current.uiRefCurrent.gridPositionToItemPosition(gridPosition);
		}
	}

	function shouldPreventScrollByFocus () {
		return ((type === JS) ? (variables.current.isScrolledBy5way) : (variables.current.isScrolledBy5way || variables.current.isScrolledByJump));
	}

	function shouldPreventOverscrollEffect () {
		return isOverscrollEffect;
	}

	function setLastFocusedNode (node) {
		variables.current.lastFocusedIndex = node.dataset && getNumberValue(node.dataset.index);
	}

	function getScrollBounds () {
		return virtualListBase.current.uiRefCurrent.getScrollBounds();
	}

	/*
	 * Return
	 */

	return {
		calculatePositionOnFocus,
		getNodeIndexToBeFocused,
		getScrollBounds,
		handlePlaceholderFocus,
		handleRestoreLastFocus,
		initItemRef,
		isNeededScrollingPlaceholder,
		setContainerDisabled,
		setLastFocusedNode,
		shouldPreventOverscrollEffect,
		shouldPreventScrollByFocus,
		SpotlightPlaceholder,
		updateStatesAndBounds
	};
};

export default useSpottable;
export {
	useSpottable
};
