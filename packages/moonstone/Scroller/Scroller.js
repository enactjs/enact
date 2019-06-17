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
import ri from '@enact/ui/resolution';
import {ScrollerBase as UiScrollerBase} from '@enact/ui/Scroller';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Scrollable from '../Scrollable';
import ScrollableNative from '../Scrollable/ScrollableNative';

const dataContainerDisabledAttribute = 'data-spotlight-container-disabled';

/**
 * A Moonstone-styled base component for [Scroller]{@link moonstone/Scroller.Scroller}.
 * In most circumstances, you will want to use the
 * [SpotlightContainerDecorator]{@link spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator}
 * and the Scrollable version, [Scroller]{@link moonstone/Scroller.Scroller}.
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
	}

	componentDidMount () {
		this.configureSpotlight();
	}

	componentDidUpdate (prevProps) {
		const {onUpdate} = this.props;
		if (onUpdate) {
			onUpdate();
		}

		if (prevProps.spotlightId !== this.props.spotlightId) {
			this.configureSpotlight();
		}
	}

	componentWillUnmount () {
		this.setContainerDisabled(false);
	}

	uiRefCurrent = null

	configureSpotlight () {
		Spotlight.set(this.props.spotlightId, {
			onLeaveContainer: this.handleLeaveContainer,
			onLeaveContainerFail: this.handleLeaveContainer
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
	getSpotlightContainerForNode = (node) => {
		do {
			if (node.dataset.spotlightId && node.dataset.spotlightContainer && !node.dataset.expandableContainer) {
				return node;
			}
		} while ((node = node.parentNode) && node !== this.uiRefCurrent.containerRef.current);
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
	calculateScrollTop = (item) => {
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

		const container = this.getSpotlightContainerForNode(item);
		const scrollerBounds = this.uiRefCurrent.containerRef.current.getBoundingClientRect();
		let {scrollHeight, scrollTop} = this.uiRefCurrent.containerRef.current;
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
	calculatePositionOnFocus = ({item, scrollPosition}) => {
		if (!this.uiRefCurrent.isVertical() && !this.uiRefCurrent.isHorizontal() || !item || !this.uiRefCurrent.containerRef.current.contains(item)) {
			return;
		}

		if (this.uiRefCurrent.isVertical()) {
			this.uiRefCurrent.scrollPos.top = this.calculateScrollTop(item);
		} else if (this.uiRefCurrent.isHorizontal()) {
			const {
				left: itemLeft,
				width: itemWidth
			} = this.getFocusedItemBounds(item);

			const
				{rtl} = this.props,
				{clientWidth} = this.uiRefCurrent.scrollBounds,
				rtlDirection = rtl ? -1 : 1,
				{left: containerLeft} = this.uiRefCurrent.containerRef.current.getBoundingClientRect(),
				scrollLastPosition = scrollPosition ? scrollPosition : this.uiRefCurrent.scrollPos.left,
				currentScrollLeft = rtl ? (this.uiRefCurrent.scrollBounds.maxLeft - scrollLastPosition) : scrollLastPosition,
				// calculation based on client position
				newItemLeft = this.uiRefCurrent.containerRef.current.scrollLeft + (itemLeft - containerLeft);

			if (newItemLeft + itemWidth > (clientWidth + currentScrollLeft) && itemWidth < clientWidth) {
				// If focus is moved to an element outside of view area (to the right), scroller will move
				// to the right just enough to show the current `focusedItem`. This does not apply to
				// `focusedItem` that has a width that is bigger than `this.scrollBounds.clientWidth`.
				this.uiRefCurrent.scrollPos.left += rtlDirection * ((newItemLeft + itemWidth) - (clientWidth + currentScrollLeft));
			} else if (newItemLeft < currentScrollLeft) {
				// If focus is outside of the view area to the left, move scroller to the left accordingly.
				this.uiRefCurrent.scrollPos.left += rtlDirection * (newItemLeft - currentScrollLeft);
			}
		}

		return this.uiRefCurrent.scrollPos;
	}

	focusOnNode = (node) => {
		if (node) {
			Spotlight.focus(node);
		}
	}

	handleGlobalKeyDown = () => {
		this.setContainerDisabled(false);
	}

	setContainerDisabled = (bool) => {
		const
			{spotlightId} = this.props,
			containerNode = document.querySelector(`[data-spotlight-id="${spotlightId}"]`);

		if (containerNode) {
			containerNode.setAttribute(dataContainerDisabledAttribute, bool);

			if (bool) {
				document.addEventListener('keydown', this.handleGlobalKeyDown, {capture: true});
			} else {
				document.removeEventListener('keydown', this.handleGlobalKeyDown, {capture: true});
			}
		}
	}

	handleLeaveContainer = ({direction, target}) => {
		const contentsContainer = this.uiRefCurrent.containerRef.current;
		// ensure we only scroll to boundary from the contents and not a scroll button which
		// lie outside of this.uiRefCurrent.containerRef but within the spotlight container
		if (contentsContainer && contentsContainer.contains(target)) {
			const
				{scrollBounds: {maxLeft, maxTop}, scrollPos: {left, top}} = this.uiRefCurrent,
				isVerticalDirection = (direction === 'up' || direction === 'down'),
				pos = isVerticalDirection ? top : left,
				max = isVerticalDirection ? maxTop : maxLeft;

			if (pos > 0 && pos < max) {
				this.props.scrollAndFocusScrollbarButton(direction);
			}
		}
	}

	initUiRef = (ref) => {
		if (ref) {
			this.uiRefCurrent = ref;
			this.props.initUiChildRef(ref);
		}
	}

	render () {
		const props = Object.assign({}, this.props);

		delete props.initUiChildRef;
		delete props.onUpdate;
		delete props.scrollAndFocusScrollbarButton;
		delete props.spotlightId;

		return (
			<UiScrollerBase
				{...props}
				ref={this.initUiRef}
			/>
		);
	}
}

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
	/**
	 * Direction of the scroller.
	 *
	 * * Values: `'both'`, `'horizontal'`, `'vertical'`.
	 *
	 * @type {String}
	 * @default 'both'
	 * @public
	 */
	direction: PropTypes.oneOf(['both', 'horizontal', 'vertical']),

	/**
	 * Unique identifier for the component.
	 *
	 * When defined and when the `Scroller` is within a [Panel]{@link moonstone/Panels.Panel}, the
	 * `Scroller` will store its scroll position and restore that position when returning to the
	 * `Panel`.
	 *
	 * @type {String}
	 * @public
	 */
	id: PropTypes.string
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
	/**
	 * Direction of the scroller.
	 *
	 * * Values: `'both'`, `'horizontal'`, `'vertical'`.
	 *
	 * @type {String}
	 * @default 'both'
	 * @public
	 */
	direction: PropTypes.oneOf(['both', 'horizontal', 'vertical']),

	/**
	 * Unique identifier for the component.
	 *
	 * When defined and when the `Scroller` is within a [Panel]{@link moonstone/Panels.Panel}, the
	 * `Scroller` will store its scroll position and restore that position when returning to the
	 * `Panel`.
	 *
	 * @type {String}
	 * @public
	 */
	id: PropTypes.string
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
