/**
 * Provides Moonstone-themed virtual list components and behaviors.
 *
 * @module moonstone/VirtualList
 * @exports VirtualList
 * @exports VirtualGridList
 * @exports VirtualListBase
 * @exports VirtualListNative
 * @exports VirtualGridListNative
 * @exports VirtualListBaseNative
 */

import clamp from 'ramda/src/clamp';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import {forward} from '@enact/core/handle';
import {is} from '@enact/core/keymap';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Spotlight, {getDirection} from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import Spottable from '@enact/spotlight/Spottable';
import {VirtualListBase as UiVirtualListBase} from '@enact/ui/VirtualList';
import {VirtualListBaseNative as UiVirtualListBaseNative} from '@enact/ui/VirtualList/VirtualListNative';

import {Scrollable, dataIndexAttribute} from '../Scrollable';
import ScrollableNative from '../Scrollable/ScrollableNative';

const
	SpotlightPlaceholder = Spottable('div'),
	SpotlightContainerConfig = {
		enterTo: 'last-focused',
		/*
		 * Returns the data-index as the key for last focused
		 */
		lastFocusedPersist: (node) => {
			const indexed = node.dataset.index ? node : node.closest('[data-index]');
			if (indexed) {
				return {
					container: false,
					element: true,
					key: indexed.dataset.index
				};
			}
		},
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
		},
		preserveId: true,
		restrict: 'self-first'
	};

const
	dataContainerDisabledAttribute = 'data-container-disabled',
	isDown = is('down'),
	isLeft = is('left'),
	isRight = is('right'),
	isUp = is('up'),
	JS = 'JS',
	Native = 'Native';

/**
 * A moonstone-styled decorator component for
 * [VirtualList]{@link moonstone/VirtualList.VirtualList} and [VirtualGridList]{@link moonstone/VirtualList.VirtualGridList}.
 *
 * @hoc
 * @memberof moonstone/VirtualList
 * @ui
 * @private
 */
