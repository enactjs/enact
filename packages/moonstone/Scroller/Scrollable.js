/**
 * Exports the {@link moonstone/Scroller/Scrollable.Scrollable} Higher-order Component (HOC) and
 * the {@link constant:@enact/moonstone/Scroller/Scrollable.dataIndexAttribute} constant.
 * The default export is {@link moonstone/Scroller/Scrollable.Scrollable}.
 *
 * @module moonstone/Scroller/Scrollable
 */

import classNames from 'classnames';
import hoc from '@enact/core/hoc';
import R from 'ramda';
import React, {Component, PropTypes} from 'react';
import ri from '@enact/ui/resolution';

import ScrollAnimator from './ScrollAnimator';
import Scrollbar from './Scrollbar';
import css from './Scrollable.less';

const
	calcVelocity = (d, dt) => (d && dt) ? d / dt : 0,
	nop = () => {},
	perf = (typeof window === 'object') ? window.performance : {},
	holdTime = 50,
	scrollWheelMultiplier = 5,
	pixelPerLine = ri.scale(40) * scrollWheelMultiplier,
	pixelPerScrollbarBtn = ri.scale(100),
	epsilon = 1,
	getComputedStyle = (typeof window === 'object') ? window.getComputedStyle : {},
	// spotlight
	doc = (typeof window === 'object') ? window.document : {},
	spotlightAnimationDuration = 500;

/**
 * {@link moonstone/Scroller/Scrollable.dataIndexAttribute} is the name of a custom attribute
 * which indicates the index of an item in {@link moonstone/VirtualList.VirtualList}
 * or {@link moonstone/VirtualList.VirtualGridList}.
 *
 * @constant dataIndexAttribute
 * @type {String}
 * @public
 */
const dataIndexAttribute = 'data-index';

/**
 * {@link moonstone/Scroller/Scrollable.Scrollable} is a Higher-order Component
 * that applies a Scrollable behavior to its wrapped component.
 *
 * Scrollable catches `onFocus` and `onKeyDown` events from its wrapped component for spotlight features,
 * and also catches `onMouseDown`, `onMouseLeave`, `onMouseMove`, `onMouseUp`, and `onWheel` events
 * from its wrapped component for scrolling behaviors.
 *
 * Scrollable calls `onScrollStart`, `onScrolling`, and `onScrollStop` callback functions during scroll.
 *
 * @class Scrollable
 * @memberof moonstone/Scroller/Scrollable
 * @hoc
 * @public
 */
