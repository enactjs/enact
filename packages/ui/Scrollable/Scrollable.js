/**
 * Provides unstyled scrollable components and behaviors to be customized by a theme or application.
 *
 * @module ui/Scrollable
 * @exports Scrollable
 * @exports constants
 * @exports ScrollableBase
 */

import clamp from 'ramda/src/clamp';
import classNames from 'classnames';
import {contextTypes as contextTypesState, Publisher} from '@enact/core/internal/PubSub';
import {forward} from '@enact/core/handle';
import kind from '@enact/core/kind';
import {on, off} from '@enact/core/dispatcher';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {contextTypes as contextTypesResize} from '../Resizable';

import constants from './constants';
import css from './Scrollable.less';
import Draggable from './Draggable';
import ScrollAnimator, {animationDuration} from './ScrollAnimator';
import Scrollbar from './Scrollbar';
import ScrollStrategyJS from './ScrollStrategyJS';

const
	forwardScroll = forward('onScroll'),
	forwardScrollStart = forward('onScrollStart'),
	forwardScrollStop = forward('onScrollStop');

const
	{
		epsilon,
		nop,
		paginationPageMultiplier
	} = constants;

/**
 * [ScrollableBase]{@link ui/Scrollable.ScrollableBase} is a base component for
 * [Scrollable]{@link ui/Scrollable.Scrollable}.
 *
 * @class ScrollableBase
 * @memberof ui/Scrollable
 * @ui
 * @private
 */
class ScrollableBase extends Component {
	static displayName = 'ui:ScrollableBase'

	static propTypes = /** @lends ui/Scrollable.ScrollableBase.prototype */ {
		/**
		 * A callback function that receives a reference to the `scrollTo` feature. Once received,
		 * the `scrollTo` method can be called as an imperative interface.
		 *
		 * The `scrollTo` function accepts the following paramaters:
		 * - {position: {x, y}} - Pixel value for x and/or y position
		 * - {align} - Where the scroll area should be aligned. Values are:
		 *   `'left'`, `'right'`, `'top'`, `'bottom'`,
		 *   `'topleft'`, `'topright'`, `'bottomleft'`, and `'bottomright'`.
		 * - {index} - Index of specific item. (`0` or positive integer)
		 *   This option is available for only `VirtualList` kind.
		 * - {node} - Node to scroll into view
		 * - {animate} - When `true`, scroll occurs with animation. When `false`, no
		 *   animation occurs.
		 * - {indexToFocus} - Deprecated: Use `focus` instead.
		 * - {focus} - When `true`, attempts to focus item after scroll. Only valid when scrolling
		 *   by `index` or `node`.
		 * > Note: Only specify one of: `position`, `align`, `index` or `node`
		 *
		 * Example:
		 * ```
		 *	// If you set cbScrollTo prop like below;
		 *	cbScrollTo: (fn) => {this.scrollTo = fn;}
		 *	// You can simply call like below;
		 *	this.scrollTo({align: 'top'}); // scroll to the top
		 * ```
		 * @type {Function}
		 * @public
		 */
		cbScrollTo: PropTypes.func,

		/**
		 * The Current status of dragging
		 *
		 * @type {Booelan}
		 * @default false
		 * @private
		 */
		dragging: PropTypes.bool,

		/**
		 * Specifies how to show horizontal scrollbar. Acceptable values are `'auto'`,
		 * `'visible'`, and `'hidden'`.
		 *
		 * @type {String}
		 * @default 'auto'
		 * @public
		 */
		horizontalScrollbar: PropTypes.oneOf(['auto', 'visible', 'hidden']),

		/**
		 * Called when scrolling
		 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`
		 * It is not recommended to set this prop since it can cause performance degradation. Use
		 * `onScrollStart` or `onScrollStop` instead.
		 *
		 * @type {Function}
		 * @public
		 */
		onScroll: PropTypes.func,

		/**
		 * Called when scrollbar visibility changes
		 *
		 * @type {Function}
		 * @public
		 */
		onScrollbarVisibilityChange: PropTypes.func,

		/**
		 * Called when scroll starts
		 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`
		 *
		 * @type {Function}
		 * @public
		 */
		onScrollStart: PropTypes.func,

		/**
		 * Called when scroll stops
		 * Passes `scrollLeft`, `scrollTop`, and `moreInfo`
		 *
		 * @type {Function}
		 * @public
		 */
		onScrollStop: PropTypes.func,

		/**
		 * Scrollable CSS style.
		 * Should be defined because we manuplate style prop in render().
		 *
		 * @type {Object}
		 * @public
		 */
		style: PropTypes.object,

		/**
		 * Specifies how to show vertical scrollbar. Acceptable values are `'auto'`,
		 * `'visible'`, and `'hidden'`.
		 *
		 * @type {String}
		 * @default 'auto'
		 * @public
		 */
		verticalScrollbar: PropTypes.oneOf(['auto', 'visible', 'hidden']),

		/**
		 * A component to make scrollable.
		 *
		 * @type {Function}
		 * @public
		 */
		wrapped: PropTypes.func
	}

