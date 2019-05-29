/**
 * Unstyled slider components and behaviors to be customized by a theme or application.
 *
 * @module ui/Slider
 * @exports Knob
 * @exports Slider
 * @exports SliderBase
 * @exports SliderDecorator
 */

import kind from '@enact/core/kind';
import EnactPropTypes from '@enact/core/internal/prop-types';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import Changeable from '../Changeable';
import ComponentOverride from '../ComponentOverride';
import Touchable from '../Touchable';

import Knob from './Knob';
import PositionDecorator from './PositionDecorator';

import componentCss from './Slider.module.less';

import {calcProportion} from './utils';

/**
 * An unstyled, sliding range-selection component.
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
		 * The component used to render the progress bar within the slider.
		 *
		 * The provided component will receive the following props from `Slider`
		 *
		 * * backgroundProgress - The value of `backgroundProgress`
		 * * orientation        - The value of `orientation`
		 * * progress           - The `value` as a proportion between `min` and `max`
		 * * progressAnchor     - The value of `progressAnchor`
		 *
		 * This prop accepts either a Component (e.g. `MyProgress`} which will be instantiated with
		 * the above props or a component instance (e.g. `<MyProgress customProp="value" />`) which
		 * will have its props merged with the above props.
		 *
		 * @type {Component|Element}
		 * @required
		 * @public
		 */
		progressBarComponent: EnactPropTypes.componentOverride.isRequired,

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
		 * * `slider`     - The root component class
		 * * `knob`       - The knob node
		 * * `horizontal` - Applied when `orientation` prop is `"horizontal"``
		 * * `pressed`    - Applied when `pressed` prop is `true`
		 * * `noFill`     - Applied when `noFill` prop is `true`
		 * * `vertical`   - Applied when `orientation` prop is `"vertical"`
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Disables component and does not generate events.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Defines a custom knob component for the slider.
		 *
		 * By default, Slider will use its own implementation, {@link ui/Slider.Knob}.
		 *
		 * The following props are forwarded to the knob:
		 *
		 * * `className`        - A `knob` class applied by the slider
		 * * `disabled`         - The value of `disabled`
		 * * `orientation`      - The value of `orientation`
		 * * `proportion`       - The `value` as a proportion between `min` and `max`
		 * * `tooltipComponent` - The value of `tooltipComponent`
		 * * `value`            - The value of `value`
		 *
		 * This prop accepts either a Component (e.g. `MyKnob`} which will be instantiated with
		 * the above props or a component instance (e.g. `<MyKnob customProp="value" />`) which
		 * will have its props merged with the above props.
		 *
		 * @see {@link ui/ComponentOverride}
		 *
		 * @type {Component|Element}
		 * @default {@link ui/Slider.Knob}
		 * @public
		 */
		knobComponent: EnactPropTypes.componentOverride,

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
		 * Applies the style where the slider bar does not display filled.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noFill: PropTypes.bool,

		/**
		 * The orientation of the slider, either `"horizontal"` or `"vertical"`.
		 *
		 * @type {String}
		 * @default "horizontal"
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * Applies a pressed visual effect.
		 *
		 * @type {Boolean}
		 * @public
		 */
		pressed: PropTypes.bool,

		/**
		 * Sets the point, as a proportion between 0 and 1, from which the slider is filled.
		 *
		 * Applies to both the slider's `value` and `backgroundProgress`. In both cases,
		 * setting the value of `progressAnchor` will cause the slider to fill from that point
		 * down, when `value` or `backgroundProgress` is proportionally less than the anchor, or up,
		 * when `value` or `backgroundProgress` is proportionally greater than the anchor, rather
		 * than always from the start of the slider.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		progressAnchor: PropTypes.number,

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
		 * * `children`    - The `value` prop from the slider
		 * * `orientation` - The value of the `orientation` prop from the slider
		 * * `proportion`  - The `value` as a proportion between `min` and `max`
		 *
		 * This prop accepts either a Component (e.g. `MyTooltip`} which will be instantiated with
		 * the above props or a component instance (e.g. `<MyTooltip customProp="value" />`) which
		 * will have its props merged with the above props.
		 *
		 * @see {@link ui/ComponentOverride}
		 *
		 * @type {Component|Element}
		 * @public
		 */
		tooltipComponent: EnactPropTypes.componentOverride,

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
		progressAnchor: 0,
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
		style: ({max, min, style, value = min}) => {
			const proportion = calcProportion(min, max, value);

			return {
				...style,
				'--ui-slider-proportion-end-knob': proportion
			};
		}
	},

	render: ({
		backgroundProgress,
		css,
		disabled,
		knobComponent,
		min,
		orientation,
		percent,
		progressBarComponent,
		progressAnchor,
		tooltipComponent,
		value = min,
		...rest
	}) => {
		delete rest.max;
		delete rest.noFill;
		delete rest.pressed;
		delete rest.step;

		return (
			<div {...rest} disabled={disabled}>
				<ComponentOverride
					backgroundProgress={backgroundProgress}
					component={progressBarComponent}
					orientation={orientation}
					progress={percent}
					progressAnchor={progressAnchor}
				>
					<ComponentOverride
						className={css.knob}
						component={knobComponent}
						disabled={disabled}
						orientation={orientation}
						proportion={percent}
						tooltipComponent={tooltipComponent}
						value={value}
					/>
				</ComponentOverride>
			</div>
		);
	}
});

/**
 * Adds touch and drag support to a [SliderBase]{@link ui/Slider.SliderBase}.
 *
 * @hoc
 * @memberof ui/Slider
 * @mixes ui/Changeable.Changeable
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
 * Called when the value is changed.
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
