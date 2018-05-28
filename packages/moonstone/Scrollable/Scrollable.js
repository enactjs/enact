/**
 * Provides Moonstone-themed scrollable components and behaviors.
 *
 * @module moonstone/Scrollable
 * @exports dataIndexAttribute
 * @exports Scrollable
 * @private
 */

import classNames from 'classnames';
import {constants, ScrollableBase as UiScrollableBase} from '@enact/ui/Scrollable';
import {getTargetByDirectionFromPosition} from '@enact/spotlight/src/target';
import {is} from '@enact/core/keymap';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import Touchable from '@enact/ui/Touchable';

import $L from '../internal/$L';

import Scrollbar from './Scrollbar';
import Skinnable from '../Skinnable';

import overscrollCss from './OverscrollEffect.less';
import scrollbarCss from './Scrollbar.less';

const
	{
		animationDuration,
		isPageDown,
		isPageUp,
		overscrollNeeds,
		paginationPageMultiplier
	} = constants,
	isDown = is('down'),
	isLeft = is('left'),
	isRight = is('right'),
	isUp = is('up'),
	overscrollTimeout = 300,
	reverseDirections = {
		down: 'up',
		left: 'right',
		right: 'left',
		up: 'down'
	};

const TouchableDiv = Touchable('div');

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

const navigableFilter = (elem) => {
	if (
		!Spotlight.getPointerMode() &&
		// ignore containers passed as their id
		typeof elem !== 'string' &&
		elem.classList.contains(scrollbarCss.scrollButton)
	) {
		return false;
	}
};

const configureSpotlightContainer = ({'data-spotlight-id': spotlightId, focusableScrollbar}) => {
	Spotlight.set(spotlightId, {
		navigableFilter: focusableScrollbar ? null : navigableFilter
	});
};

/**
 * A Moonstone-styled component that provides horizontal and vertical scrollbars.
 *
 * @class ScrollableBase
 * @memberof moonstone/Scrollable
 * @extends ui/Scrollable.ScrollableBase
 * @ui
 * @public
 */
class ScrollableBase extends Component {
	static displayName = 'Scrollable'

	static propTypes = /** @lends moonstone/Scrollable.Scrollable.prototype */ {
		/**
		 * Render function.
		 *
		 * @type {Function}
		 * @required
		 * @private
		 */
		childRenderer: PropTypes.func.isRequired,

		/**
		 * This is set to `true` by SpotlightContainerDecorator
		 *
		 * @type {Boolean}
		 * @private
		 */
		'data-spotlight-container': PropTypes.bool,

		/**
		 * This is passed onto the wrapped component to allow
		 * it to customize the spotlight container for its use case.
		 *
		 * @type {String}
		 * @private
		 */
		'data-spotlight-id': PropTypes.string,

		/**
		 * Direction of the list or the scroller.
		 * `'both'` could be only used for[Scroller]{@link moonstone/Scroller.Scroller}.
		 *
		 * Valid values are:
		 * * `'both'`,
		 * * `'horizontal'`, and
		 * * `'vertical'`.
		 *
		 * @type {String}
		 * @private
		 */
		direction: PropTypes.oneOf(['both', 'horizontal', 'vertical']),

		/**
		 * When `true`, allows 5-way navigation to the scrollbar controls. By default, 5-way will
		 * not move focus to the scrollbar controls.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		focusableScrollbar: PropTypes.bool,

		/**
		 * Sets the hint string read when focusing the next button in the vertical scroll bar.
		 *
		 * @type {String}
		 * @default $L('scroll down')
		 * @public
		 */
		scrollDownAriaLabel: PropTypes.string,

		/**
		 * Sets the hint string read when focusing the previous button in the horizontal scroll bar.
		 *
		 * @type {String}
		 * @default $L('scroll left')
		 * @public
		 */
		scrollLeftAriaLabel: PropTypes.string,

		/**
		 * Sets the hint string read when focusing the next button in the horizontal scroll bar.
		 *
		 * @type {String}
		 * @default $L('scroll right')
		 * @public
		 */
		scrollRightAriaLabel: PropTypes.string,

		/**
		 * Sets the hint string read when focusing the previous button in the vertical scroll bar.
		 *
		 * @type {String}
		 * @default $L('scroll up')
		 * @public
		 */
		scrollUpAriaLabel: PropTypes.string
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

		configureSpotlightContainer(props);
	}

