/**
 * Exports the {@link moonstone/IncrementSlider.IncrementSlider} component.
 *
 * @module moonstone/IncrementSlider
 */

import deprecate from '@enact/core/internal/deprecate';
import {extractAriaProps} from '@enact/core/util';
import {privateFactory as factory} from '@enact/core/factory';
import {is} from '@enact/core/keymap';
import kind from '@enact/core/kind';
import {privatePressable as Pressable} from '@enact/ui/Pressable';
import React from 'react';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';
import Spottable from '@enact/spotlight/Spottable';

import IdProvider from '../internal/IdProvider';
import $L from '../internal/$L';
import DisappearSpotlightDecorator from '../internal/DisappearSpotlightDecorator';
import Skinnable from '../Skinnable';
import {PrivateSliderBaseFactory as SliderBaseFactory} from '../Slider';
import SliderDecorator from '../internal/SliderDecorator';

import IncrementSliderButton from './IncrementSliderButton';
import componentCss from './IncrementSlider.less';

const isDown = is('down');
const isLeft = is('left');
const isRight = is('right');
const isUp = is('up');

const PrivateIncrementSliderBaseFactory = factory({css: componentCss}, ({css}) => {
	const Slider = Pressable(Spottable(Skinnable(SliderBaseFactory({css}))));

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
			 * When `true`, prevents read out of both the slider and the increment and decrement
			 * buttons.
			 *
			 * @type {Boolean}
			 * @memberof moonstone/IncrementSlider.IncrementSliderBase.prototype
			 * @public
			 */
			'aria-hidden': PropTypes.bool,

			/**
			 * Overrides the `aria-valuetext` for the slider. By default, `aria-valuetext` is set
			 * to the current value. This should only be used when the parent controls the value of
			 * the slider directly through the props.
			 *
			 * @type {String|Number}
			 * @memberof moonstone/IncrementSlider.IncrementSliderBase.prototype
			 * @public
			 */
			'aria-valuetext': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

			/**
			 * When `true`, the knob displays selected and can be moved using 5-way controls.
			 *
			 * @type {Boolean}
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
			 * The custom value or component for the tooltip. If [tooltip]{@link moonstone/Slider.SliderBase#tooltip},
			 * is `true`, then it will use built-in tooltip with given a string. If `false`, a custom tooltip
			 * component, which follows the knob, may be used instead.
			 *
			 * @type {String|Node}
			 */
			children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

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
			 * The slider can change its behavior to have the knob follow the cursor as it moves
			 * across the slider, without applying the position. A click or drag behaves the same.
			 * This is primarily used by media playback. Setting this to `true` enables this behavior.
			 *
			 * @type {Boolean}
			 * @public
			 */
			detachedKnob: PropTypes.bool,

			/**
			 * When `true`, the component is shown as disabled and does not generate events
			 *
			 * @type {Boolean}
			 * @public
			 */
			disabled: PropTypes.bool,

			/**
			 * When `true`, the tooltip is shown when present
			 * @type {Boolean}
			 * @public
			 */
			focused: PropTypes.bool,

			/**
			 * The slider id reference for setting aria-controls.
			 *
			 * @type {String}
			 * @private
			 */
			id: PropTypes.string,

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
			* When not `vertical`, determines which side of the knob the tooltip appears on.
			* When `false`, the tooltip will be on the left side, when `true`, the tooltip will
			* be on the right.
			*
			* @type {String}
			* @private
			*/
			knobAfterMidpoint: PropTypes.bool,

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
			 * When `true`, the slider bar doesn't show a fill and doesn't highlight when spotted
			 *
			 * @type {Boolean}
			 * @public
			 */
			noFill: PropTypes.bool,

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
			 * The handler to run when the decrement button becomes disabled
			 *
			 * @type {Function}
			 * @private
			 */
			onDecrementSpotlightDisappear: PropTypes.func,

			/**
			 * The handler to run when the value is incremented.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onIncrement: PropTypes.func,

			/**
			 * The handler to run when the increment button becomes disabled
			 *
			 * @type {Function}
			 * @private
			 */
			onIncrementSpotlightDisappear: PropTypes.func,

			/**
			 * The handler to run when the component is removed while retaining focus.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightDisappear: PropTypes.func,

			/**
			 * The handler to run prior to focus leaving the component when the 5-way down key is pressed.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightDown: PropTypes.func,

			/**
			 * The handler to run prior to focus leaving the component when the 5-way left key is pressed.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightLeft: PropTypes.func,

			/**
			 * The handler to run prior to focus leaving the component when the 5-way right key is pressed.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightRight: PropTypes.func,

			/**
			 * The handler to run prior to focus leaving the component when the 5-way up key is pressed.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightUp: PropTypes.func,

			/**
			 * `scrubbing` only has an effect with a detachedKnob, and is a performance optimization
			 * to not allow re-assignment of the knob's value (and therefore position) during direct
			 * user interaction.
			 *
			 * @type {Boolean}
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
			 * @public
			 */
			tooltip: PropTypes.bool,

			/**
			 * Converts the contents of the built-in tooltip to a percentage of the bar.
			 * The percentage respects the min and max value props.
			 *
			 * @type {Boolean}
			 * @public
			 */
			tooltipAsPercent: PropTypes.bool,

			/**
			 * Setting to `true` overrides the natural LTR->RTL tooltip side-flipping for locale
			 * changes for `vertical` sliders. This may be useful if you have a static layout that
			 * does not automatically reverse when in an RTL language.
			 *
			 * @type {Boolean}
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
			* @public
			*/
			vertical: PropTypes.bool
		},

		defaultProps: {
			backgroundProgress: 0,
			knobAfterMidpoint: false,
			max: 100,
			min: 0,
			noFill: false,
			spotlightDisabled: false,
			step: 1,
			tooltip: false,
			tooltipAsPercent: false,
			tooltipForceSide: false,
			tooltipSide: 'before',
			value: 0,
			vertical: false
		},

		handlers: {
			handleDecrementKeyDown: (ev, {onSpotlightDown, onSpotlightLeft, onSpotlightRight, onSpotlightUp, vertical}) => {
				const {keyCode} = ev;

				if (isLeft(keyCode) && onSpotlightLeft) {
					onSpotlightLeft(ev);
				} else if (isDown(keyCode) && onSpotlightDown) {
					onSpotlightDown(ev);
				} else if (isRight(keyCode) && onSpotlightRight && vertical) {
					onSpotlightRight(ev);
				} else if (isUp(keyCode) && onSpotlightUp && !vertical) {
					onSpotlightUp(ev);
				}
			},
			handleIncrementKeyDown: (ev, {onSpotlightDown, onSpotlightLeft, onSpotlightRight, onSpotlightUp, vertical}) => {
				const {keyCode} = ev;

				if (isRight(keyCode) && onSpotlightRight) {
					onSpotlightRight(ev);
				} else if (isUp(keyCode) && onSpotlightUp) {
					onSpotlightUp(ev);
				} else if (isLeft(keyCode) && onSpotlightLeft && vertical) {
					onSpotlightLeft(ev);
				} else if (isDown(keyCode) && onSpotlightDown && !vertical) {
					onSpotlightDown(ev);
				}
			},
			handleSliderKeyDown: (ev, {min, max, value, onSpotlightDown, onSpotlightLeft, onSpotlightRight, onSpotlightUp, vertical}) => {
				const {keyCode} = ev;
				const isMin = value <= min;
				const isMax = value >= max;

				if (vertical) {
					if (isLeft(keyCode) && onSpotlightLeft) {
						onSpotlightLeft(ev);
					} else if (isRight(keyCode) && onSpotlightRight) {
						onSpotlightRight(ev);
					} else if (isDown(keyCode) && isMin && onSpotlightDown) {
						onSpotlightDown(ev);
					} else if (isUp(keyCode) && isMax && onSpotlightUp) {
						onSpotlightUp(ev);
					}
				} else if (isLeft(keyCode) && isMin && onSpotlightLeft) {
					onSpotlightLeft(ev);
				} else if (isRight(keyCode) && isMax && onSpotlightRight) {
					onSpotlightRight(ev);
				} else if (isDown(keyCode) && onSpotlightDown) {
					onSpotlightDown(ev);
				} else if (isUp(keyCode) && onSpotlightUp) {
					onSpotlightUp(ev);
				}
			}
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
			decrementAriaLabel: ({'aria-valuetext': valueText, disabled, min, value}) => !(disabled || value <= min) ? (`${valueText != null ? valueText : value} ${$L('press ok button to decrease the value')}`) : null,
			incrementAriaLabel: ({'aria-valuetext': valueText, disabled, max, value}) => !(disabled || value >= max) ? (`${valueText != null ? valueText : value} ${$L('press ok button to increase the value')}`) : null
		},

		render: ({active,
			'aria-hidden': ariaHidden,
			backgroundProgress,
			children,
			decrementAriaLabel,
			decrementDisabled,
			decrementIcon,
			detachedKnob,
			disabled,
			focused,
			handleDecrementKeyDown,
			handleIncrementKeyDown,
			handleSliderKeyDown,
			id,
			incrementAriaLabel,
			incrementDisabled,
			incrementIcon,
			incrementSliderClasses,
			inputRef,
			knobAfterMidpoint,
			max,
			min,
			noFill,
			onActivate,
			onChange,
			onDecrement,
			onDecrementSpotlightDisappear,
			onIncrement,
			onIncrementSpotlightDisappear,
			onSpotlightDisappear,
			scrubbing,
			sliderBarRef,
			sliderRef,
			spotlightDisabled,
			step,
			tooltip,
			tooltipAsPercent,
			tooltipForceSide,
			tooltipSide,
			value,
			vertical,
			...rest
		}) => {
			const ariaProps = extractAriaProps(rest);
			delete rest.onSpotlightDown;
			delete rest.onSpotlightLeft;
			delete rest.onSpotlightRight;
			delete rest.onSpotlightUp;

			return (
				<div {...rest} className={incrementSliderClasses}>
					<IncrementSliderButton
						aria-controls={!incrementDisabled ? id : null}
						aria-hidden={ariaHidden}
						aria-label={decrementAriaLabel}
						className={css.decrementButton}
						disabled={decrementDisabled}
						onClick={onDecrement}
						onKeyDown={handleDecrementKeyDown}
						onSpotlightDisappear={onDecrementSpotlightDisappear}
						spotlightDisabled={spotlightDisabled}
					>
						{decrementIcon}
					</IncrementSliderButton>
					<Slider
						{...ariaProps}
						active={active}
						aria-hidden={ariaHidden}
						backgroundProgress={backgroundProgress}
						className={css.slider}
						detachedKnob={detachedKnob}
						disabled={disabled}
						focused={focused}
						id={id}
						inputRef={inputRef}
						knobAfterMidpoint={knobAfterMidpoint}
						max={max}
						min={min}
						noFill={noFill}
						onActivate={onActivate}
						onChange={onChange}
						onDecrement={onDecrement}
						onIncrement={onIncrement}
						onKeyDown={handleSliderKeyDown}
						onSpotlightDisappear={onSpotlightDisappear}
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
					>
						{children}
					</Slider>
					<IncrementSliderButton
						aria-controls={!decrementDisabled ? id : null}
						aria-hidden={ariaHidden}
						aria-label={incrementAriaLabel}
						className={css.incrementButton}
						disabled={incrementDisabled}
						onClick={onIncrement}
						onKeyDown={handleIncrementKeyDown}
						onSpotlightDisappear={onIncrementSpotlightDisappear}
						spotlightDisabled={spotlightDisabled}
					>
						{incrementIcon}
					</IncrementSliderButton>
				</div>
			);
		}
	});
});

