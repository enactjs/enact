import classNames from 'classnames';
import {forward} from '@enact/core/handle';
import PropTypes from 'prop-types';
import equals from 'ramda/src/equals';
import React, {useEffect, useLayoutEffect, useRef, useState, useCallback} from 'react';


import useCalculateMetrics from './useCalculateMetrics';
import useDifferentSizeItems from './useDifferentSizeItems';
import useMoreInfo from './useMoreInfo';
import usePositionItems from './usePositionItems';
import useScrollPosition from './useScrollPosition';
import useVirtualMetrics from './useVirtualMetrics';

import css from './VirtualList.module.less';

const nop = () => {};

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
 * @function VirtualListCore
 * @memberof ui/VirtualList
 * @ui
 * @private
 */
const VirtualListBase = (props) => {
	const type = props.type;
	/* No displayName here. We set displayName to returned components of this factory function. */
	const {uiChildContainerRef} = props;
	const contentRef = useRef();
	const itemContainerRef = useRef();

	const [updateFromTo, setUpdateFromTo] = useState({from: 0, to: 0});
	const [firstIndex, setFirstIndex] = useState(0);
	const [numOfItems, setNumOfItems] = useState(0);

	// Mutable value

	const variables = useRef({
		isMounted: false,

		primary: null,
		secondary: null,

		isPrimaryDirectionVertical: true,
		isItemSized: false,

		shouldUpdateBounds: false,

		dimensionToExtent: 0,
		threshold: 0,
		maxFirstIndex: 0,
		curDataSize: 0,
		hasDataSizeChanged: false,
		cc: [],
		scrollPosition: 0,
		scrollPositionTarget: 0,

		// For individually sized item
		itemPositions: [],
		indexToScrollIntoView: -1,

		deferScrollTo: false,

		prevChildProps: null,
		prevFirstIndex: 0,

		prevProps: {
			dataSize: null,
			direction: null,
			overhang: null,
			spacing: null,
			itemSize: null,
			rtl: null
		}
	});

	if (props.clientSize && variables.current.isMounted === false) {
		calculateMetrics(props);
		setStatesAndUpdateBounds();

		variables.current.isMounted = true;
	}

	// Hooks

	const instance = {contentRef, uiChildContainerRef, virtualListBase: {...variables, firstIndex, updateFromTo}};

	const {getMoreInfo, updateMoreInfo} = useMoreInfo(props, instance, {numOfItems});

	const {
		getGridPosition,
		getItemBottomPosition,
		getItemPosition,
		getXY,
		gridPositionToItemPosition,
		getItemTopPositionFromPreviousItemBottomPosition
	} = useVirtualMetrics(props, instance);

	const {
		calculateMetrics,
		getScrollBounds,
		setContainerSize,
		setStatesAndUpdateBounds,
		syncClientSize,
		syncThreshold,
		updateScrollBoundsWithItemPositions
	} = useCalculateMetrics(props, instance, {getMoreInfo, numOfItems, setFirstIndex, setNumOfItems, updateMoreInfo});

	const {
		didScroll,
		scrollToPosition,
		setScrollPosition,
		updateScrollPosition
	} = useScrollPosition(props, instance, {getScrollBounds, setFirstIndex, syncThreshold, updateMoreInfo, updateScrollBoundsWithItemPositions});

	const {positionItems} = usePositionItems(props, instance, {getGridPosition, getXY, numOfItems, updateScrollBoundsWithItemPositions});

	const {adjustItemPositionWithItemSize, calculateAndCacheItemPosition} = useDifferentSizeItems(props, instance, {getItemTopPositionFromPreviousItemBottomPosition, numOfItems, updateMoreInfo});

	// getDerivedStateFromProps
	useLayoutEffect(() => {
		const
			{prevChildProps, prevFirstIndex} = variables.current,
			shouldInvalidate = (
				prevFirstIndex === firstIndex ||
				prevChildProps !== props.childProps	// TODO : Reconsider this comparison is actually meaningful.
			),
			diff = firstIndex - prevFirstIndex,
			newUpdateTo = (-numOfItems >= diff || diff > 0 || shouldInvalidate) ? firstIndex + numOfItems : prevFirstIndex,
			newUpdateFrom = (0 >= diff || diff >= numOfItems || shouldInvalidate) ? firstIndex : prevFirstIndex + numOfItems;

		if (updateFromTo.from !== newUpdateFrom || updateFromTo.to !== newUpdateTo) {
			setUpdateFromTo({from: newUpdateFrom, to: newUpdateTo});
		}
		variables.current.prevChildProps = props.childProps;
		variables.current.prevFirstIndex = firstIndex;
	}, [firstIndex, numOfItems, props.childProps, updateFromTo]);

	const emitUpdateItems = useCallback(() => {
		const {dataSize} = props;

		forward('onUpdateItems', {
			firstIndex: firstIndex,
			lastIndex: Math.min(firstIndex + numOfItems, dataSize)
		}, props);
	}, [props, firstIndex, numOfItems]);

	// Calculate metrics for VirtualList after the 1st render to know client W/H.
	useEffect(() => {
		if (!props.clientSize) {
			calculateMetrics(props);
			setStatesAndUpdateBounds();
		} else {
			emitUpdateItems();
		}

		if (props.itemSizes) {
			adjustItemPositionWithItemSize();
		} else {
			setContainerSize();
		}
	}, []);

	useEffect(() => {
		// if (prevState.firstIndex !== firstIndex || prevState.numOfItems !== numOfItems)
		emitUpdateItems();
	}, [firstIndex, numOfItems, emitUpdateItems]);

	useEffect(() => {
		variables.current.deferScrollTo = false;

		variables.current.shouldUpdateBounds = false;

		// When an item expands or shrinks,
		// we need to calculate the item position again and
		// the item needs to scroll into view if the item does not show fully.
		if (props.itemSizes) {
			if (variables.current.itemPositions.length > props.itemSizes.length) {
				// The item with `props.itemSizes.length` index is not rendered yet.
				// So the item could scroll into view after it rendered.
				// To do it, `props.itemSizes.length` value is cached in `indexToScrollIntoView`.
				variables.current.indexToScrollIntoView = props.itemSizes.length;

				variables.current.itemPositions = [...variables.current.itemPositions.slice(0, props.itemSizes.length)];
				adjustItemPositionWithItemSize();
			} else {
				const {indexToScrollIntoView} = variables.current;

				adjustItemPositionWithItemSize();

				if (indexToScrollIntoView !== -1) {
					// Currently we support expandable items in only vertical VirtualList.
					// So the top and bottom of the boundaries are checked.
					const
						scrollBounds = {top: variables.current.scrollPosition, bottom: variables.current.scrollPosition + variables.current.scrollBounds.clientHeight},
						itemBounds = {top: getGridPosition(indexToScrollIntoView).primaryPosition, bottom: getItemBottomPosition(indexToScrollIntoView)};

					if (itemBounds.top < scrollBounds.top) {
						props.cbScrollTo({
							index: indexToScrollIntoView,
							stickTo: 'start',
							animate: true
						});
					} else if (itemBounds.bottom > scrollBounds.bottom) {
						props.cbScrollTo({
							index: indexToScrollIntoView,
							stickTo: 'end',
							animate: true
						});
					}
				}

				variables.current.indexToScrollIntoView = -1;
			}
		}
	});

	useEffect(() => {
		const {prevProps} = variables.current;

		if (
			prevProps.direction !== props.direction ||
			prevProps.overhang !== props.overhang ||
			prevProps.spacing !== props.spacing ||
			!equals(prevProps.itemSize, props.itemSize)
		) {
			const {x, y} = getXY(variables.current.scrollPosition, 0);

			calculateMetrics(props);
			setStatesAndUpdateBounds();

			setContainerSize();

			const {clientHeight, clientWidth, scrollHeight, scrollWidth} = variables.current.scrollBounds;
			const xMax = scrollWidth - clientWidth;
			const yMax = scrollHeight - clientHeight;

			updateScrollPosition({
				x: xMax > x ? x : xMax,
				y: yMax > y ? y : yMax
			});

			variables.current.deferScrollTo = true;
		}
	});
	// TODO: Origin def = [props.direction, props.overhang, props.spacing, props.itemSize]
	// This part made bug that initial rendering is not done util scroll (ahn)

	useEffect(() => {
		// TODO: remove `hasDataSizeChanged` and fix ui/Scrollable*
		variables.current.hasDataSizeChanged = true; // (prevProps.dataSize !== this.props.dataSize);

		if (!variables.current.deferScrollTo && variables.current.hasDataSizeChanged) {
			setStatesAndUpdateBounds();

			setContainerSize();

			variables.current.deferScrollTo = true;
		}
	}, [props.dataSize]);

	useEffect(() => {
		// else if (prevProps.rtl !== this.props.rtl)
		if (!variables.current.deferScrollTo) {
			updateScrollPosition(getXY(variables.current.scrollPosition, 0));
		}
	}, [props.rtl]);

	useEffect(() => {
		const scrollBounds = getScrollBounds();
		const maxPos = variables.current.isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft;

		if (!variables.current.deferScroll && variables.current.scrollPosition > maxPos) {
			props.cbScrollTo({position: (variables.current.isPrimaryDirectionVertical) ? {y: maxPos} : {x: maxPos}, animate: false});
		}
	});

	// setUiChildAdapter

	useEffect(() => {
		props.setUiChildAdapter({
			calculateMetrics,
			didScroll,
			get dimensionToExtent () {
				return variables.current.dimensionToExtent;
			},
			getGridPosition,
			getItemBottomPosition,
			getItemNode,
			getItemPosition,
			getMoreInfo,
			getScrollBounds,
			gridPositionToItemPosition,
			get hasDataSizeChanged () {
				return variables.current.hasDataSizeChanged
			},
			isHorizontal,
			get isPrimaryDirectionVertical () {
				return variables.current.isPrimaryDirectionVertical;
			},
			isVertical,
			get itemPositions () {
				return variables.current.itemPositions;
			},
			get numOfItems () {
				return numOfItems
			},
			get primary () {
				return variables.current.primary;
			},
			props,
			get scrollPosition () {
				return variables.current.scrollPosition;
			},
			get scrollPositionTarget () {
				return variables.current.scrollPositionTarget;
			},
			scrollToPosition,
			setScrollPosition,
			syncClientSize
		});
	}, []);

	// Functions

	function isVertical () {
		return variables.current.isPrimaryDirectionVertical;
	}

	function isHorizontal () {
		return !variables.current.isPrimaryDirectionVertical;
	}

	function getItemNode (index) {
		const ref = itemContainerRef.current;

		return ref ? ref.children[index % numOfItems] : null;
	}

	// Render

	const
		{className, 'data-webos-voice-focused': voiceFocused, 'data-webos-voice-group-label': voiceGroupLabel, 'data-webos-voice-disabled': voiceDisabled, itemsRenderer, style, ...rest} = props,
		containerClasses = classNames(
			css.virtualList,
			(type === 'Native') ? variables.current.isPrimaryDirectionVertical ? css.vertical : css.horizontal : null,
			className
		),
		contentClasses = (type === 'Native') ? null : css.content;

	delete rest.cbScrollTo;
	delete rest.childProps;
	delete rest.clientSize;
	delete rest.dangerouslyContainsInScrollable;
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
	delete rest.setChildAdapter;
	delete rest.spacing;
	delete rest.uiChildContainerRef;
	delete rest.updateStatesAndBounds;

	if (variables.current.primary) {
		positionItems();
	}

	variables.current.prevProps = {
		dataSize: props.dataSize,
		direction: props.direction,
		overhang: props.overhang,
		spacing: props.spacing,
		itemSize: props.itemSize,
		rtl: props.rtl
	};

	return (
		<div className={containerClasses} data-webos-voice-focused={voiceFocused} data-webos-voice-group-label={voiceGroupLabel} data-webos-voice-disabled={voiceDisabled} ref={uiChildContainerRef} style={style}>
			<div {...rest} className={contentClasses} ref={contentRef}>
				{itemsRenderer({cc: variables.current.cc, itemContainerRef, primary: variables.current.primary})}
			</div>
		</div>
	);
};

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
 *	 const {firstVisibleIndex, lastVisibleIndex} = moreInfo;
 *	 // do something with firstVisibleIndex and lastVisibleIndex
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
