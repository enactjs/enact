/**
 * Provides Moonstone-themed scroller components and behaviors.
 * @example
 * <Scroller>
 * 	<div style={{height: "150px"}}>
 * 		<p>San Francisco</p>
 * 		<p>Seoul</p>
 * 		<p>Bangalore</p>
 * 		<p>New York</p>
 * 		<p>London</p>
 * 	</div>
 * </Scroller>
 *
 * @module moonstone/Scroller
 * @exports Scroller
 * @exports ScrollerBase
 */


import {ScrollerBase as UiScrollerBase} from '@enact/ui/Scroller';
import PropTypes from 'prop-types';
import React, {forwardRef, useImperativeHandle, useRef} from 'react';

import Scrollable from '../Scrollable';
import ScrollableNative from '../Scrollable/ScrollableNative';

import useSpottable from './useSpottable';

/**
 * A Moonstone-styled base component for [Scroller]{@link moonstone/Scroller.Scroller}.
 * In most circumstances, you will want to use the
 * [SpotlightContainerDecorator]{@link spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator}
 * and the Scrollable version, [Scroller]{@link moonstone/Scroller.Scroller}.
 *
 * @function ScrollerBase
 * @memberof moonstone/Scroller
 * @extends ui/Scroller.ScrollerBase
 * @ui
 * @public
 */
let ScrollerBase = (props, reference) => {
	/*
	 * Dependencies
	 */

	const {initUiChildRef} = props;

	const uiRef = useRef();

	/*
	 * Hooks
	 */

	const {calculatePositionOnFocus, focusOnNode, setContainerDisabled} = useSpottable(props, {uiRef});

	/*
	 * Functions
	 */

	function initUiRef (ref) {
		if (ref) {
			uiRef.current = ref;
			initUiChildRef(ref);
		}
	}

	/*
	 * useImperativeHandle
	 */

	useImperativeHandle(reference, () => ({
		calculatePositionOnFocus,
		focusOnNode,
		setContainerDisabled
	}));

	/*
	 * Render
	 */

	const propsObject = Object.assign({}, props);
	delete propsObject.initUiChildRef;
	delete propsObject.onUpdate;
	delete propsObject.scrollAndFocusScrollbarButton;
	delete propsObject.spotlightId;

	return (
		<UiScrollerBase
			{...propsObject}
			ref={initUiRef}
		/>
	);
};

ScrollerBase = forwardRef(ScrollerBase);

ScrollerBase.displayName = 'ScrollerBase';

ScrollerBase.propTypes = /** @lends moonstone/Scroller.ScrollerBase.prototype */ {
	/**
	 * Passes the instance of [Scroller]{@link ui/Scroller.Scroller}.
	 *
	 * @type {Object}
	 * @param {Object} ref
	 * @private
	 */
	initUiChildRef: PropTypes.func,

	/**
	 * Called when [Scroller]{@link moonstone/Scroller.Scroller} updates.
	 *
	 * @type {function}
	 * @private
	 */
	onUpdate: PropTypes.func,

	/**
	 * `true` if rtl, `false` if ltr.
	 *
	 * @type {Boolean}
	 * @private
	 */
	rtl: PropTypes.bool,

	/**
	 * Called when [Scroller]{@link moonstone/Scroller.Scroller} should be scrolled
	 * and the focus should be moved to a scrollbar button.
	 *
	 * @type {function}
	 * @private
	 */
	scrollAndFocusScrollbarButton: PropTypes.func,

	/**
	 * The spotlight id for the component.
	 *
	 * @type {String}
	 * @private
	 */
	spotlightId: PropTypes.string
};

/**
 * Allows 5-way navigation to the scrollbar controls. By default, 5-way will
 * not move focus to the scrollbar controls.
 *
 * @name focusableScrollbar
 * @memberof moonstone/Scroller.ScrollerBase.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

/**
 * Unique identifier for the component.
 *
 * When defined and when the `Scroller` is within a [Panel]{@link moonstone/Panels.Panel}, the
 * `Scroller` will store its scroll position and restore that position when returning to the
 * `Panel`.
 *
 * @name id
 * @memberof moonstone/Scroller.ScrollerBase.prototype
 * @type {String}
 * @public
 */

/**
 * Sets the hint string read when focusing the next button in the vertical scroll bar.
 *
 * @name scrollDownAriaLabel
 * @memberof moonstone/Scroller.ScrollerBase.prototype
 * @type {String}
 * @default $L('scroll down')
 * @public
 */

/**
 * Sets the hint string read when focusing the previous button in the horizontal scroll bar.
 *
 * @name scrollLeftAriaLabel
 * @memberof moonstone/Scroller.ScrollerBase.prototype
 * @type {String}
 * @default $L('scroll left')
 * @public
 */

/**
 * Sets the hint string read when focusing the next button in the horizontal scroll bar.
 *
 * @name scrollRightAriaLabel
 * @memberof moonstone/Scroller.ScrollerBase.prototype
 * @type {String}
 * @default $L('scroll right')
 * @public
 */

/**
 * Sets the hint string read when focusing the previous button in the vertical scroll bar.
 *
 * @name scrollUpAriaLabel
 * @memberof moonstone/Scroller.ScrollerBase.prototype
 * @type {String}
 * @default $L('scroll up')
 * @public
 */

/**
 * A Moonstone-styled Scroller, Scrollable applied.
 *
 * Usage:
 * ```
 * <Scroller>Scroll me.</Scroller>
 * ```
 *
 * @class Scroller
 * @memberof moonstone/Scroller
 * @extends moonstone/Scroller.ScrollerBase
 * @ui
 * @public
 */
const Scroller = (props) => (
	<Scrollable
		{...props}
		childRenderer={(scrollerProps) => { // eslint-disable-line react/jsx-no-bind
			return <ScrollerBase {...scrollerProps} />;
		}}
	/>
);

Scroller.propTypes = /** @lends moonstone/Scroller.Scroller.prototype */ {
	direction: PropTypes.oneOf(['both', 'horizontal', 'vertical'])
};

Scroller.defaultProps = {
	direction: 'both'
};

/**
 * A Moonstone-styled native Scroller, Scrollable applied.
 *
 * For smooth native scrolling, web engine with below Chromium 61, should be launched
 * with the flag '--enable-blink-features=CSSOMSmoothScroll' to support it.
 * The one with Chromium 61 or above, is launched to support it by default.
 *
 * Usage:
 * ```
 * <ScrollerNative>Scroll me.</ScrollerNative>
 * ```
 *
 * @class ScrollerNative
 * @memberof moonstone/Scroller
 * @extends moonstone/Scroller.ScrollerBase
 * @ui
 * @private
 */
const ScrollerNative = (props) => (
	<ScrollableNative
		{...props}
		childRenderer={(scrollerProps) => { // eslint-disable-line react/jsx-no-bind
			return <ScrollerBase {...scrollerProps} />;
		}}
	/>
);

ScrollerNative.propTypes = /** @lends moonstone/Scroller.ScrollerNative.prototype */ {
	direction: PropTypes.oneOf(['both', 'horizontal', 'vertical'])
};

ScrollerNative.defaultProps = {
	direction: 'both'
};

export default Scroller;
export {
	Scroller,
	ScrollerBase,
	ScrollerNative
};
