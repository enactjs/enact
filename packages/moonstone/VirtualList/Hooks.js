import clamp from 'ramda/src/clamp';
import Spotlight, {getDirection} from '@enact/spotlight';
import Accelerator from '@enact/spotlight/Accelerator';
import Pause from '@enact/spotlight/Pause';
import {Spottable, spottableClass} from '@enact/spotlight/Spottable';
import PropTypes from 'prop-types';
import React, {useCallback, useEffect, useImperativeHandle, useRef} from 'react';

const SpotlightAccelerator = new Accelerator();
const SpotlightPlaceholder = Spottable('div');

const JS = 'JS';
const spottableSelector = `.${spottableClass}`;

const usePreventScroll = (containerNode) => {
    useEffect((type) => {
        if (type === JS && containerNode) {
            const preventScroll = () => {
                containerNode.scrollTop = 0;
                containerNode.scrollLeft = props.rtl ? containerNode.scrollWidth : 0;
            };

            if (containerNode && containerNode.addEventListener) {
                containerNode.addEventListener('scroll', preventScroll);
            }

            return () => {
                if (type === JS) {
                    // remove a function for preventing native scrolling by Spotlight
                    if (containerNode && containerNode.removeEventListener) {
                        containerNode.removeEventListener('scroll', preventScroll);
                    }
                }
            }
        }
    }, []);
}

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

const useKeyUp = (
    {},
    props
) => {
    function onKeyUp ({keyCode}) {
        if (getDirection(keyCode) || isEnter(keyCode)) {
            SpotlightAccelerator.reset();
        }
    }

    const spotlightId = {props};
    const scrollerNode = document.querySelector(`[data-spotlight-id="${spotlightId}"]`);
    useEffect(
        () => {
            // componentDidMount
            if (scrollerNode && scrollerNode.addEventListener) {
                scrollerNode.addEventListener('keyup', onKeyUp, {capture: true});
            }

            // componentWillUnmount
            return () => {
                if (scrollerNode && scrollerNode.removeEventListener) {
                    scrollerNode.removeEventListener('keyup', onKeyUp, {capture: true});
                }
            };
        },
        [scrollerNode, spotlightId]
    );	// TODO : Handle exhaustive-deps ESLint rule.
}

