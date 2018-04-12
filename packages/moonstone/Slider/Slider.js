/**
 * Provides a Moonstone-themed slider components and behaviors
 *
 * @module moonstone/Slider
 * @exports Slider
 * @exports SliderBase
 * @exports SliderDecorator
 */

import {forKey, forProp, forward, forwardWithPrevent, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';
import ComponentOverride from '@enact/ui/ComponentOverride';
import Changeable from '@enact/ui/Changeable';
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
 * @class SliderBase
 * @extends ui/Slider.Slider
 * @memberof moonstone/Slider
 * @ui
 * @public
 */
const SliderBase = kind({
	name: 'Slider',

	propTypes: /** @lends moonstone/Slider.SliderBase.prototype */ {
		/**
		 * Overrides the `aria-valuetext` for the slider.
		 *
		 * By default, `aria-valuetext` is set to the current value. This should only be used when
		 * the parent controls the value of the slider directly through the props.
		 *
		 * @type {String|Number}
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
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `slider` - The root component class
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * When `true`, the tooltip, if present, is shown
		 *
		 * @type {Boolean}
		 * @public
		 */
		focused: PropTypes.bool,

		/**
		 * The handler when the knob is activated or deactivated by selecting it via 5-way
		 *
		 * @type {Function}
		 * @public
		 */
		onActivate: PropTypes.func,

		/**
		 * Enables the built-in tooltip
		 *
		 * To customize the tooltip, pass either a custom Tooltip component or an instance of
		 * [SliderTooltip]{@link moonstone/Slider.SliderTooltip} with additional props configured.
		 *
		 * ```
		 * <Slider
		 *   tooltip={
		 *     <SliderTooltip percent side="after" />
		 *   }
		 * />
		 * ```
		 *
		 * The tooltip may also be passed as a child via the `"tooltip"` slot. See
		 * [Slottable]{@link ui/Slottable} for more information on how slots can be used.
		 *
		 * ```
		 * <Slider>
		 *   <SliderTooltip percent side="after" />
		 * </Slider>
		 * ```
		 *
		 * @type {Boolean|Element|Function}
		 * @public
		 */
		tooltip: PropTypes.oneOfType([PropTypes.bool, PropTypes.object, PropTypes.func])
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
		tooltip: ({tooltip}) => tooltip === true ? ProgressBarTooltip : tooltip
	},

	render: ({css, focused, tooltip, ...rest}) => {
		delete rest.activateOnFocus;
		delete rest.active;
		delete rest.focused;
		delete rest.onActivate;
		delete rest.tooltip;

		return (
			<UiSlider
				{...rest}
				css={css}
				tooltipComponent={
					<ComponentOverride
						component={tooltip}
						visible={focused}
					/>
				}
			/>
		);
	}
});

/**
 * Moonstone-specific slider behaviors to apply to [SliderBase]{@link moonstone/Slider.SliderBase}.
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
 * A [Tooltip]{@link moonstone/TooltipDecorator.Tooltip} specifically adapted for use with
 * [IncrementSlider]{@link moonstone/IncrementSlider.IncrementSlider},
 * [ProgressBar]{@link moonstone/ProgressBar.ProgressBar}, or
 * [Slider]{@link moonstone/Slider.Slider}.
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
