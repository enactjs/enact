import {getTargetByDirectionFromElement} from '@enact/spotlight/src/target';
import {is} from '@enact/core/keymap';
import Spotlight, {getDirection} from '@enact/spotlight';
import Accelerator from '@enact/spotlight/Accelerator';
import Pause from '@enact/spotlight/Pause';
import {Spottable, spottableClass} from '@enact/spotlight/Spottable';
import {VirtualListBase as UiVirtualListBase, VirtualListBaseNative as UiVirtualListBaseNative} from '@enact/ui/VirtualList';
import PropTypes from 'prop-types';
import clamp from 'ramda/src/clamp';
import React, {useEffect, useRef} from 'react';
import warning from 'warning';

import {Scrollable, dataIndexAttribute} from '../Scrollable';
import ScrollableNative from '../Scrollable/ScrollableNative';

const SpotlightAccelerator = new Accelerator();
const SpotlightPlaceholder = Spottable('div');

const
	dataContainerDisabledAttribute = 'data-spotlight-container-disabled',
	isDown = is('down'),
	isEnter = is('enter'),
	isLeft = is('left'),
	isPageUp = is('pageUp'),
	isPageDown = is('pageDown'),
	isRight = is('right'),
	isUp = is('up'),
	JS = 'JS',
	Native = 'Native',
	// using 'bitwise or' for string > number conversion based on performance: https://jsperf.com/convert-string-to-number-techniques/7
	getNumberValue = (index) => index | 0,
	nop = () => {},
	spottableSelector = `.${spottableClass}`;

/**
 * The base version of [VirtualListBase]{@link moonstone/VirtualList.VirtualListBase} and
 * [VirtualListBaseNative]{@link moonstone/VirtualList.VirtualListBaseNative}.
 *
 * @function VirtualListCore
 * @memberof moonstone/VirtualList
 * @ui
 * @private
 */
