import classNames from 'classnames';
import {forward} from '@enact/core/handle';
import {platform} from '@enact/core/platform';
import PropTypes from 'prop-types';
import equals from 'ramda/src/equals';
import React, {Component} from 'react';

import css from './VirtualList.module.less';

const
	nop = () => {},
	JS = 'JS',
	Native = 'Native';

/**
 * The shape for the grid list item size
 * in a list for [VirtualGridList]{@link ui/VirtualList.VirtualGridList}.
 *
 * @typedef {Object} gridListItemSizeShape
 * @memberof ui/VirtualList
 * @property {Number} minWidth The minimum width of the grid list item.
 * @property {Number} minHeight The minimum height of the grid list item.
 * @public
 */
const gridListItemSizeShape = PropTypes.shape({
	minHeight: PropTypes.number.isRequired,
	minWidth: PropTypes.number.isRequired
});

/**
 * The shape for the list different item size
 * in a list for [VirtualList]{@link ui/VirtualList.VirtualList}.
 *
 * @typedef {Object} itemSizesShape
 * @memberof ui/VirtualList
 * @property {Number} minSize The minimum size of the list item.
 * @property {Number[]} size An array of the list item size. If it is not defined, the list items will render with the `minSize` size.
 * @public
 */
const itemSizesShape = PropTypes.shape({
	minSize: PropTypes.number.isRequired,
	size: PropTypes.arrayOf(PropTypes.number)
});

