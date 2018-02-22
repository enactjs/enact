/**
 * Provides Moonstone-themed scrollable components and behaviors.
 *
 * @module moonstone/Scrollable
 * @exports Scrollable
 * @exports dataIndexAttribute
 * @private
 */

import classNames from 'classnames';
import compose from 'ramda/src/compose';
import css from '@enact/ui/Scrollable/Scrollable.less';
import {getTargetByDirectionFromPosition} from '@enact/spotlight/src/target';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {constants, contextTypes} from '@enact/ui/Scrollable';

import Scrollbar from './Scrollbar';
import scrollbarCss from './Scrollbar.less';

const
	{
		animationDuration,
		isPageDown,
		isPageUp,
		paginationPageMultiplier,
		scrollWheelPageMultiplierForMaxPixel
	} = constants,
	reverseDirections = {
		down: 'up',
		left: 'right',
		right: 'left',
		up: 'down'
	};

/**
 * The name of a custom attribute which indicates the index of an item in
 * [VirtualList]{@link moonstone/VirtualList.VirtualList} or [VirtualGridList]{@link moonstone/VirtualList.VirtualGridList}.
 *
 * @constant dataIndexAttribute
 * @memberof moonstone/Scrollable
 * @type {String}
 * @private
 */
const dataIndexAttribute = 'data-index';

const ScrollableSpotlightContainer = SpotlightContainerDecorator(
	{
		navigableFilter: (elem, {focusableScrollbar}) => {
			if (
				!focusableScrollbar &&
				!Spotlight.getPointerMode() &&
				// ignore containers passed as their id
				typeof elem !== 'string' &&
				elem.classList.contains(scrollbarCss.scrollButton)
			) {
				return false;
			}
		},
		overflow: true
	},
	({containerRef, ...rest}) => {
		delete rest.focusableScrollbar;

		return (
			<div ref={containerRef} {...rest} />
		);
	}
);

/**
 * A Higher-order Component that applies a Scrollable behavior to its wrapped component.
 *
 * @class Scrollable
 * @memberof moonstone/Scrollable
 * @ui
 * @private
 */
