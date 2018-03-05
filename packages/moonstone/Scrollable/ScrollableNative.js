/**
 * Provides Moonstone-themed scrollable native components and behaviors.
 *
 * @module moonstone/Scrollable
 * @exports ScrollableNative
 * @exports dataIndexAttribute
 * @private
 */

import {constants, ScrollableBaseNative as UiScrollableBaseNative} from '@enact/ui/Scrollable/ScrollableNative';
import {getTargetByDirectionFromPosition} from '@enact/spotlight/src/target';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

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
 * The name of a custom attribute which indicates the index of an item in
 * [VirtualListNative]{@link moonstone/VirtualList.VirtualListNative} or [VirtualGridListNative]{@link moonstone/VirtualList.VirtualGridListNative}.
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
 * A Higher-order Component that applies a Scrollable native behavior to its wrapped component.
 *
 * @memberof moonstone/Scrollable
 * @hoc
 * @private
 */
class ScrollableNative extends Component {
	static displayName = 'ScrollableNative'

	static propTypes = /** @lends moonstone/Scrollable.ScrollableBaseNative.prototype */ {
		/**
		 * When `true`, allows 5-way navigation to the scrollbar controls. By default, 5-way will
		 * not move focus to the scrollbar controls.
		 *
		 * @type {Boolean}
		 * @public
		 */
		focusableScrollbar: PropTypes.bool,

		/**
		 * Component for child
		 *
		 * @type {Function}
		 * @public
		 */
		render: PropTypes.func
	}

	constructor (props) {
		super(props);

		this.scrollbarProps = {
			cbAlertThumb: this.alertThumbAfterRendered,
			onNextScroll: this.onScrollbarButtonClick,
			onPrevScroll: this.onScrollbarButtonClick
		};
	}

