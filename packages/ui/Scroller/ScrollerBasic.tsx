import {platform} from '@enact/core/platform';
import classNames from 'classnames';
import {Component, CSSProperties, ReactElement, RefObject} from 'react';

import {ScrollToFunction} from './Scroller';

import css from './Scroller.module.less';

interface ScrollerBasicProps {
	/**
	 * Callback method of scrollTo.
	 * Normally, `useScroll` should set this value.
	 *
	 * @type {Function}
	 * @private
	 */
	cbScrollTo: ScrollToFunction;

	/**
	 * Prop to check context value if the horizontal Scrollbar exists or not.
	 *
	 * @type {Boolean}
	 * @private
	 */
	isHorizontalScrollbarVisible?: boolean;

	/**
	 * Prop to check context value if the vertical Scrollbar exists or not.
	 *
	 * @type {Boolean}
	 * @private
	 */
	isVerticalScrollbarVisible: boolean;

	/**
	 * `true` if RTL, `false` if LTR.
	 *
	 * @type {Boolean}
	 * @private
	 */
	rtl: boolean;

	/**
	 * Indicates whether the scroll container should perform a dangerously permissive
	 * DOM containment check.
	 *
	 * @type {Boolean}
	 * @private
	 */
	scrollContainerContainsDangerously?: boolean;

	/**
	 * Ref for scroll content
	 *
	 * @type {Object}
	 * @private
	 */
	scrollContentRef: RefObject<HTMLDivElement>;

	/**
	 * Specifies the mechanism used to scroll the content.
	 *
	 * Valid values are:
	 * * `'translate'`, and
	 * * `'native'`.
	 *
	 * @type {String}
	 * @public
	 */
	scrollMode?: 'translate' | 'native';

	/**
	 * Callback function to pass the scroll content handle up to the theme or higher-order components.
	 *
	 * @type {Function}
	 * @private
	 */
	setThemeScrollContentHandle?: (handle: unknown) => void;

	/**
	 * Direction of the scroller.
	 *
	 * Valid values are:
	 * * `'both'`,
	 * * `'horizontal'`, and
	 * * `'vertical'`.
	 *
	 * @type {String}
	 * @default 'both'
	 * @public
	 */
	direction: 'both' | 'horizontal' | 'vertical';

	/**
	 * Customizes the component by mapping the supplied class name to its root element.
	 *
	 * @type {String}
	 * @public
	 */
	className?: string;

	/**
	 * Customizes the component by applying the supplied styles to its root element.
	 *
	 * @type {Object}
	 * @public
	 */
	style?: CSSProperties;

	/**
	 * The contents to be rendered within the scroller.
	 *
	 * @type {Element}
	 * @public
	 */
	children: ReactElement;
}

/**
 * An unstyled base scroller component.
 *
 * @class ScrollerBasic
 * @memberof ui/Scroller
 * @ui
 * @public
 */
class ScrollerBasic extends Component<ScrollerBasicProps> {
	static displayName = 'ui:ScrollerBasic';

	componentDidMount () {
		this.calculateMetrics();
	}

	componentDidUpdate (prevProps: ScrollerBasicProps) {
		this.calculateMetrics();
		if (this.props.isVerticalScrollbarVisible && !prevProps.isVerticalScrollbarVisible) {
			this.forceUpdate();
		}
	}

	scrollAnimationId: number | null = null;

	scrollBounds = {
		clientWidth: 0,
		clientHeight: 0,
		scrollWidth: 0,
		scrollHeight: 0,
		maxLeft: 0,
		maxTop: 0
	};

	scrollPos = {
		top: 0,
		left: 0
	};

	getScrollBounds = () => this.scrollBounds;

	getRtlPositionX = (x: number) => {
		if (this.props.rtl) {
			return (platform.chrome && platform.chrome < 85) ? this.scrollBounds.maxLeft - x : -x; // Chrome lower than 85 has a bug with RTL scrollLeft
		}
		return x;
	};

	// scrollMode 'translate'
	setScrollPosition (x: number, y: number) {
		const node = this.props.scrollContentRef.current;

		if (!node) return;

		if (this.isVertical()) {
			node.scrollTop = y;
			this.scrollPos.top = y;
		}
		if (this.isHorizontal()) {
			node.scrollLeft = this.getRtlPositionX(x);
			this.scrollPos.left = x;
		}
	}

	// scrollMode 'native'
	scrollToPosition (left: number, top: number, behavior: 'smooth' | 'instant', repeat: boolean) {
		const node = this.props.scrollContentRef.current;
		const smoothBehavior = behavior === 'smooth';

		if (!node) return;

		if (platform.chrome && smoothBehavior && repeat) {
			this.animateScroll(this.getRtlPositionX(left), top, node);
		} else {
			if (this.scrollAnimationId) {
				window.cancelAnimationFrame(this.scrollAnimationId);
				this.scrollAnimationId = null;
			}
			node.scrollTo({left: this.getRtlPositionX(left), top, behavior});
		}
	}

