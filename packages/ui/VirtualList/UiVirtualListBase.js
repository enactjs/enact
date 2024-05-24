import classNames from 'classnames';
import {forward} from '@enact/core/handle';
import deprecate from '@enact/core/internal/deprecate';
import {platform} from '@enact/core/platform';
import PropTypes from 'prop-types';
import equals from 'ramda/src/equals';
import {createRef, cloneElement, Component} from 'react';

import * as css from './UiVirtualList.module.less';

const
	nop = () => {},
	JS = 'JS',
	Native = 'Native';

const gridListItemSizeShape = PropTypes.shape({
	minHeight: PropTypes.number.isRequired,
	minWidth: PropTypes.number.isRequired
});

/**
 * The base version of the virtual list component.
 *
 * @class VirtualListCore
 * @memberof ui/VirtualList
 * @ui
 * @private
 */
const VirtualListBaseFactory = (type) => {
	return class VirtualListCore extends Component {
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
			 * Normally, {@link ui/Scrollable.Scrollable|Scrollable} should set this value.
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
		};

		static defaultProps = {
			cbScrollTo: nop,
			dataSize: 0,
			direction: 'vertical',
			itemsRenderer: nop, // eslint-disable-line react/default-props-match-prop-types
			overhang: 3,
			pageScroll: false,
			spacing: 0
		};

		constructor (props) {
			let nextState = null;

			super(props);

			this.containerRef = createRef();
			this.contentRef = createRef();
			this.itemContainerRef = createRef();

			if (props.clientSize) {
				this.calculateMetrics(props);
				nextState = this.getStatesAndUpdateBounds(props);
			}

			this.state = {
				firstIndex: 0,
				numOfItems: 0,
				prevChildProps: null,
				prevFirstIndex: 0,
				updateFrom: 0,
				updateTo: 0,
				...nextState
			};
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
		}

		componentDidUpdate (prevProps, prevState) {
			let deferScrollTo = false;
			const {firstIndex, numOfItems} = this.state;

			this.shouldUpdateBounds = false;

			// TODO: remove `this.hasDataSizeChanged` and fix ui/Scrollable*
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
				});

				deferScrollTo = true;
			} else if (this.hasDataSizeChanged) {
				const newState = this.getStatesAndUpdateBounds(this.props, this.state.firstIndex);
				this.setState(newState);
				this.setContainerSize();

				deferScrollTo = true;
			} else if (prevProps.rtl !== this.props.rtl) {
				this.updateScrollPosition(this.getXY(this.scrollPosition, 0));
			}

			const maxPos = this.isPrimaryDirectionVertical ? this.scrollBounds.maxTop : this.scrollBounds.maxLeft;

			if (!deferScrollTo && this.scrollPosition > maxPos) {
				this.props.cbScrollTo({position: (this.isPrimaryDirectionVertical) ? {y: maxPos} : {x: maxPos}, animate: false});
			}
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

		// For individually sized item
		itemPositions = [];
		indexToScrollIntoView = -1;

		updateScrollPosition = ({x, y}, rtl = this.props.rtl) => {
			if (type === Native) {
				this.scrollToPosition(x, y, rtl);
			} else {
				this.setScrollPosition(x, y, rtl, x, y);
			}
		};

		isVertical = () => this.isPrimaryDirectionVertical;

		isHorizontal = () => !this.isPrimaryDirectionVertical;

		getScrollBounds = () => this.scrollBounds;

		getMoreInfo = () => this.moreInfo;

		getGridPosition (index) {
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
		}

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

		getItemPosition = (index, stickTo = 'start') => {
			const
				{primary} = this,
				position = this.getGridPosition(index);
			let  offset = 0;

			if (stickTo === 'start') {
				offset = 0;
			} else if (this.props.itemSizes) {
				offset = primary.clientSize - this.props.itemSizes[index];
			} else {
				offset = primary.clientSize - primary.itemSize;
			}

			position.primaryPosition -= offset;

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
				{clientSize, direction, itemSize, overhang, spacing} = props,
				node = this.containerRef.current;

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
			thresholdBase = primary.gridSize * Math.ceil(overhang / 2);

			this.threshold = {min: -Infinity, max: thresholdBase, base: thresholdBase};
			this.dimensionToExtent = dimensionToExtent;

			this.primary = primary;
			this.secondary = secondary;

			// reset
			this.scrollPosition = 0;
			if (type === JS && this.contentRef.current) {
				this.contentRef.current.style.transform = null;
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
				node = this.containerRef.current;

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

		// Native only
		scrollToPosition (x, y, rtl = this.props.rtl) {
			if (this.containerRef.current) {
				if (this.isPrimaryDirectionVertical) {
					this.scrollPositionTarget = y;
				} else {
					this.scrollPositionTarget = x;
				}

				if (rtl) {
					x = (platform.chrome < 85) ? this.scrollBounds.maxLeft - x : -x;
				}

				this.containerRef.current.scrollTo(x, y);
			}
		}

		// JS only
		setScrollPosition (x, y, rtl = this.props.rtl, targetX = 0, targetY = 0) {
			if (this.contentRef.current) {
				this.contentRef.current.style.transform = `translate3d(${rtl ? x : -x}px, -${y}px, 0)`;

				// The `x`, `y` as parameters in scrollToPosition() are the position when stopping scrolling.
				// But the `x`, `y` as parameters in setScrollPosition() are the position between current position and the position stopping scrolling.
				// To know the position when stopping scrolling here, `targetX` and `targetY` are passed and cached in `this.scrollPositionTarget`.
				if (this.isPrimaryDirectionVertical) {
					this.scrollPositionTarget = targetY;
				} else {
					this.scrollPositionTarget = targetX;
				}

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
				childNode = this.itemContainerRef.current.children[index % numOfItems];

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
			if (this.itemContainerRef.current) {
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

		getItemNode = (index) => {
			const ref = this.itemContainerRef.current;

			return ref ? ref.children[index % this.state.numOfItems] : null;
		};

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
				key = index % this.state.numOfItems,
				itemElement = itemRenderer({
					...this.props.childProps,
					key,
					index
				}),
				componentProps = getComponentProps && getComponentProps(index) || {};

			this.cc[key] = cloneElement(itemElement, {
				...componentProps,
				className: classNames(css.listItem, itemElement.props.className),
				style: {...itemElement.props.style, ...(this.composeStyle(...rest))}
			});
		};

		applyStyleToHideNode = (index) => {
			const key = index % this.state.numOfItems;
			this.cc[key] = <div key={key} style={{display: 'none'}} />;
		};

		positionItems () {
			const
				{dataSize, itemSizes} = this.props,
				{firstIndex, numOfItems} = this.state,
				{cc, isPrimaryDirectionVertical, dimensionToExtent, primary, secondary, itemPositions} = this;
			let
				hideTo = 0,
				updateFrom = cc.length ? this.state.updateFrom : firstIndex,
				updateTo = cc.length ? this.state.updateTo : firstIndex + numOfItems;

			if (updateFrom >= updateTo) {
				return;
			} else if (updateTo > dataSize) {
				hideTo = updateTo;
				updateTo = dataSize;
			}

			let
				width, height,
				{primaryPosition, secondaryPosition} = this.getGridPosition(updateFrom);

			width = (isPrimaryDirectionVertical ? secondary.itemSize : primary.itemSize) + 'px';
			height = (isPrimaryDirectionVertical ? primary.itemSize : secondary.itemSize) + 'px';

			// positioning items
			for (let i = updateFrom, j = updateFrom % dimensionToExtent; i < updateTo; i++) {
				this.applyStyleToNewNode(i, width, height, primaryPosition, secondaryPosition);

				if (++j === dimensionToExtent) {
					secondaryPosition = 0;

					if (this.props.itemSizes) {
						if (itemPositions[i + 1] || itemPositions[i + 1] === 0) {
							primaryPosition = itemPositions[i + 1].position;
						} else if (itemSizes[i]) {
							primaryPosition += itemSizes[i] + this.props.spacing;
						} else {
							primaryPosition += primary.gridSize;
						}
					} else {
						primaryPosition += primary.gridSize;
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

		getScrollHeight = () => (this.isPrimaryDirectionVertical ? this.getVirtualScrollDimension() : this.scrollBounds.clientHeight);

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
				node = this.containerRef.current;

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

		// render

		getContainerClasses (className) {
			let containerClass = null;

			if (type === Native) {
				containerClass = this.isPrimaryDirectionVertical ? css.vertical : css.horizontal;
			}

			return classNames(css.virtualList, containerClass, className);
		}

		getContentClasses () {
			return type === Native ? null : css.content;
		}

		render () {
			deprecate({
				name: 'ui/VirtualList.VirtualListBase',
				until: '5.0.0'
			});
			const
				{className, containerProps, itemsRenderer, style, ...rest} = this.props,
				{cc, itemContainerRef, primary} = this,
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
			delete rest.itemSizes;
			delete rest.onUpdate;
			delete rest.onUpdateItems;
			delete rest.overhang;
			delete rest.pageScroll;
			delete rest.rtl;
			delete rest.spacing;
			delete rest.updateStatesAndBounds;

			if (primary) {
				this.positionItems();
			}

			return (
				<div className={containerClasses} {...containerProps} ref={this.containerRef} style={style}>
					<div {...rest} className={contentClasses} ref={this.contentRef}>
						{itemsRenderer({cc, itemContainerRef, primary})}
					</div>
				</div>
			);
		}
	};
};

/**
 * A basic base component for
 * {@link ui/VirtualList.VirtualList|VirtualList} and {@link ui/VirtualList.VirtualGridList|VirtualGridList}.
 *
 * @class VirtualListBase
 * @memberof ui/VirtualList
 * @ui
 * @public
 * @deprecated Will be removed in 5.0.0.
 */
const VirtualListBase = VirtualListBaseFactory(JS);
VirtualListBase.displayName = 'ui:VirtualListBase';

/**
 * A basic base component for
 * {@link ui/VirtualList.VirtualListNative|VirtualListNative} and {@link ui/VirtualList.VirtualGridListNative|VirtualGridListNative}.
 *
 * @class VirtualListBaseNative
 * @memberof ui/VirtualList
 * @ui
 * @private
 */
const VirtualListBaseNative = VirtualListBaseFactory(Native);
VirtualListBaseNative.displayName = 'ui:VirtualListBaseNative';

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
 *     <VirtualList
 *         ...
 *         onScrollStart={this.onScrollStart}
 *         ...
 *     />
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
 *     const {firstVisibleIndex, lastVisibleIndex} = moreInfo;
 *     // do something with firstVisibleIndex and lastVisibleIndex
 * }
 *
 * render = () => (
 *     <VirtualList
 *         ...
 *         onScrollStop={this.onScrollStop}
 *         ...
 *     />
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
	VirtualListBase as UiVirtualListBase,
	VirtualListBaseNative as UiVirtualListBaseNative
};
