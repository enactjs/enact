/**
 * Provides Moonstone-themed scrollable native components and behaviors.
 *
 * @module moonstone/Scrollable
 * @exports ScrollableNative
 * @exports dataIndexAttribute
 */

import classNames from 'classnames';
import css from '@enact/ui/Scrollable/Scrollable.less';
import {getTargetByDirectionFromPosition} from '@enact/spotlight/src/target';
import kind from '@enact/core/kind';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import PropTypes from 'prop-types';
import React from 'react';
import {ScrollableBaseNative as UiScrollableBaseNative, constants} from '@enact/ui/Scrollable/ScrollableNative';

import Scrollbar from './Scrollbar';
import scrollbarCss from './Scrollbar.less';

const
	{
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
 * [dataIndexAttribute]{@link moonstone/Scrollable.dataIndexAttribute} is the name of a custom attribute
 * which indicates the index of an item in [VirtualListNative]{@link moonstone/VirtualList.VirtualListNative}
 * or [VirtualGridListNative]{@link moonstone/VirtualList.VirtualGridListNative}.
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
 * [ScrollableBaseNative]{@link moonstone/Scrollable.ScrollableBaseNative} is a base component for
 * [ScrollableNative]{@link moonstone/Scrollable.ScrollableNative}.
 *
 * @class ScrollableBaseNative
 * @extends ui/Scrollable.ScrollableBaseNative
 * @memberof moonstone/Scrollable
 * @ui
 * @private
 */
class ScrollableBaseNative extends UiScrollableBaseNative {
	static displayName = 'ScrollableBaseNative'

	static propTypes = /** @lends moonstone/Scrollable.ScrollableBaseNative.prototype */ {
		/**
		 * When `true`, allows 5-way navigation to the scrollbar controls. By default, 5-way will
		 * not move focus to the scrollbar controls.
		 *
		 * @type {Boolean}
		 * @public
		 */
		focusableScrollbar: PropTypes.bool
	}

	constructor (props) {
		super(props);

		this.verticalScrollbarProps.cbAlertThumb = this.alertThumbAfterRendered;
		this.verticalScrollbarProps.onNextScroll = this.onScrollbarButtonClick;
		this.verticalScrollbarProps.onPrevScroll = this.onScrollbarButtonClick;
		this.horizontalScrollbarProps.cbAlertThumb = this.alertThumbAfterRendered;
		this.horizontalScrollbarProps.onNextScroll = this.onScrollbarButtonClick;
		this.horizontalScrollbarProps.onPrevScroll = this.onScrollbarButtonClick;
	}

	componentDidUpdate (prevProps, prevState) {
		super.componentDidUpdate(prevProps, prevState);

		if (this.scrollToInfo === null) {
			this.updateScrollOnFocus();
		}
	}

	// status
	isWheeling = false

	// spotlight
	animateOnFocus = false
	lastFocusedItem = null
	lastScrollPositionOnFocus = null
	indexToFocus = null
	nodeToFocus = null

	// browser native scrolling
	resetPosition = null // prevent auto-scroll on focus by Spotlight

	scrollByFlick () {
		const focusedItem = Spotlight.getCurrent();

		if (focusedItem) {
			focusedItem.blur();
		}

		this.childRef.setContainerDisabled(true);

		super.scrollByFlick();
	}

	onMouseDown (e) {
		super.onMouseDown(e);

		this.lastFocusedItem = null;
		this.childRef.setContainerDisabled(false);
	}

	onMouseOver = () => {
		this.resetPosition = (this.scrolling) ? null : this.childRef.containerRef.scrollTop;
	}

	onMouseMove (e) {
		super.onMouseMove(e);

		if (!this.isDragging && this.resetPosition !== null) {
			const childContainerRef = this.childRef.containerRef; childContainerRef.style.scrollBehavior = null;
			childContainerRef.scrollTop = this.resetPosition;
			childContainerRef.style.scrollBehavior = 'smooth';
			this.resetPosition = null;
		}
	}

	/*
	 * wheel event handler;
	 * - for horizontal scroll, supports wheel action on any children nodes since web engine cannot suppor this
	 * - for vertical scroll, supports wheel action on scrollbars only
	 */
	onWheel = (e) => {
		const
			bounds = this.getScrollBounds(),
			canScrollHorizontally = this.canScrollHorizontally(bounds),
			canScrollVertically = this.canScrollVertically(bounds),
			eventDeltaMode = e.deltaMode,
			eventDelta = (-e.wheelDeltaY || e.deltaY);
		let
			delta = 0,
			needToHideThumb = false;

		this.lastFocusedItem = null;
		if (typeof window !== 'undefined') {
			window.document.activeElement.blur();
		}

		this.showThumb(bounds);

		// FIXME This routine is a temporary support for horizontal wheel scroll.
		// FIXME If web engine supports horizontal wheel, this routine should be refined or removed.
		if (canScrollVertically) { // This routine handles wheel events on scrollbars for vertical scroll.
			if (eventDelta < 0 && this.scrollTop > 0 || eventDelta > 0 && this.scrollTop < bounds.maxTop) {
				const {horizontalScrollbarRef, verticalScrollbarRef} = this;

				if (!this.isWheeling) {
					this.childRef.setContainerDisabled(true);
					this.isWheeling = true;
				}

				// Not to check if e.target is a descendant of a wrapped component which may have a lot of nodes in it.
				if ((horizontalScrollbarRef && horizontalScrollbarRef.containerRef.contains(e.target)) ||
					(verticalScrollbarRef && verticalScrollbarRef.containerRef.contains(e.target))) {
					delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientHeight * scrollWheelPageMultiplierForMaxPixel);
					needToHideThumb = !delta;
				}
			} else {
				needToHideThumb = true;
			}
		} else if (canScrollHorizontally) { // this routine handles wheel events on any children for horizontal scroll.
			if (eventDelta < 0 && this.scrollLeft > 0 || eventDelta > 0 && this.scrollLeft < bounds.maxLeft) {
				if (!this.isWheeling) {
					this.childRef.setContainerDisabled(true);
					this.isWheeling = true;
				}
				delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientWidth * scrollWheelPageMultiplierForMaxPixel);
				needToHideThumb = !delta;
			} else {
				needToHideThumb = true;
			}
		}

		if (delta !== 0) {
			/* prevent native scrolling feature for vertical direction */
			e.preventDefault();
			const direction = Math.sign(delta);
			// Not to accumulate scroll position if wheel direction is different from hold direction
			if (direction !== this.pageDirection) {
				this.isScrollAnimationTargetAccumulated = false;
				this.pageDirection = direction;
			}
			this.scrollToAccumulatedTarget(delta, canScrollVertically);
		}

		if (needToHideThumb) {
			this.startHidingThumb();
		}
	}

	start (targetX, targetY, animate = true) {
		super.start(targetX, targetY, animate);

		if (!animate) {
			this.focusOnItem();
		}
	}

	// event handlers for Spotlight support

	startScrollOnFocus = (pos, item) => {
		if (pos) {
			const
				{top, left} = pos,
				bounds = this.getScrollBounds();

			if ((bounds.maxTop > 0 && top !== this.scrollTop) || (bounds.maxLeft > 0 && left !== this.scrollLeft)) {
				this.start(left, top, this.animateOnFocus);
			}
			this.lastFocusedItem = item;
			this.lastScrollPositionOnFocus = pos;
		}
	}

	onFocus = (e) => {
		const shouldPreventScrollByFocus = this.childRef.shouldPreventScrollByFocus ?
			this.childRef.shouldPreventScrollByFocus() :
			false;

		if (!Spotlight.getPointerMode()) {
			this.alertThumb();
		}

		if (!(shouldPreventScrollByFocus || Spotlight.getPointerMode())) {
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
				if (this.scrolling && lastPos) {
					pos = positionFn({item, scrollPosition: (this.direction !== 'horizontal') ? lastPos.top : lastPos.left});
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
			isRtl = this.context.rtl,
			{direction} = this,
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
		if (!this.state.isVerticalScrollbarVisible) return;

		const
			{getEndPoint, scrollToAccumulatedTarget} = this,
			bounds = this.getScrollBounds(),
			canScrollVertically = this.canScrollVertically(bounds),
			childRef = this.childRef,
			pageDistance = isPageUp(keyCode) ? (this.pageDistance * -1) : this.pageDistance,
			spotItem = Spotlight.getCurrent();

		if (!Spotlight.getPointerMode() && spotItem) {
			// Should skip scroll by page when spotItem is paging control button of Scrollbar
			if (!childRef.containerRef.contains(spotItem)) {
				return;
			}
			const
				containerId = (
					// ScrollerNative has a containerId on containerRef
					childRef.containerRef.dataset.containerId ||
					// VirtualListNative has a containerId on contentRef
					childRef.contentRef.dataset.containerId
				),
				direction = this.getPageDirection(keyCode),
				rDirection = reverseDirections[direction],
				viewportBounds = this.containerRef.getBoundingClientRect(),
				spotItemBounds = spotItem.getBoundingClientRect(),
				endPoint = getEndPoint(direction, spotItemBounds, viewportBounds),
				next = getTargetByDirectionFromPosition(rDirection, endPoint, containerId),
				scrollFn = childRef.scrollToNextPage || childRef.scrollToNextItem;

			// If there is no next spottable DOM elements, scroll one page with animation
			if (!next) {
				scrollToAccumulatedTarget(pageDistance, canScrollVertically);
			// If there is a next spottable DOM element vertically or horizontally, focus it without animation
			} else if (next !== spotItem && childRef.scrollToNextPage) {
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

		return current && this.containerRef.contains(current);
	}

	onKeyDown = (e) => {
		this.animateOnFocus = true;
		if (isPageUp(e.keyCode) || isPageDown(e.keyCode)) {
			e.preventDefault();
			if (!e.repeat && this.hasFocus()) {
				this.scrollByPage(e.keyCode);
			}
		}
	}

	onScrollbarButtonClick = ({isPreviousScrollButton, isVerticalScrollBar}) => {
		const
			bounds = this.getScrollBounds(),
			pageDistance = (isVerticalScrollBar ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier,
			delta = isPreviousScrollButton ? -pageDistance : pageDistance,
			direction = Math.sign(delta);

		if (direction !== this.pageDirection) {
			this.isScrollAnimationTargetAccumulated = false;
			this.pageDirection = direction;
		}

		this.scrollToAccumulatedTarget(delta, isVerticalScrollBar);
	}

	scrollStopOnScroll () {
		super.scrollStopOnScroll();

		this.childRef.setContainerDisabled(false);
		this.focusOnItem();
		this.lastFocusedItem = null;
		this.lastScrollPositionOnFocus = null;
		this.isWheeling = false;
	}

	focusOnItem () {
		if (this.indexToFocus !== null && typeof this.childRef.focusByIndex === 'function') {
			this.childRef.focusByIndex(this.indexToFocus);
			this.indexToFocus = null;
		}
		if (this.nodeToFocus !== null && typeof this.childRef.focusOnNode === 'function') {
			this.childRef.focusOnNode(this.nodeToFocus);
			this.nodeToFocus = null;
		}
	}

	scrollTo = (opt) => {
		if (!this.deferScrollTo) {
			const {left, top} = this.getPositionForScrollTo(opt);

			this.indexToFocus = (opt.focus && typeof opt.index === 'number') ? opt.index : null;
			this.nodeToFocus = (opt.focus && opt.node instanceof Object && opt.node.nodeType === 1) ? opt.node : null;
			this.scrollToInfo = null;
			this.start(
				(left !== null) ? left : this.scrollLeft,
				(top !== null) ? top : this.scrollTop,
				opt.animate
			);
		} else {
			this.scrollToInfo = opt;
		}
	}

	alertThumb () {
		const bounds = this.getScrollBounds();

		this.showThumb(bounds);
		this.startHidingThumb();
	}

	alertThumbAfterRendered = () => {
		const spotItem = Spotlight.getCurrent();

		if (!Spotlight.getPointerMode() && spotItem && this.childRef.containerRef.contains(spotItem) && this.isUpdatedScrollThumb) {
			this.alertThumb();
		}
	}

	updateScrollOnFocus () {
		const
			focusedItem = Spotlight.getCurrent(),
			{containerRef, calculatePositionOnFocus} = this.childRef;

		if (focusedItem && containerRef && containerRef.contains(focusedItem)) {
			const
				scrollInfo = {
					previousScrollHeight: this.bounds.scrollHeight,
					scrollTop: this.scrollTop
				},
				pos = calculatePositionOnFocus({item: focusedItem, scrollInfo});

			if (pos && (pos.left !== this.scrollLeft || pos.top !== this.scrollTop)) {
				this.start(pos.left, pos.top, false);
			}
		}

		// update `scrollHeight`
		this.bounds.scrollHeight = this.getScrollBounds().scrollHeight;
	}

	addEventListeners () {
		const childContainerRef = this.childRef.containerRef;

		super.addEventListeners();

		if (childContainerRef && childContainerRef.addEventListener) {
			// FIXME event handlers don't work on the v8 snapshot.
			childContainerRef.addEventListener('focusin', this.onFocus);
			childContainerRef.addEventListener('mouseover', this.onMouseOver, {capture: true});
		}
	}

	removeEventListeners () {
		const childContainerRef = this.childRef.containerRef;

		super.removeEventListeners();

		if (childContainerRef && childContainerRef.removeEventListener) {
			// FIXME event handlers don't work on the v8 snapshot.
			childContainerRef.removeEventListener('focusin', this.onFocus);
			childContainerRef.removeEventListener('mouseover', this.onMouseOver, {capture: true});
		}
	}

	render () {
		const
			{className, focusableScrollbar, style, wrapped: Wrapped, ...rest} = this.props,
			{isHorizontalScrollbarVisible, isVerticalScrollbarVisible} = this.state,
			scrollableClasses = classNames(css.scrollable, className);

		delete rest.cbScrollTo;
		delete rest.className;
		delete rest.horizontalScrollbar;
		delete rest.onScroll;
		delete rest.onScrollbarVisibilityChange;
		delete rest.onScrollStart;
		delete rest.onScrollStop;
		delete rest.style;
		delete rest.verticalScrollbar;

		return (
			<ScrollableSpotlightContainer
				className={scrollableClasses}
				containerRef={this.initContainerRef}
				focusableScrollbar={focusableScrollbar}
				style={style}
			>
				<div className={css.container}>
					<Wrapped
						{...rest}
						cbScrollTo={this.scrollTo}
						className={css.content}
						ref={this.initChildRef}
					/>
					{isVerticalScrollbarVisible ? <Scrollbar {...this.verticalScrollbarProps} disabled={!isVerticalScrollbarVisible} /> : null}
				</div>
				{isHorizontalScrollbarVisible ? <Scrollbar {...this.horizontalScrollbarProps} corner={isVerticalScrollbarVisible} disabled={!isHorizontalScrollbarVisible} /> : null}
			</ScrollableSpotlightContainer>
		);
	}
}

/**
 * [ScrollableNative]{@link moonstone/Scrollable.ScrollableNative} is a Higher-order Component
 * that applies a Scrollable behavior to its wrapped component.
 *
 * @class ScrollableNative
 * @memberof moonstone/Scrollable
 * @ui
 * @private
 */
const ScrollableNative = (WrappedComponent) => (kind({
	name: 'ScrollableNative',
	render: (props) => (<ScrollableBaseNative wrapped={WrappedComponent} {...props} />)
}));

export default ScrollableNative;
export {
	ScrollableNative,
	dataIndexAttribute
};