const useSpotlight = (variables, props) => {
    const {
        lastFocusedIndex,
        nodeIndexToBeFocused,
        preservedIndex,
        uiRefCurrent,
        restoreLastFocused,
        isScrolledByJump,
        pause,
        isWrappedBy5way,
    } = variables;

    useEffect(() => {
        // componentDidMount

        // componentWillUnmount
        return () => {
            pause.resume();
            SpotlightAccelerator.reset();

            setContainerDisabled(false);
        };
    }, []);	// TODO : Handle exhaustive-deps ESLint rule.

    // componentDidUpdate
    useEffect(() => {
        configureSpotlight();
    }, [props.spotlightId]);	// TODO : Handle exhaustive-deps ESLint rule.

    useEffect(restoreFocus);	// TODO : Handle exhaustive-deps ESLint rule.

    const spotlightId = {props};
    function setContainerDisabled (bool) {
        const containerNode = document.querySelector(`[data-spotlight-id="${spotlightId}"]`);

        if (containerNode) {
            containerNode.setAttribute(dataContainerDisabledAttribute, bool);

            if (bool) {
                document.addEventListener('keydown', handleGlobalKeyDown, {capture: true});
            } else {
                document.removeEventListener('keydown', handleGlobalKeyDown, {capture: true});
            }
        }
    }

    function configureSpotlight () {
        const {spacing} = props;

        Spotlight.set(spotlightId, {
            enterTo: 'last-focused',
            /*
             * Returns the data-index as the key for last focused
             */
            lastFocusedPersist: lastFocusedPersist,
            /*
             * Restores the data-index into the placeholder if its the only element. Tries to find a
             * matching child otherwise.
             */
            lastFocusedRestore: lastFocusedRestore,
            /*
             * Directs spotlight focus to favor straight elements that are within range of `spacing`
             * over oblique elements, like scroll buttons.
             */
            obliqueMultiplier: spacing > 0 ? spacing : 1
        });
    }

    function lastFocusedPersist () {
        if (lastFocusedIndex != null) {
            return {
                container: false,
                element: true,
                key: lastFocusedIndex
            };
        }
    }

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

    /**
     * Manage a placeholder
     */

    function isNeededScrollingPlaceholder () {
        return nodeIndexToBeFocused != null && Spotlight.isPaused();
    }

    function handlePlaceholderFocus (ev) {
        const placeholder = ev.currentTarget;

        if (placeholder) {
            const index = placeholder.dataset.index;

            if (index) {
                preservedIndex = getNumberValue(index);
                restoreLastFocused = true;
            }
        }
    }

    function handleUpdateItems ({firstIndex, lastIndex}) {
        if (restoreLastFocused && preservedIndex >= firstIndex && preservedIndex <= lastIndex) {
            restoreFocus();
        }
    }

    /**
     * Restore the focus of VirtualList
     */

    function isPlaceholderFocused () {
        const current = Spotlight.getCurrent();

        if (current && current.dataset.vlPlaceholder && uiRefCurrent.containerRef.current.contains(current)) {
            return true;
        }

        return false;
    }

    function restoreFocus () {
        if (
            restoreLastFocused &&
            !isPlaceholderFocused()
        ) {
            const node = uiRefCurrent.containerRef.current.querySelector(
                    `[data-spotlight-id="${spotlightId}"] [data-index="${preservedIndex}"]`
            );

            if (node) {
                // if we're supposed to restore focus and virtual list has positioned a set of items
                // that includes lastFocusedIndex, clear the indicator
                restoreLastFocused = false;

                // try to focus the last focused item
                isScrolledByJump = true;
                const foundLastFocused = Spotlight.focus(node);
                isScrolledByJump = false;

                // but if that fails (because it isn't found or is disabled), focus the container so
                // spotlight isn't lost
                if (!foundLastFocused) {
                    restoreLastFocused = true;
                    Spotlight.focus(spotlightId);
                }
            }
        }
    }

    /**
     * Handle global `onKeyDown` event
     */

    function handleGlobalKeyDown () {
        setContainerDisabled(false);
    }

    function focusOnNode (node) {
        if (node) {
            Spotlight.focus(node);
        }
    }

    function focusByIndex (index) {
        const item = uiRefCurrent.containerRef.current.querySelector(`[data-index='${index}']${spottableSelector}`);

        if (!item && index >= 0 && index < props.dataSize) {
            // Item is valid but since the the dom doesn't exist yet, we set the index to focus after the ongoing update
            preservedIndex = index;
            restoreLastFocused = true;
        } else {
            if (isWrappedBy5way) {
                SpotlightAccelerator.reset();
                isWrappedBy5way = false;
            }

            pause.resume();
            focusOnNode(item);
            nodeIndexToBeFocused = null;
            isScrolledByJump = false;
        }
    }

    function shouldPreventScrollByFocus () {
        return ((type === JS) ? (variables.current.isScrolledBy5way) : (variables.current.isScrolledBy5way || variables.current.isScrolledByJump));
    }

    function setLastFocusedNode (node) {
        variables.current.lastFocusedIndex = node.dataset && getNumberValue(node.dataset.index);
    }

    const updateStatesAndBounds = useCallback(
        ({dataSize, moreInfo, numOfItems}) => {
            // TODO check preservedIndex
            // const {preservedIndex} = this;

            return (restoreLastFocused && numOfItems > 0 && preservedIndex < dataSize && (
                preservedIndex < moreInfo.firstVisibleIndex || preservedIndex > moreInfo.lastVisibleIndex
            ));
        },
        [restoreLastFocused, preservedIndex]
    );

    return {
        focusByIndex,
        handleUpdateItems,
        handlePlaceholderFocus,
        isNeededScrollingPlaceholder,
        setLastFocusedNode,
        shouldPreventScrollByFocus,
        SpotlightPlaceholder,
        updateStatesAndBounds
    }
}

const useOverscrollEffect = ({
    isWrappedBy5way
}) => {
    function shouldPreventOverscrollEffect () {
        return isWrappedBy5way;
    }

    return {
        shouldPreventOverscrollEffect
    };
}

const useScrollable = (variables, props) => {
    function calculatePositionOnFocus ({item, scrollPosition = variables.current.uiRefCurrent.scrollPosition}) {
        const
            {pageScroll} = props,
            {numOfItems} = variables.current.uiRefCurrent.state,
            {primary} = variables.current.uiRefCurrent,
            offsetToClientEnd = primary.clientSize - primary.itemSize,
            focusedIndex = getNumberValue(item.getAttribute(dataIndexAttribute));

        if (!isNaN(focusedIndex)) {
            let gridPosition = variables.current.uiRefCurrent.getGridPosition(focusedIndex);

            if (numOfItems > 0 && focusedIndex % numOfItems !== variables.current.lastFocusedIndex % numOfItems) {
                const node = variables.current.uiRefCurrent.getItemNode(variables.current.lastFocusedIndex);

                if (node) {
                    node.blur();
                }
            }
            variables.current.nodeIndexToBeFocused = null;
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
                        gridPosition.primaryPosition = scrollPosition + (variables.current.uiRefCurrent.scrollPosition === scrollPosition ? 0.1 : 0);
                    }
                } else { // backward over
                    gridPosition.primaryPosition -= pageScroll ? offsetToClientEnd : 0;
                }
            }

            // Since the result is used as a target position to be scrolled,
            // scrondaryPosition should be 0 here.
            gridPosition.secondaryPosition = 0;

            return variables.current.uiRefCurrent.gridPositionToItemPosition(gridPosition);
        }
    }

    return {
        calculatePositionOnFocus
    };
}

export {
    useKeyDown,
    useKeyUp,
    useOverscrollEffect,
    usePreventScroll,
    useScrollable,
    useSpotlight,
};
