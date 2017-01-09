/**
 * Exports the {@link moonstone/Slider.Slider} component.
 *
 * @module moonstone/Slider
 */

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import Pressable from '@enact/ui/Pressable';
import React, {PropTypes} from 'react';
import {Spottable} from '@enact/spotlight';

import SliderDecorator from '../internal/SliderDecorator';
import {
	computeProportionBackground,
	computeProportionProgress
} from '../internal/SliderDecorator/util';

import {SliderBarFactory} from './SliderBar';
import componentCss from './Slider.less';

const SliderBaseFactory = factory({css: componentCss}, ({css}) => {
	const SliderBar = SliderBarFactory({css});

	/**
	 * {@link moonstone/Slider.SliderBase} is a stateless Slider. In most circumstances, you will want
	 * to use the stateful version: {@link moonstone/Slider.Slider}
	 *
	 * @class SliderBase
	 * @memberof moonstone/Slider
	 * @ui
	 * @public
	 */
	return kind({
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
			 * The slider can change its behavior to have the knob follow the cursor as it moves
			 * across the slider, without applying the position. A click or drag behaves the same.
			 * This is primarily used by media playback. Setting this to `true` enables this behavior.
			 *
			 * @type {Boolean}
			 * @default false
			 * @private
			 */
			detachedKnob: PropTypes.bool,

			/**
			 * When `true`, the component is shown as disabled and does not generate events
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: PropTypes.bool,

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
			 * The handler to run when the mouse is moved across the slider.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @param {Number} event.value Value of the slider
			 * @public
			 */
			onMouseMove: PropTypes.func,

			/**
			 * When `true`, a pressed visual effect is applied
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			pressed: PropTypes.bool,

			/**
			 * `scrubbing` only has an effect with a datachedKnob, and is a performance optimization
			 * to not allow re-assignment of the knob's value (and therefore position) during direct
			 * user interaction.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			scrubbing: PropTypes.bool,

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
			value: PropTypes.number,

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
			detachedKnob: false,
			max: 100,
			min: 0,
			onChange: () => {}, // needed to ensure the base input element is mutable if no change handler is provided
			pressed: false,
			step: 1,
			value: 0,
			vertical: false
		},

		styles: {
			css,
			className: 'slider'
		},

		computed: {
			className: ({pressed, vertical, styler}) => styler.append({pressed, vertical, horizontal: !vertical}),
			proportionBackgroundProgress: computeProportionBackground,
			proportionProgress: computeProportionProgress
		},

		render: ({disabled, inputRef, max, min, onChange, onMouseMove, proportionBackgroundProgress, proportionProgress, scrubbing, sliderBarRef, sliderRef, step, value, vertical, ...rest}) => {
			delete rest.backgroundPercent;
			delete rest.detachedKnob;
			delete rest.pressed;

			return (
				<div {...rest} disabled={disabled} ref={sliderRef}>
					<SliderBar
						proportionBackgroundProgress={proportionBackgroundProgress}
						proportionProgress={proportionProgress}
						ref={sliderBarRef}
						vertical={vertical}
						scrubbing={scrubbing}
					/>
					<input
						className={css.input}
						disabled={disabled}
						type="range"
						ref={inputRef}
						max={max}
						min={min}
						step={step}
						onChange={onChange}
						onMouseMove={onMouseMove}
						value={value}
						orient={vertical ? 'vertical' : 'horizontal'}
					/>
				</div>
			);
		}
	});
});

const SliderFactory = factory(css => {
	const Base = SliderBaseFactory(css);

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
	return Pressable(
		Spottable(
			SliderDecorator(
				Base
			)
		)
	);
});

const SliderBase = SliderBaseFactory();
const Slider = SliderFactory();

export default Slider;
export {
	Slider,
	SliderBase,
	SliderBaseFactory,
	SliderFactory
};
