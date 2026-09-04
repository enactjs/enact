/**
 * Unstyled virtual list components and behaviors to be customized by a theme or application.
 *
 * @module ui/VirtualList
 * @exports gridListImageSizeShape
 * @exports itemSizesShape
 * @exports VirtualGridList
 * @exports VirtualList
 * @exports VirtualListBasic
 */

import {setDefaultProps} from '@enact/core/util';

import {ResizeContext} from '../Resizable';
import useScroll from '../useScroll';
import Scrollbar from '../useScroll/Scrollbar';

import {type gridListItemSizeShape, type itemSizesShape, VirtualListBasic} from './VirtualListBasic';
import {Callback} from '../types';

export interface ScrollToProps {
	align?: 'left' | 'right' |'top' | 'bottom' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
	animate?: boolean;
	focus?: boolean;
	index?: number;
	node?: HTMLElement;
	position?: {x: number, y: number};
}

export interface VirtualListProps /** @lends ui/VirtualList.VirtualList.prototype */ {
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
	 * @type {Function}
	 * @public
	 */
	cbScrollTo: Callback<any, ScrollToProps>,

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
	direction: 'horizontal' | 'vertical',

	/**
	 * Specifies how to show horizontal scrollbar.
	 *
	 * Valid values are:
	 * * `'auto'`,
	 * * `'visible'`, and
	 * * `'hidden'`.
	 *
	 * @type {String}
	 * @default 'auto'
	 * @public
	 */
	horizontalScrollbar: 'auto' | 'visible' | 'hidden',

	/**
	 * Prevents scroll by dragging or flicking on the list.
	 *
	 * @type {Boolean}
	 * @default false
	 * @private
	 */
	noScrollByDrag: boolean,

	/**
	 * Prevents scroll by wheeling on the list.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	noScrollByWheel: boolean,

	/**
	 * Called when scrolling.
	 *
	 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`.
	 * It is not recommended to set this prop since it can cause performance degradation.
	 * Use `onScrollStart` or `onScrollStop` instead.
	 *
	 * @type {Function}
	 * @param {Object} event
	 * @param {Number} event.scrollLeft Scroll left value.
	 * @param {Number} event.scrollTop Scroll top value.
	 * @param {Object} event.moreInfo The object including `firstVisibleIndex` and `lastVisibleIndex` properties.
	 * @public
	 */
	onScroll: Callback<any, {scrollLeft: number, scrollTop: number, moreInfo: {firstVisibleIndex: number, lastVisibleIndex: number}}>,

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
	 * @type {Function}
	 * @param {Object} event
	 * @param {Number} event.scrollLeft Scroll left value.
	 * @param {Number} event.scrollTop Scroll top value.
	 * @param {Object} event.moreInfo The object including `firstVisibleIndex` and `lastVisibleIndex` properties.
	 * @public
	 */
	onScrollStart: Callback<any, {scrollLeft: number, scrollTop: number, moreInfo: {firstVisibleIndex: number, lastVisibleIndex: number}}>,

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
	 * @type {Function}
	 * @param {Object} event
	 * @param {Number} event.scrollLeft Scroll left value.
	 * @param {Number} event.scrollTop Scroll top value.
	 * @param {Object} event.moreInfo The object including `firstVisibleIndex` and `lastVisibleIndex` properties.
	 * @public
	 */
	onScrollStop: Callback<any, {scrollLeft: number, scrollTop: number, moreInfo: {firstVisibleIndex: number, lastVisibleIndex: number}}>,

	/**
	 * Specifies overscroll effects shows on which type of inputs.
	 *
	 * @type {Object}
	 * @default {drag: false, pageKey: false, wheel: false}
	 * @private
	 */
	overscrollEffectOn: {drag: boolean, pageKey: boolean, wheel: boolean},

	/**
	 * The ARIA role for the list.
	 *
	 * @type {String}
	 * @default 'list'
	 * @public
	 */
	role: string,

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
	scrollMode: string,

	/**
	 * Specifies how to show vertical scrollbar.
	 *
	 * Valid values are:
	 * * `'auto'`,
	 * * `'visible'`, and
	 * * `'hidden'`.
	 *
	 * @type {String}
	 * @default 'auto'
	 * @public
	 */
	verticalScrollbar: 'auto' | 'visible' | 'hidden'
}

export interface VirtualGridListProps extends VirtualListProps /** @lends ui/VirtualList.VirtualGridList.prototype */ {
	/**
	 * Called when scroll starts.
	 *
	 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`.
	 * You can get firstVisibleIndex and lastVisibleIndex from VirtualGridList with `moreInfo`.
	 *
	 * Example:
	 * ```
	 * onScrollStart = ({scrollLeft, scrollTop, moreInfo}) => {
	 *     const {firstVisibleIndex, lastVisibleIndex} = moreInfo;
	 *     // do something with firstVisibleIndex and lastVisibleIndex
	 * }
	 *
	 * render = () => (
	 *     <VirtualGridList
	 *         ...
	 *         onScrollStart={this.onScrollStart}
	 *         ...
	 *     />
	 * )
	 * ```
	 *
	 * @type {Function}
	 * @param {Object} event
	 * @param {Number} event.scrollLeft Scroll left value.
	 * @param {Number} event.scrollTop Scroll top value.
	 * @param {Object} event.moreInfo The object including `firstVisibleIndex` and `lastVisibleIndex` properties.
	 * @public
	 */
	onScrollStart: Callback<any, {scrollLeft: number, scrollTop: number, moreInfo: {firstVisibleIndex: number, lastVisibleIndex: number}}>,

