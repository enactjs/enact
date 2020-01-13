import clamp from 'ramda/src/clamp';
import Spotlight, {getDirection} from '@enact/spotlight';
import Accelerator from '@enact/spotlight/Accelerator';
import Pause from '@enact/spotlight/Pause';
import {Spottable, spottableClass} from '@enact/spotlight/Spottable';
import PropTypes from 'prop-types';
import React, {useCallback, useEffect, useImperativeHandle, useRef} from 'react';

import {getNumberValue} from './util';

const SpotlightAccelerator = new Accelerator();
const SpotlightPlaceholder = Spottable('div');

const JS = 'JS';
const spottableSelector = `.${spottableClass}`;
const dataContainerDisabledAttribute = 'data-spotlight-container-disabled';

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


export {
    useSpotlight,
};
