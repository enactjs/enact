/**
 * Provides Moonstone-themed scroller components and behaviors.
 * @example
 * <Scroller>
 * 	<div style={{height: "150px"}}>
 * 		<p>San Francisco</p>
 * 		<p>Seoul</p>
 * 		<p>Bangalore</p>
 * 		<p>New York</p>
 * 		<p>London</p>
 * 	</div>
 * </Scroller>
 *
 * @module moonstone/Scroller
 * @exports Scroller
 * @exports ScrollerBase
 */

import {Spotlight} from '@enact/spotlight';
import {getRect} from '@enact/spotlight/src/utils';
import ri from '@enact/ui/resolution';
import {ScrollerBase as UiScrollerBase} from '@enact/ui/Scroller';
import PropTypes from 'prop-types';
import React, {useEffect, useRef} from 'react';

import Scrollable from '../Scrollable';
import ScrollableNative from '../Scrollable/ScrollableNative';

const dataContainerDisabledAttribute = 'data-spotlight-container-disabled';

/**
 * A Moonstone-styled base component for [Scroller]{@link moonstone/Scroller.Scroller}.
 * In most circumstances, you will want to use the
 * [SpotlightContainerDecorator]{@link spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator}
 * and the Scrollable version, [Scroller]{@link moonstone/Scroller.Scroller}.
 *
 * @function ScrollerBase
 * @memberof moonstone/Scroller
 * @extends ui/Scroller.ScrollerBase
 * @ui
 * @public
 */
