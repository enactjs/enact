/**
 * Provides Moonstone-themed scroller components and behaviors.
 *
 * @module moonstone/Scroller
 * @exports Scroller
 * @exports ScrollerBase
 */

import {ScrollerBase as UiScrollerBase} from '@enact/ui/Scroller';
import {forward} from '@enact/core/handle';
import {getTargetByDirectionFromElement, getTargetByDirectionFromPosition} from '@enact/spotlight/src/target';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Spotlight, getDirection} from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

import Scrollable from '../Scrollable';

const
	dataContainerDisabledAttribute = 'data-container-disabled',
	epsilon = 1,
	reverseDirections = {
		left: 'right',
		right: 'left'
	};

/**
 * A Moonstone-styled base component for Scroller{@link moonstone/Scroller.Scroller}.
 * In most circumstances, you will want to use the SpotlightContainerDecorator and Scrollable version:
 * [Scroller]{@link moonstone/Scroller.Scroller}
 *
 * @class ScrollerBase
 * @memberof moonstone/Scroller
 * @ui
 * @public
 */
class ScrollerBase extends Component {
	static displayName = 'ScrollerBase'

	static propTypes = /** @lends moonstone/Scroller.Scroller.prototype */ {
		/**
		 * Passes the instance of [Scroller]{@link ui/Scroller.Scroller}.
		 *
		 * @type {Object}
		 * @param {Object} ref
		 * @private
		 */
		initUiChildRef: PropTypes.func,

		/**
		 * `true` if rtl, `false` if ltr.
		 *
		 * @type {Boolean}
		 * @private
		 */
		rtl: PropTypes.bool
	}

	componentWillUnmount () {
		this.setContainerDisabled(false);
	}

	isScrolledToBoundary = false

	/**
	 * Returns the first spotlight container between `node` and the scroller
	 *
	 * @param {Node} node A DOM node
	 *
	 * @returns {Node|Null} Spotlight container for `node`
	 * @private
	 */
	getSpotlightContainerForNode = (node) => {
		do {
			if (node.dataset.containerId) {
				return node;
			}
		} while ((node = node.parentNode) && node !== this.uiRef.containerRef);
	}

	/**
	 * Calculates the "focus bounds" of a node. If the node is within a spotlight container, that
	 * container is scrolled into view rather than just the element.
	 *
	 * @param {Node} node Focused node
	 *
	 * @returns {Object} Bounds as returned by `getBoundingClientRect`
	 * @private
	 */
	getFocusedItemBounds = (node) => {
		node = this.getSpotlightContainerForNode(node) || node;
		return node.getBoundingClientRect();
	}

