import classNames from 'classnames';
import {getTargetByDirectionFromPosition} from '@enact/spotlight/src/target';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import PropTypes from 'prop-types';
import React from 'react';
import {Scrollable as UiScrollable} from '@enact/ui/Scrollable';

import Scrollbar from './Scrollbar';

import css from '@enact/ui/Scrollable/Scrollable.less';
import scrollbarCss from './Scrollbar.less';

const
	paginationPageMultiplier = 0.8,
	reverseDirections = {
		'left': 'right',
		'up': 'down',
		'right': 'left',
		'down': 'up'
	};

/**
 * {@link moonstone/Scroller.dataIndexAttribute} is the name of a custom attribute
 * which indicates the index of an item in {@link moonstone/VirtualList.VirtualList}
 * or {@link moonstone/VirtualList.VirtualGridList}.
 *
 * @constant dataIndexAttribute
 * @memberof moonstone/Scroller
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

class Scrollable extends UiScrollable {
	static displayName = 'Scrollable'

	static propTypes = /** @lends moonstone/Scroller.Scrollable.prototype */ {
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

	componentWillUnmount () {
		const childContainerRef = this.childRef.containerRef;

		super.componentWillUnmount();
		if (childContainerRef && childContainerRef.removeEventListener) {
			// FIXME `onFocus` doesn't work on the v8 snapshot.
			childContainerRef.removeEventListener('focusin', this.onFocus);
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

	onMouseUp = (e) => {
		if (this.isDragging && this.isFlicking()) {
			const focusedItem = Spotlight.getCurrent();

			if (focusedItem) {
				focusedItem.blur();
			}
		}
		// FIX ME: we should check the super call is working
		super.onMouseUp(e);
	}

	onWheel = (e) => {
		e.preventDefault();
		if (!this.isDragging) {
			const
				bounds = this.getScrollBounds(),
				canScrollHorizontally = this.canScrollHorizontally(bounds),
				canScrollVertically = this.canScrollVertically(bounds),
				focusedItem = Spotlight.getCurrent(),
				eventDeltaMode = e.deltaMode,
				eventDelta = (-e.wheelDeltaY || e.deltaY),
				isVerticalScrollButtonFocused = this.verticalScrollbarRef && this.verticalScrollbarRef.isThumbFocused(),
				isHorizontalScrollButtonFocused = this.horizontalScrollbarRef && this.horizontalScrollbarRef.isThumbFocused();
			let
				delta = 0,
				direction;

			if (canScrollVertically) {
				delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientHeight * this.scrollWheelPageMultiplierForMaxPixel);
			} else if (canScrollHorizontally) {
				delta = this.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientWidth * this.scrollWheelPageMultiplierForMaxPixel);
			}

			direction = Math.sign(delta);

			if (focusedItem && !isVerticalScrollButtonFocused && !isHorizontalScrollButtonFocused) {
				focusedItem.blur();
			}

			if (direction !== this.wheelDirection) {
				this.isScrollAnimationTargetAccumulated = false;
				this.wheelDirection = direction;
			}

			if (delta !== 0) {
				this.isWheeling = true;
				this.childRef.setContainerDisabled(true);
				this.scrollToAccumulatedTarget(delta, canScrollVertically);
			}
		}
	}

	startScrollOnFocus = (pos, item) => {
		if (pos) {
			const
				{top, left} = pos,
				bounds = this.getScrollBounds();

			if ((bounds.maxTop > 0 && top !== this.scrollTop) || (bounds.maxLeft > 0 && left !== this.scrollLeft)) {
				this.start({
					targetX: left,
					targetY: top,
					animate: (this.animationDuration > 0) && this.animateOnFocus,
					duration: this.animationDuration
				});
			}
			this.lastFocusedItem = item;
			this.lastScrollPositionOnFocus = pos;
		}
	}

	onFocus = (e) => {
		const shouldPreventScrollByFocus = this.childRef.shouldPreventScrollByFocus ?
			this.childRef.shouldPreventScrollByFocus() :
			false;

		if (this.isWheeling) {
			this.stop();
			this.animateOnFocus = false;
		}

		if (!Spotlight.getPointerMode()) {
			this.alertThumb();
		}

		if (!(shouldPreventScrollByFocus || Spotlight.getPointerMode() || this.isDragging)) {
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
				if (this.animator.isAnimating() && lastPos) {
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

	scrollByPage = (keyCode) => {
		// Only scroll by page when the vertical scrollbar is visible. Otherwise, treat the
		// scroller as a plain container
		if (!this.state.isVerticalScrollbarVisible) return;

		const
			{getEndPoint, scrollToAccumulatedTarget} = this,
			bounds = this.getScrollBounds(),
			canScrollVertically = this.canScrollVertically(bounds),
			childRef = this.childRef,
			pageDistance = this.isPageUp(keyCode) ? (this.pageDistance * -1) : this.pageDistance,
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
		if ((this.isPageUp(e.keyCode) || this.isPageDown(e.keyCode)) && !e.repeat && this.hasFocus()) {
			this.scrollByPage(e.keyCode);
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

	stop () {
		super.stop();

		this.childRef.setContainerDisabled(false);
		this.focusOnItem();
		this.lastFocusedItem = null;
		this.lastScrollPositionOnFocus = null;
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
			this.start({
				targetX: (left !== null) ? left : this.scrollLeft,
				targetY: (top !== null) ? top : this.scrollTop,
				animate: opt.animate
			});
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
				this.start({
					targetX: pos.left,
					targetY: pos.top,
					animate: false
				});
			}
		}

		// update `scrollHeight`
		this.bounds.scrollHeight = this.getScrollBounds().scrollHeight;
	}

	render () {
		const
			{className, focusableScrollbar, style, wrapped: Wrapped, ...rest} = this.props,
			{isHorizontalScrollbarVisible, isVerticalScrollbarVisible} = this.state,
			scrollableClasses = classNames(css.scrollable, className);

		delete rest.cbScrollTo;
		delete rest.horizontalScrollbar;
		delete rest.onScroll;
		delete rest.onScrollbarVisibilityChange;
		delete rest.onScrollStart;
		delete rest.onScrollStop;
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
						onScroll={this.handleScroll}
						ref={this.initChildRef}
					/>
					{isVerticalScrollbarVisible ? <Scrollbar {...this.verticalScrollbarProps} disabled={!isVerticalScrollbarVisible} /> : null}
				</div>
				{isHorizontalScrollbarVisible ? <Scrollbar {...this.horizontalScrollbarProps} corner={isVerticalScrollbarVisible} disabled={!isHorizontalScrollbarVisible} /> : null}
			</ScrollableSpotlightContainer>
		);
	}
}

export default Scrollable;
export {dataIndexAttribute, Scrollable};
