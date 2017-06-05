/**
 * Exports the {@link moonstone/Scroller.Scroller} and
 * {@link moonstone/Scroller.ScrollerBase} components.
 * The default export is {@link moonstone/Scroller.Scroller}.
 *
 * @module moonstone/Scroller
 */

import classNames from 'classnames';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import deprecate from '@enact/core/internal/deprecate';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

import css from './Scroller.less';
import Scrollable from './Scrollable';

const dataContainerDisabledAttribute = 'data-container-disabled';

/**
 * {@link moonstone/Scroller.ScrollerBase} is a base component for Scroller.
 * In most circumstances, you will want to use the SpotlightContainerDecorator and Scrollable version:
 * {@link moonstone/Scroller.Scroller}
 *
 * @class ScrollerBase
 * @memberof moonstone/Scroller
 * @ui
 * @public
 */
class ScrollerBase extends Component {
	static displayName = 'Scroller'

	static propTypes = /** @lends moonstone/Scroller.ScrollerBase.prototype */ {
		children: PropTypes.node.isRequired,

		/**
		 * Direction of the scroller; valid values are `'both'`, `'horizontal'`, and `'vertical'`.
		 *
		 * @type {String}
		 * @default 'both'
		 * @public
		 */
		direction: PropTypes.oneOf(['both', 'horizontal', 'vertical']),

		/**
		 * Specifies how to horizontally scroll. Acceptable values are `'auto'`, `'default'` ,
		 * `'hidden'`, and `'scroll'`.
		 *
		 * @type {String}
		 * @default 'auto'
		 * @deprecated replaced by `direction`
		 * @public
		 */
		horizontal: PropTypes.oneOf(['auto', 'hidden', 'scroll']),

		/**
		 * Specifies how to vertically scroll. Acceptable values are `'auto'`, `'auto'` ,
		 * `'hidden'`, and `'scroll'`.
		 *
		 * @type {String}
		 * @default 'auto'
		 * @deprecated replaced by `direction`
		 * @public
		 */
		vertical: PropTypes.oneOf(['auto', 'hidden', 'scroll'])
	}

	static contextTypes = contextTypes

	static defaultProps = {
		direction: 'both'
	}

