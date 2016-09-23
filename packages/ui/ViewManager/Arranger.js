/**
 * Exports a number of pre-defined arrangers for use with {@link module:enact-ui/ViewManager}.
 *
 * @public
 * @module enact-ui/ViewManager/Arranger
 */

import React from 'react';
import {accelerate, clearTransform, compose, fadeIn, fadeOut, reverse, slideInPartial, slideOutPartial} from './arrange';

/**
 * A basic arranger that must be configured with `enter` and `leave` direction
 * @param {Object} config Configuration object including `amount`, `enter` and `leave` properties
 * @returns {Object} An arranger
 * @public
 */
export const SlideArranger = ({amount = 100, enter, leave}) => ({
	enter: reverse(compose(clearTransform, fadeIn, slideInPartial(amount, enter), accelerate)),
	leave: reverse(compose(clearTransform, fadeOut, slideOutPartial(amount, leave), accelerate))
});

/**
 * An arranger that enters from the left and leaves to the right.
 * @public
 */
export const SlideRightArranger = SlideArranger({enter: 'left', leave: 'right'});

/**
 * An arranger that enters from the right and leaves to the left.
 * @public
 */
export const SlideLeftArranger = SlideArranger({enter: 'right', leave: 'left'});

/**
 * An arranger that enters from the bottom and leaves to the top.
 * @public
 */
export const SlideTopArranger = SlideArranger({enter: 'bottom', leave: 'top'});

/**
 * An arranger that enters from the top and leaves to the bottom.
 * @public
 */
export const SlideBottomArranger = SlideArranger({enter: 'top', leave: 'bottom'});

/**
 * propType validation for Arranger transitions
 * @private
 */
export const shape = React.PropTypes.shape({
	enter: React.PropTypes.func,
	leave: React.PropTypes.func
});