	componentWillReceiveProps (nextProps) {
		configureSpotlightContainer(nextProps);
	}

	componentDidUpdate () {
		if (this.uiRef.scrollToInfo === null && this.childRef.nodeIndexToBeFocused == null) {
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

	// overscroll
	overscrollRefs = {['horizontal']: null, ['vertical']: null}

	onFlick = () => {
		const focusedItem = Spotlight.getCurrent();

		if (focusedItem) {
			focusedItem.blur();
		}

		this.childRef.setContainerDisabled(true);
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

				if (this.childRef.shouldPreventOverscrollEffect ? !this.childRef.shouldPreventOverscrollEffect() : true) {
					this.uiRef.setOverscrollStatus(overscrollNeeds.tracking);
				}
			}
			this.lastFocusedItem = item;
			this.lastScrollPositionOnFocus = pos;
		}
	}

	onFocus = (ev) => {
		const
			{direction} = this.props,
			{animator, isDragging} = this.uiRef,
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
			{direction} = this.props,
			isRtl = this.uiRef.state.rtl,
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
			pageDistance = (isPageUp(keyCode) ? -1 : 1) * (canScrollVertically ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier,
			spotItem = Spotlight.getCurrent();

		if (spotItem) {
			// Should skip scroll by page when spotItem is paging control button of Scrollbar
			if (!childRef.containerRef.contains(spotItem)) {
				return;
			}

			const
				// VirtualList and Scroller have a spotlightId on containerRef
				spotlightId = containerRef.dataset.spotlightId,
				direction = this.getPageDirection(keyCode),
				rDirection = reverseDirections[direction],
				viewportBounds = containerRef.getBoundingClientRect(),
				spotItemBounds = spotItem.getBoundingClientRect(),
				endPoint = this.getEndPoint(direction, spotItemBounds, viewportBounds),
				next = getTargetByDirectionFromPosition(rDirection, endPoint, spotlightId),
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
				const nextPage = scrollFn({direction, reverseDirection: rDirection, focusedItem: spotItem, spotlightId});

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
			const spotlightId = Spotlight.getActiveContainer();
			current = document.querySelector(`[data-spotlight-id="${spotlightId}"]`);
		}

		return current && this.uiRef.containerRef.contains(current);
	}

	onKeyDown = (ev) => {
		this.animateOnFocus = true;

		if (!Spotlight.getPointerMode() && !ev.repeat && this.hasFocus()) {
			if (isPageUp(ev.keyCode) || isPageDown(ev.keyCode)) {
				this.uiRef.setOverscrollStatus(overscrollNeeds.tracking);
				this.scrollByPage(ev.keyCode);
			} else {
				const
					{scrollLeft, scrollTop, updateOverscrollEffect} = this.uiRef,
					isRtl = this.uiRef.state.rtl,
					{maxLeft, maxTop} = this.uiRef.getScrollBounds(),
					downKey = isDown(ev.keyCode),
					leftKey = isLeft(ev.keyCode),
					rightKey = isRight(ev.keyCode),
					upKey = isUp(ev.keyCode);

				if ((downKey || upKey) && 0 < maxTop) {
					if (upKey && scrollTop === 0) {
						updateOverscrollEffect('vertical', 'before');
					} else if (downKey && scrollTop === maxTop) {
						updateOverscrollEffect('vertical', 'after');
					}
				} else if ((leftKey || rightKey) && 0 < maxLeft) {
					const forward = leftKey === isRtl;
					if (!forward && scrollLeft === 0) {
						updateOverscrollEffect('horizontal', 'before');
					} else if (forward && scrollLeft === maxLeft) {
						updateOverscrollEffect('horizontal', 'after');
					}
				}
			}
		}
	}

	onScrollbarButtonClick = ({isPreviousScrollButton, isVerticalScrollBar}) => {
		const
			bounds = this.uiRef.getScrollBounds(),
			direction = isPreviousScrollButton ? -1 : 1,
			pageDistance = direction * (isVerticalScrollBar ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier;

		if (direction !== this.uiRef.wheelDirection) {
			this.uiRef.isScrollAnimationTargetAccumulated = false;
			this.uiRef.wheelDirection = direction;
		}

		this.uiRef.scrollToAccumulatedTarget(pageDistance, isVerticalScrollBar);
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

	getScrollabilities = () => {
		if (this.uiRef) {
			const bounds = this.uiRef.getScrollBounds();
			return {
				horizontal: this.uiRef.canScrollHorizontally(bounds),
				vertical: this.uiRef.canScrollVertically(bounds)
			};
		} else {
			return {horizontal: false, vertical: false};
		}
	}

	clearOverscrollEffect = (orientation) => {
		const
			getOverscrollStatus = this.uiRef.getOverscrollStatus,
			status = getOverscrollStatus(orientation);

		if (status > overscrollNeeds.tracking) { // clearing or delayedClearing
			const timeout = (status === overscrollNeeds.delayedClearing) ? overscrollTimeout : 0;
			setTimeout(this.playOverscrollEffect, timeout, this.overscrollRefs[orientation], orientation, 'before', 0, false);
			setTimeout(this.playOverscrollEffect, timeout, this.overscrollRefs[orientation], orientation, 'after', 0, false);
		}
	}

	clearAllOverscrollEffects = () => {
		this.clearOverscrollEffect('horizontal');
		this.clearOverscrollEffect('vertical');
	}

	playOverscrollEffect = (nodeRef, orientation, position, ratio, auto) => {
		const prefix = '--moon-scrollable-overscroll-ratio-';

		nodeRef.style.setProperty(prefix + orientation + position, ratio);
		if (auto && ratio > 0) {
			setTimeout(this.playOverscrollEffect, overscrollTimeout, nodeRef, orientation, position, 0, false);
		}
	}

	updateOverscrollEffect = (orientation, position, ratio = 1, auto = true) => {
		const
			playOverscrollEffect = this.playOverscrollEffect,
			nodeRef = this.overscrollRefs[orientation],
			scrollability = this.getScrollabilities()[orientation];

		if (nodeRef && scrollability) {
			playOverscrollEffect(nodeRef, orientation, position, ratio, auto);
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	addEventListeners = (childContainerRef) => {
		if (childContainerRef && childContainerRef.addEventListener) {
			childContainerRef.addEventListener('focusin', this.onFocus);
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	removeEventListeners = (childContainerRef) => {
		if (childContainerRef && childContainerRef.removeEventListener) {
			childContainerRef.removeEventListener('focusin', this.onFocus);
		}
	}

	initHorizontalOverscrollRef = (ref) => {
		if (ref) {
			this.overscrollRefs['horizontal'] = ReactDOM.findDOMNode(ref); // eslint-disable-line react/no-find-dom-node
		}
	}

	initVerticalOverscrollRef = (ref) => {
		if (ref) {
			this.overscrollRefs['vertical'] = ref;
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
		const
			{
				childRenderer,
				'data-spotlight-container': spotlightContainer,
				'data-spotlight-id': spotlightId,
				scrollRightAriaLabel,
				scrollLeftAriaLabel,
				scrollDownAriaLabel,
				scrollUpAriaLabel,
				...rest
			} = this.props,
			downButtonAriaLabel = scrollDownAriaLabel == null ? $L('scroll down') : scrollDownAriaLabel,
			upButtonAriaLabel = scrollUpAriaLabel == null ? $L('scroll up') : scrollUpAriaLabel,
			rightButtonAriaLabel = scrollRightAriaLabel == null ? $L('scroll right') : scrollRightAriaLabel,
			leftButtonAriaLabel = scrollLeftAriaLabel == null ? $L('scroll left') : scrollLeftAriaLabel;

		delete rest.focusableScrollbar;

		return (
			<UiScrollableBase
				{...rest}
				addEventListeners={this.addEventListeners}
				clearAllOverscrollEffects={this.clearAllOverscrollEffects}
				onFlick={this.onFlick}
				onKeyDown={this.onKeyDown}
				onWheel={this.onWheel}
				ref={this.initUiRef}
				removeEventListeners={this.removeEventListeners}
				scrollTo={this.scrollTo}
				stop={this.stop}
				updateOverscrollEffect={this.updateOverscrollEffect}
				containerRenderer={({ // eslint-disable-line react/jsx-no-bind
					childComponentProps,
					className,
					componentCss,
					handleScroll,
					horizontalScrollbarProps,
					initChildRef: initUiChildRef,
					initContainerRef: initUiContainerRef,
					isHorizontalScrollbarVisible,
					isVerticalScrollbarVisible,
					rtl,
					scrollTo,
					style,
					touchableProps: {className: touchableClassName, ...restTouchableProps},
					verticalScrollbarProps
				}) => (
					<div
						className={classNames(className, overscrollCss.scrollable)}
						data-spotlight-container={spotlightContainer}
						data-spotlight-id={spotlightId}
						ref={initUiContainerRef}
						style={style}
					>
						<div className={classNames(componentCss.container, overscrollCss.verticalEffects, isHorizontalScrollbarVisible ? overscrollCss.horizontalScrollbarVisible : null)} ref={this.initVerticalOverscrollRef}>
							<TouchableDiv className={classNames(touchableClassName, overscrollCss.horizontalEffects)} ref={this.initHorizontalOverscrollRef} {...restTouchableProps}>
								{childRenderer({
									...childComponentProps,
									cbScrollTo: scrollTo,
									className: componentCss.scrollableFill,
									initUiChildRef,
									onScroll: handleScroll,
									ref: this.initChildRef,
									rtl,
									spotlightId
								})}
							</TouchableDiv>
							{isVerticalScrollbarVisible ?
								<Scrollbar
									{...verticalScrollbarProps}
									{...this.scrollbarProps}
									disabled={!isVerticalScrollbarVisible}
									nextButtonAriaLabel={downButtonAriaLabel}
									previousButtonAriaLabel={upButtonAriaLabel}
									rtl={rtl}
								/> :
								null
							}
						</div>
						{isHorizontalScrollbarVisible ?
							<Scrollbar
								{...horizontalScrollbarProps}
								{...this.scrollbarProps}
								corner={isVerticalScrollbarVisible}
								disabled={!isHorizontalScrollbarVisible}
								nextButtonAriaLabel={rightButtonAriaLabel}
								previousButtonAriaLabel={leftButtonAriaLabel}
								rtl={rtl}
							/> :
							null
						}
					</div>
				)}
			/>
		);
	}
}

/**
 * A Moonstone-styled component that provides horizontal and vertical scrollbars.
 *
 * @class Scrollable
 * @memberof moonstone/Scrollable
 * @mixes spotlight/SpotlightContainerDecorator
 * @extends moonstone/Scrollable.ScrollableBase
 * @ui
 * @public
 */
const Scrollable = Skinnable(SpotlightContainerDecorator(
	{
		overflow: true,
		preserveId: true,
		restrict: 'self-first'
	},
	ScrollableBase
));

export default Scrollable;
export {
	dataIndexAttribute,
	Scrollable,
	ScrollableBase
};
