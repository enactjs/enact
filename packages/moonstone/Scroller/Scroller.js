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

import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import {ResizeContext} from '@enact/ui/Resizable';
import {ScrollerBase as UiScrollerBase} from '@enact/ui/Scroller';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import useScroll from '../Scrollable';
import Scrollbar from '../Scrollable/Scrollbar';
import Skinnable from '../Skinnable';


import {useSpottableScroller} from './useSpottableScroller';

/**
 * A Moonstone-styled base component for [Scroller]{@link moonstone/Scroller.Scroller}.
 * In most circumstances, you will want to use the
 * [SpotlightContainerDecorator]{@link spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator}
 * and the Scrollable version, [Scroller]{@link moonstone/Scroller.Scroller}.
 *
 * @class ScrollerBase
 * @memberof moonstone/Scroller
 * @extends ui/Scroller.ScrollerBase
 * @ui
 * @public
 */
class ScrollerBase extends Component {
	static displayName = 'ScrollerBase'

	static propTypes = /** @lends moonstone/Scroller.ScrollerBase.prototype */ {
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
	}
}

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
let Scroller = (props) => {
	// Hooks

	const {
		childWrapper: ChildWrapper,
		isHorizontalScrollbarVisible,
		isVerticalScrollbarVisible,

		resizeContextProps,
		scrollableContainerProps,
		flexLayoutProps,
		childWrapperProps,
		childProps,
		verticalScrollbarProps,
		horizontalScrollbarProps
	} = useScroll(props);

	const uiChildProps = useSpottableScroller(childProps);

	// Render

	return (
		<ResizeContext.Provider {...resizeContextProps}>
			<div {...scrollableContainerProps}>
				<div {...flexLayoutProps}>
					<ChildWrapper {...childWrapperProps}>
						<UiScrollerBase {...uiChildProps} />
					</ChildWrapper>
					{isVerticalScrollbarVisible ? <Scrollbar {...verticalScrollbarProps} /> : null}
				</div>
				{isHorizontalScrollbarVisible ? <Scrollbar {...horizontalScrollbarProps} /> : null}
			</div>
		</ResizeContext.Provider>
	);
};

Scroller.propTypes = /** @lends moonstone/Scroller.Scroller.prototype */ {
	direction: PropTypes.oneOf(['both', 'horizontal', 'vertical']),

	/**
	 * Specifies how to show horizontal scrollbar.
	 *
	 * Valid values are:
	 * * `'auto'`,
	 * * `'visible'`, and
	 * * `'hidden'`.
	 *
	 * @type {String}
	 * @default 'auto'
	 * @public
	 */
	horizontalScrollbar: PropTypes.oneOf(['auto', 'visible', 'hidden']),

	/**
	 * Specifies how to show vertical scrollbar.
	 *
	 * Valid values are:
	 * * `'auto'`,
	 * * `'visible'`, and
	 * * `'hidden'`.
	 *
	 * @type {String}
	 * @default 'auto'
	 * @public
	 */
	verticalScrollbar: PropTypes.oneOf(['auto', 'visible', 'hidden'])
};

Scroller.defaultProps = {
	'data-spotlight-container-disabled': false, // eslint-disable-line react/default-props-match-prop-types
	direction: 'both',
	focusableScrollbar: false, // eslint-disable-line react/default-props-match-prop-types
	horizontalScrollbar: 'auto',
	overscrollEffectOn: { // eslint-disable-line react/default-props-match-prop-types
		arrowKey: false,
		drag: false,
		pageKey: false,
		scrollbarButton: false,
		wheel: true
	},
	preventBubblingOnKeyDown: 'none', // eslint-disable-line react/default-props-match-prop-types
	type: 'JS', // eslint-disable-line react/default-props-match-prop-types
	verticalScrollbar: 'auto'
};

Scroller = Skinnable(
	SpotlightContainerDecorator(
		{
			overflow: true,
			preserveId: true,
			restrict: 'self-first'
		},
		I18nContextDecorator(
			{rtlProp: 'rtl'},
			Scroller
		)
	)
);

export default Scroller;
export {
	Scroller,
	ScrollerBase
};
