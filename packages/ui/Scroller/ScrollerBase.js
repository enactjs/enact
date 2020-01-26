import classNames from 'classnames';
import {platform} from '@enact/core/platform';
import PropTypes from 'prop-types';
import React, {useEffect, useRef} from 'react';

import useForceUpdate from '../Scrollable/useForceUpdate';

import css from './Scroller.module.less';

/**
 * An unstyled base scroller component.
 *
 * In most circumstances, you will want to use the Scrollable version.
 *
 * @class ScrollerBase
 * @memberof ui/Scroller
 * @ui
 * @public
 */
const ScrollerBase = (props) => {
	// constructor (props) {
	const {uiChildContainerRef} = props;
	const [, forceUpdate] = useForceUpdate();

	useEffect(() => {
		// componentDidUpdate
		// TODO: Check this code is still needed.  This code introduced from #1618. (ahn)
		forceUpdate();
	}, [props.isVerticalScrollbarVisible]);

	useEffect(() => {
		// componentDidUpdate
		calculateMetrics();
	});

	// Instance variables
	const variables = useRef({
		scrollBounds : {
			clientHeight: 0,
			clientWidth: 0,
			maxLeft: 0,
			maxTop: 0,
			scrollHeight: 0,
			scrollWidth: 0
		},
		scrollPos: {
			left: 0,
			top: 0
		}
	});

	useEffect(() => {
		props.setUiChildAdapter({
			didScroll,
			getNodePosition,
			getScrollBounds,
			scrollToPosition,
			setScrollPosition
		});
	}, []);

	function getScrollBounds () {
		return variables.current.scrollBounds;
	}

	function getRtlPositionX (x) {
		if (props.rtl) {
			return (platform.ios || platform.safari) ? -x : variables.current.scrollBounds.maxLeft - x;
		}
		return x;
	}

	// for Scrollable
	function setScrollPosition (x, y) {
		const node = uiChildContainerRef.current;

		if (isVertical()) {
			node.scrollTop = y;
			variables.current.scrollPos.top = y;
		}
		if (isHorizontal()) {
			node.scrollLeft = getRtlPositionX(x);
			variables.current.scrollPos.left = x;
		}
	}

	// for native Scrollable
	function scrollToPosition (x, y) {
		uiChildContainerRef.current.scrollTo(getRtlPositionX(x), y);
	}

	// for native Scrollable
	function didScroll (x, y) {
		variables.current.scrollPos.left = x;
		variables.current.scrollPos.top = y;
	}

	function getNodePosition (node) {
		const
			{left: nodeLeft, top: nodeTop, height: nodeHeight, width: nodeWidth} = node.getBoundingClientRect(),
			{left: containerLeft, top: containerTop} = uiChildContainerRef.current.getBoundingClientRect(),
			{scrollLeft, scrollTop} = uiChildContainerRef.current,
			left = isHorizontal() ? (scrollLeft + nodeLeft - containerLeft) : null,
			top = isVertical() ? (scrollTop + nodeTop - containerTop) : null;

		return {
			left,
			top,
			width: nodeWidth,
			height: nodeHeight
		};
	}

	function isVertical () {
		return (props.direction !== 'horizontal');
	}

	function isHorizontal () {
		return (props.direction !== 'vertical');
	}

	function calculateMetrics () {
		const
			{scrollBounds} = variables.current,
			{scrollWidth, scrollHeight, clientWidth, clientHeight} = uiChildContainerRef.current;

		scrollBounds.scrollWidth = scrollWidth;
		scrollBounds.scrollHeight = scrollHeight;
		scrollBounds.clientWidth = clientWidth;
		scrollBounds.clientHeight = clientHeight;
		scrollBounds.maxLeft = Math.max(0, scrollWidth - clientWidth);
		scrollBounds.maxTop = Math.max(0, scrollHeight - clientHeight);
	}

	// render
	const
		{className, style, ...rest} = props,
		mergedStyle = Object.assign({}, style, {
			overflowX: isHorizontal() ? 'auto' : 'hidden',
			overflowY: isVertical() ? 'auto' : 'hidden'
		});

	delete rest.cbScrollTo;
	delete rest.dangerouslyContainsInScrollable;
	delete rest.direction;
	delete rest.isHorizontalScrollbarVisible;
	delete rest.isVerticalScrollbarVisible;
	delete rest.rtl;
	delete rest.uiChildContainerRef;

	return (
		<div
			{...rest}
			className={classNames(className, css.scroller)}
			ref={uiChildContainerRef}
			style={mergedStyle}
		/>
	);
};

ScrollerBase.displayName = 'ui:ScrollerBase';

ScrollerBase.propTypes = /** @lends ui/Scroller.ScrollerBase.prototype */ {
	children: PropTypes.node.isRequired,

	/**
	 * Callback method of scrollTo.
	 * Normally, `Scrollable` should set this value.
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
	rtl: PropTypes.bool
};

ScrollerBase.defaultProps = {
	direction: 'both'
};

export default ScrollerBase;
