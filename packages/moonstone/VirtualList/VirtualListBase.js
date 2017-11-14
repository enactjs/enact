/*
 * Exports the {@link moonstone/VirtualList.VirtualListBase} and
 * {@link moonstone/VirtualList.VirtualListCore} components and the
 * {@link moonstone/VirtualList.gridListItemSizeShape} validator. The default
 * export is {@link moonstone/VirtualList.VirtualListBase}.
 */

import clamp from 'ramda/src/clamp';
import classNames from 'classnames';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import {forward} from '@enact/core/handle';
import {is} from '@enact/core/keymap';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Spotlight, {getDirection} from '@enact/spotlight';
import Spottable from '@enact/spotlight/Spottable';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

import {dataIndexAttribute, Scrollable} from '../Scroller/Scrollable';

import css from './ListItem.less';

const SpotlightPlaceholder = Spottable('div');

const
	dataContainerDisabledAttribute = 'data-container-disabled',
	forwardKeyDown = forward('onKeyDown'),
	nop = () => {},
	isDown = is('down'),
	isLeft = is('left'),
	isRight = is('right'),
	isUp = is('up');

/**
 * The shape for the grid list item size in a list for {@link moonstone/VirtualList.listItemSizeShape}.
 *
 * @typedef {Object} gridListItemSizeShape
 * @memberof moonstone/VirtualList
 * @property {Number} minWidth - The minimum width of the grid list item.
 * @property {Number} minHeight - The minimum height of the grid list item.
 */
const gridListItemSizeShape = PropTypes.shape({
	minWidth: PropTypes.number.isRequired,
	minHeight: PropTypes.number.isRequired
});

/**
 * {@link moonstone/VirtualList.VirtualListBase} is a base component for
 * {@link moonstone/VirtualList.VirtualList} and
 * {@link moonstone/VirtualList.VirtualGridList} with Scrollable and SpotlightContainerDecorator applied.
 *
 * @class VirtualListCore
 * @memberof moonstone/VirtualList
 * @ui
 * @private
 */
class VirtualListCore extends Component {
	static displayName = 'VirtualListBase'

