/**
 * Exports the {@link ui/Scroller.Scroller} and
 * {@link ui/Scroller.ScrollerBase} components.
 * The default export is {@link ui/Scroller.Scroller}.
 *
 * @module ui/Scroller
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import css from './Scroller.less';
import Scrollable from './Scrollable';

/**
 * {@link ui/Scroller.ScrollerBase} is a base component for Scroller.
 * In most circumstances, you will want to use Scrollable version:
 * {@link ui/Scroller.Scroller}
 *
 * @class ScrollerBase
 * @memberof ui/Scroller
 * @ui
 * @public
 */
class ScrollerBase extends Component {
	static displayName = 'Scroller'

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
		 * Direction of the scroller; valid values are `'both'`, `'horizontal'`, and `'vertical'`.
		 *
		 * @type {String}
		 * @default 'both'
		 * @public
		 */
		direction: PropTypes.oneOf(['both', 'horizontal', 'vertical'])
	}

	static contextTypes = {
		rtl: PropTypes.bool
	}

	static defaultProps = {
		direction: 'both'
	}

	constructor (props) {
		super(props);
	}

	componentDidMount () {
		this.calculateMetrics();
	}

	componentDidUpdate () {
		this.calculateMetrics();
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

	getRtlPositionX = (x) => (this.context.rtl ? this.scrollBounds.maxLeft - x : x)

	// for Scrollable
	setScrollPosition (x, y) {
		const
			node = this.containerRef;

		if (this.isVertical()) {
			node.scrollTop = y;
			this.scrollPos.top = y;
		}
		if (this.isHorizontal()) {
			node.scrollLeft = this.getRtlPositionX(x);
			this.scrollPos.left = x;
		}
	}

	getNodePosition = (node) => {
		const
			{left: nodeLeft, top: nodeTop, height: nodeHeight, width: nodeWidth} = node.getBoundingClientRect(),
			{left: containerLeft, top: containerTop} = this.containerRef.getBoundingClientRect(),
			{scrollLeft, scrollTop} = this.containerRef,
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
		const {direction} = this.props;
		return (direction !== 'horizontal');
	}

	isHorizontal = () => {
		const {direction} = this.props;
		return (direction !== 'vertical');
	}

	calculateMetrics () {
		const
			{scrollBounds} = this,
			{scrollWidth, scrollHeight, clientWidth, clientHeight} = this.containerRef;
		scrollBounds.scrollWidth = scrollWidth;
		scrollBounds.scrollHeight = scrollHeight;
		scrollBounds.clientWidth = clientWidth;
		scrollBounds.clientHeight = clientHeight;
		scrollBounds.maxLeft = Math.max(0, scrollWidth - clientWidth);
		scrollBounds.maxTop = Math.max(0, scrollHeight - clientHeight);
	}

	initRef = (ref) => {
		this.containerRef = ref;
	}

	render () {
		const
			{className, style} = this.props,
			props = Object.assign({}, this.props),
			mergedStyle = Object.assign({}, style, {
				overflowX: this.isHorizontal() ? 'auto' : 'hidden',
				overflowY: this.isVertical() ? 'auto' : 'hidden'
			});

		delete props.cbScrollTo;
		delete props.className;
		delete props.direction;
		delete props.style;

		return (
			<div
				{...props}
				className={classNames(className, css.hideNativeScrollbar)}
				ref={this.initRef}
				style={mergedStyle}
			/>
		);
	}
}

/**
 * {@link ui/Scroller.Scroller} is a Scroller with Scrollable applied.
 *
 * Usage:
 * ```
 * <Scroller>Scroll me.</Scroller>
 * ```
 *
 * @class Scroller
 * @memberof ui/Scroller
 * @mixes ui/Scroller.Scrollable
 * @see ui/Scroller.ScrollerBase
 * @ui
 * @public
 */
const Scroller = Scrollable(ScrollerBase);

// Docs for Scroller
/**
 * The callback function which is called for linking scrollTo function.
 * You should specify a callback function as the value of this prop
 * to use scrollTo feature.
 *
 * The scrollTo function passed to the parent component requires below as an argument.
 * - {position: {x, y}} - You can set a pixel value for x and/or y position
 * - {align} - You can set one of values below for align
 *   `'left'`, `'right'`, `'top'`, `'bottom'`,
 *   `'topleft'`, `'topright'`, `'bottomleft'`, and `'bottomright'`.
 * - {index} - You can set an index of specific item. (`0` or positive integer)
 *   This option is available only for `VirtualList` kind.
 * - {node} - You can set a node to scroll
 * - {animate} - When `true`, scroll occurs with animation.
 *   Set it to `false` if you want scrolling without animation.
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
 * @type {Function}
 * @memberof ui/Scroller.Scroller
 * @instance
 * @public
 */

/**
 * Direction of the scroller; valid values are `'both'`, `'horizontal'`, and `'vertical'`.
 *
 * @name direction
 * @type {String}
 * @default 'both'
 * @memberof ui/Scroller.Scroller
 * @instance
 * @public
 */

/**
 * Called when scrolling
 *
 * @name onScroll
 * @type {Function}
 * @memberof ui/Scroller.Scroller
 * @instance
 * @public
 */

/**
 * Called when scroll starts
 *
 * @name onScrollStart
 * @type {Function}
 * @memberof ui/Scroller.Scroller
 * @instance
 * @public
 */

/**
 * Called when scroll stops
 *
 * @name onScrollStop
 * @type {Function}
 * @memberof ui/Scroller.Scroller
 * @instance
 * @public
 */

export default Scroller;
export {Scroller, ScrollerBase};
