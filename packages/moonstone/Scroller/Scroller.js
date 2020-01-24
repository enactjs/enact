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
import React, {forwardRef} from 'react';

import Scrollable from '../Scrollable';

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

	const {uiChildAdapter} = props;

	/*
	 * Hooks
	 */

	const {calculatePositionOnFocus, focusOnNode, setContainerDisabled} = useSpottable(props, {uiChildAdapter});

	props.setChildAdapter({
		calculatePositionOnFocus,
		focusOnNode,
		setContainerDisabled
	});

	/*
	 * Render
	 */

	const propsObject = Object.assign({}, props);

	delete propsObject.dangerouslyContainsInScrollable;
	delete propsObject.onUpdate;
	delete propsObject.uiScrollableAdapter;
	delete propsObject.scrollAndFocusScrollbarButton;
	delete propsObject.setChildAdapter;
	delete propsObject.spotlightId;

	return (
		<UiScrollerBase {...propsObject} />
	);
};

ScrollerBase = forwardRef(ScrollerBase);

ScrollerBase.displayName = 'ScrollerBase';

ScrollerBase.propTypes = /** @lends moonstone/Scroller.ScrollerBase.prototype */ {
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

export default Scroller;
export {
	Scroller,
	ScrollerBase
};
