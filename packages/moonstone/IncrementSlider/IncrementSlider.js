/**
 * An interactive numeric range picker with increment decrement
 *
 * @module moonstone/IncrementSlider
 */

import {is} from '@enact/core/keymap';
import kind from '@enact/core/kind';
import {extractAriaProps} from '@enact/core/util';
import Spottable from '@enact/spotlight/Spottable';
import Changeable from '@enact/ui/Changeable';
import Slottable from '@enact/ui/Slottable';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import IdProvider from '../internal/IdProvider';
import $L from '../internal/$L';
import DisappearSpotlightDecorator from '../internal/DisappearSpotlightDecorator';
import {ProgressBarTooltip} from '../ProgressBar';
import Skinnable from '../Skinnable';
import {SliderBase} from '../Slider';
import {emitChange} from '../Slider/utils';
import SliderBehaviorDecorator from '../Slider/SliderBehaviorDecorator';

import IncrementSliderButton from './IncrementSliderButton';
import componentCss from './IncrementSlider.less';

const isDown = is('down');
const isLeft = is('left');
const isRight = is('right');
const isUp = is('up');

const Slider = Spottable(Skinnable(SliderBase));

/**
 * A stateless Slider with IconButtons to increment and decrement the value. In most circumstances,
 * you will want to use the stateful version: {@link moonstone/IncrementSlider.IncrementSlider}.
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
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * @type {Object}
		 * @private
		 */
		css: PropTypes.object,

		/**
		* Sets the hint string read when focusing the decrement button.
		*
		* @default 'press ok button to decrease the value'
		* @type {String}
		* @public
		*/
		decrementAriaLabel: PropTypes.string,

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
		* Sets the hint string read when focusing the increment button.
		*
		* @default 'press ok button to increase the value'
		* @type {String}
		* @public
		*/
		incrementAriaLabel: PropTypes.string,

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
		 * The amount to increment or decrement the position of the knob via 5-way controls.
		 *
		 * If not specified, `step` is used for the default value.
		 *
		 * @type {Number}
		 * @default 1
		 * @public
		 */
		knobStep: PropTypes.number,

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
		 * The handler to run when the decrement button becomes disabled
		 *
		 * @type {Function}
		 * @private
		 */
		onDecrementSpotlightDisappear: PropTypes.func,

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
		 * Sets the orientation of the slider, whether the slider moves left and right or up and
		 * down. Must be either `'horizontal'` or `'vertical'`.
		 *
		 * @type {String}
		 * @default 'horizontal'
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

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
		* The value of the increment slider.
		*
		* @type {Number}
		* @default 0
		* @public
		*/
		value: PropTypes.number
	},

	defaultProps: {
		backgroundProgress: 0,
		knobStep: 1,
		max: 100,
		min: 0,
		noFill: false,
		orientation: 'horizontal',
		spotlightDisabled: false,
		step: 1,
		tooltip: false,
		tooltipForceSide: false,
		tooltipSide: 'before',
		value: 0
	},

	handlers: {
		handleDecrementKeyDown: (ev, {onSpotlightDown, onSpotlightLeft, onSpotlightRight, onSpotlightUp, orientation}) => {
			const {keyCode} = ev;

			if (isLeft(keyCode) && onSpotlightLeft) {
				onSpotlightLeft(ev);
			} else if (isDown(keyCode) && onSpotlightDown) {
				onSpotlightDown(ev);
			} else if (isRight(keyCode) && onSpotlightRight && orientation === 'vertical') {
				onSpotlightRight(ev);
			} else if (isUp(keyCode) && onSpotlightUp && orientation !== 'vertical') {
				onSpotlightUp(ev);
			}
		},
		handleIncrementKeyDown: (ev, {onSpotlightDown, onSpotlightLeft, onSpotlightRight, onSpotlightUp, orientation}) => {
			const {keyCode} = ev;

			if (isRight(keyCode) && onSpotlightRight) {
				onSpotlightRight(ev);
			} else if (isUp(keyCode) && onSpotlightUp) {
				onSpotlightUp(ev);
			} else if (isLeft(keyCode) && onSpotlightLeft && orientation === 'vertical') {
				onSpotlightLeft(ev);
			} else if (isDown(keyCode) && onSpotlightDown && orientation !== 'vertical') {
				onSpotlightDown(ev);
			}
		},
		handleSliderKeyDown: (ev, {min, max, value, onSpotlightDown, onSpotlightLeft, onSpotlightRight, onSpotlightUp, orientation}) => {
			const {keyCode} = ev;
			const isMin = value <= min;
			const isMax = value >= max;

			if (orientation === 'vertical') {
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
		},
		onDecrement: emitChange(-1),
		onIncrement: emitChange(1)
	},

	styles: {
		css: componentCss,
		className: 'incrementSlider',
		publicClassNames: ['incrementSlider']
	},

	computed: {
		className: ({orientation, styler}) => styler.append(orientation),
		decrementDisabled: ({disabled, min, value}) => disabled || value <= min,
		incrementDisabled: ({disabled, max, value}) => disabled || value >= max,
		decrementIcon: ({decrementIcon, orientation}) => (decrementIcon || ((orientation === 'vertical') ? 'arrowlargedown' : 'arrowlargeleft')),
		incrementIcon: ({incrementIcon, orientation}) => (incrementIcon || ((orientation === 'vertical') ? 'arrowlargeup' : 'arrowlargeright')),
		decrementAriaLabel: ({'aria-valuetext': valueText, decrementAriaLabel, disabled, min, value}) => {
			if (decrementAriaLabel == null) {
				decrementAriaLabel = $L('press ok button to decrease the value');
			}

			return !(disabled || value <= min) ?
				`${valueText != null ? valueText : value} ${decrementAriaLabel}` :
				null;
		},
		incrementAriaLabel: ({'aria-valuetext': valueText, incrementAriaLabel, disabled, max, value}) => {
			if (incrementAriaLabel == null) {
				incrementAriaLabel = $L('press ok button to increase the value');
			}

			return !(disabled || value >= max) ?
				`${valueText != null ? valueText : value} ${incrementAriaLabel}` :
				null;
		}
	},

	render: ({active,
		'aria-hidden': ariaHidden,
		backgroundProgress,
		children,
		css,
		decrementAriaLabel,
		decrementDisabled,
		decrementIcon,
		disabled,
		focused,
		handleDecrementKeyDown,
		handleIncrementKeyDown,
		handleSliderKeyDown,
		id,
		incrementAriaLabel,
		incrementDisabled,
		incrementIcon,
		knobStep,
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
		orientation,
		spotlightDisabled,
		step,
		tooltip,
		value,
		...rest
	}) => {
		const ariaProps = extractAriaProps(rest);
		delete rest.onSpotlightDown;
		delete rest.onSpotlightLeft;
		delete rest.onSpotlightRight;
		delete rest.onSpotlightUp;

		return (
			<div {...rest}>
				<IncrementSliderButton
					aria-controls={!incrementDisabled ? id : null}
					aria-hidden={ariaHidden}
					aria-label={decrementAriaLabel}
					className={css.decrementButton}
					disabled={decrementDisabled}
					onTap={onDecrement}
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
					disabled={disabled}
					focused={focused}
					id={id}
					knobStep={knobStep}
					max={max}
					min={min}
					noFill={noFill}
					onActivate={onActivate}
					onChange={onChange}
					onKeyDown={handleSliderKeyDown}
					onSpotlightDisappear={onSpotlightDisappear}
					orientation={orientation}
					spotlightDisabled={spotlightDisabled}
					step={step}
					tooltip={tooltip}
					value={value}
				>
					{children}
				</Slider>
				<IncrementSliderButton
					aria-controls={!decrementDisabled ? id : null}
					aria-hidden={ariaHidden}
					aria-label={incrementAriaLabel}
					className={css.incrementButton}
					disabled={incrementDisabled}
					onTap={onIncrement}
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

const IncrementSliderDecorator = compose(
	Pure,
	Changeable,
	IdProvider({generateProp: null, prefix: 's_'}),
	DisappearSpotlightDecorator({
		events: {
			onIncrementSpotlightDisappear: `.${componentCss.decrementButton}`,
			onDecrementSpotlightDisappear: `.${componentCss.incrementButton}`
		}
	}),
	SliderBehaviorDecorator,
	Skinnable,
	Slottable({slots: ['knob', 'tooltip']})
);

/**
 * An IncrementSlider with Moonstone styling and SliderDecorator applied with IconButtons to
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
const IncrementSlider = IncrementSliderDecorator(IncrementSliderBase);

/**
 * A [Tooltip]{@link moonstone/TooltipDecorator.Tooltip} specifically adapted for use with
 * [IncrementSlider]{@link moonstone/IncrementSlider.IncrementSlider},
 * [ProgressBar]{@link moonstone/ProgressBar.ProgressBar}, or
 * [Slider]{@link moonstone/Slider.Slider}.
 *
 * See {@link moonstone/ProgressBar.ProgressBarTooltip}
 *
 * @class IncrementSliderTooltip
 * @memberof moonstone/IncrementSlider
 * @ui
 * @public
 */

export default IncrementSlider;
export {
	IncrementSlider,
	IncrementSliderBase,
	IncrementSliderDecorator,
	ProgressBarTooltip as IncrementSliderTooltip
};
