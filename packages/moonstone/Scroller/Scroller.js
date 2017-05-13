/**
 * Exports the {@link moonstone/Scroller.Scroller} and
 * {@link moonstone/Scroller.ScrollerBase} components.
 * The default export is {@link moonstone/Scroller.Scroller}.
 *
 * @module moonstone/Scroller
 */

import classNames from 'classnames';
import {contextTypes} from '@enact/i18n/I18nDecorator';
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
		 * Specifies how to horizontally scroll. Acceptable values are `'auto'`, `'default'` ,
		 * `'hidden'`, and `'scroll'`.
		 *
		 * @type {String}
		 * @default 'auto'
		 * @public
		 */
		horizontal: PropTypes.oneOf(['auto', 'hidden', 'scroll']),

		/**
		 * Specifies how to vertically scroll. Acceptable values are `'auto'`, `'auto'` ,
		 * `'hidden'`, and `'scroll'`.
		 *
		 * @type {String}
		 * @default 'auto'
		 * @public
		 */
		vertical: PropTypes.oneOf(['auto', 'hidden', 'scroll'])
	}

	static contextTypes = contextTypes

	static defaultProps = {
		horizontal: 'auto',
		vertical: 'auto'
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

	setScrollPosition (valX, valY) {
		const
			node = this.containerRef,
			rtl = this.context.rtl;

		if (this.isVertical()) {
			node.scrollTop = valY;
			this.scrollPos.top = valY;
		}
		if (this.isHorizontal()) {
			node.scrollLeft = rtl ? (this.scrollBounds.maxLeft - valX) : valX;
			this.scrollPos.left = valX;
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

	/**
	 * Returns the first spotlight container between `node` and the scroller
	 *
	 * @param   {Node}      node  A DOM node
	 *
	 * @returns {Node|Null}       Spotlight container for `node`
	 * @private
	 */
	getContainerForNode = (node) => {
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
		node = this.getContainerForNode(node) || node;
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
		let newScrollTop = this.scrollPos.top;

		if (scrollInfo) {
			const
				{scrollTop, previousScrollHeight} = scrollInfo,
				{clientHeight, scrollHeight} = this.scrollBounds,
				scrollHeightDecrease = previousScrollHeight - scrollHeight;

			newScrollTop = scrollTop;

			// Update scrollTop for scrollHeight decrease
			if (focusedItem && scrollHeightDecrease > 0) {
				const
					{top: containerTop} = this.containerRef.getBoundingClientRect(),
					itemBounds = focusedItem.getBoundingClientRect(),
					itemBottom = newScrollTop + itemBounds.top + itemBounds.height - containerTop,
					scrollBottom = clientHeight + newScrollTop;

				if (itemBottom < scrollBottom && scrollHeightDecrease + itemBottom > scrollBottom) {
					// When `focusedItem` is not at the very bottom of the `Scroller` and
					// `scrollHeightDecrease` caused a scroll.
					const distanceFromBottom = scrollBottom - itemBottom,
						bottomOffset = scrollHeightDecrease - distanceFromBottom;
					if (bottomOffset < newScrollTop) {
						// guard against negative `scrollTop`
						newScrollTop -= bottomOffset;
					}
				} else if (itemBottom === scrollBottom) {
					// when `focusedItem` is at the very bottom of the `Scroller`
					if (scrollHeightDecrease < newScrollTop) {
						// guard against negative `scrollTop`
						newScrollTop -= scrollHeightDecrease;
					}
				}
			}
		} else {
			const
				{clientHeight} = this.scrollBounds,
				{top: containerTop} = this.containerRef.getBoundingClientRect(),
				currentScrollTop = this.scrollPos.top,
				// calculation based on client position
				newItemTop = this.containerRef.scrollTop + (itemTop - containerTop),
				itemBottom = newItemTop + itemHeight,
				scrollBottom = clientHeight + currentScrollTop;

			if (itemHeight > clientHeight) {
				// scroller behavior for containers that are bigger than `clientHeight`
				const {top, height: nestedItemHeight} = focusedItem.getBoundingClientRect(),
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
		}
		return newScrollTop;
	}

	focusOnNode = (node) => {
		if (node) {
			Spotlight.focus(node);
		}
	}

	isVertical = () => (this.props.vertical !== 'hidden')

	isHorizontal = () => (this.props.horizontal !== 'hidden')

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
				overflowX: props.horizontal,
				overflowY: props.vertical
			});

		delete props.cbScrollTo;
		delete props.className;
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
 * Specifies how to horizontally scroll. Acceptable values are `'auto'`, `'default'` ,
 * `'hidden'`, and `'scroll'`.
 *
 * @name horizontal
 * @type {String}
 * @default 'auto'
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
 * @public
 */

export default Scroller;
export {Scroller, ScrollerBase};