	/**
	 * Calculates the new `scrollTop`.
	 *
	 * @param {Node} focusedItem node
	 * @param {Number} itemTop of the focusedItem / focusedContainer
	 * @param {Number} itemHeight of focusedItem / focusedContainer
	 * @param {Object} scrollInfo position info. Uses `scrollInfo.previousScrollHeight`
	 * and `scrollInfo.scrollTop`
	 * @param {Number} scrollPosition last target position, passed scroll animation is ongoing
	 *
	 * @returns {Number} Calculated `scrollTop`
	 * @private
	 */
	calculateScrollTop = (focusedItem, itemTop, itemHeight, scrollInfo, scrollPosition) => {
		const
			{clientHeight} = this.uiRef.scrollBounds,
			{top: containerTop} = this.uiRef.containerRef.getBoundingClientRect(),
			currentScrollTop = (scrollPosition ? scrollPosition : this.uiRef.scrollPos.top),
			// calculation based on client position
			newItemTop = this.uiRef.containerRef.scrollTop + (itemTop - containerTop),
			itemBottom = newItemTop + itemHeight,
			scrollBottom = clientHeight + currentScrollTop;

		let newScrollTop = this.uiRef.scrollPos.top;

		// Caculations for when scrollHeight decrease.
		if (scrollInfo) {
			const
				{scrollTop, previousScrollHeight} = scrollInfo,
				{scrollHeight} = this.uiRef.scrollBounds,
				scrollHeightDecrease = previousScrollHeight - scrollHeight;

			newScrollTop = scrollTop;

			if (scrollHeightDecrease > 0) {
				const
					itemBounds = focusedItem.getBoundingClientRect(),
					newItemBottom = newScrollTop + itemBounds.top + itemBounds.height - containerTop;

				if (newItemBottom < scrollBottom && scrollHeightDecrease + newItemBottom > scrollBottom) {
					// When `focusedItem` is not at the very bottom of the `Scroller` and
					// `scrollHeightDecrease` caused a scroll.
					const
						distanceFromBottom = scrollBottom - newItemBottom,
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

		// Calculations for `containerHeight` that are bigger than `clientHeight`
		if (itemHeight > clientHeight) {
			const
				{top, height: nestedItemHeight} = focusedItem.getBoundingClientRect(),
				nestedItemTop = this.uiRef.containerRef.scrollTop + (top - containerTop),
				nestedItemBottom = nestedItemTop + nestedItemHeight;

			if (newItemTop - nestedItemHeight - currentScrollTop > epsilon) {
				// set scroll position so that the top of the container is at least on the top
				newScrollTop = newItemTop - nestedItemHeight;
			} else if (nestedItemBottom - scrollBottom > epsilon) {
				// Caculate when 5-way focus down past the bottom.
				newScrollTop += nestedItemBottom - scrollBottom;
			} else if (nestedItemTop - currentScrollTop < epsilon) {
				// Caculate when 5-way focus up past the top.
				newScrollTop += nestedItemTop - currentScrollTop;
			}
		} else if (itemBottom - scrollBottom > epsilon) {
			// Caculate when 5-way focus down past the bottom.
			newScrollTop += itemBottom - scrollBottom;
		} else if (newItemTop - currentScrollTop < epsilon) {
			// Caculate when 5-way focus up past the top.
			newScrollTop += newItemTop - currentScrollTop;
		}

		return newScrollTop;
	}

	/**
	 * Calculates the new top and left position for scroller based on focusedItem.
	 *
	 * @param {Node} item node
	 * @param {Object} scrollInfo position info. `calculateScrollTop` uses
	 * `scrollInfo.previousScrollHeight` and `scrollInfo.scrollTop`
	 * @param {Number} scrollPosition last target position, passed scroll animation is ongoing
	 *
	 * @returns {Object} with keys {top, left} containing caculated top and left positions for scroll.
	 * @private
	 */
	calculatePositionOnFocus = ({item, scrollInfo, scrollPosition}) => {
		if (!this.uiRef.isVertical() && !this.uiRef.isHorizontal() || !item || !this.uiRef.containerRef.contains(item)) {
			return;
		}

		const {
			top: itemTop,
			left: itemLeft,
			height: itemHeight,
			width: itemWidth
		} = this.getFocusedItemBounds(item);

		if (this.uiRef.isVertical()) {
			this.uiRef.scrollPos.top = this.calculateScrollTop(item, itemTop, itemHeight, scrollInfo, scrollPosition);
		} else if (this.uiRef.isHorizontal()) {
			const
				{rtl} = this.props,
				{clientWidth} = this.uiRef.scrollBounds,
				rtlDirection = rtl ? -1 : 1,
				{left: containerLeft} = this.uiRef.containerRef.getBoundingClientRect(),
				scrollLastPosition = scrollPosition ? scrollPosition : this.uiRef.scrollPos.left,
				currentScrollLeft = rtl ? (this.uiRef.scrollBounds.maxLeft - scrollLastPosition) : scrollLastPosition,
				// calculation based on client position
				newItemLeft = this.uiRef.containerRef.scrollLeft + (itemLeft - containerLeft);

			if (newItemLeft + itemWidth > (clientWidth + currentScrollLeft) && itemWidth < clientWidth) {
				// If focus is moved to an element outside of view area (to the right), scroller will move
				// to the right just enough to show the current `focusedItem`. This does not apply to
				// `focusedItem` that has a width that is bigger than `this.scrollBounds.clientWidth`.
				this.uiRef.scrollPos.left += rtlDirection * ((newItemLeft + itemWidth) - (clientWidth + currentScrollLeft));
			} else if (newItemLeft < currentScrollLeft) {
				// If focus is outside of the view area to the left, move scroller to the left accordingly.
				this.uiRef.scrollPos.left += rtlDirection * (newItemLeft - currentScrollLeft);
			}
		}

		return this.uiRef.scrollPos;
	}

	focusOnNode = (node) => {
		if (node) {
			Spotlight.focus(node);
		}
	}

	findInternalTarget = (direction, target) => {
		const nextSpottable = getTargetByDirectionFromElement(direction, target);

		return nextSpottable && this.uiRef.containerRef.contains(nextSpottable);
	}

	handleGlobalKeyDown = () => {
		this.setContainerDisabled(false);
	}

	setContainerDisabled = (bool) => {
		const containerNode = this.uiRef && this.uiRef.containerRef;

		if (containerNode) {
			containerNode.setAttribute(dataContainerDisabledAttribute, bool);

			if (bool) {
				document.addEventListener('keydown', this.handleGlobalKeyDown, {capture: true});
			} else {
				document.removeEventListener('keydown', this.handleGlobalKeyDown, {capture: true});
			}
		}
	}

	getNextEndPoint = (direction, oSpotBounds) => {
		const bounds = this.uiRef.getScrollBounds();

		let oPoint = {};
		switch (direction) {
			case 'up':
				oPoint.x = oSpotBounds.left;
				oPoint.y = oSpotBounds.top - bounds.clientHeight;
				break;
			case 'left':
				oPoint.x = oSpotBounds.left - bounds.clientWidth;
				oPoint.y = oSpotBounds.top;
				break;
			case 'down':
				oPoint.x = oSpotBounds.left;
				oPoint.y = oSpotBounds.top + oSpotBounds.height + bounds.clientHeight;
				break;
			case 'right':
				oPoint.x = oSpotBounds.left + oSpotBounds.width + bounds.clientWidth;
				oPoint.y = oSpotBounds.top;
				break;
		}
		return oPoint;
	}

	scrollToNextPage = ({direction, reverseDirection, focusedItem, containerId}) => {
		const
			endPoint = this.getNextEndPoint(direction, focusedItem.getBoundingClientRect()),
			next = getTargetByDirectionFromPosition(reverseDirection, endPoint, containerId);

		if (next === focusedItem) {
			return false; // Scroll one page with animation
		} else {
			return next; // Focus a next item
		}
	}

	scrollToBoundary = (direction) => {
		const
			{scrollBounds, scrollPos} = this.uiRef,
			isVerticalDirection = (direction === 'up' || direction === 'down');

		if (isVerticalDirection) {
			if (scrollPos.top > 0 && scrollPos.top < scrollBounds.maxTop) {
				this.uiRef.props.cbScrollTo({align: direction === 'up' ? 'top' : 'bottom'});
			}
		} else if (scrollPos.left > 0 && scrollPos.left < scrollBounds.maxLeft) {
			this.uiRef.props.cbScrollTo({align: this.props.rtl ? reverseDirections[direction] : direction});
		}
	}

	onKeyDown = (ev) => {
		forward('onKeyDown', ev, this.props);

		const
			{keyCode, target} = ev,
			direction = getDirection(keyCode);

		if (!ev.repeat) {
			this.isScrolledToBoundary = false;
		}

		if (direction && !this.findInternalTarget(direction, target) && !this.isScrolledToBoundary) {
			this.scrollToBoundary(direction);
			this.isScrolledToBoundary = true;
		}
	}

	initUiRef = (ref) => {
		if (ref) {
			this.uiRef = ref;
			this.props.initUiChildRef(ref);
		}
	}

	render () {
		const props = Object.assign({}, this.props);

		delete props.initUiChildRef;

		return (
			<UiScrollerBase
				{...props}
				onKeyDown={this.onKeyDown}
				ref={this.initUiRef}
			/>
		);
	}
}

const ScrollableScroller = (props) => (
	<Scrollable
		{...props}
		childRenderer={(scrollerProps) => ( // eslint-disable-line react/jsx-no-bind
			<ScrollerBase {...scrollerProps} />
		)}
	/>
);

/**
 * A Moonstone-styled Scroller, SpotlightContainerDecorator and Scrollable applied.
 *
 * Usage:
 * ```
 * <Scroller>Scroll me.</Scroller>
 * ```
 *
 * @class Scroller
 * @memberof moonstone/Scroller
 * @mixes spotlight/SpotlightContainerDecorator
 * @extends moonstone/Scrollable.Scrollable
 * @extends moonstone/Scroller.ScrollerBase
 * @ui
 * @public
 */
const Scroller = SpotlightContainerDecorator({restrict: 'self-first'}, ScrollableScroller);

export default Scroller;
export {
	Scroller,
	ScrollerBase
};