	/**
	 * Called when scroll stops.
	 *
	 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`.
	 * You can get firstVisibleIndex and lastVisibleIndex from VirtualGridList with `moreInfo`.
	 *
	 * Example:
	 * ```
	 * onScrollStop = ({scrollLeft, scrollTop, moreInfo}) => {
	 *     const {firstVisibleIndex, lastVisibleIndex} = moreInfo;
	 *     // do something with firstVisibleIndex and lastVisibleIndex
	 * }
	 *
	 * render = () => (
	 *     <VirtualGridList
	 *         ...
	 *         onScrollStop={this.onScrollStop}
	 *         ...
	 *     />
	 * )
	 * ```
	 *
	 * @type {Function}
	 * @param {Object} event
	 * @param {Number} event.scrollLeft Scroll left value.
	 * @param {Number} event.scrollTop Scroll top value.
	 * @param {Object} event.moreInfo The object including `firstVisibleIndex` and `lastVisibleIndex` properties.
	 * @public
	 */
	onScrollStop: Callback<any, {scrollLeft: number, scrollTop: number, moreInfo: {firstVisibleIndex: number, lastVisibleIndex: number}}>,
}

const nop = () => {};

const virtualListDefaultProps: VirtualListProps = {
	cbScrollTo: nop,
	direction: 'vertical',
	horizontalScrollbar: 'auto',
	noScrollByDrag: false,
	noScrollByWheel: false,
	onScroll: nop,
	onScrollStart: nop,
	onScrollStop: nop,
	overscrollEffectOn: {
		drag: false,
		pageKey: false,
		wheel: false
	},
	role: 'list',
	scrollMode: 'translate',
	verticalScrollbar: 'auto'
};

/**
 * An unstyled scrollable virtual list component with touch support.
 *
 * @class VirtualList
 * @memberof ui/VirtualList
 * @extends ui/VirtualList.VirtualListBasic
 * @ui
 * @public
 */
const VirtualList = (props: VirtualListProps) => {
	// Hooks

	const virtualListProps = setDefaultProps(props, virtualListDefaultProps);

	const {
		scrollContentHandle,
		scrollContentWrapper: ScrollContentWrapper,
		isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible,

		resizeContextProps,
		scrollContainerProps,
		scrollInnerContainerProps,
		scrollContentWrapperProps,
		scrollContentProps,
		verticalScrollbarProps,
		horizontalScrollbarProps
	} = useScroll(virtualListProps);

	// Render

	return (
		<ResizeContext {...resizeContextProps}>
			<div {...scrollContainerProps}>
				<div {...scrollInnerContainerProps}>
					<ScrollContentWrapper {...scrollContentWrapperProps}>
						<VirtualListBasic
							{...scrollContentProps}
							ref={scrollContentHandle}
						/>
					</ScrollContentWrapper>
					{isVerticalScrollbarVisible ? <Scrollbar {...verticalScrollbarProps} /> : null}
				</div>
				{isHorizontalScrollbarVisible ? <Scrollbar {...horizontalScrollbarProps} /> : null}
			</div>
		</ResizeContext>
	);
};

VirtualList.displayName = 'ui:VirtualList';

VirtualList.defaultPropValues = virtualListDefaultProps;

const virtualGridListDefaultProps: VirtualGridListProps = {
	cbScrollTo: nop,
	direction: 'vertical',
	horizontalScrollbar: 'auto',
	noScrollByDrag: false,
	noScrollByWheel: false,
	onScroll: nop,
	onScrollStart: nop,
	onScrollStop: nop,
	overscrollEffectOn: {
		drag: false,
		pageKey: false,
		wheel: false
	},
	role: 'list',
	scrollMode: 'translate',
	verticalScrollbar: 'auto'
};

/**
 * An unstyled scrollable virtual grid list component with touch support.
 *
 * @class VirtualGridList
 * @memberof ui/VirtualList
 * @extends ui/VirtualList.VirtualListBasic
 * @ui
 * @public
 */
const VirtualGridList = (props: VirtualGridListProps) => {
	const virtualGridListProps = setDefaultProps(props, virtualGridListDefaultProps);

	const {
		scrollContentHandle,
		scrollContentWrapper: ScrollContentWrapper,
		isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible,

		resizeContextProps,
		scrollContainerProps,
		scrollInnerContainerProps,
		scrollContentWrapperProps,
		scrollContentProps,
		verticalScrollbarProps,
		horizontalScrollbarProps
	} = useScroll(virtualGridListProps);

	return (
		<ResizeContext {...resizeContextProps}>
			<div {...scrollContainerProps}>
				<div {...scrollInnerContainerProps}>
					<ScrollContentWrapper {...scrollContentWrapperProps}>
						<VirtualListBasic
							{...scrollContentProps}
							ref={scrollContentHandle}
						/>
					</ScrollContentWrapper>
					{isVerticalScrollbarVisible ? <Scrollbar {...verticalScrollbarProps} /> : null}
				</div>
				{isHorizontalScrollbarVisible ? <Scrollbar {...horizontalScrollbarProps} /> : null}
			</div>
		</ResizeContext>
	);
};

VirtualGridList.displayName = 'ui:VirtualGridList';

VirtualGridList.defaultPropValues = virtualGridListDefaultProps;

export default VirtualList;
export {
	type gridListItemSizeShape,
	type itemSizesShape,
	VirtualGridList,
	VirtualList,
	VirtualListBasic
};
