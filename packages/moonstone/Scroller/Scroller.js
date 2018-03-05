/**
 * Provides Moonstone-themed scroller components and behaviors.
 *
 * @module moonstone/Scroller
 * @exports Scroller
 * @exports ScrollerBase
 */

import {contextTypes} from '@enact/i18n/I18nDecorator';
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
 * A moonstone-styled Higher-ordered Component for Scroller{@link moonstone/Scroller.Scroller}.
 * In most circumstances, you will want to use the SpotlightContainerDecorator and Scrollable version:
 * [Scroller]{@link moonstone/Scroller.Scroller}
 *
 * @hoc
 * @private
 */
class ScrollerBase extends Component {
	static displayName = 'ScrollerBase'

	static propTypes = /** @lends moonstone/Scroller.ScrollerBase.prototype */ {
		initUiChildRef: PropTypes.func
	}

	static contextTypes = contextTypes

	componentWillUnmount () {
		this.setContainerDisabled(false);
	}

	isScrolledToBoundary = false

	getRtlPositionX = (x) => (this.context.rtl ? this.uiScrollerRef.scrollBounds.maxLeft - x : x)

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
		} while ((node = node.parentNode) && node !== this.uiScrollerRef.containerRef);
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
			{clientHeight} = this.uiScrollerRef.scrollBounds,
			{top: containerTop} = this.uiScrollerRef.containerRef.getBoundingClientRect(),
			currentScrollTop = (scrollPosition ? scrollPosition : this.uiScrollerRef.scrollPos.top),
			// calculation based on client position
			newItemTop = this.uiScrollerRef.containerRef.scrollTop + (itemTop - containerTop),
			itemBottom = newItemTop + itemHeight,
			scrollBottom = clientHeight + currentScrollTop;

		let newScrollTop = this.uiScrollerRef.scrollPos.top;

		// Caculations for when scrollHeight decrease.
		if (scrollInfo) {
			const
				{scrollTop, previousScrollHeight} = scrollInfo,
				{scrollHeight} = this.uiScrollerRef.scrollBounds,
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
				nestedItemTop = this.uiScrollerRef.containerRef.scrollTop + (top - containerTop),
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
		if (!this.uiScrollerRef.isVertical() && !this.uiScrollerRef.isHorizontal() || !item || !this.uiScrollerRef.containerRef.contains(item)) {
			return;
		}

		const {
			top: itemTop,
			left: itemLeft,
			height: itemHeight,
			width: itemWidth
		} = this.getFocusedItemBounds(item);

		if (this.uiScrollerRef.isVertical()) {
			this.uiScrollerRef.scrollPos.top = this.calculateScrollTop(item, itemTop, itemHeight, scrollInfo, scrollPosition);
		} else if (this.uiScrollerRef.isHorizontal()) {
			const
				{clientWidth} = this.uiScrollerRef.scrollBounds,
				rtlDirection = this.context.rtl ? -1 : 1,
				{left: containerLeft} = this.uiScrollerRef.containerRef.getBoundingClientRect(),
				scrollLastPosition = scrollPosition ? scrollPosition : this.uiScrollerRef.scrollPos.left,
				currentScrollLeft = this.context.rtl ? (this.uiScrollerRef.scrollBounds.maxLeft - scrollLastPosition) : scrollLastPosition,
				// calculation based on client position
				newItemLeft = this.uiScrollerRef.containerRef.scrollLeft + (itemLeft - containerLeft);

			if (newItemLeft + itemWidth > (clientWidth + currentScrollLeft) && itemWidth < clientWidth) {
				// If focus is moved to an element outside of view area (to the right), scroller will move
				// to the right just enough to show the current `focusedItem`. This does not apply to
				// `focusedItem` that has a width that is bigger than `this.scrollBounds.clientWidth`.
				this.uiScrollerRef.scrollPos.left += rtlDirection * ((newItemLeft + itemWidth) - (clientWidth + currentScrollLeft));
			} else if (newItemLeft < currentScrollLeft) {
				// If focus is outside of the view area to the left, move scroller to the left accordingly.
				this.uiScrollerRef.scrollPos.left += rtlDirection * (newItemLeft - currentScrollLeft);
			}
		}

		return this.uiScrollerRef.scrollPos;
	}

	focusOnNode = (node) => {
		if (node) {
			Spotlight.focus(node);
		}
	}

	findInternalTarget = (direction, target) => {
		const nextSpottable = getTargetByDirectionFromElement(direction, target);

		return nextSpottable && this.uiScrollerRef.containerRef.contains(nextSpottable);
	}

	handleGlobalKeyDown = () => {
		this.setContainerDisabled(false);
	}

	setContainerDisabled = (bool) => {
		const containerNode = this.uiScrollerRef && this.uiScrollerRef.containerRef;

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
		const bounds = this.uiScrollerRef.getScrollBounds();

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
			{scrollBounds, scrollPos} = this.uiScrollerRef,
			isVerticalDirection = (direction === 'up' || direction === 'down');

		if (isVerticalDirection) {
			if (scrollPos.top > 0 && scrollPos.top < scrollBounds.maxTop) {
				this.uiScrollerRef.props.cbScrollTo({align: direction === 'up' ? 'top' : 'bottom'});
			}
		} else if (scrollPos.left > 0 && scrollPos.left < scrollBounds.maxLeft) {
			this.uiScrollerRef.props.cbScrollTo({align: this.context.rtl ? reverseDirections[direction] : direction});
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

	render () {
		const {initUiChildRef, ...rest} = this.props;

		return (
			<UiScrollerBase
				{...rest}
				onKeyDown={this.onKeyDown}
				ref={(ref) => {
					this.uiScrollerRef = ref;
					initUiChildRef(ref);
				}}
			/>
		);
	}
}

const SpottableScrollable = SpotlightContainerDecorator({restrict: 'self-first'}, Scrollable);

/**
 * A moonstone-styled Scroller, SpotlightContainerDecorator and Scrollable applied.
 *
 * Usage:
 * ```
 * <Scroller>Scroll me.</Scroller>
 * ```
 *
 * @class Scroller
 * @memberof moonstone/Scroller
 * @mixes moonstone/Scroller.ScrollerDecorator
 * @ui
 * @public
 */
const Scroller = (props) => (
	<SpottableScrollable
		{...props}
		render={ // eslint-disable-line react/jsx-no-bind
			(scrollerProps) => (<ScrollerBase {...scrollerProps} />)
		}
	/>
);

export default Scroller;
export {
	Scroller
};