	/**
	 * Programmatically animates the native scroll position of `node` toward the target `left`/`top`
	 * offsets using `requestAnimationFrame`. It computes the scroll direction on each axis, then repeatedly
	 * calls `scrollBy` with a dynamic step (10% of remaining distance, minimum 8px) until the target is reached
	 * or 1s has elapsed. Used as a Chrome fallback when repeating a smooth scroll.
	 */
	animateScroll (left: number, top: number, node: HTMLElement) {
		const directionX = Math.sign(left - node.scrollLeft);
		const directionY = Math.sign(top - node.scrollTop);
		const startTime = performance.now();

		const animateScroll = (currentTime: number) => {
			const elapsed = (currentTime - startTime) / 1000;
			const scrollLeft = directionX > 0 ? node.scrollLeft < left : node.scrollLeft > left;
			const scrollTop = directionY > 0 ? node.scrollTop < top : node.scrollTop > top;

			// Stop animating if the target is reached or 1s has elapsed since animation started
			if ((!scrollTop && !scrollLeft) || elapsed > 1) {
				// Fallback: if timed out before reaching target, jump there with smooth scroll
				if (elapsed > 1 && (node.scrollLeft !== left || node.scrollTop !== top)) {
					node.scrollTo({top, left, behavior: 'smooth'});
				}
				return;
			}

			// Clamp the step to the remaining distance so the final frame lands exactly on the target
			// instead of overshooting by up to the minimum step (8px), which would push a focused item
			// anchored to the start edge (e.g. `stickTo="start"`) past that edge and clip it.
			const remainingX = Math.abs(left - node.scrollLeft);
			const remainingY = Math.abs(top - node.scrollTop);
			const horizontalScrollFactor = Math.min(Math.max(remainingX * 0.1, 8), remainingX);
			const verticalScrollFactor = Math.min(Math.max(remainingY * 0.1, 8), remainingY);

			node.scrollBy({top: directionY * verticalScrollFactor, left: directionX * horizontalScrollFactor, behavior: 'instant'});
			this.scrollAnimationId = window.requestAnimationFrame(animateScroll);
		};

		this.scrollAnimationId = window.requestAnimationFrame(animateScroll);
	}

	// scrollMode 'native'
	didScroll (x: number, y: number) {
		this.scrollPos.left = x;
		this.scrollPos.top = y;
	}

	getNodePosition = (node: HTMLElement) => {
		const
			{left: nodeLeft, top: nodeTop, height: nodeHeight, width: nodeWidth} = node.getBoundingClientRect(),
			{left: containerLeft, top: containerTop} = this.props.scrollContentRef.current.getBoundingClientRect(),
			{scrollLeft, scrollTop} = this.props.scrollContentRef.current,
			left = this.isHorizontal() ? (scrollLeft + nodeLeft - containerLeft) : null,
			top = this.isVertical() ? (scrollTop + nodeTop - containerTop) : null;

		return {
			left,
			top,
			width: nodeWidth,
			height: nodeHeight
		};
	};

	isVertical = () => {
		return (this.props.direction !== 'horizontal');
	};

	isHorizontal = () => {
		return (this.props.direction !== 'vertical');
	};

	calculateMetrics () {
		const
			{scrollBounds} = this,
			{scrollWidth, scrollHeight, clientWidth, clientHeight} = this.props.scrollContentRef.current;

		scrollBounds.scrollWidth = scrollWidth;
		scrollBounds.scrollHeight = scrollHeight;
		scrollBounds.clientWidth = clientWidth;
		scrollBounds.clientHeight = clientHeight;
		scrollBounds.maxLeft = Math.max(0, scrollWidth - clientWidth);
		scrollBounds.maxTop = Math.max(0, scrollHeight - clientHeight);
	}

	syncClientSize = () => {
		const node = this.props.scrollContentRef.current;

		if (!node) {
			return false;
		}

		const
			{clientWidth, clientHeight} = node,
			{scrollBounds} = this;

		if (clientWidth !== scrollBounds.clientWidth || clientHeight !== scrollBounds.clientHeight) {
			this.calculateMetrics();
			return true;
		}

		return false;
	};

	render () {
		const
			{
				cbScrollTo,
				className,
				direction,
				isVerticalScrollbarVisible,
				rtl,
				scrollContentRef,
				style,
				...rest
			} = this.props,
			mergedStyle = Object.assign({}, style, {
				overflowX: this.isHorizontal() ? 'auto' : 'hidden',
				overflowY: this.isVertical() ? 'auto' : 'hidden'
			});

		delete rest.isHorizontalScrollbarVisible;
		delete rest.scrollContainerContainsDangerously;
		delete rest.scrollMode;
		delete rest.setThemeScrollContentHandle;

		return (
			<div
				{...rest}
				className={classNames(className, css.scroller)}
				ref={scrollContentRef}
				style={mergedStyle}
			/>
		);
	}
}

export default ScrollerBasic;
export {
	ScrollerBasic
};
