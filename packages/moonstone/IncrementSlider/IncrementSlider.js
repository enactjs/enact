/**
 * Exports the {@link moonstone/IncrementSlider.IncrementSlider} component.
 *
 * @module moonstone/IncrementSlider
 */

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import Pressable from '@enact/ui/Pressable';
import React, {PropTypes} from 'react';
import {Spottable} from '@enact/spotlight';

import {SliderBaseFactory} from '../Slider';
import SliderDecorator from '../internal/SliderDecorator';

import IncrementSliderButton from './IncrementSliderButton';
import componentCss from './IncrementSlider.less';

const IncrementSliderBaseFactory = factory({css: componentCss}, ({css}) => {
	const Slider = Spottable(SliderBaseFactory({css}));

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

	return kind({
		name: 'IncrementSlider',

		propTypes: /** @lends moonstone/IncrementSlider.IncrementSliderBase.prototype */ {
			/**
			 * Background progress, as a proportion between `0` and `1`.
			 *
			 * @type {Number}
			 * @default 0
			 * @public
			 */
			backgroundProgress: PropTypes.number,

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
			value: PropTypes.number,

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
			backgroundProgress: 0,
			max: 100,
			min: 0,
			pressed: false,
			step: 1,
			value: 0,
			vertical: false
		},

		styles: {
			css,
			className: 'incrementSlider'
		},

		computed: {
			decrementDisabled: ({disabled, min, value}) => disabled || value <= min,
			incrementDisabled: ({disabled, max, value}) => disabled || value >= max,
			incrementSliderClasses: ({vertical, styler}) => styler.append({vertical, horizontal: !vertical}),
			decrementIcon: ({decrementIcon, vertical}) => (decrementIcon || (vertical ? 'arrowlargedown' : 'arrowlargeleft')),
			incrementIcon: ({incrementIcon, vertical}) => (incrementIcon || (vertical ? 'arrowlargeup' : 'arrowlargeright'))
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
				<Slider {...rest} className={css.slider} />
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
});

const IncrementSliderFactory = factory((config) => {
	const Base = IncrementSliderBaseFactory(config);

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
	return Pressable(
		SliderDecorator(
			{handlesIncrements: true},
			Base
		)
	);
});

const IncrementSliderBase = IncrementSliderBaseFactory();
const IncrementSlider = IncrementSliderFactory();

export default IncrementSlider;
export {
	IncrementSlider,
	IncrementSliderBase,
	IncrementSliderBaseFactory,
	IncrementSliderFactory
};
