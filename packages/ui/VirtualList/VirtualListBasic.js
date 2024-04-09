import classNames from 'classnames';
import EnactPropTypes from '@enact/core/internal/prop-types';
import {forward} from '@enact/core/handle';
import {platform} from '@enact/core/platform';
import {clamp, Job} from '@enact/core/util';
import PropTypes from 'prop-types';
import equals from 'ramda/src/equals';
import {createRef, Component} from 'react';

import {utilDOM} from '../useScroll/utilDOM';

import css from './VirtualList.module.less';

const nop = () => {};

/**
 * The shape for the grid list item size
 * in a list for {@link ui/VirtualList.VirtualGridList|VirtualGridList}.
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
 * in a list for {@link ui/VirtualList.VirtualList|VirtualList}.
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
 * A basic base component for
 * {@link ui/VirtualList.VirtualList|VirtualList} and {@link ui/VirtualList.VirtualGridList|VirtualGridList}.
 *
 * @class VirtualListBasic
 * @memberof ui/VirtualList
 * @ui
 * @public
 */
class VirtualListBasic extends Component {
	displayName = 'ui:VirtualListBasic';

	static propTypes = /** @lends ui/VirtualList.VirtualListBasic.prototype */ {
		/**
		 * The rendering function called for each item in the list.
		 *
		 * > **Note**: The list does **not** always render a component whenever its render function is called
		 * due to performance optimization.
		 *
		 * Example:
		 * ```
		 * renderItem = ({index, ...rest}) => {
		 *
		 * 	return (
		 * 		<MyComponent index={index} {...rest} />
		 * 	);
		 * }
		 * ```
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @param {Number} event.data-index It is required for `Spotlight` 5-way navigation. Pass to the root element in the component.
		 * @param {Number} event.index The index number of the component to render
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
		 * Callback method of scrollTo.
		 * Normally, useScroll should set this value.
		 *
		 * @type {Function}
		 * @private
		 */
		cbScrollTo: PropTypes.func,

		/**
		 * Additional props included in the object passed to the `itemRenderer` callback.
		 *
		 * @type {Object}
		 * @public
		 */
		childProps: PropTypes.object,

		/**
		 * Client size of the list; valid values are an object that has `clientWidth` and `clientHeight`.
		 *
		 * @type {Object}
		 * @property {Number} clientHeight The client height of the list.
		 * @property {Number} clientWidth The client width of the list.
		 * @public
		 */
		clientSize: PropTypes.shape({
			clientHeight: PropTypes.number.isRequired,
			clientWidth: PropTypes.number.isRequired
		}),

		/**
		 * An object with properties to be passed to the container DOM.
		 *
		 * @type {Object}
		 * @private
		 */
		containerProps: PropTypes.object,

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
		 * The editable feature of the list.
		 *
		 * @type {Object}
		 * @property {Function} onComplete The callback function called when editing is finished.
		 *  It has an event object contains `orders` array which app can use for repopulate items.
		 * @property {Object} [css] Customizes the component by mapping the supplied CSS class name to the
		 *  corresponding internal element.
		 *  The following class is supported:
		 *
		 * * `selected` - The selected item class
		 * @private
		 */
		editable: PropTypes.shape({
			onComplete: PropTypes.func.isRequired,
			css: PropTypes.object
		}),

		/**
		 * Called to get the scroll affordance from themed component.
		 *
		 * @type {Function}
		 * @private
		 */
		getAffordance: PropTypes.func,

		/**
		 * Called to get the props for list items.
		 *
		 * @type {Function}
		 * @private
		 */
		getComponentProps: PropTypes.func,

		/**
		 * Ref for items
		 *
		 * @type {Object}
		 * @private
		 */
		itemRefs: PropTypes.object,

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
		 * The render function for the placeholder elements.
		 *
		 * @type {Function}
		 * @required
		 * @private
		 */
		placeholderRenderer: PropTypes.func,

		/**
		 * The ARIA role for the list.
		 *
		 * @type {String}
		 * @default 'list'
		 * @public
		 */
		role: PropTypes.string,

		/**
		 * `true` if RTL, `false` if LTR.
		 *
		 * @type {Boolean}
		 * @private
		 */
		rtl: PropTypes.bool,

		/**
		 * Ref for scroll content
		 *
		 * @type {Object|Function}}
		 * @private
		 */
		scrollContentRef: EnactPropTypes.ref,

		/**
		 * Specifies how to scroll.
		 *
		 * Valid values are:
		 * * `'translate'`,
		 * * `'native'`.
		 *
		 * @type {String}
		 * @default 'translate'
		 * @public
		 */
		scrollMode: PropTypes.string,

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
	};

	static defaultProps = {
		cbScrollTo: nop,
		dataSize: 0,
		direction: 'vertical',
		getAffordance: () => (0),
		overhang: 3,
		pageScroll: false,
		scrollMode: 'translate',
		spacing: 0
	};

	constructor (props) {
		super(props);

		this.contentRef = createRef();
		this.itemContainerRefs = [];

		this.state = {
			firstIndex: 0,
			numOfItems: 0,
			prevChildProps: null,
			prevFirstIndex: 0,
			updateFrom: 0,
			updateTo: 0
		};

		if (props.clientSize) {
			this.calculateMetrics(props);
			Object.assign(this.state, this.getStatesAndUpdateBounds(props));
		}
	}

	static getDerivedStateFromProps (props, state) {
		const
			shouldInvalidate = (
				state.prevFirstIndex === state.firstIndex ||
				state.prevChildProps !== props.childProps
			),
			diff = state.firstIndex - state.prevFirstIndex,
			updateTo = (-state.numOfItems >= diff || diff > 0 || shouldInvalidate) ? state.firstIndex + state.numOfItems : state.prevFirstIndex,
			updateFrom = (0 >= diff || diff >= state.numOfItems || shouldInvalidate) ? state.firstIndex : state.prevFirstIndex + state.numOfItems,
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
			this.setState(this.getStatesAndUpdateBounds(this.props));
		} else {
			this.emitUpdateItems();
		}

