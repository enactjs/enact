/**
 * Exports the {@link moonstone/IncrementSlider.IncrementSlider} component.
 *
 * @module moonstone/IncrementSlider
 */

import {checkDefaultBounds} from '@enact/ui/validators/PropTypeValidators';
import kind from '@enact/core/kind';
import Pressable from '@enact/ui/Pressable';
import React, {PropTypes} from 'react';
import {Spottable} from '@enact/spotlight';
import {isRtlLocale} from '@enact/i18n';
import {SliderBase} from '../Slider';
import SliderDecorator from '../internal/SliderDecorator';

import IncrementSliderButton from './IncrementSliderButton';
import css from './IncrementSlider.less';

/**
 * {@link moonstone/IncrementSlider.IncrementSliderBase} is a stateless Slider
 * with IconButtons to increment and decrement the value. In most circumstances,
 * you will want to use the stateful version:
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
		 * Assign a custom icon for the decrementer. All strings supported by [Icon]{Icon} are
		 * supported. Without a custom icon, the default is used, and is automatically changed when
		 * [vertical]{moonstone/IncrementSlider#vertical} is changed.
		 *
		 * @type {String}
		 * @public
		 */
		decrementIcon: React.PropTypes.string,

		/**
		 * When `true`, the component is shown as disabled and does not generate events
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Assign a custom icon for the incrementer. All strings supported by [Icon]{Icon} are
		 * supported. Without a custom icon, the default is used, and is automatically changed when
		 * [vertical]{moonstone/IncrementSlider#vertical} is changed.
		 *
		 * @type {String}
		 * @public
		 */
		incrementIcon: React.PropTypes.string,

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
		decrementDisabled: ({disabled, min, value}) => disabled || value <= min,
		incrementDisabled: ({disabled, max, value}) => disabled || value >= max,
		incrementSliderClasses: ({vertical, styler}) => styler.append({vertical, horizontal: !vertical}),
		decrementIcon: ({decrementIcon, vertical}) => {
			if (decrementIcon) {
				return decrementIcon;
			} else if (vertical) {
				return 'arrowlargedown';
			} else if (isRtlLocale()) {
				return 'arrowlargeright';
			} else {
				return 'arrowlargeleft';
			}
		},
		incrementIcon: ({incrementIcon, vertical}) => {
			if (incrementIcon) {
				return incrementIcon;
			} else if (vertical) {
				return 'arrowlargeup';
			} else if (isRtlLocale()) {
				return 'arrowlargeleft';
			} else {
				return 'arrowlargeright';
			}
		}
	},

	render: ({decrementDisabled, decrementIcon, incrementDisabled, incrementIcon, onIncrement, onDecrement, incrementSliderClasses, ...rest}) => (
		<div className={incrementSliderClasses}>
			<IncrementSliderButton
				className={css.decrementButton}
				disabled={decrementDisabled}
				onClick={onDecrement}
			>
				{decrementIcon}
			</IncrementSliderButton>
			<SliderBase {...rest} className={css.slider} />
			<IncrementSliderButton
				className={css.incrementButton}
				disabled={incrementDisabled}
				onClick={onIncrement}
			>
				{incrementIcon}
			</IncrementSliderButton>
		</div>
	)
});

/**
 * {@link moonstone/IncrementSlider.IncrementSlider} is a IncrementSlider with
 * Moonstone styling, Spottable, Pressable and SliderDecorator applied. It is a
 * stateful Slider Slider with IconButtons to increment and decrement the value
 *
 * @class IncrementSlider
 * @memberof moonstone/IncrementSlider
 * @mixes spotlight/Spottable
 * @mixes ui/Pressable
 * @ui
 * @public
 */
const IncrementSlider = Pressable(
	Spottable(
		SliderDecorator(
			{handlesIncrements: true},
			IncrementSliderBase
		)
	)
);

export default IncrementSlider;
export {IncrementSlider, IncrementSliderBase};
