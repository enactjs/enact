import clamp from 'ramda/src/clamp';
import {is} from '@enact/core/keymap';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Spotlight, {getDirection} from '@enact/spotlight';
import Spottable from '@enact/spotlight/Spottable';
import {VirtualListBase as UiVirtualListBase, VirtualListBaseNative as UiVirtualListBaseNative} from '@enact/ui/VirtualList';

import {Scrollable, dataIndexAttribute} from '../Scrollable';
import ScrollableNative from '../Scrollable/ScrollableNative';

const SpotlightPlaceholder = Spottable('div');

const configureSpotlight = (spotlightId, instance) => {
	Spotlight.set(spotlightId, {
		enterTo: 'last-focused',
		/*
		 * Returns the data-index as the key for last focused
		 */
		lastFocusedPersist: function () {
			if (this.lastFocusedIndex != null) {
				return {
					container: false,
					element: true,
					key: this.lastFocusedIndex
				};
			}
		}.bind(instance),
		/*
		 * Restores the data-index into the placeholder if its the only element. Tries to find a
		 * matching child otherwise.
		 */
		lastFocusedRestore: ({key}, all) => {
			if (all.length === 1 && 'vlPlaceholder' in all[0].dataset) {
				all[0].dataset.index = key;

				return all[0];
			}

			return all.reduce((focused, node) => {
				return focused || node.dataset.index === key && node;
			}, null);
		}
	});
};

const
	dataContainerDisabledAttribute = 'data-spotlight-container-disabled',
	isDown = is('down'),
	isLeft = is('left'),
	isRight = is('right'),
	isUp = is('up'),
	JS = 'JS',
	Native = 'Native',
	isItemDisabledDefault = () => (false);

/**
 * The base version of [VirtualListBase]{@link moonstone/VirtualList.VirtualListBase} and
 * [VirtualListBaseNative]{@link moonstone/VirtualList.VirtualListBaseNative}.
 *
 * @class VirtualListCore
 * @memberof moonstone/VirtualList
 * @ui
 * @public
 */
