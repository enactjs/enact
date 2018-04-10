/**
 * Exports the {@link moonstone/Slider.Slider} component.
 *
 * @module moonstone/Slider
 */

import {forKey, forProp, forward, forwardWithPrevent, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import Changeable from '@enact/ui/Changeable';
import Spottable from '@enact/spotlight/Spottable';
import Slottable from '@enact/ui/Slottable';
import UiSlider from '@enact/ui/Slider';
import PropTypes from 'prop-types';
import anyPass from 'ramda/src/anyPass';
import compose from 'ramda/src/compose';
import React from 'react';

import {ProgressBarTooltip} from '../ProgressBar';
import Skinnable from '../Skinnable';

import SliderBehaviorDecorator from './SliderBehaviorDecorator';
import {
	forwardSpotlightEvents,
	handleDecrement,
	handleIncrement
} from './utils';

import componentCss from './Slider.less';

/**
 * Range-selection input component
 *
 * @class Slider
 * @memberof moonstone/Slider
 * @mixes moonstone/Slider.SliderDecorator
 * @ui
 * @public
 */
const SliderBase = kind({
	name: 'Slider',

	propTypes: {

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
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * @type {Object}
		 * @private
		 */
		css: PropTypes.object,

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
		knob: PropTypes.node,

		/**
		 * The amount to increment or decrement the position of the knob via 5-way controls.
		 * When `detachedKnob` is false, the knob must first be activated by selecting it. When
		 * `detachedKnob` is true, the knob will respond to direction key presses without
		 * activation.
		 *
		 * If not specified, `step` is used for the default value.
		 *
		 * @type {Number}
		 * @public
		 */
		knobStep: PropTypes.number,

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
		 * If `true` the slider will be oriented vertically.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		orientation: PropTypes.string,

		/**
		 * When `true`, a pressed visual effect is applied
		 *
		 * @type {Boolean}
		 * @public
		 */
		pressed: PropTypes.bool,

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
		 * @type {Boolean|Element|Function}
		 * @public
		 */
		tooltip: PropTypes.oneOfType([PropTypes.bool, PropTypes.object, PropTypes.func]),

		/**
		 * The value of the slider.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: PropTypes.number
	},

	defaultProps: {
		activateOnFocus: false,
		active: false,
		disabled: false,
		value: 0
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
			forwardWithPrevent('onKeyDown'),
			forwardSpotlightEvents,
			anyPass([
				handleIncrement,
				handleDecrement
			])
		),
		onKeyUp: handle(
			forwardWithPrevent('onKeyUp'),
			forProp('activateOnFocus', false),
			forKey('enter'),
			forward('onActivate')
		)
	},

	computed: {
		className: ({activateOnFocus, active, styler}) => styler.append({
			activateOnFocus,
			active
		}),
		tooltipComponent: ({focused, tooltip}) => {
			if (tooltip === true) {
				return (
					<ProgressBarTooltip
						visible={focused}
					/>
				);
			}

			return tooltip;
		}
	},

	render: ({css, knob, ...rest}) => {
		delete rest.activateOnFocus;
		delete rest.active;
		delete rest.focused;
		delete rest.onActivate;
		delete rest.tooltip;

		return (
			<UiSlider
				{...rest}
				css={css}
				knobComponent={knob}
			/>
		);
	}
});

/**
 * Moonstone-specific slider behaviors to apply to [Button]{@link moonstone/Slider.SliderBase}.
 *
 * @hoc
 * @memberof moonstone/Slider
 * @mixes ui/Changeable.Changeable
 * @mixes spotlight/Spottable.Spottable
 * @mixes ui/Skinnable.Skinnable
 * @public
 */
const SliderDecorator = compose(
	Changeable,
	SliderBehaviorDecorator,
	Spottable,
	Slottable({slots: ['knob', 'tooltip']}),
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
 * @mixes moonstone/Slider.SliderDecorator
 * @ui
 * @public
 */
const Slider = SliderDecorator(SliderBase);

/**
 * A {@link moonstone/TooltipDecorator.Tooltip} specifically adapted for use with
 * {@link moonstone/IncrementSlider.IncrementSlider}, {@link moonstone/ProgressBar.ProgressBar},
 * or {@link moonstone/Slider.Slider}.
 *
 * See {@link moonstone/ProgressBar.ProgressBarTooltip}
 *
 * @class SliderTooltip
 * @memberof moonstone/Slider
 * @ui
 * @public
 */

export default Slider;
export {
	Slider,
	SliderBase,
	SliderDecorator,
	ProgressBarTooltip as SliderTooltip
};
