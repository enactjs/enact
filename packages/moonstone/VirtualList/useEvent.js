import {is} from '@enact/core/keymap';
import Spotlight, {getDirection} from '@enact/spotlight';
import {getTargetByDirectionFromElement} from '@enact/spotlight/src/target';
import utilDOM from '@enact/ui/Scrollable/utilDOM';
import utilEvent from '@enact/ui/Scrollable/utilEvent';
import clamp from 'ramda/src/clamp';
import {useCallback, useEffect, useRef} from 'react';

const
	isDown = is('down'),
	isEnter = is('enter'),
	isLeft = is('left'),
	isPageUp = is('pageUp'),
	isPageDown = is('pageDown'),
	isRight = is('right'),
	isUp = is('up'),
	nop = () => {},
	getNumberValue = (index) => index | 0;

const useEventKey = (props, instances, context) => {
	const {dataSize, focusableScrollbar, isHorizontalScrollbarVisible, isVerticalScrollbarVisible,
		rtl, spotlightId, wrap} = props;
	const {uiChildContainerRef, uiScrollableAdapter} = instances;
	const {
		handle5WayKeyUp,
		handleDirectionKeyDown,
		handlePageUpDownKeyDown,
		SpotlightAccelerator
	} = context;

	// Mutable value

	const variables = useRef({
		fn: null
	});

	// Functions

	const findSpottableItem = useCallback((indexFrom, indexTo) => {
		const {dataSize} = props;
		if (indexFrom < 0 && indexTo < 0 || indexFrom >= dataSize && indexTo >= dataSize) {
			return -1;
		} else {
			return clamp(0, dataSize - 1, indexFrom);
		}
	}, [props]);

	const getNextIndex = useCallback(({index, keyCode, repeat}) => {
		const {dataSize, rtl, wrap} = props;
		const {isPrimaryDirectionVertical, dimensionToExtent} = uiScrollableAdapter.current;
		const column = index % dimensionToExtent;
		const row = (index - column) % dataSize / dimensionToExtent;
		const isDownKey = isDown(keyCode);
		const isLeftMovement = (!rtl && isLeft(keyCode)) || (rtl && isRight(keyCode));
		const isRightMovement = (!rtl && isRight(keyCode)) || (rtl && isLeft(keyCode));
		const isUpKey = isUp(keyCode);
		const isNextRow = index + dimensionToExtent < dataSize;
		const isNextAdjacent = column < dimensionToExtent - 1 && index < (dataSize - 1);
		const isBackward = (
			isPrimaryDirectionVertical && isUpKey ||
			!isPrimaryDirectionVertical && isLeftMovement ||
			null
		);
		const isForward = (
			isPrimaryDirectionVertical && isDownKey ||
			!isPrimaryDirectionVertical && isRightMovement ||
			null
		);
		let isWrapped = false;
		let nextIndex = -1;
		let targetIndex = -1;

		if (index >= 0) {
			if (isPrimaryDirectionVertical) {
				if (isUpKey && row) {
					targetIndex = index - dimensionToExtent;
				} else if (isDownKey && isNextRow) {
					targetIndex = index + dimensionToExtent;
				} else if (isLeftMovement && column) {
					targetIndex = index - 1;
				} else if (isRightMovement && isNextAdjacent) {
					targetIndex = index + 1;
				}
			} else if (isLeftMovement && row) {
				targetIndex = index - dimensionToExtent;
			} else if (isRightMovement && isNextRow) {
				targetIndex = index + dimensionToExtent;
			} else if (isUpKey && column) {
				targetIndex = index - 1;
			} else if (isDownKey && isNextAdjacent) {
				targetIndex = index + 1;
			}

			if (targetIndex >= 0) {
				nextIndex = targetIndex;
			}
		}

		if (!repeat && nextIndex === -1 && wrap) {
			if (isForward && findSpottableItem((row + 1) * dimensionToExtent, dataSize) < 0) {
				nextIndex = findSpottableItem(0, index);
				isWrapped = true;
			} else if (isBackward && findSpottableItem(-1, row * dimensionToExtent - 1) < 0) {
				nextIndex = findSpottableItem(dataSize, index);
				isWrapped = true;
			}
		}

		return {isDownKey, isUpKey, isLeftMovement, isRightMovement, isWrapped, nextIndex};
	}, [dataSize, findSpottableItem, rtl, uiScrollableAdapter, wrap]);

	// Hooks

	useEffect(() => {
		function handleKeyDown (ev) {
			const {keyCode, target} = ev;
			const direction = getDirection(keyCode);

			if (direction) {
				Spotlight.setPointerMode(false);

				if (SpotlightAccelerator.processKey(ev, nop)) {
					ev.stopPropagation();
				} else {
					const {repeat} = ev;
					const {focusableScrollbar, isHorizontalScrollbarVisible, isVerticalScrollbarVisible, spotlightId} = props;
					const {dimensionToExtent, isPrimaryDirectionVertical} = uiScrollableAdapter.current;
					const targetIndex = target.dataset.index;
					const isScrollButton = (
						// if target has an index, it must be an item so can't be a scroll button
						!targetIndex &&
						// if it lacks an index and is inside the scroller, it must be a button
						target.matches(`[data-spotlight-id="${spotlightId}"] *`)
					);
					const index = !isScrollButton ? getNumberValue(targetIndex) : -1;
					const {isDownKey, isUpKey, isLeftMovement, isRightMovement, isWrapped, nextIndex} = getNextIndex({index, keyCode, repeat});
					const directions = {};
					let isLeaving = false;
					let isScrollbarVisible;

					if (isPrimaryDirectionVertical) {
						directions.left = isLeftMovement;
						directions.right = isRightMovement;
						directions.up = isUpKey;
						directions.down = isDownKey;
						isScrollbarVisible = isVerticalScrollbarVisible;
					} else {
						directions.left = isUpKey;
						directions.right = isDownKey;
						directions.up = isLeftMovement;
						directions.down = isRightMovement;
						isScrollbarVisible = isHorizontalScrollbarVisible;
					}

					if (!isScrollButton) {
						if (nextIndex >= 0) {
							ev.preventDefault();
							ev.stopPropagation();

							handleDirectionKeyDown(ev, 'acceleratedKeyDown', {isWrapped, keyCode, nextIndex, repeat, target});
						} else {
							const {dataSize} = props;
							const column = index % dimensionToExtent;
							const row = (index - column) % dataSize / dimensionToExtent;

							isLeaving = directions.up && row === 0 ||
								directions.down && row === Math.floor((dataSize - 1) % dataSize / dimensionToExtent) ||
								directions.left && column === 0 ||
								directions.right && (!focusableScrollbar || !isScrollbarVisible) && (column === dimensionToExtent - 1 || index === dataSize - 1 && row === 0);

							if (repeat && isLeaving) {
								ev.preventDefault();
								ev.stopPropagation();
							} else if (!isLeaving) {
								handleDirectionKeyDown(ev, 'keyDown', {keyCode, repeat, target});
							}
						}
					} else {
						const possibleTarget = getTargetByDirectionFromElement(direction, target);

						if (!utilDOM.containsDangerously(ev.currentTarget, possibleTarget)) {
							isLeaving = true;
						}
					}

					if (isLeaving) {
						handleDirectionKeyDown(ev, 'keyLeave');
					}
				}
			} else if (isPageUp(keyCode) || isPageDown(keyCode)) {
				handlePageUpDownKeyDown();
			}
		}

		function handleKeyUp ({keyCode}) {
			if (getDirection(keyCode) || isEnter(keyCode)) {
				handle5WayKeyUp();
			}
		}

		const scrollerNode = document.querySelector(`[data-spotlight-id="${props.spotlightId}"]`);

		utilEvent('keydown').addEventListener(scrollerNode, handleKeyDown, {capture: true});
		utilEvent('keyup').addEventListener(scrollerNode, handleKeyUp, {capture: true});

		return () => {
			utilEvent('keydown').removeEventListener(scrollerNode, handleKeyDown, {capture: true});
			utilEvent('keyup').removeEventListener(scrollerNode, handleKeyUp, {capture: true});
		};
	}, [
		uiChildContainerRef, dataSize, focusableScrollbar, getNextIndex,
		handle5WayKeyUp, handleDirectionKeyDown, handlePageUpDownKeyDown,
		isHorizontalScrollbarVisible, isVerticalScrollbarVisible,
		spotlightId, SpotlightAccelerator, uiChildAdapter
	]);

	// Functions

	function addGlobalKeyDownEventListener (fn) {
		variables.current.fn = fn;
		utilEvent('keydown').addEventListener(document, variables.current.fn, {capture: true});
	}

	function removeGlobalKeyDownEventListener () {
		utilEvent('keydown').removeEventListener(document, variables.current.fn, {capture: true});
		variables.current.fn = null;
	}

	// Return

	return {
		addGlobalKeyDownEventListener,
		removeGlobalKeyDownEventListener
	};
};

export default useEventKey;
export {
	useEventKey
};