	static propTypes = /** @lends moonstone/VirtualList.VirtualListCore.prototype */ {
		/**
		 * The render function for an item of the list.
		 * `index` is for accessing the index of the item.
		 * `key` MUST be passed as a prop for DOM recycling.
		 * Data manipulation can be done in this function.
		 *
		 * @type {Function}
		 * @public
		 */
		component: PropTypes.func.isRequired,

		/**
		 * Size of an item for the list; valid values are either a number for `VirtualList`
		 * or an object that has `minWidth` and `minHeight` for `VirtualGridList`.
		 *
		 * @type {Number|moonstone/VirtualList.gridListItemSizeShape}
		 * @public
		 */
		itemSize: PropTypes.oneOfType([
			PropTypes.number,
			gridListItemSizeShape
		]).isRequired,

		/**
		 * Callback method of scrollTo.
		 * Normally, `Scrollable` should set this value.
		 *
		 * @type {Function}
		 * @private
		 */
		cbScrollTo: PropTypes.func,

		/**
		 * Client size of the list; valid values are an object that has `clientWidth` and `clientHeight`.
		 *
		 * @type {Object}
		 * @property {Number} clientWidth - The client width of the list.
		 * @property {Number} clientHeight - The client height of the list.
		 * @public
		 */
		clientSize: PropTypes.shape({
			clientWidth: PropTypes.number.isRequired,
			clientHeight:  PropTypes.number.isRequired
		}),

		/**
		 * Data for the list.
		 * Check mutation of this and determine whether the list should update or not.
		 *
		 * @type {Any}
		 * @default []
		 * @public
		 */
		data: PropTypes.any,

		/**
		 * Spotlight container Id
		 *
		 * @type {String}
		 * @private
		 */
		'data-container-id': PropTypes.string, // eslint-disable-line react/sort-prop-types

		/**
		 * Size of the data.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		dataSize: PropTypes.number,

		/**
		 * Direction of the list; valid values are `'horizontal'` and `'vertical'`.
		 *
		 * @type {String}
		 * @default 'vertical'
		 * @public
		 */
		direction: PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * Number of spare DOM node.
		 * `3` is good for the default value experimentally and
		 * this value is highly recommended not to be changed by developers.
		 *
		 * @type {Number}
		 * @default 3
		 * @private
		 */
		overhang: PropTypes.number,

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

	static defaultProps = {
		cbScrollTo: nop,
		data: [],
		dataSize: 0,
		direction: 'vertical',
		overhang: 3,
		pageScroll: false,
		spacing: 0
	}

	constructor (props) {
		super(props);

		this.state = {firstIndex: 0, numOfItems: 0};
		this.initContainerRef = this.initRef('containerRef');
	}

	componentWillMount () {
		if (this.props.clientSize) {
			this.calculateMetrics(this.props);
			this.updateStatesAndBounds(this.props);
		}
	}

	// Calculate metrics for VirtualList after the 1st render to know client W/H.
	// We separate code related with data due to re use it when data changed.
	componentDidMount () {
		const containerNode = this.containerRef;

		if (!this.props.clientSize) {
			this.calculateMetrics(this.props);
			this.updateStatesAndBounds(this.props);
		}

		// prevent native scrolling by Spotlight
		this.preventScroll = () => {
			containerNode.scrollTop = 0;
			containerNode.scrollLeft = this.context.rtl ? containerNode.scrollWidth : 0;
		};

		if (containerNode && containerNode.addEventListener) {
			containerNode.addEventListener('scroll', this.preventScroll);
		}
	}

	// Call updateStatesAndBounds here when dataSize has been changed to update nomOfItems state.
	// Calling setState within componentWillReceivePropswill not trigger an additional render.
	componentWillReceiveProps (nextProps) {
		const
			{dataSize, direction, itemSize, overhang, spacing} = this.props,
			hasMetricsChanged = (
				direction !== nextProps.direction ||
				((itemSize instanceof Object) ? (itemSize.minWidth !== nextProps.itemSize.minWidth || itemSize.minHeight !== nextProps.itemSize.minHeight) : itemSize !== nextProps.itemSize) ||
				overhang !== nextProps.overhang ||
				spacing !== nextProps.spacing
			),
			hasDataChanged = (dataSize !== nextProps.dataSize);

		if (hasMetricsChanged) {
			this.calculateMetrics(nextProps);
			this.updateStatesAndBounds(nextProps);
		} else if (hasDataChanged) {
			this.updateStatesAndBounds(nextProps);
		}
	}

	componentDidUpdate () {
		this.restoreFocus();
	}

	componentWillUnmount () {
		const containerNode = this.containerRef;

		// remove a function for preventing native scrolling by Spotlight
		if (containerNode && containerNode.removeEventListener) {
			containerNode.removeEventListener('scroll', this.preventScroll);
		}

		this.setContainerDisabled(false);
	}

	scrollBounds = {
		clientWidth: 0,
		clientHeight: 0,
		scrollWidth: 0,
		scrollHeight: 0,
		maxLeft: 0,
		maxTop: 0
	}

	moreInfo = {
		firstVisibleIndex: null,
		lastVisibleIndex: null
	}

	primary = null
	secondary = null

	isPrimaryDirectionVertical = true
	isItemSized = false

	dimensionToExtent = 0
	threshold = 0
	maxFirstIndex = 0
	curDataSize = 0
	cc = []
	scrollPosition = 0
	updateFrom = null
	updateTo = null
	isScrolledBy5way = false

	containerRef = null

	// spotlight
	nodeIndexToBeFocused = null
	lastFocusedIndex = null
	preservedIndex = null

	isVertical = () => this.isPrimaryDirectionVertical

	isHorizontal = () => !this.isPrimaryDirectionVertical

	isPlaceholderFocused () {
		const current = Spotlight.getCurrent();
		if (current && current.dataset.vlPlaceholder && this.containerRef.contains(current)) {
			return true;
		}

		return false;
	}

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

	restoreFocus () {
		if (
			this.restoreLastFocused &&
			!this.isPlaceholderFocused()
		) {
			const containerId = this.props['data-container-id'];
			const node = this.containerRef.querySelector(
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

	getScrollBounds = () => this.scrollBounds

	getMoreInfo = () => this.moreInfo

	getGridPosition (index) {
		const
			{dimensionToExtent, primary, secondary} = this,
			primaryPosition = Math.floor(index / dimensionToExtent) * primary.gridSize,
			secondaryPosition = (index % dimensionToExtent) * secondary.gridSize;

		return {primaryPosition, secondaryPosition};
	}

	getItemPosition = (index, stickTo = 'start') => {
		const
			{primary} = this,
			position = this.getGridPosition(index),
			offset = (stickTo === 'start') ? 0 : primary.clientSize - primary.itemSize;

		position.primaryPosition -= offset;

		return this.gridPositionToItemPosition(position);
	}

	gridPositionToItemPosition = ({primaryPosition, secondaryPosition}) =>
		(this.isPrimaryDirectionVertical ? {left: secondaryPosition, top: primaryPosition} : {left: primaryPosition, top: secondaryPosition})

	getClientSize = (node) => {
		return {
			clientWidth: node.clientWidth,
			clientHeight: node.clientHeight
		};
	}

	calculateMetrics (props) {
		const
			{clientSize, direction, itemSize, spacing} = props,
			node = this.containerRef;

		if (!clientSize && !node) {
			return;
		}

		const
			{clientWidth, clientHeight} = (clientSize || this.getClientSize(node)),
			heightInfo = {
				clientSize: clientHeight,
				minItemSize: itemSize.minHeight || null,
				itemSize: itemSize
			},
			widthInfo = {
				clientSize: clientWidth,
				minItemSize: itemSize.minWidth || null,
				itemSize: itemSize
			};
		let primary, secondary, dimensionToExtent, thresholdBase;

		this.isPrimaryDirectionVertical = (direction === 'vertical');

		if (this.isPrimaryDirectionVertical) {
			primary = heightInfo;
			secondary = widthInfo;
		} else {
			primary = widthInfo;
			secondary = heightInfo;
		}
		dimensionToExtent = 1;

		this.isItemSized = (primary.minItemSize && secondary.minItemSize);

		if (this.isItemSized) {
			// the number of columns is the ratio of the available width plus the spacing
			// by the minimum item width plus the spacing
			dimensionToExtent = Math.max(Math.floor((secondary.clientSize + spacing) / (secondary.minItemSize + spacing)), 1);
			// the actual item width is a ratio of the remaining width after all columns
			// and spacing are accounted for and the number of columns that we know we should have
			secondary.itemSize = Math.floor((secondary.clientSize - (spacing * (dimensionToExtent - 1))) / dimensionToExtent);
			// the actual item height is related to the item width
			primary.itemSize = Math.floor(primary.minItemSize * (secondary.itemSize / secondary.minItemSize));
		}

		primary.gridSize = primary.itemSize + spacing;
		secondary.gridSize = secondary.itemSize + spacing;
		thresholdBase = primary.gridSize * 2;

		this.threshold = {min: -Infinity, max: thresholdBase, base: thresholdBase};
		this.dimensionToExtent = dimensionToExtent;

		this.primary = primary;
		this.secondary = secondary;

		// reset
		this.scrollPosition = 0;
		// eslint-disable-next-line react/no-direct-mutation-state
		this.state.firstIndex = 0;
		// eslint-disable-next-line react/no-direct-mutation-state
		this.state.numOfItems = 0;
	}

	updateStatesAndBounds (props) {
		const
			{dataSize, overhang} = props,
			{firstIndex} = this.state,
			{dimensionToExtent, primary, moreInfo, preservedIndex, scrollPosition} = this,
			numOfItems = Math.min(dataSize, dimensionToExtent * (Math.ceil(primary.clientSize / primary.gridSize) + overhang)),
			wasFirstIndexMax = ((this.maxFirstIndex < moreInfo.firstVisibleIndex - dimensionToExtent) && (firstIndex === this.maxFirstIndex)),
			dataSizeDiff = dataSize - this.curDataSize;
		let newFirstIndex = firstIndex;

		this.maxFirstIndex = Math.ceil((dataSize - numOfItems) / dimensionToExtent) * dimensionToExtent;
		this.curDataSize = dataSize;
		this.updateFrom = null;
		this.updateTo = null;

		// reset children
		this.cc = [];
		this.calculateScrollBounds(props);
		this.updateMoreInfo(dataSize, scrollPosition);

		if (this.restoreLastFocused &&
			numOfItems > 0 &&
			(preservedIndex < dataSize) &&
			(preservedIndex < moreInfo.firstVisibleIndex || preservedIndex > moreInfo.lastVisibleIndex)) {
			// If we need to restore last focus and the index is beyond the screen,
			// we call `scrollTo` to create DOM for it.
			this.props.cbScrollTo({index: preservedIndex, animate: false});
		} else {
			newFirstIndex = this.calculateFirstIndex(props, wasFirstIndexMax, dataSizeDiff);
		}

		this.setState({firstIndex: newFirstIndex, numOfItems});
	}

	calculateFirstIndex (props, wasFirstIndexMax, dataSizeDiff) {
		const
			{overhang} = props,
			{firstIndex} = this.state,
			{dimensionToExtent, isPrimaryDirectionVertical, maxFirstIndex, primary, scrollBounds, scrollPosition, threshold} = this,
			{gridSize} = primary;
		let newFirstIndex = firstIndex;

		if (wasFirstIndexMax && dataSizeDiff > 0) { // If dataSize increased from bottom, we need adjust firstIndex
			// If this is a gridlist and dataSizeDiff is smaller than 1 line, we are adjusting firstIndex without threshold change.
			if (dimensionToExtent > 1 &&  dataSizeDiff < dimensionToExtent) {
				newFirstIndex = maxFirstIndex;
			} else { // For other bottom adding case, we need to update firstIndex and threshold.
				const
					maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft,
					maxOfMin = maxPos - threshold.base,
					numOfUpperLine = Math.floor(overhang / 2),
					firstIndexFromPosition = Math.floor(scrollPosition / gridSize),
					expectedFirstIndex = Math.max(0, firstIndexFromPosition - numOfUpperLine);

				// To navigate with 5way, we need to adjust firstIndex to the next line
				// since at the bottom we have num of overhang lines for upper side but none for bottom side
				// So we add numOfUpperLine at the top and rest lines at the bottom
				newFirstIndex = Math.min(maxFirstIndex, expectedFirstIndex * dimensionToExtent);

				// We need to update threshold also since we moved the firstIndex
				threshold.max = Math.min(maxPos, threshold.max + gridSize);
				threshold.min = Math.min(maxOfMin, threshold.max - gridSize);
			}
		} else { // Other cases, we can keep the min value between firstIndex and maxFirstIndex. No need to change threshold
			newFirstIndex = Math.min(firstIndex, maxFirstIndex);
		}

		return newFirstIndex;
	}

	calculateScrollBounds (props) {
		const
			{clientSize} = props,
			node = this.containerRef;

		if (!clientSize && !node) {
			return;
		}

		const
			{scrollBounds, isPrimaryDirectionVertical} = this,
			{clientWidth, clientHeight} = clientSize || this.getClientSize(node);
		let maxPos;

		scrollBounds.clientWidth = clientWidth;
		scrollBounds.clientHeight = clientHeight;
		scrollBounds.scrollWidth = this.getScrollWidth();
		scrollBounds.scrollHeight = this.getScrollHeight();
		scrollBounds.maxLeft = Math.max(0, scrollBounds.scrollWidth - clientWidth);
		scrollBounds.maxTop = Math.max(0, scrollBounds.scrollHeight - clientHeight);

		// correct position
		maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft;

		this.syncThreshold(maxPos);

		if (this.scrollPosition > maxPos) {
			this.props.cbScrollTo({position: (isPrimaryDirectionVertical) ? {y: maxPos} : {x: maxPos}, animate: false});
		}
	}

	updateMoreInfo (dataSize, primaryPosition) {
		const
			{dimensionToExtent, moreInfo} = this,
			{itemSize, gridSize, clientSize} = this.primary;

		if (dataSize <= 0) {
			moreInfo.firstVisibleIndex = null;
			moreInfo.lastVisibleIndex = null;
		} else {
			moreInfo.firstVisibleIndex = (Math.floor((primaryPosition - itemSize) / gridSize) + 1) * dimensionToExtent;
			moreInfo.lastVisibleIndex = Math.min(dataSize - 1, Math.ceil((primaryPosition + clientSize) / gridSize) * dimensionToExtent - 1);
		}
	}

	syncThreshold (maxPos) {
		const {threshold} = this;

		if (threshold.max > maxPos) {
			if (maxPos < threshold.base) {
				threshold.max = threshold.base;
				threshold.min = -Infinity;
			} else {
				threshold.max = maxPos;
				threshold.min = maxPos - threshold.base;
			}
		}
	}

	setScrollPosition (x, y, dirX, dirY) {
		const
			{dataSize} = this.props,
			{firstIndex, numOfItems} = this.state,
			{isPrimaryDirectionVertical, threshold, dimensionToExtent, maxFirstIndex, scrollBounds} = this,
			{gridSize} = this.primary,
			maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft,
			minOfMax = threshold.base,
			maxOfMin = maxPos - threshold.base;
		let
			delta, numOfGridLines, newFirstIndex = firstIndex, pos, dir = 0;

		if (isPrimaryDirectionVertical) {
			pos = y;
			dir = dirY;
		} else {
			pos = x;
			dir = dirX;
		}

		if (dir === 1 && pos > threshold.max) {
			delta = pos - threshold.max;
			numOfGridLines = Math.ceil(delta / gridSize); // how many lines should we add
			threshold.max = Math.min(maxPos, threshold.max + numOfGridLines * gridSize);
			threshold.min = Math.min(maxOfMin, threshold.max - gridSize);
			newFirstIndex += numOfGridLines * dimensionToExtent;
		} else if (dir === -1 && pos < threshold.min) {
			delta = threshold.min - pos;
			numOfGridLines = Math.ceil(delta / gridSize);
			threshold.max = Math.max(minOfMax, threshold.min - (numOfGridLines * gridSize - gridSize));
			threshold.min = (threshold.max > minOfMax) ? threshold.max - gridSize : -Infinity;
			newFirstIndex -= numOfGridLines * dimensionToExtent;
		}
		newFirstIndex = Math.min(maxFirstIndex, newFirstIndex);
		newFirstIndex = Math.max(0, newFirstIndex);

		this.syncThreshold(maxPos);
		this.scrollPosition = pos;
		this.updateMoreInfo(dataSize, pos);

		if (firstIndex !== newFirstIndex) {
			this.setState({firstIndex: newFirstIndex});
		} else {
			this.positionItems({updateFrom: firstIndex, updateTo: firstIndex + numOfItems});
		}
	}

	applyStyleToExistingNode = (index, ...rest) => {
		const
			{numOfItems} = this.state,
			node = this.containerRef.children[index % numOfItems];

		if (node) {
			this.composeStyle(node.style, ...rest);
		}
	}

	applyStyleToNewNode = (index, ...rest) => {
		const
			{component, data} = this.props,
			{numOfItems} = this.state,
			key = index % numOfItems,
			itemElement = component({
				data,
				[dataIndexAttribute]: index,
				index,
				key
			}),
			style = {};

		this.composeStyle(style, ...rest);

		this.cc[key] = React.cloneElement(itemElement, {
			className: classNames(css.listItem, itemElement.props.className),
			style: {...itemElement.props.style, ...style}
		});

		if (index === this.nodeIndexToBeFocused) {
			this.focusByIndex(index);
		}
	}

	applyStyleToHideNode = (index) => {
		const
			key = index % this.state.numOfItems,
			style = {display: 'none'},
			attributes = {[dataIndexAttribute]: index, key, style};
		this.cc[key] = (<div {...attributes} />);
	}

	positionItems ({updateFrom, updateTo}) {
		const
			{dataSize} = this.props,
			{isPrimaryDirectionVertical, dimensionToExtent, primary, secondary, scrollPosition} = this;
		let hideTo = 0;

		// we only calculate position of the first child
		let
			{primaryPosition, secondaryPosition} = this.getGridPosition(updateFrom),
			width, height;

		primaryPosition -= scrollPosition;
		width = (isPrimaryDirectionVertical ? secondary.itemSize : primary.itemSize) + 'px';
		height = (isPrimaryDirectionVertical ? primary.itemSize : secondary.itemSize) + 'px';

		if (updateTo > dataSize) {
			hideTo = updateTo;
			updateTo = dataSize;
		}

		// positioning items
		for (let i = updateFrom, j = updateFrom % dimensionToExtent; i < updateTo; i++) {
			if (this.updateFrom === null || this.updateTo === null || this.updateFrom > i || this.updateTo <= i) {
				this.applyStyleToNewNode(i, width, height, primaryPosition, secondaryPosition);
			} else {
				this.applyStyleToExistingNode(i, width, height, primaryPosition, secondaryPosition);
			}

			if (++j === dimensionToExtent) {
				secondaryPosition = 0;
				primaryPosition += primary.gridSize;
				j = 0;
			} else {
				secondaryPosition += secondary.gridSize;
			}
		}

		for (let i = updateTo; i < hideTo; i++) {
			this.applyStyleToHideNode(i);
		}

		this.updateFrom = updateFrom;
		this.updateTo = updateTo;
	}

	composeStyle (style, width, height, ...rest) {
		if (this.isItemSized) {
			style.width = width;
			style.height = height;
		}
		style.position = 'absolute';
		this.composeTransform(style, ...rest);
	}

	getXY = (primaryPosition, secondaryPosition) => {
		const rtlDirection = this.context.rtl ? -1 : 1;
		return (this.isPrimaryDirectionVertical ? {x: (secondaryPosition * rtlDirection), y: primaryPosition} : {x: (primaryPosition * rtlDirection), y: secondaryPosition});
	}

	composeTransform (style, primaryPosition, secondaryPosition = 0) {
		const {x, y} = this.getXY(primaryPosition, secondaryPosition);

		style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
	}

	getScrollHeight = () => (this.isPrimaryDirectionVertical ? this.getVirtualScrollDimension() : this.scrollBounds.clientHeight)

	getScrollWidth = () => (this.isPrimaryDirectionVertical ? this.scrollBounds.clientWidth : this.getVirtualScrollDimension())

	getVirtualScrollDimension = () => {
		const
			{dimensionToExtent, primary, curDataSize} = this,
			{spacing} = this.props;

		return (Math.ceil(curDataSize / dimensionToExtent) * primary.gridSize) - spacing;
	}

	focusByIndex = (index) => {
		// We have to focus node async for now since list items are not yet ready when it reaches componentDid* lifecycle methods
		setTimeout(() => {
			const item = this.containerRef.querySelector(`[data-index='${index}'].spottable`);

			if (Spotlight.isPaused()) {
				Spotlight.resume();
				this.forceUpdate();
			}

			this.focusOnNode(item);
			this.nodeIndexToBeFocused = null;
		}, 0);
	}

	focusOnNode = (node) => {
		if (node) {
			Spotlight.focus(node);
		}
	}

	setLastFocusedIndex = (item) => {
		this.lastFocusedIndex = Number.parseInt(item.getAttribute(dataIndexAttribute));
	}

	calculatePositionOnFocus = ({item, scrollPosition = this.scrollPosition}) => {
		const
			{pageScroll} = this.props,
			{numOfItems} = this.state,
			{primary} = this,
			offsetToClientEnd = primary.clientSize - primary.itemSize,
			focusedIndex = Number.parseInt(item.getAttribute(dataIndexAttribute));

		if (!isNaN(focusedIndex)) {
			let gridPosition = this.getGridPosition(focusedIndex);

			if (numOfItems > 0 && focusedIndex % numOfItems !== this.lastFocusedIndex % numOfItems) {
				const node = this.containerRef.children[this.lastFocusedIndex % numOfItems];
				node.blur();
			}
			this.nodeIndexToBeFocused = null;
			this.lastFocusedIndex = focusedIndex;

			if (primary.clientSize >= primary.itemSize) {
				if (gridPosition.primaryPosition > scrollPosition + offsetToClientEnd) { // forward over
					gridPosition.primaryPosition -= pageScroll ? 0 : offsetToClientEnd;
				} else if (gridPosition.primaryPosition >= scrollPosition) { // inside of client
					gridPosition.primaryPosition = scrollPosition;
				} else { // backward over
					gridPosition.primaryPosition -= pageScroll ? offsetToClientEnd : 0;
				}
			}

			// Since the result is used as a target position to be scrolled,
			// scrondaryPosition should be 0 here.
			gridPosition.secondaryPosition = 0;
			return this.gridPositionToItemPosition(gridPosition);
		}
	}

	setRestrict = (bool) => {
		Spotlight.set(this.props['data-container-id'], {restrict: (bool) ? 'self-only' : 'self-first'});
	}

	setSpotlightContainerRestrict = (keyCode, target) => {
		const
			{dataSize} = this.props,
			{isPrimaryDirectionVertical, dimensionToExtent} = this,
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

	findEnableItemForPageScroll = (isForward, indexFrom, indexTo, data) => {
		let nextIndex = -1;

		if (isForward) {
			for (let i = indexFrom; i < indexTo; i++) {
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
		} else if (!isForward) {
			for (let i = indexFrom; i > indexTo; i--) {
				if (!data[i].disabled) {
					nextIndex = i;
					break;
				}
			}

			// If there is no item which could get focus backward,
			// we need to set restriction option to `self-first`.
			if (indexTo === 0 && nextIndex === -1) {
				this.setRestrict(false);
			}
		} else {
			return -1;
		}

		return nextIndex;
	}

	getIndexForPageScroll = (direction, currentIndex) => {
		const
			{context, dimensionToExtent, isPrimaryDirectionVertical, primary} = this,
			{data, dataSize, spacing} = this.props;
		let offsetIndex = Math.floor((primary.clientSize + spacing) / primary.gridSize) * dimensionToExtent;

		offsetIndex *= !isPrimaryDirectionVertical && context.rtl ? -1 : 1;
		offsetIndex *= (direction === 'down' || direction === 'right') ? 1 : -1;

		let indexToJump = clamp(0, dataSize - 1, currentIndex + offsetIndex);

		if (
			// If a currnet index is same as a new index.
			indexToJump === currentIndex ||
			// If a current item and a next item are located at the same line vertically or horizontally
			parseInt(indexToJump / dimensionToExtent) === parseInt(currentIndex / dimensionToExtent)
		) {
			return {scroll: 'stop'};
		}

		// If a current index is different from a new index and the item with the new index is disabled,
		// try to find a next item which is enabled.
		let nodeIndexToBeFocused = this.findEnableItemForPageScroll(
			indexToJump < currentIndex,
			indexToJump, currentIndex, data
		);

		if (nodeIndexToBeFocused === -1) {
			return {scroll: 'one page with animation'};
		} else {
			return {scroll: 'scroll without animation', indexToJump, nodeIndexToBeFocused};
		}
	}

	scrollToNextPage = ({direction, focusedItem}) => {
		const
			isRtl = this.context.rtl,
			isForward = (direction === 'down' || isRtl && direction === 'left' || !isRtl && direction === 'right'),
			focusedIndex = Number.parseInt(focusedItem.getAttribute(dataIndexAttribute)),
			{scroll, indexToJump, nodeIndexToBeFocused} = this.getIndexForPageScroll(direction, focusedIndex);

		if (scroll === 'one page with animation') {
			return false; // Scroll one page with animation
		} else if (scroll === 'stop') {
			return true; // Do not scroll
		} else if ( // scroll === 'scroll without animation'
			// If the index to jump is enabled
			focusedIndex !== indexToJump && indexToJump === nodeIndexToBeFocused ||
			// If the index to jump is disabled
			focusedIndex !== nodeIndexToBeFocused && indexToJump !== nodeIndexToBeFocused
		) {
			if (!Spotlight.isPaused()) {
				Spotlight.pause();
			}

			focusedItem.blur();
			// To prevent item positioning issue, make all items to be rendered.
			this.updateFrom = null;
			this.updateTo = null;
			// Scroll to the next spottable item without animation
			this.props.cbScrollTo({index: indexToJump, nodeIndexToBeFocused, stickTo: isForward ? 'end' : 'start', focus: true, animate: false});

			return true; // Do not scroll additionally
		} else {
			return true; // Do not scroll
		}
	}

	shouldPreventScrollByFocus = () => this.isScrolledBy5way

	jumpToSpottableItem = (keyCode, target) => {
		const
			{cbScrollTo, data, dataSize} = this.props,
			{firstIndex, numOfItems} = this.state,
			currentIndex = Number.parseInt(target.getAttribute(dataIndexAttribute));

		if (!data || !Array.isArray(data) || !data[currentIndex] || data[currentIndex].disabled) {
			return false;
		}

		const
			isForward = (
				this.isPrimaryDirectionVertical && isDown(keyCode) ||
				!this.isPrimaryDirectionVertical && (!this.context.rtl && isRight(keyCode) || this.context.rtl && isLeft(keyCode)) ||
				null
			),
			isBackward = (
				this.isPrimaryDirectionVertical && isUp(keyCode) ||
				!this.isPrimaryDirectionVertical && (!this.context.rtl && isLeft(keyCode) || this.context.rtl && isRight(keyCode)) ||
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

	setNodeIndexToBeFocused = (nextIndex) => {
		this.nodeIndexToBeFocused = this.lastFocusedIndex = nextIndex;
	}

	onKeyDown = (e) => {
		const {keyCode, target} = e;

		this.isScrolledBy5way = false;
		if (getDirection(keyCode)) {
			this.setSpotlightContainerRestrict(keyCode, target);
			this.isScrolledBy5way = this.jumpToSpottableItem(keyCode, target);
		}
		forwardKeyDown(e, this.props);
	}

	handleGlobalKeyDown = () => {
		this.setContainerDisabled(false);
	}

	setContainerDisabled = (bool) => {
		const containerNode = this.containerRef;

		if (containerNode) {
			containerNode.setAttribute(dataContainerDisabledAttribute, bool);

			if (bool) {
				document.addEventListener('keydown', this.handleGlobalKeyDown, {capture: true});
			} else {
				document.removeEventListener('keydown', this.handleGlobalKeyDown, {capture: true});
			}
		}
	}

	syncClientSize = () => {
		const
			{props} = this,
			node = this.containerRef;

		if (!props.clientSize && !node) {
			return;
		}

		const
			{clientWidth, clientHeight} = props.clientSize || this.getClientSize(node),
			{scrollBounds} = this;

		if (clientWidth !== scrollBounds.clientWidth || clientHeight !== scrollBounds.clientHeight) {
			this.calculateMetrics(props);
			this.updateStatesAndBounds(props);
		}
	}

	// render

	initRef (prop) {
		return (ref) => {
			this[prop] = ref;
		};
	}

	render () {
		const
			props = Object.assign({}, this.props),
			{firstIndex, numOfItems} = this.state,
			{primary, cc} = this;

		delete props.cbScrollTo;
		delete props.clientSize;
		delete props.component;
		delete props.data;
		delete props.dataSize;
		delete props.direction;
		delete props.itemSize;
		delete props.overhang;
		delete props.pageScroll;
		delete props.spacing;

		if (primary) {
			this.positionItems({updateFrom: firstIndex, updateTo: firstIndex + numOfItems});
		}

		const needsScrollingPlaceholder = this.nodeIndexToBeFocused != null && Spotlight.isPaused();

		return (
			<div {...props} onKeyDown={this.onKeyDown} ref={this.initContainerRef}>
				{cc.length ? cc : null}
				{primary ? null : (
					<SpotlightPlaceholder
						data-index={0}
						data-vl-placeholder
						onFocus={this.handlePlaceholderFocus}
						role="region"
					/>
				)}
				{needsScrollingPlaceholder ? (
					<SpotlightPlaceholder />
				) : null}
			</div>
		);
	}
}

/**
 * {@link moonstone/VirtualList.VirtualListBase} is a base component for
 * {@link moonstone/VirtualList.VirtualList} and
 * {@link moonstone/VirtualList.VirtualGridList} with Scrollable and SpotlightContainerDecorator applied.
 *
 * @class VirtualListBase
 * @memberof moonstone/VirtualList
 * @mixes moonstone/Scrollable
 * @mixes spotlight/SpotlightContainerDecorator
 * @ui
 * @private
 */
const VirtualListBase = SpotlightContainerDecorator(
	{
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
	},
	Scrollable(
		VirtualListCore
	)
);

export default VirtualListBase;
export {gridListItemSizeShape, VirtualListCore, VirtualListBase};
