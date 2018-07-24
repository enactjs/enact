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
		overscrollTypeDone,
		overscrollTypeNone,
		overscrollTypeOnce,
		paginationPageMultiplier
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
			this.calculateAndScrollTo(Spotlight.getCurrent());
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
	overscrollRefs = {horizontal: null, vertical: null}
	overscrollJobs = {
		horizontal: {before: null, after: null},
		vertical: {before: null, after: null}
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

	startScrollOnFocus = (pos) => {
		if (pos) {
			const
				{top, left} = pos,
				bounds = this.uiRef.getScrollBounds(),
				scrollHorizontally = bounds.maxLeft > 0 && left !== this.uiRef.scrollLeft,
				scrollVertically = bounds.maxTop > 0 && top !== this.uiRef.scrollTop;

			if (scrollHorizontally || scrollVertically) {
				this.uiRef.start({
					targetX: left,
					targetY: top,
					animate: (animationDuration > 0) && this.animateOnFocus,
					overscrollEffect: (!this.childRef.shouldPreventOverscrollEffect || !this.childRef.shouldPreventOverscrollEffect())
				});
				this.lastScrollPositionOnFocus = pos;
			}
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
			if (this.uiRef.animator.isAnimating() && lastPos) {
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
				spotItem = Spotlight.getCurrent();

			if (item && item === spotItem) {
				this.calculateAndScrollTo(item);
			}
		} else if (this.childRef.setLastFocusedNode) {
			this.childRef.setLastFocusedNode(ev.target);
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
		if (!this.uiRef.state.isVerticalScrollbarVisible) {
			return true;
		}

		const
			{childRef, containerRef} = this.uiRef,
			bounds = this.uiRef.getScrollBounds(),
			spotItem = Spotlight.getCurrent();

		// Should skip scroll by page when spotItem is paging control button of Scrollbar
		if (spotItem && childRef.containerRef.contains(spotItem)) {
			const
				// VirtualList and Scroller have a spotlightId on containerRef
				spotlightId = containerRef.dataset.spotlightId,
				direction = this.getPageDirection(keyCode),
				rDirection = reverseDirections[direction],
				viewportBounds = containerRef.getBoundingClientRect(),
				spotItemBounds = spotItem.getBoundingClientRect(),
				endPoint = this.getEndPoint(direction, spotItemBounds, viewportBounds);
			let next = getTargetByDirectionFromPosition(rDirection, endPoint, spotlightId);

			/* 1. Find spottable item in viewport */
			if (next !== spotItem) {
				this.animateOnFocus = false;
				Spotlight.focus(next);
			/* 2. Find spottable item out of viewport */
			// For Scroller
			} else if (this.childRef.scrollToNextPage) {
				const nodeToScroll = this.childRef.scrollToNextPage({direction, focusedItem: spotItem, reverseDirection: rDirection, scrollBoundHeight: bounds.scrollHeight, spotlightId, viewportBoundHeight: viewportBounds.height});

				if (nodeToScroll !== null) {
					this.animateOnFocus = false;
					Spotlight.focus(nodeToScroll);
				}

				return false;
			// For VirtualList
			} else if (this.childRef.scrollToNextItem) {
				// For VirtualList, need to check whether an overscroll effect is needed
				this.childRef.scrollToNextItem({direction, focusedItem: spotItem, reverseDirection: rDirection, spotlightId});

				return false;
			}
		}

		return true;
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
		const {keyCode, repeat} = ev;

		this.animateOnFocus = true;

		if (!repeat && this.hasFocus()) {
			let
				overscrollEffectRequired = false,
				direction = null;

			if (isPageUp(keyCode) || isPageDown(keyCode)) {
				direction = this.getPageDirection(keyCode);
				overscrollEffectRequired = !this.scrollByPage(keyCode);
			} else {
				direction = getDirection(keyCode);
				if (direction) {
					const element = Spotlight.getCurrent();

					overscrollEffectRequired = !(element ? getTargetByDirectionFromElement(direction, element) : null);
					if (overscrollEffectRequired) {
						const {horizontalScrollbarRef, verticalScrollbarRef} = this.uiRef;

						if ((horizontalScrollbarRef && horizontalScrollbarRef.getContainerRef().contains(element)) ||
							(verticalScrollbarRef && verticalScrollbarRef.getContainerRef().contains(element))) {
							overscrollEffectRequired = false;
						}
					}
				}
			}

			if (overscrollEffectRequired) { /* if the spotlight focus will not move */
				const
					orientation = (direction === 'up' || direction === 'down') ? 'vertical' : 'horizontal',
					bounds = this.uiRef.getScrollBounds(),
					scrollability = orientation === 'vertical' ? this.uiRef.canScrollVertically(bounds) : this.uiRef.canScrollHorizontally(bounds);

				if (scrollability) {
					const
						isRtl = this.uiRef.state.rtl,
						edge = (direction === 'up' || !isRtl && direction === 'left' || isRtl && direction === 'right') ? 'before' : 'after';
					this.uiRef.checkAndApplyOverscrollEffect(orientation, edge, overscrollTypeOnce, 1);
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
			this.calculateAndScrollTo(Spotlight.getCurrent());
		}
	}

	clearOverscrollEffect = (orientation, edge) => {
		const {type} = this.uiRef.getOverscrollStatus(orientation, edge);

		if (type !== overscrollTypeNone) {
			this.overscrollJobs[orientation][edge].startAfter(overscrollTimeout, orientation, edge, overscrollTypeNone, 0);
			this.uiRef.setOverscrollStatus(orientation, edge, overscrollTypeNone, 0);
		}
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
			<UiScrollableBase
				{...rest}
				addEventListeners={this.addEventListeners}
				applyOverscrollEffect={this.applyOverscrollEffect}
				clearOverscrollEffect={this.clearOverscrollEffect}
				onFlick={this.onFlick}
				onKeyDown={this.onKeyDown}
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
									initUiChildRef,
									isVerticalScrollbarVisible,
									onScroll: handleScroll,
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
