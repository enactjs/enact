/**
 * Unstyled scroller components and behaviors to be customized by a theme or application.
 *
 * @module ui/Scroller
 * @exports Scroller
 * @exports ScrollerBase
 * @exports ScrollerNative
 */

import classNames from 'classnames';
import {platform} from '@enact/core/platform';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Scrollable from '../Scrollable';
import ScrollableNative from '../Scrollable/ScrollableNative';

import css from './Scroller.module.less';

/**
 * An unstyled base scroller component.
 *
 * In most circumstances, you will want to use the Scrollable version.
 *
 * @class ScrollerBase
 * @memberof ui/Scroller
 * @ui
 * @public
 */
class ScrollerBase extends Component {
	static displayName = 'ui:ScrollerBase'

	static propTypes = /** @lends ui/Scroller.ScrollerBase.prototype */ {
		children: PropTypes.node.isRequired,

		/**
		 * Callback method of scrollTo.
		 * Normally, `Scrollable` should set this value.
		 *
		 * @type {Function}
		 * @private
		 */
		cbScrollTo: PropTypes.func,

		/**
		 * Direction of the scroller.
		 *
		 * Valid values are:
		 * * `'both'`,
		 * * `'horizontal'`, and
		 * * `'vertical'`.
		 *
		 * @type {String}
		 * @default 'both'
		 * @public
		 */
		direction: PropTypes.oneOf(['both', 'horizontal', 'vertical']),

		/**
		 * Prop to check context value if Scrollbar exists or not.
		 *
		 * @type {Boolean}
		 * @private
		 */
		isVerticalScrollbarVisible: PropTypes.bool,

		/**
		 * `true` if RTL, `false` if LTR.
		 *
		 * @type {Boolean}
		 * @private
		 */
		rtl: PropTypes.bool
	}

	static defaultProps = {
		direction: 'both'
	}

	constructor (props) {
		super(props);

		this.containerRef = React.createRef();
	}

	componentDidMount () {
		this.calculateMetrics();
	}

