/**
 * Exports the {@link moonstone/Slider.Slider} component.
 *
 * @module moonstone/Slider
 */

import {forKey, forProp, forward, handle, oneOf, stopImmediate} from '@enact/core/handle';
import kind from '@enact/core/kind';
import {memoize} from '@enact/core/util';
import ilib from '@enact/i18n';
import NumFmt from '@enact/i18n/ilib/lib/NumFmt';
import Spottable from '@enact/spotlight/Spottable';
import Pure from '@enact/ui/internal/Pure';
import Touchable from '@enact/ui/Touchable';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import InternalSliderDecorator from '../internal/SliderDecorator';
import {computeProportionProgress} from '../internal/SliderDecorator/util';
import Skinnable from '../Skinnable';

import SliderBar from './SliderBar';
import SliderTooltip from './SliderTooltip';

import componentCss from './Slider.less';

const isActive = (ev, props) => props.active || props.activateOnFocus || props.detachedKnob;
const isIncrement = (ev, props) => forKey(props.vertical ? 'up' : 'right', ev);
const isDecrement = (ev, props) => forKey(props.vertical ? 'down' : 'left', ev);

// memoize percent formatter for each locale so that we only instantiate NumFmt when locale changes
const memoizedPercentFormatter = memoize((/* locale */) => new NumFmt({type: 'percentage', useNative: false}));

/**
 * A stateless range-selection input. In most circumstances, you will want to use the stateful
 * version: {@link moonstone/Slider.Slider}.
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
		 * Overrides the `aria-valuetext` for the slider. By default, `aria-valuetext` is set
		 * to the current value. This should only be used when the parent controls the value of
		 * the slider directly through the props.
		 *
		 * @type {String|Number}
		 * @memberof moonstone/Slider.SliderBase.prototype
		 * @public
		 */
		'aria-valuetext': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

		/**
		 * When `true`, the component may be manipulated via the directional input keys upon
		 * receiving focus.
		 *
		 * @type {Boolean}
		 * @public
		 */
		activateOnFocus: PropTypes.bool,

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
		 * When `true`, the tooltip, if present, is shown
		 * @type {Boolean}
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
		* When not `vertical`, determines which side of the knob the tooltip appears on.
		* When `false`, the tooltip will be on the left side, when `true`, the tooltip will
		* be on the right.
		*
		* @type {String}
		* @private
		*/
		knobAfterMidpoint: PropTypes.bool,

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
		 * @public
		 */
		pressed: PropTypes.bool,

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
		 * The amount to increment or decrement the value.
		 *
		 * @type {Number}
		 * @default 1
		 * @public
		 */
		step: PropTypes.number,

		/**
		 * Enables the built-in tooltip, whose behavior can be modified by the other tooltip
		 * properties.
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
		 * @public
		 */
		vertical: PropTypes.bool
	},

	defaultProps: {
		activateOnFocus: false,
		active: false,
		backgroundProgress: 0,
		knobAfterMidpoint: false,
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
		css: componentCss,
		className: 'slider',
		publicClassNames: true
	},

	handlers: {
		onBlur: handle(
			forward('onBlur'),
			forProp('active', true),
			forward('onActivate')
		),
		onKeyDown: handle(
			forward('onKeyDown'),
			isActive,
			oneOf(
				[isDecrement, forward('onDecrement')],
				[isIncrement, forward('onIncrement')]
			),
			stopImmediate
		),
		onKeyUp: handle(
			forward('onKeyUp'),
			forProp('activateOnFocus', false),
			forKey('enter'),
			forward('onActivate')
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
		children: ({children, max, min, tooltip, tooltipAsPercent, value}) => {
			if (!tooltip || children) return children;

			if (tooltipAsPercent) {
				const formatter = memoizedPercentFormatter(ilib.getLocale());
				const percent = Math.floor(computeProportionProgress({value, max, min}) * 100);

				return formatter.format(percent);
			}

			return value;
		},
		className: ({activateOnFocus, active, noFill, pressed, vertical, styler}) => styler.append({
			activateOnFocus,
			active,
			noFill,
			pressed,
			vertical,
			horizontal: !vertical
		}),
		proportionProgress: computeProportionProgress
	},

	render: ({backgroundProgress, children, css, disabled, focused, inputRef, knobAfterMidpoint, max, min, onBlur, onChange, onKeyDown, onMouseMove, onMouseUp, proportionProgress, scrubbing, sliderBarRef, sliderRef, step, tooltip, tooltipForceSide, tooltipSide, value, vertical, ...rest}) => {
		delete rest.activateOnFocus;
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

		// when `tooltip` is `false`, use custom tooltip provided in `children`
		if (!tooltip) {
			tooltipComponent = children;
		} else if (focused) {
			// only display tooltip when `focused`
			tooltipComponent = <SliderTooltip
				knobAfterMidpoint={knobAfterMidpoint}
				forceSide={tooltipForceSide}
				proportion={proportionProgress}
				side={tooltipSide}
				vertical={vertical}
			>
				{children}
			</SliderTooltip>;
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
					css={css}
					proportionBackgroundProgress={backgroundProgress}
					proportionProgress={proportionProgress}
					ref={sliderBarRef}
					vertical={vertical}
					scrubbing={scrubbing}
				>
					{tooltipComponent}
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

const SliderDecorator = compose(
	Pure,
	Spottable,
	InternalSliderDecorator,
	Touchable,
	Skinnable
);

/**
 * Range-selection input with Moonstone styling, Spottable, Touchable and SliderDecorator applied.
 *
 * By default, `Slider` maintains the state of its `value` property. Supply the `defaultValue`
 * property to control its initial value. If you wish to directly control updates to the
 * component, supply a value to `value` at creation time and update it in response to `onChange`
 * events.
 *
 * @class Slider
 * @memberof moonstone/Slider
 * @mixes ui/Touchable.Touchable
 * @mixes spotlight/Spottable.Spottable
 * @ui
 * @public
 */
const Slider = SliderDecorator(SliderBase);

export default Slider;
export {
	Slider,
	SliderBase,
	SliderDecorator,
	SliderTooltip
};
