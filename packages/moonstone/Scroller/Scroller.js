/**
 * Exports the {@link moonstone/Scroller.Scroller} and
 * {@link moonstone/Scroller.ScrollerBase} components.
 * The default export is {@link moonstone/Scroller.Scroller}.
 *
 * @module moonstone/Scroller
 */

import classNames from 'classnames';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

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
	static displayName = 'Scroller'

	static propTypes = /** @lends moonstone/Scroller.ScrollerBase.prototype */ {
		children: PropTypes.node.isRequired,

		/**
		 * Specifies how to horizontally scroll. Acceptable values are `'auto'`, `'default'` ,
		 * `'hidden'`, and `'scroll'`.
		 *
		 * @type {String}
		 * @default 'auto'
		 * @public
		 */
		horizontal: PropTypes.oneOf(['auto', 'hidden', 'scroll']),

		/**
		 * Specifies how to vertically scroll. Acceptable values are `'auto'`, `'auto'` ,
		 * `'hidden'`, and `'scroll'`.
		 *
		 * @type {String}
		 * @default 'auto'
		 * @public
		 */
		vertical: PropTypes.oneOf(['auto', 'hidden', 'scroll'])
	}

	static contextTypes = contextTypes

	static defaultProps = {
		horizontal: 'auto',
		vertical: 'auto'
	}

	componentDidMount () {
		this.calculateMetrics();
	}

	componentDidUpdate () {
		this.calculateMetrics();
	}

	scrollBounds = {
		clientWidth: 0,
		clientHeight: 0,
		scrollWidth: 0,
		scrollHeight: 0,
		maxLeft: 0,
		maxTop: 0
	}

	scrollPos = {
		top: 0,
		left: 0
	}

	getScrollBounds = () => this.scrollBounds

	setScrollPosition (valX, valY) {
		const
			node = this.containerRef,
			rtl = this.context.rtl;

		if (this.isVertical()) {
			node.scrollTop = valY;
			this.scrollPos.top = valY;
		}
		if (this.isHorizontal()) {
			node.scrollLeft = rtl ? (this.scrollBounds.maxLeft - valX) : valX;
			this.scrollPos.left = valX;
		}
	}

	getNodePosition = (node) => {
		const
			{left: nodeLeft, top: nodeTop, height: nodeHeight, width: nodeWidth} = node.getBoundingClientRect(),
			{left: containerLeft, top: containerTop} = this.containerRef.getBoundingClientRect(),
			{scrollLeft, scrollTop} = this.containerRef,
			left = this.isHorizontal() ? (scrollLeft + nodeLeft - containerLeft) : null,
			top = this.isVertical() ? (scrollTop + nodeTop - containerTop) : null;

		return {
			left,
			top,
			width: nodeWidth,
			height: nodeHeight
		};
	}

	calculatePositionOnFocus = (focusedItem) => {
		const {left: itemLeft, top: itemTop, width: itemWidth, height: itemHeight} = this.getNodePosition(focusedItem);

		if (this.isVertical()) {
			const
				{clientHeight} = this.scrollBounds,
				currentScrollTop = this.scrollPos.top;

			if (itemTop + itemHeight > (clientHeight + currentScrollTop)) {
				this.scrollPos.top += (itemTop + itemHeight) - (clientHeight + currentScrollTop);
			} else if (itemTop < currentScrollTop) {
				this.scrollPos.top += itemTop - currentScrollTop;
			}

		}

		if (this.isHorizontal()) {
			const
				{clientWidth} = this.scrollBounds,
				rtlDirection = this.context.rtl ? -1 : 1,
				currentScrollLeft = this.scrollPos.left * rtlDirection;

			if (this.context.rtl && itemLeft > clientWidth) {
				// For RTL, and if the `focusedItem` is bigger than `this.scrollBounds.clientWidth`, keep
				// the scroller to the right.
				this.scrollPos.left -= itemLeft;
			} else if (itemLeft + itemWidth > (clientWidth + currentScrollLeft) && itemWidth < clientWidth) {
				// If focus is moved to an element outside of view area (to the right), scroller will move
				// to the right just enough to show the current `focusedItem`. This does not apply to
				// `focusedItem` that has a width that is bigger than `this.scrollBounds.clientWidth`.
				this.scrollPos.left += rtlDirection * ((itemLeft + itemWidth) - (clientWidth + currentScrollLeft));
			} else if (itemLeft < currentScrollLeft) {
				// If focus is outside of the view area to the left, move scroller to the left accordingly.
				this.scrollPos.left += rtlDirection * (itemLeft - currentScrollLeft);
			}
		}

		return this.scrollPos;
	}

	focusOnNode = (node) => {
		if (node) {
			// setPointerMode to false since Spotlight prevents programmatically changing focus while in pointer mode
			Spotlight.setPointerMode(false);
			Spotlight.focus(node);
		}
	}

	isVertical = () => (this.props.vertical !== 'hidden')

	isHorizontal = () => (this.props.horizontal !== 'hidden')

	calculateMetrics () {
		const
			{scrollBounds} = this,
			{scrollWidth, scrollHeight, clientWidth, clientHeight} = this.containerRef;
		scrollBounds.scrollWidth = scrollWidth;
		scrollBounds.scrollHeight = scrollHeight;
		scrollBounds.clientWidth = clientWidth;
		scrollBounds.clientHeight = clientHeight;
		scrollBounds.maxLeft = Math.max(0, scrollWidth - clientWidth);
		scrollBounds.maxTop = Math.max(0, scrollHeight - clientHeight);
	}

	setContainerDisabled = (bool) => {
		if (this.containerRef) {
			this.containerRef.setAttribute(dataContainerDisabledAttribute, bool);
		}
	}

	initRef = (ref) => {
		this.containerRef = ref;
	}

	render () {
		const
			{className, style} = this.props,
			props = Object.assign({}, this.props),
			mergedStyle = Object.assign({}, style, {
				overflowX: props.horizontal,
				overflowY: props.vertical
			});

		delete props.cbScrollTo;
		delete props.className;
		delete props.horizontal;
		delete props.style;
		delete props.vertical;

		return (
			<div {...props} ref={this.initRef} className={classNames(className, css.hideNativeScrollbar)} style={mergedStyle} />
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
const Scroller = SpotlightContainerDecorator(
	{restrict: 'self-first'},
	Scrollable(
		ScrollerBase
	)
);

export default Scroller;
export {Scroller, ScrollerBase};
