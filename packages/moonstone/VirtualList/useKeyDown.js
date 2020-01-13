import {is} from '@enact/core/keymap';
import clamp from 'ramda/src/clamp';
import Spotlight, {getDirection} from '@enact/spotlight';
import Accelerator from '@enact/spotlight/Accelerator';
import {Spottable, spottableClass} from '@enact/spotlight/Spottable';
import {useEffect} from 'react';

import {getNumberValue} from './util';

const SpotlightAccelerator = new Accelerator();
const SpotlightPlaceholder = Spottable('div');

const JS = 'JS';
const spottableSelector = `.${spottableClass}`;
const
    isDown = is('down'),
    isEnter = is('enter'),
    isLeft = is('left'),
    isPageUp = is('pageUp'),
    isPageDown = is('pageDown'),
    isRight = is('right'),
    isUp = is('up');

const useKeyDown = ({
    isScrolledBy5way,
    isScrolledByJump,
    lastFocusedIndex,
    isWrappedBy5way,
    nodeIndexToBeFocused,
    pause,
    uiRefCurrent,
}, props) => {
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

    function onAcceleratedKeyDown ({isWrapped, keyCode, nextIndex, repeat, target}) {
        const {cbScrollTo, dataSize, spacing, wrap} = props;
        const {dimensionToExtent, primary: {clientSize, gridSize}, scrollPositionTarget} = uiRefCurrent;
        const index = getNumberValue(target.dataset.index);

        isScrolledBy5way = false;
        isScrolledByJump = false;

        if (nextIndex >= 0) {
            const
                row = Math.floor(index / dimensionToExtent),
                nextRow = Math.floor(nextIndex / dimensionToExtent),
                start = uiRefCurrent.getGridPosition(nextIndex).primaryPosition,
                end = uiRefCurrent.getGridPosition(nextIndex).primaryPosition + gridSize;
            let isNextItemInView = false;

            if (props.itemSizes) {
                isNextItemInView = uiRefCurrent.itemPositions[nextIndex].position >= scrollPositionTarget &&
                    uiRefCurrent.getItemBottomPosition(nextIndex) <= scrollPositionTarget + clientSize;
            } else {
                const
                    firstFullyVisibleIndex = Math.ceil(scrollPositionTarget / gridSize) * dimensionToExtent,
                    lastFullyVisibleIndex = Math.min(
                        dataSize - 1,
                        Math.floor((scrollPositionTarget + clientSize + spacing) / gridSize) * dimensionToExtent - 1
                    );
                isNextItemInView = nextIndex >= firstFullyVisibleIndex && nextIndex <= lastFullyVisibleIndex;
            }

            lastFocusedIndex = nextIndex;

            if (isNextItemInView) {
                // The next item could be still out of viewport. So we need to prevent scrolling into view with `isScrolledBy5way` flag.
                isScrolledBy5way = true;
                focusByIndex(nextIndex);
                isScrolledBy5way = false;
            } else if (row === nextRow && (start < scrollPositionTarget || end > scrollPositionTarget + clientSize)) {
                focusByIndex(nextIndex);
            } else {
                isScrolledBy5way = true;
                isWrappedBy5way = isWrapped;

                if (isWrapped && (
                    uiRefCurrent.containerRef.current.querySelector(`[data-index='${nextIndex}']${spottableSelector}`) == null
                )) {
                    if (wrap === true) {
                        pause.pause();
                        target.blur();
                    } else {
                        focusByIndex(nextIndex);
                    }

                    nodeIndexToBeFocused = nextIndex;
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

    function onKeyDown (ev) {
        const {keyCode, target} = ev;
        const direction = getDirection(keyCode);

        if (direction) {
            Spotlight.setPointerMode(false);

            if (SpotlightAccelerator.processKey(ev, nop)) {
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
                        onAcceleratedKeyDown({isWrapped, keyCode, nextIndex, repeat, target});
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
                        } else if (!isLeaving && Spotlight.move(direction)) {
                            const nextTargetIndex = Spotlight.getCurrent().dataset.index;

                            ev.preventDefault();
                            ev.stopPropagation();

                            if (typeof nextTargetIndex === 'string') {
                                onAcceleratedKeyDown({keyCode, nextIndex: getNumberValue(nextTargetIndex), repeat, target});
                            }
                        }

                    }
                } else {
                    const possibleTarget = getTargetByDirectionFromElement(direction, target);
                    if (possibleTarget && !ev.currentTarget.contains(possibleTarget)) {
                        isLeaving = true;
                    }
                }

                if (isLeaving) {
                    SpotlightAccelerator.reset();
                }
            }
        } else if (isPageUp(keyCode) || isPageDown(keyCode)) {
            isScrolledBy5way = false;
        }
    }

    const spotlightId = {props};
    const scrollerNode = document.querySelector(`[data-spotlight-id="${spotlightId}"]`);
    useEffect(
        () => {
            // componentDidMount
            if (scrollerNode && scrollerNode.addEventListener) {
                scrollerNode.addEventListener('keydown', onKeyDown, {capture: true});
            }

            // componentWillUnmount
            return () => {
                if (scrollerNode && scrollerNode.removeEventListener) {
                    scrollerNode.removeEventListener('keydown', onKeyDown, {capture: true});
                }
            };
        },
        [scrollerNode, spotlightId]
    );	// TODO : Handle exhaustive-deps ESLint rule.
}

export {
    useKeyDown
};