const ScrollerBase = (props) => {
	useEffect(() => {
		// componentDidMount
		configureSpotlight();

		// componentWillUnmount
		return () => setContainerDisabled(false);
	}, [configureSpotlight, setContainerDisabled]);	// TODO : Handle exhaustive-deps ESLint rule.

	useEffect(configureSpotlight, [props.spotlightId]);	// TODO : Handle exhaustive-deps ESLint rule.
	useEffect(() => {
		const {onUpdate} = props;
		if (onUpdate) {
		//	onUpdate();		// TODO: Invoking onUpdate() has error. Fix it.
		}
	});	// TODO : Handle exhaustive-deps ESLint rule.

	// Instance variables
	const uiRefCurrent = useRef({});

	function configureSpotlight () {
		Spotlight.set(props.spotlightId, {
			onLeaveContainer: handleLeaveContainer,
			onLeaveContainerFail: handleLeaveContainer
		});
	}

	/**
	 * Returns the first spotlight container between `node` and the scroller
	 *
	 * @param {Node} node A DOM node
	 *
	 * @returns {Node|Null} Spotlight container for `node`
	 * @private
	 */
	function getSpotlightContainerForNode (node) {
		do {
			if (node.dataset.spotlightId && node.dataset.spotlightContainer && !node.dataset.expandableContainer) {
				return node;
			}
		} while ((node = node.parentNode) && node !== uiRefCurrent.current.containerRef.current);
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
	function getFocusedItemBounds (node) {
		node = getSpotlightContainerForNode(node) || node;
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
	function calculateScrollTop (item) {
		const threshold = ri.scale(24);
		const roundToStart = (sb, st) => {
			// round to start
			if (st < threshold) return 0;

			return st;
		};
		const roundToEnd = (sb, st, sh) => {
			// round to end
			if (sh - (st + sb.height) < threshold) return sh - sb.height;

			return st;
		};
		// adding threshold into these determinations ensures that items that are within that are
		// near the bounds of the scroller cause the edge to be scrolled into view even when the
		// itme itself is in view (e.g. due to margins)
		const isItemBeforeView = (ib, sb, d) => ib.top + d - threshold < sb.top;
		const isItemAfterView = (ib, sb, d) => ib.top + d + ib.height + threshold > sb.top + sb.height;
		const canItemFit = (ib, sb) => ib.height <= sb.height;
		const calcItemAtStart = (ib, sb, st, d) => ib.top + st + d - sb.top;
		const calcItemAtEnd = (ib, sb, st, d) => ib.top + ib.height + st + d - (sb.top + sb.height);
		const calcItemInView = (ib, sb, st, sh, d) => {
			if (isItemBeforeView(ib, sb, d)) {
				return roundToStart(sb, calcItemAtStart(ib, sb, st, d));
			} else if (isItemAfterView(ib, sb, d)) {
				return roundToEnd(sb, calcItemAtEnd(ib, sb, st, d), sh);
			}
			return st;
		};

		const container = getSpotlightContainerForNode(item);
		const scrollerBounds = uiRefCurrent.current.containerRef.current.getBoundingClientRect();
		let {scrollHeight, scrollTop} = uiRefCurrent.current.containerRef.current;
		let scrollTopDelta = 0;

		const adjustScrollTop = (v) => {
			scrollTopDelta = scrollTop - v;
			scrollTop = v;
		};

		if (container) {
			const containerBounds = container.getBoundingClientRect();

			// if the entire container fits in the scroller, scroll it into view
			if (canItemFit(containerBounds, scrollerBounds)) {
				return calcItemInView(containerBounds, scrollerBounds, scrollTop, scrollHeight, scrollTopDelta);
			}

			// if the container doesn't fit, adjust the scroll top ...
			if (containerBounds.top > scrollerBounds.top) {
				// ... to the top of the container if the top is below the top of the scroller
				adjustScrollTop(calcItemAtStart(containerBounds, scrollerBounds, scrollTop, scrollTopDelta));
			}
			// removing support for "snap to bottom" for 2.2.8
			// } else if (containerBounds.top + containerBounds.height < scrollerBounds.top + scrollerBounds.height) {
			// 	// ... to the bottom of the container if the bottom is above the bottom of the
			// 	// scroller
			// 	adjustScrollTop(calcItemAtEnd(containerBounds, scrollerBounds, scrollTop, scrollTopDelta));
			// }

			// N.B. if the container covers the scrollable area (its top is above the top of the
			// scroller and its bottom is below the bottom of the scroller), we need not adjust the
			// scroller to ensure the container is wholly in view.
		}

		const itemBounds = item.getBoundingClientRect();

		return calcItemInView(itemBounds, scrollerBounds, scrollTop, scrollHeight, scrollTopDelta);
	}

	/**
	 * Calculates the new `scrollLeft`.
	 *
	 * @param {Node} focusedItem node
	 * @param {Number} scrollPosition last target position, passed when scroll animation is ongoing
	 *
	 * @returns {Number} Calculated `scrollLeft`
	 * @private
	 */
	function calculateScrollLeft (item, scrollPosition) {
		const {
			left: itemLeft,
			width: itemWidth
		} = getFocusedItemBounds(item);

		const
			{rtl} = props,
			{clientWidth} = uiRefCurrent.current.scrollBounds,
			rtlDirection = rtl ? -1 : 1,
			{left: containerLeft} = uiRefCurrent.current.containerRef.current.getBoundingClientRect(),
			scrollLastPosition = scrollPosition ? scrollPosition : uiRefCurrent.current.scrollPos.left,
			currentScrollLeft = rtl ? (uiRefCurrent.current.scrollBounds.maxLeft - scrollLastPosition) : scrollLastPosition,
			// calculation based on client position
			newItemLeft = uiRefCurrent.current.containerRef.current.scrollLeft + (itemLeft - containerLeft);
		let nextScrollLeft = uiRefCurrent.current.scrollPos.left;

		if (newItemLeft + itemWidth > (clientWidth + currentScrollLeft) && itemWidth < clientWidth) {
			// If focus is moved to an element outside of view area (to the right), scroller will move
			// to the right just enough to show the current `focusedItem`. This does not apply to
			// `focusedItem` that has a width that is bigger than `scrollBounds.clientWidth`.
			nextScrollLeft += rtlDirection * ((newItemLeft + itemWidth) - (clientWidth + currentScrollLeft));
		} else if (newItemLeft < currentScrollLeft) {
			// If focus is outside of the view area to the left, move scroller to the left accordingly.
			nextScrollLeft += rtlDirection * (newItemLeft - currentScrollLeft);
		}

		return nextScrollLeft;
	}

	/**
	 * Calculates the new top and left position for scroller based on focusedItem.
	 *
	 * @param {Node} item node
	 * @param {Object} scrollInfo position info. `calculateScrollTop` uses
	 * `scrollInfo.previousScrollHeight` and `scrollInfo.scrollTop`
	 * @param {Number} scrollPosition last target position, passed scroll animation is ongoing
	 *
	 * @returns {Object} with keys {top, left} containing calculated top and left positions for scroll.
	 * @private
	 */
	function calculatePositionOnFocus ({item, scrollPosition}) {
		const containerNode = uiRefCurrent.current.containerRef.current;
		const horizontal = uiRefCurrent.current.isHorizontal();
		const vertical = uiRefCurrent.current.isVertical();

		if (!vertical && !horizontal || !item || !containerNode.contains(item)) {
			return;
		}

		const containerRect = getRect(containerNode);
		const itemRect = getRect(item);

		if (horizontal && !(itemRect.left >= containerRect.left && itemRect.right <= containerRect.right)) {
			uiRefCurrent.current.scrollPos.left = calculateScrollLeft(item, scrollPosition);
		}

		if (vertical && !(itemRect.top >= containerRect.top && itemRect.bottom <= containerRect.bottom)) {
			uiRefCurrent.current.scrollPos.top = calculateScrollTop(item);
		}

		return uiRefCurrent.current.scrollPos;
	}

	function focusOnNode (node) {
		if (node) {
			Spotlight.focus(node);
		}
	}

	function handleGlobalKeyDown () {
		setContainerDisabled(false);
	}

	function setContainerDisabled (bool) {
		const
			{spotlightId} = props,
			containerNode = document.querySelector(`[data-spotlight-id="${spotlightId}"]`);

		if (containerNode) {
			containerNode.setAttribute(dataContainerDisabledAttribute, bool);

			if (bool) {
				document.addEventListener('keydown', handleGlobalKeyDown, {capture: true});
			} else {
				document.removeEventListener('keydown', handleGlobalKeyDown, {capture: true});
			}
		}
	}

	function handleLeaveContainer ({direction, target}) {
		const contentsContainer = uiRefCurrent.current.containerRef.current;
		// ensure we only scroll to boundary from the contents and not a scroll button which
		// lie outside of uiRefCurrent.current.containerRef but within the spotlight container
		if (contentsContainer && contentsContainer.contains(target)) {
			const
				{scrollBounds: {maxLeft, maxTop}, scrollPos: {left, top}} = uiRefCurrent,
				isVerticalDirection = (direction === 'up' || direction === 'down'),
				pos = isVerticalDirection ? top : left,
				max = isVerticalDirection ? maxTop : maxLeft;

			// If max is equal to 0, it means scroller can not scroll to the direction.
			if (pos >= 0 && pos <= max && max !== 0) {
				props.scrollAndFocusScrollbarButton(direction);
			}
		}
	}

	function initUiRef (ref) {
		if (ref) {
			uiRefCurrent.current = ref;
			props.initUiChildRef(ref);
		}
	}

	// render ()
	const propsObject = Object.assign({}, props);
	delete propsObject.initUiChildRef;
	delete propsObject.onUpdate;
	delete propsObject.scrollAndFocusScrollbarButton;
	delete propsObject.spotlightId;

	return (
		<UiScrollerBase
			{...propsObject}
			ref={initUiRef}
		/>
	);
};

ScrollerBase.displayName  = 'ScrollerBase';
ScrollerBase.propTypes = /** @lends moonstone/Scroller.ScrollerBase.prototype */ {
	/**
	 * Passes the instance of [Scroller]{@link ui/Scroller.Scroller}.
	 *
	 * @type {Object}
	 * @param {Object} ref
	 * @private
	 */
	initUiChildRef: PropTypes.func,

	/**
	 * Called when [Scroller]{@link moonstone/Scroller.Scroller} updates.
	 *
	 * @type {function}
	 * @private
	 */
	onUpdate: PropTypes.func,

	/**
	 * `true` if rtl, `false` if ltr.
	 *
	 * @type {Boolean}
	 * @private
	 */
	rtl: PropTypes.bool,

	/**
	 * Called when [Scroller]{@link moonstone/Scroller.Scroller} should be scrolled
	 * and the focus should be moved to a scrollbar button.
	 *
	 * @type {function}
	 * @private
	 */
	scrollAndFocusScrollbarButton: PropTypes.func,

	/**
	 * The spotlight id for the component.
	 *
	 * @type {String}
	 * @private
	 */
	spotlightId: PropTypes.string
};

/**
 * Allows 5-way navigation to the scrollbar controls. By default, 5-way will
 * not move focus to the scrollbar controls.
 *
 * @name focusableScrollbar
 * @memberof moonstone/Scroller.ScrollerBase.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

/**
 * Unique identifier for the component.
 *
 * When defined and when the `Scroller` is within a [Panel]{@link moonstone/Panels.Panel}, the
 * `Scroller` will store its scroll position and restore that position when returning to the
 * `Panel`.
 *
 * @name id
 * @memberof moonstone/Scroller.ScrollerBase.prototype
 * @type {String}
 * @public
 */

/**
 * Sets the hint string read when focusing the next button in the vertical scroll bar.
 *
 * @name scrollDownAriaLabel
 * @memberof moonstone/Scroller.ScrollerBase.prototype
 * @type {String}
 * @default $L('scroll down')
 * @public
 */

/**
 * Sets the hint string read when focusing the previous button in the horizontal scroll bar.
 *
 * @name scrollLeftAriaLabel
 * @memberof moonstone/Scroller.ScrollerBase.prototype
 * @type {String}
 * @default $L('scroll left')
 * @public
 */

/**
 * Sets the hint string read when focusing the next button in the horizontal scroll bar.
 *
 * @name scrollRightAriaLabel
 * @memberof moonstone/Scroller.ScrollerBase.prototype
 * @type {String}
 * @default $L('scroll right')
 * @public
 */

/**
 * Sets the hint string read when focusing the previous button in the vertical scroll bar.
 *
 * @name scrollUpAriaLabel
 * @memberof moonstone/Scroller.ScrollerBase.prototype
 * @type {String}
 * @default $L('scroll up')
 * @public
 */

/**
 * A Moonstone-styled Scroller, Scrollable applied.
 *
 * Usage:
 * ```
 * <Scroller>Scroll me.</Scroller>
 * ```
 *
 * @class Scroller
 * @memberof moonstone/Scroller
 * @extends moonstone/Scroller.ScrollerBase
 * @ui
 * @public
 */
const Scroller = (props) => (
	<Scrollable
		{...props}
		childRenderer={(scrollerProps) => { // eslint-disable-line react/jsx-no-bind
			return <ScrollerBase {...scrollerProps} />;
		}}
	/>
);

Scroller.propTypes = /** @lends moonstone/Scroller.Scroller.prototype */ {
	direction: PropTypes.oneOf(['both', 'horizontal', 'vertical'])
};

Scroller.defaultProps = {
	direction: 'both'
};

/**
 * A Moonstone-styled native Scroller, Scrollable applied.
 *
 * For smooth native scrolling, web engine with below Chromium 61, should be launched
 * with the flag '--enable-blink-features=CSSOMSmoothScroll' to support it.
 * The one with Chromium 61 or above, is launched to support it by default.
 *
 * Usage:
 * ```
 * <ScrollerNative>Scroll me.</ScrollerNative>
 * ```
 *
 * @class ScrollerNative
 * @memberof moonstone/Scroller
 * @extends moonstone/Scroller.ScrollerBase
 * @ui
 * @private
 */
const ScrollerNative = (props) => (
	<ScrollableNative
		{...props}
		childRenderer={(scrollerProps) => { // eslint-disable-line react/jsx-no-bind
			return <ScrollerBase {...scrollerProps} />;
		}}
	/>
);

ScrollerNative.propTypes = /** @lends moonstone/Scroller.ScrollerNative.prototype */ {
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