const VirtualListBase = (type) => {
	const UiBase = (type === JS) ? UiVirtualListBase : UiVirtualListBaseNative;

	return class VirtualListCore extends Component {
		static displayName = 'VirtualListBase'

		static propTypes = /** @lends moonstone/VirtualList.VirtualList.prototype */ {
			/**
			 * The `render` function for an item of the list
			 *
			 * @type {Function}
			 * @public
			 */
			component: PropTypes.func.isRequired,

			/**
			 * Spotlight container Id
			 *
			 * @type {String}
			 * @private
			 */
			'data-container-id': PropTypes.string, // eslint-disable-line react/sort-prop-types,

			initUiChildRef: PropTypes.func,

			/**
			 * Component for child
			 *
			 * @type {Function}
			 * @public
			 */
			render: PropTypes.func
		}

		static contextTypes = contextTypes

		componentDidMount () {
			if (type === JS) {
				const containerNode = this.uiRef.containerRef;

				// prevent native scrolling by Spotlight
				this.preventScroll = () => {
					containerNode.scrollTop = 0;
					containerNode.scrollLeft = this.context.rtl ? containerNode.scrollWidth : 0;
				};

				if (containerNode && containerNode.addEventListener) {
					containerNode.addEventListener('scroll', this.preventScroll);
					containerNode.addEventListener('keydown', this.onKeyDown);
				}
			}
		}

		componentDidUpdate () {
			this.restoreFocus();
		}

		componentWillUnmount () {
			if (this.setContainerDisabled) {
				this.setContainerDisabled(false);
			}

			if (type === JS) {
				const containerNode = this.uiRef.containerRef;

				// remove a function for preventing native scrolling by Spotlight
				if (containerNode && containerNode.removeEventListener) {
					containerNode.removeEventListener('scroll', this.preventScroll);
					containerNode.removeEventListener('keydown', this.onKeyDown);
				}
			}
		}

		isScrolledBy5way = false
		isScrolledByJump = false
		lastFocusedIndex = null
		nodeIndexToBeFocused = null
		preservedIndex = null
		restoreLastFocused = false

		setContainerDisabled = (bool) => {
			const containerNode = (type === JS) ? this.uiRef.containerRef : this.uiRef.contentRef;

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

		findSpottableItem = (indexFrom, indexTo) => {
			const
				{data, dataSize} = this.uiRef.props,
				safeIndexFrom = clamp(0, dataSize - 1, indexFrom),
				safeIndexTo = clamp(-1, dataSize, indexTo),
				delta = (indexFrom < indexTo) ? 1 : -1;

			if (indexFrom < 0 && indexTo < 0 || indexFrom >= dataSize && indexTo >= dataSize) {
				return -1;
			}

			if (safeIndexFrom !== safeIndexTo) {
				for (let i = safeIndexFrom; i !== safeIndexTo; i += delta) {
					if (data[i] && data[i].disabled === false) {
						return i;
					}
				}
			}

			return -1;
		}

		getIndexToScrollDisabled = (direction, currentIndex) => {
			const
				{data, dataSize, spacing} = this.uiRef.props,
				{dimensionToExtent, primary} = this.uiRef,
				{findSpottableItem} = this,
				{firstVisibleIndex, lastVisibleIndex} = this.uiRef.moreInfo,
				numOfItemsInPage = (Math.floor((primary.clientSize + spacing) / primary.gridSize) * dimensionToExtent),
				isPageDown = (direction === 'down' || direction === 'right') ? 1 : -1;
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
				const
					currentPosInExtent = currentIndex % dimensionToExtent,
					firstIndexInExtent = candidateIndex - (candidateIndex % dimensionToExtent),
					lastIndexInExtent = clamp(firstIndexInExtent, dataSize - 1, firstIndexInExtent + dimensionToExtent);
				let
					minDistance = dimensionToExtent,
					distance,
					index;
				for (let i = firstIndexInExtent; i <= lastIndexInExtent; ++i) {
					if (data[i] && !data[i].disabled) {
						distance = Math.abs(currentPosInExtent - i % dimensionToExtent);
						if (distance < minDistance) {
							minDistance = distance;
							index = i;
						}
					}
				}

				return index;
			} else {
				return -1;
			}
		}

		getIndexToScroll = (direction, currentIndex) => {
			const
				{dataSize, spacing} = this.uiRef.props,
				{dimensionToExtent, primary} = this.uiRef,
				numOfItemsInPage = Math.floor((primary.clientSize + spacing) / primary.gridSize) * dimensionToExtent,
				factor = (direction === 'down' || direction === 'right') ? 1 : -1;
			let indexToScroll = currentIndex + factor * numOfItemsInPage;

			if (indexToScroll < 0) {
				indexToScroll = currentIndex % dimensionToExtent;
			} else if (indexToScroll >= dataSize) {
				indexToScroll = dataSize - dataSize % dimensionToExtent + currentIndex % dimensionToExtent;
				if (indexToScroll >= dataSize) {
					indexToScroll = dataSize - 1;
				}
			}

			return indexToScroll === currentIndex ? -1 : indexToScroll;
		}

		scrollToNextItem = ({direction, focusedItem}) => {
			const
				{data} = this.uiRef.props,
				focusedIndex = Number.parseInt(focusedItem.getAttribute(dataIndexAttribute)),
				{firstVisibleIndex, lastVisibleIndex} = this.uiRef.moreInfo;
			let indexToScroll = -1;

			if (Array.isArray(data) && data.some((item) => item.disabled)) {
				indexToScroll = this.getIndexToScrollDisabled(direction, focusedIndex);
			} else {
				indexToScroll = this.getIndexToScroll(direction, focusedIndex);
			}

			if (indexToScroll !== -1) {
				const
					isRtl = this.context.rtl,
					isForward = (direction === 'down' || isRtl && direction === 'left' || !isRtl && direction === 'right');

				if (type === JS) {
					// To prevent item positioning issue, make all items to be rendered.
					this.uiRef.updateFrom = null;
					this.uiRef.updateTo = null;
				}

				if (firstVisibleIndex <= indexToScroll && indexToScroll <= lastVisibleIndex) {
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
				}
				this.nodeIndexToBeFocused = this.lastFocusedIndex = indexToScroll;
				this.uiRef.props.cbScrollTo({index: indexToScroll, stickTo: isForward ? 'end' : 'start', animate: false});
			}

			return true;
		}

		/**
		 * Handle `onKeyDown` event
		 */

		setRestrict = (bool) => {
			Spotlight.set(this.props['data-container-id'], {restrict: (bool) ? 'self-only' : 'self-first'});
		}

		setSpotlightContainerRestrict = (keyCode, target) => {
			const
				{dataSize} = this.uiRef.props,
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

		jumpToSpottableItem = (keyCode, target) => {
			const
				{cbScrollTo, data, dataSize} = this.uiRef.props,
				{firstIndex, numOfItems} = this.uiRef.state,
				{isPrimaryDirectionVertical} = this.uiRef,
				rtl = this.context.rtl,
				currentIndex = Number.parseInt(target.getAttribute(dataIndexAttribute));

			if (!data || !Array.isArray(data) || !data[currentIndex] || data[currentIndex].disabled) {
				return false;
			}

			const
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

			let nextIndex = -1;

			if (isForward) {
				// See if the next item is spottable then delegate scroll to onFocus handler
				if (currentIndex < dataSize - 1 && !data[currentIndex + 1].disabled) {
					return false;
				}

				for (let i = currentIndex + 2; i < dataSize; i++) {
					if (!data[i].disabled) {
						nextIndex = i;
						break;
					}
				}

				// If there is no item which could get focus forward,
				// we need to set restriction option to `self-first`.
				if (nextIndex === -1) {
					this.setRestrict(false);
				}
			} else if (isBackward) {
				// See if the next item is spottable then delegate scroll to onFocus handler
				if (currentIndex > 0 && !data[currentIndex - 1].disabled) {
					return false;
				}

				for (let i = currentIndex - 2; i >= 0; i--) {
					if (!data[i].disabled) {
						nextIndex = i;
						break;
					}
				}

				// If there is no item which could get focus backward,
				// we need to set restriction option to `self-first`.
				if (nextIndex === -1) {
					this.setRestrict(false);
				}
			} else {
				return false;
			}

			if (nextIndex !== -1 && (firstIndex > nextIndex || nextIndex >= firstIndex + numOfItems)) {
				// When changing from "pointer" mode to "5way key" mode,
				// a pointer is hidden and a last focused item get focused after 30ms.
				// To make sure the item to be blurred after that, we used 50ms.
				setTimeout(() => {
					target.blur();
				}, 50);

				this.nodeIndexToBeFocused = this.lastFocusedIndex = nextIndex;

				if (!Spotlight.isPaused()) {
					Spotlight.pause();
				}

				cbScrollTo({
					index: nextIndex,
					stickTo: isForward ? 'end' : 'start'
				});
				return true;
			}

			return false;
		}

		onKeyDown = (ev) => {
			const {keyCode, target} = ev;

			this.isScrolledBy5way = false;
			if (getDirection(keyCode)) {
				if (type === Native) {
					ev.preventDefault();
				}
				this.setSpotlightContainerRestrict(keyCode, target);
				this.isScrolledBy5way = this.jumpToSpottableItem(keyCode, target);
			}
			forward('onKeyDown', ev, this.props);
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
				if (type === JS) {
					this.forceUpdate();
				}
			}
			this.focusOnNode(item);
			this.nodeIndexToBeFocused = null;
		}

		initItemRef = (ref, index) => {
			if (ref) {
				if (type === JS) {
					this.focusOnItem(index);
				} else if (type === Native) {
					// If focusing the item of VirtuallistNative, `onFocus` in Scrollable will be called.
					// Then VirtualListNative tries to scroll again differently from VirtualList.
					// So we would like to skip `focus` handling when focusing the item as a workaround.
					this.isScrolledByJump = true;
					this.focusOnItem(index);
					this.isScrolledByJump = false;
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

			if (current && current.dataset.vlPlaceholder && this.containerRef.contains(current)) {
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
					containerId = this.props['data-container-id'],
					node = this.uiRef.containerRef.querySelector(
						`[data-container-id="${containerId}"] [data-index="${this.preservedIndex}"]`
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
						Spotlight.focus(containerId);
					}
				}
			}
		}

		/**
		 * calculator
		 */

		calculatePositionOnFocus = ({item, scrollPosition = this.uiRef.scrollPosition}) => {
			const
				{pageScroll} = this.uiRef.props,
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
				if (type === JS) {
					this.nodeIndexToBeFocused = null;
				}
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
				cbScrollTo({index: preservedIndex, animate: false});

				return true;
			} else {
				return false;
			}
		}

		getXY = (isPrimaryDirectionVertical, primaryPosition, secondaryPosition) => {
			const rtlDirection = this.context.rtl ? -1 : 1;
			return (isPrimaryDirectionVertical ? {x: (secondaryPosition * rtlDirection), y: primaryPosition} : {x: (primaryPosition * rtlDirection), y: secondaryPosition});
		}

		scrollToPosition (x, y) {
			const node = this.containerRef;
			node.scrollTo((this.context.rtl && !this.uiRef.isPrimaryDirectionVertical) ? this.uiRef.scrollBounds.maxLeft - x : x, y);
		}

		getScrollBounds = () => this.uiRef.getScrollBounds()

		getComponentProps = (index) => (
			(index === this.nodeIndexToBeFocused) ? {ref: (ref) => this.initItemRef(ref, index)} : {}
		)

		render () {
			const
				{component, initUiChildRef, render, ...rest} = this.props,
				needsScrollingPlaceholder = this.isNeededScrollingPlaceholder();

			return (
				<UiBase
					{...rest}
					component={({index, ...itemRest}) => ( // eslint-disable-line react/jsx-no-bind
						component({
							... itemRest,
							[dataIndexAttribute]: index,
							index
						})
					)}
					getComponentProps={this.getComponentProps}
					getXY={this.getXY}
					ref={(ref) => { // eslint-disable-line react/jsx-no-bind
						if (ref) {
							this.uiRef = ref;
							initUiChildRef(ref);
						}
					}}
					updateStatesAndBounds={this.updateStatesAndBound}
					render={(props) => { // eslint-disable-line react/jsx-no-bind
						return render({
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

const VirtualListBaseJS = VirtualListBase(JS);

const VirtualListBaseNative = VirtualListBase(Native);

const
	SpottableScrollable = SpotlightContainerDecorator(SpotlightContainerConfig, Scrollable),
	SpottableScrollableNative = SpotlightContainerDecorator(SpotlightContainerConfig, ScrollableNative);

/**
 * A moonstone-styled scrollable and spottable virtual list component.
 *
 * @class VirtualList
 * @memberof moonstone/VirtualList
 * @mixes moonstone/Scrollable.Scrollable
 * @mixes ui/Scrollable.Scrollable
 * @ui
 * @public
 */
const VirtualList = (props) => ( // eslint-disable-line react/jsx-no-bind
	<SpottableScrollable
		{...props}
		render={(virtualListProps) => ( // eslint-disable-line react/jsx-no-bind
			<VirtualListBaseJS
				{...virtualListProps}
				type="JS"
				render={({cc, primary, needsScrollingPlaceholder, initItemContainerRef, handlePlaceholderFocus}) => ( // eslint-disable-line react/jsx-no-bind
					[
						cc.length ? <div key="0" ref={initItemContainerRef}>{cc}</div> : null,
						primary ?
							null :
							<SpotlightPlaceholder
								data-index={0}
								data-vl-placeholder
								key="1"
								onFocus={handlePlaceholderFocus}
								role="region"
							/>,
						needsScrollingPlaceholder ? <SpotlightPlaceholder key="2" /> : null
					]
				)}
			/>
		)}
	/>
);

/**
 * A moonstone-styled scrollable and spottable virtual grid list component.
 *
 * @class VirtualGridList
 * @memberof moonstone/VirtualList
 * @mixes moonstone/Scrollable.Scrollable
 * @mixes ui/Scrollable.Scrollable
 * @ui
 * @public
 */
const VirtualGridList = VirtualList;

/**
 * A moonstone-styled scrollable and spottable virtual native list component.
 * For smooth native scrolling, web engine with below Chromium 61, should be launched
 * with the flag '--enable-blink-features=CSSOMSmoothScroll' to support it.
 * The one with Chromium 61 or above, is launched to support it by default.
 *
 * @class VirtualListNative
 * @memberof moonstone/VirtualList
 * @mixes moonstone/Scrollable.ScrollableNative
 * @mixes ui/Scrollable.ScrollableNative
 * @ui
 * @public
 */
const VirtualListNative = (props) => (
	<SpottableScrollableNative
		{...props}
		render={(virtualListProps) => ( // eslint-disable-line react/jsx-no-bind
			<VirtualListBaseNative
				{...virtualListProps}
				type="Native"
				render={({cc, primary, needsScrollingPlaceholder, initItemContainerRef, handlePlaceholderFocus}) => ( // eslint-disable-line react/jsx-no-bind
					[
						cc.length ? <div key="0" ref={initItemContainerRef}>{cc}</div> : null,
						primary ?
							null :
							<SpotlightPlaceholder
								data-index={0}
								data-vl-placeholder
								key="1"
								onFocus={handlePlaceholderFocus}
								role="region"
							/>,
						needsScrollingPlaceholder ? <SpotlightPlaceholder key="2" /> : null
					]
				)}
			/>
		)}
	/>
);

/**
 * A moonstone-styled scrollable and spottable virtual grid native list component.
 * For smooth native scrolling, web engine with below Chromium 61, should be launched
 * with the flag '--enable-blink-features=CSSOMSmoothScroll' to support it.
 * The one with Chromium 61 or above, is launched to support it by default.
 *
 * @class VirtualGridListNative
 * @memberof moonstone/VirtualList
 * @mixes moonstone/Scrollable.ScrollableNative
 * @mixes ui/Scrollable.ScrollableNative
 * @ui
 * @public
 */
const VirtualGridListNative = VirtualListNative;

export default VirtualList;
export {
	VirtualList,
	VirtualGridList,
	VirtualListNative,
	VirtualGridListNative,
	UiVirtualListBase as VirtualListBase,
	UiVirtualListBaseNative as VirtualListBaseNative
};
