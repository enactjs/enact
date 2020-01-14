import {is} from '@enact/core/keymap';
import clamp from 'ramda/src/clamp';
import {useEffect} from 'react';

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

// scrollerNode -> containerNode
const useKey = (instance, props, {
	containerNode,
	getDirection,
	getTargetByDirectionFromElement,
	handlerGlobalKeyDownCB,
	handlePageUpDownKeyDownCB,
	handleDirectionKeyDownCB,
	handle5WayKeyUpCB,
	processKey,
	setPointerMode,
}) => {
	const {
		uiRefCurrent
    } = instance.current;
    const {
		spotlightId
	} = props;

	useEffect(() => {
		// componentDidMount
		if (containerNode && containerNode.addEventListener) {
			containerNode.addEventListener('keydown', handleKeyDown, {capture: true});
			containerNode.addEventListener('keyup', handleKeyUp, {capture: true});
		}

		// componentWillUnmount
		return () => {
			if (containerNode && containerNode.removeEventListener) {
				containerNode.removeEventListener('keydown', handleKeyDown, {capture: true});
				containerNode.removeEventListener('keyup', handleKeyUp, {capture: true});
			}
		};
	}, [containerNode]);	// TODO : Handle exhaustive-deps ESLint rule.

	function findSpottableItem (indexFrom, indexTo) {
		const {dataSize} = props;

		if (indexFrom < 0 && indexTo < 0 || indexFrom >= dataSize && indexTo >= dataSize) {
			return -1;
		} else {
			return clamp(0, dataSize - 1, indexFrom);
		}
	}

	function getNextIndex ({index, keyCode, repeat}) {
		const {dataSize, rtl, wrap} = props;
		const {isPrimaryDirectionVertical, dimensionToExtent} = uiRefCurrent;
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
	}

	/**
	 * Handle `onKeyDown` event
	 */

	function handleKeyDown (ev) {
		const {keyCode, target} = ev;
		const direction = getDirection(keyCode);

		if (direction) {
			setPointerMode(false);

			if (processKey(ev, nop)) {
				ev.stopPropagation();
			} else {
				const {repeat} = ev;
				const {focusableScrollbar, isHorizontalScrollbarVisible, isVerticalScrollbarVisible} = props;
				const {dimensionToExtent, isPrimaryDirectionVertical} = uiRefCurrent;
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

						handleDirectionKeyDownCB(ev, 'acceleratedKeyDown', {isWrapped, keyCode, nextIndex, repeat, target});
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
							handleDirectionKeyDownCB(ev, 'keyDown', {keyCode, nextIndex: getNumberValue(nextTargetIndex), repeat, target});
						}
					}
				} else {
					const possibleTarget = getTargetByDirectionFromElement(direction, target);
					if (possibleTarget && !ev.currentTarget.contains(possibleTarget)) {
						isLeaving = true;
					}
				}

				if (isLeaving) {
					handleDirectionKeyDownCB(ev, 'keyLeave');
				}
			}
		} else if (isPageUp(keyCode) || isPageDown(keyCode)) {
			handlePageUpDownKeyDownCB();
		}
	}

	function handleKeyUp ({keyCode}) {
		if (getDirection(keyCode) || isEnter(keyCode)) {
			handle5WayKeyUpCB();
		}
	}

	/**
	 * Handle global `onKeyDown` event
	 */

	function handleGlobalKeyDown () {
		handlerGlobalKeyDownCB();
	}

	function addGlobalKeyDownEventListener () {
		document.addEventListener('keydown', handleGlobalKeyDown, {capture: true});
	}

	function removeGlobalKeyDownEventListener () {
		document.removeEventListener('keydown', handleGlobalKeyDown, {capture: true});
	}

	return {
		addGlobalKeyDownEventListener,
		removeGlobalKeyDownEventListener
	};
};

export {
	useKey
};
