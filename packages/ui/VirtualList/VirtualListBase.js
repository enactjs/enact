import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Scrollable from '../Scrollable';
import ScrollableNative from '../Scrollable/ScrollableNative';

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
 * @property {Number}    minWidth    The minimum width of the grid list item.
 * @property {Number}    minHeight    The minimum height of the grid list item.
 * @public
 */
const gridListItemSizeShape = PropTypes.shape({
	minHeight: PropTypes.number.isRequired,
	minWidth: PropTypes.number.isRequired
});

/**
 * The base version of the virtual list component.
 *
 * @class VirtualListBase
 * @memberof ui/VirtualList
 * @ui
 * @public
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
			 * Activates the component for voice control.
			 *
			 * @type {Boolean}
			 * @private
			 */
			'data-webos-voice-focused': PropTypes.bool,

			/**
			 * The voice control group label.
			 *
			 * @type {String}
			 * @private
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
			super(props);

			this.state = {firstIndex: 0, numOfItems: 0};
		}

		componentWillMount () {
			if (this.props.clientSize) {
				this.calculateMetrics(this.props);
				this.updateStatesAndBounds(this.props);
			}
		}

		// Calculate metrics for VirtualList after the 1st render to know client W/H.
		componentDidMount () {
			if (!this.props.clientSize) {
				this.calculateMetrics(this.props);
				this.updateStatesAndBounds(this.props);
			}
			this.setContainerSize();
		}

		// Call updateStatesAndBounds here when dataSize has been changed to update nomOfItems state.
		// Calling setState within componentWillReceivePropswill not trigger an additional render.
		componentWillReceiveProps (nextProps) {
			const
				{dataSize, direction, itemSize, overhang, rtl, spacing} = this.props,
				hasMetricsChanged = (
					direction !== nextProps.direction ||
					((itemSize instanceof Object) ? (itemSize.minWidth !== nextProps.itemSize.minWidth || itemSize.minHeight !== nextProps.itemSize.minHeight) : itemSize !== nextProps.itemSize) ||
					overhang !== nextProps.overhang ||
					spacing !== nextProps.spacing
				);

			this.hasDataSizeChanged = (dataSize !== nextProps.dataSize);

			if (hasMetricsChanged) {
				this.calculateMetrics(nextProps);
				this.updateStatesAndBounds(nextProps);
				this.setContainerSize();
			} else if (this.hasDataSizeChanged) {
				this.updateStatesAndBounds(nextProps);
				this.setContainerSize();
			} else if (rtl !== nextProps.rtl) {
				const {x, y} = this.getXY(this.scrollPosition, 0);

				this.cc = [];
				if (type === Native) {
					this.scrollToPosition(x, y, nextProps.rtl);
				} else {
					this.setScrollPosition(x, y, 0, 0, nextProps.rtl);
				}
			}
		}

		componentWillUpdate (nextProps, nextState) {
			if (this.state.firstIndex === nextState.firstIndex || this.props.childProps && this.props.childProps !== nextProps.childProps) {
				this.prevFirstIndex = -1; // force to re-render items
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

		dimensionToExtent = 0
		threshold = 0
		maxFirstIndex = 0
		prevFirstIndex = 0
		curDataSize = 0
		hasDataSizeChanged = false
		cc = []
		scrollPosition = 0

		contentRef = null
		containerRef = null

		isVertical = () => this.isPrimaryDirectionVertical

		isHorizontal = () => !this.isPrimaryDirectionVertical

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

		getXY = (primaryPosition, secondaryPosition) => (this.isPrimaryDirectionVertical ? {x: secondaryPosition, y: primaryPosition} : {x: primaryPosition, y: secondaryPosition})

		getClientSize = (node) => ({
			clientWidth: node.clientWidth,
			clientHeight: node.clientHeight
		})

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
			if (type === JS && this.contentRef) {
				this.contentRef.style.transform = null;
			}

			// eslint-disable-next-line react/no-direct-mutation-state
			this.state.firstIndex = 0;
			// eslint-disable-next-line react/no-direct-mutation-state
			this.state.numOfItems = 0;
		}

		updateStatesAndBounds = (props) => {
			const
				{dataSize, overhang, updateStatesAndBounds} = props,
				{firstIndex} = this.state,
				{dimensionToExtent, primary, moreInfo, scrollPosition} = this,
				numOfItems = Math.min(dataSize, dimensionToExtent * (Math.ceil(primary.clientSize / primary.gridSize) + overhang)),
				wasFirstIndexMax = ((this.maxFirstIndex < moreInfo.firstVisibleIndex - dimensionToExtent) && (firstIndex === this.maxFirstIndex)),
				dataSizeDiff = dataSize - this.curDataSize;
			let newFirstIndex = firstIndex;

			this.maxFirstIndex = Math.ceil((dataSize - numOfItems) / dimensionToExtent) * dimensionToExtent;
			this.curDataSize = dataSize;

			// reset children
			this.cc = [];
			this.calculateScrollBounds(props);
			this.updateMoreInfo(dataSize, scrollPosition);

			if (!(updateStatesAndBounds && updateStatesAndBounds({
				cbScrollTo: props.cbScrollTo,
				numOfItems,
				dataSize,
				moreInfo
			}))) {
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

		setContainerSize = () => {
			if (this.contentRef) {
				this.contentRef.style.width = this.scrollBounds.scrollWidth + (this.isPrimaryDirectionVertical ? -1 : 0) + 'px';
				this.contentRef.style.height = this.scrollBounds.scrollHeight + (this.isPrimaryDirectionVertical ? 0 : -1) + 'px';
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

		// Native only
		scrollToPosition (x, y, rtl = this.props.rtl) {
			if (this.containerRef) {
				this.containerRef.scrollTo(
					(rtl && !this.isPrimaryDirectionVertical) ? this.scrollBounds.maxLeft - x : x, y
				);
			}
		}

		// JS only
		setScrollPosition (x, y, dirX, dirY, rtl = this.props.rtl) {
			if (this.contentRef) {
				this.contentRef.style.transform = `translate3d(${rtl ? x : -x}px, -${y}px, 0)`;
				this.didScroll(x, y, dirX, dirY);
			}
		}

		didScroll (x, y, dirX, dirY) {
			const
				{dataSize} = this.props,
				{firstIndex} = this.state,
				{isPrimaryDirectionVertical, threshold, dimensionToExtent, maxFirstIndex, scrollBounds} = this,
				{gridSize} = this.primary,
				maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft,
				minOfMax = threshold.base,
				maxOfMin = maxPos - threshold.base;
			let delta, numOfGridLines, newFirstIndex = firstIndex, pos, dir = 0;

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

			if (threshold.min === -Infinity) {
				newFirstIndex = 0;
			} else {
				newFirstIndex = Math.min(maxFirstIndex, newFirstIndex);
				newFirstIndex = Math.max(0, newFirstIndex);
			}

			this.syncThreshold(maxPos);
			this.scrollPosition = pos;
			this.updateMoreInfo(dataSize, pos);

			if (firstIndex !== newFirstIndex) {
				this.setState({firstIndex: newFirstIndex});
			}
		}

		getItemNode = (index) => {
			const ref = this.itemContainerRef;

			return ref ? ref.children[index % this.state.numOfItems] : null;
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
				key = index % this.state.numOfItems,
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
			const key = index % this.state.numOfItems;
			this.cc[key] = <div key={key} style={{display: 'none'}} />;
		}

		positionItems () {
			const
				{dataSize} = this.props,
				{firstIndex, numOfItems} = this.state,
				{isPrimaryDirectionVertical, dimensionToExtent, primary, secondary, cc} = this,
				diff = firstIndex - this.prevFirstIndex,
				updateFrom = (cc.length === 0 || 0 >= diff || diff >= numOfItems || this.prevFirstIndex === -1) ? firstIndex : this.prevFirstIndex + numOfItems;
			let
				hideTo = 0,
				updateTo = (cc.length === 0 || -numOfItems >= diff || diff > 0 || this.prevFirstIndex === -1) ? firstIndex + numOfItems : this.prevFirstIndex;

			if (updateFrom >= updateTo) {
				return;
			} else if (updateTo > dataSize) {
				hideTo = updateTo;
				updateTo = dataSize;
			}

			let
				{primaryPosition, secondaryPosition} = this.getGridPosition(updateFrom),
				width, height;

			width = (isPrimaryDirectionVertical ? secondary.itemSize : primary.itemSize) + 'px';
			height = (isPrimaryDirectionVertical ? primary.itemSize : secondary.itemSize) + 'px';

			// positioning items
			for (let i = updateFrom, j = updateFrom % dimensionToExtent; i < updateTo; i++) {
				this.applyStyleToNewNode(i, width, height, primaryPosition, secondaryPosition);

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

			this.prevFirstIndex = firstIndex;
		}

		getScrollHeight = () => (this.isPrimaryDirectionVertical ? this.getVirtualScrollDimension() : this.scrollBounds.clientHeight)

		getScrollWidth = () => (this.isPrimaryDirectionVertical ? this.scrollBounds.clientWidth : this.getVirtualScrollDimension())

		getVirtualScrollDimension = () => {
			const
				{dimensionToExtent, primary, curDataSize} = this,
				{spacing} = this.props;

			return (Math.ceil(curDataSize / dimensionToExtent) * primary.gridSize) - spacing;
		}

		syncClientSize = () => {
			const
				{props} = this,
				node = this.containerRef;

			if (!props.clientSize && !node) {
				return false;
			}

			const
				{clientWidth, clientHeight} = props.clientSize || this.getClientSize(node),
				{scrollBounds} = this;

			if (clientWidth !== scrollBounds.clientWidth || clientHeight !== scrollBounds.clientHeight) {
				this.calculateMetrics(props);
				this.updateStatesAndBounds(props);
				this.setContainerSize();
				return true;
			}

			return false;
		}

		// render

		initContainerRef = (ref) => {
			if (ref) {
				this.containerRef = ref;
			}
		}

		initContentRef = (ref) => {
			if (ref) {
				this.contentRef = ref;
			}
		}

		initItemContainerRef = (ref) => {
			if (ref) {
				this.itemContainerRef = ref;
			}
		}

		mergeClasses = (className) => {
			let containerClass = null;

			if (type === Native) {
				containerClass = (this.isPrimaryDirectionVertical) ? css.vertical : css.horizontal;
			}

			return classNames(css.virtualList, containerClass, className);
		}

		render () {
			const
				{className, 'data-webos-voice-focused': voiceFocused, 'data-webos-voice-group-label': voiceGroupLabel, itemsRenderer, style, ...rest} = this.props,
				{cc, initItemContainerRef, primary} = this,
				containerClasses = this.mergeClasses(className);

			delete rest.cbScrollTo;
			delete rest.childProps;
			delete rest.clientSize;
			delete rest.dataSize;
			delete rest.direction;
			delete rest.getComponentProps;
			delete rest.isVerticalScrollbarVisible;
			delete rest.itemRenderer;
			delete rest.itemSize;
			delete rest.onUpdate;
			delete rest.overhang;
			delete rest.pageScroll;
			delete rest.rtl;
			delete rest.spacing;
			delete rest.updateStatesAndBounds;

			if (primary) {
				this.positionItems();
			}

			return (
				<div className={containerClasses} data-webos-voice-focused={voiceFocused} data-webos-voice-group-label={voiceGroupLabel} ref={this.initContainerRef} style={style}>
					<div {...rest} ref={this.initContentRef}>
						{itemsRenderer({cc, initItemContainerRef, primary})}
					</div>
				</div>
			);
		}
	};
};

/**
 * A basic base component for
 * [VirtualList]{@link ui/VirtualList.VirtualList} and [VirtualGridList]{@link ui/VirtualList.VirtualGridList}.
 *
 * @class VirtualListBase
 * @memberof ui/VirtualList
 * @ui
 * @private
 */
