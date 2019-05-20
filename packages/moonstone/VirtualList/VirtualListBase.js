import clamp from 'ramda/src/clamp';
import {is} from '@enact/core/keymap';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Spotlight, {getDirection} from '@enact/spotlight';
import Pause from '@enact/spotlight/Pause';
import Spottable from '@enact/spotlight/Spottable';
import Accelerator from '@enact/spotlight/Accelerator';
import {VirtualListBase as UiVirtualListBase, VirtualListBaseNative as UiVirtualListBaseNative} from '@enact/ui/VirtualList';

import {Scrollable, dataIndexAttribute} from '../Scrollable';
import ScrollableNative from '../Scrollable/ScrollableNative';

const SpotlightAccelerator = new Accelerator();
const SpotlightPlaceholder = Spottable('div');

const
	dataContainerDisabledAttribute = 'data-spotlight-container-disabled',
	isDown = is('down'),
	isEnter = is('enter'),
	isLeft = is('left'),
	isRight = is('right'),
	isUp = is('up'),
	JS = 'JS',
	Native = 'Native',
	isItemDisabledDefault = () => (false),
	// using 'bitwise or' for string > number conversion based on performance: https://jsperf.com/convert-string-to-number-techniques/7
	getNumberValue = (index) => index | 0;

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
				this.configureSpotlight(spotlightId);
			}

			this.pause = new Pause('VirtualListBase');
		}

		componentDidMount () {
			const containerNode = this.uiRefCurrent.containerRef.current;

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
				containerNode.addEventListener('keyup', this.onKeyUp);
			}

			setTimeout(() => {
				this.restoreFocus();
			}, 0);
		}

		componentDidUpdate (prevProps) {
			if (prevProps.spotlightId !== this.props.spotlightId) {
				this.configureSpotlight(this.props.spotlightId);
			}
			this.restoreFocus();
		}

		componentWillUnmount () {
			const containerNode = this.uiRefCurrent.containerRef.current;

			if (type === JS) {
				// remove a function for preventing native scrolling by Spotlight
				if (containerNode && containerNode.removeEventListener) {
					containerNode.removeEventListener('scroll', this.preventScroll);
				}
			}

			if (containerNode && containerNode.removeEventListener) {
				containerNode.removeEventListener('keydown', this.onKeyDown);
				containerNode.removeEventListener('keyup', this.onKeyUp);
			}

			this.resumeSpotlight();
			this.setContainerDisabled(false);
		}

		isScrolledBy5way = false
		isScrolledByJump = false
		isWrappedBy5way = false
		lastFocusedIndex = null
		nodeIndexToBeFocused = null
		preservedIndex = null
		restoreLastFocused = false
		uiRefCurrent = null

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

		configureSpotlight = (spotlightId) => {
			const {spacing} = this.props;

			Spotlight.set(spotlightId, {
				enterTo: 'last-focused',
				/*
				 * Returns the data-index as the key for last focused
				 */
				lastFocusedPersist: this.lastFocusedPersist,
				/*
				 * Restores the data-index into the placeholder if its the only element. Tries to find a
				 * matching child otherwise.
				 */
				lastFocusedRestore: this.lastFocusedRestore,
				/*
				 * Directs spotlight focus to favor straight elements that are within range of `spacing`
				 * over oblique elements, like scroll buttons.
				 */
				obliqueMultiplier: spacing > 0 ? spacing : 1
			});
		}

		lastFocusedPersist = () => {
			if (this.lastFocusedIndex != null) {
				return {
					container: false,
					element: true,
					key: this.lastFocusedIndex
				};
			}
		}

		/*
		 * Restores the data-index into the placeholder if its the only element. Tries to find a
		 * matching child otherwise.
		 */
		lastFocusedRestore = ({key}, all) => {
			if (all.length === 1 && 'vlPlaceholder' in all[0].dataset) {
				all[0].dataset.index = key;

				return all[0];
			}

			return all.reduce((focused, node) => {
				return focused || Number(node.dataset.index) === key && node;
			}, null);
		}

		/**
		 * Handle a Page up/down key with disabled items
		 */

		getExtentIndex = (index) => (Math.floor(index / this.uiRefCurrent.dimensionToExtent))

		findSpottableItem = (indexFrom, indexTo) => {
			const
				{dataSize, isItemDisabled} = this.props,
				safeIndexFrom = clamp(0, dataSize - 1, indexFrom),
				safeIndexTo = clamp(-1, dataSize, indexTo),
				delta = (indexFrom < indexTo) ? 1 : -1;

			if (indexFrom < 0 && indexTo < 0 || indexFrom >= dataSize && indexTo >= dataSize) {
				return -1;
			} else if (isItemDisabled === isItemDisabledDefault) {
				return safeIndexFrom;
			}

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
				{dimensionToExtent} = this.uiRefCurrent;

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
				{dimensionToExtent} = this.uiRefCurrent,
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
				{dimensionToExtent} = this.uiRefCurrent,
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
				{dataSize, spacing} = this.props,
				{dimensionToExtent, primary: {clientSize, gridSize, itemSize}, scrollPosition} = this.uiRefCurrent,
				{findSpottableItem} = this,
				numOfItemsInPage = Math.floor((clientSize + spacing) / gridSize) * dimensionToExtent,
				firstFullyVisibleIndex = Math.ceil(scrollPosition / gridSize) * dimensionToExtent,
				lastFullyVisibleIndex = Math.min(dataSize - 1, Math.floor((scrollPosition + clientSize - itemSize) / gridSize) * dimensionToExtent);
			let candidateIndex = -1;

			/* First, find a spottable item in this page */
			if (direction === 'down') { // Page Down
				if ((lastFullyVisibleIndex - (lastFullyVisibleIndex % dimensionToExtent)) > currentIndex) { // If a current focused item is in the last visible line.
					candidateIndex = findSpottableItem(
						lastFullyVisibleIndex,
						currentIndex - (currentIndex % dimensionToExtent) + dimensionToExtent - 1
					);
				}
			} else if (firstFullyVisibleIndex + dimensionToExtent <= currentIndex) { // Page Up,  if a current focused item is in the first visible line.
				candidateIndex = findSpottableItem(
					firstFullyVisibleIndex,
					currentIndex - (currentIndex % dimensionToExtent)
				);
			}

			/* Second, find a spottable item in the next page */
			if (candidateIndex === -1) {
				if (direction === 'down') { // Page Down
					candidateIndex = findSpottableItem(lastFullyVisibleIndex + numOfItemsInPage, lastFullyVisibleIndex);
				} else { // Page Up
					candidateIndex = findSpottableItem(firstFullyVisibleIndex - numOfItemsInPage, firstFullyVisibleIndex);
				}
			}

			/* Last, find a spottable item in a whole data */
			if (candidateIndex === -1) {
				if (direction === 'down') { // Page Down
					candidateIndex = findSpottableItem(lastFullyVisibleIndex + numOfItemsInPage + 1, dataSize);
				} else { // Page Up
					candidateIndex = findSpottableItem(firstFullyVisibleIndex - numOfItemsInPage - 1, -1);
				}
			}

			/* For grid lists, find the nearest item from the current item */
			if (candidateIndex !== -1) {
				return this.findNearestSpottableItemInExtent(currentIndex, this.getExtentIndex(candidateIndex));
			} else {
				return -1;
			}
		}

		scrollToNextItem = ({direction, focusedItem}) => {
			const
				{cbScrollTo} = this.props,
				{firstIndex, numOfItems} = this.uiRefCurrent.state,
				focusedIndex = getNumberValue(focusedItem.getAttribute(dataIndexAttribute)),
				indexToScroll = this.getIndexToScroll(direction, focusedIndex);

			if (indexToScroll !== -1 && focusedIndex !== indexToScroll) {
				if (firstIndex <= indexToScroll && indexToScroll < firstIndex + numOfItems) {
					const node = this.uiRefCurrent.containerRef.current.querySelector(`[data-index='${indexToScroll}'].spottable`);

					if (node) {
						Spotlight.focus(node);
					}
				} else {
					// Scroll to the next spottable item without animation
					this.pause.pause();
					focusedItem.blur();
					this.nodeIndexToBeFocused = this.lastFocusedIndex = indexToScroll;
				}
				cbScrollTo({index: indexToScroll, stickTo: direction === 'down' ? 'end' : 'start', animate: false});
			}
		}

		getNextIndex = ({index, keyCode, repeat}) => {
			const {dataSize, rtl, wrap} = this.props;
			const {isPrimaryDirectionVertical, dimensionToExtent} = this.uiRefCurrent;
			const isDownKey = isDown(keyCode);
			const isLeftMovement = (!rtl && isLeft(keyCode)) || (rtl && isRight(keyCode));
			const isRightMovement = (!rtl && isRight(keyCode)) || (rtl && isLeft(keyCode));
			const isUpKey = isUp(keyCode);
			let isWrapped = false;
			let nextIndex = -1;

			if (isPrimaryDirectionVertical) {
				if (isUpKey) {
					nextIndex = this.findSpottableItemWithPositionInExtent(index - 1, -1, index % dimensionToExtent);
				} else if (isDownKey) {
					nextIndex = this.findSpottableItemWithPositionInExtent(index + 1, dataSize, index % dimensionToExtent);
				} else if (isLeftMovement && index % dimensionToExtent) {
					nextIndex = index - 1;
				} else if (isRightMovement && index % dimensionToExtent < dimensionToExtent - 1) {
					nextIndex = index + 1;
				}
			} else if (isLeftMovement) {
				nextIndex = this.findSpottableItemWithPositionInExtent(index - 1, -1, index % dimensionToExtent);
			} else if (isRightMovement) {
				nextIndex = this.findSpottableItemWithPositionInExtent(index + 1, dataSize, index % dimensionToExtent);
			} else if (isUpKey && index % dimensionToExtent) {
				nextIndex = index - 1;
			} else if (isDownKey && index % dimensionToExtent < dimensionToExtent - 1) {
				nextIndex = index + 1;
			}

			if (!repeat && nextIndex === -1 && wrap) {
				const isForward = (
					isPrimaryDirectionVertical && isDownKey ||
					!isPrimaryDirectionVertical && isRightMovement ||
					null
				);
				const isBackward = (
					isPrimaryDirectionVertical && isUpKey ||
					!isPrimaryDirectionVertical && isLeftMovement ||
					null
				);

				if (isForward) {
					nextIndex = this.findSpottableItemWithPositionInExtent(0, dataSize, index % dimensionToExtent);
					isWrapped = true;
				} else if (isBackward) {
					nextIndex = this.findSpottableItemWithPositionInExtent(dataSize - 1, -1, index % dimensionToExtent);
					isWrapped = true;
				}
			}

			return {isWrapped, nextIndex};
		}

		/**
		 * Handle `onKeyDown` event
		 */

		onAcceleratedKeyDown = ({keyCode, repeat, target}) => {
			const {cbScrollTo, spacing, wrap} = this.props;
			const {dimensionToExtent, primary: {clientSize, gridSize}, scrollPosition} = this.uiRefCurrent;
			const index = getNumberValue(target.dataset.index);
			const {isWrapped, nextIndex} = this.getNextIndex({index, keyCode, repeat});

			this.isScrolledBy5way = false;
			this.isScrolledByJump = false;

			if (nextIndex >= 0) {
				const numOfItemsInPage = Math.floor((clientSize + spacing) / gridSize) * dimensionToExtent;
				const firstFullyVisibleIndex = Math.ceil(scrollPosition / gridSize) * dimensionToExtent;
				const isNextItemInView = nextIndex >= firstFullyVisibleIndex && nextIndex < firstFullyVisibleIndex + numOfItemsInPage;

				if (isNextItemInView) {
					this.focusOnItem(nextIndex);
				} else {
					this.isScrolledBy5way = true;

					if (isWrapped && wrap === true) {
						this.isWrappedBy5way = true;
						this.pause.pause();
						target.blur();
					} else if (!isWrapped || wrap !== 'noAnimation') {
						this.focusOnItem(nextIndex);
					}

					this.lastFocusedIndex = nextIndex;
					this.nodeIndexToBeFocused = nextIndex;

					cbScrollTo({
						index: nextIndex,
						stickTo: index < nextIndex ? 'end' : 'start',
						animate: !(isWrapped && wrap === 'noAnimation')
					});
				}

			} else if (!repeat && Spotlight.move(getDirection(keyCode))) {
				this.resumeSpotlight();
			}
		}

		onKeyDown = (ev) => {
			if (getDirection(ev.keyCode)) {
				ev.preventDefault();
				this.pause.pause();
				Spotlight.setPointerMode(false);
				SpotlightAccelerator.processKey(ev, this.onAcceleratedKeyDown);
			}
		}

		onKeyUp = ({keyCode}) => {
			if (getDirection(keyCode) || isEnter(keyCode)) {
				this.resumeSpotlight();
			}
		}

		resumeSpotlight = () => {
			this.pause.resume();
			SpotlightAccelerator.reset();
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
			const item = this.uiRefCurrent.containerRef.current.querySelector(`[data-index='${index}'].spottable`);

			if (this.isWrappedBy5way) {
				this.resumeSpotlight();
				this.isWrappedBy5way = false;
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
					this.preservedIndex = getNumberValue(index);
					this.restoreLastFocused = true;
				}
			}
		}

		/**
		 * Restore the focus of VirtualList
		 */

		isPlaceholderFocused = () => {
			const current = Spotlight.getCurrent();

			if (current && current.dataset.vlPlaceholder && this.uiRefCurrent.containerRef.current.contains(current)) {
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
					node = this.uiRefCurrent.containerRef.current.querySelector(
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

		calculatePositionOnFocus = ({item, scrollPosition = this.uiRefCurrent.scrollPosition}) => {
			const
				{pageScroll} = this.props,
				{numOfItems} = this.uiRefCurrent.state,
				{primary} = this.uiRefCurrent,
				offsetToClientEnd = primary.clientSize - primary.itemSize,
				focusedIndex = getNumberValue(item.getAttribute(dataIndexAttribute));

			if (!isNaN(focusedIndex)) {
				let gridPosition = this.uiRefCurrent.getGridPosition(focusedIndex);

				if (numOfItems > 0 && focusedIndex % numOfItems !== this.lastFocusedIndex % numOfItems) {
					const node = this.uiRefCurrent.getItemNode(this.lastFocusedIndex);

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
							gridPosition.primaryPosition = scrollPosition + (this.uiRefCurrent.scrollPosition === scrollPosition ? 0.1 : 0);
						}
					} else { // backward over
						gridPosition.primaryPosition -= pageScroll ? offsetToClientEnd : 0;
					}
				}

				// Since the result is used as a target position to be scrolled,
				// scrondaryPosition should be 0 here.
				gridPosition.secondaryPosition = 0;

				return this.uiRefCurrent.gridPositionToItemPosition(gridPosition);
			}
		}

		shouldPreventScrollByFocus = () => ((type === JS) ? (this.isScrolledBy5way) : (this.isScrolledBy5way || this.isScrolledByJump))

		shouldPreventOverscrollEffect = () => (this.isWrappedBy5way)

		setLastFocusedNode = (node) => {
			this.lastFocusedIndex = node.dataset && getNumberValue(node.dataset.index);
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

		getScrollBounds = () => this.uiRefCurrent.getScrollBounds()

		getComponentProps = (index) => (
			(index === this.nodeIndexToBeFocused) ? {ref: (ref) => this.initItemRef(ref, index)} : {}
		)

		initUiRef = (ref) => {
			if (ref) {
				this.uiRefCurrent = ref;
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
 * Activates the component for voice control.
 *
 * @name data-webos-voice-focused
 * @memberof moonstone/VirtualList.VirtualListBase.prototype
 * @type {Boolean}
 * @public
 */

/**
 * The voice control group label.
 *
 * @name data-webos-voice-group-label
 * @memberof moonstone/VirtualList.VirtualListBase.prototype
 * @type {String}
 * @public
 */

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