	static defaultProps = {
		cbScrollTo: nop,
		dragging: false,
		horizontalScrollbar: 'auto',
		onScroll: nop,
		onScrollStart: nop,
		onScrollStop: nop,
		verticalScrollbar: 'auto'
	}

	static childContextTypes = {
		...contextTypesResize,
		...contextTypesState
	}

	static contextTypes = contextTypesState

	constructor (props) {
		super(props);

		this.state = {
			rtl: false,
			remeasure: false,
			isHorizontalScrollbarVisible: props.horizontalScrollbar === 'visible',
			isVerticalScrollbarVisible: props.verticalScrollbar === 'visible'
		};

		this.initChildRef = this.initRef('childRef');
		this.initContainerRef = this.initRef('containerRef');

		this.verticalScrollbarProps = {
			ref: this.initRef('verticalScrollbarRef'),
			vertical: true
		};

		this.horizontalScrollbarProps = {
			ref: this.initRef('horizontalScrollbarRef'),
			vertical: false
		};

		props.cbScrollTo(this.scrollTo);
	}

	getChildContext = () => ({
		invalidateBounds: this.enqueueForceUpdate,
		Subscriber: this.publisher.getSubscriber()
	})

	componentWillMount () {
		this.publisher = Publisher.create('resize', this.context.Subscriber);
		this.publisher.publish({
			remeasure: false
		});

		if (this.context.Subscriber) {
			this.context.Subscriber.subscribe('resize', this.handleSubscription);
			this.context.Subscriber.subscribe('i18n', this.handleSubscription);
		}
	}

	componentDidMount () {
		const bounds = this.getScrollBounds();

		this.pageDistance = (this.canScrollVertically(bounds) ? bounds.clientHeight : bounds.clientWidth) * paginationPageMultiplier;
		this.direction = this.childRef.props.direction;
		this.updateScrollbars();

		this.updateEventListeners();
		on('keydown', this.onKeyDown);
	}

	componentWillUpdate () {
		this.deferScrollTo = true;
	}

	componentDidUpdate (prevProps, prevState) {
		// Need to sync calculated client size if it is different from the real size
		if (this.childRef.syncClientSize) {
			const {isVerticalScrollbarVisible, isHorizontalScrollbarVisible} = this.state;
			// If we actually synced, we need to reset scroll position.
			if (this.childRef.syncClientSize()) {
				this.setScrollLeft(0);
				this.setScrollTop(0);
			}
			// Need to check item total size is same with client size when scrollbar is visible
			// By hiding scrollbar again, infinite function call maybe happens
			this.isFitClientSize = (isVerticalScrollbarVisible || isHorizontalScrollbarVisible) && this.childRef.isSameTotalItemSizeWithClient();
		}

		this.clampScrollPosition();

		this.direction = this.childRef.props.direction;
		this.updateEventListeners();
		if (!this.isFitClientSize) {
			this.updateScrollbars();
		}

		if (this.scrollToInfo !== null) {
			if (!this.deferScrollTo) {
				this.scrollTo(this.scrollToInfo);
			}
		}

		// publish container resize changes
		const horizontal = this.state.isHorizontalScrollbarVisible !== prevState.isHorizontalScrollbarVisible;
		const vertical = this.state.isVerticalScrollbarVisible !== prevState.isVerticalScrollbarVisible;
		if (horizontal || vertical) {
			this.publisher.publish({
				horizontal,
				vertical
			});
		}
	}

	componentWillUnmount () {
		// Before call cancelAnimationFrame, you must send scrollStop Event.
		if (this.animator.isAnimating()) {
			this.doScrollStop();
			this.animator.stop();
		}

		if (this.context.Subscriber) {
			this.context.Subscriber.unsubscribe('resize', this.handleSubscription);
			this.context.Subscriber.unsubscribe('i18n', this.handleSubscription);
		}

		this.removeEventListeners();
		off('keydown', this.onKeyDown);
	}