const Scrollable = (Wrapped) => (
	class ScrollableBase extends Component {
		static displayName = 'ScrollableBase'

		static propTypes = /** @lends moonstone/Scrollable.ScrollableBase.prototype */ {
			/**
			 * When `true`, allows 5-way navigation to the scrollbar controls. By default, 5-way will
			 * not move focus to the scrollbar controls.
			 *
			 * @type {Boolean}
			 * @public
			 */
			focusableScrollbar: PropTypes.bool
		}

		static childContextTypes = contextTypes

		getChildContext () {
			return {
				initialize: this.initialize,
				onKeyDown: this.onKeyDown,
				onMouseUp: this.onMouseUp,
				onWheel: this.onWheel,
				removeEventListeners: this.removeEventListeners,
				scrollTo: this.scrollTo,
				stop: this.stop,
				updateEventListeners: this.updateEventListeners
			};
		}

		// status
		isWheeling = false

		// spotlight
		animateOnFocus = false
		lastFocusedItem = null
		lastScrollPositionOnFocus = null
		indexToFocus = null
		nodeToFocus = null

		initialize = (uiScrollableRef) => {
			uiScrollableRef.verticalScrollbarProps.cbAlertThumb = this.alertThumbAfterRendered;
			uiScrollableRef.verticalScrollbarProps.onNextScroll = this.onScrollbarButtonClick;
			uiScrollableRef.verticalScrollbarProps.onPrevScroll = this.onScrollbarButtonClick;
			uiScrollableRef.horizontalScrollbarProps.cbAlertThumb = this.alertThumbAfterRendered;
			uiScrollableRef.horizontalScrollbarProps.onNextScroll = this.onScrollbarButtonClick;
			uiScrollableRef.horizontalScrollbarProps.onPrevScroll = this.onScrollbarButtonClick;

			this.initContainerRef = uiScrollableRef.initContainerRef;
			this.uiScrollableRef = uiScrollableRef;
		}

		componentDidUpdate () {
			if (this.uiScrollableRef.scrollToInfo === null) {
				this.updateScrollOnFocus();
			}
		}

		// TBD

		onMouseUp = (e) => {
			if (this.uiScrollableRef.isDragging && this.uiScrollableRef.isFlicking()) {
				const focusedItem = Spotlight.getCurrent();

				if (focusedItem) {
					focusedItem.blur();
				}
			}
		}

		onWheel = (delta) => {
			const
				{verticalScrollbarRef, horizontalScrollbarRef} = this.uiScrollableRef,
				focusedItem = Spotlight.getCurrent(),
				isVerticalScrollButtonFocused = verticalScrollbarRef && verticalScrollbarRef.isThumbFocused(),
				isHorizontalScrollButtonFocused = horizontalScrollbarRef && horizontalScrollbarRef.isThumbFocused();

			if (focusedItem && !isVerticalScrollButtonFocused && !isHorizontalScrollButtonFocused) {
				focusedItem.blur();
			}

			if (delta !== 0) {
				this.isWheeling = true;
				this.childRef.setContainerDisabled(true);
			}
		}

		startScrollOnFocus = (pos, item) => {
			if (pos) {
				const
					{top, left} = pos,
					bounds = this.uiScrollableRef.getScrollBounds();

				if ((bounds.maxTop > 0 && top !== this.uiScrollableRef.scrollTop) || (bounds.maxLeft > 0 && left !== this.uiScrollableRef.scrollLeft)) {
					this.uiScrollableRef.start({
						targetX: left,
						targetY: top,
						animate: (animationDuration > 0) && this.animateOnFocus,
						duration: animationDuration
					});
				}
				this.lastFocusedItem = item;
				this.lastScrollPositionOnFocus = pos;
			}
		}

		onFocus = (e) => {
			const
				{isDragging, animator, direction} = this.uiScrollableRef,
				shouldPreventScrollByFocus = this.childRef.shouldPreventScrollByFocus ?
				this.childRef.shouldPreventScrollByFocus() :
				false;

			if (this.isWheeling) {
				this.uiScrollableRef.stop();
				this.animateOnFocus = false;
			}

			if (!Spotlight.getPointerMode()) {
				this.alertThumb();
			}

			if (!(shouldPreventScrollByFocus || Spotlight.getPointerMode() || isDragging)) {
				const
					item = e.target,
					positionFn = this.childRef.calculatePositionOnFocus,
					spotItem = Spotlight.getCurrent();

				if (item && item === spotItem && positionFn) {
					const lastPos = this.lastScrollPositionOnFocus;
					let pos;

					const focusedIndex = Number.parseInt(item.getAttribute(dataIndexAttribute));
					if (!isNaN(focusedIndex)) {
						this.childRef.setNodeIndexToBeFocused(null);
						this.childRef.setLastFocusedIndex(focusedIndex);
					}

					// If scroll animation is ongoing, we need to pass last target position to
					// determine correct scroll position.
					if (animator.isAnimating() && lastPos) {
						pos = positionFn({item, scrollPosition: (direction !== 'horizontal') ? lastPos.top : lastPos.left});
					} else {
						pos = positionFn({item});
					}

					this.startScrollOnFocus(pos, item);
				}
			} else if (this.childRef.setLastFocusedIndex) {
				this.childRef.setLastFocusedIndex(e.target);
			}
		}

		getPageDirection = (keyCode) => {
			const
				isRtl = this.uiScrollableRef.context.rtl,
				{direction} = this.uiScrollableRef,
				isVertical = (direction === 'vertical' || direction === 'both');

			return isPageUp(keyCode) ?
				(isVertical && 'up' || isRtl && 'right' || 'left') :
				(isVertical && 'down' || isRtl && 'left' || 'right');
		}

		getEndPoint = (direction, oSpotBounds, viewportBounds) => {
			let oPoint = {};

			switch (direction) {
				case 'up':
					oPoint.x = oSpotBounds.left + oSpotBounds.width / 2;
					oPoint.y = viewportBounds.top;
					break;
				case 'left':
					oPoint.x = viewportBounds.left;
					oPoint.y = oSpotBounds.top;
					break;
				case 'down':
					oPoint.x = oSpotBounds.left + oSpotBounds.width / 2;
					oPoint.y = viewportBounds.top + viewportBounds.height;
					break;
				case 'right':
					oPoint.x = viewportBounds.left + viewportBounds.width;
					oPoint.y = oSpotBounds.top;
					break;
			}
			return oPoint;
		}

		scrollByPage = (keyCode) => {
			// Only scroll by page when the vertical scrollbar is visible. Otherwise, treat the
			// scroller as a plain container
			if (!this.uiScrollableRef.state.isVerticalScrollbarVisible) return;

			const
				{childRef, containerRef, scrollToAccumulatedTarget} = this.uiScrollableRef,
				bounds = this.uiScrollableRef.getScrollBounds(),
				canScrollVertically = this.uiScrollableRef.canScrollVertically(bounds),
				pageDistance = isPageUp(keyCode) ? (this.uiScrollableRef.pageDistance * -1) : this.uiScrollableRef.pageDistance,
				spotItem = Spotlight.getCurrent();

			if (!Spotlight.getPointerMode() && spotItem) {
				// Should skip scroll by page when spotItem is paging control button of Scrollbar
				if (!childRef.containerRef.contains(spotItem)) {
					return;
				}

				const
					// VirtualList and Scroller have a containerId on containerRef
					containerId = childRef.containerRef.dataset.containerId,
					direction = this.getPageDirection(keyCode),
					rDirection = reverseDirections[direction],
					viewportBounds = containerRef.getBoundingClientRect(),
					spotItemBounds = spotItem.getBoundingClientRect(),
					endPoint = this.getEndPoint(direction, spotItemBounds, viewportBounds),
					next = getTargetByDirectionFromPosition(rDirection, endPoint, containerId),
					scrollFn = this.childRef.scrollToNextPage || this.childRef.scrollToNextItem;

				// If there is no next spottable DOM elements, scroll one page with animation
				if (!next) {
					scrollToAccumulatedTarget(pageDistance, canScrollVertically);
				// If there is a next spottable DOM element vertically or horizontally, focus it without animation
				} else if (next !== spotItem && this.childRef.scrollToNextPage) {
					this.animateOnFocus = false;
					Spotlight.focus(next);
				// If a next spottable DOM element is equals to the current spottable item, we need to find a next item
				} else {
					const nextPage = scrollFn({direction, reverseDirection: rDirection, focusedItem: spotItem, containerId});

					// If finding a next spottable item in a Scroller, focus it
					if (typeof nextPage === 'object') {
						this.animateOnFocus = false;
						Spotlight.focus(nextPage);
					// Scroll one page with animation if nextPage is equals to `false`
					} else if (!nextPage) {
						scrollToAccumulatedTarget(pageDistance, canScrollVertically);
					}
				}
			} else {
				scrollToAccumulatedTarget(pageDistance, canScrollVertically);
			}
		}

		hasFocus () {
			let current = Spotlight.getCurrent();

			if (!current || Spotlight.getPointerMode()) {
				const containerId = Spotlight.getActiveContainer();
				current = document.querySelector(`[data-container-id="${containerId}"]`);
			}

			return current && this.uiScrollableRef.containerRef.contains(current);
		}

		onKeyDown = (e) => {
			this.animateOnFocus = true;
			if ((isPageUp(e.keyCode) || isPageDown(e.keyCode)) && !e.repeat && this.hasFocus()) {
				this.scrollByPage(e.keyCode);
			}
		}

		onScrollbarButtonClick = ({isPreviousScrollButton, isVerticalScrollBar}) => {
			const
				bounds = this.uiScrollableRef.getScrollBounds(),
				pageDistance = (isVerticalScrollBar ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier,
				delta = isPreviousScrollButton ? -pageDistance : pageDistance,
				direction = Math.sign(delta);

			if (direction !== this.uiScrollableRef.pageDirection) {
				this.uiScrollableRef.isScrollAnimationTargetAccumulated = false;
				this.uiScrollableRef.pageDirection = direction;
			}

			this.uiScrollableRef.scrollToAccumulatedTarget(delta, isVerticalScrollBar);
		}

		stop = () => {
			this.childRef.setContainerDisabled(false);
			this.focusOnItem(this.childRef);
			this.lastFocusedItem = null;
			this.lastScrollPositionOnFocus = null;
		}

		focusOnItem (childRef) {
			if (this.indexToFocus !== null && typeof childRef.focusByIndex === 'function') {
				childRef.focusByIndex(this.indexToFocus);
				this.indexToFocus = null;
			}
			if (this.nodeToFocus !== null && typeof childRef.focusOnNode === 'function') {
				childRef.focusOnNode(this.nodeToFocus);
				this.nodeToFocus = null;
			}
		}

		scrollTo = (opt) => {
			if (!this.uiScrollableRef.deferScrollTo) {
				const {left, top} = this.uiScrollableRef.getPositionForScrollTo(opt);

				this.indexToFocus = (opt.focus && typeof opt.index === 'number') ? opt.index : null;
				this.nodeToFocus = (opt.focus && opt.node instanceof Object && opt.node.nodeType === 1) ? opt.node : null;
				this.uiScrollableRef.scrollToInfo = null;
				this.uiScrollableRef.start({
					targetX: (left !== null) ? left : this.uiScrollableRef.scrollLeft,
					targetY: (top !== null) ? top : this.uiScrollableRef.scrollTop,
					animate: opt.animate
				});
			} else {
				this.uiScrollableRef.scrollToInfo = opt;
			}
		}

		alertThumb = () => {
			const bounds = this.uiScrollableRef.getScrollBounds();

			this.uiScrollableRef.showThumb(bounds);
			this.uiScrollableRef.startHidingThumb();
		}

		alertThumbAfterRendered () {
			const spotItem = Spotlight.getCurrent();

			if (!Spotlight.getPointerMode() && spotItem && this.uiScrollableRef && this.uiScrollableRef.childRef.containerRef.contains(spotItem) && this.isUpdatedScrollThumb) {
				this.alertThumb();
			}
		}

		updateScrollOnFocus () {
			const
				focusedItem = Spotlight.getCurrent(),
				{containerRef} = this.uiScrollableRef.childRef;

			if (focusedItem && containerRef && containerRef.contains(focusedItem)) {
				const
					scrollInfo = {
						previousScrollHeight: this.uiScrollableRef.bounds.scrollHeight,
						scrollTop: this.uiScrollableRef.scrollTop
					},
					pos = this.childRef.calculatePositionOnFocus({item: focusedItem, scrollInfo});

				if (pos && (pos.left !== this.uiScrollableRef.scrollLeft || pos.top !== this.uiScrollableRef.scrollTop)) {
					this.uiScrollableRef.start({
						targetX: pos.left,
						targetY: pos.top,
						animate: false
					});
				}
			}

			// update `scrollHeight`
			this.uiScrollableRef.bounds.scrollHeight = this.uiScrollableRef.getScrollBounds().scrollHeight;
		}

		updateEventListeners = () => {
			if (this.uiScrollableRef && this.uiScrollableRef.childRef) {
				const childContainerRef = this.uiScrollableRef.childRef.containerRef;

				if (childContainerRef && childContainerRef.addEventListener) {
					// FIXME `onFocus` doesn't work on the v8 snapshot.
					childContainerRef.addEventListener('focusin', this.onFocus);
				}
			}
		}

		removeEventListeners = () => {
			if (this.uiScrollableRef && this.uiScrollableRef.childRef) {
				const childContainerRef = this.uiScrollableRef.childRef.containerRef;

				if (childContainerRef && childContainerRef.removeEventListener) {
					// FIXME `onFocus` doesn't work on the v8 snapshot.
					childContainerRef.removeEventListener('focusin', this.onFocus);
				}
			}
		}

		initChildRef = (ref) => {
			this.childRef = ref;
		}

		render () {
			const {focusableScrollbar, ...rest} = this.props;

			return (
				<Wrapped
					{...rest}
					ref={this.initChildRef}
					scrollbarComponent={Scrollbar}
					wrapperContainer={ScrollableSpotlightContainer}
					wrapperProps={{
						containerRef: this.initContainerRef,
						focusableScrollbar
					}}
				/>
			);
		}
	}
);

export default Scrollable;
export {
	Scrollable,
	dataIndexAttribute
};