		if (this.props.itemSizes) {
			this.adjustItemPositionWithItemSize();
		} else {
			this.setContainerSize();
		}

		if (this.props.editable) {
			this.featureEditable.enable();
		}
	}

	componentDidUpdate (prevProps, prevState) {
		let deferScrollTo = false;
		const {firstIndex, numOfItems} = this.state;

		this.shouldUpdateBounds = false;

		// TODO: remove `this.hasDataSizeChanged` and fix useScroll
		this.hasDataSizeChanged = (prevProps.dataSize !== this.props.dataSize);

		if (prevState.firstIndex !== firstIndex || prevState.numOfItems !== numOfItems) {
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
						scrollBounds = {top: this.scrollPosition, bottom: this.scrollPosition + this.scrollBounds.clientHeight},
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

			this.featureEditable.editingCancel();
		}

		if (
			prevProps.direction !== this.props.direction ||
			prevProps.overhang !== this.props.overhang ||
			prevProps.spacing !== this.props.spacing ||
			!equals(prevProps.itemSize, this.props.itemSize)
		) {
			const {x, y} = this.getXY(this.scrollPosition, 0);

			this.calculateMetrics(this.props);
			this.setState(this.getStatesAndUpdateBounds(this.props));
			this.setContainerSize();

			const {clientHeight, clientWidth, scrollHeight, scrollWidth} = this.scrollBounds;
			const xMax = scrollWidth - clientWidth;
			const yMax = scrollHeight - clientHeight;

			this.updateScrollPosition({
				x: xMax > x ? x : xMax,
				y: yMax > y ? y : yMax
			}, 'instant');

			deferScrollTo = true;

			this.featureEditable.editingCancel();
		} else if (this.hasDataSizeChanged) {
			const newState = this.getStatesAndUpdateBounds(this.props, this.state.firstIndex);
			this.setState(newState);
			this.setContainerSize();

			deferScrollTo = true;
		} else if (prevProps.rtl !== this.props.rtl) {
			this.updateScrollPosition(this.getXY(this.scrollPosition, 0), 'instant');
		}

		const maxPos = this.isPrimaryDirectionVertical ? this.scrollBounds.maxTop : this.scrollBounds.maxLeft;
		let currentPos = this.scrollPosition;

		if (this.props.scrollMode === 'native' && this.scrollToPositionTarget >= 0) {
			currentPos = this.scrollToPositionTarget;
		}

		if (!deferScrollTo && currentPos > maxPos) {
			this.props.cbScrollTo({position: (this.isPrimaryDirectionVertical) ? {y: maxPos} : {x: maxPos}, animate: false});
			this.scrollToPositionTarget = -1;
		}
	}

	componentWillUnmount () {
		this.featureEditable.disable();
	}

	scrollBounds = {
		clientWidth: 0,
		clientHeight: 0,
		scrollWidth: 0,
		scrollHeight: 0,
		maxLeft: 0,
		maxTop: 0
	};

	moreInfo = {
		firstVisibleIndex: null,
		lastVisibleIndex: null
	};

	primary = null;
	secondary = null;

	isPrimaryDirectionVertical = true;
	isItemSized = false;

	shouldUpdateBounds = false;

	dimensionToExtent = 0;
	threshold = 0;
	maxFirstIndex = 0;
	curDataSize = 0;
	hasDataSizeChanged = false;
	cc = [];
	scrollPosition = 0;
	scrollPositionTarget = 0;
	scrollToPositionTarget = -1;

	// For individually sized item
	itemPositions = [];
	indexToScrollIntoView = -1;

	updateScrollPosition = ({x, y}, behavior) => {
		if (this.props.scrollMode === 'native') {
			this.scrollToPosition(x, y, behavior);
		} else {
			this.setScrollPositionTarget (x, y);
			this.setScrollPosition(x, y);
		}
	};

	isVertical = () => this.isPrimaryDirectionVertical;

	isHorizontal = () => !this.isPrimaryDirectionVertical;

	getScrollBounds = () => this.scrollBounds;

	getMoreInfo = () => this.moreInfo;

	getCenterItemIndexFromScrollPosition = (scrollPosition) => Math.floor((scrollPosition + (this.primary.clientSize / 2)) / this.primary.gridSize) * this.dimensionToExtent + Math.floor(this.dimensionToExtent / 2);

	getGridPosition = (index) => {
		const
			{dataSize, itemSizes} = this.props,
			{dimensionToExtent, itemPositions, primary, secondary} = this,
			secondaryPosition = (index % dimensionToExtent) * secondary.gridSize,
			extent = Math.floor(index / dimensionToExtent);
		let primaryPosition;

		if (itemSizes && typeof itemSizes[index] !== 'undefined' && dataSize > index) {
			const firstIndexInExtent = extent * dimensionToExtent;

			if (!itemPositions[firstIndexInExtent]) {
				// Cache individually sized item positions
				for (let i = itemPositions.length; i <= index; i++) {
					this.calculateAndCacheItemPosition(i);
				}
			}

			if (itemPositions[firstIndexInExtent]) {
				primaryPosition = itemPositions[firstIndexInExtent].position;
			} else {
				primaryPosition = extent * primary.gridSize;
			}
		} else {
			primaryPosition = extent * primary.gridSize;
		}

		return {primaryPosition, secondaryPosition};
	};

	// For individually sized item
	getItemBottomPosition = (index) => {
		const
			itemPosition = this.itemPositions[index],
			itemSize = this.props.itemSizes[index];

		if (itemPosition && (itemSize || itemSize === 0)) {
			return itemPosition.position + itemSize;
		} else {
			return index * this.primary.gridSize - this.props.spacing;
		}
	};

	// For individually sized item
	getItemTopPositionFromPreviousItemBottomPosition = (index, spacing) => {
		return index === 0 ? 0 : this.getItemBottomPosition(index - 1) + spacing;
	};

	getItemPosition = (index, stickTo = 'start', optionalOffset = 0, disallowNegativeOffset = false) => {
		const {isPrimaryDirectionVertical, primary, scrollBounds} = this;
		const maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft;
		const position = this.getGridPosition(index);
		let offset = 0;

		if (stickTo === 'start') {         // 'start'
			offset = optionalOffset;
		} else if (this.props.itemSizes) { // 'end' for different item sizes
			offset = primary.clientSize - this.props.itemSizes[index] - optionalOffset;
		} else if (stickTo === 'center') { // 'center'
			offset = (primary.clientSize / 2) - (primary.gridSize / 2) - optionalOffset;
		} else {                           // 'end' for same item sizes
			offset = primary.clientSize - primary.itemSize - optionalOffset;
		}

		/* istanbul ignore next */
		if (disallowNegativeOffset) {
			offset = Math.max(0, offset);
		}

		position.primaryPosition = clamp(0, maxPos, position.primaryPosition - offset);

		return this.gridPositionToItemPosition(position);
	};

	gridPositionToItemPosition = ({primaryPosition, secondaryPosition}) =>
		(this.isPrimaryDirectionVertical ? {left: secondaryPosition, top: primaryPosition} : {left: primaryPosition, top: secondaryPosition});

	getXY = (primaryPosition, secondaryPosition) => (this.isPrimaryDirectionVertical ? {x: secondaryPosition, y: primaryPosition} : {x: primaryPosition, y: secondaryPosition});

	getClientSize = (node) => ({
		clientWidth: node.clientWidth,
		clientHeight: node.clientHeight
	});

	emitUpdateItems () {
		const {dataSize} = this.props;
		const {firstIndex, numOfItems} = this.state;

		forward('onUpdateItems', {
			firstIndex: firstIndex,
			lastIndex: Math.min(firstIndex + numOfItems, dataSize)
		}, this.props);
	}

	calculateMetrics (props) {
		const
			{clientSize, direction, itemSize, overhang, scrollMode, spacing} = props,
			node = this.props.scrollContentRef.current;

		if (!clientSize && !node) {
			return;
		}

		const
			{clientWidth, clientHeight} = clientSize || this.getClientSize(node),
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
		thresholdBase = primary.gridSize * Math.ceil(overhang / 2);

		this.threshold = {min: -Infinity, max: thresholdBase, base: thresholdBase};
		this.dimensionToExtent = dimensionToExtent;

		this.primary = primary;
		this.secondary = secondary;

		// reset
		this.scrollPosition = 0;
		this.scrollToPositionTarget = -1;
		if (scrollMode === 'translate' && this.contentRef.current) {
			this.contentRef.current.style.transform = null;
		} else if (scrollMode === 'native' && node) {
			this.updateScrollPosition(this.getXY(this.scrollPosition, 0), 'instant');
		}
	}

	getStatesAndUpdateBounds = (props, firstIndex = 0) => {
		const
			{dataSize, overhang, updateStatesAndBounds} = props,
			{dimensionToExtent, primary, moreInfo, scrollPosition} = this,
			numOfItems = Math.min(dataSize, dimensionToExtent * (Math.ceil(primary.clientSize / primary.gridSize) + overhang)),
			wasFirstIndexMax = ((this.maxFirstIndex < moreInfo.firstVisibleIndex - dimensionToExtent) && (firstIndex === this.maxFirstIndex)),
			dataSizeDiff = dataSize - this.curDataSize;
		let newFirstIndex = firstIndex;

		// When calling setState() except in didScroll(), `shouldUpdateBounds` should be `true`
		// so that setState() in didScroll() could be called to override state.
		// Before calling setState() except in didScroll(), getStatesAndUpdateBounds() is always called.
		// So `shouldUpdateBounds` is true here.
		this.shouldUpdateBounds = true;

		this.maxFirstIndex = Math.ceil((dataSize - numOfItems) / dimensionToExtent) * dimensionToExtent;
		this.curDataSize = dataSize;

		// reset children
		this.cc = [];
		this.itemPositions = []; // For individually sized item
		this.calculateScrollBounds(props);
		this.updateMoreInfo(dataSize, scrollPosition);

		if (!(updateStatesAndBounds && updateStatesAndBounds({
			cbScrollTo: props.cbScrollTo,
			numOfItems,
			dataSize,
			moreInfo
		}))) {
			newFirstIndex = this.calculateFirstIndex(props, wasFirstIndexMax, dataSizeDiff, firstIndex);
		}

		return {
			firstIndex: Math.min(newFirstIndex, this.maxFirstIndex),
			numOfItems: numOfItems
		};
	};

	calculateFirstIndex (props, wasFirstIndexMax, dataSizeDiff, firstIndex) {
		const
			{overhang} = props,
			{dimensionToExtent, isPrimaryDirectionVertical, maxFirstIndex, primary, scrollBounds, scrollPosition, threshold} = this,
			{gridSize} = primary;
		let newFirstIndex = firstIndex;

		if (wasFirstIndexMax && dataSizeDiff > 0) { // If dataSize increased from bottom, we need adjust firstIndex
			// If this is a gridlist and dataSizeDiff is smaller than 1 line, we are adjusting firstIndex without threshold change.
			if (dimensionToExtent > 1 && dataSizeDiff < dimensionToExtent) {
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
			node = this.props.scrollContentRef.current;

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
	}

	setContainerSize = () => {
		if (this.contentRef.current) {
			this.contentRef.current.style.width = this.scrollBounds.scrollWidth + (this.isPrimaryDirectionVertical ? -1 : 0) + 'px';
			this.contentRef.current.style.height = this.scrollBounds.scrollHeight + (this.isPrimaryDirectionVertical ? 0 : -1) + 'px';
		}
	};

	updateMoreInfo (dataSize, primaryPosition) {
		const
			{dimensionToExtent, moreInfo} = this,
			{itemSize, gridSize, clientSize} = this.primary;

		if (dataSize <= 0) {
			moreInfo.firstVisibleIndex = null;
			moreInfo.lastVisibleIndex = null;
		} else if (this.props.itemSizes) {
			const {firstIndex, numOfItems} = this.state;
			const {isPrimaryDirectionVertical, scrollBounds: {clientWidth, clientHeight}, scrollPosition} = this;
			const size = isPrimaryDirectionVertical ? clientHeight : clientWidth;

			let firstVisibleIndex = null, lastVisibleIndex = null;

			for (let i = firstIndex; i < firstIndex +  numOfItems; i++) {
				if (scrollPosition <= this.getItemBottomPosition(i)) {
					firstVisibleIndex = i;
					break;
				}
			}

			for (let i = firstIndex + numOfItems - 1; i >= firstIndex; i--) {
				if (scrollPosition + size >= this.getItemBottomPosition(i) - this.props.itemSizes[i]) {
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

	// scrollMode 'native' only
	getRtlPositionX = (x) => {
		if (this.props.rtl) {
			return (platform.chrome < 85) ? this.scrollBounds.maxLeft - x : -x;
		}
		return x;
	};

	// scrollMode 'native' only
	scrollToPosition (left, top, behavior) {
		if (this.props.scrollContentRef.current && this.props.scrollContentRef.current.scrollTo) {
			this.props.scrollContentRef.current.scrollTo({left: this.getRtlPositionX(left), top, behavior});
		}
	}

	// scrollMode 'native' only
	setScrollToPositionTarget (x, y) {
		if (this.isPrimaryDirectionVertical) {
			this.scrollToPositionTarget = y;
		} else {
			this.scrollToPositionTarget = x;
		}
	}

	// scrollMode 'translate' only
	setScrollPositionTarget (x, y) {
		// The `left`, `top` as parameters in scrollToPosition() are the position when stopping scrolling.
		// But the `x`, `y` as parameters in setScrollPosition() are the position between current position and the position stopping scrolling.
		// To know the position when stopping scrolling properly, `x` and `y` are passed and cached in `this.scrollPositionTarget`.
		if (this.isPrimaryDirectionVertical) {
			this.scrollPositionTarget = y;
		} else {
			this.scrollPositionTarget = x;
		}
	}

	// scrollMode 'translate' only
	setScrollPosition (x, y) {
		const rtl = this.props.rtl;
		if (this.contentRef.current) {
			this.contentRef.current.style.transform = `translate3d(${rtl ? x : -x}px, -${y}px, 0)`;
			this.didScroll(x, y);
		}
	}

	didScroll (x, y) {
		const
			{dataSize, spacing, itemSizes} = this.props,
			{firstIndex} = this.state,
			{isPrimaryDirectionVertical, threshold, dimensionToExtent, maxFirstIndex, scrollBounds, itemPositions} = this,
			{clientSize, gridSize} = this.primary,
			maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft;
		let newFirstIndex = firstIndex, index, pos, size, itemPosition;

		if (isPrimaryDirectionVertical) {
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
				for (index = 0; index < dataSize; index += dimensionToExtent) {
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
						newFirstIndex = firstRenderedIndex - overhangBefore * dimensionToExtent;
						newThresholdMin = itemPosition.position;
						newThresholdMax = newThresholdMin + size + spacing;
					} else {
						const diffToFirstIndex = Math.ceil((itemPosition.position - pos) / gridSize);
						newFirstIndex = firstRenderedIndex - (diffToFirstIndex + overhangBefore) * dimensionToExtent;
						newThresholdMin = itemPosition.position - diffToFirstIndex * gridSize;
						newThresholdMax = newThresholdMin + gridSize;
					}
				} else { // calculate the first index based on assuming that all items have minimal size
					const firstExtent = Math.max(
						0,
						Math.min(
							Math.floor(maxFirstIndex / dimensionToExtent),
							Math.floor((pos - gridSize * overhangBefore) / gridSize)
						)
					);

					newFirstIndex = firstExtent * dimensionToExtent;
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
							Math.floor(maxFirstIndex / dimensionToExtent),
							Math.floor((pos - gridSize * overhangBefore) / gridSize)
						)
					);

				newFirstIndex = firstExtent * dimensionToExtent;
				newThresholdMin = (firstExtent + overhangBefore) * gridSize;
				newThresholdMax = newThresholdMin + gridSize;
			}

			threshold.min = newFirstIndex === 0 ? -Infinity : newThresholdMin;
			threshold.max = newFirstIndex === maxFirstIndex ? Infinity : newThresholdMax;
		}

		this.syncThreshold(maxPos);
		this.scrollPosition = pos;
		this.updateMoreInfo(dataSize, pos);

		if (this.shouldUpdateBounds || firstIndex !== newFirstIndex) {
			this.setState({firstIndex: newFirstIndex});
		}

		if (this.featureEditable.enabled) {
			this.featureEditable.movingItemUpdate();
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
			{numOfItems} = this.state,
			{itemPositions} = this,
			childNode = this.itemContainerRefs[index % numOfItems];

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
			{firstIndex, numOfItems} = this.state,
			{isPrimaryDirectionVertical, itemPositions} = this,
			scrollBoundsDimension = isPrimaryDirectionVertical ? 'scrollHeight' : 'scrollWidth';

		if (itemPositions.length === dataSize) { // all item sizes are known
			this.scrollBounds[scrollBoundsDimension] =
				itemSizes.reduce((acc, cur) => acc + cur, 0) + (dataSize - 1) * spacing;
		} else {
			for (let index = firstIndex + numOfItems - 1; index < dataSize; index++) {
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
		if (this.cc.length) {
			const
				{dataSize} = this.props,
				{firstIndex, numOfItems} = this.state,
				lastIndex = firstIndex + numOfItems - 1;

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
			this.updateMoreInfo(dataSize, this.scrollPosition);
		}
	}

	composeStyle (width, height, primaryPosition, secondaryPosition) {
		const
			{x, y} = this.getXY(primaryPosition, secondaryPosition),
			style = {
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
			{childProps, itemRefs, itemRenderer, getComponentProps} = this.props,
			key = index % this.state.numOfItems,
			componentProps = getComponentProps && getComponentProps(index) || {},
			itemContainerRef = (ref) => {
				if (ref === null) {
					itemRefs.current[key] = ref;
				} else {
					const itemNode = ref.children[0];

					itemRefs.current[key] = (parseInt(itemNode.dataset.index) === index) ?
						itemNode :
						ref.querySelector(`[data-index="${index}"]`);

					this.itemContainerRefs[key] = ref;
				}
			};

		this.cc[key] = (
			<div className={css.listItem} key={key} ref={itemContainerRef} style={this.composeStyle(...rest)}>
				{itemRenderer({...childProps, ...componentProps, index})}
			</div>
		);
	};

	applyStyleToHideNode = (index) => {
		const
			{itemRefs} = this.props,
			key = index % this.state.numOfItems,
			itemContainerRef = () => (itemRefs.current[key] = null);

		this.cc[key] = <div key={key} ref={itemContainerRef} style={{display: 'none'}} />;
	};

	// Update 'position' and return 'indexInExtent' for the previous item of the item matching the given 'index'
	getPrevPosition (index, position, indexInExtent) {
		const {itemSizes} = this.props;
		const {dimensionToExtent, itemPositions, primary, secondary} = this;

		if (indexInExtent === 0) {
			if (itemSizes) {
				if (itemPositions[index - 1] || itemPositions[index - 1] === 0) {
					position.primaryPosition = itemPositions[index - 1].position;
				} else if (itemSizes[index]) {
					position.primaryPosition -= itemSizes[index] + this.props.spacing;
				} else {
					position.primaryPosition -= primary.gridSize;
				}
			} else {
				position.primaryPosition -= primary.gridSize;
			}
			position.secondaryPosition = 0;
			return dimensionToExtent - 1;
		} else {
			position.secondaryPosition += secondary.gridSize;
			return indexInExtent - 1;
		}
	}

	// Update 'position' and return 'indexInExtent' for the next item of the item matching the given 'index'
	getNextPosition (index, position, indexInExtent) {
		const {itemSizes} = this.props;
		const {dimensionToExtent, itemPositions, primary, secondary} = this;

		if (indexInExtent + 1 >= dimensionToExtent) {
			if (itemSizes) {
				if (itemPositions[index + 1] || itemPositions[index + 1] === 0) {
					position.primaryPosition = itemPositions[index + 1].position;
				} else if (itemSizes[index]) {
					position.primaryPosition += itemSizes[index] + this.props.spacing;
				} else {
					position.primaryPosition += primary.gridSize;
				}
			} else {
				position.primaryPosition += primary.gridSize;
			}
			position.secondaryPosition = 0;
			return 0;
		} else {
			position.secondaryPosition += secondary.gridSize;
			return indexInExtent + 1;
		}
	}

	// styles item to hide it, to animate it, or to make it normal during editing
	setItemContainerStyle (node, {action, position}) {
		if (node) {
			const style = node.style;
			switch (action) {
				case 'hide':
					style.opacity = 0;
					style.transition = null;
					break;
				case 'animate':
					style.opacity = null;
					style.transition = `transform ${this.featureEditable.transitionTime}`;
					break;
				case 'reset':
				default:
					style.opacity = null;
					style.transition = null;
					break;
			}
			if (position) {
				const {x, y} = this.getXY(position.primaryPosition, position.secondaryPosition);
				style.transform = `translate3d(${this.props.rtl ? -x : x}px, ${y}px, 0)`;
			}
		}
	}

	positionItems () {
		const
			{dataSize} = this.props,
			{firstIndex, numOfItems} = this.state,
			{cc, isPrimaryDirectionVertical, dimensionToExtent, primary, secondary} = this;
		const {enabled, editingMode, editingIndex, untrackedPointer} = this.featureEditable;
		const featureEditableEnabled = enabled && editingMode;
		let
			hideTo = 0,
			// During editing, all visible items should be calculated for relocation
			updateFrom = cc.length && !editingMode ? this.state.updateFrom : firstIndex,
			updateTo = cc.length && !editingMode ? this.state.updateTo : firstIndex + numOfItems;

		if (updateFrom >= updateTo) {
			return;
		} else if (updateTo > dataSize) {
			hideTo = updateTo;
			updateTo = dataSize;
		}

		let width = (isPrimaryDirectionVertical ? secondary.itemSize : primary.itemSize) + 'px';
		let height = (isPrimaryDirectionVertical ? primary.itemSize : secondary.itemSize) + 'px';
		let position = this.getGridPosition(updateFrom);
		let indexInExtent = updateFrom % dimensionToExtent;

		if (featureEditableEnabled) {
			if (untrackedPointer) {
				// move the editing item since the scrolling position is updated
				// skip rendering by 'handleMouseMove' since 'positionItems' is called by 'render' function
				this.featureEditable.handleMouseMove(this.featureEditable.lastPointer, true);
			}
			if (updateFrom > editingIndex) {
				// the first re-rendered item should be positioned at the previous index in this case
				indexInExtent = this.getPrevPosition(updateFrom, position, indexInExtent);
			}
		}

		// positioning items
		for (let index = updateFrom; index < updateTo; index++) {
			const itemContainer = this.itemContainerRefs[index % this.state.numOfItems];

			if (featureEditableEnabled) {
				const {lastVisualIndex} = this.featureEditable;

				if (index === editingIndex) {
					// the original item for the moving index should be hidden since we use cloned one for moving
					this.setItemContainerStyle(itemContainer, {action: 'hide'});
					continue;
				}

				if (lastVisualIndex >= editingIndex && index === lastVisualIndex + 1 ||
					lastVisualIndex < editingIndex && index === lastVisualIndex) {
					// make a room to render the moving item
					indexInExtent = this.getNextPosition(index, position, indexInExtent);
				}

				if (index !== this.featureEditable.getDataIndexFromNode(itemContainer)) {
					this.setItemContainerStyle(itemContainer, {action: 'reset'});
					this.applyStyleToNewNode(index, width, height, position.primaryPosition, position.secondaryPosition);
				} else {
					this.setItemContainerStyle(itemContainer, {action: 'animate', position});
				}
				indexInExtent = this.getNextPosition(index, position, indexInExtent);
			} else { // normal case
				this.setItemContainerStyle(itemContainer, {action: 'reset', position});
				this.applyStyleToNewNode(index, width, height, position.primaryPosition, position.secondaryPosition);
				indexInExtent = this.getNextPosition(index, position, indexInExtent);
			}
		}

		for (let index = updateTo; index < hideTo; index++) {
			this.applyStyleToHideNode(index);
		}
	}

	getScrollHeight = () => (this.isPrimaryDirectionVertical ? this.getVirtualScrollDimension() + this.props.getAffordance() : this.scrollBounds.clientHeight);

	getScrollWidth = () => (this.isPrimaryDirectionVertical ? this.scrollBounds.clientWidth : this.getVirtualScrollDimension());

	getVirtualScrollDimension = () => {
		if (this.props.itemSizes) {
			return this.props.itemSizes.reduce((total, size, index) => (total + size + (index > 0 ? this.props.spacing : 0)), 0);
		} else {
			const
				{dimensionToExtent, primary, curDataSize} = this,
				{spacing} = this.props;

			return (Math.ceil(curDataSize / dimensionToExtent) * primary.gridSize) - spacing;
		}
	};

	syncClientSize = () => {
		const
			{props} = this,
			node = this.props.scrollContentRef.current;

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
	};

	/*
	 * Edit mode
	 */

	featureEditable = {
		/*
		 * Core interfaces
		 */

		/* The indicator of whether editable feature is enabled or not */
		enabled: false,
		/* The indicator of whether editing is started or not */
		editingMode: false,

		/* Enable an editable feature */
		/* Note that this function does not check necessary props are provided or not, therefore this function is internal use only. */
		enable: () => {
			const node = this.props.scrollContentRef?.current;
			this.featureEditable.enablerJob = new Job(this.featureEditable.editingStartByPointer, this.featureEditable.enablingTime);
			if (node) {
				const {featureEditable} = this;
				featureEditable.enabled = true;

				// add event listeners for editing
				node.addEventListener('mousedown',  featureEditable.handleMouseDown);
				node.addEventListener('mousemove',  featureEditable.handleMouseMove);
				node.addEventListener('mouseup',    featureEditable.handleMouseUp);
				node.addEventListener('mouseenter', featureEditable.handleMouseEnter);
				node.addEventListener('mouseleave', featureEditable.handleMouseLeave);

				// prepare internal info for editing
				const {primary, secondary, isPrimaryDirectionVertical} = this;
				const {cachedItemSize, cachedSCrollContentBounds} = featureEditable;
				const {clientWidth} = node;
				const {x, y} = node.getBoundingClientRect();
				let [xAxis, yAxis] = [primary, secondary];
				if (isPrimaryDirectionVertical) {
					[xAxis, yAxis] = [yAxis, xAxis];
				}

				cachedSCrollContentBounds.clientWidth = clientWidth;
				cachedSCrollContentBounds.x = x;
				cachedSCrollContentBounds.y = y;
				cachedItemSize.width = xAxis.itemSize;
				cachedItemSize.height = yAxis.itemSize;
			}
		},

		/* Disable an editable feature */
		/* Note that this function does not check necessary props are provided or not, therefore this function is internal use only. */
		disable: () => {
			const node = this.props.scrollContentRef?.current;
			const {featureEditable} = this;
			featureEditable.enabled = false;
			if (node) {
				// remove event listeners for editing
				node.removeEventListener('mousedown',  featureEditable.handleMouseDown);
				node.removeEventListener('mousemove',  featureEditable.handleMouseMove);
				node.removeEventListener('mouseup',    featureEditable.handleMouseUp);
				node.removeEventListener('mouseenter', featureEditable.handleMouseEnter);
				node.removeEventListener('mouseleave', featureEditable.handleMouseLeave);
			}
		},

		/* Move an item to a new position. */
		/* FIXME: Note that this function works regardless item is selected or not but we may not need this functionality in our UX. */
		moveItem: (fromDataIndex, toVisualIndex, {skipRendering = false, scrollIntoView = false}) => {
			const {featureEditable} = this;
			if (featureEditable.enabled) {
				if (featureEditable.editingMode) { // editing by user input
					const order = featureEditable.editingDataOrder;
					const fromVisualIndex = order.indexOf(fromDataIndex);
					// when items' order is updated
					if (fromVisualIndex !== toVisualIndex) {
						order.splice(
							toVisualIndex,
							0,
							order.splice(
								fromVisualIndex,
								1
							)[0]
						);
						featureEditable.lastVisualIndex = toVisualIndex;

						if (!skipRendering) {
							this.forceUpdate();
							if (scrollIntoView) {
								this.scrollIntoViewByIndex(toVisualIndex);
							}
						}
					}
				} else if (fromDataIndex !== toVisualIndex) { // editing by programmatic API call
					const newItemsOrder = [...Array(this.props.dataSize).keys()];
					newItemsOrder.splice(toVisualIndex, 0, newItemsOrder.splice(fromDataIndex, 1)[0]);
					forward('onComplete', {detail: {order: newItemsOrder}}, this.props.editable);
				}
			}
		},

		/* Start editing with the selected item */
		editingStart: (editingIndex, positioningType, callbackRef = nop) => {
			const {featureEditable} = this;
			if (featureEditable.enabled && !featureEditable.editingMode) {
				featureEditable.editingMode = true;

				featureEditable.editingDataOrder = [...Array(this.props.dataSize).keys()];
				featureEditable.editingIndex = editingIndex;
				featureEditable.lastVisualIndex = editingIndex;
				featureEditable.positioningType = positioningType;

				featureEditable.movingItemAdd(callbackRef);
			}
		},

		/* Finish editing with the selected item and emit items' orders */
		editingFinish: (cancel = false) => {
			const {featureEditable} = this;
			if (featureEditable.enabled && featureEditable.editingMode) {
				featureEditable.editingMode = false;

				featureEditable.movingItemRemove();

				featureEditable.positioningType = null;
				featureEditable.editingIndex = null;
				featureEditable.editingNode = null;
				if (!cancel) {
					forward('onComplete', {detail: {order: featureEditable.editingDataOrder}}, this.props.editable);
				}
				featureEditable.editingDataOrder = null;
				featureEditable.untrackedPointer = false;
				featureEditable.lastVisualIndex = null;
			}
			featureEditable.enablerJob.stop();
		},

		/* Cancel editing */
		editingCancel: () => this.featureEditable.editingFinish(true),

		/*
		 * Interfaces for a cloned item for moving effect
		 * A cloned item is to display an editing item in a virtualized list.
		 */

		/* add a cloned item of the moving item for animation */
		movingItemAdd: (callbackRef) => {
			/* TBD: using this.itemContainerRefs[key] ? */
			const {childProps, itemRenderer, getComponentProps} = this.props;
			const {x, y, width, height} = this.featureEditable.calculateMovingItemXY();
			const index = this.featureEditable.editingIndex;
			const componentProps = getComponentProps && getComponentProps(index) || {};
			const itemContainerRef = (ref) => {
				this.featureEditable.editingNode = ref;
				if (ref) {
					callbackRef(ref);
				}
			};
			const style = {
				width: width + 'px',
				height: height + 'px',
				/* FIXME: RTL / this calculation only works for Chrome */
				transform: `translate3d(${this.props.rtl ? -x : x}px, ${y}px, 0)`,
				zIndex: 10
			};

			this.cc[this.state.numOfItems] = (
				<div className={classNames(css.listItem, this.props.editable.css?.selected)} key={-1} style={style} ref={itemContainerRef}>
					{itemRenderer({...childProps, ...componentProps, index, ['data-index']: index})}
				</div>
			);

			this.forceUpdate();
		},

		/* move a cloned item of the moving item */
		movingItemUpdate: () => {
			const {featureEditable} = this;
			if (featureEditable.editingNode) {
				const {x, y} = featureEditable.calculateMovingItemXY();
				featureEditable.editingNode.style.transform = `translate3d(${this.props.rtl ? -x : x}px, ${y}px, 0)`;
			}
		},

		/* remove a cloned item of the moving item */
		movingItemRemove: () => {
			if (this.cc.length > this.state.numOfItems) {
				this.cc.pop();
			}
			this.featureEditable.editingNode = null;

			// do not call this.forceUpdate() here since `onComplete` will be forwarded in handleMouseUp.
		},

		/*
		 * mouse input: move an item by drag-and-drop
		 * Note: not working for touch for now
		 */

		editingStartByPointer: () => {
			const {featureEditable} = this;
			if (featureEditable.enabled) {
				const {clientX, clientY} = featureEditable.lastPointer;
				const editingIndex = featureEditable.getDataIndexFromClientXY(clientX, clientY);
				featureEditable.editingStart(editingIndex, 'pointer');
			}
		},

		// begin editing by pointer
		handleMouseDown: ({clientX, clientY}) => {
			const {featureEditable} = this;
			if (featureEditable.enabled) {
				featureEditable.lastPointer.clientX = clientX;
				featureEditable.lastPointer.clientY = clientY;
				featureEditable.enablerJob.start();
			}
		},

		// move the editing item by pointer
		handleMouseMove: ({clientX, clientY}, skipRendering = false) => {
			const {featureEditable} = this;
			if (featureEditable.enabled) {
				featureEditable.lastPointer.clientX = clientX;
				featureEditable.lastPointer.clientY = clientY;

				if (!featureEditable.editingMode) {
					featureEditable.enablerJob.stop();
				} else {
					const index = featureEditable.getVisualIndexFromClientXY();
					if (index !== null) {
						featureEditable.moveItem(featureEditable.editingIndex, index, {skipRendering});
					}

					featureEditable.movingItemUpdate();
				}
			}
		},

		// end editing by pointer
		handleMouseUp: () => {
			const {featureEditable} = this;
			if (featureEditable.enabled) {
				featureEditable.editingFinish(!featureEditable.editingMode);
			}
		},

		// disable position guessing when a pointer is entering
		handleMouseEnter: () => {
			const {featureEditable} = this;
			if (featureEditable.enabled) {
				featureEditable.untrackedPointer = false;
			}
		},

		// enable position guessing when a pointer is leaving
		handleMouseLeave: () => {
			const {featureEditable} = this;
			if (featureEditable.enabled && featureEditable.editingMode) {
				featureEditable.untrackedPointer = true;
			}
		},

		// convert x and y of scroll bounds to clientX and clientY; a revert version of getXYFromClientXY
		// NOTE: this function is not used for now
		getClientXYFromXY: (x, y) => {
			const {cachedSCrollContentBounds: {clientWidth, x: boundX, y: boundY}} = this.featureEditable;
			let relativeX = x;
			let relativeY = y;
			if (this.isPrimaryDirectionVertical) {
				relativeY -= this.scrollPosition;
			} else {
				relativeX -= this.scrollPosition;
			}

			return {
				clientX: this.props.rtl ? (clientWidth - relativeX) + boundX : relativeX + boundX,
				clientY: relativeY + boundY
			};
		},

		// convert clientX and clientY to x and y of scroll bounds; a revert version of getClientXYFromXY
		getXYFromClientXY: (clientX, clientY) => {
			const {cachedSCrollContentBounds: {clientWidth, x: boundX, y: boundY}} = this.featureEditable;
			const relativeX = this.props.rtl ? clientWidth - (clientX - boundX) : clientX - boundX;
			const relativeY = clientY - boundY;
			if (this.isPrimaryDirectionVertical) {
				return {
					x: relativeX,
					y: relativeY + this.scrollPosition
				};
			} else {
				return {
					x: relativeX + this.scrollPosition,
					y: relativeY
				};
			}
		},

		// convert x and y into primaryPosition and secondaryPosition; a counter function of getXY
		getPositionFromXY: (x, y) => (this.isPrimaryDirectionVertical ? {primaryPosition: y, secondaryPosition: x} : {primaryPosition: x, secondaryPosition: y}),

		// get a visual index from the last pointer position
		getVisualIndexFromClientXY: () => {
			const {dimensionToExtent, primary, secondary} = this;
			const {clientX, clientY} = this.featureEditable.lastPointer;
			const {x, y} = this.featureEditable.getXYFromClientXY(clientX, clientY);
			const {primaryPosition, secondaryPosition} = this.featureEditable.getPositionFromXY(x, y);

			/* TODO when props.itemSizes is defined
			* - try to get index from the current position and currently rendered items' position
			* - if the current position is space between items, return null
			* getGridPosition function's implementation could be helpful to fill this logic
			*/
			const primaryIndex = Math.floor(primaryPosition / primary.gridSize);
			const secondaryIndex = Math.floor(secondaryPosition / secondary.gridSize);

			// return null if the coordinate points to space between items
			if ((primaryIndex * primary.gridSize + primary.itemSize < primaryPosition) ||
				(secondaryIndex * secondary.gridSize + secondary.itemSize < secondaryPosition)) {
				return null;
			}

			return primaryIndex * dimensionToExtent + secondaryIndex;
		},

		// get an index from item DOM node
		getDataIndexFromNode: (node) => {
			const targetNode = node && node.querySelector('[data-index]');
			if (targetNode) {
				const index = parseInt(targetNode.dataset.index);
				if (!isNaN(index)) {
					return index;
				}
			}
			return null;
		},

		// get an index from item DOM node at a given position
		getDataIndexFromClientXY: (clientX, clientY) => {
			if (typeof window !== 'undefined') {
				const contentNode = this.contentRef.current;
				let node = document.elementFromPoint(clientX, clientY);
				if (utilDOM.containsDangerously(contentNode, node)) {
					while (node.parentNode !== contentNode) {
						if (node === document) {
							return null;
						}
						node = node.parentNode;
					}

					if (node) {
						return this.featureEditable.getDataIndexFromNode(node);
					}
				}
			}

			return null;
		},

		// calculate a position of moving item based on the last pointer position
		// For now, the position is calculated to make the pointer to be a center of the item
		calculateMovingItemXY: () => {
			const {positioningType, cachedItemSize: {width, height}, lastPointer: {clientX, clientY}} = this.featureEditable;
			if (positioningType === 'pointer') {
				const {x, y} = this.featureEditable.getXYFromClientXY(
					clientX - (this.props.rtl ? -1 : 1) * width / 2,
					clientY - height / 2
				);
				return {x, y, width, height};
			} else if (positioningType === 'index') {
				const {left, top} = this.gridPositionToItemPosition(this.getGridPosition(this.featureEditable.lastVisualIndex));
				return {x: left, y: top, width, height};
			}
		},

		/*
		 * Internal state
		 */

		// The index of the item being edited
		editingIndex: null,
		// The cloned DOM node that follows the pointer
		editingNode: null,
		// The updated data order during editing
		editingDataOrder: null,

		// The type of positioning for the moving item ('pointer' for the pointer coordinates, 'index' for the index of a position)
		positioningType: null,

		// The flag to indicate whether a list should guess the position of the pointer that is out of boundary
		untrackedPointer: false,
		// The last observed position of the pointer
		lastPointer: {clientX: null, clientY: null},
		// The last visaully positioned index of the editing item
		lastVisualIndex: null,

		// A scroll content boundaries' info to reduce calculation
		cachedSCrollContentBounds: {clientWidth: null, x: null, y: null},
		// An item's width and height size to reduce calculation
		cachedItemSize: {width: null, height: null},

		// The Job ID to check holding time to enter editing mode
		enablerJob: null,
		// The holding time of pointer input to enter editing mode
		enablingTime: 500,
		// The transition duration for relocating items when the editing item is moved
		transitionTime: '100ms'
	}; // featureEditable

	// scroll into view to show an item matching the specified index
	scrollIntoViewByIndex = (index) => {
		const {scrollPosition, primary} = this;
		const {primaryPosition} = this.getGridPosition(index);
		if (primaryPosition < scrollPosition) {
			this.props.cbScrollTo({
				index,
				stickTo: 'start',
				animate: true
			});
		} else if (primaryPosition + primary.itemSize > scrollPosition + primary.clientSize) {
			// TBD: affordance is not calculated for now
			this.props.cbScrollTo({
				index,
				stickTo: 'end',
				animate: true
			});
		}
	};

	/*
	 * render
	 */

	render () {
		const
			{className, containerProps, placeholderRenderer, role, style, scrollMode, ...rest} = this.props,
			{cc, isPrimaryDirectionVertical, primary} = this,
			scrollModeNative = scrollMode === 'native',
			containerClasses = classNames(
				css.virtualList,
				isPrimaryDirectionVertical ? css.vertical : css.horizontal,
				{[css.native]: scrollModeNative},
				className
			),
			contentClasses = scrollModeNative ? null : css.content;

		delete rest.cbScrollTo;
		delete rest.childProps;
		delete rest.clientSize;
		delete rest.dataSize;
		delete rest.direction;
		delete rest.editable;
		delete rest.getAffordance;
		delete rest.getComponentProps;
		delete rest.isHorizontalScrollbarVisible;
		delete rest.isVerticalScrollbarVisible;
		delete rest.itemRefs;
		delete rest.itemRenderer;
		delete rest.itemSize;
		delete rest.itemSizes;
		delete rest.onUpdate;
		delete rest.onUpdateItems;
		delete rest.overhang;
		delete rest.pageScroll;
		delete rest.rtl;
		delete rest.scrollContainerContainsDangerously;
		delete rest.scrollContentRef;
		delete rest.scrollMode;
		delete rest.setThemeScrollContentHandle;
		delete rest.spacing;
		delete rest.updateStatesAndBounds;

		if (primary) {
			this.positionItems();
		}

		return (
			<div className={containerClasses} {...containerProps} ref={this.props.scrollContentRef} style={style}>
				<div {...rest} className={contentClasses} ref={this.contentRef} role={role}>
					{[...cc, placeholderRenderer && placeholderRenderer(primary)]}
				</div>
			</div>
		);
	}
}

export default VirtualListBasic;
export {
	gridListItemSizeShape,
	itemSizesShape,
	VirtualListBasic
};
