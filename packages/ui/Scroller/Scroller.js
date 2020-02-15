/**
 * Unstyled scroller components and behaviors to be customized by a theme or application.
 *
 * @module ui/Scroller
 * @exports Scroller
 * @exports ScrollerBase
 * @exports ScrollerNative
 */

import {platform} from '@enact/core/platform';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Component, useContext} from 'react';

import {ResizeContext} from '../Resizable';
import {ScrollContext, ScrollContextDecorator, useScroll} from '../Scrollable';
import Scrollbar from '../Scrollable/Scrollbar';

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
		rtl: PropTypes.bool,

		/**
		 * The context from the ScrollContext is needed to share the ScrollBase methods to Scrollable
		 */
		scrollContext: PropTypes.object,

		/**
		 * TBD
		 */
		uiChildContainerRef: PropTypes.object
	}

	static defaultProps = {
		direction: 'both'
	}

	constructor (props) {
		super(props);

		props.scrollContext.current = {
			...props.scrollContext.current,
			didScroll: this.didScroll.bind(this),
			getNodePosition: this.getNodePosition.bind(this),
			getScrollBounds: this.getScrollBounds.bind(this),
			isHorizontal: this.isHorizontal.bind(this),
			isVertical: this.isVertical.bind(this),
			scrollToPosition: this.scrollToPosition.bind(this),
			setScrollPosition: this.setScrollPosition.bind(this)
		};
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
		const node = this.props.uiChildContainerRef.current;

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
		this.props.uiChildContainerRef.current.scrollTo(this.getRtlPositionX(x), y);
	}

	// for ScrollableNative
	didScroll (x, y) {
		this.scrollPos.left = x;
		this.scrollPos.top = y;
	}

	getNodePosition = (node) => {
		const
			{left: nodeLeft, top: nodeTop, height: nodeHeight, width: nodeWidth} = node.getBoundingClientRect(),
			{left: containerLeft, top: containerTop} = this.props.uiChildContainerRef.current.getBoundingClientRect(),
			{scrollLeft, scrollTop} = this.props.uiChildContainerRef.current,
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
			{scrollWidth, scrollHeight, clientWidth, clientHeight} = this.props.uiChildContainerRef.current;
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
		delete rest.scrollContainerContainsDangerously;
		delete rest.direction;
		delete rest.rtl;
		delete rest.scrollContext;
		delete rest.setChildAdapter;
		delete rest.isVerticalScrollbarVisible;
		delete rest.uiChildContainerRef;

		return (
			<div
				{...rest}
				className={classNames(className, css.scroller)}
				ref={this.props.uiChildContainerRef}
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
 * The `scrollTo` function accepts the following parameters:
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
 * @extends ui/Scroller.ScrollerBase
 * @ui
 * @public
 */
const Scroller = ScrollContextDecorator((props) => {
	// Hooks

	const {
		childWrapper: ChildWrapper,
		isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible
	} = useContext(ScrollContext);

	const {
		resizeContextProps,
		scrollContainerProps,
		innerScrollContainerProps,
		childWrapperProps,
		childProps,
		verticalScrollbarProps,
		horizontalScrollbarProps
	} = useScroll(props);

	// Return

	return (
		<ResizeContext.Provider {...resizeContextProps}>
			<div {...scrollContainerProps}>
				<div {...innerScrollContainerProps}>
					<ChildWrapper {...childWrapperProps}>
						<ScrollerBase {...childProps} />
					</ChildWrapper>
					{isVerticalScrollbarVisible ? <Scrollbar {...verticalScrollbarProps} /> : null}
				</div>
				{isHorizontalScrollbarVisible ? <Scrollbar {...horizontalScrollbarProps} /> : null}
			</div>
		</ResizeContext.Provider>
	);
});

Scroller.propTypes = /** @lends ui/Scroller.Scroller.prototype */ {
	direction: PropTypes.oneOf(['both', 'horizontal', 'vertical']),

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

Scroller.defaultProps = {
	direction: 'both',
	horizontalScrollbar: 'auto',
	verticalScrollbar: 'auto'
};

export default Scroller;
export {
	Scroller,
	ScrollerBase
};
