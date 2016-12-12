/**
 * Exports the {@link moonstone/Slider.Slider} component.
 *
 * @module moonstone/Slider
 */

import kind from '@enact/core/kind';
import {Spottable} from '@enact/spotlight';
import Pressable from '@enact/ui/Pressable';
import {checkDefaultBounds} from '@enact/ui/validators/PropTypeValidators';
import React, {PropTypes} from 'react';

import SliderDecorator from '../internal/SliderDecorator';
import {
	computeProportionBackground,
	computeProportionProgress
} from '../internal/SliderDecorator/util';

import SliderBar from './SliderBar';
import css from './Slider.less';

/**
 * {@link moonstone/Slider.SliderBase} is a stateless Slider. In most circumstances, you will want
 * to use the stateful version: {@link moonstone/Slider.Slider}
 *
 * @class SliderBase
 * @memberof moonstone/Slider
 * @ui
 * @public
 */
const SliderBase = kind({
	name: 'Slider',

	propTypes: /** @lends moonstone/Slider.SliderBase.prototype */{
		/**
		 * Background progress, as a percentage.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		backgroundPercent: PropTypes.number,

		/**
		 * The method to run when the input mounts, giving a reference to the DOM.
		 *
		 * @type {Function}
		 * @private
		 */
		inputRef: PropTypes.func,

		/**
		 * The maximum value of the slider.
		 *
		 * @type {Number}
		 * @default 100
		 * @public
		 */
		max: PropTypes.number,

		/**
		 * The minimum value of the slider.
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
		 * @param {Number} event.value Value of the slider
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * When `true`, a pressed visual effect is applied
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		pressed: PropTypes.bool,

		/**
		 * The method to run when the slider bar component mounts, giving a reference to the DOM.
		 *
		 * @type {Function}
		 * @private
		 */
		sliderBarRef: PropTypes.func,

		/**
		 * The method to run when mounted, giving a reference to the DOM.
		 *
		 * @type {Function}
		 * @private
		 */
		sliderRef: PropTypes.func,

		/**
		 * The amount to increment or decrement the value.
		 *
		 * @type {Number}
		 * @default 1
		 * @public
		 */
		step: PropTypes.number,

		/**
		 * The value of the slider.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: checkDefaultBounds,

		/**
		 * If `true` the slider will be oriented vertically.
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
		onChange: () => {}, // needed to ensure the base input element is mutable if no change handler is provided
		pressed: false,
		step: 1,
		value: 0,
		vertical: false
	},

	styles: {
		css: css,
		className: 'slider'
	},

	computed: {
		className: ({pressed, vertical, styler}) => styler.append({pressed, vertical, horizontal: !vertical}),
		proportionBackgroundProgress: computeProportionBackground,
		proportionProgress: computeProportionProgress
	},

	render: ({inputRef, max, min, onChange, proportionBackgroundProgress, proportionProgress, sliderBarRef, sliderRef, step, value, vertical, ...rest}) => {
		delete rest.backgroundPercent;
		delete rest.pressed;

		return (
			<div {...rest} ref={sliderRef}>
				<SliderBar
					proportionBackgroundProgress={proportionBackgroundProgress}
					proportionProgress={proportionProgress}
					ref={sliderBarRef}
					vertical={vertical}
				/>
				<input
					className={css.input}
					type="range"
					ref={inputRef}
					max={max}
					min={min}
					step={step}
					onChange={onChange}
					value={value}
					orient={vertical ? 'vertical' : 'horizontal'}
				/>
			</div>
		);
	}
});

/**
 * {@link moonstone/Slider.Slider} is a Slider with Moonstone styling, Spottable, Pressable and
 * SliderDecorator applied. It is a stateful Slider.
 *
 * @class Slider
 * @memberof moonstone/Slider
 * @mixes spotlight/Spottable
 * @mixes ui/Pressable
 * @ui
 * @public
 */
const Slider = Pressable(
	Spottable(
		SliderDecorator(
			SliderBase
		)
	)
);

export default Slider;
export {Slider, SliderBase};
