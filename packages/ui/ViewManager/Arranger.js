/*
 * Exports a number of pre-defined arrangers for use with {@link ui/ViewManager}.
 * note: not jsdoc on purpose
 */

import PropTypes from 'prop-types';
import {slideInPartial, slideOutPartial} from './arrange';

/**
 * An object with callback functions to arrange views within {@link ui/ViewManager.ViewManager}.
 *
 * @typedef {Object} Arranger
 * @property {Function} enter
 * @property {Function} leave
 * @property {Function} stay
 * @memberof ui/ViewManager
 */

/**
 * A basic arranger that must be configured with `enter` and `leave` direction
 *
 * @function
 * @memberof ui/ViewManager
 * @param {Object}    config    Configuration object including `amount`, `enter` and `leave` properties
 * @returns {Object}            An arranger
 * @public
 */
export const SlideArranger = ({amount = 100, direction}) => ({
	enter: () => [
		{transform: slideInPartial(amount, direction)},
		{transform: slideInPartial(0, direction)}
	],
	leave: () => [
		{transform: slideOutPartial(0, direction)},
		{transform: slideOutPartial(amount, direction)}
	]
});

/**
 * An arranger that enters from the left and leaves to the right.
 *
 * @type {Arranger}
 * @memberof ui/ViewManager
 * @public
 */
export const SlideRightArranger = SlideArranger({direction: 'right'});

/**
 * An arranger that enters from the right and leaves to the left..
 *
 * @type {Arranger}
 * @memberof ui/ViewManager
 * @public
 */
export const SlideLeftArranger = SlideArranger({direction: 'left'});

/**
 * An arranger that enters from the bottom and leaves to the top..
 *
 * @type {Arranger}
 * @memberof ui/ViewManager
 * @public
 */
export const SlideTopArranger = SlideArranger({direction: 'top'});

/**
 * An arranger that enters from the top and leaves to the bottom..
 *
 * @type {Arranger}
 * @memberof ui/ViewManager
 * @public
 */
export const SlideBottomArranger = SlideArranger({direction: 'bottom'});

/**
 * propType validation for Arranger transitions
 * @memberof ui/ViewManager
 * @private
 */
export const shape = PropTypes.shape({
	enter: PropTypes.func,
	leave: PropTypes.func
});
