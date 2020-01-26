/**
 * Provides Moonstone-themed scrollable components and behaviors.
 *
 * @module moonstone/Scrollable
 * @exports Scrollable
 * @private
 */

import PropTypes from 'prop-types';

import {dataIndexAttribute, useSpottable} from './useSpottable';

const ScrollableBase = {};

ScrollableBase.displayName = 'Scrollable';

ScrollableBase.propTypes = /** @lends moonstone/Scrollable.Scrollable.prototype */ {
	/**
	 * Render function.
	 *
	 * @type {Function}
	 * @required
	 * @private
	 */
	childRenderer: PropTypes.func.isRequired,

	/**
	 * This is set to `true` by SpotlightContainerDecorator
	 *
	 * @type {Boolean}
	 * @private
	 */
	'data-spotlight-container': PropTypes.bool,

	/**
	 * `false` if the content of the list or the scroller could get focus
	 *
	 * @type {Boolean}
	 * @default false
	 * @private
	 */
	'data-spotlight-container-disabled': PropTypes.bool,

	/**
	 * This is passed onto the wrapped component to allow
	 * it to customize the spotlight container for its use case.
	 *
	 * @type {String}
	 * @private
	 */
	'data-spotlight-id': PropTypes.string,

	/**
	 * Direction of the list or the scroller.
	 * `'both'` could be only used for[Scroller]{@link moonstone/Scroller.Scroller}.
	 *
	 * Valid values are:
	 * * `'both'`,
	 * * `'horizontal'`, and
	 * * `'vertical'`.
	 *
	 * @type {String}
	 * @private
	 */
	direction: PropTypes.oneOf(['both', 'horizontal', 'vertical']),

	/**
	 * Allows 5-way navigation to the scrollbar controls. By default, 5-way will
	 * not move focus to the scrollbar controls.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	focusableScrollbar: PropTypes.bool,

	/**
	 * A unique identifier for the scrollable component.
	 *
	 * When specified and when the scrollable is within a SharedStateDecorator, the scroll
	 * position will be shared and restored on mount if the component is destroyed and
	 * recreated.
	 *
	 * @type {String}
	 * @public
	 */
	id: PropTypes.string,

	/**
	 * Specifies overscroll effects shows on which type of inputs.
	 *
	 * @type {Object}
	 * @default {
	 *	arrowKey: false,
	 *	drag: false,
	 *	pageKey: false,
	 *	scrollbarButton: false,
	 *	wheel: true
	 * }
	 * @private
	 */
	overscrollEffectOn: PropTypes.shape({
		arrowKey: PropTypes.bool,
		drag: PropTypes.bool,
		pageKey: PropTypes.bool,
		scrollbarButton: PropTypes.bool,
		wheel: PropTypes.bool
	}),

	/**
	 * Specifies preventing keydown events from bubbling up to applications.
	 * Valid values are `'none'`, and `'programmatic'`.
	 *
	 * When it is `'none'`, every keydown event is bubbled.
	 * When it is `'programmatic'`, an event bubbling is not allowed for a keydown input
	 * which invokes programmatic spotlight moving.
	 *
	 * @type {String}
	 * @default 'none'
	 * @private
	 */
	preventBubblingOnKeyDown: PropTypes.oneOf(['none', 'programmatic']),

	/**
	 * Sets the hint string read when focusing the next button in the vertical scroll bar.
	 *
	 * @type {String}
	 * @default $L('scroll down')
	 * @public
	 */
	scrollDownAriaLabel: PropTypes.string,

	/**
	 * Sets the hint string read when focusing the previous button in the horizontal scroll bar.
	 *
	 * @type {String}
	 * @default $L('scroll left')
	 * @public
	 */
	scrollLeftAriaLabel: PropTypes.string,

	/**
	 * Sets the hint string read when focusing the next button in the horizontal scroll bar.
	 *
	 * @type {String}
	 * @default $L('scroll right')
	 * @public
	 */
	scrollRightAriaLabel: PropTypes.string,

	/**
	 * Sets the hint string read when focusing the previous button in the vertical scroll bar.
	 *
	 * @type {String}
	 * @default $L('scroll up')
	 * @public
	 */
	scrollUpAriaLabel: PropTypes.string,

	/**
	 * TBD
	 */
	type: PropTypes.string
};

ScrollableBase.defaultProps = {
	'data-spotlight-container-disabled': false,
	focusableScrollbar: false,
	overscrollEffectOn: {
		arrowKey: false,
		drag: false,
		pageKey: false,
		scrollbarButton: false,
		wheel: true
	},
	preventBubblingOnKeyDown: 'none',
	type: 'JS'
};

/**
 * A Moonstone-styled component that provides horizontal and vertical scrollbars.
 *
 * @class Scrollable
 * @memberof moonstone/Scrollable
 * @mixes spotlight/SpotlightContainerDecorator
 * @extends moonstone/Scrollable.ScrollableBase
 * @ui
 * @public
 */
const Scrollable = {};

export default Scrollable;
export {
	dataIndexAttribute,
	ScrollableBase as Scrollable,
	ScrollableBase
};
