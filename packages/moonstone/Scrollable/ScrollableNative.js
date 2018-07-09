import classNames from 'classnames';
import {constants, ScrollableBaseNative as UiScrollableBaseNative} from '@enact/ui/Scrollable/ScrollableNative';
import {getDirection} from '@enact/spotlight';
import {getTargetByDirectionFromElement, getTargetByDirectionFromPosition} from '@enact/spotlight/src/target';
import {Job} from '@enact/core/util';
import platform from '@enact/core/platform';
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
		epsilon,
		isPageDown,
		isPageUp,
		overscrollTypes,
		paginationPageMultiplier,
		scrollWheelPageMultiplierForMaxPixel
	} = constants,
	overscrollRatioPrefix = '--scrollable-overscroll-ratio-',
	overscrollTimeout = 300,
	reverseDirections = {
		down: 'up',
		left: 'right',
		right: 'left',
		up: 'down'
	};

const TouchableDiv = Touchable('div');

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
 * A Moonstone-styled native component that provides horizontal and vertical scrollbars.
 *
 * @class ScrollableBaseNative
 * @memberof moonstone/ScrollableNative
 * @extends ui/Scrollable.ScrollableBaseNative
 * @ui
 * @private
 */
class ScrollableBaseNative extends Component {
	static displayName = 'ScrollableNative'