	componentDidUpdate (prevProps) {
		this.calculateMetrics();
		if (this.props.isVerticalScrollbarVisible && !prevProps.isVerticalScrollbarVisible) {
			this.forceUpdate();
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

	scrollPos = {
		top: 0,
		left: 0
	}

	getScrollBounds = () => this.scrollBounds

	getRtlPositionX = (x) => {
		if (this.props.rtl) {
			return (platform.ios || platform.safari) ? -x : this.scrollBounds.maxLeft - x;
		}
		return x;
	}

	// for Scrollable
	setScrollPosition (x, y) {
		const node = this.containerRef.current;

		if (this.isVertical()) {
			node.scrollTop = y;
			this.scrollPos.top = y;
		}
		if (this.isHorizontal()) {
			node.scrollLeft = this.getRtlPositionX(x);
			this.scrollPos.left = x;
		}
	}

	// for ScrollableNative
	scrollToPosition (x, y) {
		this.containerRef.current.scrollTo(this.getRtlPositionX(x), y);
	}

	// for ScrollableNative
	didScroll (x, y) {
		this.scrollPos.left = x;
		this.scrollPos.top = y;
	}

	getNodePosition = (node) => {
		const
			{left: nodeLeft, top: nodeTop, height: nodeHeight, width: nodeWidth} = node.getBoundingClientRect(),
			{left: containerLeft, top: containerTop} = this.containerRef.current.getBoundingClientRect(),
			{scrollLeft, scrollTop} = this.containerRef.current,
			left = this.isHorizontal() ? (scrollLeft + nodeLeft - containerLeft) : null,
			top = this.isVertical() ? (scrollTop + nodeTop - containerTop) : null;

		return {
			left,
			top,
			width: nodeWidth,
			height: nodeHeight
		};
	}

	isVertical = () => {
		return (this.props.direction !== 'horizontal');
	}

	isHorizontal = () => {
		return (this.props.direction !== 'vertical');
	}

	calculateMetrics () {
		const
			{scrollBounds} = this,
			{scrollWidth, scrollHeight, clientWidth, clientHeight} = this.containerRef.current;
		scrollBounds.scrollWidth = scrollWidth;
		scrollBounds.scrollHeight = scrollHeight;
		scrollBounds.clientWidth = clientWidth;
		scrollBounds.clientHeight = clientHeight;
		scrollBounds.maxLeft = Math.max(0, scrollWidth - clientWidth);
		scrollBounds.maxTop = Math.max(0, scrollHeight - clientHeight);
	}

	render () {
		const
			{className, style, ...rest} = this.props,
			mergedStyle = Object.assign({}, style, {
				overflowX: this.isHorizontal() ? 'auto' : 'hidden',
				overflowY: this.isVertical() ? 'auto' : 'hidden'
			});

		delete rest.cbScrollTo;
		delete rest.direction;
		delete rest.rtl;
		delete rest.isVerticalScrollbarVisible;

		return (
			<div
				{...rest}
				className={classNames(className, css.hideNativeScrollbar)}
				ref={this.containerRef}
				style={mergedStyle}
			/>
		);
	}
}

/**
 * A callback function that receives a reference to the `scrollTo` feature.
 *
 * Once received, the `scrollTo` method can be called as an imperative interface.
 *
 * The `scrollTo` function accepts the following paramaters:
 * - {position: {x, y}} - Pixel value for x and/or y position
 * - {align} - Where the scroll area should be aligned. Values are:
 *   `'left'`, `'right'`, `'top'`, `'bottom'`,
 *   `'topleft'`, `'topright'`, `'bottomleft'`, and `'bottomright'`.
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
 * @memberof ui/Scroller.ScrollerBase.prototype
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
 * @memberof ui/Scroller.ScrollerBase.prototype
 * @type {String}
 * @default 'auto'
 * @public
 */

/**
 * Prevents scroll by wheeling on the scroller.
 *
 * @name noScrollByWheel
 * @memberof ui/Scroller.ScrollerBase.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

/**
 * Called when scrolling.
 *
 * Passes `scrollLeft` and `scrollTop`.
 * It is not recommended to set this prop since it can cause performance degradation.
 * Use `onScrollStart` or `onScrollStop` instead.
 *
 * @name onScroll
 * @memberof ui/Scroller.ScrollerBase.prototype
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
 * Passes `scrollLeft` and `scrollTop`.
 *
 * Example:
 * ```
 * onScrollStart = ({scrollLeft, scrollTop}) => {
 *     // do something with scrollLeft and scrollTop
 * }
 *
 * render = () => (
 *     <Scroller
 *         ...
 *         onScrollStart={this.onScrollStart}
 *         ...
 *     />
 * )
 * ```
 *
 * @name onScrollStart
 * @memberof ui/Scroller.ScrollerBase.prototype
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
 * Passes `scrollLeft` and `scrollTop`.
 *
 * Example:
 * ```
 * onScrollStop = ({scrollLeft, scrollTop}) => {
 *     // do something with scrollLeft and scrollTop
 * }
 *
 * render = () => (
 *     <Scroller
 *         ...
 *         onScrollStop={this.onScrollStop}
 *         ...
 *     />
 * )
 * ```
 *
 * @name onScrollStop
 * @memberof ui/Scroller.ScrollerBase.prototype
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
 * @memberof ui/Scroller.ScrollerBase.prototype
 * @type {String}
 * @default 'auto'
 * @public
 */

/**
 * An unstyled scroller.
 *
 * Example:
 * ```
 * <Scroller>Scroll me.</Scroller>
 * ```
 *
 * @class Scroller
 * @memberof ui/Scroller
 * @extends ui/Scrollable.ScrollerBase
 * @ui
 * @public
 */
const Scroller = (props) => (
	<Scrollable
		{...props}
		childRenderer={({initChildRef, ...rest}) => ( // eslint-disable-line react/jsx-no-bind
			<ScrollerBase {...rest} ref={initChildRef} />
		)}
	/>
);

Scroller.propTypes = /** @lends ui/Scroller.Scroller.prototype */ {
	direction: PropTypes.oneOf(['both', 'horizontal', 'vertical'])
};

Scroller.defaultProps = {
	direction: 'both'
};

/**
 * An unstyled native scroller, [ScrollableNative]{@link ui/Scrollable.ScrollableNative} applied.
 * For smooth native scrolling, web engine with below Chromium 61, should be launched
 * with the flag '--enable-blink-features=CSSOMSmoothScroll' to support it.
 * The one with Chromium 61 or above, is launched to support it by default.
 *
 * Example:
 * ```
 * <ScrollerNative>Scroll me.</ScrollerNative>
 * ```
 *
 * @class ScrollerNative
 * @memberof ui/Scroller
 * @extends ui/Scrollable.ScrollableNative
 * @extends ui/Scrollable.ScrollerBase
 * @ui
 * @private
 */
const ScrollerNative = (props) => (
	<ScrollableNative
		{...props}
		childRenderer={({initChildRef, ...rest}) => ( // eslint-disable-line react/jsx-no-bind
			<ScrollerBase {...rest} ref={initChildRef} />
		)}
	/>
);

ScrollerNative.propTypes = /** @lends ui/Scroller.ScrollerNative.prototype */ {
	direction: PropTypes.oneOf(['both', 'horizontal', 'vertical'])
};

ScrollerNative.defaultProps = {
	direction: 'both'
};

export default Scroller;
export {
	Scroller,
	ScrollerBase,
	ScrollerNative
};
