import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import shallowEqual from 'recompose/shallowEqual';

import Scrollable from '../Scrollable';
import ScrollableNative from '../Scrollable/ScrollableNative';

import css from './VirtualList.less';

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

		static defaultState = {
			cc: [],
			firstIndex: 0,
			metrics: {
				dimensionToExtent: 0,
				isItemSized: false,
				isPrimaryDirectionVertical: true,
				maxFirstIndex: 0,
				moreInfo: {
					firstVisibleIndex: null,
					lastVisibleIndex: null
				},
				primary: null,
				scrollBounds: {
					clientWidth: 0,
					clientHeight: 0,
					scrollWidth: 0,
					scrollHeight: 0,
					maxLeft: 0,
					maxTop: 0
				},
				secondary: null,
				threshold: 0
			},
			numOfItems: 0,
			prevProps: {},
			scrollPosition: 0
		}

		constructor (props) {
			super(props);

			this.state = {
				...VirtualListCore.defaultState,
				prevProps: {...props}
			};

			// TBD
			if (props.clientSize) {
				VirtualListCore.calculateMetrics(props, this.state);
				VirtualListCore.updateStatesAndBounds(props, this.state);
			}
		}

		static getDerivedStateFromProps (props, state) {
			const
				{dataSize} = state.prevProps,
				hasMetricsChanged = VirtualListCore.hasMetricsChanged(props, state),
				hasDataSizeChanged = dataSize !== props.dataSize;
			let nextState = null;

			// Call updateStatesAndBounds here when dataSize has been changed to update nomOfItems state.
			if (hasMetricsChanged || hasDataSizeChanged) {
				nextState = Object.assign({}, state);
				if (hasMetricsChanged) {
					VirtualListCore.calculateMetrics(props, nextState);
					VirtualListCore.updateStatesAndBounds(props, nextState);
				} else {
					VirtualListCore.updateStatesAndBounds(props, nextState);
				}
			}

			if (!shallowEqual(props, state.prevProps)) {
				nextState = {
					...nextState,
					prevProps: ({...props})
				};
			}

			if (nextState !== null) {
				return nextState;
			} else {
				return null;
			}
		}

		// Calculate metrics for VirtualList after the 1st render to know client W/H.
		componentDidMount () {
			if (!this.props.clientSize) {
				const nextState = this.state;

				VirtualListCore.calculateMetrics(this.props, nextState);
				VirtualListCore.updateStatesAndBounds(this.props, nextState);
				this.setState(() => nextState); // eslint-disable-line react/no-did-mount-set-state
			}
			this.setContainerSize();
		}

		componentDidUpdate () {
			this.prevFirstIndex = this.state.firstIndex;
		}

		prevFirstIndex = 0
		contentRef = null
		containerRef = null

		isVertical = () => this.state.metrics.isPrimaryDirectionVertical

		isHorizontal = () => !this.state.metrics.isPrimaryDirectionVertical

		getScrollBounds = () => this.state.metrics.scrollBounds

		getMoreInfo = () => this.state.metrics.moreInfo

		getGridPosition (index) {
			const
				{dimensionToExtent, primary, secondary} = this.state.metrics,
				primaryPosition = Math.floor(index / dimensionToExtent) * primary.gridSize,
				secondaryPosition = (index % dimensionToExtent) * secondary.gridSize;

			return {primaryPosition, secondaryPosition};
		}

		getItemPosition = (index, stickTo = 'start') => {
			const
				{primary} = this.state.metrics,
				position = this.getGridPosition(index),
				offset = (stickTo === 'start') ? 0 : primary.clientSize - primary.itemSize;

			position.primaryPosition -= offset;

			return this.gridPositionToItemPosition(position);
		}

		gridPositionToItemPosition = ({primaryPosition, secondaryPosition}) =>
			(this.state.metrics.isPrimaryDirectionVertical ? {left: secondaryPosition, top: primaryPosition} : {left: primaryPosition, top: secondaryPosition})

		getXY = (primaryPosition, secondaryPosition) => (this.state.metrics.isPrimaryDirectionVertical ? {x: secondaryPosition, y: primaryPosition} : {x: primaryPosition, y: secondaryPosition})

		static hasMetricsChanged (props, state) {
			const {dataSize, direction, itemSize, overhang, spacing} = state.prevProps;

			return (
				direction !== props.direction ||
				((itemSize instanceof Object) ? (itemSize.minWidth !== props.itemSize.minWidth || itemSize.minHeight !== props.itemSize.minHeight) : itemSize !== props.itemSize) ||
				overhang !== props.overhang ||
				spacing !== props.spacing
			);
		}

		static getClientSize (node) {
			return {
				clientWidth: node.clientWidth,
				clientHeight: node.clientHeight
			};
		}

		static calculateMetrics (props, state) {
			const
				{clientSize, direction, itemSize, spacing} = props,
				{containerRef} = state.metrics || {};

			if (!clientSize && !containerRef) {
				return;
			}

			const
				{clientWidth, clientHeight} = (clientSize || VirtualListCore.getClientSize(containerRef)),
				heightInfo = {
					clientSize: clientHeight,
					minItemSize: itemSize.minHeight || null,
					itemSize: itemSize
				},
				widthInfo = {
					clientSize: clientWidth,
					minItemSize: itemSize.minWidth || null,
					itemSize: itemSize
				},
				isPrimaryDirectionVertical = (direction === 'vertical');
			let primary, secondary, dimensionToExtent, thresholdBase;

			if (isPrimaryDirectionVertical) {
				primary = heightInfo;
				secondary = widthInfo;
			} else {
				primary = widthInfo;
				secondary = heightInfo;
			}
			dimensionToExtent = 1;

			const isItemSized = (primary.minItemSize && secondary.minItemSize);

			if (isItemSized) {
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

			state.metrics = {
				...state.metrics,
				dimensionToExtent,
				isItemSized,
				isPrimaryDirectionVertical,
				maxFirstIndex: 0,
				moreInfo: {
					firstVisibleIndex: null,
					lastVisibleIndex: null
				},
				primary,
				secondary,
				threshold: {base: thresholdBase, max: thresholdBase, min: -Infinity}
			};

			state.firstIndex = 0;
			state.scrollPosition = 0;
			state.numOfItems = 0;
		}

		static updateStatesAndBounds (props, state) {
			const
				{dataSize, overhang, updateStatesAndBounds} = props,
				{firstIndex, prevProps: {dataSize: prevDataSize}} = state,
				{dimensionToExtent, maxFirstIndex, primary, moreInfo} = state.metrics,
				numOfItems = Math.min(dataSize, dimensionToExtent * (Math.ceil(primary.clientSize / primary.gridSize) + overhang)),
				wasFirstIndexMax = ((maxFirstIndex < moreInfo.firstVisibleIndex - dimensionToExtent) && (firstIndex === maxFirstIndex)),
				dataSizeDiff = dataSize - prevDataSize;

			VirtualListCore.calculateScrollBounds(props, state);
			VirtualListCore.calculateMoreInfo(props, state);

			if (!(updateStatesAndBounds && updateStatesAndBounds({
				cbScrollTo: props.cbScrollTo,
				numOfItems,
				dataSize,
				moreInfo
			}))) {
				VirtualListCore.calculateFirstIndexAndThreshold(props, state, wasFirstIndexMax, dataSizeDiff);
			} else {
				state.firstIndex = firstIndex;
				VirtualListCore.calculateThreshold(state);
			}

			state.cc = [];
			state.metrics = {
				...state.metrics,
				maxFirstIndex: Math.ceil((dataSize - numOfItems) / dimensionToExtent) * dimensionToExtent
			};
			state.numOfItems = numOfItems;
		}

		static calculateFirstIndexAndThreshold (props, state, wasFirstIndexMax, dataSizeDiff) {
			const
				{overhang} = props,
				{firstIndex, scrollPosition} = state,
				{dimensionToExtent, isPrimaryDirectionVertical, maxFirstIndex, primary, scrollBounds, threshold} = state.metrics,
				{gridSize} = primary;

			if (wasFirstIndexMax && dataSizeDiff > 0) { // If dataSize increased from bottom, we need adjust firstIndex
				// If this is a gridlist and dataSizeDiff is smaller than 1 line, we are adjusting firstIndex without threshold change.
				if (dimensionToExtent > 1 && dataSizeDiff < dimensionToExtent) {
					state.firstIndex = maxFirstIndex;
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
					state.firstIndex = Math.min(maxFirstIndex, expectedFirstIndex * dimensionToExtent);
					state.metrics = {
						...state.metrics,
						// We need to update threshold also since we moved the firstIndex
						threshold: {
							max: Math.min(maxPos, threshold.max + gridSize),
							min: Math.min(maxOfMin, threshold.max - gridSize)
						}
					};
				}
			} else { // Other cases, we can keep the min value between firstIndex and maxFirstIndex. No need to change threshold
				state.firstIndex = Math.min(firstIndex, maxFirstIndex);
			}
		}

		static calculateScrollBounds (props, state) {
			const
				{clientSize} = props,
				{containerRef} = state.metrics;

			if (!clientSize && !containerRef) {
				return {};
			}

			const {clientWidth, clientHeight} = clientSize || VirtualListCore.getClientSize(containerRef);

			state.metrics.scrollBounds = {
				clientWidth,
				clientHeight,
				scrollWidth: VirtualListCore.getScrollWidth(props, state),
				scrollHeight: VirtualListCore.getScrollHeight(props, state),
				maxLeft: Math.max(0, state.metrics.scrollBounds.scrollWidth - clientWidth),
				maxTop: Math.max(0, state.metrics.scrollBounds.scrollHeight - clientHeight)
			};
		}

		setContainerSize = () => {
			const {isPrimaryDirectionVertical, scrollBounds} = this.state.metrics;

			if (this.contentRef) {
				this.contentRef.style.width = scrollBounds.scrollWidth + (isPrimaryDirectionVertical ? -1 : 0) + 'px';
				this.contentRef.style.height = scrollBounds.scrollHeight + (isPrimaryDirectionVertical ? 0 : -1) + 'px';
			}
		}

		static calculateMoreInfo (props, state, primaryPosition) {
			const
				{dataSize} = props,
				{dimensionToExtent, primary} = state.metrics,
				{itemSize, gridSize, clientSize} = primary;

			if (dataSize <= 0) {
				state.metrics.moreInfo = {
					firstVisibleIndex: null,
					lastVisibleIndex: null
				};
			} else {
				state.metrics.moreInfo = {
					firstVisibleIndex: (Math.floor((primaryPosition - itemSize) / gridSize) + 1) * dimensionToExtent,
					lastVisibleIndex: Math.min(dataSize - 1, Math.ceil((primaryPosition + clientSize) / gridSize) * dimensionToExtent - 1)
				};
			}
		}

		static calculateThreshold (state) {
			const
				{isPrimaryDirectionVertical, scrollBounds, threshold} = state.metrics,
				maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft;

			if (threshold.max > maxPos) {
				if (maxPos < threshold.base) {
					state.metrics.threshold = {
						max: threshold.base,
						min: -Infinity
					};
				} else {
					state.metrics.threshold = {
						max: threshold.max = maxPos,
						min: threshold.min = maxPos - threshold.base
					};
				}
			}
		}

		// Native only
		scrollToPosition (x, y, rtl = this.props.rtl) {
			if (this.state.metrics.containerRef) {
				this.state.metrics.containerRef.scrollTo(
					(rtl && !this.state.metrics.isPrimaryDirectionVertical) ? this.state.metrics.scrollBounds.maxLeft - x : x, y
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
				{firstIndex} = this.state,
				{dimensionToExtent, isPrimaryDirectionVertical, maxFirstIndex, scrollBounds, threshold} = this.state.metrics,
				{gridSize} = this.state.metrics.primary,
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

			// For scroll performance, we update scrollPosition in this.state directly
			this.state.scrollPosition = pos; // eslint-disable-line react/no-direct-mutation-state
			VirtualListCore.calculateThreshold(this.state, maxPos);
			VirtualListCore.calculateMoreInfo(this.props, this.state, pos);

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

			if (this.state.metrics.isItemSized) {
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

			this.state.cc[key] = React.cloneElement(itemElement, {
				...componentProps,
				className: classNames(css.listItem, itemElement.props.className),
				style: {...itemElement.props.style, ...(this.composeStyle(...rest))}
			});
		}

		applyStyleToHideNode = (index) => {
			const key = index % this.state.numOfItems;
			this.state.cc[key] = <div key={key} style={{display: 'none'}} />;
		}

		positionItems () {
			const
				{dataSize} = this.props,
				{cc, firstIndex, numOfItems, prevProps} = this.state,
				{isPrimaryDirectionVertical, dimensionToExtent, primary, secondary} = this.state.metrics,
				prevFirstIndex = (this.prevFirstIndex === this.state.firstIndex || this.props.childProps && prevProps.childProps !== this.props.childProps) ? -1 : this.prevFirstIndex, // force to re-render items
				diff = firstIndex - prevFirstIndex,
				updateFrom = (cc.length === 0 || 0 >= diff || diff >= numOfItems || prevFirstIndex === -1) ? firstIndex : prevFirstIndex + numOfItems;
			let
				hideTo = 0,
				updateTo = (cc.length === 0 || -numOfItems >= diff || diff > 0 || prevFirstIndex === -1) ? firstIndex + numOfItems : prevFirstIndex;

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
		}

		static getScrollHeight (props, state) {
			return state.metrics.isPrimaryDirectionVertical ? VirtualListCore.getVirtualScrollDimension(props, state) : state.metrics.scrollBounds.clientHeight;
		}

		static getScrollWidth (props, state) {
			return state.metrics.isPrimaryDirectionVertical ? state.metrics.scrollBounds.clientWidth : VirtualListCore.getVirtualScrollDimension(props, state);
		}

		static getVirtualScrollDimension = (props, state) => {
			const
				{dataSize} = state.prevProps,
				{dimensionToExtent, primary} = state.metrics,
				{spacing} = props;

			return (Math.ceil(dataSize / dimensionToExtent) * primary.gridSize) - spacing;
		}

		syncClientSize () {
			const
				{props} = this,
				node = this.state.metrics.containerRef;

			if (!props.clientSize && !node) {
				return false;
			}

			const
				{clientWidth, clientHeight} = props.clientSize || VirtualListCore.getClientSize(node),
				{scrollBounds} = this.state.metrics;

			if (clientWidth !== scrollBounds.clientWidth || clientHeight !== scrollBounds.clientHeight) {
				VirtualListCore.calculateMetrics(props, this.state);
				VirtualListCore.updateStatesAndBounds(props, this.state);
				this.setContainerSize();
				return true;
			}

			return false;
		}

		// render

		initContainerRef = (ref) => {
			if (ref) {
				this.containerRef = ref;
				this.state.metrics.containerRef = ref; // eslint-disable-line react/no-direct-mutation-state
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
				containerClass = (this.state.metrics.isPrimaryDirectionVertical) ? css.vertical : css.horizontal;
			}

			return classNames(css.virtualList, containerClass, className);
		}

		render () {
			const
				{
					className,
					dataSize,
					'data-webos-voice-focused': voiceFocused,
					'data-webos-voice-group-label': voiceGroupLabel,
					itemsRenderer,
					style,
					...rest
				} = this.props,
				{cc, prevProps: {dataSize: prevDataSize, rtl: prevRtl}} = this.state,
				{primary} = this.state.metrics,
				{initItemContainerRef} = this,
				containerClasses = this.mergeClasses(className),
				hasMetricsChanged = VirtualListCore.hasMetricsChanged(this.props, this.state);

			this.hasDataSizeChanged = prevDataSize !== dataSize;

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

			// TBD from calculateScrollBounds()
			if (hasMetricsChanged || this.hasDataSizeChanged) {
				const
					{scrollBounds} = this.state,
					{isPrimaryDirectionVertical} = this.state.metrics,
					maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft;

				if (this.state.scrollPosition > maxPos) {
					this.props.cbScrollTo({position: (isPrimaryDirectionVertical) ? {y: maxPos} : {x: maxPos}, animate: false});
				}
			}

			// TBD from UNSAFE_componentWillReceiveProps()
			if (hasMetricsChanged) {
				// TBD from calculateMetrics()
				if (type === JS && this.contentRef) {
					this.contentRef.style.transform = null;
				}
				this.setContainerSize();
			} else if (this.hasDataSizeChanged) {
				this.setContainerSize();
			} else if (prevRtl !== this.props.rtl) {
				const {x, y} = this.getXY(this.state.scrollPosition, 0);

				this.state.cc = [];
				if (type === Native) {
					this.scrollToPosition(x, y, this.props.rtl);
				} else {
					this.setScrollPosition(x, y, 0, 0, this.props.rtl);
				}
			}

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