const VirtualListBase = VirtualListBaseFactory(JS);
VirtualListBase.displayName = 'ui:VirtualListBase';

/**
 * A basic base component for
 * [VirtualListNative]{@link ui/VirtualList.VirtualListNative} and [VirtualGridListNative]{@link ui/VirtualList.VirtualGridListNative}.
 *
 * @class VirtualListBaseNative
 * @memberof ui/VirtualList
 * @ui
 * @private
 */
const VirtualListBaseNative = VirtualListBaseFactory(Native);
VirtualListBaseNative.displayName = 'ui:VirtualListBaseNative';

const ScrollableVirtualList = (props) => (
	<Scrollable
		{...props}
		childRenderer={({initChildRef, ...rest}) => ( // eslint-disable-line react/jsx-no-bind
			<VirtualListBase
				{...rest}
				itemsRenderer={({cc, initItemContainerRef}) => ( // eslint-disable-line react/jsx-no-bind
					cc.length ? <div ref={initItemContainerRef} role="list">{cc}</div> : null
				)}
				ref={initChildRef}
			/>
		)}
	/>
);

ScrollableVirtualList.propTypes = {
	direction: PropTypes.oneOf(['horizontal', 'vertical'])
};

ScrollableVirtualList.defaultProps = {
	direction: 'vertical'
};

const ScrollableVirtualListNative = (props) => (
	<ScrollableNative
		{...props}
		childRenderer={({initChildRef, ...rest}) => ( // eslint-disable-line react/jsx-no-bind
			<VirtualListBaseNative
				{...rest}
				itemsRenderer={({cc, initItemContainerRef}) => ( // eslint-disable-line react/jsx-no-bind
					cc.length ? <div ref={initItemContainerRef} role="list">{cc}</div> : null
				)}
				ref={initChildRef}
			/>
		)}
	/>
);

ScrollableVirtualListNative.propTypes = /** @lends ui/VirtualList.VirtualListBaseNative.prototype */ {
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
	direction: PropTypes.oneOf(['horizontal', 'vertical'])
};

ScrollableVirtualListNative.defaultProps = {
	direction: 'vertical'
};

export default VirtualListBase;
export {
	gridListItemSizeShape,
	ScrollableVirtualList,
	ScrollableVirtualListNative,
	VirtualListBase,
	VirtualListBaseNative
};