const VirtualListBaseFactory = (type) => {
	const UiBase = (type === JS) ? UiVirtualListBase : UiVirtualListBaseNative;

	const VirtualListCore = (props) => {
		/* No displayName here. We set displayName to returned components of this factory function. */

		// Instance variables
		const variables = useRef({
			isScrolledBy5way: false,
			isScrolledByJump: false,
			isWrappedBy5way: false,
			lastFocusedIndex: null,
			nodeIndexToBeFocused: null,
			preservedIndex: null,
			restoreLastFocused: false,
			uiRefCurrent: null,
			preventScroll: null,
			pause: null
		});

		if (variables.current.pause === null) {
			variables.current.pause = new Pause('VirtualListBase');
		}

		// Constructor
		const {spotlightId} = props;

		useEffect(() => {
			// componentDidMount
			const containerNode = variables.current.uiRefCurrent.containerRef.current;
			const scrollerNode = document.querySelector(`[data-spotlight-id="${props.spotlightId}"]`);

			if (type === JS) {
				// prevent native scrolling by Spotlight
				variables.current.preventScroll = () => {
					containerNode.scrollTop = 0;
					containerNode.scrollLeft = props.rtl ? containerNode.scrollWidth : 0;
				};

				if (containerNode && containerNode.addEventListener) {
					containerNode.addEventListener('scroll', variables.current.preventScroll);
				}
			}

			if (scrollerNode && scrollerNode.addEventListener) {
				scrollerNode.addEventListener('keydown', onKeyDown, {capture: true});
				scrollerNode.addEventListener('keyup', onKeyUp, {capture: true});
			}

			// componentWillUnmount
			return () => {
				if (type === JS) {
					// remove a function for preventing native scrolling by Spotlight
					if (containerNode && containerNode.removeEventListener) {
						containerNode.removeEventListener('scroll', variables.current.preventScroll);
					}
				}

				if (scrollerNode && scrollerNode.removeEventListener) {
					scrollerNode.removeEventListener('keydown', onKeyDown, {capture: true});
					scrollerNode.removeEventListener('keyup', onKeyUp, {capture: true});
				}

				variables.current.pause.resume();
				SpotlightAccelerator.reset();

				setContainerDisabled(false);
			};
		}, []);	// TODO : Handle exhaustive-deps ESLint rule.

		// componentDidUpdate
		useEffect(() => {
			configureSpotlight();
		}, [props.spotlightId]);	// TODO : Handle exhaustive-deps ESLint rule.

		useEffect(restoreFocus);	// TODO : Handle exhaustive-deps ESLint rule.

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
			if (variables.current.lastFocusedIndex != null) {
				return {
					container: false,
					element: true,
					key: variables.current.lastFocusedIndex
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
			const {isPrimaryDirectionVertical, dimensionToExtent} = variables.current.uiRefCurrent;
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
			const {dimensionToExtent, primary: {clientSize, gridSize}, scrollPositionTarget} = variables.current.uiRefCurrent;
			const index = getNumberValue(target.dataset.index);

			variables.current.isScrolledBy5way = false;
			variables.current.isScrolledByJump = false;

			if (nextIndex >= 0) {
				const
					row = Math.floor(index / dimensionToExtent),
					nextRow = Math.floor(nextIndex / dimensionToExtent),
					start = variables.current.uiRefCurrent.getGridPosition(nextIndex).primaryPosition,
					end = variables.current.uiRefCurrent.getGridPosition(nextIndex).primaryPosition + gridSize;
				let isNextItemInView = false;

				if (props.itemSizes) {
					isNextItemInView = variables.current.uiRefCurrent.itemPositions[nextIndex].position >= scrollPositionTarget &&
						variables.current.uiRefCurrent.getItemBottomPosition(nextIndex) <= scrollPositionTarget + clientSize;
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
					variables.current.isWrappedBy5way = isWrapped;

					if (isWrapped && (
						variables.current.uiRefCurrent.containerRef.current.querySelector(`[data-index='${nextIndex}']${spottableSelector}`) == null
					)) {
						if (wrap === true) {
							variables.current.pause.pause();
							target.blur();
						} else {
							focusByIndex(nextIndex);
						}

						variables.current.nodeIndexToBeFocused = nextIndex;
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
					const {dimensionToExtent, isPrimaryDirectionVertical} = variables.current.uiRefCurrent;
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
				variables.current.isScrolledBy5way = false;
			}
		}

		function onKeyUp ({keyCode}) {
			if (getDirection(keyCode) || isEnter(keyCode)) {
				SpotlightAccelerator.reset();
			}
		}

		/**
		 * Handle global `onKeyDown` event
		 */

		function handleGlobalKeyDown () {
			setContainerDisabled(false);
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
			const item = variables.current.uiRefCurrent.containerRef.current.querySelector(`[data-index='${index}']${spottableSelector}`);

			if (!item && index >= 0 && index < props.dataSize) {
				// Item is valid but since the the dom doesn't exist yet, we set the index to focus after the ongoing update
				variables.current.preservedIndex = index;
				variables.current.restoreLastFocused = true;
			} else {
				if (variables.current.isWrappedBy5way) {
					SpotlightAccelerator.reset();
					variables.current.isWrappedBy5way = false;
				}

				variables.current.pause.resume();
				focusOnNode(item);
				variables.current.nodeIndexToBeFocused = null;
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

		/**
		 * Manage a placeholder
		 */

		function isNeededScrollingPlaceholder () {
			return variables.current.nodeIndexToBeFocused != null && Spotlight.isPaused();
		}

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

		function handleUpdateItems ({firstIndex, lastIndex}) {
			if (variables.current.restoreLastFocused && variables.current.preservedIndex >= firstIndex && variables.current.preservedIndex <= lastIndex) {
				restoreFocus();
			}
		}

		/**
		 * Restore the focus of VirtualList
		 */

		function isPlaceholderFocused () {
			const current = Spotlight.getCurrent();

			if (current && current.dataset.vlPlaceholder && variables.current.uiRefCurrent.containerRef.current.contains(current)) {
				return true;
			}

			return false;
		}

		function restoreFocus () {
			if (
				variables.current.restoreLastFocused &&
				!isPlaceholderFocused()
			) {
				const node = variables.current.uiRefCurrent.containerRef.current.querySelector(
						`[data-spotlight-id="${spotlightId}"] [data-index="${variables.current.preservedIndex}"]`
				);

				if (node) {
					// if we're supposed to restore focus and virtual list has positioned a set of items
					// that includes lastFocusedIndex, clear the indicator
					variables.current.restoreLastFocused = false;

					// try to focus the last focused item
					variables.current.isScrolledByJump = true;
					const foundLastFocused = Spotlight.focus(node);
					variables.current.isScrolledByJump = false;

					// but if that fails (because it isn't found or is disabled), focus the container so
					// spotlight isn't lost
					if (!foundLastFocused) {
						variables.current.restoreLastFocused = true;
						Spotlight.focus(spotlightId);
					}
				}
			}
		}

		/**
		 * calculator
		 */

		// TODO PLAT-98204.
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

		// TODO PLAT-98204.
		function shouldPreventScrollByFocus () {
			return ((type === JS) ? (variables.current.isScrolledBy5way) : (variables.current.isScrolledBy5way || variables.current.isScrolledByJump));
		}

		// TODO PLAT-98204.
		function shouldPreventOverscrollEffect () {
			return variables.current.isWrappedBy5way;
		}

		// TODO PLAT-98204.
		function setLastFocusedNode (node) {
			variables.current.lastFocusedIndex = node.dataset && getNumberValue(node.dataset.index);
		}

		function updateStatesAndBounds ({dataSize, moreInfo, numOfItems}) {
			// TODO check preservedIndex
			// const {preservedIndex} = this;

			return (variables.current.restoreLastFocused && numOfItems > 0 && variables.current.preservedIndex < dataSize && (
				variables.current.preservedIndex < moreInfo.firstVisibleIndex || variables.current.preservedIndex > moreInfo.lastVisibleIndex
			));
		}

		// TODO PLAT-98204.
		function getScrollBounds () {
			return variables.current.uiRefCurrent.getScrollBounds();
		}

		function getComponentProps (index) {
			return (index === variables.current.nodeIndexToBeFocused) ? {ref: (ref) => initItemRef(ref, index)} : {};
		}

		function initUiRef (ref) {
			if (ref) {
				variables.current.uiRefCurrent = ref;
				props.initUiChildRef(ref);
			}
		}

		// Render
		const
			{itemRenderer, itemsRenderer, role, ...rest} = props,
			needsScrollingPlaceholder = isNeededScrollingPlaceholder();

		delete rest.initUiChildRef;
		// not used by VirtualList
		delete rest.focusableScrollbar;
		delete rest.scrollAndFocusScrollbarButton;
		delete rest.spotlightId;
		delete rest.wrap;

		return (
			<UiBase
				{...rest}
				getComponentProps={getComponentProps}
				itemRenderer={({index, ...itemRest}) => ( // eslint-disable-line react/jsx-no-bind
					itemRenderer({
						...itemRest,
						[dataIndexAttribute]: index,
						index
					})
				)}
				onUpdateItems={handleUpdateItems}
				ref={initUiRef}
				updateStatesAndBounds={updateStatesAndBounds}
				itemsRenderer={(itemsRendererProps) => { // eslint-disable-line react/jsx-no-bind
					return itemsRenderer({
						...itemsRendererProps,
						handlePlaceholderFocus: handlePlaceholderFocus,
						needsScrollingPlaceholder,
						role
					});
				}}
			/>
		);
	};

	VirtualListCore.propTypes = /** @lends moonstone/VirtualList.VirtualListBase.prototype */ {
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
		 * Passes the instance of [VirtualList]{@link ui/VirtualList.VirtualList}.
		 *
		 * @type {Object}
		 * @param {Object} ref
		 * @private
		 */
		initUiChildRef: PropTypes.func,

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
	};

	VirtualListCore.defaultProps = {
		dataSize: 0,
		focusableScrollbar: false,
		pageScroll: false,
		spacing: 0,
		wrap: false
	};

	return VirtualListCore;
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
const VirtualListBase = VirtualListBaseFactory(JS);
VirtualListBase.displayName = 'VirtualListBase';

/**
 * A Moonstone-styled base component for [VirtualListNative]{@link moonstone/VirtualList.VirtualListNative} and
 * [VirtualGridListNative]{@link moonstone/VirtualList.VirtualGridListNative}.
 *
 * @class VirtualListBaseNative
 * @memberof moonstone/VirtualList
 * @extends ui/VirtualList.VirtualListBaseNative
 * @ui
 * @private
 */
const VirtualListBaseNative = VirtualListBaseFactory(Native);
VirtualListBaseNative.displayName = 'VirtualListBaseNative';

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
const listItemsRenderer = (props) => {
	const {
		cc,
		handlePlaceholderFocus,
		itemContainerRef: initUiItemContainerRef,
		needsScrollingPlaceholder,
		primary,
		role
	} = props;

	return (
		<React.Fragment>
			{cc.length ? (
				<div ref={initUiItemContainerRef} role={role}>{cc}</div>
			) : null}
			{primary ? null : (
				<SpotlightPlaceholder
					data-index={0}
					data-vl-placeholder
					// a zero width/height element can't be focused by spotlight so we're giving
					// the placeholder a small size to ensure it is navigable
					style={{width: 10}}
					onFocus={handlePlaceholderFocus}
				/>
			)}
			{needsScrollingPlaceholder ? (
				<SpotlightPlaceholder />
			) : null}
		</React.Fragment>
	);
};
/* eslint-enable enact/prop-types */

const ScrollableVirtualList = ({role, ...rest}) => { // eslint-disable-line react/jsx-no-bind
	warning(
		!rest.itemSizes || !rest.cbScrollTo,
		'VirtualList with `minSize` in `itemSize` prop does not support `cbScrollTo` prop'
	);

	return (
		<Scrollable
			{...rest}
			childRenderer={(childProps) => ( // eslint-disable-line react/jsx-no-bind
				<VirtualListBase
					{...childProps}
					focusableScrollbar={rest.focusableScrollbar}
					itemsRenderer={listItemsRenderer}
					role={role}
				/>
			)}
		/>
	);
};

ScrollableVirtualList.propTypes = /** @lends moonstone/VirtualList.VirtualListBase.prototype */ {
	cbScrollTo: PropTypes.func,
	direction: PropTypes.oneOf(['horizontal', 'vertical']),
	focusableScrollbar: PropTypes.bool,
	itemSizes: PropTypes.array,
	preventBubblingOnKeyDown: PropTypes.oneOf(['none', 'programmatic']),
	role: PropTypes.string
};

ScrollableVirtualList.defaultProps = {
	direction: 'vertical',
	focusableScrollbar: false,
	preventBubblingOnKeyDown: 'programmatic',
	role: 'list'
};

const ScrollableVirtualListNative = ({role, ...rest}) => {
	warning(
		!rest.itemSizes || !rest.cbScrollTo,
		'VirtualList with `minSize` in `itemSize` prop does not support `cbScrollTo` prop'
	);

	return (
		<ScrollableNative
			{...rest}
			childRenderer={(childProps) => ( // eslint-disable-line react/jsx-no-bind
				<VirtualListBaseNative
					{...childProps}
					focusableScrollbar={rest.focusableScrollbar}
					itemsRenderer={listItemsRenderer}
					role={role}
				/>
			)}
		/>
	);
};

ScrollableVirtualListNative.propTypes = /** @lends moonstone/VirtualList.VirtualListBaseNative.prototype */ {
	cbScrollTo: PropTypes.func,
	direction: PropTypes.oneOf(['horizontal', 'vertical']),
	focusableScrollbar: PropTypes.bool,
	itemSizes: PropTypes.array,
	preventBubblingOnKeyDown: PropTypes.oneOf(['none', 'programmatic']),
	role: PropTypes.string
};

ScrollableVirtualListNative.defaultProps = {
	direction: 'vertical',
	focusableScrollbar: false,
	preventBubblingOnKeyDown: 'programmatic',
	role: 'list'
};

export default VirtualListBase;
export {
	ScrollableVirtualList,
	ScrollableVirtualListNative,
	VirtualListBase,
	VirtualListBaseNative
};