	// TODO: consider replacing forceUpdate() by storing bounds in state rather than a non-
	// state member.
	enqueueForceUpdate = () => {
		this.childRef.calculateMetrics();
		this.forceUpdate();
	}

	handleSubscription = ({channel, message}) => {
		if (channel === 'i18n') {
			const {rtl} = message;
			if (rtl !== this.state.rtl) {
				this.setState({rtl});
			}
		} else if (channel === 'resize') {
			this.publisher.publish(message);
		}
	}

	clampScrollPosition () {
		const bounds = this.getScrollBounds();

		if (this.scrollTop > bounds.maxTop) {
			this.scrollTop = bounds.maxTop;
		}

		if (this.scrollLeft > bounds.maxLeft) {
			this.scrollLeft = bounds.maxLeft;
		}
	}

	// constants
	pixelPerLine = 39
	scrollWheelMultiplierForDeltaPixel = 1.5 // The ratio of wheel 'delta' units to pixels scrolled.

	// status
	direction = 'vertical'
	isScrollAnimationTargetAccumulated = false
	wheelDirection = 0
	pageDirection = 0
	deferScrollTo = true
	pageDistance = 0
	isFitClientSize = false
	isUpdatedScrollThumb = false

	// bounds info
	bounds = {
		clientWidth: 0,
		clientHeight: 0,
		scrollWidth: 0,
		scrollHeight: 0,
		maxTop: 0,
		maxLeft: 0
	}

	// scroll info
	scrolling = false
	scrollLeft = 0
	scrollTop = 0
	scrollToInfo = null

	// component info
	childRef = null
	containerRef = null

	// scroll animator
	animator = new ScrollAnimator()

	// call scroll callbacks

	doScrollStart () {
		forwardScrollStart({scrollLeft: this.scrollLeft, scrollTop: this.scrollTop, moreInfo: this.getMoreInfo()}, this.props);
	}

	doScrolling () {
		forwardScroll({scrollLeft: this.scrollLeft, scrollTop: this.scrollTop, moreInfo: this.getMoreInfo()}, this.props);
	}

	doScrollStop () {
		forwardScrollStop({scrollLeft: this.scrollLeft, scrollTop: this.scrollTop, moreInfo: this.getMoreInfo()}, this.props);
	}

	// update scroll position

	setScrollLeft (value) {
		const bounds = this.getScrollBounds();

		this.scrollLeft = clamp(0, bounds.maxLeft, value);
		if (this.state.isHorizontalScrollbarVisible) {
			this.updateThumb(this.horizontalScrollbarRef, bounds);
		}
	}

	setScrollTop (value) {
		const bounds = this.getScrollBounds();

		this.scrollTop = clamp(0, bounds.maxTop, value);
		if (this.state.isVerticalScrollbarVisible) {
			this.updateThumb(this.verticalScrollbarRef, bounds);
		}
	}

	// scroll start/stop

	start ({targetX, targetY, animate = true, duration = animationDuration}) {
		const {scrollLeft, scrollTop} = this;
		const bounds = this.getScrollBounds();

		this.animator.stop();
		if (!this.scrolling) {
			this.scrolling = true;
			this.doScrollStart();
		}

		if (Math.abs(bounds.maxLeft - targetX) < epsilon) {
			targetX = bounds.maxLeft;
		}
		if (Math.abs(bounds.maxTop - targetY) < epsilon) {
			targetY = bounds.maxTop;
		}

		this.showThumb(bounds);

		if (animate) {
			this.animator.animate(this.scrollAnimation({
				sourceX: scrollLeft,
				sourceY: scrollTop,
				targetX,
				targetY,
				duration
			}));
		} else {
			targetX = clamp(0, bounds.maxLeft, targetX);
			targetY = clamp(0, bounds.maxTop, targetY);

			this.scroll(targetX, targetY);
			this.stop();
		}
	}

	scrollAnimation = (animationInfo) => (curTime) => {
		const
			{sourceX, sourceY, targetX, targetY, duration} = animationInfo,
			bounds = this.getScrollBounds();

		if (curTime < duration) {
			this.scroll(
				this.canScrollHorizontally(bounds) ? clamp(0, bounds.maxLeft, this.animator.timingFunction(sourceX, targetX, duration, curTime)) : sourceX,
				this.canScrollVertically(bounds) ? clamp(0, bounds.maxTop, this.animator.timingFunction(sourceY, targetY, duration, curTime)) : sourceY
			);
		} else {
			this.scroll(
				clamp(0, bounds.maxLeft, targetX),
				clamp(0, bounds.maxTop, targetY)
			);
			this.stop();
		}
	}

