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

import css from './VirtualListBase.less';

const SpotlightPlaceholder = Spottable('div');

const
	dataContainerMutedAttribute = 'data-container-muted',
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

	shouldComponentUpdate (nextProps, nextState) {
		if ((this.props.dataSize !== nextProps.dataSize) &&
			(nextState.firstIndex + nextState.numOfItems) < nextProps.dataSize) {
			return false;
		}
		return true;
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
	isScrolledBy5way = false

	dimensionToExtent = 0
	threshold = 0
	maxFirstIndex = 0
	renderFrom = 0
	renderTo = 0
	curDataSize = 0
	cc = []
	scrollPosition = 0
	itemStyle = null

	containerRef = null

	// spotlight
	nodeIndexToBeFocused = null
	lastFocusedIndex = null

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
				this.lastFocusedIndex = parseInt(index);
				this.restoreLastFocused = true;

				// adjust the firstIndex to include the last focused index, if necessary
				this.setState(nextState => {
					let {firstIndex, numOfItems} = nextState;
					const lastIndex = firstIndex + numOfItems;

					if (this.lastFocusedIndex < firstIndex || this.lastFocusedIndex >= lastIndex) {
						firstIndex = this.lastFocusedIndex;
					}

					return {
						firstIndex
					};
				});
			}
		}
	}

	restoreFocus () {
		const {firstVisibleIndex, lastVisibleIndex} = this.moreInfo;
		if (
			this.restoreLastFocused &&
			!this.isPlaceholderFocused() &&
			firstVisibleIndex <= this.lastFocusedIndex &&
			lastVisibleIndex >= this.lastFocusedIndex
		) {
			// if we're supposed to restore focus and virtual list has positioned a set of items
			// that includes lastFocusedIndex, clear the indicator
			this.restoreLastFocused = false;
			const containerId = this.props['data-container-id'];

			// try to focus the last focused item
			const foundLastFocused = Spotlight.focus(
				`[data-container-id="${containerId}"] [data-index="${this.lastFocusedIndex}"]`
			);

			// but if that fails (because it isn't found or is disabled), focus the container so
			// spotlight isn't lost
			if (!foundLastFocused) {
				Spotlight.focus(containerId);
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
			{itemSize} = this.props,
			{primary} = this,
			position = this.getGridPosition(index),
			offset = ((itemSize instanceof Object) || stickTo === 'start') ? 0 : primary.clientSize - primary.itemSize;

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

		if (this.isItemSized) {
			const
				primaryItemSize = primary.itemSize + 'px',
				secondaryItemSize = secondary.itemSize + 'px';

			if (this.isPrimaryDirectionVertical) {
				this.itemStyle = {
					'--virtuallist-item-width': secondaryItemSize,
					'--virtuallist-item-height': primaryItemSize,
					'--virtuallist-item-flex-box': '1 0 ' + secondary.itemSize + 'px'
				};
			} else {
				this.itemStyle = {
					'--virtuallist-item-width': primaryItemSize,
					'--virtuallist-item-height': secondaryItemSize
				};
			}
		}
	}

	updateStatesAndBounds (props) {
		const
			{dataSize, overhang} = props,
			{firstIndex} = this.state,
			{dimensionToExtent, primary, moreInfo, scrollPosition} = this,
			numOfItems = Math.min(dataSize, dimensionToExtent * (Math.ceil(primary.clientSize / primary.gridSize) + overhang)),
			wasFirstIndexMax = ((this.maxFirstIndex < moreInfo.firstVisibleIndex - dimensionToExtent) && (firstIndex === this.maxFirstIndex));

		this.maxFirstIndex = dataSize - numOfItems;
		this.curDataSize = dataSize;

		// reset children
		this.cc = [];

		this.setState({firstIndex: wasFirstIndexMax ? this.maxFirstIndex : Math.min(firstIndex, this.maxFirstIndex), numOfItems});
		this.calculateScrollBounds(props);
		this.updateMoreInfo(dataSize, scrollPosition);
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
			this.props.cbScrollTo({position: (isPrimaryDirectionVertical) ? {y: maxPos} : {x: maxPos}});
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
			{firstIndex} = this.state,
			{isPrimaryDirectionVertical, threshold, dimensionToExtent, maxFirstIndex, scrollBounds} = this,
			{gridSize} = this.primary,
			maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft,
			minOfMax = threshold.base,
			maxOfMin = maxPos - minOfMax;
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
			newFirstIndex = Math.min(maxFirstIndex, (dimensionToExtent * Math.ceil(firstIndex / dimensionToExtent)) + (numOfGridLines * dimensionToExtent));
		} else if (dir === -1 && pos < threshold.min) {
			delta = threshold.min - pos;
			numOfGridLines = Math.ceil(delta / gridSize);
			threshold.max = Math.max(minOfMax, threshold.min - (numOfGridLines * gridSize - gridSize));
			threshold.min = (threshold.max > minOfMax) ? threshold.max - gridSize : -Infinity;
			newFirstIndex = Math.max(0, (dimensionToExtent * Math.ceil(firstIndex / dimensionToExtent)) - (numOfGridLines * dimensionToExtent));
		}

		this.syncThreshold(maxPos);
		this.scrollPosition = pos;
		this.updateMoreInfo(dataSize, pos);

		this.positionItemContainers();
		if (firstIndex !== newFirstIndex) {
			this.setState({firstIndex: newFirstIndex});
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

	positionItemContainers () {
		const
			{firstIndex, numOfItems} = this.state,
			{dimensionToExtent, primary, scrollPosition} = this,
			itemContainerFrom = Math.floor(firstIndex / dimensionToExtent),
			itemContainerTo = Math.ceil((firstIndex + numOfItems) / dimensionToExtent),
			numOfRows = Math.ceil(numOfItems / dimensionToExtent);

		let {primaryPosition} = this.getGridPosition(firstIndex);

		primaryPosition -= scrollPosition;

		for (let i = itemContainerFrom; i < itemContainerTo; i++, primaryPosition += primary.gridSize) {
			const
				key = i % numOfRows,
				node = this.containerRef.children[key];

			if (node && node.style) {
				node.style.transform = this.getItemContainerPosition(primaryPosition);
			}
		}
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
			{primary} = this,
			offsetToClientEnd = primary.clientSize - primary.itemSize,
			focusedIndex = Number.parseInt(item.getAttribute(dataIndexAttribute));

		if (!isNaN(focusedIndex) && focusedIndex !== this.lastFocusedIndex) {
			let gridPosition = this.getGridPosition(focusedIndex);

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

	setSpotlightContainerRestrict = (keyCode, index) => {
		const
			{dataSize} = this.props,
			{isPrimaryDirectionVertical, dimensionToExtent} = this,
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

	getIndicesForPageScroll = (direction, currentIndex) => {
		const
			{context, dimensionToExtent, isPrimaryDirectionVertical, primary} = this,
			{dataSize} = this.props,
			indices = {};

		let	offsetIndex = Math.floor(primary.clientSize / primary.gridSize) * dimensionToExtent;
		offsetIndex *= !isPrimaryDirectionVertical && context.rtl ? -1 : 1;

		if (direction === 'down' || direction === 'right') {
			indices.indexToFocus = clamp(0, dataSize - 1, currentIndex + offsetIndex);
			indices.indexToScroll = currentIndex + dimensionToExtent;
			if (context.rtl && !isPrimaryDirectionVertical) {
				indices.indexToScroll = indices.indexToFocus;
			}
		} else {
			indices.indexToFocus = clamp(0, dataSize - 1, currentIndex - offsetIndex);
			indices.indexToScroll = indices.indexToFocus;
			if (context.rtl && !isPrimaryDirectionVertical) {
				indices.indexToScroll = currentIndex + dimensionToExtent;
			}
		}

		return indices;
	}

	scrollToNextPage = ({direction, focusedItem}) => {
		const
			focusedIndex = Number.parseInt(focusedItem.getAttribute(dataIndexAttribute)),
			{indexToFocus, indexToScroll} = this.getIndicesForPageScroll(direction, focusedIndex);

		if (focusedIndex !== indexToFocus) {
			focusedItem.blur();
			this.props.cbScrollTo({index: indexToScroll, animate: false});
			this.focusByIndex(indexToFocus);
		}

		return true;
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
				if (data[i] && !data[i].disabled) {
					nextIndex = i;
					break;
				}
			}
		} else if (isBackward) {
			// See if the next item is spottable then delegate scroll to onFocus handler
			if (currentIndex > 0 && !data[currentIndex - 1].disabled) {
				return false;
			}

			for (let i = currentIndex - 2; i >= 0; i--) {
				if (data[i] && !data[i].disabled) {
					nextIndex = i;
					break;
				}
			}
		} else {
			return false;
		}

		if (nextIndex !== -1 && (firstIndex > nextIndex || nextIndex >= firstIndex + numOfItems)) {
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
			const index = Number.parseInt(target.getAttribute(dataIndexAttribute));
			this.setSpotlightContainerRestrict(keyCode, index);
			this.isScrolledBy5way = this.jumpToSpottableItem(keyCode, target);
		}
		forwardKeyDown(e, this.props);
	}

	setContainerDisabled = (bool) => {
		const containerNode = this.containerRef;

		if (containerNode) {
			containerNode.setAttribute(dataContainerMutedAttribute, bool);
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

	getItemContainerPosition (primaryPosition) {
		const
			rtlDirection = this.context.rtl ? -1 : 1,
			{x, y} = (this.isPrimaryDirectionVertical ? {x: 0, y: primaryPosition} : {x: (primaryPosition * rtlDirection), y: 0});

		return `translate3d(${x}px, ${y}px, 0)`;
	}

	renderItemContainer (props) {
		return <div {...props} />;
	}

	renderItems ({shouldUpdateFrom, shouldUpdateTo}) {
		const
			{component: renderItem, data, dataSize, direction} = this.props,
			{firstIndex, numOfItems} = this.state,
			{cc, dimensionToExtent, isPrimaryDirectionVertical, isItemSized, primary, scrollPosition, secondary} = this,
			itemContainerFrom = Math.floor(shouldUpdateFrom / dimensionToExtent),
			itemContainerTo = Math.ceil(shouldUpdateTo / dimensionToExtent),
			numOfRows = Math.ceil(numOfItems / dimensionToExtent);

		let {primaryPosition} = this.getGridPosition(firstIndex);

		primaryPosition = primaryPosition - scrollPosition + (itemContainerFrom - firstIndex / dimensionToExtent) * primary.gridSize;

		for (let i = itemContainerFrom; i < itemContainerTo; i++, primaryPosition += primary.gridSize) {
			const
				items = [],
				key = i % numOfRows,
				flexDirection = isItemSized && direction === 'horizontal' ? 'column' : null,
				extraNumOfItems = dataSize % dimensionToExtent;

			let width = null;

			for (let j = 0, index = i * dimensionToExtent; j < dimensionToExtent && index < shouldUpdateTo; j++, index++) {
				items[j] = renderItem({data, 'data-index': index, index, key: j});

				if (index === this.nodeIndexToBeFocused) {
					this.focusByIndex(index);
				}
			}

			// For the last line of a list
			if (i === Math.ceil(dataSize / dimensionToExtent) - 1 && extraNumOfItems > 0) {
				width = (extraNumOfItems - 1) * secondary.gridSize + secondary.itemSize;
			}

			cc[key] = this.renderItemContainer({
				className: classNames(
					css.listItemContainer,
					isPrimaryDirectionVertical ? css.fitWidth : css.fitHeight
				),
				children: items,
				key,
				style: {flexDirection, transform: this.getItemContainerPosition(primaryPosition), width}
			});
		}
	}

	renderCalculate () {
		const
			{dataSize} = this.props,
			{firstIndex, numOfItems} = this.state,
			{cc} = this,
			renderFrom = firstIndex,
			renderTo = Math.min(dataSize, renderFrom + numOfItems),
			diff = renderFrom - this.lastRenderFrom,
			shouldUpdateFrom = (cc.length === 0 || diff <= 0 || diff >= numOfItems) ? renderFrom : this.lastRenderTo,
			shouldUpdateTo = (cc.length === 0 || diff > 0 || diff <= -numOfItems) ? renderTo : this.lastRenderFrom;

		if (shouldUpdateFrom < shouldUpdateTo) {
			this.renderItems({shouldUpdateFrom, shouldUpdateTo});
		}

		this.lastRenderFrom = renderFrom;
		this.lastRenderTo = renderTo;
	}

	render () {
		const
			{className} = this.props,
			{primary, cc} = this,
			props = Object.assign({}, this.props),
			mergedClasses = classNames(css.virtualList, className);

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
			this.renderCalculate();
		}

		const needsScrollingPlaceholder = this.nodeIndexToBeFocused != null && Spotlight.isPaused();

		return (
			<div {...props} className={mergedClasses} onKeyDown={this.onKeyDown} ref={this.initContainerRef} style={this.itemStyle}>
				{cc.length ? cc : null}
				{primary ? null : (
					<SpotlightPlaceholder
						data-index={0}
						data-vl-placeholder
						onFocus={this.handlePlaceholderFocus}
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
