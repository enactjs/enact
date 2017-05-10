/**
 * Exports the {@link moonstone/IncrementSlider.IncrementSlider} component.
 *
 * @module moonstone/IncrementSlider
 */

import $L from '@enact/i18n/$L';
import Changeable from '@enact/ui/Changeable';
import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import Pressable from '@enact/ui/Pressable';
import React from 'react';
import PropTypes from 'prop-types';
import Spottable from '@enact/spotlight/Spottable';

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
			 * When `true`, the knob displays selected and can be moved using 5-way controls.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			active: PropTypes.bool,

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
			decrementIcon: PropTypes.string,

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
			incrementIcon: PropTypes.string,

			/**
			 * The method to run when the input mounts, giving a reference to the DOM.
			 *
			 * @type {Function}
			 * @private
			 */
			inputRef: PropTypes.func,

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
			 * The handler when the knob is activated or deactivated by selecting it via 5-way
			 *
			 * @type {Function}
			 * @public
			 */
			onActivate: PropTypes.func,

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
			 * The handler to run when the value is decremented.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onDecrement: PropTypes.func,

			/**
			 * The handler to run when the value is incremented.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onIncrement: PropTypes.func,

			/**
			 * The handler to run when the component is removed while retaining focus.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightDisappear: PropTypes.func,

			/**
			 * When `true`, a pressed visual effect is applied
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			pressed: PropTypes.bool,

			/**
			 * `scrubbing` only has an effect with a detachedKnob, and is a performance optimization
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
			 * When `true`, the component cannot be navigated using spotlight.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			spotlightDisabled: PropTypes.bool,

			/**
			* The amount to increment or decrement the value.
			*
			* @type {Number}
			* @default 1
			* @public
			*/
			step: PropTypes.number,

			/**
			 * Enables the built-in tooltip, whose behavior can be modified by the other tooltip
			 * properties.  A custom tooltip, which follows the knob, may be used instead by
			 * supplying a component as a child of `IncrementSlider`. This property has no effect if
			 * a custom tooltip is provided.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			tooltip: PropTypes.bool,

			/**
			 * Converts the contents of the built-in tooltip to a percentage of the bar.
			 * The percentage respects the min and max value props.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			tooltipAsPercent: PropTypes.bool,

			/**
			 * Setting to `true` overrides the natural LTR->RTL tooltip side-flipping for locale
			 * changes. This may be useful if you have a static layout that does not automatically
			 * reverse when in an RTL language.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			tooltipForceSide: PropTypes.bool,

			/**
			 * Specify where the tooltip should appear in relation to the Slider bar. Options are
			 * `'before'` and `'after'`. `before` renders above a `horizontal` slider and to the
			 * left of a `vertical` Slider. `after` renders below a `horizontal` slider and to the
			 * right of a `vertical` Slider. In the `vertical` case, the rendering position is
			 * automatically reversed when rendering in an RTL locale. This can be overridden by
			 * using the[tooltipForceSide]{@link moonstone/IncrementSlider.IncrementSlider.tooltipForceSide}
			 * prop.
			 *
			 * @type {String}
			 * @default 'before'
			 * @public
			 */
			tooltipSide: PropTypes.oneOf(['before', 'after']),

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
			spotlightDisabled: false,
			step: 1,
			tooltip: false,
			tooltipAsPercent: false,
			tooltipForceSide: false,
			tooltipSide: 'before',
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
			incrementIcon: ({incrementIcon, vertical}) => (incrementIcon || (vertical ? 'arrowlargeup' : 'arrowlargeright')),
			decrementAriaLabel: ({['aria-label']: label, value}) => (`${label} ${value} ${$L('press ok button to decrease the value')}`),
			incrementAriaLabel: ({['aria-label']: label, value}) => (`${label} ${value} ${$L('press ok button to increase the value')}`)
		},

		render: ({active, backgroundProgress, decrementAriaLabel, decrementDisabled, decrementIcon, disabled, incrementAriaLabel, incrementDisabled, incrementIcon, incrementSliderClasses, inputRef, max, min, onActivate, onChange, onDecrement, onIncrement, onSpotlightDisappear, pressed, scrubbing, sliderBarRef, sliderRef, spotlightDisabled, step, tooltip, tooltipAsPercent, tooltipForceSide, tooltipSide, value, vertical, ...rest}) => (
			<div {...rest} className={incrementSliderClasses}>
				<IncrementSliderButton
					aria-label={decrementAriaLabel}
					className={css.decrementButton}
					disabled={decrementDisabled}
					onClick={onDecrement}
					onSpotlightDisappear={onSpotlightDisappear}
					spotlightDisabled={spotlightDisabled}
				>
					{decrementIcon}
				</IncrementSliderButton>
				<Slider
					active={active}
					backgroundProgress={backgroundProgress}
					className={css.slider}
					disabled={disabled}
					inputRef={inputRef}
					max={max}
					min={min}
					onActivate={onActivate}
					onChange={onChange}
					onDecrement={onDecrement}
					onIncrement={onIncrement}
					onSpotlightDisappear={onSpotlightDisappear}
					pressed={pressed}
					scrubbing={scrubbing}
					sliderBarRef={sliderBarRef}
					sliderRef={sliderRef}
					spotlightDisabled={spotlightDisabled}
					step={step}
					tooltip={tooltip}
					tooltipAsPercent={tooltipAsPercent}
					tooltipForceSide={tooltipForceSide}
					tooltipSide={tooltipSide}
					value={value}
					vertical={vertical}
				/>
				<IncrementSliderButton
					aria-label={incrementAriaLabel}
					className={css.incrementButton}
					disabled={incrementDisabled}
					onClick={onIncrement}
					onSpotlightDisappear={onSpotlightDisappear}
					spotlightDisabled={spotlightDisabled}
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
	 * {@link moonstone/IncrementSlider.IncrementSlider} is an IncrementSlider with
	 * Moonstone styling, Changeable, Pressable and SliderDecorator applied with IconButtons to
	 * increment and decrement the value.
	 *
	 * By default, `IncrementSlider` maintains the state of its `value` property. Supply the
	 * `defaultValue` property to control its initial value. If you wish to directly control updates
	 * to the component, supply a value to `value` at creation time and update it in response to
	 * `onChange` events.
	 *
	 * @class IncrementSlider
	 * @memberof moonstone/IncrementSlider
	 * @mixes ui/Changeable.Changeable
	 * @mixes ui/Pressable.Pressable
	 * @ui
	 * @public
	 */
	return Changeable(
		Pressable(
			SliderDecorator(
				Base
			)
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
