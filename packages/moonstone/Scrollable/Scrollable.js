/**
 * Provides Moonstone-themed scrollable components and behaviors.
 *
 * @module moonstone/Scrollable
 * @exports dataIndexAttribute
 * @exports Scrollable
 * @private
 */

import {constants, ScrollableBase as UiScrollableBase} from '@enact/ui/Scrollable';
import {getTargetByDirectionFromPosition} from '@enact/spotlight/src/target';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

import Scrollbar from './Scrollbar';
import scrollbarCss from './Scrollbar.less';

const
	{
		animationDuration,
		isPageDown,
		isPageUp,
		paginationPageMultiplier
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
 * A Moonstone-styled component that provides horizontal and vertical scrollbars.
 *
 * @class Scrollable
 * @memberof moonstone/Scrollable
 * @extends ui/Scrollable.ScrollableBase
 * @ui
 * @private
 */
class Scrollable extends Component {
	static displayName = 'Scrollable'

	static propTypes = /** @lends moonstone/Scrollable.Scrollable.prototype */ {
		/**
		 * Render function.
		 *
		 * @type {Function}
		 * @private
		 */
		childRenderer: PropTypes.func.isRequired,

		/**
		 * When `true`, allows 5-way navigation to the scrollbar controls. By default, 5-way will
		 * not move focus to the scrollbar controls.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		focusableScrollbar: PropTypes.bool
	}

	static defaultProps = {
		focusableScrollbar: false
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
	lastFocusedItem = null
	lastScrollPositionOnFocus = null
	indexToFocus = null
	nodeToFocus = null

	onMouseUp = () => {
		if (this.uiRef.isDragging && this.uiRef.isFlicking()) {
			const focusedItem = Spotlight.getCurrent();

			if (focusedItem) {
				focusedItem.blur();
			}
			this.childRef.setContainerDisabled(true);
		}
	}

	onWheel = ({delta, horizontalScrollbarRef, verticalScrollbarRef}) => {
		const
			focusedItem = Spotlight.getCurrent(),
			isHorizontalScrollButtonFocused = horizontalScrollbarRef && horizontalScrollbarRef.isOneOfScrollButtonsFocused(),
			isVerticalScrollButtonFocused = verticalScrollbarRef && verticalScrollbarRef.isOneOfScrollButtonsFocused();

		if (focusedItem && !isHorizontalScrollButtonFocused && !isVerticalScrollButtonFocused) {
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
				bounds = this.uiRef.getScrollBounds();

			if ((bounds.maxTop > 0 && top !== this.uiRef.scrollTop) || (bounds.maxLeft > 0 && left !== this.uiRef.scrollLeft)) {
				this.uiRef.start({
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

	onFocus = (ev) => {
		const
			{isDragging, animator, direction} = this.uiRef,
			shouldPreventScrollByFocus = this.childRef.shouldPreventScrollByFocus ?
				this.childRef.shouldPreventScrollByFocus() :
				false;

		if (this.isWheeling) {
			this.uiRef.stop();
			this.animateOnFocus = false;
		}

		if (!Spotlight.getPointerMode()) {
			this.alertThumb();
		}

		if (!(shouldPreventScrollByFocus || Spotlight.getPointerMode() || isDragging)) {
			const
				item = ev.target,
				positionFn = this.childRef.calculatePositionOnFocus,
				spotItem = Spotlight.getCurrent();

			if (item && item === spotItem && positionFn) {
				const lastPos = this.lastScrollPositionOnFocus;
				let pos;

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
			this.childRef.setLastFocusedIndex(ev.target);
		}
	}

	getPageDirection = (keyCode) => {
		const
			isRtl = this.uiRef.state.rtl,
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
			{childRef, containerRef, scrollToAccumulatedTarget} = this.uiRef,
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

		return current && this.uiRef.containerRef.contains(current);
	}

	onKeyDown = (ev) => {
		this.animateOnFocus = true;
		if ((isPageUp(ev.keyCode) || isPageDown(ev.keyCode)) && !ev.repeat && this.hasFocus()) {
			this.scrollByPage(ev.keyCode);
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

	stop = () => {
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
		this.indexToFocus = (opt.focus && typeof opt.index === 'number') ? opt.index : null;
		this.nodeToFocus = (opt.focus && opt.node instanceof Object && opt.node.nodeType === 1) ? opt.node : null;
	}

	alertThumb = () => {
		const bounds = this.uiRef.getScrollBounds();

		this.uiRef.showThumb(bounds);
		this.uiRef.startHidingThumb();
	}

	alertThumbAfterRendered = () => {
		const spotItem = Spotlight.getCurrent();

		if (!Spotlight.getPointerMode() && spotItem && this.uiRef && this.uiRef.childRef.containerRef.contains(spotItem) && this.uiRef.isUpdatedScrollThumb) {
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
				this.uiRef.start({
					targetX: pos.left,
					targetY: pos.top,
					animate: false
				});
			}
		}

		// update `scrollHeight`
		this.uiRef.bounds.scrollHeight = this.uiRef.getScrollBounds().scrollHeight;
	}

	addEventListeners = (childContainerRef) => {
		if (childContainerRef && childContainerRef.addEventListener) {
			// FIXME `onFocus` doesn't work on the v8 snapshot.
			childContainerRef.addEventListener('focusin', this.onFocus);
		}
	}

	removeEventListeners = (childContainerRef) => {
		if (childContainerRef && childContainerRef.removeEventListener) {
			// FIXME `onFocus` doesn't work on the v8 snapshot.
			childContainerRef.removeEventListener('focusin', this.onFocus);
		}
	}

	initChildRef = (ref) => {
		if (ref) {
			this.childRef = ref;
		}
	}

	initUiRef = (ref) => {
		if (ref) {
			this.uiRef = ref;
		}
	}

	render () {
		const {focusableScrollbar, childRenderer, ...rest} = this.props;

		return (
			<UiScrollableBase
				{...rest}
				addEventListeners={this.addEventListeners}
				onKeyDown={this.onKeyDown}
				onMouseUp={this.onMouseUp}
				onWheel={this.onWheel}
				ref={this.initUiRef}
				removeEventListeners={this.removeEventListeners}
				scrollTo={this.scrollTo}
				stop={this.stop}
				containerRenderer={({ // eslint-disable-line react/jsx-no-bind
					childComponentProps,
					className,
					componentCss,
					handleScroll,
					horizontalScrollbarProps,
					initContainerRef,
					initUiChildRef,
					isHorizontalScrollbarVisible,
					isVerticalScrollbarVisible,
					scrollTo,
					style,
					verticalScrollbarProps
				}) => (
					<ScrollableSpotlightContainer
						className={className}
						containerRef={initContainerRef}
						focusableScrollbar={focusableScrollbar}
						style={style}
					>
						<div className={componentCss.container}>
							{childRenderer({
								...childComponentProps,
								cbScrollTo: scrollTo,
								className: componentCss.content,
								initUiChildRef,
								onScroll: handleScroll,
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

export default Scrollable;
export {
	dataIndexAttribute,
	Scrollable
};