const ScrollableHoC = hoc((config, Wrapped) => {
	return class Scrollable extends Component {
		static propTypes = {
			/**
			 * The callback function which is called for linking scrollTo function.
			 * You should specify a callback function as the value of this prop
			 * to use scrollTo feature.
			 *
			 * The scrollTo function passed to the parent component requires below as an argument.
			 * - {position: {x, y}} - You can set a pixel value for x and/or y position
			 * - {align} - You can set one of values below for align
			 *   `'left'`, `'right'`, `'top'`, `'bottom'`,
			 *   `'topleft'`, `'topright'`, `'bottomleft'`, and `'bottomright'`.
			 * - {index} - You can set an index of specific item. (`0` or positive integer)
			 *
			 * @example
			 *	// If you set cbScrollTo prop like below;
			 *	cbScrollTo: (fn) => {this.scrollTo = fn;}
			 *	// You can simply call like below;
			 *	this.scrollTo({align: 'top'}); // scroll to the top
			 * @type {Function}
			 * @public
			 */
			cbScrollTo: PropTypes.func,

			className: PropTypes.string,

			/**
			 * Hides the scrollbars when `true`
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			hideScrollbars: PropTypes.bool,

			/**
			 * Called when scrolling
			 *
			 * @type {Function}
			 * @public
			 */
			onScroll: PropTypes.func,

			/**
			 * Called when scroll starts
			 *
			 * @type {Function}
			 * @public
			 */
			onScrollStart: PropTypes.func,

			/**
			 * Called when scroll stops
			 *
			 * @type {Function}
			 * @public
			 */
			onScrollStop: PropTypes.func,

			/**
			 * Options for positioning the items; valid values are `'byItem'`, `'byContainer'`,
			 * and `'byBrowser'`.
			 * If `'byItem'`, the list moves each item.
			 * If `'byContainer'`, the list moves the container that contains rendered items.
			 * If `'byBrowser'`, the list scrolls by browser.
			 *
			 * @type {String}
			 * @default 'byItem'
			 * @private
			 */
			positioningOption: PropTypes.oneOf(['byItem', 'byContainer', 'byBrowser']),

			style: PropTypes.object
		}

		static defaultProps = {
			cbScrollTo: nop,
			hideScrollbars: false,
			onScroll: nop,
			onScrollStart: nop,
			onScrollStop: nop,
			positioningOption: 'byItem'
		}

		// status
		horizontalScrollability = false
		verticalScrollability = false
		isScrollAnimationTargetAccumulated = false
		isFirstDragging = false
		isDragging = false

		// mouse handlers
		eventHandlers = {}

		// drag info
		dragInfo = {
			t: 0,
			clientX: 0,
			clientY: 0,
			dx: 0,
			dy: 0,
			dt: 0
		}

		// bounds info
		bounds = {
			clientWidth: 0,
			clientHeight: 0,
			scrollWidth: 0,
			scrollHeight: 0,
			maxTop: 0,
			maxLeft: 0
		}

		precalculatedClientSize = {}

		// for calculating client size
		renderScrollbars = true

		// scroll info
		scrollLeft = 0
		scrollTop = 0
		dirHorizontal = 0
		dirVertical = 0

		// spotlight
		lastFocusedItem = null

		// component info
		childRef = null

		// scroll animator
		animator = new ScrollAnimator()

		constructor (props) {
			super(props);

			this.state = {
				isHorizontalScrollbarVisible: true,
				isVerticalScrollbarVisible: true
			};

			this.initContainerRef = this.initRef('containerRef');
			this.initChildRef = this.initRef('childRef');

			if (this.props.positioningOption === 'byBrowser') {
				const {onFocus, onKeyDown, onScroll} = this;
				this.eventHandlers = {
					onFocus,
					onKeyDown,
					onScroll
				};
			} else {
				const {onFocus, onKeyDown, onMouseDown, onMouseLeave, onMouseMove, onMouseUp, onWheel} = this;
				this.eventHandlers = {
					onFocus,
					onKeyDown,
					onMouseDown,
					onMouseLeave,
					onMouseMove,
					onMouseUp,
					onWheel
				};
			}

			this.verticalScrollbarProps = {
				ref: this.initRef('scrollbarVerticalRef'),
				isVertical: true,
				onPrevScroll: this.initScrollbarBtnHandler('vertical', -1),
				onNextScroll: this.initScrollbarBtnHandler('vertical', 1)
			};

			this.horizontalScrollbarProps = {
				ref: this.initRef('scrollbarHorizontalRef'),
				isVertical: false,
				onPrevScroll: this.initScrollbarBtnHandler('horizontal', -1),
				onNextScroll: this.initScrollbarBtnHandler('horizontal', 1)
			};

			props.cbScrollTo(this.scrollTo);
		}

		// handle an input event

		dragStart (e) {
			const d = this.dragInfo;

			this.isDragging = true;
			this.isFirstDragging = true;
			d.t = perf.now();
			d.clientX = e.clientX;
			d.clientY = e.clientY;
			d.dx = d.dy = 0;
		}

		drag (e) {
			let t = perf.now();
			const d = this.dragInfo;

			if (this.horizontalScrollability) {
				d.dx = e.clientX - d.clientX;
				d.clientX = e.clientX;
			} else {
				d.dx = 0;
			}

			if (this.verticalScrollability) {
				d.dy = e.clientY - d.clientY;
				d.clientY = e.clientY;
			} else {
				d.dy = 0;
			}

			d.t = t;

			return {dx: d.dx, dy: d.dy};
		}

		dragStop () {
			const
				d = this.dragInfo,
				t = perf.now();

			d.dt = t - d.t;
			this.isDragging = false;
		}

		isFlicking () {
			const d = this.dragInfo;

			if (d.dt > holdTime) {
				return false;
			} else {
				return true;
			}
		}

		wheel (e, isHorizontal, isVertical) {
			const deltaMode = e.deltaMode;
			let delta = e.deltaY;

			if (deltaMode === 0) {
				delta = ri.scale(delta) * scrollWheelMultiplier;
			} else if (deltaMode === 1) { // line; firefox
				delta = delta * pixelPerLine;
			} else if (deltaMode === 2) { // page
				if (isVertical) {
					delta = delta > 0 ? this.bounds.clientHeight : -this.bounds.clientHeight;
				} else if (isHorizontal) {
					delta = delta > 0 ? this.bounds.clientWidth : -this.bounds.clientWidth;
				} else {
					delta = 0;
				}
			}

			return delta;
		}

		// mouse event handler for JS scroller

		onMouseDown = (e) => {
			this.animator.stop();
			this.dragStart(e);
		}

		onMouseMove = (e) => {
			if (this.isDragging) {
				const {dx, dy} = this.drag(e);

				if (this.isFirstDragging) {
					this.doScrollStart();
					this.isFirstDragging = false;
				}
				this.scroll(this.scrollLeft - dx, this.scrollTop - dy);
			}
		}

		onMouseUp = (e) => {
			if (this.isDragging) {
				this.dragStop(e);

				if (!this.isFlicking()) {
					this.stop();
				} else {
					const
						d = this.dragInfo,
						target = this.animator.simulate(
							this.scrollLeft,
							this.scrollTop,
							calcVelocity(-d.dx, d.dt),
							calcVelocity(-d.dy, d.dt)
						);

					doc.activeElement.blur();
					this.childRef.setContainerDisabled(true);
					this.isScrollAnimationTargetAccumulated = false;
					this.start(target.targetX, target.targetY, true, true, target.duration);
				}
			}
		}

		onMouseLeave = (e) => {
			this.onMouseMove(e);
			this.onMouseUp();
		}

		onScroll = (e) => {
			this.scroll(e.target.scrollLeft, e.target.scrollTop, true);
		}

		onFocus = (e) => {
			// for virtuallist
			const
				item = e.target,
				index = Number.parseInt(item.getAttribute(dataIndexAttribute));

			if (!this.isDragging && !isNaN(index) && item !== this.lastFocusedItem && item === doc.activeElement && this.childRef.calculatePositionOnFocus) {
				const pos = this.childRef.calculatePositionOnFocus(index);
				if (pos) {
					if (pos.left !== this.scrollLeft || pos.top !== this.scrollTop) {
						this.start(pos.left, pos.top, (spotlightAnimationDuration > 0), false, spotlightAnimationDuration);
					}
					this.lastFocusedItem = item;
				}
			}
		}

		onKeyDown = (e) => {
			if (this.childRef.setSpotlightContainerRestrict) {
				const index = Number.parseInt(e.target.getAttribute(dataIndexAttribute));
				this.childRef.setSpotlightContainerRestrict(e.keyCode, index);
			}
		}

		onWheel = (e) => {
			e.preventDefault();
			if (!this.isDragging) {
				const
					isHorizontal = this.canScrollHorizontally(),
					isVertical = this.canScrollVertically(),
					delta = this.wheel(e, isHorizontal, isVertical);

				doc.activeElement.blur();
				this.childRef.setContainerDisabled(true);
				this.scrollToAccumulatedTarget(delta, isHorizontal, isVertical);
			}
		}

		onScrollbarBtnHandler = (orientation, direction) => {
			const
				isHorizontal = this.canScrollHorizontally() && orientation === 'horizontal',
				isVertical = this.canScrollVertically() && orientation === 'vertical';

			this.scrollToAccumulatedTarget(pixelPerScrollbarBtn * direction, isHorizontal, isVertical);
		}

		scrollToAccumulatedTarget = (delta, isHorizontal, isVertical) => {
			const silent = this.isScrollAnimationTargetAccumulated;

			if (!this.isScrollAnimationTargetAccumulated) {
				this.accumulatedTargetX = this.scrollLeft;
				this.accumulatedTargetY = this.scrollTop;
				this.isScrollAnimationTargetAccumulated = true;
			}

			if (isVertical) {
				this.accumulatedTargetY = R.clamp(0, this.bounds.maxTop, this.accumulatedTargetY + delta);
			} else if (isHorizontal) {
				this.accumulatedTargetX = R.clamp(0, this.bounds.maxLeft, this.accumulatedTargetX + delta);
			}

			this.start(this.accumulatedTargetX, this.accumulatedTargetY, true, silent);
		}

		// call scroll callbacks

		doScrollStart () {
			this.props.onScrollStart({scrollLeft: this.scrollLeft, scrollTop: this.scrollTop});
		}

		doScrolling () {
			this.props.onScroll({scrollLeft: this.scrollLeft, scrollTop: this.scrollTop});
		}

		doScrollStop () {
			this.props.onScrollStop({scrollLeft: this.scrollLeft, scrollTop: this.scrollTop});
		}

		// update scroll position

		setScrollLeft (v) {
			this.dirHorizontal = Math.sign(v - this.scrollLeft);
			this.scrollLeft = R.clamp(0, this.bounds.maxLeft, v);
			this.updateThumb(this.scrollbarHorizontalRef);
		}

		setScrollTop (v) {
			this.dirVertical = Math.sign(v - this.scrollTop);
			this.scrollTop = R.clamp(0, this.bounds.maxTop, v);
			this.updateThumb(this.scrollbarVerticalRef);
		}

		// scroll start/stop

		start (targetX, targetY, animate = true, silent = false, duration) {
			const {scrollLeft, scrollTop, bounds} = this;

			this.animator.stop();
			if (!silent) {
				this.doScrollStart();
			}

			targetX = R.clamp(0, this.bounds.maxLeft, targetX);
			targetY = R.clamp(0, this.bounds.maxTop, targetY);

			if ((bounds.maxLeft - targetX) < epsilon) {
				targetX = bounds.maxLeft;
			}
			if ((bounds.maxTop - targetY) < epsilon) {
				targetY = bounds.maxTop;
			}

			if (animate) {
				this.animator.start({
					sourceX: scrollLeft,
					sourceY: scrollTop,
					targetX,
					targetY,
					duration,
					cbScrollAnimationHandler: this.scrollAnimation
				});
			} else {
				this.scroll(targetX, targetY);
				this.stop();
			}
		}

		scrollAnimation = ({sourceX, sourceY}, {targetX, targetY, duration}, {calcPosX, calcPosY}) => {
			const
				curTimeAtTarget = duration,
				cbScrollAnimationRaf = (curTime) => {
					if (curTime < curTimeAtTarget) {
						// scrolling
						this.scroll(
							this.horizontalScrollability ? calcPosX(curTime) : sourceX,
							this.verticalScrollability ? calcPosY(curTime) : sourceY
						);
					} else {
						// scrolling to the target position before stopping
						this.scroll(targetX, targetY);
						this.stop();
					}
				};

			// animate
			this.animator.animate(cbScrollAnimationRaf);
		}

		scroll = (left, top, skipPositionContainer = false) => {
			if (left !== this.scrollLeft) {
				this.setScrollLeft(left);
			}
			if (top !== this.scrollTop) {
				this.setScrollTop(top);
			}

			this.childRef.setScrollPosition(this.scrollLeft, this.scrollTop, this.dirHorizontal, this.dirVertical, skipPositionContainer);
			this.doScrolling();
		}

		stop () {
			this.animator.stop();
			this.isScrollAnimationTargetAccumulated = false;
			this.childRef.setContainerDisabled(false);
			this.lastFocusedItem = null;
			this.doScrollStop();
		}

		// scrollTo API

		getPositionForScrollTo = (opt) => {
			const
				canScrollHorizontally = this.canScrollHorizontally(),
				canScrollVertically = this.canScrollVertically();
			let
				itemPos,
				left = null,
				top = null;

			if (opt instanceof Object) {
				if (opt.position instanceof Object) {
					if (canScrollHorizontally) {
						// We need '!=' to check if opt.potision.x is null or undefined
						left = opt.position.x != null ? opt.position.x : this.scrollLeft;
					}
					if (canScrollVertically) {
						// We need '!=' to check if opt.potision.y is null or undefined
						top = opt.position.y != null ? opt.position.y : this.scrollTop;
					}
				} else if (typeof opt.align === 'string') {
					if (canScrollHorizontally) {
						if (opt.align.includes('left')) {
							left = 0;
						} else if (opt.align.includes('right')) {
							left = this.bounds.maxLeft;
						}
					}
					if (canScrollVertically) {
						if (opt.align.includes('top')) {
							top = 0;
						} else if (opt.align.includes('bottom')) {
							top = this.bounds.maxTop;
						}
					}
				} else {
					if (typeof opt.index === 'number') {
						itemPos = this.childRef.getItemPosition(opt.index);
					} else if (opt.node instanceof Object) {
						if (opt.node.nodeType === 1) {
							itemPos = this.childRef.getScrollPos(opt.node);
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
			let {left, top} = this.getPositionForScrollTo(opt);

			if (left !== null || top !== null) {
				this.start((left !== null) ? left : this.scrollLet, (top !== null) ? top : this.scrollTop, opt.animate);
			}
		}

		// scroll bar

		canScrollHorizontally = () => (
			this.horizontalScrollability && (this.bounds.scrollWidth > this.bounds.clientWidth) && !isNaN(this.bounds.scrollWidth)
		)

		canScrollVertically = () => (
			this.verticalScrollability && (this.bounds.scrollHeight > this.bounds.clientHeight) && !isNaN(this.bounds.scrollHeight)
		)

		shouldShowHorizontalScrollbar = () => (
			this.horizontalScrollability && (this.isChildList || (this.bounds.scrollWidth > this.bounds.clientWidth) && !isNaN(this.bounds.scrollWidth))
		)

		shouldShowVerticalScrollbar = () => (
			this.verticalScrollability && (this.isChildList || (this.bounds.scrollHeight > this.bounds.clientHeight) && !isNaN(this.bounds.scrollHeight))
		)

		updateThumb (scrollbarRef) {
			if (this.props.positioningOption !== 'byBrowser' && this.renderScrollbars) {
				const isVisible = scrollbarRef.props.isVertical ? this.canScrollVertically : this.canScrollHorizontally;
				if (isVisible()) {
					scrollbarRef.showThumb();
					scrollbarRef.update({
						...this.bounds,
						scrollLeft: this.scrollLeft,
						scrollTop: this.scrollTop
					});
				}
			}
		}

		syncClientSize = (isHorizontalScrollbarVisible, isVerticalScrollbarVisible) => {
			const
				{positioningOption} = this.props,
				{bounds, isChildList} = this;

			if (isChildList) {
				if (positioningOption !== 'byBrowser') {
					const {precalculatedClientSize} = this;

					if (this.renderScrollbars) {
						bounds.clientWidth = isVerticalScrollbarVisible ? precalculatedClientSize.widthWithScrollbars : precalculatedClientSize.widthWithoutScrollbars;
						bounds.clientHeight = isHorizontalScrollbarVisible ? precalculatedClientSize.heightWithScrollbars : precalculatedClientSize.heightWithoutScrollbars;
					} else {
						bounds.clientWidth = precalculatedClientSize.widthWithoutScrollbars;
						bounds.clientHeight = precalculatedClientSize.heightWithoutScrollbars;
					}
				} else {
					const node = this.childRef.getContainerNode(positioningOption);

					bounds.clientWidth = node.clientWidth;
					bounds.clientHeight = node.clientHeight;
				}
			}
		}

		updateStateOfScrollbars = (isHorizontalScrollbarVisible, isVerticalScrollbarVisible) => {
			// eslint-disable-next-line react/no-did-mount-set-state
			this.setState({
				isHorizontalScrollbarVisible: isHorizontalScrollbarVisible,
				isVerticalScrollbarVisible: isVerticalScrollbarVisible
			});

			if (this.props.positioningOption !== 'byBrowser') {
				if (isHorizontalScrollbarVisible && this.scrollbarHorizontalRef) {
					this.scrollbarHorizontalRef.update({
						...this.bounds,
						scrollLeft: this.scrollLeft,
						scrollTop: this.scrollTop
					});
				}

				if (isVerticalScrollbarVisible && this.scrollbarVerticalRef) {
					this.scrollbarVerticalRef.update({
						...this.bounds,
						scrollLeft: this.scrollLeft,
						scrollTop: this.scrollTop
					});
				}
			}
		}

		syncWithScrollbarsVisibility = (shouldUpdate, ...rest) => {
			this.syncClientSize(...rest);
			if (shouldUpdate) {
				this.updateStateOfScrollbars(...rest);
			}
		}

		calculateClientSize () {
			if (this.childRef.getContainerNode) {
				const
					containerStyle = getComputedStyle(this.containerRef),
					childStyle = getComputedStyle(this.childRef.getContainerNode(this.props.positioningOption));

				this.precalculatedClientSize = {
					widthWithoutScrollbars: Number.parseInt(containerStyle.getPropertyValue('width'), 10),
					heightWithoutScrollbars: Number.parseInt(containerStyle.getPropertyValue('height'), 10),
					widthWithScrollbars: Number.parseInt(childStyle.getPropertyValue('width'), 10),
					heightWithScrollbars: Number.parseInt(childStyle.getPropertyValue('height'), 10)
				}
			}
		}

		updateBoundsAndScrollability () {
			this.bounds = this.childRef.getScrollBounds();
			this.horizontalScrollability = this.childRef.isHorizontal();
			this.verticalScrollability = this.childRef.isVertical();
		}

		// component life cycle

		componentDidMount () {
			this.isChildList = this.childRef.isListComponent;
			this.renderScrollbars = !this.props.hideScrollbars;

			// The order of updateBoundsAndScrollability() and calculateClientSize() is important
			this.updateBoundsAndScrollability();
			if (this.props.positioningOption !== 'byBrowser' && this.isChildList) {
				this.calculateClientSize();
			}
			this.syncWithScrollbarsVisibility(true, this.shouldShowHorizontalScrollbar(), this.shouldShowVerticalScrollbar());
		}

		componentWillReceiveProps (nextProps) {
			if (this.props.hideScrollbars !== nextProps.hideScrollbars) {
				this.renderScrollbars = !nextProps.hideScrollbars;
				this.syncWithScrollbarsVisibility(this.renderScrollbars, this.canScrollHorizontally(), this.canScrollVertically());
			}
		}

		componentDidUpdate () {
			// double check to see if we can add/remove scrollbar one more time.
			this.updateBoundsAndScrollability();
			if (this.renderScrollbars) {
				const
					{isHorizontalScrollbarVisible, isVerticalScrollbarVisible} = this.state,
					curHorizontalScrollbarVisible = this.canScrollHorizontally(),
					curVerticalScrollbarVisible = this.canScrollVertically(),
					shouldUpdate = (
						curHorizontalScrollbarVisible !== isHorizontalScrollbarVisible ||
						curVerticalScrollbarVisible !== isVerticalScrollbarVisible
					);
				this.syncWithScrollbarsVisibility(shouldUpdate, curHorizontalScrollbarVisible, curVerticalScrollbarVisible);
			}
		}

		componentWillUnmount () {
			// Before call cancelAnimationFrame, you must send scrollStop Event.
			this.animator.stop();
		}

		// render

		initRef (prop) {
			return (ref) => {
				this[prop] = ref;
			};
		}

		initScrollbarBtnHandler = (orientation, direction) => () => {
			return this.onScrollbarBtnHandler(orientation, direction);
		}

		render () {
			const
				props = Object.assign({}, this.props),
				{className, hideScrollbars, positioningOption, style} = this.props,
				{isHorizontalScrollbarVisible, isVerticalScrollbarVisible} = this.state,
				{bounds, isChildList} = this,
				scrollableClasses = classNames(
					css.scrollable,
					hideScrollbars ? css.scrollableHiddenScrollbars : null,
					isHorizontalScrollbarVisible ? null : css.takeAvailableSpaceForVertical,
					isVerticalScrollbarVisible ? null : css.takeAvailableSpaceForHorizontal,
					className
				),
				isBothScrollable = isHorizontalScrollbarVisible && isVerticalScrollbarVisible,
				verticalScrollbarClassnames = isVerticalScrollbarVisible ? (!isBothScrollable && css.onlyVerticalScrollbarNeeded) : css.verticalScrollbarDisabled,
				horizontalScrollbarClassnames = isHorizontalScrollbarVisible ? (!isBothScrollable && css.onlyHorizontalScrollbarNeeded) : css.horizontalScrollbarDisabled;

			props.cbScrollTo = this.scrollTo;
			if (isChildList) {
				props.cbUpdateScrollbars = this.updateStateOfScrollbars;
				props.clientWidth = bounds.clientWidth;
				props.clientHeight = bounds.clientHeight;
				props.precalculatedClientSize = this.precalculatedClientSize;
			}

			delete props.className;
			delete props.style;

			return (
				(positioningOption !== 'byBrowser' && this.renderScrollbars) ? (
					<div ref={this.initContainerRef} className={scrollableClasses} style={style}>
						<Wrapped {...props} {...this.eventHandlers} ref={this.initChildRef} className={css.container} />
						<Scrollbar
							className={verticalScrollbarClassnames}
							{...this.verticalScrollbarProps}
						/>
						<Scrollbar
							className={horizontalScrollbarClassnames}
							{...this.horizontalScrollbarProps}
						/>
					</div>
				) : <Wrapped {...props} {...this.eventHandlers} ref={this.initChildRef} className={scrollableClasses} style={style} />
			);
		}
	};
});

export default ScrollableHoC;
export {dataIndexAttribute, ScrollableHoC as Scrollable};
