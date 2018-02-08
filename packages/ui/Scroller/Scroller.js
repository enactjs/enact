/**
 * Provides unstyled scroller components and behaviors to be customized by a theme or application.
 *
 * @module ui/Scroller
 * @exports Scroller
 * @exports ScrollerBase
 * @exports ScrollerBaseNative
 * @exports ScrollerNative
 */

import classNames from 'classnames';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import css from './Scroller.less';
import Scrollable, {ScrollableNative} from '../Scrollable';

/**
 * [ScrollerBase]{@link ui/Scroller.ScrollerBase} is a base component for Scroller.
 * In most circumstances, you will want to use the Scrollable version:
 * [Scroller]{@link ui/Scroller.Scroller}
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
		 * Direction of the scroller; valid values are `'both'`, `'horizontal'`, and `'vertical'`.
		 *
		 * @type {String}
		 * @default 'both'
		 * @public
		 */
		direction: PropTypes.oneOf(['both', 'horizontal', 'vertical'])
	}

	static contextTypes = contextTypes

	static defaultProps = {
		direction: 'both'
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

	isScrolledToBoundary = false

	getScrollBounds = () => this.scrollBounds

	getRtlPositionX = (x) => (this.context.rtl ? this.scrollBounds.maxLeft - x : x)

	// for Scrollable
	setScrollPosition (x, y) {
		const node = this.containerRef;

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
		this.containerRef.scrollTo(this.getRtlPositionX(x), y);
	}

	// for ScrollableNative
	didScroll (x, y) {
		this.scrollPos.left = x;
		this.scrollPos.top = y;
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
		return (this.props.direction !== 'horizontal');
	}

	isHorizontal = () => {
		return (this.props.direction !== 'vertical');
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

	// override
	onKeyDown = () => {}

	initRef = (ref) => {
		this.containerRef = ref;
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
		delete rest.type;

		return (
			<div
				{...rest}
				className={classNames(className, css.hideNativeScrollbar)}
				onKeyDown={this.onKeyDown}
				ref={this.initRef}
				style={mergedStyle}
			/>
		);
	}
}

/**
 * [Scroller]{@link ui/Scroller.Scroller} is a scroller.
 *
 * Usage:
 * ```
 * <Scroller>Scroll me.</Scroller>
 * ```
 *
 * @class Scroller
 * @memberof ui/Scroller
 * @mixes ui/Scrollable.Scrollable
 * @ui
 * @public
 */
const Scroller = Scrollable(ScrollerBase);

/**
 * [ScrollerNative]{@link ui/Scroller.ScrollerNative} is a native scroller.
 *
 * Usage:
 * ```
 * <ScrollerNative>Scroll me.</ScrollerNative>
 * ```
 *
 * @class ScrollerNative
 * @memberof ui/Scroller
 * @mixes ui/Scrollable.ScrollableNative
 * @ui
 * @public
 */
const ScrollerNative = ScrollableNative(ScrollerBase);

export default Scroller;
export {
	Scroller,
	ScrollerBase,
	ScrollerBase as ScrollerBaseNative,
	ScrollerNative
};
