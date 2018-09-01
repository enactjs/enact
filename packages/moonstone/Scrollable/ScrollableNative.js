import classNames from 'classnames';
import {constants, ScrollableBaseNative as UiScrollableBaseNative} from '@enact/ui/Scrollable/ScrollableNative';
import {getDirection} from '@enact/spotlight';
import {getTargetByDirectionFromElement, getTargetByDirectionFromPosition} from '@enact/spotlight/src/target';
import {Job} from '@enact/core/util';
import platform from '@enact/core/platform';
import {forward} from '@enact/core/handle';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

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
		overscrollTypeDone,
		overscrollTypeNone,
		overscrollTypeOnce,
		paginationPageMultiplier,
		scrollWheelPageMultiplierForMaxPixel
	} = constants,
	overscrollRatioPrefix = '--scrollable-overscroll-ratio-',
	overscrollTimeout = 300,
	reverseDirections = {
		down: 'up',
		up: 'down'
	};

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
		 * Allows 5-way navigation to the scrollbar controls. By default, 5-way will
		 * not move focus to the scrollbar controls.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		focusableScrollbar: PropTypes.bool,

		/**
		 * Specifies overscroll effects shows on which type of inputs.
		 *
		 * @type {Object}
		 * @default {
		 *	arrowKey: false,
		 *	drag: false,
		 *	pageKey: false,
		 *	scrollbarButton: false,
		 *	wheel: true
		 * }
		 * @private
		 */
		overscrollEffectOn: PropTypes.shape({
			arrowKey: PropTypes.bool,
			drag: PropTypes.bool,
			pageKey: PropTypes.bool,
			scrollbarButton: PropTypes.bool,
			wheel: PropTypes.bool
		}),

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
		focusableScrollbar: false,
		overscrollEffectOn: {
			arrowKey: false,
			drag: false,
			pageKey: false,
			scrollbarButton: false,
			wheel: true
		}
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
		if (
			this.props['data-spotlight-id'] !== nextProps['data-spotlight-id'] ||
			this.props.focusableScrollbar !== nextProps.focusableScrollbar
		) {
			configureSpotlightContainer(nextProps);
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
		this.childRef.setContainerDisabled(false);
	}

	onFlick = ({direction}) => {
		const bounds = this.uiRef.getScrollBounds();
		const focusedItem = Spotlight.getCurrent();

		if (focusedItem) {
			focusedItem.blur();
		}

		if (
			direction === 'vertical' && this.uiRef.canScrollVertically(bounds) ||
			direction === 'horizontal' && this.uiRef.canScrollHorizontally(bounds)
		) {
			this.childRef.setContainerDisabled(true);
		}
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
			overscrollEffectRequired = this.props.overscrollEffectOn.wheel,
			bounds = this.uiRef.getScrollBounds(),
			canScrollHorizontally = this.uiRef.canScrollHorizontally(bounds),
			canScrollVertically = this.uiRef.canScrollVertically(bounds),
			eventDeltaMode = ev.deltaMode,
			eventDelta = (-ev.wheelDeltaY || ev.deltaY);
		let
			delta = 0,
			needToHideThumb = false;

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
				} else if (overscrollEffectRequired) {
					this.uiRef.checkAndApplyOverscrollEffect('vertical', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce);
				}
			} else {
				if (overscrollEffectRequired && (eventDelta < 0 && this.uiRef.scrollTop <= 0 || eventDelta > 0 && this.uiRef.scrollTop >= bounds.maxTop)) {
					this.uiRef.applyOverscrollEffect('vertical', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce, 1);
				}
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
				if (overscrollEffectRequired && (eventDelta < 0 && this.scrollLeft <= 0 || eventDelta > 0 && this.scrollLeft >= bounds.maxLeft)) {
					this.uiRef.applyOverscrollEffect('horizontal', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce, 1);
				}
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
			this.uiRef.scrollToAccumulatedTarget(delta, canScrollVertically, overscrollEffectRequired);
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

	startScrollOnFocus = (pos) => {
		if (pos) {
			const
				{top, left} = pos,
				bounds = this.uiRef.getScrollBounds(),
				scrollHorizontally = bounds.maxLeft > 0 && Math.abs(left - this.uiRef.scrollLeft) > epsilon,
				scrollVertically = bounds.maxTop > 0 && Math.abs(top - this.uiRef.scrollTop) > epsilon;

			if (scrollHorizontally || scrollVertically) {
				this.uiRef.start({
					targetX: left,
					targetY: top,
					animate: this.animateOnFocus,
					overscrollEffect: this.props.overscrollEffectOn[this.uiRef.lastInputType] && (!this.childRef.shouldPreventOverscrollEffect || !this.childRef.shouldPreventOverscrollEffect())
				});
				this.lastScrollPositionOnFocus = pos;
			}
		}
	}

	calculateAndScrollTo = () => {
		const
			spotItem = Spotlight.getCurrent(),
			positionFn = this.childRef.calculatePositionOnFocus,
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
				this.startScrollOnFocus(pos);
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
				this.calculateAndScrollTo();
			}
		} else if (this.childRef.setLastFocusedNode) {
			this.childRef.setLastFocusedNode(ev.target);
		}
	}

	scrollByPage = (direction) => {
		// Only scroll by page when the vertical scrollbar is visible. Otherwise, treat the
		// scroller as a plain container
		if (!this.uiRef.state.isVerticalScrollbarVisible) {
			return false;
		}

		const
			{childRef, containerRef} = this.uiRef,
			focusedItem = Spotlight.getCurrent();

		this.uiRef.lastInputType = 'pageKey';

		// Should skip scroll by page when focusedItem is paging control button of Scrollbar
		if (focusedItem && childRef.containerRef.contains(focusedItem)) {
			const
				// VirtualList and Scroller have a spotlightId on containerRef
				spotlightId = containerRef.dataset.spotlightId,
				rDirection = reverseDirections[direction],
				viewportBounds = containerRef.getBoundingClientRect(),
				focusedItemBounds = focusedItem.getBoundingClientRect(),
				endPoint = {
					x: focusedItemBounds.left + focusedItemBounds.width / 2,
					y: viewportBounds.top + ((direction === 'up') ? focusedItemBounds.height / 2 - 1 : viewportBounds.height - focusedItemBounds.height / 2 + 1)
				};
			let next = null;

			/* 1. Find spottable item in viewport */
			next = getTargetByDirectionFromPosition(rDirection, endPoint, spotlightId);

			if (next !== focusedItem) {
				Spotlight.focus(next);
			/* 2. Find spottable item out of viewport */
			// For Scroller
			} else if (this.childRef.scrollToNextPage) {
				next = this.childRef.scrollToNextPage({direction, focusedItem, reverseDirection: rDirection, spotlightId});

				if (next !== null) {
					this.animateOnFocus = false;
					Spotlight.focus(next);
				}
			// For VirtualList
			} else if (this.childRef.scrollToNextItem) {
				this.childRef.scrollToNextItem({direction, focusedItem, reverseDirection: rDirection, spotlightId});
			}

			// Need to check whether an overscroll effect is needed
			return true;
		}

		return false;
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
		const
			{overscrollEffectOn} = this.props,
			{keyCode, repeat} = ev;
		let
			overscrollEffectRequired = false,
			direction = null;

		forward('onKeyDown', ev, this.props);

		this.animateOnFocus = true;

		if (isPageUp(keyCode) || isPageDown(keyCode)) {
			ev.preventDefault();
			if (!repeat && this.hasFocus() && this.props.direction === 'vertical' || this.props.direction === 'both') {
				Spotlight.setPointerMode(false);
				direction = isPageUp(keyCode) ? 'up' : 'down';
				overscrollEffectRequired = this.scrollByPage(direction) && overscrollEffectOn.pageKey;
			}
		} else if (!Spotlight.getPointerMode() && !repeat && this.hasFocus() && getDirection(keyCode)) {
			const element = Spotlight.getCurrent();

			direction = getDirection(keyCode);

			this.uiRef.lastInputType = 'arrowKey';

			overscrollEffectRequired = overscrollEffectOn.arrowKey && !(element ? getTargetByDirectionFromElement(direction, element) : null);
			if (overscrollEffectRequired) {
				const {horizontalScrollbarRef, verticalScrollbarRef} = this.uiRef;

				if ((horizontalScrollbarRef && horizontalScrollbarRef.getContainerRef().contains(element)) ||
					(verticalScrollbarRef && verticalScrollbarRef.getContainerRef().contains(element))) {
					overscrollEffectRequired = false;
				}
			}
		}

		if (direction && overscrollEffectRequired) { /* if the spotlight focus will not move */
			const
				orientation = (direction === 'up' || direction === 'down') ? 'vertical' : 'horizontal',
				bounds = this.uiRef.getScrollBounds(),
				scrollability = orientation === 'vertical' ? this.uiRef.canScrollVertically(bounds) : this.uiRef.canScrollHorizontally(bounds);

			if (scrollability) {
				const
					isRtl = this.uiRef.state.rtl,
					edge = (direction === 'up' || !isRtl && direction === 'left' || isRtl && direction === 'right') ? 'before' : 'after';
				this.uiRef.checkAndApplyOverscrollEffect(orientation, edge, overscrollTypeOnce);
			}
		}
	}

	onScrollbarButtonClick = ({isPreviousScrollButton, isVerticalScrollBar}) => {
		const
			bounds = this.uiRef.getScrollBounds(),
			direction = isPreviousScrollButton ? -1 : 1,
			pageDistance = direction * (isVerticalScrollBar ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier;

		this.uiRef.lastInputType = 'scrollbarButton';

		if (direction !== this.uiRef.wheelDirection) {
			this.uiRef.isScrollAnimationTargetAccumulated = false;
			this.uiRef.wheelDirection = direction;
		}

		this.uiRef.scrollToAccumulatedTarget(pageDistance, isVerticalScrollBar, this.props.overscrollEffectOn.scrollbarButton);
	}

	scrollStopOnScroll = () => {
		this.childRef.setContainerDisabled(false);
		this.focusOnItem();
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
		if (this.uiRef.scrollToInfo === null) {
			const scrollHeight = this.uiRef.getScrollBounds().scrollHeight;
			if (scrollHeight !== this.uiRef.bounds.scrollHeight) {
				this.calculateAndScrollTo();
			}
		}

		// oddly, Scroller manages this.uiRef.bounds so if we don't update it here (it is also
		// updated in calculateAndScrollTo but we might not have made it to that point), it will be
		// out of date when we land back in this method next time.
		this.uiRef.bounds.scrollHeight = this.uiRef.getScrollBounds().scrollHeight;
	}

	clearOverscrollEffect = (orientation, edge) => {
		this.overscrollJobs[orientation][edge].startAfter(overscrollTimeout, orientation, edge, overscrollTypeNone, 0);
		this.uiRef.setOverscrollStatus(orientation, edge, overscrollTypeNone, 0);
	}

	applyOverscrollEffect = (orientation, edge, type, ratio) => {
		const nodeRef = this.overscrollRefs[orientation];

		if (nodeRef) {
			nodeRef.style.setProperty(overscrollRatioPrefix + orientation + edge, ratio);

			if (type === overscrollTypeOnce) {
				this.overscrollJobs[orientation][edge].start(orientation, edge, overscrollTypeDone, 0);
			}
		}
	}

	createOverscrollJob = (orientation, edge) => {
		if (!this.overscrollJobs[orientation][edge]) {
			this.overscrollJobs[orientation][edge] = new Job(this.applyOverscrollEffect.bind(this), overscrollTimeout);
		}
	}

	stopOverscrollJob = (orientation, edge) => {
		const job = this.overscrollJobs[orientation][edge];

		if (job) {
			job.stop();
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
			this.createOverscrollJob('horizontal', 'before');
			this.createOverscrollJob('horizontal', 'after');
		}
	}

	initVerticalOverscrollRef = (ref) => {
		if (ref) {
			this.overscrollRefs.vertical = ref;
			this.createOverscrollJob('vertical', 'before');
			this.createOverscrollJob('vertical', 'after');
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
		const
			scroll = e && e.detail && e.detail.scroll,
			isRtl = this.uiRef.state.rtl;
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
				this.onScrollbarButtonClick({isPreviousScrollButton: !isRtl, isVerticalScrollBar: false});
				break;
			case 'right':
				this.voiceControlDirection = 'horizontal';
				this.onScrollbarButtonClick({isPreviousScrollButton: isRtl, isVerticalScrollBar: false});
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
				this.uiRef.scrollTo({align: isRtl ? 'right' : 'left'});
				break;
			case 'rightmost':
				this.voiceControlDirection = 'horizontal';
				this.uiRef.scrollTo({align: isRtl ? 'left' : 'right'});
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
				scrollDownAriaLabel,
				scrollLeftAriaLabel,
				scrollRightAriaLabel,
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
				noScrollByDrag
				{...rest}
				addEventListeners={this.addEventListeners}
				applyOverscrollEffect={this.applyOverscrollEffect}
				clearOverscrollEffect={this.clearOverscrollEffect}
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
					childWrapper: ChildWrapper,
					childWrapperProps: {className: contentClassName, ...restChildWrapperProps},
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
							<ChildWrapper className={classNames(contentClassName, overscrollCss.overscrollFrame, overscrollCss.horizontal)} ref={this.initHorizontalOverscrollRef} {...restChildWrapperProps}>
								{childRenderer({
									...childComponentProps,
									cbScrollTo: scrollTo,
									className: componentCss.scrollableFill,
									initUiChildRef,
									isVerticalScrollbarVisible,
									onUpdate: this.handleScrollerUpdate,
									ref: this.initChildRef,
									rtl,
									spotlightId
								})}
							</ChildWrapper>
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
