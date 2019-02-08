import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import shallowEqual from 'recompose/shallowEqual';

import Scrollable from '../Scrollable';
import ScrollableNative from '../Scrollable/ScrollableNative';

import {
	calculateMetrics,
	defaultMetrics,
	hasDataSizeChanged,
	hasMetricsChanged,
	initializeMetrics,
	updateMetrics,
	updateScrollPosition
} from './metrics';
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

		static defaultState = {
			metrics: {},
			prevProps: {}
		}

		constructor (props) {
			super(props);

			this.state = {
				...VirtualListCore.defaultState,
				metrics: {
					...defaultMetrics
				},
				prevProps: {...props}
			};

			if (props.clientSize) {
				this.setState((state) => initializeMetrics(props, state));
			}
		}

		static getDerivedStateFromProps (props, state) {
			const
				metricsChanged = hasMetricsChanged(props, state),
				dataSizeChanged = hasDataSizeChanged(props, state);

			return (metricsChanged || dataSizeChanged) ? // If dataSize has been changed, we need to update numOfItems state.
				updateMetrics(
					state.prevProps,
					state,
					props,
					metricsChanged
				) :
				null;
		}

		// Calculate metrics for VirtualList after the 1st render to know client W/H.
		componentDidMount () {
			if (!this.props.clientSize) {
				this.setState((state) => { // eslint-disable-line react/no-did-mount-set-state
					const nextState = initializeMetrics(this.props, state);
					this.setContainerSize(nextState);
				});
			} else {
				this.setContainerSize(this.state);
			}
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

		getClientSize = (node) => ({
			clientWidth: node.clientWidth,
			clientHeight: node.clientHeight
		})

		calculateMetrics = () => {
			calculateMetrics(this.props, this.state);
		}

		setContainerSize = (state) => {
			const {isPrimaryDirectionVertical, scrollBounds} = state.metrics;

			if (this.contentRef) {
				this.contentRef.style.width = scrollBounds.scrollWidth + (isPrimaryDirectionVertical ? -1 : 0) + 'px';
				this.contentRef.style.height = scrollBounds.scrollHeight + (isPrimaryDirectionVertical ? 0 : -1) + 'px';
			}
		}

		// Native only
		scrollToPosition (x, y, rtl = this.props.rtl) {
			const {isPrimaryDirectionVertical, scrollBounds} = this.state.metrics;
			if (this.containerRef) {
				this.containerRef.scrollTo(
					(rtl && !isPrimaryDirectionVertical) ? scrollBounds.maxLeft - x : x, y
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

		didScroll (...param) {
			const nextState = updateScrollPosition(this.props, this.state, ...param);
			if (nextState) {
				this.setState(nextState);
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

			this.state.cc[key] = React.cloneElement(itemElement, { // eslint-disable-line react/no-direct-mutation-state
				...componentProps,
				className: classNames(css.listItem, itemElement.props.className),
				style: {...itemElement.props.style, ...(this.composeStyle(...rest))}
			});
		}

		applyStyleToHideNode = (index) => {
			const key = index % this.state.numOfItems;
			this.state.cc[key] = <div key={key} style={{display: 'none'}} />; // eslint-disable-line react/no-direct-mutation-state
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

		syncClientSize = () => {
			const
				{props} = this,
				node = this.containerRef;

			if (!props.clientSize && !node) {
				return false;
			}

			const
				{clientWidth, clientHeight} = props.clientSize || this.getClientSize(node),
				{scrollBounds} = this.state.metrics;

			if (clientWidth !== scrollBounds.clientWidth || clientHeight !== scrollBounds.clientHeight) {
				this.setState((state) => {
					const nextState = initializeMetrics(this.props, state);
					this.setContainerSize(nextState);
				});
				return true;
			}

			return false;
		}

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
					'data-webos-voice-focused': voiceFocused,
					'data-webos-voice-group-label': voiceGroupLabel,
					itemsRenderer,
					style,
					...rest
				} = this.props,
				{cc, prevProps: {rtl: prevRtl}} = this.state,
				{primary} = this.state.metrics,
				{initItemContainerRef} = this,
				containerClasses = this.mergeClasses(className),
				metricsChanged = hasMetricsChanged(this.props, this.state);

			this.hasDataSizeChanged = hasDataSizeChanged(this.props, this.state);

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

			if (metricsChanged || this.hasDataSizeChanged) {
				const
					{isPrimaryDirectionVertical, scrollBounds} = this.state.metrics,
					maxPos = isPrimaryDirectionVertical ? scrollBounds.maxTop : scrollBounds.maxLeft;

				if (this.state.scrollPosition > maxPos) {
					this.props.cbScrollTo({position: (isPrimaryDirectionVertical) ? {y: maxPos} : {x: maxPos}, animate: false});
				}
			}

			if (metricsChanged) {
				if (type === JS && this.contentRef) {
					this.contentRef.style.transform = null;
				}
				this.setContainerSize(this.state);
			} else if (this.hasDataSizeChanged) {
				this.setContainerSize(this.state);
			} else if (prevRtl !== this.props.rtl) {
				const {x, y} = this.getXY(this.state.scrollPosition, 0);

				this.state.cc = []; // eslint-disable-line react/no-direct-mutation-state
				if (type === Native) {
					this.scrollToPosition(x, y, this.props.rtl);
				} else {
					this.setScrollPosition(x, y, 0, 0, this.props.rtl);
				}
			}

			if (primary) {
				this.positionItems();
			}

			if (!shallowEqual(this.props, this.state.prevProps)) {
				this.state.prevProps = this.props; // eslint-disable-line react/no-direct-mutation-state
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
