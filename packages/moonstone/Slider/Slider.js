/**
 * Exports the {@link moonstone/Slider.Slider} component.
 *
 * @module moonstone/Slider
 */

import factory from '@enact/core/factory';
import {forKey, forward, handle, stopImmediate} from '@enact/core/handle';
import kind from '@enact/core/kind';
import Pressable from '@enact/ui/Pressable';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import React, {PropTypes} from 'react';
import {Spottable} from '@enact/spotlight';
import Tooltip from '../TooltipDecorator/Tooltip';

import SliderDecorator from '../internal/SliderDecorator';
import {computeProportionProgress} from '../internal/SliderDecorator/util';

import {SliderBarFactory} from './SliderBar';
import componentCss from './Slider.less';

const isActive = (ev, props) => props.active || props.detachedKnob;
const isIncrement = (ev, props) => forKey(props.vertical ? 'up' : 'right', ev);
const isDecrement = (ev, props) => forKey(props.vertical ? 'down' : 'left', ev);
const proportion = (value, min = 0, max = 100) => ((value - min) / (max - min));

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
	const IntlSlider = kind({
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
			 * Disables the built-in tooltip. A custom tooltip may still be used  by supplying a
			 * component as a child of `Slider`, which follows the knob.
			 *
			 * @type {[type]}
			 */
			noTooltip: PropTypes.bool,

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
			 * Converts the contents of the built-in tooltip to a percentage of the bar.
			 * The percentage respects the min and max value props.
			 *
			 * @type {Boolean}
			 * @public
			 */
			tooltipAsPercent: PropTypes.bool,

			/**
			 * [tooltipSide description]
			 *
			 * @type {Boolean}
			 */
			tooltipForceSide: PropTypes.bool,

			/**
			 * [tooltipSide description]
			 *
			 * @type {String}
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
			max: 100,
			min: 0,
			onChange: () => {}, // needed to ensure the base input element is mutable if no change handler is provided
			pressed: false,
			step: 1,
			tooltip: false,
			tooltipAsPercent: false,
			tooltipSide: 'after',
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
			children: ({children, max, min, noTooltip, tooltipSide, tooltipAsPercent, value, vertical}, context) => {
				if (noTooltip) return children;
				const content = tooltipAsPercent ? Math.floor(proportion(value, min, max) * 100) + '%' : value;

				let dir, dirClass, anchor;
				if (vertical) {
					anchor = 'middle';
					if (
						(tooltipSide === 'left') ||
						(!context.rtl && tooltipSide === 'before') ||
						(context.rtl && tooltipSide === 'after')
						) {
						dir = 'left';
					} else {
						dir = 'right';
					}
					dirClass = tooltipSide || 'after';
				} else {
					anchor = proportion(value, min, max) < 0.5 ? 'right' : 'left';
					dirClass = tooltipSide || 'before';
					dir = (tooltipSide === 'before' ? 'above' : 'below');
				}

				return (
					<Tooltip
						className={css.tooltip + ' ' + css[anchor] + ' ' + css[dirClass]}
						arrowAnchor={anchor}
						direction={dir}
					>
						{children || content}
					</Tooltip>
				);
			},
			className: ({active, pressed, vertical, styler}) => styler.append({
				active,
				pressed,
				vertical,
				horizontal: !vertical
			}),
			proportionProgress: computeProportionProgress
		},

		render: ({backgroundProgress, children, disabled, inputRef, max, min, onBlur, onChange, onKeyDown, onMouseMove, onMouseUp, proportionProgress, scrubbing, sliderBarRef, sliderRef, step, value, vertical, ...rest}) => {
			delete rest.active;
			delete rest.detachedKnob;
			delete rest.noTooltip;
			delete rest.onActivate;
			delete rest.onDecrement;
			delete rest.onIncrement;
			delete rest.onKnobMove;
			delete rest.pressed;
			delete rest.tooltipAsPercent;
			delete rest.tooltipSide;

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
						{children}
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

	IntlSlider.contextTypes = contextTypes;

	return IntlSlider;
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
