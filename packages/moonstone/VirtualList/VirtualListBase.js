import Spotlight, {getDirection} from '@enact/spotlight';
import Accelerator from '@enact/spotlight/Accelerator';
import Pause from '@enact/spotlight/Pause';
import {Spottable, spottableClass} from '@enact/spotlight/Spottable';
import PropTypes from 'prop-types';
import React, {Component, useCallback, useEffect, useRef} from 'react';

import {dataIndexAttribute} from '../Scrollable';

import {useEventKey} from './useEvent';
import useOverscrollEffect from './useOverscrollEffect';
import usePreventScroll from './usePreventScroll';
import {useSpotlightConfig, useSpotlightRestore} from './useSpotlightConfig';

const SpotlightAccelerator = new Accelerator();
const SpotlightPlaceholder = Spottable('div');

// TBD: indentation is broken intentionally to help comparing
	class VirtualListCore extends Component {
		displayName = 'VirtualListBase'

		static propTypes = /** @lends moonstone/VirtualList.VirtualListBase.prototype */ {
			/**
			 * The `render` function called for each item in the list.
			 *
			 * > NOTE: The list does NOT always render a component whenever its render function is called
			 * due to performance optimization.
			 *
			 * Usage:
			 * ```
			 * renderItem = ({index, ...rest}) => {
			 * 	return (
			 * 		<MyComponent index={index} {...rest} />
			 * 	);
			 * }
			 * ```
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @param {Number} event.data-index It is required for Spotlight 5-way navigation. Pass to the root element in the component.
			 * @param {Number} event.index The index number of the component to render
			 * @param {Number} event.key It MUST be passed as a prop to the root element in the component for DOM recycling.
			 *
			 * @required
			 * @public
			 */
			itemRenderer: PropTypes.func.isRequired,

			/**
			 * The render function for the items.
			 *
			 * @type {Function}
			 * @required
			 * @private
			 */
			itemsRenderer: PropTypes.func.isRequired,

			/**
			 * Callback method of scrollTo.
			 * Normally, [Scrollable]{@link ui/Scrollable.Scrollable} should set this value.
			 *
			 * @type {Function}
			 * @private
			 */
			cbScrollTo: PropTypes.func,

			/**
			 * Size of the data.
			 *
			 * @type {Number}
			 * @default 0
			 * @public
			 */
			dataSize: PropTypes.number,

			/**
			 * Allows 5-way navigation to the scrollbar controls. By default, 5-way will
			 * not move focus to the scrollbar controls.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			focusableScrollbar: PropTypes.bool,

			/**
			 * Prop to check if horizontal Scrollbar exists or not.
			 *
			 * @type {Boolean}
			 * @private
			 */
			isHorizontalScrollbarVisible: PropTypes.bool,

			/**
			 * Prop to check if vertical Scrollbar exists or not.
			 *
			 * @type {Boolean}
			 * @private
			 */
			isVerticalScrollbarVisible: PropTypes.bool,

			/**
			 * The array for individually sized items.
			 *
			 * @type {Number[]}
			 * @private
			 */
			itemSizes: PropTypes.array,

			/**
			 * It scrolls by page when `true`, by item when `false`.
			 *
			 * @type {Boolean}
			 * @default false
			 * @private
			 */
			pageScroll: PropTypes.bool,

			/**
			 * The ARIA role for the list.
			 *
			 * @type {String}
			 * @default 'list'
			 * @public
			 */
			role: PropTypes.string,

			/**
			 * `true` if rtl, `false` if ltr.
			 * Normally, [Scrollable]{@link ui/Scrollable.Scrollable} should set this value.
			 *
			 * @type {Boolean}
			 * @private
			 */
			rtl: PropTypes.bool,

			/**
			 * Spacing between items.
			 *
			 * @type {Number}
			 * @default 0
			 * @public
			 */
			spacing: PropTypes.number,

			/**
			 * Spotlight Id. It would be the same with [Scrollable]{@link ui/Scrollable.Scrollable}'s.
			 *
			 * @type {String}
			 * @private
			 */
			spotlightId: PropTypes.string,

			/**
			 * TBD
			 */
			type: PropTypes.string,

			/**
			 * When it's `true` and the spotlight focus cannot move to the given direction anymore by 5-way keys,
			 * a list is scrolled with an animation to the other side and the spotlight focus moves in wraparound manner.
			 *
			 * When it's `'noAnimation'`, the spotlight focus moves in wraparound manner as same as when it's `true`
			 * except that a list is scrolled without an animation.
			 *
			 * @type {Boolean|String}
			 * @default false
			 * @public
			 */
			wrap: PropTypes.oneOfType([
				PropTypes.bool,
				PropTypes.oneOf(['noAnimation'])
			])
		}

		static defaultProps = {
			dataSize: 0,
			focusableScrollbar: false,
			pageScroll: false,
			spacing: 0,
			type: 'JS',
			wrap: false
		}
	}

