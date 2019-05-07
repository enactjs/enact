/**
 * Provides Moonstone-themed scrollable components and behaviors.
 *
 * @module moonstone/Scrollable
 * @exports Scrollable
 * @private
 */

import classNames from 'classnames';
import {constants, ScrollableBase as UiScrollableBase} from '@enact/ui/Scrollable';
import {getDirection} from '@enact/spotlight';
import {getTargetByDirectionFromElement, getTargetByDirectionFromPosition} from '@enact/spotlight/src/target';
import {Job} from '@enact/core/util';
import platform from '@enact/core/platform';
import {forward} from '@enact/core/handle';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator/I18nDecorator';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

import $L from '../internal/$L';

import Scrollbar from './Scrollbar';
import Skinnable from '../Skinnable';

import overscrollCss from './OverscrollEffect.module.less';
import scrollbarCss from './Scrollbar.module.less';

const
	{
		animationDuration,
		isPageDown,
		isPageUp,
		overscrollTypeDone,
		overscrollTypeNone,
		overscrollTypeOnce,
		paginationPageMultiplier
	} = constants,
	overscrollRatioPrefix = '--scrollable-overscroll-ratio-',
	overscrollTimeout = 300,
	reverseDirections = {
		down: 'up',
		up: 'down'
	};

/**
 * The name of a custom attribute which indicates the index of an item in
 * [VirtualList]{@link moonstone/VirtualList.VirtualList} or
 * [VirtualGridList]{@link moonstone/VirtualList.VirtualGridList}.
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

	onMouseDown = (ev) => {
		if (this.props['data-spotlight-container-disabled']) {
			ev.preventDefault();
		}
	}

	onTouchStart = () => {
		const
			focusedItem = Spotlight.getCurrent(),
			{horizontalScrollbarRef, verticalScrollbarRef} = this.uiRef.current,
			isHorizontalScrollButtonFocused = horizontalScrollbarRef.current && horizontalScrollbarRef.current.isOneOfScrollButtonsFocused(),
			isVerticalScrollButtonFocused = verticalScrollbarRef.current && verticalScrollbarRef.current.isOneOfScrollButtonsFocused();

		if (focusedItem && !isHorizontalScrollButtonFocused && !isVerticalScrollButtonFocused) {
			focusedItem.blur();
		}
	}

	onWheel = ({delta, horizontalScrollbarRef, verticalScrollbarRef}) => {
		const
			focusedItem = Spotlight.getCurrent(),
			isHorizontalScrollButtonFocused = horizontalScrollbarRef.current && horizontalScrollbarRef.current.isOneOfScrollButtonsFocused(),
			isVerticalScrollButtonFocused = verticalScrollbarRef.current && verticalScrollbarRef.current.isOneOfScrollButtonsFocused();

		if (focusedItem && !isHorizontalScrollButtonFocused && !isVerticalScrollButtonFocused) {
			focusedItem.blur();
		}

		if (delta !== 0) {
			this.isWheeling = true;
			if (!this.props['data-spotlight-container-disabled']) {
				this.childRef.current.setContainerDisabled(true);
			}
		}
	}

	startScrollOnFocus = (pos) => {
		if (pos) {
			const
				{top, left} = pos,
				bounds = this.uiRef.current.getScrollBounds(),
				scrollHorizontally = bounds.maxLeft > 0 && left !== this.uiRef.current.scrollLeft,
				scrollVertically = bounds.maxTop > 0 && top !== this.uiRef.current.scrollTop;

			if (scrollHorizontally || scrollVertically) {
				this.uiRef.current.start({
					targetX: left,
					targetY: top,
					animate: (animationDuration > 0) && this.animateOnFocus,
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
			if (this.uiRef.current.animator.isAnimating() && lastPos) {
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

		if (this.isWheeling) {
			this.uiRef.current.stop();
			this.animateOnFocus = false;
		}

		if (!Spotlight.getPointerMode()) {
			this.alertThumb();
		}

		if (!(shouldPreventScrollByFocus || Spotlight.getPointerMode() || isDragging)) {
			const
				item = ev.target,
				spotItem = Spotlight.getCurrent();

			if (item && item === spotItem) {
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
		const {keyCode, repeat} = ev;

		forward('onKeyDown', ev, this.props);

		if (isPageUp(keyCode) || isPageDown(keyCode)) {
			ev.preventDefault();
		}

		this.animateOnFocus = this.props.animate;

		if (!repeat && this.hasFocus()) {
			const {overscrollEffectOn} = this.props;
			let
				overscrollEffectRequired = false,
				direction = null;

			if (isPageUp(keyCode) || isPageDown(keyCode)) {
				if (this.props.direction === 'vertical' || this.props.direction === 'both') {
					Spotlight.setPointerMode(false);
					direction = isPageUp(keyCode) ? 'up' : 'down';
					overscrollEffectRequired = this.scrollByPage(direction) && overscrollEffectOn.pageKey;
				}
			} else if (getDirection(keyCode)) {
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

	stop = () => {
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
			<UiScrollableBase
				noScrollByDrag={!platform.touch}
				{...rest}
				addEventListeners={this.addEventListeners}
				applyOverscrollEffect={this.applyOverscrollEffect}
				clearOverscrollEffect={this.clearOverscrollEffect}
				noAnimation={!animate}
				onFlick={this.onFlick}
				onKeyDown={this.onKeyDown}
				onMouseDown={this.onMouseDown}
				onWheel={this.onWheel}
				ref={this.uiRef}
				removeEventListeners={this.removeEventListeners}
				scrollTo={this.scrollTo}
				stop={this.stop}
				containerRenderer={({ // eslint-disable-line react/jsx-no-bind
					childComponentProps,
					childWrapper: ChildWrapper,
					childWrapperProps: {className: contentClassName, ...restChildWrapperProps},
					className,
					componentCss,
					containerRef: uiContainerRef,
					handleScroll,
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
						onTouchStart={this.onTouchStart}
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
									onScroll: handleScroll,
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
 * @class Scrollable
 * @memberof moonstone/Scrollable
 * @mixes spotlight/SpotlightContainerDecorator
 * @extends moonstone/Scrollable.ScrollableBase
 * @ui
 * @public
 */
const Scrollable = Skinnable(
	SpotlightContainerDecorator(
		{
			overflow: true,
			preserveId: true,
			restrict: 'self-first'
		},
		I18nContextDecorator(
			{rtlProp: 'rtl'},
			ScrollableBase
		)
	)
);

export default Scrollable;
export {
	dataIndexAttribute,
	Scrollable,
	ScrollableBase
};
