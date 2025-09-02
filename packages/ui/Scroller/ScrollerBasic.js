import EnactPropTypes from '@enact/core/internal/prop-types';
import {platform} from '@enact/core/platform';
import {perfNow} from '@enact/core/util';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {Component} from 'react';

import css from './Scroller.module.less';

/**
 * An unstyled base scroller component.
 *
 * @class ScrollerBasic
 * @memberof ui/Scroller
 * @ui
 * @public
 */
class ScrollerBasic extends Component {
	static displayName = 'ui:ScrollerBasic';

	static propTypes = /** @lends ui/Scroller.ScrollerBasic.prototype */ {
		children: PropTypes.node.isRequired,

		/**
		 * Callback method of scrollTo.
		 * Normally, `useScroll` should set this value.
		 *
		 * @type {Function}
		 * @private
		 */
		cbScrollTo: PropTypes.func,

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
		direction: PropTypes.oneOf(['both', 'horizontal', 'vertical']),

		/**
		 * Prop to check context value if Scrollbar exists or not.
		 *
		 * @type {Boolean}
		 * @private
		 */
		isVerticalScrollbarVisible: PropTypes.bool,

		/**
		 * `true` if RTL, `false` if LTR.
		 *
		 * @type {Boolean}
		 * @private
		 */
		rtl: PropTypes.bool,

		/**
		 * Ref for scroll content
		 *
		 * @type {Object|Function}
		 * @private
		 */
		scrollContentRef: EnactPropTypes.ref
	};

	componentDidMount () {
		this.calculateMetrics();
	}

	componentDidUpdate (prevProps) {
		this.calculateMetrics();
		if (this.props.isVerticalScrollbarVisible && !prevProps.isVerticalScrollbarVisible) {
			this.forceUpdate();
		}
	}

	scrollAnimationId = null;

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

	getRtlPositionX = (x) => {
		if (this.props.rtl) {
			return (platform.chrome < 85) ? this.scrollBounds.maxLeft - x : -x; // Chrome lower than 85 has a bug with RTL scrollLeft
		}
		return x;
	};

	// scrollMode 'translate'
	setScrollPosition (x, y) {
		const node = this.props.scrollContentRef.current;

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
	scrollToPosition (left, top, behavior) {
		const node = this.props.scrollContentRef.current;

		if (platform.chrome && behavior === 'smooth') {
			this.animateScroll(this.getRtlPositionX(left), top, node);
		}

		node.scrollTo({left: this.getRtlPositionX(left), top, behavior});
	}

	// scrollMode 'native'
	animateScroll (left, top, node) {
		const {scrollLeft, scrollTop} = node;
		const {maxLeft, maxTop} = this.scrollBounds;

		if (this.scrollAnimationId) {
			window.cancelAnimationFrame(this.scrollAnimationId);
			this.scrollAnimationId = null;
		}

		const animationDuration = 1000;
		const startTime = perfNow();
		const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

		const animateScroll = (now) => {
			const elapsed = (now - startTime);
			const time = Math.min(animationDuration, elapsed);
			const e = easeOutQuart(time / animationDuration);

			const currX = Math.round(scrollLeft + (left - scrollLeft) * e);
			const currY = Math.round(scrollTop + (top - scrollTop) * e);

			if ((left < 0 || top < 0 || (maxLeft > 0 && left > maxLeft) || (maxTop > 0 && top > maxTop))) {
				window.cancelAnimationFrame(this.scrollAnimationId);
			} else if (time < animationDuration) {
				node.scrollTo({left: currX, top: currY});
				this.scrollAnimationId = window.requestAnimationFrame(animateScroll);
			}
		};

		this.scrollAnimationId = window.requestAnimationFrame(animateScroll);
	}

	// scrollMode 'native'
	didScroll (x, y) {
		this.scrollPos.left = x;
		this.scrollPos.top = y;
	}

	getNodePosition = (node) => {
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
			{className, style, ...rest} = this.props,
			mergedStyle = Object.assign({}, style, {
				overflowX: this.isHorizontal() ? 'auto' : 'hidden',
				overflowY: this.isVertical() ? 'auto' : 'hidden'
			});

		delete rest.cbScrollTo;
		delete rest.direction;
		delete rest.isHorizontalScrollbarVisible;
		delete rest.isVerticalScrollbarVisible;
		delete rest.rtl;
		delete rest.scrollContainerContainsDangerously;
		delete rest.scrollContentRef;
		delete rest.scrollMode;
		delete rest.setThemeScrollContentHandle;

		return (
			<div
				{...rest}
				className={classNames(className, css.scroller)}
				ref={this.props.scrollContentRef}
				style={mergedStyle}
			/>
		);
	}
}

export default ScrollerBasic;
export {
	ScrollerBasic
};
