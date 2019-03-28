import classNames from 'classnames';
import {constants, ScrollableBaseNative as UiScrollableBaseNative} from '@enact/ui/Scrollable/ScrollableNative';
import {getDirection} from '@enact/spotlight';
import {getTargetByDirectionFromElement, getTargetByDirectionFromPosition} from '@enact/spotlight/src/target';
import {Job} from '@enact/core/util';
import platform from '@enact/core/platform';
import {forward} from '@enact/core/handle';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator/I18nDecorator';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

import $L from '../internal/$L';

import Scrollbar from './Scrollbar';
import Skinnable from '../Skinnable';

import overscrollCss from './OverscrollEffect.module.less';
import scrollbarCss from './Scrollbar.module.less';

const
	{
		epsilon,
		isPageDown,
		isPageUp,
		overscrollTypeDone,
		overscrollTypeNone,
		overscrollTypeOnce,
		scrollWheelPageMultiplierForMaxPixel
	} = constants,
	overscrollRatioPrefix = '--scrollable-overscroll-ratio-',
	overscrollTimeout = 300,
	paginationPageMultiplier = 0.8,
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
		 * Animate while scrolling
		 *
		 * @type {Boolean}
		 * @default false
		 * @private
		 */
		animate: PropTypes.bool,

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
		animate: false,
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

		this.overscrollRefs = {
			horizontal: React.createRef(),
			vertical: React.createRef()
		};
		this.childRef = React.createRef();
		this.uiRef = React.createRef();

		configureSpotlightContainer(props);
	}

	componentDidMount () {
		this.createOverscrollJob('horizontal', 'before');
		this.createOverscrollJob('horizontal', 'after');

		this.createOverscrollJob('vertical', 'before');
		this.createOverscrollJob('vertical', 'after');

		document.addEventListener('keydown', this.onKeyDownInBody.bind(this));
	}

	componentDidUpdate (prevProps) {
		if (prevProps['data-spotlight-id'] !== this.props['data-spotlight-id'] ||
				prevProps.focusableScrollbar !== this.props.focusableScrollbar) {
			configureSpotlightContainer(this.props);
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
	isHover = false

	// spotlight
	lastScrollPositionOnFocus = null
	indexToFocus = null
	nodeToFocus = null

	// voice control
	isVoiceControl = false
	voiceControlDirection = 'vertical'

	// overscroll
	overscrollJobs = {
		horizontal: {before: null, after: null},
		vertical: {before: null, after: null}
	}

	// browser native scrolling
	resetPosition = null // prevent auto-scroll on focus by Spotlight

	onMouseDown = (ev) => {
		if (this.props['data-spotlight-container-disabled']) {
			ev.preventDefault();
		} else {
			this.childRef.current.setContainerDisabled(false);
		}
	}

	onMouseEnter = (ev) => {
		if (ev.target === ReactDOM.findDOMNode(this)) { // eslint-disable-line react/no-find-dom-node
			this.isHover = true;
		}
	}

	onMouseLeave = (ev) => {
		if (ev.target === ReactDOM.findDOMNode(this)) { // eslint-disable-line react/no-find-dom-node
			this.isHover = false;
		}
	}

	onFlick = ({direction}) => {
		const bounds = this.uiRef.current.getScrollBounds();
		const focusedItem = Spotlight.getCurrent();

		if (focusedItem) {
			focusedItem.blur();
		}

		if ((
			direction === 'vertical' && this.uiRef.current.canScrollVertically(bounds) ||
			direction === 'horizontal' && this.uiRef.current.canScrollHorizontally(bounds)
		) && !this.props['data-spotlight-container-disabled']) {
			this.childRef.current.setContainerDisabled(true);
		}
	}

	onMouseOver = () => {
		this.resetPosition = this.uiRef.current.childRefCurrent.containerRef.current.scrollTop;
	}

	onMouseMove = () => {
		if (this.resetPosition !== null) {
			const childContainerRef = this.uiRef.current.childRefCurrent.containerRef;
			childContainerRef.current.style.scrollBehavior = null;
			childContainerRef.current.scrollTop = this.resetPosition;
			childContainerRef.current.style.scrollBehavior = 'smooth';
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
			bounds = this.uiRef.current.getScrollBounds(),
			canScrollHorizontally = this.uiRef.current.canScrollHorizontally(bounds),
			canScrollVertically = this.uiRef.current.canScrollVertically(bounds),
			eventDeltaMode = ev.deltaMode,
			eventDelta = (-ev.wheelDeltaY || ev.deltaY);
		let
			delta = 0,
			needToHideThumb = false;

		if (typeof window !== 'undefined') {
			window.document.activeElement.blur();
		}

		this.uiRef.current.showThumb(bounds);

		// FIXME This routine is a temporary support for horizontal wheel scroll.
		// FIXME If web engine supports horizontal wheel, this routine should be refined or removed.
		if (canScrollVertically) { // This routine handles wheel events on scrollbars for vertical scroll.
			if (eventDelta < 0 && this.uiRef.current.scrollTop > 0 || eventDelta > 0 && this.uiRef.current.scrollTop < bounds.maxTop) {
				const {horizontalScrollbarRef, verticalScrollbarRef} = this.uiRef.current;

				if (!this.isWheeling) {
					if (!this.props['data-spotlight-container-disabled']) {
						this.childRef.current.setContainerDisabled(true);
					}
					this.isWheeling = true;
				}

				// Not to check if ev.target is a descendant of a wrapped component which may have a lot of nodes in it.
				if ((horizontalScrollbarRef.current && horizontalScrollbarRef.current.getContainerRef().current.contains(ev.target)) ||
					(verticalScrollbarRef.current && verticalScrollbarRef.current.getContainerRef().current.contains(ev.target))) {
					delta = this.uiRef.current.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientHeight * scrollWheelPageMultiplierForMaxPixel);
					needToHideThumb = !delta;
				} else if (overscrollEffectRequired) {
					this.uiRef.current.checkAndApplyOverscrollEffect('vertical', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce);
				}
			} else {
				if (overscrollEffectRequired && (eventDelta < 0 && this.uiRef.current.scrollTop <= 0 || eventDelta > 0 && this.uiRef.current.scrollTop >= bounds.maxTop)) {
					this.uiRef.current.applyOverscrollEffect('vertical', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce, 1);
				}
				needToHideThumb = true;
			}
		} else if (canScrollHorizontally) { // this routine handles wheel events on any children for horizontal scroll.
			if (eventDelta < 0 && this.uiRef.current.scrollLeft > 0 || eventDelta > 0 && this.uiRef.current.scrollLeft < bounds.maxLeft) {
				if (!this.isWheeling) {
					if (!this.props['data-spotlight-container-disabled']) {
						this.childRef.current.setContainerDisabled(true);
					}
					this.isWheeling = true;
				}
				delta = this.uiRef.current.calculateDistanceByWheel(eventDeltaMode, eventDelta, bounds.clientWidth * scrollWheelPageMultiplierForMaxPixel);
				needToHideThumb = !delta;
			} else {
				if (overscrollEffectRequired && (eventDelta < 0 && this.uiRef.current.scrollLeft <= 0 || eventDelta > 0 && this.uiRef.current.scrollLeft >= bounds.maxLeft)) {
					this.uiRef.current.applyOverscrollEffect('horizontal', eventDelta > 0 ? 'after' : 'before', overscrollTypeOnce, 1);
				}
				needToHideThumb = true;
			}
		}

		if (delta !== 0) {
			/* prevent native scrolling feature for vertical direction */
			ev.preventDefault();
			const direction = Math.sign(delta);
			// Not to accumulate scroll position if wheel direction is different from hold direction
			if (direction !== this.uiRef.current.wheelDirection) {
				this.uiRef.current.isScrollAnimationTargetAccumulated = false;
				this.uiRef.current.wheelDirection = direction;
			}
			this.uiRef.current.scrollToAccumulatedTarget(delta, canScrollVertically, overscrollEffectRequired);
		}

		if (needToHideThumb) {
			this.uiRef.current.startHidingThumb();
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
				bounds = this.uiRef.current.getScrollBounds(),
				scrollHorizontally = bounds.maxLeft > 0 && Math.abs(left - this.uiRef.current.scrollLeft) > epsilon,
				scrollVertically = bounds.maxTop > 0 && Math.abs(top - this.uiRef.current.scrollTop) > epsilon;

			if (scrollHorizontally || scrollVertically) {
				this.uiRef.current.start({
					targetX: left,
					targetY: top,
					animate: this.animateOnFocus,
					overscrollEffect: this.props.overscrollEffectOn[this.uiRef.current.lastInputType] && (!this.childRef.current.shouldPreventOverscrollEffect || !this.childRef.current.shouldPreventOverscrollEffect())
				});
				this.lastScrollPositionOnFocus = pos;
			}
		}
	}

	calculateAndScrollTo = () => {
		const
			spotItem = Spotlight.getCurrent(),
			positionFn = this.childRef.current.calculatePositionOnFocus,
			{containerRef} = this.uiRef.current.childRefCurrent;

		if (spotItem && positionFn && containerRef.current && containerRef.current.contains(spotItem)) {
			const lastPos = this.lastScrollPositionOnFocus;
			let pos;

			// If scroll animation is ongoing, we need to pass last target position to
			// determine correct scroll position.
			if (this.uiRef.current.scrolling && lastPos) {
				pos = positionFn({item: spotItem, scrollPosition: (this.props.direction !== 'horizontal') ? lastPos.top : lastPos.left});
			} else {
				// scrollInfo passes in current `scrollHeight` and `scrollTop` before calculations
				const
					scrollInfo = {
						previousScrollHeight: this.uiRef.current.bounds.scrollHeight,
						scrollTop: this.uiRef.current.scrollTop
					};
				pos = positionFn({item: spotItem, scrollInfo});
			}

			if (pos && (pos.left !== this.uiRef.current.scrollLeft || pos.top !== this.uiRef.current.scrollTop)) {
				this.startScrollOnFocus(pos);
			}

			// update `scrollHeight`
			this.uiRef.current.bounds.scrollHeight = this.uiRef.current.getScrollBounds().scrollHeight;
		}
	}

	onFocus = (ev) => {
		const
			{isDragging} = this.uiRef.current,
			shouldPreventScrollByFocus = this.childRef.current.shouldPreventScrollByFocus ?
				this.childRef.current.shouldPreventScrollByFocus() :
				false;

		if (!Spotlight.getPointerMode()) {
			this.alertThumb();
		}

		if (!(shouldPreventScrollByFocus || Spotlight.getPointerMode() || isDragging)) {
			const
				item = ev.target,
				positionFn = this.childRef.current.calculatePositionOnFocus,
				spotItem = Spotlight.getCurrent();

			if (item && item === spotItem && positionFn) {
				this.calculateAndScrollTo();
			}
		} else if (this.childRef.current.setLastFocusedNode) {
			this.childRef.current.setLastFocusedNode(ev.target);
		}
	}

	scrollByPage = (direction) => {
		// Only scroll by page when the vertical scrollbar is visible. Otherwise, treat the
		// scroller as a plain container
		if (!this.uiRef.current.state.isVerticalScrollbarVisible) {
			return false;
		}

		const
			{childRefCurrent, containerRef} = this.uiRef.current,
			focusedItem = Spotlight.getCurrent();

		this.uiRef.current.lastInputType = 'pageKey';

		// Should skip scroll by page when focusedItem is paging control button of Scrollbar
		if (focusedItem && childRefCurrent.containerRef.current.contains(focusedItem)) {
			const
				// VirtualList and Scroller have a spotlightId on containerRef
				spotlightId = containerRef.current.dataset.spotlightId,
				rDirection = reverseDirections[direction],
				viewportBounds = containerRef.current.getBoundingClientRect(),
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
			} else if (this.childRef.current.scrollToNextPage) {
				next = this.childRef.current.scrollToNextPage({direction, focusedItem, reverseDirection: rDirection, spotlightId});

				if (next !== null) {
					this.animateOnFocus = false;
					Spotlight.focus(next);
				}
			// For VirtualList
			} else if (this.childRef.current.scrollToNextItem) {
				this.childRef.current.scrollToNextItem({direction, focusedItem, reverseDirection: rDirection, spotlightId});
			}

			// Need to check whether an overscroll effect is needed
			return true;
		} else if (!focusedItem && this.isHover) { // There is the pointer in a list and no spot control in it.
			const
				bounds = this.uiRef.current.getScrollBounds(),
				pageDistance = ((direction === 'up') ? -1 : 1) * bounds.clientHeight * paginationPageMultiplier,
				canScrollVertically = this.uiRef.current.canScrollVertically(bounds);

			this.uiRef.current.scrollToAccumulatedTarget(pageDistance, canScrollVertically, this.props.overscrollEffectOn.scrollbarButton);
		}

		return false;
	}

	hasFocus () {
		let current = Spotlight.getCurrent();

		if (!current) {
			const spotlightId = Spotlight.getActiveContainer();
			current = document.querySelector(`[data-spotlight-id="${spotlightId}"]`);
		}

		return current && this.uiRef.current.containerRef.current.contains(current);
	}

	onKeyDown = (ev) => {
		const
			{animate, overscrollEffectOn} = this.props,
			{keyCode, repeat} = ev;
		let
			overscrollEffectRequired = false,
			direction = null;

		forward('onKeyDown', ev, this.props);

		this.animateOnFocus = animate;

		if (isPageUp(keyCode) || isPageDown(keyCode)) {
			ev.preventDefault();
			if ((!repeat && this.hasFocus() || this.isHover) && (this.props.direction === 'vertical' || this.props.direction === 'both')) {
				Spotlight.setPointerMode(false);
				direction = isPageUp(keyCode) ? 'up' : 'down';
				overscrollEffectRequired = this.scrollByPage(direction) && overscrollEffectOn.pageKey;
			}
		} else if (!Spotlight.getPointerMode() && !repeat && this.hasFocus() && getDirection(keyCode)) {
			const element = Spotlight.getCurrent();

			direction = getDirection(keyCode);

			this.uiRef.current.lastInputType = 'arrowKey';

			overscrollEffectRequired = overscrollEffectOn.arrowKey && !(element ? getTargetByDirectionFromElement(direction, element) : null);
			if (overscrollEffectRequired) {
				const {horizontalScrollbarRef, verticalScrollbarRef} = this.uiRef.current;

				if ((horizontalScrollbarRef.current && horizontalScrollbarRef.current.getContainerRef().current.contains(element)) ||
					(verticalScrollbarRef.current && verticalScrollbarRef.current.getContainerRef().current.contains(element))) {
					overscrollEffectRequired = false;
				}
			}
		}

		if (direction && overscrollEffectRequired) { /* if the spotlight focus will not move */
			const
				orientation = (direction === 'up' || direction === 'down') ? 'vertical' : 'horizontal',
				bounds = this.uiRef.current.getScrollBounds(),
				scrollability = orientation === 'vertical' ? this.uiRef.current.canScrollVertically(bounds) : this.uiRef.current.canScrollHorizontally(bounds);

			if (scrollability) {
				const
					isRtl = this.uiRef.current.state.rtl,
					edge = (direction === 'up' || !isRtl && direction === 'left' || isRtl && direction === 'right') ? 'before' : 'after';
				this.uiRef.current.checkAndApplyOverscrollEffect(orientation, edge, overscrollTypeOnce);
			}
		}
	}

	onKeyDownInBody = (ev) => {
		const {keyCode} = ev;

		if (isPageUp(keyCode) || isPageDown(keyCode)) {
			const current = Spotlight.getCurrent();

			if (!current && this.isHover) {
				this.onKeyDown(ev);
			}
		}
	}

	onScrollbarButtonClick = ({isPreviousScrollButton, isVerticalScrollBar}) => {
		const
			bounds = this.uiRef.current.getScrollBounds(),
			direction = isPreviousScrollButton ? -1 : 1,
			pageDistance = direction * (isVerticalScrollBar ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier;

		this.uiRef.current.lastInputType = 'scrollbarButton';

		if (direction !== this.uiRef.current.wheelDirection) {
			this.uiRef.current.isScrollAnimationTargetAccumulated = false;
			this.uiRef.current.wheelDirection = direction;
		}

		this.uiRef.current.scrollToAccumulatedTarget(pageDistance, isVerticalScrollBar, this.props.overscrollEffectOn.scrollbarButton);
	}

	scrollStopOnScroll = () => {
		if (!this.props['data-spotlight-container-disabled']) {
			this.childRef.current.setContainerDisabled(false);
		}
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

		if (this.indexToFocus !== null && typeof childRef.current.focusByIndex === 'function') {
			childRef.current.focusByIndex(this.indexToFocus);
			this.indexToFocus = null;
		}
		if (this.nodeToFocus !== null && typeof childRef.current.focusOnNode === 'function') {
			childRef.current.focusOnNode(this.nodeToFocus);
			this.nodeToFocus = null;
		}
	}

	scrollTo = (opt) => {
		this.indexToFocus = (opt.focus && typeof opt.index === 'number') ? opt.index : null;
		this.nodeToFocus = (opt.focus && opt.node instanceof Object && opt.node.nodeType === 1) ? opt.node : null;
	}

	alertThumb = () => {
		const bounds = this.uiRef.current.getScrollBounds();

		this.uiRef.current.showThumb(bounds);
		this.uiRef.current.startHidingThumb();
	}

	alertThumbAfterRendered = () => {
		const spotItem = Spotlight.getCurrent();

		if (!Spotlight.getPointerMode() && spotItem && this.uiRef.current && this.uiRef.current.childRefCurrent.containerRef.current.contains(spotItem) && this.uiRef.current.isUpdatedScrollThumb) {
			this.alertThumb();
		}
	}

	// Callback for scroller updates; calculate and, if needed, scroll to new position based on focused item.
	handleScrollerUpdate = () => {
		if (this.uiRef.current.scrollToInfo === null) {
			const scrollHeight = this.uiRef.current.getScrollBounds().scrollHeight;
			if (scrollHeight !== this.uiRef.current.bounds.scrollHeight) {
				this.calculateAndScrollTo();
			}
		}

		// oddly, Scroller manages this.uiRef.current.bounds so if we don't update it here (it is also
		// updated in calculateAndScrollTo but we might not have made it to that point), it will be
		// out of date when we land back in this method next time.
		this.uiRef.current.bounds.scrollHeight = this.uiRef.current.getScrollBounds().scrollHeight;
	}

	clearOverscrollEffect = (orientation, edge) => {
		this.overscrollJobs[orientation][edge].startAfter(overscrollTimeout, orientation, edge, overscrollTypeNone, 0);
		this.uiRef.current.setOverscrollStatus(orientation, edge, overscrollTypeNone, 0);
	}

	applyOverscrollEffect = (orientation, edge, type, ratio) => {
		const nodeRef = this.overscrollRefs[orientation].current;

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
		if (childContainerRef.current && childContainerRef.current.addEventListener) {
			childContainerRef.current.addEventListener('mouseover', this.onMouseOver, {capture: true});
			childContainerRef.current.addEventListener('mousemove', this.onMouseMove, {capture: true});
			childContainerRef.current.addEventListener('focusin', this.onFocus);
			if (platform.webos) {
				childContainerRef.current.addEventListener('webOSVoice', this.onVoice);
				childContainerRef.current.setAttribute('data-webos-voice-intent', 'Scroll');
			}
		}
	}

	// FIXME setting event handlers directly to work on the V8 snapshot.
	removeEventListeners = (childContainerRef) => {
		if (childContainerRef.current && childContainerRef.current.removeEventListener) {
			childContainerRef.current.removeEventListener('mouseover', this.onMouseOver, {capture: true});
			childContainerRef.current.removeEventListener('mousemove', this.onMouseMove, {capture: true});
			childContainerRef.current.removeEventListener('focusin', this.onFocus);
			if (platform.webos) {
				childContainerRef.current.removeEventListener('webOSVoice', this.onVoice);
				childContainerRef.current.removeAttribute('data-webos-voice-intent');
			}
		}
	}

	updateFocusAfterVoiceControl = () => {
		const spotItem = Spotlight.getCurrent();
		if (spotItem && this.uiRef.current.containerRef.current.contains(spotItem)) {
			const
				viewportBounds = this.uiRef.current.containerRef.current.getBoundingClientRect(),
				spotItemBounds = spotItem.getBoundingClientRect(),
				nodes = Spotlight.getSpottableDescendants(this.uiRef.current.containerRef.current.dataset.spotlightId),
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

	isReachedEdge = (scrollPos, ltrBound, rtlBound, isRtl = false) => {
		const bound = isRtl ? rtlBound : ltrBound;
		return (bound === 0 && scrollPos === 0) || (bound > 0 && scrollPos >= bound - 1);
	}

	onVoice = (e) => {
		const
			isHorizontal = this.props.direction === 'horizontal',
			isRtl = this.uiRef.current.state.rtl,
			{scrollTop, scrollLeft} = this.uiRef.current,
			{maxLeft, maxTop} = this.uiRef.current.getScrollBounds(),
			verticalDirection = ['up', 'down', 'top', 'bottom'],
			horizontalDirection = isRtl ? ['right', 'left', 'rightmost', 'leftmost'] : ['left', 'right', 'leftmost', 'rightmost'],
			movement = ['previous', 'next', 'first', 'last'];

		let
			scroll = e && e.detail && e.detail.scroll,
			index = movement.indexOf(scroll);

		if (index > -1) {
			scroll = isHorizontal ? horizontalDirection[index] : verticalDirection[index];
		}

		this.voiceControlDirection = verticalDirection.includes(scroll) && 'vertical' || horizontalDirection.includes(scroll) && 'horizontal' || null;

		// Case 1. Invalid direction
		if (this.voiceControlDirection === null) {
			this.isVoiceControl = false;
		// Case 2. Cannot scroll
		} else if (
			(['up', 'top'].includes(scroll) && this.isReachedEdge(scrollTop, 0)) ||
			(['down', 'bottom'].includes(scroll) && this.isReachedEdge(scrollTop, maxTop)) ||
			(['left', 'leftmost'].includes(scroll) && this.isReachedEdge(scrollLeft, 0, maxLeft, isRtl)) ||
			(['right', 'rightmost'].includes(scroll) && this.isReachedEdge(scrollLeft, maxLeft, 0, isRtl))
		) {
			if (window.webOSVoiceReportActionResult) {
				window.webOSVoiceReportActionResult({voiceUi: {exception: 'alreadyCompleted'}});
				e.preventDefault();
			}
		// Case 3. Can scroll
		} else {
			this.isVoiceControl = true;
			if (['up', 'down', 'left', 'right'].includes(scroll)) {
				const isPreviousScrollButton = (scroll === 'up') || (scroll === 'left' && !isRtl) || (scroll === 'right' && isRtl);
				this.onScrollbarButtonClick({isPreviousScrollButton, isVerticalScrollBar: verticalDirection.includes(scroll)});
			} else { // ['top', 'bottom', 'leftmost', 'rightmost'].includes(scroll)
				this.uiRef.current.scrollTo({align: verticalDirection.includes(scroll) && scroll || (scroll === 'leftmost' && isRtl || scroll === 'rightmost' && !isRtl) && 'right' || 'left'});
			}
			e.preventDefault();
		}
	}

	render () {
		const
			{
				animate,
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

		return (
			<UiScrollableBaseNative
				noScrollByDrag
				{...rest}
				addEventListeners={this.addEventListeners}
				applyOverscrollEffect={this.applyOverscrollEffect}
				clearOverscrollEffect={this.clearOverscrollEffect}
				noAnimation={!animate}
				onFlick={this.onFlick}
				onKeyDown={this.onKeyDown}
				onMouseDown={this.onMouseDown}
				onMouseEnter={this.onMouseEnter}
				onMouseLeave={this.onMouseLeave}
				onWheel={this.onWheel}
				ref={this.uiRef}
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
					containerRef: uiContainerRef,
					horizontalScrollbarProps,
					initChildRef: initUiChildRef,
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
						ref={uiContainerRef}
						style={style}
					>
						<div className={classNames(componentCss.container, overscrollCss.overscrollFrame, overscrollCss.vertical, isHorizontalScrollbarVisible ? overscrollCss.horizontalScrollbarVisible : null)} ref={this.overscrollRefs.vertical}>
							<ChildWrapper className={classNames(contentClassName, overscrollCss.overscrollFrame, overscrollCss.horizontal)} ref={this.overscrollRefs.horizontal} {...restChildWrapperProps}>
								{childRenderer({
									...childComponentProps,
									cbScrollTo: scrollTo,
									className: componentCss.scrollableFill,
									initUiChildRef,
									isVerticalScrollbarVisible,
									onUpdate: this.handleScrollerUpdate,
									ref: this.childRef,
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
const ScrollableNative = Skinnable(
	SpotlightContainerDecorator(
		{
			overflow: true,
			preserveId: true,
			restrict: 'self-first'
		},
		I18nContextDecorator(
			{rtlProp: 'rtl'},
			ScrollableBaseNative
		)
	)
);

export default ScrollableNative;
export {
	ScrollableBaseNative,
	ScrollableNative
};
