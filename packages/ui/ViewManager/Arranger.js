/*
 * Exports a number of pre-defined arrangers for use with {@link ui/ViewManager}.
 * note: not jsdoc on purpose
 */

import PropTypes from 'prop-types';
import {accelerate, clearTransform, compose, reverse, slideInPartial, slideOutPartial} from './arrange';

/**
 * A basic arranger that must be configured with `enter` and `leave` direction
 *
 * @function
 * @memberof ui/ViewManager
 * @param {Object}    config    Configuration object including `amount`, `enter` and `leave` properties
 * @returns {Object}            An arranger
 * @public
 */
export const SlideArranger = ({amount = 100, enter, leave}) => ({
	enter: reverse(compose(clearTransform, slideInPartial(amount, enter), accelerate)),
	leave: reverse(compose(clearTransform, slideOutPartial(amount, leave), accelerate))
});

/**
 * An arranger that enters from the left and leaves to the right.
 * @memberof ui/ViewManager
 * @public
 */
export const SlideRightArranger = SlideArranger({enter: 'left', leave: 'right'});

/**
 * An arranger that enters from the right and leaves to the left.
 * @memberof ui/ViewManager
 * @public
 */
export const SlideLeftArranger = SlideArranger({enter: 'right', leave: 'left'});

/**
 * An arranger that enters from the bottom and leaves to the top.
 * @memberof ui/ViewManager
 * @public
 */
export const SlideTopArranger = SlideArranger({enter: 'bottom', leave: 'top'});

/**
 * An arranger that enters from the top and leaves to the bottom.
 * @memberof ui/ViewManager
 * @public
 */
export const SlideBottomArranger = SlideArranger({enter: 'top', leave: 'bottom'});

/**
 * propType validation for Arranger transitions
 * @memberof ui/ViewManager
 * @private
 */
export const shape = PropTypes.shape({
	enter: PropTypes.func,
	leave: PropTypes.func
});