	componentDidUpdate () {
		if (this.uiRef.scrollToInfo === null) {
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

	onMouseDown = () => {
		this.lastFocusedItem = null;
		this.childRef.setContainerDisabled(false);
	}

	onMouseOver = () => {
		this.resetPosition = this.uiRef.childRef.containerRef.scrollTop;
	}

	onMouseMove = () => {
		if (this.resetPosition !== null) {
			const childContainerRef = this.uiRef.childRef.containerRef;
			childContainerRef.style.scrollBehavior = null;
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
			bounds = this.uiRef.getScrollBounds(),
			canScrollHorizontally = this.uiRef.canScrollHorizontally(bounds),
			canScrollVertically = this.uiRef.canScrollVertically(bounds),
			eventDeltaMode = e.deltaMode,
			eventDelta = (-e.wheelDeltaY || e.deltaY);
		let
			delta = 0,
			needToHideThumb = false;

		this.lastFocusedItem = null;
		if (typeof window !== 'undefined') {
			window.document.activeElement.blur();
		}

		this.uiRef.showThumb(bounds);

		// FIXME This routine is a temporary support for horizontal wheel scroll.
		// FIXME If web engine supports horizontal wheel, this routine should be refined or removed.
		if (canScrollVertically) { // This routine handles wheel events on scrollbars for vertical scroll.
			if (eventDelta < 0 && this.uiRef.scrollTop > 0 || eventDelta > 0 && this.uiRef.scrollTop < bounds.maxTop) {
				const {horizontalScrollbarRef, verticalScrollbarRef} = this.uiRef;

				if (!this.isWheeling) {
					this.childRef.setContainerDisabled(true);
					this.isWheeling = true;
				}

				// Not to check if e.target is a descendant of a wrapped component which may have a lot of nodes in it.
				if ((horizontalScrollbarRef && horizontalScrollbarRef.getContainerRef().contains(e.target)) ||
					(verticalScrollbarRef && verticalScrollbarRef.getContainerRef().contains(e.target))) {
					delta = this.uiRef.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientHeight * scrollWheelPageMultiplierForMaxPixel);
					needToHideThumb = !delta;
				}
			} else {
				needToHideThumb = true;
			}
		} else if (canScrollHorizontally) { // this routine handles wheel events on any children for horizontal scroll.
			if (eventDelta < 0 && this.uiRef.scrollLeft > 0 || eventDelta > 0 && this.uiRef.scrollLeft < bounds.maxLeft) {
				if (!this.isWheeling) {
					this.childRef.setContainerDisabled(true);
					this.isWheeling = true;
				}
				delta = this.uiRef.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientWidth * scrollWheelPageMultiplierForMaxPixel);
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
			if (direction !== this.uiRef.pageDirection) {
				this.uiRef.isScrollAnimationTargetAccumulated = false;
				this.uiRef.pageDirection = direction;
			}
			this.uiRef.scrollToAccumulatedTarget(delta, canScrollVertically);
		}

		if (needToHideThumb) {
			this.uiRef.startHidingThumb();
		}
	}

	start = (animate) => {
		if (!animate) {
			this.focusOnItem();
		}
	}

	// event handlers for Spotlight support

	startScrollOnFocus = (pos, item) => {
		if (pos) {
			const
				{top, left} = pos,
				bounds = this.uiRef.getScrollBounds();

			if ((bounds.maxTop > 0 && top !== this.uiRef.scrollTop) || (bounds.maxLeft > 0 && left !== this.uiRef.scrollLeft)) {
				this.uiRef.start(left, top, this.animateOnFocus);
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

				// If scroll animation is ongoing, we need to pass last target position to
				// determine correct scroll position.
				if (this.uiRef.scrolling && lastPos) {
					pos = positionFn({item, scrollPosition: (this.uiRef.direction !== 'horizontal') ? lastPos.top : lastPos.left});
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
			isRtl = this.uiRef.context.rtl,
			{direction} = this.uiRef,
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
		if (!this.uiRef.state.isVerticalScrollbarVisible) return;

		const
			{childRef, scrollToAccumulatedTarget} = this.uiRef,
			bounds = this.uiRef.getScrollBounds(),
			canScrollVertically = this.uiRef.canScrollVertically(bounds),
			pageDistance = isPageUp(keyCode) ? (this.uiRef.pageDistance * -1) : this.uiRef.pageDistance,
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
				viewportBounds = this.uiRef.containerRef.getBoundingClientRect(),
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

		return current && this.uiRef.containerRef.contains(current);
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
			bounds = this.uiRef.getScrollBounds(),
			pageDistance = (isVerticalScrollBar ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier,
			delta = isPreviousScrollButton ? -pageDistance : pageDistance,
			direction = Math.sign(delta);

		if (direction !== this.uiRef.pageDirection) {
			this.uiRef.isScrollAnimationTargetAccumulated = false;
			this.uiRef.pageDirection = direction;
		}

		this.uiRef.scrollToAccumulatedTarget(delta, isVerticalScrollBar);
	}

	scrollStopOnScroll = () => {
		this.childRef.setContainerDisabled(false);
		this.focusOnItem();
		this.lastFocusedItem = null;
		this.lastScrollPositionOnFocus = null;
		this.isWheeling = false;
	}

	focusOnItem () {
		const childRef = this.childRef;

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
		if (!this.uiRef.deferScrollTo) {
			const {left, top} = this.uiRef.getPositionForScrollTo(opt);

			this.indexToFocus = (opt.focus && typeof opt.index === 'number') ? opt.index : null;
			this.nodeToFocus = (opt.focus && opt.node instanceof Object && opt.node.nodeType === 1) ? opt.node : null;
			this.uiRef.scrollToInfo = null;
			this.uiRef.start(
				(left !== null) ? left : this.uiRef.scrollLeft,
				(top !== null) ? top : this.uiRef.scrollTop,
				opt.animate
			);
		} else {
			this.uiRef.scrollToInfo = opt;
		}
	}

	alertThumb () {
		const bounds = this.uiRef.getScrollBounds();

		this.uiRef.showThumb(bounds);
		this.uiRef.startHidingThumb();
	}

	alertThumbAfterRendered = () => {
		const spotItem = Spotlight.getCurrent();

		if (!Spotlight.getPointerMode() && spotItem && this.uiRef && this.uiRef.childRef.containerRef.contains(spotItem) && this.isUpdatedScrollThumb) {
			this.alertThumb();
		}
	}

	updateScrollOnFocus () {
		const
			focusedItem = Spotlight.getCurrent(),
			{containerRef} = this.uiRef.childRef;

		if (focusedItem && containerRef && containerRef.contains(focusedItem)) {
			const
				scrollInfo = {
					previousScrollHeight: this.uiRef.bounds.scrollHeight,
					scrollTop: this.uiRef.scrollTop
				},
				pos = this.childRef.calculatePositionOnFocus({item: focusedItem, scrollInfo});

			if (pos && (pos.left !== this.uiRef.scrollLeft || pos.top !== this.uiRef.scrollTop)) {
				this.uiRef.start(pos.left, pos.top, false);
			}
		}

		// update `scrollHeight`
		this.uiRef.bounds.scrollHeight = this.uiRef.getScrollBounds().scrollHeight;
	}

	updateEventListeners = () => {
		if (this.uiRef && this.uiRef.childRef) {
			const childContainerRef = this.uiRef.childRef.containerRef;

			if (childContainerRef && childContainerRef.addEventListener) {
				// FIXME `onMouseOver` doesn't work on the v8 snapshot.
				childContainerRef.addEventListener('mouseover', this.onMouseOver, {capture: true});
				// FIXME `onMouseMove` doesn't work on the v8 snapshot.
				childContainerRef.addEventListener('mousemove', this.onMouseMove, {capture: true});
				// FIXME `onFocus` doesn't work on the v8 snapshot.
				childContainerRef.addEventListener('focusin', this.onFocus);
			}
		}
	}

	removeEventListeners = () => {
		if (this.uiRef && this.uiRef.childRef) {
			const childContainerRef = this.uiRef.childRef.containerRef;

			if (childContainerRef && childContainerRef.removeEventListener) {
				// FIXME `onMouseOver` doesn't work on the v8 snapshot.
				childContainerRef.removeEventListener('mouseover', this.onMouseOver, {capture: true});
				// FIXME `onMouseMove` doesn't work on the v8 snapshot.
				childContainerRef.removeEventListener('mousemove', this.onMouseMove, {capture: true});
				// FIXME `onFocus` doesn't work on the v8 snapshot.
				childContainerRef.removeEventListener('focusin', this.onFocus);
			}
		}
	}

	initChildRef = (ref) => {
		this.childRef = ref;
	}

	initUiRef = (ref) => {
		this.uiRef = ref;
	}

	render () {
		const {focusableScrollbar, render, ...rest} = this.props;

		return (
			<UiScrollableBaseNative
				{...rest}
				onKeyDown={this.onKeyDown}
				onMouseDown={this.onMouseDown}
				onWheel={this.onWheel}
				ref={this.initUiRef}
				removeEventListeners={this.removeEventListeners}
				scrollStopOnScroll={this.scrollStopOnScroll}
				scrollTo={this.scrollTo}
				start={this.start}
				updateEventListeners={this.updateEventListeners}
				render={({ // eslint-disable-line react/jsx-no-bind
					componentCss, className, initContainerRef, style, childComponentProps,
					initUiChildRef, isVerticalScrollbarVisible, isHorizontalScrollbarVisible,
					verticalScrollbarProps, horizontalScrollbarProps
				}) => (
					<ScrollableSpotlightContainer
						className={className}
						containerRef={initContainerRef}
						focusableScrollbar={focusableScrollbar}
						style={style}
					>
						<div className={componentCss.container}>
							{render({
								...childComponentProps,
								cbScrollTo: this.scrollTo,
								className: componentCss.content,
								initUiChildRef,
								ref: this.initChildRef
							})}
							{isVerticalScrollbarVisible ? <Scrollbar {...verticalScrollbarProps} {...this.scrollbarProps} disabled={!isVerticalScrollbarVisible} /> : null}
						</div>
						{isHorizontalScrollbarVisible ? <Scrollbar {...horizontalScrollbarProps} {...this.scrollbarProps} corner={isVerticalScrollbarVisible} disabled={!isHorizontalScrollbarVisible} /> : null}
					</ScrollableSpotlightContainer>
				)}
			/>
		);
	}
}

export default ScrollableNative;
export {
	ScrollableNative,
	dataIndexAttribute
};
