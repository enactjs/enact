/**
 * Exports the {@link moonstone/IncrementSlider.IncrementSlider}
 *
 * @module moonstone/IncrementSlider
 */

import kind from '@enact/core/kind';
import {Spottable} from '@enact/spotlight';
import Pressable from '@enact/ui/Pressable';
import {checkDefaultBounds} from '@enact/ui/validators/PropTypeValidators';
import React, {PropTypes} from 'react';

import SliderDecorator from '../internal/SliderDecorator';
import IconButton from '../IconButton';
import {SliderBase} from '../Slider';

import css from './IncrementSlider.less';

/**
 * {@link moonstone/IncrementSlider.IncrementSliderBase} is a stateless Slider 
 * with IconButtons to increment and decrement the value. In most circumstances,
 * you will want to use the stateful version.
 * {@link moonstone/IncrementSlider.IncrementSlider}
 *
 * @class IncrementSliderBase
 * @memberof moonstone/IncrementSlider
 * @ui
 * @public
 */

const IncrementSliderBase = kind({
	name: 'IncrementSlider',

	propTypes: /** @lends moonstone/IncrementSlider.IncrementSliderBase.prototype */ {
		/**
		 * Background progress, as a percentage.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		backgroundPercent: PropTypes.number,

		/**
		 * Height, in standard CSS units, of the vertical increment slider. Only takes
		 * effect on a vertical oriented slider.
		 *
		 * @type {String}
		 * @default '300px'
		 * @public
		 */
		height: PropTypes.string,

		/**
		 * The maximum value of the increment slider.
		 *
		 * @type {Number}
		 * @default 100
		 * @public
		 */
		max: PropTypes.number,

		/**
		 * The minimum value of the increment slider.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		min: PropTypes.number,

		/**
		 * The handler to run when the value is changed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @param {Number} event.value The current value
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * The handler to run when the value is incremented.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onDecrement: PropTypes.func,

		/**
		 * The handler to run when the value is decremented.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onIncrement: PropTypes.func,

		/**
		* The amount to increment or decrement the value.
		*
		* @type {Number}
		* @default 1
		* @public
		*/
		step: PropTypes.number,

		/**
		* The value of the increment slider.
		*
		* @type {Number}
		* @default 0
		* @public
		*/
		value: checkDefaultBounds,

		/**
		* If `true` the increment slider will be oriented vertically.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		vertical: PropTypes.bool
	},

	defaultProps: {
		backgroundPercent: 0,
		height: '300px',
		max: 100,
		min: 0,
		pressed: false,
		step: 1,
		value: 0,
		vertical: false
	},

	styles: {
		css: css,
		className: 'incrementSlider'
	},

	computed: {
		incrementSliderClasses: ({vertical, styler}) => styler.append({vertical})
	},

	render: ({onIncrement, onDecrement, incrementSliderClasses, ...rest}) => (
		<div className={incrementSliderClasses}>
			<IconButton className={css.decrementButton} small onClick={onDecrement}>arrowlargeleft</IconButton>
			<SliderBase {...rest} className={css.slider} />
			<IconButton className={css.incrementButton} small onClick={onIncrement}>arrowlargeright</IconButton>
		</div>
	)
});
/**
 * {@link moonstone/IncrementSlider.IncrementSlider} is a IncrementSlider with 
 * Moonstone styling, Spottable, Pressable and SliderDecorator applied. It is a 
 * stateful Slider Slider with IconButtons to increment and decrement the value.
 *
 * @class IncrementSlider
 * @memberof moonstone/IncrementSlider
 * @mixes spotlight/Spottable
 * @mixes ui/Pressable
 * @ui
 * @public
 */
const SpottableSlider = Pressable(Spottable(SliderDecorator({handlesIncrements: true}, IncrementSliderBase)));

export default SpottableSlider;
export {SpottableSlider as IncrementSlider, IncrementSliderBase};