	scroll = (left, top) => {
		let
			dirX = 0,
			dirY = 0;

		if (left !== this.scrollLeft) {
			dirX = Math.sign(left - this.scrollLeft);
			this.setScrollLeft(left);
		}
		if (top !== this.scrollTop) {
			dirY = Math.sign(top - this.scrollTop);
			this.setScrollTop(top);
		}

		this.childRef.setScrollPosition(this.scrollLeft, this.scrollTop, dirX, dirY);
		this.doScrolling();
	}

	stop () {
		this.animator.stop();
		this.isScrollAnimationTargetAccumulated = false;
		this.startHidingThumb();
		if (this.scrolling) {
			this.scrolling = false;
			this.doScrollStop();
		}
	}

	// scrollTo API

	getPositionForScrollTo = (opt) => {
		const
			bounds = this.getScrollBounds(),
			canScrollHorizontally = this.canScrollHorizontally(bounds),
			canScrollVertically = this.canScrollVertically(bounds);
		let
			itemPos,
			left = null,
			top = null;

		if (opt instanceof Object) {
			if (opt.position instanceof Object) {
				if (canScrollHorizontally) {
					// We need '!=' to check if opt.potision.x is null or undefined
					left = opt.position.x != null ? opt.position.x : this.scrollLeft;
				} else {
					left = 0;
				}
				if (canScrollVertically) {
					// We need '!=' to check if opt.potision.y is null or undefined
					top = opt.position.y != null ? opt.position.y : this.scrollTop;
				} else {
					top = 0;
				}
			} else if (typeof opt.align === 'string') {
				if (canScrollHorizontally) {
					if (opt.align.includes('left')) {
						left = 0;
					} else if (opt.align.includes('right')) {
						left = bounds.maxLeft;
					}
				}
				if (canScrollVertically) {
					if (opt.align.includes('top')) {
						top = 0;
					} else if (opt.align.includes('bottom')) {
						top = bounds.maxTop;
					}
				}
			} else {
				if (typeof opt.index === 'number' && typeof this.childRef.getItemPosition === 'function') {
					itemPos = this.childRef.getItemPosition(opt.index, opt.stickTo);
				} else if (opt.node instanceof Object) {
					if (opt.node.nodeType === 1 && typeof this.childRef.getNodePosition === 'function') {
						itemPos = this.childRef.getNodePosition(opt.node);
					}
				}
				if (itemPos) {
					if (canScrollHorizontally) {
						left = itemPos.left;
					}
					if (canScrollVertically) {
						top = itemPos.top;
					}
				}
			}
		}

		return {left, top};
	}