const VirtualListBaseFactory = (type) => {
	const UiBase = (type === JS) ? UiVirtualListBase : UiVirtualListBaseNative;

	return class VirtualListCore extends Component {
		/* No displayName here. We set displayName to returned components of this factory function. */

		static propTypes = /** @lends moonstone/VirtualList.VirtualListCore.prototype */ {
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
			 * Passes the instance of [VirtualList]{@link ui/VirtualList.VirtualList}.
			 *
			 * @type {Object}
			 * @param {Object} ref
			 * @private
			 */
			initUiChildRef: PropTypes.func,

			/**
			 * The Function that returns `true` if the item at the index is disabled.
			 * It is used to navigate a list properly with 5 way keys, page up key,
			 * and page down key. If it is not supplied, it assumes that no items are disabled.
			 *
			 * Usage:
			 * ```
			 * isItemDisabled = (index) => (this.items[index].disabled)
			 * render = () => {
			 * 	return (
			 * 		<VirtualList
			 * 			dataSize={this.items.length}
			 * 			isItemDisabled={isItemDisabled}
			 * 			itemRenderer={this.renderItem}
			 * 			itemSize={this.itemSize}
			 * 		/>
			 * 	);
			 * }
			 * ```
			 *
			 * @type {Function}
			 * @param {Number} index
			 * @public
			 */
			isItemDisabled: PropTypes.func,

			/*
			 * It scrolls by page when `true`, by item when `false`.
			 *
			 * @type {Boolean}
			 * @default false
			 * @private
			 */
			pageScroll: PropTypes.bool,

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
		}

		static defaultProps = {
			dataSize: 0,
			isItemDisabled: isItemDisabledDefault,
			pageScroll: false,
			spacing: 0,
			wrap: false
		}

		constructor (props) {
			super(props);

			const {spotlightId} = props;
			if (spotlightId) {
				configureSpotlight(spotlightId, this);
			}
		}

		componentDidMount () {
			const containerNode = this.uiRef.containerRef;

			if (type === JS) {
				// prevent native scrolling by Spotlight
				this.preventScroll = () => {
					containerNode.scrollTop = 0;
					containerNode.scrollLeft = this.props.rtl ? containerNode.scrollWidth : 0;
				};

				if (containerNode && containerNode.addEventListener) {
					containerNode.addEventListener('scroll', this.preventScroll);
				}
			}

			if (containerNode && containerNode.addEventListener) {
				containerNode.addEventListener('keydown', this.onKeyDown);
			}

			setTimeout(() => {
				this.restoreFocus();
			}, 0);
		}

		componentWillReceiveProps (nextProps) {
			if (nextProps.spotlightId && nextProps.spotlightId !== this.props.spotlightId) {
				configureSpotlight(nextProps.spotlightId, this);
			}
		}

		componentDidUpdate () {
			this.restoreFocus();
		}

		componentWillUnmount () {
			const containerNode = this.uiRef.containerRef;

			if (type === JS) {
				// remove a function for preventing native scrolling by Spotlight
				if (containerNode && containerNode.removeEventListener) {
					containerNode.removeEventListener('scroll', this.preventScroll);
					containerNode.removeEventListener('keydown', this.onKeyDown);
				}
			}

			if (containerNode && containerNode.removeEventListener) {
				containerNode.removeEventListener('keydown', this.onKeyDown);
			}

			this.setContainerDisabled(false);
		}

		isScrolledBy5way = false
		isScrolledByJump = false
		lastFocusedIndex = null
		nodeIndexToBeFocused = null
		preservedIndex = null
		restoreLastFocused = false

		setContainerDisabled = (bool) => {
			const
				{spotlightId} = this.props,
				containerNode = document.querySelector(`[data-spotlight-id="${spotlightId}"]`);

			if (containerNode) {
				containerNode.setAttribute(dataContainerDisabledAttribute, bool);

				if (bool) {
					document.addEventListener('keydown', this.handleGlobalKeyDown, {capture: true});
				} else {
					document.removeEventListener('keydown', this.handleGlobalKeyDown, {capture: true});
				}
			}
		}

		/**
		 * Handle a Page up/down key with disabled items
		 */

		getExtentIndex = (index) => (Math.floor(index / this.uiRef.dimensionToExtent))

		findSpottableItem = (indexFrom, indexTo) => {
			const
				{dataSize, isItemDisabled} = this.props,
				safeIndexFrom = clamp(0, dataSize - 1, indexFrom),
				safeIndexTo = clamp(-1, dataSize, indexTo),
				noDisabledItem = (isItemDisabled === isItemDisabledDefault);

			if (indexFrom < 0 && indexTo < 0 || indexFrom >= dataSize && indexTo >= dataSize) {
				return -1;
			} else if (noDisabledItem) {
				return safeIndexFrom;
			}

			const delta = (indexFrom < indexTo) ? 1 : -1;

			if (safeIndexFrom !== safeIndexTo) {
				for (let i = safeIndexFrom; i !== safeIndexTo; i += delta) {
					if (!isItemDisabled(i)) {
						return i;
					}
				}
			}

			return -1;
		}

		findSpottableItemWithPositionInExtent = (indexFrom, indexTo, position) => {
			const
				{dataSize} = this.props,
				{dimensionToExtent} = this.uiRef;

			if (0 <= indexFrom && indexFrom < dataSize &&
				-1 <= indexTo && indexTo <= dataSize &&
				0 <= position && position < dimensionToExtent) {
				const
					{isItemDisabled} = this.props,
					direction = (indexFrom < indexTo) ? 1 : -1,
					delta = direction * dimensionToExtent,
					diffPosition = (indexFrom % dimensionToExtent) - position,
					// When direction is 1 (forward) and diffPosition is positive, add dimensionToExtent.
					// When direction is -1 (backward) and diffPosition is negative, substract dimensionToExtent.
					startIndex = indexFrom - diffPosition + ((direction * diffPosition > 0) ? delta : 0);

				for (let i = startIndex; direction * (indexTo - i) > 0; i += delta) {
					if (!isItemDisabled(i)) {
						return i;
					}
				}
			}

			return -1;
		}

		findSpottableExtent = (indexFrom, isForward) => {
			const
				{dataSize} = this.props,
				{dimensionToExtent} = this.uiRef,
				{findSpottableItem, getExtentIndex} = this,
				firstIndexInExtent = getExtentIndex(indexFrom) * dimensionToExtent;
			let index;

			if (isForward) {
				index = findSpottableItem(firstIndexInExtent + dimensionToExtent, dataSize);
			} else {
				index = findSpottableItem(firstIndexInExtent - 1, -1);
			}

			return getExtentIndex(index);
		}

		findNearestSpottableItemInExtent = (index, extentIndex) => {
			const
				{dataSize, isItemDisabled} = this.props,
				{dimensionToExtent} = this.uiRef,
				currentPosInExtent = clamp(0, dataSize - 1, index) % dimensionToExtent,
				firstIndexInExtent = clamp(0, this.getExtentIndex(dataSize - 1), extentIndex) * dimensionToExtent,
				lastIndexInExtent = clamp(firstIndexInExtent, dataSize, firstIndexInExtent + dimensionToExtent);
			let
				minDistance = dimensionToExtent,
				distance,
				nearestIndex = -1;

			for (let i = firstIndexInExtent; i < lastIndexInExtent; ++i) {
				if (!isItemDisabled(i)) {
					distance = Math.abs(currentPosInExtent - i % dimensionToExtent);
					if (distance < minDistance) {
						minDistance = distance;
						nearestIndex = i;
					}
				}
			}

			return nearestIndex;
		}

		getIndexToScroll = (direction, currentIndex) => {
			const
				{dataSize, isItemDisabled, spacing} = this.props,
				{dimensionToExtent, primary} = this.uiRef,
				{findSpottableItem} = this,
				{firstVisibleIndex, lastVisibleIndex} = this.uiRef.moreInfo,
				numOfItemsInPage = (Math.floor((primary.clientSize + spacing) / primary.gridSize) * dimensionToExtent),
				isPageDown = (direction === 'down' || direction === 'right') ? 1 : -1,
				noDisabledItem = (isItemDisabled === isItemDisabledDefault);
			let candidateIndex = -1;

			/* First, find a spottable item in this page */
			if (isPageDown === 1) { // Page Down
				if ((lastVisibleIndex - (lastVisibleIndex % dimensionToExtent || dimensionToExtent)) >= currentIndex) {
					candidateIndex = findSpottableItem(
						lastVisibleIndex,
						currentIndex - (currentIndex % dimensionToExtent) + dimensionToExtent - 1
					);
				}
			} else if (firstVisibleIndex + dimensionToExtent <= currentIndex) { // Page Up
				candidateIndex = findSpottableItem(
					firstVisibleIndex,
					currentIndex - (currentIndex % dimensionToExtent)
				);
			}

			/* Second, find a spottable item in the next page */
			if (candidateIndex === -1) {
				if (isPageDown === 1) { // Page Down
					candidateIndex = findSpottableItem(lastVisibleIndex + numOfItemsInPage, lastVisibleIndex);
				} else { // Page Up
					candidateIndex = findSpottableItem(firstVisibleIndex - numOfItemsInPage, firstVisibleIndex);
				}
			}

			/* Last, find a spottable item in a whole data */
			if (candidateIndex === -1) {
				if (isPageDown === 1) { // Page Down
					candidateIndex = findSpottableItem(lastVisibleIndex + numOfItemsInPage + 1, dataSize);
				} else { // Page Up
					candidateIndex = findSpottableItem(firstVisibleIndex - numOfItemsInPage - 1, -1);
				}
			}

			/* For grid lists, find the nearest item from the current item */
			if (candidateIndex !== -1) {
				if (!noDisabledItem) {
					return candidateIndex;
				} else {
					return this.findNearestSpottableItemInExtent(candidateIndex, this.getExtentIndex(candidateIndex));
				}
			} else {
				return -1;
			}
		}

		scrollToNextItem = ({direction, focusedItem}) => {
			const
				{cbScrollTo} = this.props,
				{firstIndex, numOfItems} = this.uiRef.state,
				focusedIndex = Number.parseInt(focusedItem.getAttribute(dataIndexAttribute));
			let indexToScroll = this.getIndexToScroll(direction, focusedIndex);

			if (indexToScroll !== -1) {
				const
					isRtl = this.props.rtl,
					isForward = (direction === 'down' || isRtl && direction === 'left' || !isRtl && direction === 'right');

				if (firstIndex <= indexToScroll && indexToScroll < firstIndex + numOfItems) {
					const node = this.uiRef.containerRef.querySelector(`[data-index='${indexToScroll}'].spottable`);

					if (node) {
						Spotlight.focus(node);
					}
				} else {
					// Scroll to the next spottable item without animation
					if (!Spotlight.isPaused()) {
						Spotlight.pause();
					}
					focusedItem.blur();
					this.nodeIndexToBeFocused = this.lastFocusedIndex = indexToScroll;
				}
				cbScrollTo({index: indexToScroll, stickTo: isForward ? 'end' : 'start', animate: false});
			}

			return true;
		}

		/**
		 * Handle `onKeyDown` event
		 */

		setRestrict = (bool) => {
			Spotlight.set(this.props.spotlightId, {restrict: (bool) ? 'self-only' : 'self-first'});
		}

		setSpotlightContainerRestrict = (keyCode, target) => {
			const
				{dataSize} = this.props,
				{isPrimaryDirectionVertical, dimensionToExtent} = this.uiRef,
				index = Number.parseInt(target.getAttribute(dataIndexAttribute)),
				canMoveBackward = index >= dimensionToExtent,
				canMoveForward = index < (dataSize - (((dataSize - 1) % dimensionToExtent) + 1));
			let isSelfOnly = false;

			if (isPrimaryDirectionVertical) {
				if (isUp(keyCode) && canMoveBackward || isDown(keyCode) && canMoveForward) {
					isSelfOnly = true;
				}
			} else if (isLeft(keyCode) && canMoveBackward || isRight(keyCode) && canMoveForward) {
				isSelfOnly = true;
			}

			this.setRestrict(isSelfOnly);
		}

		jumpToSpottableItem = (keyCode, repeat, target) => {
			const
				{cbScrollTo, dataSize, isItemDisabled, rtl, wrap} = this.props,
				{firstIndex, numOfItems} = this.uiRef.state,
				{dimensionToExtent, isPrimaryDirectionVertical} = this.uiRef,
				currentIndex = Number.parseInt(target.getAttribute(dataIndexAttribute)),
				isForward = (
					isPrimaryDirectionVertical && isDown(keyCode) ||
					!isPrimaryDirectionVertical && (!rtl && isRight(keyCode) || rtl && isLeft(keyCode)) ||
					null
				),
				isBackward = (
					isPrimaryDirectionVertical && isUp(keyCode) ||
					!isPrimaryDirectionVertical && (!rtl && isLeft(keyCode) || rtl && isRight(keyCode)) ||
					null
				);

			// If the currently focused item is disabled, we assume that all items in a list are disabled.
			if (
				(!wrap && isItemDisabled === isItemDisabledDefault) ||
				isItemDisabled(currentIndex) ||
				(!isForward && !isBackward)
			) {
				return false;
			}

			const currentExtent = this.getExtentIndex(currentIndex);
			let
				nextIndex = -1,
				animate = true,
				isWrapped = false,
				spottableExtent = -1;

			if (isForward) {
				nextIndex = this.findSpottableItemWithPositionInExtent(currentIndex + 1, dataSize, currentIndex % dimensionToExtent);
				if (nextIndex === -1) {
					spottableExtent = this.findSpottableExtent(currentIndex, true);
					if (spottableExtent === -1) {
						if (wrap && !repeat) {
							const candidateExtent = this.getExtentIndex(this.findSpottableItem(0, dataSize));

							// If currentExtent is equal to candidateExtent,
							// it means that the current extent is the only spottable extent.
							// So we find nextIndex only when currentExtent is different from candidateExtent.
							if (currentExtent !== candidateExtent) {
								nextIndex = this.findNearestSpottableItemInExtent(currentIndex, candidateExtent);
								animate = (wrap === true);
								isWrapped = true;
							}
						}

						// If there is no item which could get focus forward,
						// we need to set restriction option to `self-first`.
						if (nextIndex === -1) {
							this.setRestrict(false);
						}
					} else {
						nextIndex = this.findNearestSpottableItemInExtent(currentIndex, spottableExtent);
					}
				}
			} else { // isBackward
				nextIndex = this.findSpottableItemWithPositionInExtent(currentIndex - 1, -1, currentIndex % dimensionToExtent);
				if (nextIndex === -1) {
					spottableExtent = this.findSpottableExtent(currentIndex, false);

					if (spottableExtent === -1) {
						if (wrap && !repeat) {
							const candidateExtent = this.getExtentIndex(this.findSpottableItem(dataSize - 1, -1));

							// If currentExtent is equal to candidateExtent,
							// it means that the current extent is the only spottable extent.
							// So we find nextIndex only when currentExtent is different from candidateExtent.
							if (currentExtent !== candidateExtent) {
								nextIndex = this.findNearestSpottableItemInExtent(currentIndex, candidateExtent);
								animate = (wrap === true);
								isWrapped = true;
							}
						}

						// If there is no item which could get focus forward,
						// we need to set restriction option to `self-first`.
						if (nextIndex === -1) {
							this.setRestrict(false);
						}
					} else {
						nextIndex = this.findNearestSpottableItemInExtent(currentIndex, spottableExtent);
					}
				}
			}

			if (nextIndex !== -1) {
				if (firstIndex <= nextIndex && nextIndex < firstIndex + numOfItems) {
					this.focusOnItem(nextIndex);
				} else {
					this.nodeIndexToBeFocused = this.lastFocusedIndex = nextIndex;

					if (!Spotlight.isPaused()) {
						Spotlight.pause();
					}

					if (isWrapped) {
						// In case of 'wrapping-around',
						// we need to blur the current focus immediately
						// since it can be a very long scroll (from one edge to the other edge)
						// and definitely it's not a case of changing "pointer" mode to "5way key" mode.
						target.blur();
					} else {
						// When changing from "pointer" mode to "5way key" mode,
						// a pointer is hidden and a last focused item get focused after 30ms.
						// To make sure the item to be blurred after that, we used 50ms.
						setTimeout(() => {
							target.blur();
						}, 50);
					}

					cbScrollTo({
						index: nextIndex,
						stickTo: isForward ? 'end' : 'start',
						animate
					});
				}

				return true;
			}

			return false;
		}

		onKeyDown = (ev) => {
			const {keyCode, repeat, target} = ev;

			this.isScrolledBy5way = false;
			if (getDirection(keyCode)) {
				ev.preventDefault();
				this.setSpotlightContainerRestrict(keyCode, target);
				this.isScrolledBy5way = this.jumpToSpottableItem(keyCode, repeat, target);
				if (this.isScrolledBy5way) {
					ev.stopPropagation();
				}
			}
		}

		/**
		 * Handle global `onKeyDown` event
		 */

		handleGlobalKeyDown = () => {
			this.setContainerDisabled(false);
		}

		/**
		 * Focus on the Node of the VirtualList item
		 */

		focusOnNode = (node) => {
			if (node) {
				Spotlight.focus(node);
			}
		}

		focusOnItem = (index) => {
			const item = this.uiRef.containerRef.querySelector(`[data-index='${index}'].spottable`);

			if (Spotlight.isPaused()) {
				Spotlight.resume();
			}
			this.focusOnNode(item);
			this.nodeIndexToBeFocused = null;
			this.isScrolledByJump = false;
		}

		initItemRef = (ref, index) => {
			if (ref) {
				if (type === JS) {
					this.focusOnItem(index);
				} else {
					// If focusing the item of VirtuallistNative, `onFocus` in Scrollable will be called.
					// Then VirtualListNative tries to scroll again differently from VirtualList.
					// So we would like to skip `focus` handling when focusing the item as a workaround.
					this.isScrolledByJump = true;
					this.focusOnItem(index);
				}
			}
		}

		focusByIndex = (index) => {
			// We have to focus node async for now since list items are not yet ready when it reaches componentDid* lifecycle methods
			setTimeout(() => {
				this.focusOnItem(index);
			}, 0);
		}

		/**
		 * Manage a placeholder
		 */

		isNeededScrollingPlaceholder = () => this.nodeIndexToBeFocused != null && Spotlight.isPaused();

		handlePlaceholderFocus = (ev) => {
			const placeholder = ev.currentTarget;

			if (placeholder) {
				const index = placeholder.dataset.index;

				if (index) {
					this.preservedIndex = parseInt(index);
					this.restoreLastFocused = true;
				}
			}
		}

		/**
		 * Restore the focus of VirtualList
		 */

		isPlaceholderFocused = () => {
			const current = Spotlight.getCurrent();

			if (current && current.dataset.vlPlaceholder && this.uiRef.containerRef.contains(current)) {
				return true;
			}

			return false;
		}

		restoreFocus = () => {
			if (
				this.restoreLastFocused &&
				!this.isPlaceholderFocused()
			) {
				const
					{spotlightId} = this.props,
					node = this.uiRef.containerRef.querySelector(
						`[data-spotlight-id="${spotlightId}"] [data-index="${this.preservedIndex}"]`
					);

				if (node) {
					// if we're supposed to restore focus and virtual list has positioned a set of items
					// that includes lastFocusedIndex, clear the indicator
					this.restoreLastFocused = false;

					// try to focus the last focused item
					const foundLastFocused = Spotlight.focus(node);

					// but if that fails (because it isn't found or is disabled), focus the container so
					// spotlight isn't lost
					if (!foundLastFocused) {
						this.restoreLastFocused = true;
						Spotlight.focus(spotlightId);
					}
				}
			}
		}

		/**
		 * calculator
		 */

		calculatePositionOnFocus = ({item, scrollPosition = this.uiRef.scrollPosition}) => {
			const
				{pageScroll} = this.props,
				{numOfItems} = this.uiRef.state,
				{primary} = this.uiRef,
				offsetToClientEnd = primary.clientSize - primary.itemSize,
				focusedIndex = Number.parseInt(item.getAttribute(dataIndexAttribute));

			if (!isNaN(focusedIndex)) {
				let gridPosition = this.uiRef.getGridPosition(focusedIndex);

				if (numOfItems > 0 && focusedIndex % numOfItems !== this.lastFocusedIndex % numOfItems) {
					const node = this.uiRef.getItemNode(this.lastFocusedIndex);

					if (node) {
						node.blur();
					}
				}
				this.nodeIndexToBeFocused = null;
				this.lastFocusedIndex = focusedIndex;

				if (primary.clientSize >= primary.itemSize) {
					if (gridPosition.primaryPosition > scrollPosition + offsetToClientEnd) { // forward over
						gridPosition.primaryPosition -= pageScroll ? 0 : offsetToClientEnd;
					} else if (gridPosition.primaryPosition >= scrollPosition) { // inside of client
						if (type === JS) {
							gridPosition.primaryPosition = scrollPosition;
						} else {
							// This code uses the trick to change the target position slightly which will not affect the actual result
							// since a browser ignore `scrollTo` method if the target position is same as the current position.
							gridPosition.primaryPosition = scrollPosition + (this.uiRef.scrollPosition === scrollPosition ? 0.1 : 0);
						}
					} else { // backward over
						gridPosition.primaryPosition -= pageScroll ? offsetToClientEnd : 0;
					}
				}

				// Since the result is used as a target position to be scrolled,
				// scrondaryPosition should be 0 here.
				gridPosition.secondaryPosition = 0;

				return this.uiRef.gridPositionToItemPosition(gridPosition);
			}
		}

		shouldPreventScrollByFocus = () => ((type === JS) ? (this.isScrolledBy5way) : (this.isScrolledBy5way || this.isScrolledByJump))

		setLastFocusedIndex = (param) => {
			this.lastFocusedIndex = param;
		}

		updateStatesAndBounds = ({cbScrollTo, dataSize, moreInfo, numOfItems}) => {
			const {preservedIndex} = this;

			if (this.restoreLastFocused &&
				numOfItems > 0 &&
				(preservedIndex < dataSize) &&
				(preservedIndex < moreInfo.firstVisibleIndex || preservedIndex > moreInfo.lastVisibleIndex)) {
				// If we need to restore last focus and the index is beyond the screen,
				// we call `scrollTo` to create DOM for it.
				cbScrollTo({index: preservedIndex, animate: false, focus: true});
				this.isScrolledByJump = true;

				return true;
			} else {
				return false;
			}
		}

		getScrollBounds = () => this.uiRef.getScrollBounds()

		getComponentProps = (index) => (
			(index === this.nodeIndexToBeFocused) ? {ref: (ref) => this.initItemRef(ref, index)} : {}
		)

		initUiRef = (ref) => {
			if (ref) {
				this.uiRef = ref;
				this.props.initUiChildRef(ref);
			}
		}

		render () {
			const
				{itemRenderer, itemsRenderer, ...rest} = this.props,
				needsScrollingPlaceholder = this.isNeededScrollingPlaceholder();

			delete rest.initUiChildRef;
			delete rest.isItemDisabled;
			delete rest.spotlightId;
			delete rest.wrap;

			return (
				<UiBase
					{...rest}
					getComponentProps={this.getComponentProps}
					itemRenderer={({index, ...itemRest}) => ( // eslint-disable-line react/jsx-no-bind
						itemRenderer({
							... itemRest,
							[dataIndexAttribute]: index,
							index
						})
					)}
					ref={this.initUiRef}
					updateStatesAndBounds={this.updateStatesAndBounds}
					itemsRenderer={(props) => { // eslint-disable-line react/jsx-no-bind
						return itemsRenderer({
							...props,
							handlePlaceholderFocus: this.handlePlaceholderFocus,
							needsScrollingPlaceholder
						});
					}}
				/>
			);
		}
	};
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

const ScrollableVirtualList = (props) => ( // eslint-disable-line react/jsx-no-bind
	<Scrollable
		{...props}
		childRenderer={(childProps) => ( // eslint-disable-line react/jsx-no-bind
			<VirtualListBase
				{...childProps}
				itemsRenderer={({cc, handlePlaceholderFocus, initItemContainerRef: initUiItemContainerRef, needsScrollingPlaceholder, primary}) => ( // eslint-disable-line react/jsx-no-bind
					[
						cc.length ? <div key="0" ref={initUiItemContainerRef} role="list">{cc}</div> : null,
						primary ?
							null :
							<SpotlightPlaceholder
								data-index={0}
								data-vl-placeholder
								key="1"
								onFocus={handlePlaceholderFocus}
							/>,
						needsScrollingPlaceholder ? <SpotlightPlaceholder key="2" /> : null
					]
				)}
			/>
		)}
	/>
);

ScrollableVirtualList.propTypes = /** @lends moonstone/VirtualList.VirtualListBase.prototype */ {
	/**
	 * Direction of the list.
	 *
	 * Valid values are:
	 * * `'horizontal'`, and
	 * * `'vertical'`.
	 *
	 * @type {String}
	 * @default 'vertical'
	 * @public
	 */
	direction: PropTypes.oneOf(['horizontal', 'vertical'])
};

ScrollableVirtualList.defaultProps = {
	direction: 'vertical'
};

const ScrollableVirtualListNative = (props) => (
	<ScrollableNative
		{...props}
		childRenderer={(childProps) => ( // eslint-disable-line react/jsx-no-bind
			<VirtualListBaseNative
				{...childProps}
				itemsRenderer={({cc, handlePlaceholderFocus, initItemContainerRef: initUiItemContainerRef, needsScrollingPlaceholder, primary}) => ( // eslint-disable-line react/jsx-no-bind
					[
						cc.length ? <div key="0" ref={initUiItemContainerRef} role="list">{cc}</div> : null,
						primary ?
							null :
							<SpotlightPlaceholder
								data-index={0}
								data-vl-placeholder
								key="1"
								onFocus={handlePlaceholderFocus}
							/>,
						needsScrollingPlaceholder ? <SpotlightPlaceholder key="2" /> : null
					]
				)}
			/>
		)}
	/>
);

ScrollableVirtualListNative.propTypes = /** @lends moonstone/VirtualList.VirtualListBaseNative.prototype */ {
	/**
	 * Direction of the list.
	 *
	 * Valid values are:
	 * * `'horizontal'`, and
	 * * `'vertical'`.
	 *
	 * @type {String}
	 * @default 'vertical'
	 * @public
	 */
	direction: PropTypes.oneOf(['horizontal', 'vertical'])
};

ScrollableVirtualListNative.defaultProps = {
	direction: 'vertical'
};

export default VirtualListBase;
export {
	ScrollableVirtualList,
	ScrollableVirtualListNative,
	VirtualListBase,
	VirtualListBaseNative
};