	constructor (props) {
		super(props);

		if (props.horizontal) {
			deprecate({name: 'horizontal', since: '1.3.0', message: 'Use `direction` instead', until: '2.0.0'});
		}
		if (props.vertical) {
			deprecate({name: 'vertical', since: '1.3.0', message: 'Use `direction` instead', until: '2.0.0'});
		}
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

	/**
	 * Returns the first spotlight container between `node` and the scroller
	 *
	 * @param   {Node}      node  A DOM node
	 *
	 * @returns {Node|Null}       Spotlight container for `node`
	 * @private
	 */
	getSpotlightContainerForNode = (node) => {
		do {
			if (node.dataset.containerId) {
				return node;
			}
		} while ((node = node.parentNode) && node !== this.containerRef);
	}

	/**
	 * Calculates the "focus bounds" of a node. If the node is within a spotlight container, that
	 * container is scrolled into view rather than just the element.
	 *
	 * @param   {Node}   node  Focused node
	 *
	 * @returns {Object}       Bounds as returned by `getBoundingClientRect`
	 * @private
	 */
	getFocusedItemBounds = (node) => {
		node = this.getSpotlightContainerForNode(node) || node;
		return node.getBoundingClientRect();
	}

	calculatePositionOnFocus = (focusedItem, scrollInfo) => {
		if (!this.isVertical() && !this.isHorizontal()) return;

		const {
			top: itemTop,
			left: itemLeft,
			height: itemHeight,
			width: itemWidth
		} = this.getFocusedItemBounds(focusedItem);

		if (this.isVertical()) {
			this.scrollPos.top = this.calculateScrollTop(focusedItem, itemTop, itemHeight, scrollInfo);
		}

		if (this.isHorizontal()) {
			const
				{clientWidth} = this.scrollBounds,
				rtlDirection = this.context.rtl ? -1 : 1,
				{left: containerLeft} = this.containerRef.getBoundingClientRect(),
				currentScrollLeft = this.scrollPos.left * rtlDirection,
				// calculation based on client position
				newItemLeft = this.containerRef.scrollLeft + (itemLeft - containerLeft);

			if (this.context.rtl && newItemLeft > clientWidth) {
				// For RTL, and if the `focusedItem` is bigger than `this.scrollBounds.clientWidth`, keep
				// the scroller to the right.
				this.scrollPos.left -= newItemLeft;
			} else if (newItemLeft + itemWidth > (clientWidth + currentScrollLeft) && itemWidth < clientWidth) {
				// If focus is moved to an element outside of view area (to the right), scroller will move
				// to the right just enough to show the current `focusedItem`. This does not apply to
				// `focusedItem` that has a width that is bigger than `this.scrollBounds.clientWidth`.
				this.scrollPos.left += rtlDirection * ((newItemLeft + itemWidth) - (clientWidth + currentScrollLeft));
			} else if (newItemLeft < currentScrollLeft) {
				// If focus is outside of the view area to the left, move scroller to the left accordingly.
				this.scrollPos.left += rtlDirection * (newItemLeft - currentScrollLeft);
			}
		}

		return this.scrollPos;
	}

	calculateScrollTop = (focusedItem, itemTop, itemHeight, scrollInfo) => {
		const
			{clientHeight} = this.scrollBounds,
			{top: containerTop} = this.containerRef.getBoundingClientRect(),
			currentScrollTop = this.scrollPos.top,
			// calculation based on client position
			newItemTop = this.containerRef.scrollTop + (itemTop - containerTop),
			itemBottom = newItemTop + itemHeight,
			scrollBottom = clientHeight + currentScrollTop;

		let newScrollTop = this.scrollPos.top;

		if (scrollInfo) {
			const
				{scrollTop, previousScrollHeight} = scrollInfo,
				{scrollHeight} = this.scrollBounds,
				scrollHeightDecrease = previousScrollHeight - scrollHeight;

			newScrollTop = scrollTop;

			if (scrollHeightDecrease > 0) {
				// Update scrollTop for scrollHeight decrease
				const
					itemBounds = focusedItem.getBoundingClientRect(),
					newItemBottom = newScrollTop + itemBounds.top + itemBounds.height - containerTop;

				if (newItemBottom < scrollBottom && scrollHeightDecrease + newItemBottom > scrollBottom) {
					// When `focusedItem` is not at the very bottom of the `Scroller` and
					// `scrollHeightDecrease` caused a scroll.
					const distanceFromBottom = scrollBottom - newItemBottom,
						bottomOffset = scrollHeightDecrease - distanceFromBottom;
					if (bottomOffset < newScrollTop) {
						// guard against negative `scrollTop`
						newScrollTop -= bottomOffset;
					}
				} else if (newItemBottom === scrollBottom) {
					// when `focusedItem` is at the very bottom of the `Scroller`
					if (scrollHeightDecrease < newScrollTop) {
						// guard against negative `scrollTop`
						newScrollTop -= scrollHeightDecrease;
					}
				}
			}
		}

		if (itemHeight > clientHeight) {
			// scroller behavior for containers that are bigger than `clientHeight`
			const
				{top, height: nestedItemHeight} = focusedItem.getBoundingClientRect(),
				nestedItemTop = this.containerRef.scrollTop + (top - containerTop),
				nestedItemBottom = nestedItemTop + nestedItemHeight;

			if (newItemTop - nestedItemHeight > currentScrollTop) {
				// set scroll position so that the top of the container is at least on the top
				newScrollTop = newItemTop - nestedItemHeight;
			} else if (nestedItemBottom > scrollBottom) {
				newScrollTop += nestedItemBottom - scrollBottom;
			} else if (nestedItemTop < currentScrollTop) {
				newScrollTop += nestedItemTop - currentScrollTop;
			}
		} else if (itemBottom > scrollBottom) {
			newScrollTop += itemBottom - scrollBottom;
		} else if (newItemTop < currentScrollTop) {
			newScrollTop += newItemTop - currentScrollTop;
		}
		return newScrollTop;
	}

	focusOnNode = (node) => {
		if (node) {
			Spotlight.focus(node);
		}
	}

	isVertical = () => {
		const {vertical, direction} = this.props;
		return vertical ? (vertical !== 'hidden') : (direction !== 'horizontal');
	}

	isHorizontal = () => {
		const {horizontal, direction} = this.props;
		return horizontal ? (horizontal !== 'hidden') : (direction !== 'vertical');
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

	getContainerNode = () => (this.containerRef)

	setContainerDisabled = (bool) => {
		if (this.containerRef) {
			this.containerRef.setAttribute(dataContainerDisabledAttribute, bool);
		}
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
		delete props.horizontal;
		delete props.style;
		delete props.vertical;

		return (
			<div {...props} ref={this.initRef} className={classNames(className, css.hideNativeScrollbar)} style={mergedStyle} />
		);
	}
}

/**
 * {@link moonstone/Scroller.Scroller} is a Scroller with Moonstone styling,
 * SpotlightContainerDecorator and Scrollable applied.
 *
 * Usage:
 * ```
 * <Scroller>Scroll me.</Scroller>
 * ```
 *
 * @class Scroller
 * @memberof moonstone/Scroller
 * @mixes moonstone/Scroller.Scrollable
 * @see moonstone/Scroller.ScrollerBase
 * @ui
 * @public
 */
const Scroller = SpotlightContainerDecorator(
	{restrict: 'self-first'},
	Scrollable(
		ScrollerBase
	)
);

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
 * - {indexToFocus} - Deprecated: Use `focus` instead.
 * - {focus} - Set `true` if you want the item to be focused after scroll.
 *   This option is only valid when you scroll by `index` or `node`.
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
 * @memberof moonstone/Scroller.Scroller
 * @instance
 * @public
 */

/**
 * When `true`, allows 5-way navigation to the scrollbar controls. By default, 5-way will
 * not move focus to the scrollbar controls.
 *
 * @name focusableScrollbar
 * @type {Boolean}
 * @memberof moonstone/Scroller.Scroller
 * @instance
 * @public
 */

/**
 * Direction of the scroller; valid values are `'both'`, `'horizontal'`, and `'vertical'`.
 *
 * @name direction
 * @type {String}
 * @default 'both'
 * @memberof moonstone/Scroller.Scroller
 * @instance
 * @public
 */

/**
 * Specifies how to horizontally scroll. Acceptable values are `'auto'`, `'default'` ,
 * `'hidden'`, and `'scroll'`.
 *
 * @name horizontal
 * @type {String}
 * @default 'auto'
 * @memberof moonstone/Scroller.Scroller
 * @instance
 * @deprecated replaced by `direction`
 * @public
 */

/**
 * Specifies how to show horizontal scrollbar. Acceptable values are `'auto'`,
 * `'visible'`, and `'hidden'`.
 *
 * @name horizontalScrollbar
 * @type {String}
 * @default 'auto'
 * @memberof moonstone/Scroller.Scroller
 * @instance
 * @public
 */

/**
 * Called when scrolling
 *
 * @name onScroll
 * @type {Function}
 * @memberof moonstone/Scroller.Scroller
 * @instance
 * @public
 */

/**
 * Called when scroll starts
 *
 * @name onScrollStart
 * @type {Function}
 * @memberof moonstone/Scroller.Scroller
 * @instance
 * @public
 */

/**
 * Called when scroll stops
 *
 * @name onScrollStop
 * @type {Function}
 * @memberof moonstone/Scroller.Scroller
 * @instance
 * @public
 */

/**
 * Specifies how to vertically scroll. Acceptable values are `'auto'`, `'auto'` ,
 * `'hidden'`, and `'scroll'`.
 *
 * @name vertical
 * @type {String}
 * @default 'auto'
 * @memberof moonstone/Scroller.Scroller
 * @instance
 * @deprecated replaced by `direction`
 * @public
 */

/**
 * Specifies how to show vertical scrollbar. Acceptable values are `'auto'`,
 * `'visible'`, and `'hidden'`.
 *
 * @name verticalScrollbar
 * @type {String}
 * @default 'auto'
 * @memberof moonstone/Scroller.Scroller
 * @instance
 * @public
 */

export default Scroller;
export {Scroller, ScrollerBase};
