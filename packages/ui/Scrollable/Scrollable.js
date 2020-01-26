/**
 * Unstyled scrollable components and behaviors to be customized by a theme or application.
 *
 * @module ui/Scrollable
 * @exports constants
 * @exports Scrollable
 * @exports ScrollableBase
 * @private
 */

import PropTypes from 'prop-types';
import React, {useRef} from 'react';

import {ResizeContext} from '../Resizable';

import Scrollbar from './Scrollbar';
import useScrollable, {constants} from './useScrollable';

const nop = () => {};

const ScrollableBase = {};

ScrollableBase.displayName = 'ui:ScrollableBase';

ScrollableBase.propTypes = /** @lends ui/Scrollable.Scrollable.prototype */ {
	/**
	 * Render function.
	 *
	 * @type {Function}
	 * @required
	 * @private
	 */
	containerRenderer: PropTypes.func.isRequired,

	/**
	 * Called when adding additional event listeners in a themed component.
	 *
	 * @type {Function}
	 * @private
	 */
	addEventListeners: PropTypes.func,

	/**
	 * Called to execute additional logic in a themed component to show overscroll effect.
	 *
	 * @type {Function}
	 * @private
	 */
	applyOverscrollEffect: PropTypes.func,

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
	 *	cbScrollTo: (fn) => {scrollTo = fn;}
	 *	// You can simply call like below;
	 *	scrollTo({align: 'top'}); // scroll to the top
	 * ```
	 *
	 * @type {Function}
	 * @public
	 */
	cbScrollTo: PropTypes.func,

	/**
	 * Called to execute additional logic in a themed component to clear overscroll effect.
	 *
	 * @type {Function}
	 * @private
	 */
	clearOverscrollEffect: PropTypes.func,

	/**
	 * Client size of the container; valid values are an object that has `clientWidth` and `clientHeight`.
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
	 * Direction of the list or the scroller.
	 *
	 * `'both'` could be only used for[Scroller]{@link ui/Scroller.Scroller}.
	 *
	 * Valid values are:
	 * * `'both'`,
	 * * `'horizontal'`, and
	 * * `'vertical'`.
	 *
	 * @type {String}
	 * @private
	 */
	direction: PropTypes.oneOf(['both', 'horizontal', 'vertical']),

	/**
	 * Called when resizing window
	 *
	 * @type {Function}
	 * @private
	 */
	handleResizeWindow: PropTypes.func,

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
	horizontalScrollbar: PropTypes.oneOf(['auto', 'visible', 'hidden']),

	/**
	 * Prevents scroll by dragging or flicking on the list or the scroller.
	 *
	 * @type {Boolean}
	 * @default false
	 * @private
	 */
	noScrollByDrag: PropTypes.bool,

	/**
	 * Prevents scroll by wheeling on the list or the scroller.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	noScrollByWheel: PropTypes.bool,

	/**
	 * Called when triggering a drag event in JavaScript scroller.
	 *
	 * @type {Function}
	 * @private
	 */
	onDrag: PropTypes.func,

	/**
	 * Called when triggering a dragend event in JavaScript scroller.
	 *
	 * @type {Function}
	 * @private
	 */
	onDragEnd: PropTypes.func,

	/**
	 * Called when triggering a dragstart event in JavaScript scroller.
	 *
	 * @type {Function}
	 * @private
	 */
	onDragStart: PropTypes.func,

	/**
	 * Called when flicking with a mouse or a touch screen.
	 *
	 * @type {Function}
	 * @private
	 */
	onFlick: PropTypes.func,

	/**
	 * Called when pressing a key.
	 *
	 * @type {Function}
	 * @private
	 */
	onKeyDown: PropTypes.func,

	/**
	 * Called when triggering a mousedown event.
	 *
	 * @type {Function}
	 * @private
	 */
	onMouseDown: PropTypes.func,

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
	onScroll: PropTypes.func,

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
	 *		 onScrollStart={onScrollStart}
	 *		 ...
	 *	 />
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
	onScrollStart: PropTypes.func,

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
	 *		 onScrollStop={onScrollStop}
	 *		 ...
	 *	 />
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
	onScrollStop: PropTypes.func,

	/**
	 * Called when wheeling.
	 *
	 * @type {Function}
	 * @private
	 */
	onWheel: PropTypes.func,

	/**
	 * Specifies overscroll effects shows on which type of inputs.
	 *
	 * @type {Object}
	 * @default {drag: false, pageKey: false, wheel: false}
	 * @private
	 */
	overscrollEffectOn: PropTypes.shape({
		drag: PropTypes.bool,
		pageKey: PropTypes.bool,
		wheel: PropTypes.bool
	}),

	/**
	 * Called when removing additional event listeners in a themed component.
	 *
	 * @type {Function}
	 * @private
	 */
	removeEventListeners: PropTypes.func,

	/**
	 * Indicates the content's text direction is right-to-left.
	 *
	 * @type {Boolean}
	 * @private
	 */
	rtl: PropTypes.bool,

	/**
	 * Called to execute additional logic in a themed component after scrolling in native scroller.
	 *
	 * @type {Function}
	 * @private
	 */
	scrollStopOnScroll: PropTypes.func,

	/**
	 * Called to execute additional logic in a themed component when scrollTo is called.
	 *
	 * @type {Function}
	 * @private
	 */
	scrollTo: PropTypes.func,

	/**
	 * Called to execute additional logic in a themed component when scroll starts in native scroller.
	 *
	 * @type {Function}
	 * @private
	 */
	start: PropTypes.func,

	/**
	 * Called to execute additional logic in a themed component when scroll stops.
	 *
	 * @type {Function}
	 * @private
	 */
	stop: PropTypes.func,

	/**
	 * TBD
	 */
	type: PropTypes.string,

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
	verticalScrollbar: PropTypes.oneOf(['auto', 'visible', 'hidden'])
};

ScrollableBase.defaultProps = {
	cbScrollTo: nop,
	horizontalScrollbar: 'auto',
	noScrollByDrag: false,
	noScrollByWheel: false,
	onScroll: nop,
	onScrollStart: nop,
	onScrollStop: nop,
	overscrollEffectOn: {drag: false, pageKey: false, wheel: false},
	type: 'JS',
	verticalScrollbar: 'auto'
};

/**
 * An unstyled component that provides horizontal and vertical scrollbars and makes a render prop element scrollable.
 *
 * @function Scrollable
 * @memberof ui/Scrollable
 * @extends ui/Scrollable.ScrollableBase
 * @ui
 * @private
 */
const Scrollable = (props) => {
	// render
	const {childRenderer, ...rest} = props;

	const scrollableContainerRef = useRef(null);
	const horizontalScrollbarRef = useRef();
	const verticalScrollbarRef = useRef();

	const {
		scrollableProps: {isHorizontalScrollbarVisible, isVerticalScrollbarVisible},
		resizeContextProps,
		scrollableContainerProps,
		flexLayoutProps,
		childWrapper: ChildWrapper,
		childWrapperProps,
		childProps,
		verticalScrollbarProps,
		horizontalScrollbarProps
	} = useScrollable({
		...rest,
		get horizontalScrollbarRef () {
			return horizontalScrollbarRef;
		},
		overscrollEffectOn: props.overscrollEffectOn || { // FIXME
			arrowKey: false,
			drag: false,
			pageKey: false,
			scrollbarButton: false,
			wheel: true
		},
		scrollableContainerRef,
		type: rest.type || 'JS', // FIXME
		get verticalScrollbarRef () {
			return verticalScrollbarRef;
		}
	});

	return (
		<ResizeContext.Provider {...resizeContextProps}>
			<div {...scrollableContainerProps} ref={scrollableContainerRef}>
				<div {...flexLayoutProps}>
					<ChildWrapper {...childWrapperProps}>
						{childRenderer(childProps)}
					</ChildWrapper>
					{isVerticalScrollbarVisible ? <Scrollbar {...verticalScrollbarProps} ref={verticalScrollbarRef} /> : null}
				</div>
				{isHorizontalScrollbarVisible ? <Scrollbar {...horizontalScrollbarProps} ref={horizontalScrollbarRef} /> : null}
			</div>
		</ResizeContext.Provider>
	);
};

Scrollable.displayName = 'ui:Scrollable';

Scrollable.propTypes = /** @lends ui/Scrollable.Scrollable.prototype */ {
	/**
	 * Render function.
	 *
	 * @type {Function}
	 * @required
	 * @private
	 */
	childRenderer: PropTypes.func.isRequired
};

ScrollableBase.defaultProps = {
	overscrollEffectOn: {
		arrowKey: false,
		drag: false,
		pageKey: false,
		scrollbarButton: false,
		wheel: true
	},
	type: 'JS'
};

export default Scrollable;
export {
	constants,
	Scrollable,
	ScrollableBase,
	useScrollable
};