	scrollTo = (opt) => {
		if (!this.deferScrollTo) {
			const {left, top} = this.getPositionForScrollTo(opt);
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

	canScrollHorizontally = (bounds) => {
		const {direction} = this;

		return (direction === 'horizontal' || direction === 'both') && (bounds.scrollWidth > bounds.clientWidth) && !isNaN(bounds.scrollWidth);
	}

	canScrollVertically = (bounds) => {
		const {direction} = this;
		return (direction === 'vertical' || direction === 'both') && (bounds.scrollHeight > bounds.clientHeight) && !isNaN(bounds.scrollHeight);
	}

	// scroll bar

	showThumb (bounds) {
		if (this.state.isHorizontalScrollbarVisible && this.canScrollHorizontally(bounds) && this.horizontalScrollbarRef) {
			this.horizontalScrollbarRef.showThumb();
		}
		if (this.state.isVerticalScrollbarVisible && this.canScrollVertically(bounds) && this.verticalScrollbarRef) {
			this.verticalScrollbarRef.showThumb();
		}
	}

	updateThumb (scrollbarRef, bounds) {
		scrollbarRef.update({
			...bounds,
			scrollLeft: this.scrollLeft,
			scrollTop: this.scrollTop
		});
	}

	startHidingThumb = () => {
		if (this.state.isHorizontalScrollbarVisible && this.horizontalScrollbarRef) {
			this.horizontalScrollbarRef.startHidingThumb();
		}
		if (this.state.isVerticalScrollbarVisible && this.verticalScrollbarRef) {
			this.verticalScrollbarRef.startHidingThumb();
		}
	}

	updateScrollbars = () => {
		const
			{horizontalScrollbar, verticalScrollbar} = this.props,
			{isHorizontalScrollbarVisible, isVerticalScrollbarVisible} = this.state,
			bounds = this.getScrollBounds(),
			canScrollHorizontally = this.canScrollHorizontally(bounds),
			canScrollVertically = this.canScrollVertically(bounds),
			curHorizontalScrollbarVisible = (horizontalScrollbar === 'auto') ? canScrollHorizontally : horizontalScrollbar === 'visible',
			curVerticalScrollbarVisible = (verticalScrollbar === 'auto') ? canScrollVertically : verticalScrollbar === 'visible';

		// determine if we should hide or show any scrollbars
		const
			isVisibilityChanged = (
				isHorizontalScrollbarVisible !== curHorizontalScrollbarVisible ||
				isVerticalScrollbarVisible !== curVerticalScrollbarVisible
			);

		if (isVisibilityChanged) {
			if (this.props.onScrollbarVisibilityChange) {
				this.props.onScrollbarVisibilityChange();
			}

			// one or both scrollbars have changed visibility
			this.setState({
				isHorizontalScrollbarVisible: curHorizontalScrollbarVisible,
				isVerticalScrollbarVisible: curVerticalScrollbarVisible
			});
		} else {
			this.deferScrollTo = false;
			this.isUpdatedScrollThumb = this.updateScrollThumbSize();
		}
	}

	updateScrollThumbSize = () => {
		const
			{horizontalScrollbar, verticalScrollbar} = this.props,
			bounds = this.getScrollBounds(),
			canScrollHorizontally = this.canScrollHorizontally(bounds),
			canScrollVertically = this.canScrollVertically(bounds),
			curHorizontalScrollbarVisible = (horizontalScrollbar === 'auto') ? canScrollHorizontally : horizontalScrollbar === 'visible',
			curVerticalScrollbarVisible = (verticalScrollbar === 'auto') ? canScrollVertically : verticalScrollbar === 'visible';

		if (curHorizontalScrollbarVisible || curVerticalScrollbarVisible) {
			// no visibility change but need to notify whichever scrollbars are visible of the
			// updated bounds and scroll position
			const
				updatedBounds = {
					...bounds,
					scrollLeft: this.scrollLeft,
					scrollTop: this.scrollTop
				};

			if (curHorizontalScrollbarVisible && this.horizontalScrollbarRef) {
				this.horizontalScrollbarRef.update(updatedBounds);
			}
			if (curVerticalScrollbarVisible && this.verticalScrollbarRef) {
				this.verticalScrollbarRef.update(updatedBounds);
			}
			return true;
		}
		return false;
	}

	// ref

	getScrollBounds () {
		if (typeof this.childRef.getScrollBounds === 'function') {
			return this.childRef.getScrollBounds();
		}
	}

	getMoreInfo () {
		if (typeof this.childRef.getMoreInfo === 'function') {
			return this.childRef.getMoreInfo();
		}
	}

	updateEventListeners () {
		const {containerRef} = this;

		if (containerRef && containerRef.addEventListener) {
			// FIXME `onWheel` doesn't work on the v8 snapshot.
			containerRef.addEventListener('wheel', this.onWheel);
		}
	}

	removeEventListeners () {
		const {containerRef} = this;

		if (containerRef && containerRef.removeEventListener) {
			// FIXME `onWheel` doesn't work on the v8 snapshot.
			containerRef.removeEventListener('wheel', this.onWheel);
		}
	}

	// render

	initRef (prop) {
		return (ref) => {
			this[prop] = ref;
		};
	}

	handleScroll = () => {
		if (!this.animator.isAnimating() && this.childRef && this.childRef.containerRef) {
			this.childRef.containerRef.scrollTop = this.scrollTop;
			this.childRef.containerRef.scrollLeft = this.scrollLeft;
		}
	}

	render () {
		const
			{className, style, wrapped: Wrapped, ...rest} = this.props,
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
			<div
				className={scrollableClasses}
				ref={this.initContainerRef}
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
			</div>
		);
	}
}

const StrategyScrollableBase = Draggable(ScrollStrategyJS(ScrollableBase));
/**
 * [Scrollable]{@link ui/Scrollable.Scrollable} is a Higher-order Component
 * that applies a Scrollable behavior to its wrapped component.
 *
 * @class Scrollable
 * @memberof ui/Scrollable
 * @ui
 * @private
 */
const Scrollable = (WrappedComponent) => (kind({
	name: 'ui:Scrollable',
	render: (props) => (<StrategyScrollableBase wrapped={WrappedComponent} {...props} />)
}));

export default Scrollable;
export {
	Scrollable,
	constants,
	ScrollableBase,
	StrategyScrollableBase
};