/**
 * The base version of the virtual list component.
 *
 * @class VirtualListCore
 * @memberof ui/VirtualList
 * @ui
 * @private
 */
	class VirtualListBase extends Component {
		/* No displayName here. We set displayName to returned components of this factory function. */

		static propTypes = /** @lends ui/VirtualList.VirtualListBase.prototype */ {
			/**
			 * The rendering function called for each item in the list.
			 *
			 * > **Note**: The list does **not** always render a component whenever its render function is called
			 * due to performance optimization.
			 *
			 * Example:
			 * ```
			 * renderItem = ({index, ...rest}) => {
			 * 	delete rest.data;
			 *
			 * 	return (
			 * 		<MyComponent index={index} {...rest} />
			 * 	);
			 * }
			 * ```
			 *
			 * @type {Function}
			 * @param {Object}     event
			 * @param {Number}     event.data-index    It is required for `Spotlight` 5-way navigation. Pass to the root element in the component.
			 * @param {Number}     event.index    The index number of the component to render
			 * @param {Number}     event.key    It MUST be passed as a prop to the root element in the component for DOM recycling.
			 *
			 * @required
			 * @public
			 */
			itemRenderer: PropTypes.func.isRequired,

			/**
			 * The size of an item for the list; valid values are either a number for `VirtualList`
			 * or an object that has `minWidth` and `minHeight` for `VirtualGridList`.
			 *
			 * @type {Number|ui/VirtualList.gridListItemSizeShape}
			 * @required
			 * @private
			 */
			itemSize: PropTypes.oneOfType([
				PropTypes.number,
				gridListItemSizeShape
			]).isRequired,

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
			 * Additional props included in the object passed to the `itemsRenderer` callback.
			 *
			 * @type {Object}
			 * @public
			 */
			childProps: PropTypes.object,

			/**
			 * Client size of the list; valid values are an object that has `clientWidth` and `clientHeight`.
			 *
			 * @type {Object}
			 * @property {Number}    clientHeight    The client height of the list.
			 * @property {Number}    clientWidth    The client width of the list.
			 * @public
			 */
			clientSize: PropTypes.shape({
				clientHeight: PropTypes.number.isRequired,
				clientWidth: PropTypes.number.isRequired
			}),

			/**
			 * Disable voice control feature of component.
			 *
			 * @type {Boolean}
			 * @public
			 */
			'data-webos-voice-disabled': PropTypes.bool,

			/**
			 * Activates the component for voice control.
			 *
			 * @type {Boolean}
			 * @public
			 */
			'data-webos-voice-focused': PropTypes.bool,

			/**
			 * The voice control group label.
			 *
			 * @type {String}
			 * @public
			 */
			'data-webos-voice-group-label': PropTypes.string,

			/**
			 * The number of items of data the list contains.
			 *
			 * @type {Number}
			 * @default 0
			 * @public
			 */
			dataSize: PropTypes.number,

			/**
			 * The layout direction of the list.
			 *
			 * Valid values are:
			 * * `'horizontal'`, and
			 * * `'vertical'`.
			 *
			 * @type {String}
			 * @default 'vertical'
			 * @public
			 */
			direction: PropTypes.oneOf(['horizontal', 'vertical']),

			/**
			 * Called to get the props for list items.
			 *
			 * @type {Function}
			 * @private
			 */
			getComponentProps: PropTypes.func,

			/**
			 * The array for individually sized items.
			 *
			 * @type {Number[]}
			 * @private
			 */
			itemSizes: PropTypes.arrayOf(PropTypes.number),

			/**
			 * Called when the range of items has updated.
			 *
			 * Event payload includes the `firstIndex` and `lastIndex` of the list.
			 *
			 * @type {Function}
			 * @private
			 */
			onUpdateItems: PropTypes.func,

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
			 * When `true`, the list will scroll by page.  Otherwise the list will scroll by item.
			 *
			 * @type {Boolean}
			 * @default false
			 * @private
			 */
			pageScroll: PropTypes.bool,

			/**
			 * `true` if RTL, `false` if LTR.
			 *
			 * @type {Boolean}
			 * @private
			 */
			rtl: PropTypes.bool,

			/**
			 * The spacing between items.
			 *
			 * @type {Number}
			 * @default 0
			 * @public
			 */
			spacing: PropTypes.number,

			/**
			 * Called to execute additional logic in a themed component when updating states and bounds.
			 *
			 * @type {Function}
			 * @private
			 */
			updateStatesAndBounds: PropTypes.func
		}

		static defaultProps = {
			cbScrollTo: nop,
			dataSize: 0,
			direction: 'vertical',
			overhang: 3,
			pageScroll: false,
			spacing: 0
		}

		constructor (props) {
			let nextState = null;

			super(props);

			// this.props.uiChildContainerRef = React.createRef();
			this.contentRef = React.createRef();
			this.itemContainerRef = React.createRef();

			if (props.clientSize) {
				this.calculateMetrics(props);
				nextState = this.getStatesAndUpdateBounds(props);
			}

			this.state = {
				firstIndex: 0,
				_numOfItems: 0,
				prevChildProps: null,
				prevFirstIndex: 0,
				updateFrom: 0,
				updateTo: 0,
				...nextState
			};

			const adapter = {
				calculateMetrics: this.calculateMetrics.bind(this),
				didScroll: this.didScroll.bind(this),
				get dimensionToExtent () {
					return this._dimensionToExtent;
				},
				getGridPosition: this.getGridPosition.bind(this),
				getItemBottomPosition: this.getItemBottomPosition.bind(this),
				getItemNode: this.getItemNode.bind(this),
				getItemPosition: this.getItemPosition.bind(this),
				getMoreInfo: this.getMoreInfo.bind(this),
				getScrollBounds: this.getScrollBounds.bind(this),
				gridPositionToItemPosition: this.gridPositionToItemPosition.bind(this),
				get hasDataSizeChanged () {
					return this._hasDataSizeChanged;
				},
				isHorizontal: this.isHorizontal.bind(this),
				get isPrimaryDirectionVertical () {
					return this._isPrimaryDirectionVertical;
				},
				isVertical: this.isVertical.bind(this),
				get itemPositions () {
					return this.itemPositions;
				},
				get numOfItems () {
					return _numOfItems;
				},
				get primary () {
					return this._primary;
				},
				props,
				get scrollPosition () {
					return this._scrollPosition;
				},
				get scrollPositionTarget () {
					return this._scrollPositionTarget;
				},
				scrollToPosition: this.scrollToPosition.bind(this),
				setScrollPosition: this.setScrollPosition.bind(this),
				syncClientSize: this.syncClientSize.bind(this)
			};

			props.setUiChildAdapter(adapter);
		}

		static getDerivedStateFromProps (props, state) {
			const
				shouldInvalidate = (
					state.prevFirstIndex === state.firstIndex ||
					state.prevChildProps !== props.childProps
				),
				diff = state.firstIndex - state.prevFirstIndex,
				updateTo = (-state._numOfItems >= diff || diff > 0 || shouldInvalidate) ? state.firstIndex + state._numOfItems : state.prevFirstIndex,
				updateFrom = (0 >= diff || diff >= state._numOfItems || shouldInvalidate) ? state.firstIndex : state.prevFirstIndex + state._numOfItems,
				nextUpdateFromAndTo = (state.updateFrom !== updateFrom || state.updateTo !== updateTo) ? {updateFrom, updateTo} : null;

			return {
				...nextUpdateFromAndTo,
				prevChildProps: props.childProps,
				prevFirstIndex: state.firstIndex
			};
		}

		// Calculate metrics for VirtualList after the 1st render to know client W/H.
		componentDidMount () {
			if (!this.props.clientSize) {
				this.calculateMetrics(this.props);
				// eslint-disable-next-line react/no-did-mount-set-state
				this.setState(this.getStatesAndUpdateBounds(this.props));
			} else {
				this.emitUpdateItems();
			}

			if (this.props.itemSizes) {
				this.adjustItemPositionWithItemSize();
			} else {
				this.setContainerSize();
			}
		}

		componentDidUpdate (prevProps, prevState) {
			let deferScrollTo = false;
			const {firstIndex, _numOfItems} = this.state;

			this.shouldUpdateBounds = false;

			// TODO: remove `this._hasDataSizeChanged` and fix ui/Scrollable*
			this._hasDataSizeChanged = (prevProps.dataSize !== this.props.dataSize);

			if (prevState.firstIndex !== firstIndex || prevState._numOfItems !== _numOfItems) {
				this.emitUpdateItems();
			}

			// When an item expands or shrinks,
			// we need to calculate the item position again and
			// the item needs to scroll into view if the item does not show fully.
			if (this.props.itemSizes) {
				if (this.itemPositions.length > this.props.itemSizes.length) {
					// The item with `this.props.itemSizes.length` index is not rendered yet.
					// So the item could scroll into view after it rendered.
					// To do it, `this.props.itemSizes.length` value is cached in `this.indexToScrollIntoView`.
					this.indexToScrollIntoView = this.props.itemSizes.length;

					this.itemPositions = [...this.itemPositions.slice(0, this.props.itemSizes.length)];
					this.adjustItemPositionWithItemSize();
				} else {
					const {indexToScrollIntoView} = this;

					this.adjustItemPositionWithItemSize();

					if (indexToScrollIntoView !== -1) {
						// Currently we support expandable items in only vertical VirtualList.
						// So the top and bottom of the boundaries are checked.
						const
							scrollBounds = {top: this._scrollPosition, bottom: this._scrollPosition + this.scrollBounds.clientHeight},
							itemBounds = {top: this.getGridPosition(indexToScrollIntoView).primaryPosition, bottom: this.getItemBottomPosition(indexToScrollIntoView)};

						if (itemBounds.top < scrollBounds.top) {
							this.props.cbScrollTo({
								index: indexToScrollIntoView,
								stickTo: 'start',
								animate: true
							});
						} else if (itemBounds.bottom > scrollBounds.bottom) {
							this.props.cbScrollTo({
								index: indexToScrollIntoView,
								stickTo: 'end',
								animate: true
							});
						}
					}

					this.indexToScrollIntoView = -1;
				}
			}

			if (
				prevProps.direction !== this.props.direction ||
				prevProps.overhang !== this.props.overhang ||
				prevProps.spacing !== this.props.spacing ||
				!equals(prevProps.itemSize, this.props.itemSize)
			) {
				const {x, y} = this.getXY(this._scrollPosition, 0);

				this.calculateMetrics(this.props);
				// eslint-disable-next-line react/no-did-update-set-state
				this.setState(this.getStatesAndUpdateBounds(this.props));
				this.setContainerSize();

				const {clientHeight, clientWidth, scrollHeight, scrollWidth} = this.scrollBounds;
				const xMax = scrollWidth - clientWidth;
				const yMax = scrollHeight - clientHeight;

				this.updateScrollPosition({
					x: xMax > x ? x : xMax,
					y: yMax > y ? y : yMax
				});

				deferScrollTo = true;
			} else if (this._hasDataSizeChanged) {
				const newState = this.getStatesAndUpdateBounds(this.props, this.state.firstIndex);
				// eslint-disable-next-line react/no-did-update-set-state
				this.setState(newState);
				this.setContainerSize();

				deferScrollTo = true;
			} else if (prevProps.rtl !== this.props.rtl) {
				this.updateScrollPosition(this.getXY(this._scrollPosition, 0));
			}

			const maxPos = this._isPrimaryDirectionVertical ? this.scrollBounds.maxTop : this.scrollBounds.maxLeft;

			if (!deferScrollTo && this._scrollPosition > maxPos) {
				this.props.cbScrollTo({position: (this._isPrimaryDirectionVertical) ? {y: maxPos} : {x: maxPos}, animate: false});
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

		_primary = null
		secondary = null

		_isPrimaryDirectionVertical = true
		isItemSized = false

		shouldUpdateBounds = false

		_dimensionToExtent = 0
		threshold = 0
		maxFirstIndex = 0
		curDataSize = 0
		_hasDataSizeChanged = false
		cc = []
		_scrollPosition = 0
		_scrollPositionTarget = 0

		// For individually sized item
		itemPositions = []
		indexToScrollIntoView = -1

		updateScrollPosition = ({x, y}, rtl = this.props.rtl) => {
			if (this.props.type === Native) {
				this.scrollToPosition(x, y, rtl);
			} else {
				this.setScrollPosition(x, y, rtl, x, y);
			}
		}

		isVertical = () => this._isPrimaryDirectionVertical

		isHorizontal = () => !this._isPrimaryDirectionVertical

		getScrollBounds = () => this.scrollBounds

		getMoreInfo = () => this.moreInfo

		getGridPosition (index) {
			const
				{dataSize, itemSizes} = this.props,
				{_dimensionToExtent, itemPositions, _primary, secondary} = this,
				secondaryPosition = (index % _dimensionToExtent) * secondary.gridSize,
				extent = Math.floor(index / _dimensionToExtent);
			let primaryPosition;

			if (itemSizes && typeof itemSizes[index] !== 'undefined' && dataSize > index) {
				const firstIndexInExtent = extent * _dimensionToExtent;

				if (!itemPositions[firstIndexInExtent]) {
					// Cache individually sized item positions
					for (let i = itemPositions.length; i <= index; i++) {
						this.calculateAndCacheItemPosition(i);
					}
				}

				if (itemPositions[firstIndexInExtent]) {
					primaryPosition = itemPositions[firstIndexInExtent].position;
				} else {
					primaryPosition = extent * _primary.gridSize;
				}
			} else {
				primaryPosition = extent * _primary.gridSize;
			}

			return {primaryPosition, secondaryPosition};
		}

		// For individually sized item
		getItemBottomPosition = (index) => {
			const
				itemPosition = this.itemPositions[index],
				itemSize = this.props.itemSizes[index];

			if (itemPosition && (itemSize || itemSize === 0)) {
				return itemPosition.position + itemSize;
			} else {
				return index * this._primary.gridSize - this.props.spacing;
			}
		}

		// For individually sized item
		getItemTopPositionFromPreviousItemBottomPosition = (index, spacing) => {
			return index === 0 ? 0 : this.getItemBottomPosition(index - 1) + spacing;
		}

		getItemPosition = (index, stickTo = 'start') => {
			const
				{_primary} = this,
				position = this.getGridPosition(index);
			let  offset = 0;

			if (stickTo === 'start') {
				offset = 0;
			} else if (this.props.itemSizes) {
				offset = _primary.clientSize - this.props.itemSizes[index];
			} else {
				offset = _primary.clientSize - _primary.itemSize;
			}

			position.primaryPosition -= offset;

			return this.gridPositionToItemPosition(position);
		}

		gridPositionToItemPosition = ({primaryPosition, secondaryPosition}) =>
			(this._isPrimaryDirectionVertical ? {left: secondaryPosition, top: primaryPosition} : {left: primaryPosition, top: secondaryPosition})

		getXY = (primaryPosition, secondaryPosition) => (this._isPrimaryDirectionVertical ? {x: secondaryPosition, y: primaryPosition} : {x: primaryPosition, y: secondaryPosition})

		getClientSize = (node) => ({
			clientWidth: node.clientWidth,
			clientHeight: node.clientHeight
		})

		emitUpdateItems () {
			const {dataSize} = this.props;
			const {firstIndex, _numOfItems} = this.state;

			forward('onUpdateItems', {
				firstIndex: firstIndex,
				lastIndex: Math.min(firstIndex + _numOfItems, dataSize)
			}, this.props);
		}

		calculateMetrics (props) {
			const
				{clientSize, direction, itemSize, overhang, spacing} = props,
				node = this.props.uiChildContainerRef.current;

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
			let _primary, secondary, _dimensionToExtent, thresholdBase;

			this._isPrimaryDirectionVertical = (direction === 'vertical');

			if (this._isPrimaryDirectionVertical) {
				_primary = heightInfo;
				secondary = widthInfo;
			} else {
				_primary = widthInfo;
				secondary = heightInfo;
			}
			_dimensionToExtent = 1;

			this.isItemSized = (_primary.minItemSize && secondary.minItemSize);

			if (this.isItemSized) {
				// the number of columns is the ratio of the available width plus the spacing
				// by the minimum item width plus the spacing
				_dimensionToExtent = Math.max(Math.floor((secondary.clientSize + spacing) / (secondary.minItemSize + spacing)), 1);
				// the actual item width is a ratio of the remaining width after all columns
				// and spacing are accounted for and the number of columns that we know we should have
				secondary.itemSize = Math.floor((secondary.clientSize - (spacing * (_dimensionToExtent - 1))) / _dimensionToExtent);
				// the actual item height is related to the item width
				_primary.itemSize = Math.floor(_primary.minItemSize * (secondary.itemSize / secondary.minItemSize));
			}

			_primary.gridSize = _primary.itemSize + spacing;
			secondary.gridSize = secondary.itemSize + spacing;
			thresholdBase = _primary.gridSize * Math.ceil(overhang / 2);

			this.threshold = {min: -Infinity, max: thresholdBase, base: thresholdBase};
			this._dimensionToExtent = _dimensionToExtent;

			this._primary = _primary;
			this.secondary = secondary;

			// reset
			this._scrollPosition = 0;
			if (this.props.type === JS && this.contentRef.current) {
				this.contentRef.current.style.transform = null;
			}
		}

		getStatesAndUpdateBounds = (props, firstIndex = 0) => {
			const
				{dataSize, overhang, updateStatesAndBounds} = props,
				{_dimensionToExtent, _primary, moreInfo, _scrollPosition} = this,
				_numOfItems = Math.min(dataSize, _dimensionToExtent * (Math.ceil(_primary.clientSize / _primary.gridSize) + overhang)),
				wasFirstIndexMax = ((this.maxFirstIndex < moreInfo.firstVisibleIndex - _dimensionToExtent) && (firstIndex === this.maxFirstIndex)),
				dataSizeDiff = dataSize - this.curDataSize;
			let newFirstIndex = firstIndex;

			// When calling setState() except in didScroll(), `shouldUpdateBounds` should be `true`
			// so that setState() in didScroll() could be called to override state.
			// Before calling setState() except in didScroll(), getStatesAndUpdateBounds() is always called.
			// So `shouldUpdateBounds` is true here.
			this.shouldUpdateBounds = true;

			this.maxFirstIndex = Math.ceil((dataSize - _numOfItems) / _dimensionToExtent) * _dimensionToExtent;
			this.curDataSize = dataSize;

			// reset children
			this.cc = [];
			this.itemPositions = []; // For individually sized item
			this.calculateScrollBounds(props);
			this.updateMoreInfo(dataSize, _scrollPosition);

			if (!(updateStatesAndBounds && updateStatesAndBounds({
				cbScrollTo: props.cbScrollTo,
				_numOfItems,
				dataSize,
				moreInfo
			}))) {
				newFirstIndex = this.calculateFirstIndex(props, wasFirstIndexMax, dataSizeDiff, firstIndex);
			}

			return {
				firstIndex: newFirstIndex,
				_numOfItems: _numOfItems
			};
		}

		calculateFirstIndex (props, wasFirstIndexMax, dataSizeDiff, firstIndex) {
			const
				{overhang} = props,
				{_dimensionToExtent, _isPrimaryDirectionVertical, maxFirstIndex, _primary, scrollBounds, _scrollPosition, threshold} = this,
				{gridSize} = _primary;
			let newFirstIndex = firstIndex;

			if (wasFirstIndexMax && dataSizeDiff > 0) { // If dataSize increased from bottom, we need adjust firstIndex
				// If this is a gridlist and dataSizeDiff is smaller than 1 line, we are adjusting firstIndex without threshold change.
				if (_dimensionToExtent > 1 && dataSizeDiff < _dimensionToExtent) {
					newFirstIndex = maxFirstIndex;
				} else { // For other bottom adding case, we need to update firstIndex and threshold.
					const
						maxPos = _isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft,
						maxOfMin = maxPos - threshold.base,
						numOfUpperLine = Math.floor(overhang / 2),
						firstIndexFromPosition = Math.floor(_scrollPosition / gridSize),
						expectedFirstIndex = Math.max(0, firstIndexFromPosition - numOfUpperLine);

					// To navigate with 5way, we need to adjust firstIndex to the next line
					// since at the bottom we have num of overhang lines for upper side but none for bottom side
					// So we add numOfUpperLine at the top and rest lines at the bottom
					newFirstIndex = Math.min(maxFirstIndex, expectedFirstIndex * _dimensionToExtent);

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
				node = this.props.uiChildContainerRef.current;

			if (!clientSize && !node) {
				return;
			}

			const
				{scrollBounds, _isPrimaryDirectionVertical} = this,
				{clientWidth, clientHeight} = clientSize || this.getClientSize(node);
			let maxPos;

			scrollBounds.clientWidth = clientWidth;
			scrollBounds.clientHeight = clientHeight;
			scrollBounds.scrollWidth = this.getScrollWidth();
			scrollBounds.scrollHeight = this.getScrollHeight();
			scrollBounds.maxLeft = Math.max(0, scrollBounds.scrollWidth - clientWidth);
			scrollBounds.maxTop = Math.max(0, scrollBounds.scrollHeight - clientHeight);

			// correct position
			maxPos = _isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft;

			this.syncThreshold(maxPos);
		}

		setContainerSize = () => {
			if (this.contentRef.current) {
				this.contentRef.current.style.width = this.scrollBounds.scrollWidth + (this._isPrimaryDirectionVertical ? -1 : 0) + 'px';
				this.contentRef.current.style.height = this.scrollBounds.scrollHeight + (this._isPrimaryDirectionVertical ? 0 : -1) + 'px';
			}
		}

		updateMoreInfo (dataSize, primaryPosition) {
			const
				{_dimensionToExtent, moreInfo} = this,
				{itemSize, gridSize, clientSize} = this._primary;

			if (dataSize <= 0) {
				moreInfo.firstVisibleIndex = null;
				moreInfo.lastVisibleIndex = null;
			} else if (this.props.itemSizes) {
				const {firstIndex, _numOfItems} = this.state;
				const {_isPrimaryDirectionVertical, scrollBounds: {clientWidth, clientHeight}, _scrollPosition} = this;
				const size = _isPrimaryDirectionVertical ? clientHeight : clientWidth;

				let firstVisibleIndex = null, lastVisibleIndex = null;

				for (let i = firstIndex; i < firstIndex +  _numOfItems; i++) {
					if (_scrollPosition <= this.getItemBottomPosition(i)) {
						firstVisibleIndex = i;
						break;
					}
				}

				for (let i = firstIndex + _numOfItems - 1; i >= firstIndex; i--) {
					if (_scrollPosition + size >= this.getItemBottomPosition(i) - this.props.itemSizes[i]) {
						lastVisibleIndex = i;
						break;
					}
				}

				if (firstVisibleIndex > lastVisibleIndex) {
					firstVisibleIndex = null;
					lastVisibleIndex = null;
				}

				moreInfo.firstVisibleIndex = firstVisibleIndex;
				moreInfo.lastVisibleIndex = lastVisibleIndex;
			} else {
				moreInfo.firstVisibleIndex = (Math.floor((primaryPosition - itemSize) / gridSize) + 1) * _dimensionToExtent;
				moreInfo.lastVisibleIndex = Math.min(dataSize - 1, Math.ceil((primaryPosition + clientSize) / gridSize) * _dimensionToExtent - 1);
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

		// Native only
		scrollToPosition (x, y, rtl = this.props.rtl) {
			if (this.props.uiChildContainerRef.current) {
				if (this._isPrimaryDirectionVertical) {
					this._scrollPositionTarget = y;
				} else {
					this._scrollPositionTarget = x;
				}

				if (rtl) {
					x = (platform.ios || platform.safari) ? -x : this.scrollBounds.maxLeft - x;
				}

				this.props.uiChildContainerRef.current.scrollTo(x, y);
			}
		}

		// JS only
		setScrollPosition (x, y, rtl = this.props.rtl, targetX = 0, targetY = 0) {
			if (this.contentRef.current) {
				this.contentRef.current.style.transform = `translate3d(${rtl ? x : -x}px, -${y}px, 0)`;

				// The `x`, `y` as parameters in scrollToPosition() are the position when stopping scrolling.
				// But the `x`, `y` as parameters in setScrollPosition() are the position between current position and the position stopping scrolling.
				// To know the position when stopping scrolling here, `targetX` and `targetY` are passed and cached in `this._scrollPositionTarget`.
				if (this._isPrimaryDirectionVertical) {
					this._scrollPositionTarget = targetY;
				} else {
					this._scrollPositionTarget = targetX;
				}

				this.didScroll(x, y);
			}
		}

		didScroll (x, y) {
			const
				{dataSize, spacing, itemSizes} = this.props,
				{firstIndex} = this.state,
				{_isPrimaryDirectionVertical, threshold, _dimensionToExtent, maxFirstIndex, scrollBounds, itemPositions} = this,
				{clientSize, gridSize} = this._primary,
				maxPos = _isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft;
			let newFirstIndex = firstIndex, index, pos, size, itemPosition;

			if (_isPrimaryDirectionVertical) {
				pos = y;
			} else {
				pos = x;
			}

			if (pos > threshold.max || pos < threshold.min) {
				let newThresholdMin = -Infinity, newThresholdMax = Infinity;

				if (this.props.itemSizes) {
					const overhangBefore = Math.floor(this.props.overhang / 2);
					let firstRenderedIndex = -1;

					// find an item which is known as placed the first rendered item's position
					for (index = 0; index < dataSize; index += _dimensionToExtent) {
						itemPosition = itemPositions[index];
						size = itemSizes[index];
						if (itemPosition && size && itemPosition.position + size >= pos && itemPosition.position <= pos + clientSize) {
							firstRenderedIndex = index;
							break;
						}
					}

					// found an item which is visible within a current viewport
					if (index < dataSize) {
						if (itemPosition.position <= pos) {
							newFirstIndex = firstRenderedIndex - overhangBefore * _dimensionToExtent;
							newThresholdMin = itemPosition.position;
							newThresholdMax = newThresholdMin + size + spacing;
						} else {
							const diffToFirstIndex = Math.ceil((itemPosition.position - pos) / gridSize);
							newFirstIndex = firstRenderedIndex - (diffToFirstIndex + overhangBefore) * _dimensionToExtent;
							newThresholdMin = itemPosition.position - diffToFirstIndex * gridSize;
							newThresholdMax = newThresholdMin + gridSize;
						}
					} else { // calculate the first index based on assuming that all items have minimal size
						const firstExtent = Math.max(
							0,
							Math.min(
								Math.floor(maxFirstIndex / _dimensionToExtent),
								Math.floor((pos - gridSize * overhangBefore) / gridSize)
							)
						);

						newFirstIndex = firstExtent * _dimensionToExtent;
						newThresholdMin = (firstExtent + overhangBefore) * gridSize;
						newThresholdMax = newThresholdMin + gridSize;
					}

					newFirstIndex = Math.max(0, Math.min(maxFirstIndex, newFirstIndex));
				} else {
					const
						overhangBefore = Math.floor(this.props.overhang / 2),
						firstExtent = Math.max(
							0,
							Math.min(
								Math.floor(maxFirstIndex / _dimensionToExtent),
								Math.floor((pos - gridSize * overhangBefore) / gridSize)
							)
						);

					newFirstIndex = firstExtent * _dimensionToExtent;
					newThresholdMin = (firstExtent + overhangBefore) * gridSize;
					newThresholdMax = newThresholdMin + gridSize;
				}

				threshold.min = newFirstIndex === 0 ? -Infinity : newThresholdMin;
				threshold.max = newFirstIndex === maxFirstIndex ? Infinity : newThresholdMax;
			}

			this.syncThreshold(maxPos);
			this._scrollPosition = pos;
			this.updateMoreInfo(dataSize, pos);

			if (this.shouldUpdateBounds || firstIndex !== newFirstIndex) {
				this.setState({firstIndex: newFirstIndex});
			}
		}

		// For individually sized item
		calculateAndCacheItemPosition (index) {
			const {itemSizes} = this.props;

			if (!this.itemPositions[index] && itemSizes[index]) {
				const
					{spacing} = this.props,
					position = this.getItemTopPositionFromPreviousItemBottomPosition(index, spacing);

				this.itemPositions[index] = {position};
			}
		}

		// For individually sized item
		applyItemPositionToDOMElement (index) {
			const
				{direction, rtl} = this.props,
				{_numOfItems} = this.state,
				{itemPositions} = this,
				childNode = this.itemContainerRef.current.children[index % _numOfItems];

			if (childNode && itemPositions[index]) {
				const position = itemPositions[index].position;
				if (direction === 'vertical') {
					childNode.style.transform = `translate3d(0, ${position}px, 0)`;
				} else {
					childNode.style.transform = `translate3d(${position * (rtl ? -1 : 1)}px, 0, 0)`;
				}
			}
		}

		// For individually sized item
		updateThresholdWithItemPosition () {
			const
				{overhang} = this.props,
				{firstIndex} = this.state,
				{maxFirstIndex} = this,
				numOfUpperLine = Math.floor(overhang / 2);

			this.threshold.min = firstIndex === 0 ? -Infinity : this.getItemBottomPosition(firstIndex + numOfUpperLine);
			this.threshold.max = firstIndex === maxFirstIndex ? Infinity : this.getItemBottomPosition(firstIndex + (numOfUpperLine + 1));
		}

		// For individually sized item
		updateScrollBoundsWithItemPositions () {
			const
				{dataSize, itemSizes, spacing} = this.props,
				{firstIndex, _numOfItems} = this.state,
				{_isPrimaryDirectionVertical, itemPositions} = this,
				scrollBoundsDimension = _isPrimaryDirectionVertical ? 'scrollHeight' : 'scrollWidth';

			if (itemPositions.length === dataSize) { // all item sizes are known
				this.scrollBounds[scrollBoundsDimension] =
					itemSizes.reduce((acc, cur) => acc + cur, 0) + (dataSize - 1) * spacing;
			} else {
				for (let index = firstIndex + _numOfItems - 1; index < dataSize; index++) {
					const nextInfo = itemPositions[index + 1];
					if (!nextInfo) {
						const endPosition = this.getItemBottomPosition(index);
						if (endPosition > this.scrollBounds[scrollBoundsDimension]) {
							this.scrollBounds[scrollBoundsDimension] = endPosition;
						}

						break;
					}
				}
			}

			this.scrollBounds.maxTop = Math.max(0, this.scrollBounds.scrollHeight - this.scrollBounds.clientHeight);
		}

		// For individually sized item
		adjustItemPositionWithItemSize () {
			if (this.itemContainerRef.current) {
				const
					{dataSize} = this.props,
					{firstIndex, _numOfItems} = this.state,
					lastIndex = firstIndex + _numOfItems - 1;

				// Cache individually sized item positions
				// and adjust item DOM element positions
				for (let index = firstIndex; index <= lastIndex; index++) {
					this.calculateAndCacheItemPosition(index);
					this.applyItemPositionToDOMElement(index);
				}

				// Update threshold based on this.itemPositions
				this.updateThresholdWithItemPosition();

				// Update scroll bounds based on this.itemPositions
				this.updateScrollBoundsWithItemPositions();

				// Set container size based on this.scrollbounds
				this.setContainerSize();

				// Update moreInfo based on this.itemPositions
				this.updateMoreInfo(dataSize, this._scrollPosition);
			}
		}

		getItemNode = (index) => {
			const ref = this.itemContainerRef.current;

			return ref ? ref.children[index % this.state._numOfItems] : null;
		}

		composeStyle (width, height, primaryPosition, secondaryPosition) {
			const
				{x, y} = this.getXY(primaryPosition, secondaryPosition),
				style = {
					position: 'absolute',
					/* FIXME: RTL / this calculation only works for Chrome */
					transform: `translate3d(${this.props.rtl ? -x : x}px, ${y}px, 0)`
				};

			if (this.isItemSized) {
				style.width = width;
				style.height = height;
			}

			return style;
		}

		applyStyleToNewNode = (index, ...rest) => {
			const
				{itemRenderer, getComponentProps} = this.props,
				key = index % this.state._numOfItems,
				itemElement = itemRenderer({
					...this.props.childProps,
					key,
					index
				}),
				componentProps = getComponentProps && getComponentProps(index) || {};

			this.cc[key] = React.cloneElement(itemElement, {
				...componentProps,
				className: classNames(css.listItem, itemElement.props.className),
				style: {...itemElement.props.style, ...(this.composeStyle(...rest))}
			});
		}

		applyStyleToHideNode = (index) => {
			const key = index % this.state._numOfItems;
			this.cc[key] = <div key={key} style={{display: 'none'}} />;
		}

		positionItems () {
			const
				{dataSize, itemSizes} = this.props,
				{firstIndex, _numOfItems} = this.state,
				{cc, _isPrimaryDirectionVertical, _dimensionToExtent, _primary, secondary, itemPositions} = this;
			let
				hideTo = 0,
				updateFrom = cc.length ? this.state.updateFrom : firstIndex,
				updateTo = cc.length ? this.state.updateTo : firstIndex + _numOfItems;

			if (updateFrom >= updateTo) {
				return;
			} else if (updateTo > dataSize) {
				hideTo = updateTo;
				updateTo = dataSize;
			}

			let
				width, height,
				{primaryPosition, secondaryPosition} = this.getGridPosition(updateFrom);

			width = (_isPrimaryDirectionVertical ? secondary.itemSize : _primary.itemSize) + 'px';
			height = (_isPrimaryDirectionVertical ? _primary.itemSize : secondary.itemSize) + 'px';

			// positioning items
			for (let i = updateFrom, j = updateFrom % _dimensionToExtent; i < updateTo; i++) {
				this.applyStyleToNewNode(i, width, height, primaryPosition, secondaryPosition);

				if (++j === _dimensionToExtent) {
					secondaryPosition = 0;

					if (this.props.itemSizes) {
						if (itemPositions[i + 1] || itemPositions[i + 1] === 0) {
							primaryPosition = itemPositions[i + 1].position;
						} else if (itemSizes[i]) {
							primaryPosition += itemSizes[i] + this.props.spacing;
						} else {
							primaryPosition += _primary.gridSize;
						}
					} else {
						primaryPosition += _primary.gridSize;
					}

					j = 0;
				} else {
					secondaryPosition += secondary.gridSize;
				}
			}

			for (let i = updateTo; i < hideTo; i++) {
				this.applyStyleToHideNode(i);
			}
		}

		getScrollHeight = () => (this._isPrimaryDirectionVertical ? this.getVirtualScrollDimension() : this.scrollBounds.clientHeight)

		getScrollWidth = () => (this._isPrimaryDirectionVertical ? this.scrollBounds.clientWidth : this.getVirtualScrollDimension())

		getVirtualScrollDimension = () => {
			if (this.props.itemSizes) {
				return this.props.itemSizes.reduce((total, size, index) => (total + size + (index > 0 ? this.props.spacing : 0)), 0);
			} else {
				const
					{_dimensionToExtent, _primary, curDataSize} = this,
					{spacing} = this.props;

				return (Math.ceil(curDataSize / _dimensionToExtent) * _primary.gridSize) - spacing;
			}
		}

		syncClientSize = () => {
			const
				{props} = this,
				node = this.props.uiChildContainerRef.current;

			if (!props.clientSize && !node) {
				return false;
			}

			const
				{clientWidth, clientHeight} = props.clientSize || this.getClientSize(node),
				{scrollBounds} = this;

			if (clientWidth !== scrollBounds.clientWidth || clientHeight !== scrollBounds.clientHeight) {
				this.calculateMetrics(props);
				this.setState(this.getStatesAndUpdateBounds(props));
				this.setContainerSize();
				return true;
			}

			return false;
		}

		// render

		getContainerClasses (className) {
			let containerClass = null;

			if (this.props.type === Native) {
				containerClass = this._isPrimaryDirectionVertical ? css.vertical : css.horizontal;
			}

			return classNames(css.virtualList, containerClass, className);
		}

		getContentClasses () {
			return this.props.type === Native ? null : css.content;
		}

		render () {
			const
				{className, 'data-webos-voice-focused': voiceFocused, 'data-webos-voice-group-label': voiceGroupLabel, 'data-webos-voice-disabled': voiceDisabled, itemsRenderer, style, ...rest} = this.props,
				{cc, itemContainerRef, _primary} = this,
				containerClasses = this.getContainerClasses(className),
				contentClasses = this.getContentClasses();

			delete rest.cbScrollTo;
			delete rest.childProps;
			delete rest.clientSize;
			delete rest.dataSize;
			delete rest.direction;
			delete rest.getComponentProps;
			delete rest.isHorizontalScrollbarVisible;
			delete rest.isVerticalScrollbarVisible;
			delete rest.itemRenderer;
			delete rest.itemSize;
			delete rest.onUpdate;
			delete rest.onUpdateItems;
			delete rest.overhang;
			delete rest.pageScroll;
			delete rest.rtl;
			delete rest.spacing;
			delete rest.updateStatesAndBounds;
			delete rest.itemSizes;

			if (_primary) {
				this.positionItems();
			}

			return (
				<div className={containerClasses} data-webos-voice-focused={voiceFocused} data-webos-voice-group-label={voiceGroupLabel} data-webos-voice-disabled={voiceDisabled} ref={this.props.uiChildContainerRef} style={style}>
					<div {...rest} className={contentClasses} ref={this.contentRef}>
						{itemsRenderer({cc, itemContainerRef, _primary})}
					</div>
				</div>
			);
		}
	}

// import classNames from 'classnames';
// import {forward} from '@enact/core/handle';
// import PropTypes from 'prop-types';
// import equals from 'ramda/src/equals';
// import React, {useEffect, useLayoutEffect, useRef, useState, useCallback} from 'react';


// import useCalculateMetrics from './useCalculateMetrics';
// import useDifferentSizeItems from './useDifferentSizeItems';
// import useMoreInfo from './useMoreInfo';
// import usePositionItems from './usePositionItems';
// import useScrollPosition from './useScrollPosition';
// import useVirtualMetrics from './useVirtualMetrics';

// import css from './VirtualList.module.less';

// const nop = () => {};

// /**
//  * The shape for the grid list item size
//  * in a list for [VirtualGridList]{@link ui/VirtualList.VirtualGridList}.
//  *
//  * @typedef {Object} gridListItemSizeShape
//  * @memberof ui/VirtualList
//  * @property {Number} minWidth The minimum width of the grid list item.
//  * @property {Number} minHeight The minimum height of the grid list item.
//  * @public
//  */
// const gridListItemSizeShape = PropTypes.shape({
// 	minHeight: PropTypes.number.isRequired,
// 	minWidth: PropTypes.number.isRequired
// });

// /**
//  * The shape for the list different item size
//  * in a list for [VirtualList]{@link ui/VirtualList.VirtualList}.
//  *
//  * @typedef {Object} itemSizesShape
//  * @memberof ui/VirtualList
//  * @property {Number} minSize The minimum size of the list item.
//  * @property {Number[]} size An array of the list item size. If it is not defined, the list items will render with the `minSize` size.
//  * @public
//  */
// const itemSizesShape = PropTypes.shape({
// 	minSize: PropTypes.number.isRequired,
// 	size: PropTypes.arrayOf(PropTypes.number)
// });

// /**
//  * The base version of the virtual list component.
//  *
//  * @function VirtualListCore
//  * @memberof ui/VirtualList
//  * @ui
//  * @private
//  */
// const VirtualListBase = (props) => {
// 	const type = props.type;
// 	/* No displayName here. We set displayName to returned components of this factory function. */
// 	const {uiChildContainerRef} = props;
// 	const contentRef = useRef();
// 	const itemContainerRef = useRef();

// 	const [updateFromTo, setUpdateFromTo] = useState({from: 0, to: 0});
// 	const [firstIndex, setFirstIndex] = useState(0);
// 	const [_numOfItems, setNumOfItems] = useState(0);

// 	// Mutable value

// 	const variables = useRef({
// 		isMounted: false,

// 		_primary: null,
// 		secondary: null,

// 		_isPrimaryDirectionVertical: true,
// 		isItemSized: false,

// 		shouldUpdateBounds: false,

// 		_dimensionToExtent: 0,
// 		threshold: 0,
// 		maxFirstIndex: 0,
// 		curDataSize: 0,
// 		_hasDataSizeChanged: false,
// 		cc: [],
// 		_scrollPosition: 0,
// 		_scrollPositionTarget: 0,

// 		// For individually sized item
// 		itemPositions: [],
// 		indexToScrollIntoView: -1,

// 		deferScrollTo: false,

// 		prevChildProps: null,
// 		prevFirstIndex: 0,

// 		prevProps: {
// 			dataSize: null,
// 			direction: null,
// 			overhang: null,
// 			spacing: null,
// 			itemSize: null,
// 			rtl: null
// 		},

// 		prevState: {
// 			updateFromTo: {from: 0, to: 0},
// 			firstIndex: 0,
// 			_numOfItems: 0
// 		}
// 	});

// 	// Hooks

// 	const instance = {contentRef, itemContainerRef, uiChildContainerRef, virtualListBase: {...variables, firstIndex, updateFromTo}};

// 	const cbCalculateAndCacheItemPosition = {fn: null};
// 	const {
// 		getGridPosition,
// 		getItemBottomPosition,
// 		getItemPosition,
// 		getXY,
// 		gridPositionToItemPosition,
// 		getItemTopPositionFromPreviousItemBottomPosition
// 	} = useVirtualMetrics(props, instance, {cbCalculateAndCacheItemPosition});

// 	const {getMoreInfo, updateMoreInfo} = useMoreInfo(props, instance, {getItemBottomPosition, _numOfItems});

// 	const {
// 		calculateMetrics,
// 		getScrollBounds,
// 		setContainerSize,
// 		setStatesAndUpdateBounds,
// 		syncClientSize,
// 		syncThreshold,
// 		updateScrollBoundsWithItemPositions
// 	} = useCalculateMetrics(props, instance, {getItemBottomPosition, getMoreInfo, _numOfItems, setFirstIndex, setNumOfItems, updateMoreInfo});

// 	if (props.clientSize && variables.current.isMounted === false) {
// 		calculateMetrics(props);
// 		setStatesAndUpdateBounds();

// 		variables.current.isMounted = true;
// 	}

// 	const {
// 		didScroll,
// 		scrollToPosition,
// 		setScrollPosition,
// 		updateScrollPosition
// 	} = useScrollPosition(props, instance, {getScrollBounds, setFirstIndex, syncThreshold, updateMoreInfo, updateScrollBoundsWithItemPositions});

// 	const {positionItems} = usePositionItems(props, instance, {getGridPosition, getXY, _numOfItems, updateScrollBoundsWithItemPositions});

// 	const {adjustItemPositionWithItemSize, calculateAndCacheItemPosition} = useDifferentSizeItems(props, instance, {getItemBottomPosition, getItemTopPositionFromPreviousItemBottomPosition, _numOfItems, setContainerSize, updateMoreInfo});
// 	cbCalculateAndCacheItemPosition.fn = calculateAndCacheItemPosition;

// 	// getDerivedStateFromProps
// 	useLayoutEffect(() => {
// 		const
// 			{prevChildProps, prevFirstIndex} = variables.current,
// 			shouldInvalidate = (
// 				prevFirstIndex === firstIndex ||
// 				prevChildProps !== props.childProps	// TODO : Reconsider this comparison is actually meaningful.
// 			),
// 			diff = firstIndex - prevFirstIndex,
// 			newUpdateTo = (-_numOfItems >= diff || diff > 0 || shouldInvalidate) ? firstIndex + _numOfItems : prevFirstIndex,
// 			newUpdateFrom = (0 >= diff || diff >= _numOfItems || shouldInvalidate) ? firstIndex : prevFirstIndex + _numOfItems;

// 		if (updateFromTo.from !== newUpdateFrom || updateFromTo.to !== newUpdateTo) {
// 			setUpdateFromTo({from: newUpdateFrom, to: newUpdateTo});
// 		}
// 		variables.current.prevChildProps = props.childProps;
// 		variables.current.prevFirstIndex = firstIndex;
// 	}, [firstIndex, _numOfItems, props.childProps, updateFromTo]);

// 	const emitUpdateItems = useCallback(() => {
// 		const {dataSize} = props;

// 		forward('onUpdateItems', {
// 			firstIndex: firstIndex,
// 			lastIndex: Math.min(firstIndex + _numOfItems, dataSize)
// 		}, props);
// 	}, [props, firstIndex, _numOfItems]);

// 	// Calculate metrics for VirtualList after the 1st render to know client W/H.
// 	useEffect(() => {
// 		if (!props.clientSize) {
// 			calculateMetrics(props);
// 			setStatesAndUpdateBounds();
// 		} else {
// 			emitUpdateItems();
// 		}

// 		if (props.itemSizes) {
// 			adjustItemPositionWithItemSize();
// 		} else {
// 			setContainerSize();
// 		}
// 	}, []);

// 	useEffect(() => {
// 		if (variables.current.prevState.firstIndex !== firstIndex || variables.current.prevState._numOfItems !== _numOfItems) {
// 			emitUpdateItems();
// 		}
// 	}, [firstIndex, _numOfItems, emitUpdateItems, variables.current.prevState.firstIndex, variables.current.prevState._numOfItems]); // eslint-disable-line react-hooks/exhaustive-deps

// 	useEffect(() => {
// 		variables.current.deferScrollTo = false;

// 		variables.current.shouldUpdateBounds = false;

// 		// When an item expands or shrinks,
// 		// we need to calculate the item position again and
// 		// the item needs to scroll into view if the item does not show fully.
// 		if (props.itemSizes) {
// 			if (variables.current.itemPositions.length > props.itemSizes.length) {
// 				// The item with `props.itemSizes.length` index is not rendered yet.
// 				// So the item could scroll into view after it rendered.
// 				// To do it, `props.itemSizes.length` value is cached in `indexToScrollIntoView`.
// 				variables.current.indexToScrollIntoView = props.itemSizes.length;

// 				variables.current.itemPositions = [...variables.current.itemPositions.slice(0, props.itemSizes.length)];
// 				adjustItemPositionWithItemSize();
// 			} else {
// 				const {indexToScrollIntoView} = variables.current;

// 				adjustItemPositionWithItemSize();

// 				if (indexToScrollIntoView !== -1) {
// 					// Currently we support expandable items in only vertical VirtualList.
// 					// So the top and bottom of the boundaries are checked.
// 					const
// 						scrollBounds = {top: variables.current._scrollPosition, bottom: variables.current._scrollPosition + variables.current.scrollBounds.clientHeight},
// 						itemBounds = {top: getGridPosition(indexToScrollIntoView).primaryPosition, bottom: getItemBottomPosition(indexToScrollIntoView)};

// 					if (itemBounds.top < scrollBounds.top) {
// 						props.cbScrollTo({
// 							index: indexToScrollIntoView,
// 							stickTo: 'start',
// 							animate: true
// 						});
// 					} else if (itemBounds.bottom > scrollBounds.bottom) {
// 						props.cbScrollTo({
// 							index: indexToScrollIntoView,
// 							stickTo: 'end',
// 							animate: true
// 						});
// 					}
// 				}

// 				variables.current.indexToScrollIntoView = -1;
// 			}
// 		}
// 	});

// 	useEffect(() => {
// 		const {prevProps} = variables.current;

// 		if (
// 			prevProps.direction !== props.direction ||
// 			prevProps.overhang !== props.overhang ||
// 			prevProps.spacing !== props.spacing ||
// 			!equals(prevProps.itemSize, props.itemSize)
// 		) {
// 			const {x, y} = getXY(variables.current._scrollPosition, 0);

// 			calculateMetrics(props);
// 			setStatesAndUpdateBounds();

// 			setContainerSize();

// 			const {clientHeight, clientWidth, scrollHeight, scrollWidth} = variables.current.scrollBounds;
// 			const xMax = scrollWidth - clientWidth;
// 			const yMax = scrollHeight - clientHeight;

// 			updateScrollPosition({
// 				x: xMax > x ? x : xMax,
// 				y: yMax > y ? y : yMax
// 			});

// 			variables.current.deferScrollTo = true;
// 		}
// 	});
// 	// TODO: Origin def = [props.direction, props.overhang, props.spacing, props.itemSize]
// 	// This part made bug that initial rendering is not done util scroll (ahn)

// 	useEffect(() => {
// 		// TODO: remove `_hasDataSizeChanged` and fix ui/Scrollable*
// 		variables.current._hasDataSizeChanged = (variables.current.prevProps.dataSize !== props.dataSize);

// 		if (!variables.current.deferScrollTo && variables.current._hasDataSizeChanged) {
// 			setStatesAndUpdateBounds();

// 			setContainerSize();

// 			variables.current.deferScrollTo = true;
// 		}
// 	}, [props.dataSize, setContainerSize, setStatesAndUpdateBounds, variables]);

// 	useEffect(() => {
// 		// else if (prevProps.rtl !== this.props.rtl)
// 		if (!variables.current.deferScrollTo) {
// 			updateScrollPosition(getXY(variables.current._scrollPosition, 0));
// 		}
// 	}, [getXY, props.rtl, updateScrollPosition]);

// 	useEffect(() => {
// 		const scrollBounds = getScrollBounds();
// 		const maxPos = variables.current._isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft;

// 		if (!variables.current.deferScroll && variables.current._scrollPosition > maxPos) {
// 			props.cbScrollTo({position: (variables.current._isPrimaryDirectionVertical) ? {y: maxPos} : {x: maxPos}, animate: false});
// 		}
// 	});

// 	// setUiChildAdapter

// 	const adapter = {
// 		calculateMetrics,
// 		didScroll,
// 		get _dimensionToExtent () {
// 			return variables.current._dimensionToExtent;
// 		},
// 		getGridPosition,
// 		getItemBottomPosition,
// 		getItemNode,
// 		getItemPosition,
// 		getMoreInfo,
// 		getScrollBounds,
// 		gridPositionToItemPosition,
// 		get _hasDataSizeChanged () {
// 			return variables.current._hasDataSizeChanged;
// 		},
// 		isHorizontal,
// 		get _isPrimaryDirectionVertical () {
// 			return variables.current._isPrimaryDirectionVertical;
// 		},
// 		isVertical,
// 		get itemPositions () {
// 			return variables.current.itemPositions;
// 		},
// 		get _numOfItems () {
// 			return _numOfItems;
// 		},
// 		get _primary () {
// 			return variables.current._primary;
// 		},
// 		props,
// 		get _scrollPosition () {
// 			return variables.current._scrollPosition;
// 		},
// 		get _scrollPositionTarget () {
// 			return variables.current._scrollPositionTarget;
// 		},
// 		scrollToPosition,
// 		setScrollPosition,
// 		syncClientSize
// 	};
// 	useEffect(() => {
// 		props.setUiChildAdapter(adapter);
// 	}, [adapter, props]);

// 	// Functions

// 	function isVertical () {
// 		return variables.current._isPrimaryDirectionVertical;
// 	}

// 	function isHorizontal () {
// 		return !variables.current._isPrimaryDirectionVertical;
// 	}

// 	function getItemNode (index) {
// 		const ref = itemContainerRef.current;

// 		return ref ? ref.children[index % _numOfItems] : null;
// 	}

// 	// Render

// 	const
// 		{className, 'data-webos-voice-focused': voiceFocused, 'data-webos-voice-group-label': voiceGroupLabel, 'data-webos-voice-disabled': voiceDisabled, itemsRenderer, style, ...rest} = props,
// 		containerClasses = classNames(
// 			css.virtualList,
// 			(type === 'Native') ? (variables.current._isPrimaryDirectionVertical && css.vertical || css.horizontal) : null,
// 			className
// 		),
// 		contentClasses = (type === 'Native') ? null : css.content;

// 	delete rest.cbScrollTo;
// 	delete rest.childProps;
// 	delete rest.clientSize;
// 	delete rest.dangerouslyContainsInScrollable;
// 	delete rest.dataSize;
// 	delete rest.direction;
// 	delete rest.getComponentProps;
// 	delete rest.isHorizontalScrollbarVisible;
// 	delete rest.isVerticalScrollbarVisible;
// 	delete rest.itemRenderer;
// 	delete rest.itemSize;
// 	delete rest.itemSizes;
// 	delete rest.onUpdate;
// 	delete rest.onUpdateItems;
// 	delete rest.overhang;
// 	delete rest.pageScroll;
// 	delete rest.rtl;
// 	delete rest.setChildAdapter;
// 	delete rest.setUiChildAdapter;
// 	delete rest.spacing;
// 	delete rest.uiChildAdapter;
// 	delete rest.uiChildContainerRef;
// 	delete rest.updateStatesAndBounds;

// 	if (variables.current._primary) {
// 		positionItems();
// 	}

// 	variables.current.prevProps = {
// 		dataSize: props.dataSize,
// 		direction: props.direction,
// 		overhang: props.overhang,
// 		spacing: props.spacing,
// 		itemSize: props.itemSize,
// 		rtl: props.rtl
// 	};

// 	variables.current.prevState = {
// 		updateFromTo: {...updateFromTo},
// 		firstIndex,
// 		_numOfItems
// 	};

// 	return (
// 		<div className={containerClasses} data-webos-voice-focused={voiceFocused} data-webos-voice-group-label={voiceGroupLabel} data-webos-voice-disabled={voiceDisabled} ref={uiChildContainerRef} style={style}>
// 			<div {...rest} className={contentClasses} ref={contentRef}>
// 				{itemsRenderer({cc: variables.current.cc, itemContainerRef, _primary: variables.current._primary})}
// 			</div>
// 		</div>
// 	);
// };

/**
 * A basic base component for
 * [VirtualList]{@link ui/VirtualList.VirtualList} and [VirtualGridList]{@link ui/VirtualList.VirtualGridList}.
 *
 * @class VirtualListBase
 * @memberof ui/VirtualList
 * @ui
 * @public
 */
VirtualListBase.displayName = 'ui:VirtualListBase';

VirtualListBase.propTypes = /** @lends ui/VirtualList.VirtualListBase.prototype */ {
	/**
	 * The rendering function called for each item in the list.
	 *
	 * > **Note**: The list does **not** always render a component whenever its render function is called
	 * due to performance optimization.
	 *
	 * Example:
	 * ```
	 * renderItem = ({index, ...rest}) => {
	 * 	delete rest.data;
	 *
	 * 	return (
	 * 		<MyComponent index={index} {...rest} />
	 * 	);
	 * }
	 * ```
	 *
	 * @type {Function}
	 * @param {Object}	 event
	 * @param {Number}	 event.data-index	It is required for `Spotlight` 5-way navigation. Pass to the root element in the component.
	 * @param {Number}	 event.index	The index number of the component to render
	 * @param {Number}	 event.key	It MUST be passed as a prop to the root element in the component for DOM recycling.
	 *
	 * @required
	 * @public
	 */
	itemRenderer: PropTypes.func.isRequired,

	/**
	 * The size of an item for the list; valid values are either a number for `VirtualList`
	 * or an object that has `minWidth` and `minHeight` for `VirtualGridList`.
	 *
	 * @type {Number|ui/VirtualList.gridListItemSizeShape}
	 * @required
	 * @private
	 */
	itemSize: PropTypes.oneOfType([
		gridListItemSizeShape,
		PropTypes.number
	]).isRequired,

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
	 * Additional props included in the object passed to the `itemsRenderer` callback.
	 *
	 * @type {Object}
	 * @public
	 */
	childProps: PropTypes.object,

	/**
	 * Client size of the list; valid values are an object that has `clientWidth` and `clientHeight`.
	 *
	 * @type {Object}
	 * @property {Number}	clientHeight	The client height of the list.
	 * @property {Number}	clientWidth	The client width of the list.
	 * @public
	 */
	clientSize: PropTypes.shape({
		clientHeight: PropTypes.number.isRequired,
		clientWidth: PropTypes.number.isRequired
	}),

	/**
	 * Disable voice control feature of component.
	 *
	 * @type {Boolean}
	 * @public
	 */
	'data-webos-voice-disabled': PropTypes.bool,

	/**
	 * Activates the component for voice control.
	 *
	 * @type {Boolean}
	 * @public
	 */
	'data-webos-voice-focused': PropTypes.bool,

	/**
	 * The voice control group label.
	 *
	 * @type {String}
	 * @public
	 */
	'data-webos-voice-group-label': PropTypes.string,

	/**
	 * The number of items of data the list contains.
	 *
	 * @type {Number}
	 * @default 0
	 * @public
	 */
	dataSize: PropTypes.number,

	/**
	 * The layout direction of the list.
	 *
	 * Valid values are:
	 * * `'horizontal'`, and
	 * * `'vertical'`.
	 *
	 * @type {String}
	 * @default 'vertical'
	 * @public
	 */
	direction: PropTypes.oneOf(['horizontal', 'vertical']),

	/**
	 * Called to get the props for list items.
	 *
	 * @type {Function}
	 * @private
	 */
	getComponentProps: PropTypes.func,

	/**
	 * The array for individually sized items.
	 *
	 * @type {Number[]}
	 * @private
	 */
	itemSizes: PropTypes.arrayOf(PropTypes.number),

	/**
	 * Called when the range of items has updated.
	 *
	 * Event payload includes the `firstIndex` and `lastIndex` of the list.
	 *
	 * @type {Function}
	 * @private
	 */
	onUpdateItems: PropTypes.func,

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
	 * When `true`, the list will scroll by page. Otherwise the list will scroll by item.
	 *
	 * @type {Boolean}
	 * @default false
	 * @private
	 */
	pageScroll: PropTypes.bool,

	/**
	 * `true` if RTL, `false` if LTR.
	 *
	 * @type {Boolean}
	 * @private
	 */
	rtl: PropTypes.bool,

	/**
	 * The spacing between items.
	 *
	 * @type {Number}
	 * @default 0
	 * @public
	 */
	spacing: PropTypes.number,

	/**
	 * TBD
	 */
	type: PropTypes.string,

	uiChildContainerRef: PropTypes.object,

	/**
	 * Called to execute additional logic in a themed component when updating states and bounds.
	 *
	 * @type {Function}
	 * @private
	 */
	updateStatesAndBounds: PropTypes.func
};

VirtualListBase.defaultProps = {
	cbScrollTo: nop,
	dataSize: 0,
	direction: 'vertical',
	overhang: 3,
	pageScroll: false,
	spacing: 0,
	type: 'JS'
};

/**
 * A callback function that receives a reference to the `scrollTo` feature.
 *
 * Once received, the `scrollTo` method can be called as an imperative interface.
 *
 * The `scrollTo` function accepts the following parameters:
 * - {position: {x, y}} - Pixel value for x and/or y position
 * - {align} - Where the scroll area should be aligned. Values are:
 *   `'left'`, `'right'`, `'top'`, `'bottom'`,
 *   `'topleft'`, `'topright'`, `'bottomleft'`, and `'bottomright'`.
 * - {index} - Index of specific item. (`0` or positive integer)
 *   This option is available for only `VirtualList` kind.
 * - {node} - Node to scroll into view
 * - {animate} - When `true`, scroll occurs with animation. When `false`, no
 *   animation occurs.
 * - {focus} - When `true`, attempts to focus item after scroll. Only valid when scrolling
 *   by `index` or `node`.
 * > Note: Only specify one of: `position`, `align`, `index` or `node`
 *
 * Example:
 * ```
 *	// If you set cbScrollTo prop like below;
 *	cbScrollTo: (fn) => {this.scrollTo = fn;}
 *	// You can simply call like below;
 *	this.scrollTo({align: 'top'}); // scroll to the top
 * ```
 *
 * @name cbScrollTo
 * @memberof ui/VirtualList.VirtualListBase.prototype
 * @type {Function}
 * @public
 */

/**
 * Specifies how to show horizontal scrollbar.
 *
 * Valid values are:
 * * `'auto'`,
 * * `'visible'`, and
 * * `'hidden'`.
 *
 * @name horizontalScrollbar
 * @memberof ui/VirtualList.VirtualListBase.prototype
 * @type {String}
 * @default 'auto'
 * @public
 */

/**
 * Prevents scroll by wheeling on the list.
 *
 * @name noScrollByWheel
 * @memberof ui/VirtualList.VirtualListBase.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

/**
 * Called when scrolling.
 *
 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`.
 * It is not recommended to set this prop since it can cause performance degradation.
 * Use `onScrollStart` or `onScrollStop` instead.
 *
 * @name onScroll
 * @memberof ui/VirtualList.VirtualListBase.prototype
 * @type {Function}
 * @param {Object} event
 * @param {Number} event.scrollLeft Scroll left value.
 * @param {Number} event.scrollTop Scroll top value.
 * @param {Object} event.moreInfo The object including `firstVisibleIndex` and `lastVisibleIndex` properties.
 * @public
 */

/**
 * Called when scroll starts.
 *
 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`.
 * You can get firstVisibleIndex and lastVisibleIndex from VirtualList with `moreInfo`.
 *
 * Example:
 * ```
 * onScrollStart = ({scrollLeft, scrollTop, moreInfo}) => {
 *     const {firstVisibleIndex, lastVisibleIndex} = moreInfo;
 *     // do something with firstVisibleIndex and lastVisibleIndex
 * }
 *
 * render = () => (
 *	 <VirtualList
 *		 ...
 *		 onScrollStart={this.onScrollStart}
 *		 ...
 *	 />
 * )
 * ```
 *
 * @name onScrollStart
 * @memberof ui/VirtualList.VirtualListBase.prototype
 * @type {Function}
 * @param {Object} event
 * @param {Number} event.scrollLeft Scroll left value.
 * @param {Number} event.scrollTop Scroll top value.
 * @param {Object} event.moreInfo The object including `firstVisibleIndex` and `lastVisibleIndex` properties.
 * @public
 */

/**
 * Called when scroll stops.
 *
 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`.
 * You can get firstVisibleIndex and lastVisibleIndex from VirtualList with `moreInfo`.
 *
 * Example:
 * ```
 * onScrollStop = ({scrollLeft, scrollTop, moreInfo}) => {
 *	 const {firstVisibleIndex, lastVisibleIndex} = moreInfo;
 *	 // do something with firstVisibleIndex and lastVisibleIndex
 * }
 *
 * render = () => (
 *	 <VirtualList
 *		 ...
 *		 onScrollStop={this.onScrollStop}
 *		 ...
 *	 />
 * )
 * ```
 *
 * @name onScrollStop
 * @memberof ui/VirtualList.VirtualListBase.prototype
 * @type {Function}
 * @param {Object} event
 * @param {Number} event.scrollLeft Scroll left value.
 * @param {Number} event.scrollTop Scroll top value.
 * @param {Object} event.moreInfo The object including `firstVisibleIndex` and `lastVisibleIndex` properties.
 * @public
 */

/**
 * Specifies how to show vertical scrollbar.
 *
 * Valid values are:
 * * `'auto'`,
 * * `'visible'`, and
 * * `'hidden'`.
 *
 * @name verticalScrollbar
 * @memberof ui/VirtualList.VirtualListBase.prototype
 * @type {String}
 * @default 'auto'
 * @public
 */

export default VirtualListBase;
export {
	gridListItemSizeShape,
	itemSizesShape,
	VirtualListBase
};