	static propTypes = /** @lends moonstone/ScrollableNative.ScrollableNative.prototype */ {
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
		 * `false` if the content of the list or the scroller could get focus
		 *
		 * @type {Boolean}
		 * @default false
		 * @private
		 */
		'data-spotlight-container-disabled': PropTypes.bool,

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
		'data-spotlight-container-disabled': false,
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
			const focusedItem = Spotlight.getCurrent();
			this.calculateAndScrollTo(focusedItem);
		}
	}

	componentWillUnmount () {
		this.stopOverscrollJob('horizontal', 'before');
		this.stopOverscrollJob('horizontal', 'after');
		this.stopOverscrollJob('vertical', 'before');
		this.stopOverscrollJob('vertical', 'after');
	}

	// status
	isWheeling = false

	// spotlight
	lastFocusedItem = null
	lastScrollPositionOnFocus = null
	indexToFocus = null
	nodeToFocus = null

	// overscroll
	overscrollRefs = {horizontal: null, vertical: null}
	overscrollJobs = {
		horizontal: {before: null, after: null},
		vertical: {before: null, after: null}
	}

	// browser native scrolling
	resetPosition = null // prevent auto-scroll on focus by Spotlight

	isVoiceControl = false
	voiceControlDirection = 'vertical'

	onMouseDown = () => {
		this.lastFocusedItem = null;
		this.childRef.setContainerDisabled(false);
	}

	onFlick = () => {
		const focusedItem = Spotlight.getCurrent();

		if (focusedItem) {
			focusedItem.blur();
		}

		this.childRef.setContainerDisabled(true);
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
	 * - for horizontal scroll, supports wheel action on any children nodes since web engine cannot support this
	 * - for vertical scroll, supports wheel action on scrollbars only
	 */
	onWheel = (ev) => {
		const
			bounds = this.uiRef.getScrollBounds(),
			canScrollHorizontally = this.uiRef.canScrollHorizontally(bounds),
			canScrollVertically = this.uiRef.canScrollVertically(bounds),
			eventDeltaMode = ev.deltaMode,
			eventDelta = (-ev.wheelDeltaY || ev.deltaY);
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

				// Not to check if ev.target is a descendant of a wrapped component which may have a lot of nodes in it.
				if ((horizontalScrollbarRef && horizontalScrollbarRef.getContainerRef().contains(ev.target)) ||
					(verticalScrollbarRef && verticalScrollbarRef.getContainerRef().contains(ev.target))) {
					delta = this.uiRef.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientHeight * scrollWheelPageMultiplierForMaxPixel);
					needToHideThumb = !delta;
				}
			} else {
				this.uiRef.updateOverscrollEffect('vertical', this.uiRef.scrollTop + delta, overscrollTypes.scrolling, 1);
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
				this.uiRef.updateOverscrollEffect('horizontal', this.uiRef.scrollLeft + delta, overscrollTypes.scrolling, 1);
				needToHideThumb = true;
			}
		}

		if (delta !== 0) {
			/* prevent native scrolling feature for vertical direction */
			ev.preventDefault();
			const direction = Math.sign(delta);
			// Not to accumulate scroll position if wheel direction is different from hold direction
			if (direction !== this.uiRef.wheelDirection) {
				this.uiRef.isScrollAnimationTargetAccumulated = false;
				this.uiRef.wheelDirection = direction;
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
				bounds = this.uiRef.getScrollBounds(),
				scrollHorizontally = bounds.maxLeft > 0 && Math.abs(left - this.uiRef.scrollLeft) > epsilon,
				scrollVertically = bounds.maxTop > 0 && Math.abs(top - this.uiRef.scrollTop) > epsilon;

			if (scrollHorizontally || scrollVertically) {
				this.uiRef.start(left, top, this.animateOnFocus);

				if (!this.childRef.shouldPreventOverscrollEffect || !this.childRef.shouldPreventOverscrollEffect()) {
					if (scrollHorizontally) {
						this.uiRef.updateOverscrollEffect('horizontal', left, overscrollTypes.scrolling, 1);
					}
					if (scrollVertically) {
						this.uiRef.updateOverscrollEffect('vertical', top, overscrollTypes.scrolling, 1);
					}
				}
			}
			this.lastFocusedItem = item;
			this.lastScrollPositionOnFocus = pos;
		}
	}

	calculateAndScrollTo = (spotItem) => {
		const positionFn = this.childRef.calculatePositionOnFocus,
			{containerRef} = this.uiRef.childRef;

		if (spotItem && positionFn && containerRef && containerRef.contains(spotItem)) {
			const lastPos = this.lastScrollPositionOnFocus;
			let pos;

			// If scroll animation is ongoing, we need to pass last target position to
			// determine correct scroll position.
			if (this.uiRef.scrolling && lastPos) {
				pos = positionFn({item: spotItem, scrollPosition: (this.props.direction !== 'horizontal') ? lastPos.top : lastPos.left});
			} else {
				// scrollInfo passes in current `scrollHeight` and `scrollTop` before calculations
				const
					scrollInfo = {
						previousScrollHeight: this.uiRef.bounds.scrollHeight,
						scrollTop: this.uiRef.scrollTop
					};
				pos = positionFn({item: spotItem, scrollInfo});
			}

			if (pos && (pos.left !== this.uiRef.scrollLeft || pos.top !== this.uiRef.scrollTop)) {
				this.startScrollOnFocus(pos, spotItem);
			}

			// update `scrollHeight`
			this.uiRef.bounds.scrollHeight = this.uiRef.getScrollBounds().scrollHeight;
		}
	}

	onFocus = (ev) => {
		const
			{isDragging} = this.uiRef,
			shouldPreventScrollByFocus = this.childRef.shouldPreventScrollByFocus ?
				this.childRef.shouldPreventScrollByFocus() :
				false;

		if (!Spotlight.getPointerMode()) {
			this.alertThumb();
		}

		if (!(shouldPreventScrollByFocus || Spotlight.getPointerMode() || isDragging)) {
			const
				item = ev.target,
				positionFn = this.childRef.calculatePositionOnFocus,
				spotItem = Spotlight.getCurrent();

			if (item && item === spotItem && positionFn) {
				this.calculateAndScrollTo(item);
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
				if (Spotlight.getPointerMode()) {
					// When changing from "pointer" mode to "5way key" mode,
					// a pointer is hidden and a last focused item get focused after 30ms.
					// To make sure the item to be focused after that, we used 50ms.
					setTimeout(() => {
						Spotlight.focus(next);
					}, 50);
				} else {
					Spotlight.focus(next);
				}
			// If a next spottable DOM element is equals to the current spottable item, we need to find a next item
			} else {
				const nextPage = scrollFn({direction, reverseDirection: rDirection, focusedItem: spotItem, spotlightId});

				// If finding a next spottable item in a Scroller, focus it
				if (typeof nextPage === 'object') {
					this.animateOnFocus = false;
					Spotlight.focus(nextPage);
				// Scroll one page with animation if nextPage is equals to `false`
				} else if (nextPage === false) {
					scrollToAccumulatedTarget(pageDistance, canScrollVertically);
				} else if (nextPage === null) {
					const
						isRtl = this.uiRef.state.rtl,
						orientation = (direction === 'up' || direction === 'down') ? 'vertical' : 'horizontal',
						position = (direction === 'up' || !isRtl && direction === 'left' || isRtl && direction === 'right') ? 'before' : 'after';
					this.uiRef.updateOverscrollEffectByDirection(orientation, position, overscrollTypes.scrolling, 1);
				}
			}
		} else {
			scrollToAccumulatedTarget(pageDistance, canScrollVertically);
		}
	}

	hasFocus () {
		let current = Spotlight.getCurrent();

		if (!current) {
			const spotlightId = Spotlight.getActiveContainer();
			current = document.querySelector(`[data-spotlight-id="${spotlightId}"]`);
		}

		return current && this.uiRef.containerRef.contains(current);
	}

	onKeyDown = (ev) => {
		this.animateOnFocus = true;
		if (isPageUp(ev.keyCode) || isPageDown(ev.keyCode)) {
			ev.preventDefault();
			if (!ev.repeat && this.hasFocus()) {
				this.scrollByPage(ev.keyCode);
			}
		} else if (!Spotlight.getPointerMode() && !ev.repeat && this.hasFocus()) {
			const direction = getDirection(ev.keyCode);
			if (direction !== false) {
				const
					element = Spotlight.getCurrent(),
					nextSpottable = element ? getTargetByDirectionFromElement(direction, element) : null;

				if (!nextSpottable) { /* if the spotlight focus will not move */
					const
						isRtl = this.uiRef.state.rtl,
						orientation = (direction === 'up' || direction === 'down') ? 'vertical' : 'horizontal',
						position = (direction === 'up' || !isRtl && direction === 'left' || isRtl && direction === 'right') ? 'before' : 'after';
					this.uiRef.updateOverscrollEffectByDirection(orientation, position, overscrollTypes.scrolling, 1);
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

	scrollStopOnScroll = () => {
		this.childRef.setContainerDisabled(false);
		this.focusOnItem();
		this.lastFocusedItem = null;
		this.lastScrollPositionOnFocus = null;
		this.isWheeling = false;
		if (this.isVoiceControl) {
			this.isVoiceControl = false;
			this.updateFocusAfterVoiceControl();
		}
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

	// Callback for scroller updates; calculate and, if needed, scroll to new position based on focused item.
	handleScrollerUpdate = () => {
		if (this.uiRef.scrollToInfo === null && this.childRef.nodeIndexToBeFocused == null && Spotlight.getPointerMode()) {
			const spotItem = Spotlight.getCurrent();
			this.calculateAndScrollTo(spotItem);
		}
	}

	clearOverscrollEffect = (orientation, position) => {
		const {type} = this.uiRef.getOverscrollStatus(orientation);

		if (type !== overscrollTypes.none) {
			this.overscrollJobs[orientation][position].startAfter(
				(type === overscrollTypes.scrolling) ? overscrollTimeout : 0,
				orientation,
				position,
				overscrollTypes.none,
				0
			);
		}
	}

	clearAllOverscrollEffects = () => {
		this.clearOverscrollEffect('horizontal', 'before');
		this.clearOverscrollEffect('horizontal', 'after');
		this.clearOverscrollEffect('vertical', 'before');
		this.clearOverscrollEffect('vertical', 'after');
	}

	applyOverscrollEffect = (orientation, position, type, ratio) => {
		const nodeRef = this.overscrollRefs[orientation];

		if (nodeRef) {
			nodeRef.style.setProperty(overscrollRatioPrefix + orientation + position, ratio);

			if (type === overscrollTypes.scrolling) {
				this.overscrollJobs[orientation][position].start(orientation, position, overscrollTypes.none, 0);
			}
		}
	}

	newOverscrollJob = (orientation, position) => {
		if (!this.overscrollJobs[orientation][position]) {
			this.overscrollJobs[orientation][position] = new Job(this.applyOverscrollEffect.bind(this), overscrollTimeout);
		}
	}

	stopOverscrollJob = (orientation, position) => {
		const job = this.overscrollJobs[orientation][position];

		if (job) {
			job.stop();
			this.overscrollJobs[orientation][position] = null;
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	addEventListeners = (childContainerRef) => {
		if (childContainerRef && childContainerRef.addEventListener) {
			childContainerRef.addEventListener('mouseover', this.onMouseOver, {capture: true});
			childContainerRef.addEventListener('mousemove', this.onMouseMove, {capture: true});
			childContainerRef.addEventListener('focusin', this.onFocus);
			if (platform.webos) {
				childContainerRef.addEventListener('webOSVoice', this.onVoice);
				childContainerRef.setAttribute('data-webos-voice-intent', 'Scroll');
			}
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	removeEventListeners = (childContainerRef) => {
		if (childContainerRef && childContainerRef.removeEventListener) {
			childContainerRef.removeEventListener('mouseover', this.onMouseOver, {capture: true});
			childContainerRef.removeEventListener('mousemove', this.onMouseMove, {capture: true});
			childContainerRef.removeEventListener('focusin', this.onFocus);
			if (platform.webos) {
				childContainerRef.removeEventListener('webOSVoice', this.onVoice);
				childContainerRef.removeAttribute('data-webos-voice-intent');
			}
		}
	}

	initHorizontalOverscrollRef = (ref) => {
		if (ref) {
			this.overscrollRefs.horizontal = ReactDOM.findDOMNode(ref); // eslint-disable-line react/no-find-dom-node
			this.newOverscrollJob('horizontal', 'before');
			this.newOverscrollJob('horizontal', 'after');
		}
	}

	initVerticalOverscrollRef = (ref) => {
		if (ref) {
			this.overscrollRefs.vertical = ref;
			this.newOverscrollJob('vertical', 'before');
			this.newOverscrollJob('vertical', 'after');
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

	updateFocusAfterVoiceControl = () => {
		const spotItem = Spotlight.getCurrent();
		if (spotItem && this.uiRef.containerRef.contains(spotItem)) {
			const
				viewportBounds = this.uiRef.containerRef.getBoundingClientRect(),
				spotItemBounds = spotItem.getBoundingClientRect(),
				nodes = Spotlight.getSpottableDescendants(this.uiRef.containerRef.dataset.spotlightId),
				first = this.voiceControlDirection === 'vertical' ? 'top' : 'left',
				last = this.voiceControlDirection === 'vertical' ? 'bottom' : 'right';

			if (spotItemBounds[last] < viewportBounds[first] || spotItemBounds[first] > viewportBounds[last]) {
				for (let i = 0; i < nodes.length; i++) {
					const nodeBounds = nodes[i].getBoundingClientRect();
					if (nodeBounds[first] > viewportBounds[first] && nodeBounds[last] < viewportBounds[last]) {
						Spotlight.focus(nodes[i]);
						break;
					}
				}
			}
		}
	}

	onVoice = (e) => {
		const scroll = e && e.detail && e.detail.scroll;
		this.isVoiceControl = true;

		switch (scroll) {
			case 'up':
				this.voiceControlDirection = 'vertical';
				this.onScrollbarButtonClick({isPreviousScrollButton: true, isVerticalScrollBar: true});
				break;
			case 'down':
				this.voiceControlDirection = 'vertical';
				this.onScrollbarButtonClick({isPreviousScrollButton: false, isVerticalScrollBar: true});
				break;
			case 'left':
				this.voiceControlDirection = 'horizontal';
				this.onScrollbarButtonClick({isPreviousScrollButton: true, isVerticalScrollBar: false});
				break;
			case 'right':
				this.voiceControlDirection = 'horizontal';
				this.onScrollbarButtonClick({isPreviousScrollButton: false, isVerticalScrollBar: false});
				break;
			case 'top':
				this.voiceControlDirection = 'vertical';
				this.uiRef.scrollTo({align: 'top'});
				break;
			case 'bottom':
				this.voiceControlDirection = 'vertical';
				this.uiRef.scrollTo({align: 'bottom'});
				break;
			case 'leftmost':
				this.voiceControlDirection = 'horizontal';
				this.uiRef.scrollTo({align: 'left'});
				break;
			case 'rightmost':
				this.voiceControlDirection = 'horizontal';
				this.uiRef.scrollTo({align: 'right'});
				break;
			default:
				this.isVoiceControl = false;
		}
		e.preventDefault();
	}

	render () {
		const
			{
				childRenderer,
				'data-spotlight-container': spotlightContainer,
				'data-spotlight-container-disabled': spotlightContainerDisabled,
				'data-spotlight-id': spotlightId,
				focusableScrollbar,
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
			<UiScrollableBaseNative
				{...rest}
				addEventListeners={this.addEventListeners}
				applyOverscrollEffect={this.applyOverscrollEffect}
				clearAllOverscrollEffects={this.clearAllOverscrollEffects}
				onFlick={this.onFlick}
				onKeyDown={this.onKeyDown}
				onMouseDown={this.onMouseDown}
				onWheel={this.onWheel}
				ref={this.initUiRef}
				removeEventListeners={this.removeEventListeners}
				scrollStopOnScroll={this.scrollStopOnScroll}
				scrollTo={this.scrollTo}
				start={this.start}
				containerRenderer={({ // eslint-disable-line react/jsx-no-bind
					childComponentProps,
					className,
					componentCss,
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
						data-spotlight-container-disabled={spotlightContainerDisabled}
						data-spotlight-id={spotlightId}
						ref={initUiContainerRef}
						style={style}
					>
						<div className={classNames(componentCss.container, overscrollCss.overscrollFrame, overscrollCss.vertical, isHorizontalScrollbarVisible ? overscrollCss.horizontalScrollbarVisible : null)} ref={this.initVerticalOverscrollRef}>
							<TouchableDiv className={classNames(touchableClassName, overscrollCss.overscrollFrame, overscrollCss.horizontal)} ref={this.initHorizontalOverscrollRef} {...restTouchableProps}>
								{childRenderer({
									...childComponentProps,
									cbScrollTo: scrollTo,
									className: componentCss.scrollableFill,
									isVerticalScrollbarVisible,
									initUiChildRef,
									onUpdate: this.handleScrollerUpdate,
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
									focusableScrollButtons={focusableScrollbar}
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
								focusableScrollButtons={focusableScrollbar}
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
 * @class ScrollableNative
 * @memberof moonstone/ScrollableNative
 * @mixes spotlight/SpotlightContainerDecorator
 * @extends moonstone/Scrollable.ScrollableBaseNative
 * @ui
 * @private
 */
const ScrollableNative = Skinnable(SpotlightContainerDecorator(
	{
		overflow: true,
		preserveId: true,
		restrict: 'self-first'
	},
	ScrollableBaseNative
));

export default ScrollableNative;
export {
	ScrollableBaseNative,
	ScrollableNative
};
