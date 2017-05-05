/**
 * Exports the {@link moonstone/Slider.Slider} component.
 *
 * @module moonstone/Slider
 */

import Changeable from '@enact/ui/Changeable';
import factory from '@enact/core/factory';
import {forKey, forward, handle, stopImmediate} from '@enact/core/handle';
import kind from '@enact/core/kind';
import Pressable from '@enact/ui/Pressable';
import React from 'react';
import PropTypes from 'prop-types';
import Spottable from '@enact/spotlight/Spottable';

import SliderDecorator from '../internal/SliderDecorator';
import {computeProportionProgress} from '../internal/SliderDecorator/util';

import {SliderBarFactory} from './SliderBar';
import SliderTooltip from './SliderTooltip';
import componentCss from './Slider.less';

const isActive = (ev, props) => props.active || props.detachedKnob;
const isIncrement = (ev, props) => forKey(props.vertical ? 'up' : 'right', ev);
const isDecrement = (ev, props) => forKey(props.vertical ? 'down' : 'left', ev);

const handleDecrement = handle(
	isActive,
	isDecrement,
	forward('onDecrement'),
	stopImmediate
);

const handleIncrement = handle(
	isActive,
	isIncrement,
	forward('onIncrement'),
	stopImmediate
);

const handleActivate = handle(
	forKey('enter'),
	forward('onActivate'),
	stopImmediate
);

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
			 * The slider can change its behavior to have the knob follow the cursor as it moves
			 * across the slider, without applying the position. A click or drag behaves the same.
			 * This is primarily used by media playback. Setting this to `true` enables this behavior.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
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
			 * When `true`, the tooltip is shown when present
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			focused: PropTypes.bool,

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
			 * When `true`, the slider bar doesn't show a fill and doesn't highlight when spotted
			 *
			 * @type {Boolean}
			 * @default false
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
			 * @param {Number} event.value Value of the slider
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
			 * The handler to run when the knob moves. This method is only called when running
			 * `Slider` with `detachedKnob`. If you need to run a callback without a detached knob
			 * use the more traditional `onChange` property.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @param {Number} event.proportion The proportional position of the knob across the slider
			 * @param {Boolean} event.detached `true` if the knob is currently detached, `false` otherwise
			 * @public
			 */
			onKnobMove: PropTypes.func,

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
			 * supplying a component as a child of `Slider`.
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
			 * using the [tooltipForceSide]{@link moonstone/Slider.Slider.tooltipForceSide} prop.
			 *
			 * @type {String}
			 * @default 'before'
			 * @public
			 */
			tooltipSide: PropTypes.oneOf(['before', 'after']),

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
			active: false,
			backgroundProgress: 0,
			detachedKnob: false,
			focused: false,
			max: 100,
			min: 0,
			noFill: false,
			onChange: () => {}, // needed to ensure the base input element is mutable if no change handler is provided
			pressed: false,
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
			className: 'slider'
		},

		handlers: {
			onBlur: handle(
				forward('onBlur'),
				isActive,
				forward('onActivate')
			),
			onKeyDown: handle(
				forward('onKeyDown'),
				(ev, props) => {
					return	handleDecrement(ev, props) ||
							handleIncrement(ev, props) ||
							handleActivate(ev, props);
				}
			),
			onMouseUp: handle(
				forward('onMouseUp'),
				(ev) => {
					// This bit of hackery allows us to use the <input> for dragging but sends the
					// focus back to the component when the pointer is released. It works because,
					// for some reason, the <input> still sends a mouseup event even when the
					// pointer is released while off the <input>.
					if (ev.target.nodeName === 'INPUT') {
						ev.currentTarget.focus();
					}
				}
			)
		},

		computed: {
			tooltipValue: ({max, min, tooltipAsPercent, value}) => {
				return tooltipAsPercent ? Math.floor(computeProportionProgress({value, max, min}) * 100) + '%' : value;
			},
			className: ({active, noFill, pressed, vertical, styler}) => styler.append({
				active,
				noFill,
				pressed,
				vertical,
				horizontal: !vertical
			}),
			proportionProgress: computeProportionProgress
		},

		render: ({backgroundProgress, children, disabled, focused, inputRef, max, min, onBlur, onChange, onKeyDown, onMouseMove, onMouseUp, proportionProgress, scrubbing, sliderBarRef, sliderRef, step, tooltip, tooltipForceSide, tooltipSide, tooltipValue, value, vertical, ...rest}) => {
			delete rest.active;
			delete rest.detachedKnob;
			delete rest.noFill;
			delete rest.onActivate;
			delete rest.onDecrement;
			delete rest.onIncrement;
			delete rest.onKnobMove;
			delete rest.pressed;
			delete rest.tooltipAsPercent;

			let tooltipComponent = null;

			if (tooltip) {
				tooltipComponent = <SliderTooltip
					forceSide={tooltipForceSide}
					proportion={proportionProgress}
					side={tooltipSide}
					vertical={vertical}
				>
					{tooltipValue}
				</SliderTooltip>;
			} else {
				tooltipComponent = children;
			}

			return (
				<div
					{...rest}
					aria-disabled={disabled}
					disabled={disabled}
					onBlur={onBlur}
					onKeyDown={onKeyDown}
					onMouseUp={onMouseUp}
					ref={sliderRef}
				>
					<SliderBar
						proportionBackgroundProgress={backgroundProgress}
						proportionProgress={proportionProgress}
						ref={sliderBarRef}
						vertical={vertical}
						scrubbing={scrubbing}
					>
						{focused ? tooltipComponent : null}
					</SliderBar>
					<input
						aria-disabled={disabled}
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
	 * {@link moonstone/Slider.Slider} is a Slider with Moonstone styling, Spottable, Changeable,
	 * Pressable and SliderDecorator applied.
	 *
	 * By default, `Slider` maintains the state of its `value` property. Supply the `defaultValue`
	 * property to control its initial value. If you wish to directly control updates to the
	 * component, supply a value to `value` at creation time and update it in response to `onChange`
	 * events.
	 *
	 * @class Slider
	 * @memberof moonstone/Slider
	 * @mixes ui/Changeable.Changeable
	 * @mixes ui/Pressable.Pressable
	 * @mixes spotlight/Spottable.Spottable
	 * @ui
	 * @public
	 */
	return Changeable(
		Pressable(
			Spottable(
				SliderDecorator(
					Base
				)
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
	SliderFactory,
	SliderTooltip
};