const
	dataContainerDisabledAttribute = 'data-spotlight-container-disabled',
	JS = 'JS',
	// using 'bitwise or' for string > number conversion based on performance: https://jsperf.com/convert-string-to-number-techniques/7
	getNumberValue = (index) => index | 0,
	spottableSelector = `.${spottableClass}`;

// TBD: indentation is broken intentionally to help comparing
	const useSpottable = (props, instances, context) => {
		const {uiChildContainerRef, uiScrollableAdapter} = instances;
		const {type} = context;

		// Mutable value

		const mutableRef = useRef({
			isScrolledBy5way: false,
			isScrolledByJump: false,
			lastFocusedIndex: null,
			nodeIndexToBeFocused: false,
			pause: new Pause('VirtualListBase')
		});

		const {pause} = mutableRef.current;

		// Hooks

		useSpotlightConfig(props, {spottable: mutableRef});

		const [isOverscrollEffect, setOverscrollEffect] = useOverscrollEffect();

		const {addGlobalKeyDownEventListener, removeGlobalKeyDownEventListener} = useEventKey(props, instances, {
			handlePageUpDownKeyDown: () => {
				mutableRef.current.isScrolledBy5way = false;
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
		} = useSpotlightRestore(props, {...instances, spottable: mutableRef});

		const setContainerDisabled = useCallback((bool) => {
			const
				{spotlightId} = this.props,
				containerNode = document.querySelector(`[data-spotlight-id="${spotlightId}"]`);

			if (containerNode) {
				containerNode.setAttribute(dataContainerDisabledAttribute, bool);

				if (bool) {
					addGlobalKeyDownEventListener(handleGlobalKeyDown);
				} else {
					removeGlobalKeyDownEventListener();
				}
			}
		}, [addGlobalKeyDownEventListener, handleGlobalKeyDown, removeGlobalKeyDownEventListener, uiChildContainerRef]);

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

		// Functions


/*
// Move to useSpotlight

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

		const lastFocusedPersist = () => {
			if (lastFocusedIndex != null) {
				return {
					container: false,
					element: true,
					key: lastFocusedIndex
				};
			}
		};

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

// Move to useEvent

		const findSpottableItem = useCallback((indexFrom, indexTo) => {
			const {dataSize} = props;
			if (indexFrom < 0 && indexTo < 0 || indexFrom >= dataSize && indexTo >= dataSize) {
				return -1;
			} else {
				return clamp(0, dataSize - 1, indexFrom);
			}
		}, [props]);

		const getNextIndex = useCallback(({index, keyCode, repeat}) => {
			const {dataSize, rtl, wrap} = this.props;
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
*/

		function getNodeIndexToBeFocused () {
			return mutableRef.current.nodeIndexToBeFocused;
		}

		function setNodeIndexToBeFocused (index) {
			mutableRef.current.nodeIndexToBeFocused = index;
		}

		function onAcceleratedKeyDown ({isWrapped, keyCode, nextIndex, repeat, target}) {
			const {cbScrollTo, dataSize, spacing, wrap} = props;
			const {dimensionToExtent, primary: {clientSize, gridSize}, scrollPositionTarget} = uiScrollableAdapter.current;
			const index = getNumberValue(target.dataset.index);

			mutableRef.current.isScrolledBy5way = false;
			mutableRef.current.isScrolledByJump = false;

			if (nextIndex >= 0) {
				const
					row = Math.floor(index / dimensionToExtent),
					nextRow = Math.floor(nextIndex / dimensionToExtent),
					start = uiScrollableAdapter.current.getGridPosition(nextIndex).primaryPosition,
					end = uiScrollableAdapter.current.getGridPosition(nextIndex).primaryPosition + gridSize;
				let isNextItemInView = false;

				if (props.itemSizes) {
					isNextItemInView = uiScrollableAdapter.current.itemPositions[nextIndex].position >= scrollPositionTarget &&
						uiScrollableAdapter.current.getItemBottomPosition(nextIndex) <= scrollPositionTarget + clientSize;
				} else {
					const
						firstFullyVisibleIndex = Math.ceil(scrollPositionTarget / gridSize) * dimensionToExtent,
						lastFullyVisibleIndex = Math.min(
							dataSize - 1,
							Math.floor((scrollPositionTarget + clientSize + spacing) / gridSize) * dimensionToExtent - 1
						);

					isNextItemInView = nextIndex >= firstFullyVisibleIndex && nextIndex <= lastFullyVisibleIndex;
				}

				mutableRef.current.lastFocusedIndex = nextIndex;

				if (isNextItemInView) {
					// The next item could be still out of viewport. So we need to prevent scrolling into view with `isScrolledBy5way` flag.
					mutableRef.current.isScrolledBy5way = true;
					focusByIndex(nextIndex);
					mutableRef.current.isScrolledBy5way = false;
				} else if (row === nextRow && (start < scrollPositionTarget || end > scrollPositionTarget + clientSize)) {
					focusByIndex(nextIndex);
				} else {
					mutableRef.current.isScrolledBy5way = true;
					setOverscrollEffect(isWrapped);

					if (isWrapped && (
						uiScrollableContainerRef.current.querySelector(`[data-index='${nextIndex}']${spottableSelector}`) == null
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

/*

Move to useEvent

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
*/

		/**
		 * Focus on the Node of the VirtualList item
		 */
		function focusOnNode (node) {
			if (node) {
				Spotlight.focus(node);
			}
		}

		function focusByIndex (index) {
			const item = uiScrollableContainerRef.current.querySelector(`[data-index='${index}']${spottableSelector}`);

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
				mutableRef.current.isScrolledByJump = false;
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
					mutableRef.current.isScrolledByJump = true;
					focusByIndex(index);
				}
			}
		}

		function isNeededScrollingPlaceholder () {
			return mutableRef.current.nodeIndexToBeFocused != null && Spotlight.isPaused();
		}

/*
// Move to useSpoitlight

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

		function handleRestoreLastFocus ({firstIndex, lastIndex}) {
			if (mutableRef.current.restoreLastFocused && mutableRef.current.preservedIndex >= firstIndex && mutableRef.current.preservedIndex <= lastIndex) {
				restoreFocus();
			}
		}

		function isPlaceholderFocused () {
			const current = Spotlight.getCurrent();

			if (current && current.dataset.vlPlaceholder && utilDOM.containsDangerously(uiScrollableContainerRef.current, current)) {
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
					{spotlightId} = this.props,
					node = this.uiRefCurrent.containerRef.current.querySelector(
						`[data-spotlight-id="${spotlightId}"] [data-index="${mutableRef.current.preservedIndex}"]`
					);

				if (node) {
					// if we're supposed to restore focus and virtual list has positioned a set of items
					// that includes lastFocusedIndex, clear the indicator
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
*/

		function calculatePositionOnFocus ({item, scrollPosition = uiScrollableAdapter.current.scrollPosition}) {
			const
				{pageScroll} = props,
				{numOfItems, primary} = uiScrollableAdapter.current,
				offsetToClientEnd = primary.clientSize - primary.itemSize,
				focusedIndex = getNumberValue(item.getAttribute(dataIndexAttribute));

			if (!isNaN(focusedIndex)) {
				let gridPosition = uiScrollableAdapter.current.getGridPosition(focusedIndex);

				if (numOfItems > 0 && focusedIndex % numOfItems !== mutableRef.current.lastFocusedIndex % numOfItems) {
					const node = uiScrollableAdapter.current.getItemNode(mutableRef.current.lastFocusedIndex);

					if (node) {
						node.blur();
					}
				}

				setNodeIndexToBeFocused(null);
				mutableRef.current.lastFocusedIndex = focusedIndex;

				if (primary.clientSize >= primary.itemSize) {
					if (gridPosition.primaryPosition > scrollPosition + offsetToClientEnd) { // forward over
						gridPosition.primaryPosition -= pageScroll ? 0 : offsetToClientEnd;
					} else if (gridPosition.primaryPosition >= scrollPosition) { // inside of client
						if (type === JS) {
							gridPosition.primaryPosition = scrollPosition;
						} else {
							// This code uses the trick to change the target position slightly which will not affect the actual result
							// since a browser ignore `scrollTo` method if the target position is same as the current position.
							gridPosition.primaryPosition = scrollPosition + (uiScrollableAdapter.current.scrollPosition === scrollPosition ? 0.1 : 0);
						}
					} else { // backward over
						gridPosition.primaryPosition -= pageScroll ? offsetToClientEnd : 0;
					}
				}

				// Since the result is used as a target position to be scrolled,
				// scrondaryPosition should be 0 here.
				gridPosition.secondaryPosition = 0;

				return uiScrollableAdapter.current.gridPositionToItemPosition(gridPosition);
			}
		}

		function shouldPreventScrollByFocus () {
			return ((type === JS) ? (mutableRef.current.isScrolledBy5way) : (mutableRef.current.isScrolledBy5way || mutableRef.current.isScrolledByJump));
		}

		function shouldPreventOverscrollEffect () {
			return isOverscrollEffect;
		}

		function setLastFocusedNode (node) {
			mutableRef.current.lastFocusedIndex = node.dataset && getNumberValue(node.dataset.index);
		}

/*
// Move to useSpotlight

		function updateStatesAndBounds ({dataSize, moreInfo, numOfItems}) {
			return (mutableRef.current.restoreLastFocused && numOfItems > 0 && mutableRef.current.preservedIndex < dataSize && (
				mutableRef.current.preservedIndex < moreInfo.firstVisibleIndex || mutableRef.current.preservedIndex > moreInfo.lastVisibleIndex
			));
		}
*/
		function getScrollBounds () {
			return uiScrollableAdapter.current.getScrollBounds();
		}

		// Return

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

const useSpottableVirtualList = (props) => {
	const {type, uiScrollableContainerRef, uiChildContainerRef} = props;
	const {spotlightId} = props;

	// Hooks

	const instance = {uiScrollableContainerRef, uiChildContainerRef};

	const {
		calculatePositionOnFocus,
		focusByIndex,
		focusOnNode,
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
	} = useSpottable(props, instance, {type});

	const containerNode = document.querySelector(`[data-spotlight-id="${spotlightId}"]`);
	usePreventScroll(props, instance, {type});

	const adapter = {
		calculatePositionOnFocus,
		focusByIndex,
		focusOnNode,
		getScrollBounds,
		setContainerDisabled,
		setLastFocusedNode,
		shouldPreventOverscrollEffect,
		shouldPreventScrollByFocus
	};
	useEffect(() => {
		props.setChildAdapter(adapter);
	}, [adapter, props, props.setChildAdapter]);


	// Functions

	function getComponentProps (index) {
		return (index === getNodeIndexToBeFocused()) ? {ref: (ref) => initItemRef(ref, index)} : {};
	}

	// Render

	// TBD: indentation is broken intentionally to help comparing
	{
		{
			const
				{itemRenderer, role, ...rest} = props,
				needsScrollingPlaceholder = isNeededScrollingPlaceholder();

			// not used by VirtualList
			delete rest.dangerouslyContainsInScrollable;
			// not used by VirtualList
			delete rest.focusableScrollbar;
			delete rest.scrollAndFocusScrollbarButton;
			delete rest.spotlightId;
			delete rest.uiScrollableAdapter;
			delete rest.wrap;

			return {
				...rest,
				getComponentProps,
				itemRenderer: ({index, ...itemRest}) => (
					itemRenderer({
						...itemRest,
						[dataIndexAttribute]: index,
						index
					})
				),
				itemsRenderer: (itemsRendererProps) => {
					return listItemsRenderer({
						...itemsRendererProps,
						handlePlaceholderFocus: handlePlaceholderFocus,
						needsScrollingPlaceholder,
						role,
						SpotlightPlaceholder
					});
				},
				onUpdateItems: handleRestoreLastFocus,
				updateStatesAndBounds: updateStatesAndBounds
			};
		}
	}
};

/**
 * A Moonstone-styled base component for [VirtualList]{@link moonstone/VirtualList.VirtualList} and
 * [VirtualGridList]{@link moonstone/VirtualList.VirtualGridList}.
 *
 * @class VirtualListBase
 * @memberof moonstone/VirtualList
 * @extends ui/VirtualList.VirtualListBase
 * @ui
 * @public
 */
const VirtualListBase = VirtualListCore;

/**
 * Allows 5-way navigation to the scrollbar controls. By default, 5-way will
 * not move focus to the scrollbar controls.
 *
 * @name focusableScrollbar
 * @memberof moonstone/VirtualList.VirtualListBase.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

/**
 * Unique identifier for the component.
 *
 * When defined and when the `VirtualList` is within a [Panel]{@link moonstone/Panels.Panel},
 * the `VirtualList` will store its scroll position and restore that position when returning to
 * the `Panel`.
 *
 * @name id
 * @memberof moonstone/VirtualList.VirtualListBase.prototype
 * @type {String}
 * @public
 */

/**
 * Sets the hint string read when focusing the next button in the vertical scroll bar.
 *
 * @name scrollDownAriaLabel
 * @memberof moonstone/VirtualList.VirtualListBase.prototype
 * @type {String}
 * @default $L('scroll down')
 * @public
 */

/**
 * Sets the hint string read when focusing the previous button in the horizontal scroll bar.
 *
 * @name scrollLeftAriaLabel
 * @memberof moonstone/VirtualList.VirtualListBase.prototype
 * @type {String}
 * @default $L('scroll left')
 * @public
 */

/**
 * Sets the hint string read when focusing the next button in the horizontal scroll bar.
 *
 * @name scrollRightAriaLabel
 * @memberof moonstone/VirtualList.VirtualListBase.prototype
 * @type {String}
 * @default $L('scroll right')
 * @public
 */

/**
 * Sets the hint string read when focusing the previous button in the vertical scroll bar.
 *
 * @name scrollUpAriaLabel
 * @memberof moonstone/VirtualList.VirtualListBase.prototype
 * @type {String}
 * @default $L('scroll up')
 * @public
 */

 /* eslint-disable enact/prop-types */
function listItemsRenderer (props) {
	const {
		cc,
		handlePlaceholderFocus,
		itemContainerRef: initUiItemContainerRef,
		needsScrollingPlaceholder,
		primary,
		role,
		SpotlightPlaceholder
	} = props;

	return (
		<>
			{cc.length ? (
				<div ref={initUiItemContainerRef} role={role}>{cc}</div>
			) : null}
			{primary ? null : (
				<SpotlightPlaceholder
					data-index={0}
					data-vl-placeholder
					// a zero width/height element can't be focused by spotlight so we're giving
					// the placeholder a small size to ensure it is navigable
					onFocus={handlePlaceholderFocus}
					style={{width: 10}}
				/>
			)}
			{needsScrollingPlaceholder ? (
				<SpotlightPlaceholder />
			) : null}
		</>
	);
};
/* eslint-enable enact/prop-types */

export default useSpottableVirtualList;
export {
	useSpottableVirtualList,
	VirtualListBase
};
