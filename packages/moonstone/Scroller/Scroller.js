/**
 * Exports the {@link moonstone/Scroller.Scroller} and {@link moonstone/Scroller.ScrollerBase}
 * components. The default export is {@link moonstone/Scroller.Scroller}.
 *
 * @module moonstone/Scroller
 */

import classNames from 'classnames';
import React, {Component, PropTypes} from 'react';
import {SpotlightContainerDecorator} from '@enact/spotlight';

import css from './Scroller.less';
import Scrollable from './Scrollable';

const dataContainerDisabledAttribute = 'data-container-disabled';

/**
 * {@link moonstone/Scroller.ScrollerBase} is a base component for Scroller.
 * In most circumstances, you will want to use the SpotlightContainerDecorator and Scrollable version:
 * {@link moonstone/Scroller.Scroller}
 *
 * @class ScrollerBase
 * @memberof moonstone/Scroller
 * @ui
 * @public
 */
class ScrollerBase extends Component {
	static propTypes = /** @lends moonstone/Scroller.ScrollerBase.prototype */ {
		children: PropTypes.node.isRequired,

		className: PropTypes.string,

		/*
		 * Specifies how to horizontally scroll. Acceptable values are `'auto'`, `'default'` ,
		 * `'hidden'`, and `'scroll'`.
		 *
		 * @type {String}
		 * @default 'auto'
		 * @public
		 */
		horizontal: PropTypes.oneOf(['auto', 'hidden', 'scroll']),

		style: PropTypes.object,

		/*
		 * Specifies how to vertically scroll. Acceptable values are `'auto'`, `'auto'` ,
		 * `'hidden'`, and `'scroll'`.
		 *
		 * @type {String}
		 * @default 'auto'
		 * @public
		 */
		vertical: PropTypes.oneOf(['auto', 'hidden', 'scroll'])
	}

	static defaultProps = {
		horizontal: 'auto',
		vertical: 'auto'
	}

	scrollBounds = {
		clientWidth: 0,
		clientHeight: 0,
		scrollWidth: 0,
		scrollHeight: 0,
		maxLeft: 0,
		maxTop: 0
	}

	getScrollBounds = () => this.scrollBounds

	setScrollPosition (valX, valY) {
		const node = this.node;

		if (this.isVertical()) {
			node.scrollTop = valY;
		}
		if (this.isHorizontal()) {
			node.scrollLeft = valX;
		}
	}

	getScrollPos = (item) => {
		let node = item;
		const
			bounds = {
				left: 0,
				top: 0,
				width: node.offsetWidth,
				height: node.offsetHeight
			};

		while (node && node.parentNode && node.id !== this.node.id) {
			bounds.left += node.offsetLeft;
			bounds.top += node.offsetTop;
			node = node.parentNode;
		}

		return bounds;
	}

	isVertical = () => (this.props.vertical !== 'hidden')

	isHorizontal = () => (this.props.horizontal !== 'hidden')

	calculateMetrics () {
		const
			{scrollBounds} = this,
			{scrollWidth, scrollHeight, clientWidth, clientHeight} = this.node;
		scrollBounds.scrollWidth = scrollWidth;
		scrollBounds.scrollHeight = scrollHeight;
		scrollBounds.clientWidth = clientWidth;
		scrollBounds.clientHeight = clientHeight;
		scrollBounds.maxLeft = Math.max(0, scrollWidth - clientWidth);
		scrollBounds.maxTop = Math.max(0, scrollHeight - clientHeight);
	}

	setContainerDisabled = (bool) => {
		if (this.node) {
			this.node.setAttribute(dataContainerDisabledAttribute, bool);
		}
	}

	componentDidMount () {
		this.calculateMetrics();
	}

	componentDidUpdate () {
		this.calculateMetrics();
	}

	initRef = (ref) => {
		this.node = ref;
	}

	render () {
		const
			{className, style} = this.props,
			props = Object.assign({}, this.props),
			mergedStyle = Object.assign({}, style, {
				overflowX: props.horizontal,
				overflowY: props.vertical
			}),
			hideNativeScrollbar = !props.hideScrollbars ? css.hideNativeScrollbar : null;

		delete props.cbScrollTo;
		delete props.className;
		delete props.hideScrollbars;
		delete props.horizontal;
		delete props.onScrolling;
		delete props.onScrollStart;
		delete props.onScrollStop;
		delete props.positioningOption;
		delete props.style;
		delete props.vertical;

		return (
			<div {...props} ref={this.initRef} className={classNames(className, hideNativeScrollbar)} style={mergedStyle} />
		);
	}
}

/**
 * {@link moonstone/Scroller.Scroller} is a Scroller with Moonstone styling,
 * SpotlightContainerDecorator and Scrollable applied.
 *
 * Usage:
 * ```
 * <Scroller>Scroll me.</Scroller>
 * ```
 *
 * @class Scroller
 * @memberof moonstone/Scroller
 * @mixes moonstone/Scroller.Scrollable
 * @mixes spotlight.SpotlightContainerDecorator
 * @see moonstone/Scroller.ScrollerBase
 * @ui
 * @public
 */
const Scroller = SpotlightContainerDecorator(Scrollable(ScrollerBase));

export default Scroller;
export {Scroller, ScrollerBase};
