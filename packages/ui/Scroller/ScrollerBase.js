import classNames from 'classnames';
import {platform} from '@enact/core/platform';
import PropTypes from 'prop-types';
import React, {useEffect, useRef} from 'react';

import useForceUpdate from '../Scrollable/useForceUpdate';

import useCalculateMetrics from './useCalculateMetrics';
import useScrollPosition from './useScrollPosition';

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
	const {className, direction, isHorizontalScrollbarVisible, isVerticalScrollbarVisible, style, uiChildContainerRef, ...rest} = props;
	const mergedStyle = {
		...style,
		overflowX: isHorizontal() ? 'auto' : 'hidden',
		overflowY: isVertical() ? 'auto' : 'hidden'
	};

	// Hooks

	const instance = {uiChildContainerRef};

	const [, forceUpdate] = useForceUpdate();

	useEffect(() => {
		// TODO: Check this code is still needed.  This code introduced from #1618. (ahn)
		forceUpdate();
	}, [isHorizontalScrollbarVisible, isVerticalScrollbarVisible]);

	const {getRtlPositionX, getScrollBounds} = useCalculateMetrics(rest, instance);

	const {
		setScrollPosition,
		scrollToPosition,
		didScroll
	} = useScrollPosition(rest, instance, {getRtlPositionX, isHorizontal, isVertical});

	// setUiChildAdapter

	useEffect(() => {
		rest.setUiChildAdapter({
			didScroll,
			getNodePosition,
			getScrollBounds,
			isHorizontal,
			isVertical,
			scrollToPosition,
			setScrollPosition
		});
	}, []);

	// Functions

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
		return (direction !== 'horizontal');
	}

	function isHorizontal () {
		return (direction !== 'vertical');
	}

	// Render

	delete rest.cbScrollTo;
	delete rest.dangerouslyContainsInScrollable;
	delete rest.rtl;

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
export {
	ScrollerBase
};
