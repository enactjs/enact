/**
 * Provides unstyled slider components and behaviors to be customized by a theme or application.
 *
 * @module ui/Slider
 * @exports Knob
 * @exports Slider
 * @exports SliderBase
 * @exports SliderDecorator
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import Changeable from '../Changeable';
import ComponentOverride from '../ComponentOverride';
import Touchable from '../Touchable';

import Knob from './Knob';
import PositionDecorator from './PositionDecorator';

import componentCss from './Slider.less';

import {calcProportion} from './utils';

/**
 * An unstyled, sliding range-selection component
 *
 * @class SliderBase
 * @memberof ui/Slider
 * @ui
 * @public
 */
const SliderBase = kind({
	name: 'ui:Slider',

	propTypes: /** @lends ui/Slider.SliderBase.prototype */ {
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
		 * The following classes are supported:
		 *
		 * * `slider` - The root component class
		 * * `fill` - The progress bar node representing the `value`
		 * * `load` - The progress bar node representing the `backgroundProgress`
		 * * `knob` - The knob node
		 * * `bars` - The parent node for the fill bar, load bar, and knob
		 * * `horizontal` - Applied when `orientation` prop is `"horizontal"``
		 * * `pressed` - Applied when `pressed` prop is `true`
		 * * `noFill` - Applied when `noFill` prop is `true`
		 * * `vertical` - Applied when `orientation` prop is `"vertical"`
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * When `true`, the component is disabled and does not generate events
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Defines a custom knob component for the slider. By default, Slider will use it's own
		 * implementation, {@link ui/Slider.Knob}.
		 *
		 * The following props are forwarded to the tooltip:
		 *
		 * * `className` - A `knob` class applied by the slider
		 * * `disabled` - The value of `disabled` from the slider
		 * * `orientation` - The value of `orientation` from the slider
		 * * `proportion` - A number between 0 and 1 representing the proportion of the `value` in
		 *   terms of `min` and `max`
		 * * `tooltipComponent` - The value of `tooltipComponent` from the slider
		 * * `value` - The value of `value` from the slider
		 *
		 * This prop accepts either a Component (e.g. `MyKnob`} which will be instantiated with
		 * the above props or a component instance (e.g. `<MyKnob customProp="value" />`) which
		 * will have its props merged with the above props.
		 *
		 * See {@link ui/ComponentOverride} for more information.
		 *
		 * @type {Component|Element}
		 * @default {@link ui/Slider.Knob}
		 * @public
		 */
		knobComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),

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
		 * When `true`, the slider bar does not display filled.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noFill: PropTypes.bool,

		/**
		 * The orientation of the slider, either `"horizontal"` or `"vertical"`.
		 *
		 * @type {Boolean}
		 * @default "horizontal"
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

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
		 * Adds a tooltip to the slider using the provided component.
		 *
		 * The following props are forwarded to the tooltip:
		 *
		 * * `children` - The `value` prop from the slider
		 * * `orientation` - The value of the `orientation` prop from the slider
		 * * `proportion` - A number between 0 and 1 representing the proportion of the `value` in
		 *   terms of `min` and `max`
		 *
		 * This prop accepts either a Component (e.g. `MyTooltip`} which will be instantiated with
		 * the above props or a component instance (e.g. `<MyTooltip customProp="value" />`) which
		 * will have its props merged with the above props.
		 *
		 * See {@link ui/ComponentOverride} for more information.
		 *
		 * @type {Component|Element}
		 * @public
		 */
		tooltipComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),

		/**
		 * The value of the slider.
		 *
		 * Defaults to the value of `min`.
		 *
		 * @type {Number}
		 * @public
		 */
		value: PropTypes.number
	},

	defaultProps: {
		disabled: false,
		knobComponent: Knob,
		min: 0,
		max: 100,
		noFill: false,
		orientation: 'horizontal',
		step: 1
	},

	styles: {
		css: componentCss,
		className: 'slider',
		publicClassNames: true
	},

	computed: {
		className: ({disabled, noFill, orientation, pressed, styler}) => {
			return styler.append(
				orientation,
				{
					disabled,
					noFill,
					pressed
				}
			);
		},
		percent: ({max, min, value = min}) => calcProportion(min, max, value),
		style: ({backgroundProgress, max, min, style, value = min}) => {
			const proportion = calcProportion(min, max, value);

			return {
				...style,
				'--ui-slider-proportion-end': proportion,
				'--ui-slider-proportion-end-background': backgroundProgress,
				'--ui-slider-proportion-end-knob': proportion
			};
		}
	},

	render: ({css, disabled, knobComponent, min, orientation, percent, tooltipComponent, value = min, ...rest}) => {
		delete rest.backgroundProgress;
		delete rest.max;
		delete rest.noFill;
		delete rest.pressed;
		delete rest.step;

		return (
			<div {...rest} disabled={disabled}>
				<div className={css.bars}>
					<div className={css.load} />
					<div className={css.fill} />
					<ComponentOverride
						className={css.knob}
						component={knobComponent}
						disabled={disabled}
						orientation={orientation}
						proportion={percent}
						tooltipComponent={tooltipComponent}
						value={value}
					/>
				</div>
			</div>
		);
	}
});

/**
 * Adds touch and drag support to a [SliderBase]{@link ui/Slider.SliderBase}.
 *
 * @hoc
 * @memberof ui/Slider
 * @mixes ui/Touchable.Touchable
 * @public
 */
const SliderDecorator = compose(
	Changeable,
	PositionDecorator,
	Touchable({activeProp: 'pressed'})
);

/**
 * A minimally-styled slider component with touch and drag support.
 *
 * @class Slider
 * @extends ui/Slider.SliderBase
 * @memberof ui/Slider
 * @mixes ui/Slider.SliderDecorator
 * @ui
 * @public
 */

/**
 * The handler to run when the value is changed.
 *
 * @name onChange
 * @memberof ui/Slider.Slider.prototype
 * @type {Function}
 * @param {Object} event
 * @param {Number} event.value      Value of the slider
 * @param {Number} event.proportion Proportion of the value in terms of the min and max
 *                                  values
 * @public
 */

const Slider = SliderDecorator(SliderBase);

export default Slider;
export {
	Knob,
	Slider,
	SliderBase,
	SliderDecorator
};