const PrivateIncrementSliderFactory = factory((config) => {
	const Base = PrivateIncrementSliderBaseFactory(config);

	/**
	 * {@link moonstone/IncrementSlider.IncrementSlider} is an IncrementSlider with
	 * Moonstone styling and SliderDecorator applied with IconButtons to
	 * increment and decrement the value.
	 *
	 * By default, `IncrementSlider` maintains the state of its `value` property. Supply the
	 * `defaultValue` property to control its initial value. If you wish to directly control updates
	 * to the component, supply a value to `value` at creation time and update it in response to
	 * `onChange` events.
	 *
	 * @class IncrementSlider
	 * @memberof moonstone/IncrementSlider
	 * @ui
	 * @public
	 */
	return Pure(
		IdProvider(
			{generateProp: null, prefix: 's_'},
			SliderDecorator(
				DisappearSpotlightDecorator(
					{events: {
						onIncrementSpotlightDisappear: `.${componentCss.decrementButton}`,
						onDecrementSpotlightDisappear: `.${componentCss.incrementButton}`
					}},
					Base
				)
			)
		)
	);
});

const IncrementSliderFactory = deprecate(PrivateIncrementSliderFactory, {name: 'IncrementSliderFactory', since: '1.14.0', until: '2.0.0'});
const IncrementSliderBaseFactory = deprecate(PrivateIncrementSliderBaseFactory, {name: 'IncrementSliderBaseFactory', since: '1.14.0', until: '2.0.0'});
const IncrementSliderBase = PrivateIncrementSliderBaseFactory();
const IncrementSlider = PrivateIncrementSliderFactory();

export default IncrementSlider;
export {
	IncrementSlider,
	IncrementSliderBase,
	IncrementSliderBaseFactory,
	IncrementSliderFactory
};
