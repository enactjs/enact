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
import classNames from 'classnames';
import compose from 'ramda/src/compose';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import css from '@enact/ui/VirtualList/ListItem.less';
import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {is} from '@enact/core/keymap';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Scrollable as UiScrollable} from '@enact/ui/Scrollable';
import {ScrollableNative as UiScrollableNative} from '@enact/ui/Scrollable/ScrollableNative';
import Spotlight, {getDirection} from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import Spottable from '@enact/spotlight/Spottable';
import {VirtualListBase as UiVirtualListBase, contextTypes as contextTypesVirtaulList} from '@enact/ui/VirtualList';
import {VirtualListBaseNative as UiVirtualListBaseNative, contextTypes as contextTypesVirtaulListNative} from '@enact/ui/VirtualList/VirtualListNative';

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
	forwardKeyDown = forward('onKeyDown'),
	isDown = is('down'),
	isLeft = is('left'),
	isRight = is('right'),
	isUp = is('up');

/**
 * A moonstone-styled decorator component for
 * [VirtualList]{@link moonstone/VirtualList.VirtualList} and [VirtualGridList]{@link moonstone/VirtualList.VirtualGridList}.
 *
 * @hoc
 * @memberof moonstone/VirtualList
 * @ui
 * @private
 */
const SpottableVirtualListDecorator = (type) => hoc((config, Wrapped) => (
	class SpottableVirtualList extends Component {
		static displayName = 'SpottlableVirtualListDecorator'

		static propTypes = /** @lends moonstone/VirtualList.SpottableVirtualListDecorator.prototype */ {
			/**
			 * The `render` function for an item of the list receives the following parameters:
			 * - `data` is for accessing the supplied `data` property of the list.
			 * > NOTE: In most cases, it is recommended to use data from redux store instead of using
			 * is parameters due to performance optimizations
			 * - `data-index` is required for Spotlight 5-way navigation. Pass to the root element in
			 *   the component.
			 * - `index` is the index number of the componet to render
			 * - `key` MUST be passed as a prop to the root element in the component for DOM recycling.
			 *
			 * Data manipulation can be done in this function.
			 *
			 * > NOTE: The list does NOT always render a component whenever its render function is called
			 * due to performance optimization.
			 *
			 * Usage:
			 * ```
			 * renderItem = ({index, ...rest}) => {
			 *		delete rest.data;
			 *
			 *		return (
			 *			<MyComponent index={index} {...rest} />
			 *		);
			 * }
			 * ```
			 *
			 * @type {Function}
			 * @public
			 */
			component: PropTypes.func.isRequired,

			/**
			 * Callback method of scrollTo.
			 * Normally, `Scrollable` should set this value.
			 *
			 * @type {Function}
			 * @private
			 */
			cbScrollTo: PropTypes.func,

			/**
			 * Spotlight container Id
			 *
			 * @type {String}
			 * @private
			 */
			'data-container-id': PropTypes.string, // eslint-disable-line react/sort-prop-types

			/**
			 * Data for passing it through `component` prop.
			 * NOTICE: For performance reason, changing this prop does NOT always cause the list to
			 * redraw its items.
			 *
			 * @type {Any}
			 * @default []
			 * @public
			 */
			data: PropTypes.any,

			/**
			 * Size of the data.
			 *
			 * @type {Number}
			 * @default 0
			 * @public
			 */
			dataSize: PropTypes.number,

			/**
			 * It scrolls by page when 'true', by item when 'false'
			 *
			 * @type {Boolean}
			 * @default false
			 * @private
			 */
			pageScroll: PropTypes.bool,

			/**
			 * Spacing between items.
			 *
			 * @type {Number}
			 * @default 0
			 * @public
			 */
			spacing: PropTypes.number
		}

		static contextTypes = contextTypes
		static childContextTypes = (type === 'JS') ? contextTypesVirtaulList : contextTypesVirtaulListNative

		getChildContext () {
			return (type === 'JS') ? {
				applyStyleToExistingNode: this.applyStyleToExistingNode,
				applyStyleToHideNode: this.applyStyleToHideNode,
				applyStyleToNewNode: this.applyStyleToNewNode,
				getXY: this.getXY,
				initVirtualList: this.initVirtualList,
				renderChildren: this.renderChildren,
				updateStatesAndBounds: this.updateStatesAndBounds
			} : {
				applyStyleToHideNode: this.applyStyleToHideNode,
				applyStyleToNewNode: this.applyStyleToNewNode,
				getXY: this.getXY,
				initVirtualList: this.initVirtualList,
				renderChildren: this.renderChildren,
				updateStatesAndBounds: this.updateStatesAndBounds
			};
		}

		componentDidMount () {
			if (type === 'JS') {
				const containerNode = this.uiVirtualListRef.containerRef;

				// prevent native scrolling by Spotlight
				this.preventScroll = () => {
					containerNode.scrollTop = 0;
					containerNode.scrollLeft = this.uiVirtualListRef.context.rtl ? containerNode.scrollWidth : 0;
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

			if (type === 'JS') {
				const containerNode = this.containerRef;

				// remove a function for preventing native scrolling by Spotlight
				if (containerNode && containerNode.removeEventListener) {
					containerNode.removeEventListener('scroll', this.preventScroll);
				}
			}
		}

		isScrolledBy5way = false
		isScrolledByJump = false
		lastFocusedIndex = null
		nodeIndexToBeFocused = null
		preservedIndex = null
		restoreLastFocused = false

		itemContainerRef = null

		initVirtualList = (uiVirtualListRef) => {
			this.uiVirtualListRef = uiVirtualListRef;
		}

		setContainerDisabled = (bool) => {
			const containerNode = (type === 'JS') ? this.uiVirtualListRef.containerRef : this.uiVirtualListRef.contentRef;

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
				{data, dataSize} = this.props,
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
				{data, dataSize, spacing} = this.props,
				{dimensionToExtent, primary} = this.uiVirtualListRef,
				{findSpottableItem} = this,
				{firstVisibleIndex, lastVisibleIndex} = this.uiVirtualListRef.moreInfo,
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
				{dataSize, spacing} = this.props,
				{dimensionToExtent, primary} = this.uiVirtualListRef,
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
				{data} = this.props,
				focusedIndex = Number.parseInt(focusedItem.getAttribute(dataIndexAttribute)),
				{firstVisibleIndex, lastVisibleIndex} = this.uiVirtualListRef.moreInfo;
			let indexToScroll = -1;

			if (Array.isArray(data) && data.some((item) => item.disabled)) {
				indexToScroll = this.getIndexToScrollDisabled(direction, focusedIndex);
			} else {
				indexToScroll = this.getIndexToScroll(direction, focusedIndex);
			}

			if (indexToScroll !== -1) {
				const
					isRtl = this.uiVirtualListRef.context.rtl,
					isForward = (direction === 'down' || isRtl && direction === 'left' || !isRtl && direction === 'right');

				if (type === 'JS') {
					// To prevent item positioning issue, make all items to be rendered.
					this.uiVirtualListRef.updateFrom = null;
					this.uiVirtualListRef.updateTo = null;
				}

				if (firstVisibleIndex <= indexToScroll && indexToScroll <= lastVisibleIndex) {
					const node = this.uiVirtualListRef.containerRef.querySelector(`[data-index='${indexToScroll}'].spottable`);

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
				this.props.cbScrollTo({index: indexToScroll, stickTo: isForward ? 'end' : 'start', animate: false});
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
				{dataSize} = this.props,
				{isPrimaryDirectionVertical, dimensionToExtent} = this.uiVirtualListRef,
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
				{cbScrollTo, data, dataSize} = this.props,
				{firstIndex, numOfItems} = this.uiVirtualListRef.state,
				{isPrimaryDirectionVertical} = this.uiVirtualListRef,
				rtl = this.uiVirtualListRef.context.rtl,
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

		onKeyDown = (e) => {
			const {keyCode, target} = e;

			this.isScrolledBy5way = false;
			if (getDirection(keyCode)) {
				if (type === 'Native') {
					e.preventDefault();
				}
				this.setSpotlightContainerRestrict(keyCode, target);
				this.isScrolledBy5way = this.jumpToSpottableItem(keyCode, target);
			}
			forwardKeyDown(e, this.props);
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
			const item = this.uiVirtualListRef.containerRef.querySelector(`[data-index='${index}'].spottable`);

			if (Spotlight.isPaused()) {
				Spotlight.resume();
				if (type === 'JS') {
					this.forceUpdate();
				}
			}
			this.focusOnNode(item);
			this.nodeIndexToBeFocused = null;
		}

		initItemRef = (ref, index) => {
			if (ref) {
				if (type === 'JS') {
					this.focusOnItem(index);
				} else if (type === 'Native') {
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
					node = this.uiVirtualListRef.containerRef.querySelector(
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

		calculatePositionOnFocus = ({item, scrollPosition = this.uiVirtualListRef.scrollPosition}) => {
			const
				{pageScroll} = this.props,
				{numOfItems} = this.uiVirtualListRef.state,
				{primary} = this.uiVirtualListRef,
				offsetToClientEnd = primary.clientSize - primary.itemSize,
				focusedIndex = Number.parseInt(item.getAttribute(dataIndexAttribute));

			if (!isNaN(focusedIndex)) {
				let gridPosition = this.uiVirtualListRef.getGridPosition(focusedIndex);

				if (numOfItems > 0 && focusedIndex % numOfItems !== this.lastFocusedIndex % numOfItems) {
					const node = this.getItemNode(this.lastFocusedIndex);

					if (node) {
						node.blur();
					}
				}
				if (type === 'JS') {
					this.nodeIndexToBeFocused = null;
					this.lastFocusedIndex = focusedIndex;
				} else if (type === 'Native') {
					this.lastFocusedIndex = focusedIndex;
				}

				if (primary.clientSize >= primary.itemSize) {
					if (gridPosition.primaryPosition > scrollPosition + offsetToClientEnd) { // forward over
						gridPosition.primaryPosition -= pageScroll ? 0 : offsetToClientEnd;
					} else if (gridPosition.primaryPosition >= scrollPosition) { // inside of client
						if (type === 'JS') {
							gridPosition.primaryPosition = scrollPosition;
						} else {
							// This code uses the trick to change the target position slightly which will not affect the actual result
							// since a browser ignore `scrollTo` method if the target position is same as the current position.
							gridPosition.primaryPosition = scrollPosition + (this.uiVirtualListRef.scrollPosition === scrollPosition ? 0.1 : 0);
						}
					} else { // backward over
						gridPosition.primaryPosition -= pageScroll ? offsetToClientEnd : 0;
					}
				}

				// Since the result is used as a target position to be scrolled,
				// scrondaryPosition should be 0 here.
				gridPosition.secondaryPosition = 0;

				return this.uiVirtualListRef.gridPositionToItemPosition(gridPosition);
			}
		}

		/**
		 * setter/getter
		 */

		shouldPreventScrollByFocus = () => ((type === 'JS') ? (this.isScrolledBy5way) : (this.isScrolledBy5way || this.isScrolledByJump))

		getNodeIndexToBeFocused = () => this.nodeIndexToBeFocused

		setNodeIndexToBeFocused = (param) => {
			this.nodeIndexToBeFocused = param;
		}

		setLastFocusedIndex = (param) => {
			this.lastFocusedIndex = param;
		}

		/**
		 * override
		 */

		updateStatesAndBounds = (props) => {
			const
				{dataSize, overhang} = props, // eslint-disable-line enact/prop-types
				{firstIndex} = this.uiVirtualListRef.state,
				{dimensionToExtent, primary, moreInfo, scrollPosition} = this.uiVirtualListRef,
				{preservedIndex} = this,
				numOfItems = Math.min(dataSize, dimensionToExtent * (Math.ceil(primary.clientSize / primary.gridSize) + overhang)),
				wasFirstIndexMax = ((this.uiVirtualListRef.maxFirstIndex < moreInfo.firstVisibleIndex - dimensionToExtent) && (firstIndex === this.uiVirtualListRef.maxFirstIndex)),
				dataSizeDiff = dataSize - this.uiVirtualListRef.curDataSize;
			let newFirstIndex = firstIndex;

			this.uiVirtualListRef.maxFirstIndex = Math.ceil((dataSize - numOfItems) / dimensionToExtent) * dimensionToExtent;
			this.uiVirtualListRef.curDataSize = dataSize;
			this.uiVirtualListRef.updateFrom = null;
			this.uiVirtualListRef.updateTo = null;

			// reset children
			this.uiVirtualListRef.cc = [];
			this.uiVirtualListRef.calculateScrollBounds(props);
			this.uiVirtualListRef.updateMoreInfo(dataSize, scrollPosition);

			if (this.restoreLastFocused &&
				numOfItems > 0 &&
				(preservedIndex < dataSize) &&
				(preservedIndex < moreInfo.firstVisibleIndex || preservedIndex > moreInfo.lastVisibleIndex)) {
				// If we need to restore last focus and the index is beyond the screen,
				// we call `scrollTo` to create DOM for it.
				props.cbScrollTo({index: preservedIndex, animate: false});
			} else {
				newFirstIndex = this.uiVirtualListRef.calculateFirstIndex(props, wasFirstIndexMax, dataSizeDiff);
			}

			this.uiVirtualListRef.setState({firstIndex: newFirstIndex, numOfItems});
		}

		applyStyleToExistingNode = (index, ...rest) => {
			const node = this.getItemNode(index);

			if (node) {
				this.uiVirtualListRef.composeStyle(node.style, ...rest);
			}
		}

		applyStyleToNewNode = (index, ...rest) => {
			const
				{component, data} = this.props,
				{numOfItems} = this.uiVirtualListRef.state,
				{getNodeIndexToBeFocused, initItemRef} = this,
				key = index % numOfItems,
				itemElement = component({
					data,
					[dataIndexAttribute]: index,
					index,
					key
				}),
				style = {};

			this.uiVirtualListRef.composeStyle(style, ...rest);

			this.uiVirtualListRef.cc[key] = React.cloneElement(itemElement, {
				ref: (index === getNodeIndexToBeFocused()) ? (ref) => initItemRef(ref, index) : null,
				className: classNames(css.listItem, itemElement.props.className),
				style: {...itemElement.props.style, ...style}
			});
		}

		applyStyleToHideNode = (index) => {
			const
				key = index % this.uiVirtualListRef.state.numOfItems,
				style = {display: 'none'},
				attributes = {[dataIndexAttribute]: index, key, style};

			this.uiVirtualListRef.cc[key] = (<div {...attributes} />);
		}

		getXY = (primaryPosition, secondaryPosition) => {
			const rtlDirection = this.uiVirtualListRef.context.rtl ? -1 : 1;
			return (this.uiVirtualListRef.isPrimaryDirectionVertical ? {x: (secondaryPosition * rtlDirection), y: primaryPosition} : {x: (primaryPosition * rtlDirection), y: secondaryPosition});
		}

		getItemNode = (index) => {
			const ref = this.itemContainerRef;
			return ref ? ref.children[index % this.uiVirtualListRef.state.numOfItems] : null;
		}

		scrollToPosition (x, y) {
			const node = this.containerRef;
			node.scrollTo((this.context.rtl && !this.isPrimaryDirectionVertical) ? this.scrollBounds.maxLeft - x : x, y);
		}

		initItemContainerRef = (ref) => {
			this.itemContainerRef = ref;
		}

		/**
		 * render
		 */

		renderChildren = () => {
			const
				{cc, primary} = this.uiVirtualListRef,
				needsScrollingPlaceholder = this.isNeededScrollingPlaceholder();

			return [
				cc.length ? <div key="0" ref={this.initItemContainerRef}>{cc}</div> : null,
				primary ?
					null :
					<SpotlightPlaceholder
						data-index={0}
						data-vl-placeholder
						key="1"
						onFocus={this.handlePlaceholderFocus}
						role="region"
					/>,
				needsScrollingPlaceholder ? <SpotlightPlaceholder key="2" /> : null
			];
		}

		render () {
			return (
				<Wrapped {...this.props} />
			);
		}
	}
));

/**
 * Moonstone-specific VirtualList behavior to apply to
 * [VirtualList]{@link moonstone/VirtualList.VirtualList} and [VirtualGridList]{@link moonstone/VirtualList.VirtualGridList}.
 *
 * @memberof moonstone/VirtualList
 * @mixes moonstone/Scrollable.Scrollable
 * @mixes ui/Scrollable.Scrollable
 * @hoc
 * @private
 */
const VirtualListDecorator = compose(
	SpotlightContainerDecorator(SpotlightContainerConfig),
	Scrollable,
	SpottableVirtualListDecorator('JS'),
	UiScrollable
);

/**
 * Moonstone-specific VirtualList native behavior to apply to
 * [VirtualListNative]{@link moonstone/VirtualList.VirtualListNative} and [VirtualGridListNative]{@link moonstone/VirtualList.VirtualGridListNative}.
 *
 * @memberof moonstone/VirtualList
 * @mixes moonstone/Scrollable.ScrollableNative
 * @mixes ui/Scrollable.ScrollableNative
 * @hoc
 * @private
 */
const VirtualListNativeDecorator = compose(
	SpotlightContainerDecorator(SpotlightContainerConfig),
	ScrollableNative,
	SpottableVirtualListDecorator('Native'),
	UiScrollableNative
);

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
const VirtualList = VirtualListDecorator(UiVirtualListBase);

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
const VirtualListNative = VirtualListNativeDecorator(UiVirtualListBaseNative);

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
export * from './GridListImageItem';
