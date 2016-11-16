/**
 * Exports the {@link moonstone/internal/SliderDecorator.SliderDecorator} HOC
 *
 * @module moonstone/internal/SliderDecorator
 */

import hoc from '@enact/core/hoc';
import {throttleJob} from '@enact/core/jobs';
import Spotlight from '@enact/spotlight';
import {checkDefaultBounds} from '@enact/ui/validators/PropTypeValidators';
import R from 'ramda';
import React, {PropTypes} from 'react';

import {
	computeProportionLoaded,
	computeProportionProgress,
	computeBarTransform,
	computeKnobTransform
} from './util';

const defaultConfig = {
	/**
	 * Configures the time in milliseconds to throttle consecutive change events.
	 *
	 * @type {Number}
	 * @default 20
	 */
	changeDelay: 20,

	/**
	 * When `true`, increment and decrement buttons are displayed.
	 *
	 * @type {Boolean}
	 * @default false
	 */
	increment: false
};

/**
 * {@link moonstone/internal/SliderDecorator.SliderDecorator} is a Higher-order Component that
 * provides common functionality for slider-like components. Essentially, this HOC implements a
 * performant value updating mechanism while supporting different modes such as increment mode
 * (enabled via the `increment` config), which generates increment and decrement buttons.
 *
 * @class SliderDecorator
 * @memberof moonstone/internal/SliderDecorator
 * @hoc
 * @private
 */
const SliderDecorator = hoc(defaultConfig, (config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'SliderDecorator';

		static propTypes = {
			/**
			 * Background progress, as a percentage.
			 *
			 * @type {Number}
			 * @default 0
			 * @public
			 */
			backgroundPercent: PropTypes.number,

			/**
			 * The initial value of the slider.
			 *
			 * @type {Number}
			 * @default 0
			 * @public
			 */
			defaultValue: checkDefaultBounds,

			/**
			 * Height, in standard CSS units, of the vertical slider. Only takes
			 * effect on a vertical oriented slider.
			 *
			 * @type {String}
			 * @default '300px'
			 * @public
			 */
			height: PropTypes.string,

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
			 * The handler to run when the value is changed.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onChange: PropTypes.func,

			/**
			 * When `true`, a pressed visual effect is applied
			 *
			 * @type {Boolean}
			 * @default false
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
			 * If `true` the slider will be oriented vertically.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			vertical: PropTypes.bool
		};

		static defaultProps = {
			defaultValue: 0,
			max: 100,
			min: 0,
			step: 1
		};

		constructor (props) {
			super(props);
			this.state = {
				value: this.props.defaultValue
			};
		}

		onChange = () => {
			if (this.props.onChange) {
				this.props.onChange({value: this.state.value});
			}
		}

		handleChange = (event) => {
			event.preventDefault();
			const value = Number.parseInt(event.target.value);
			this.updateValue(value);
		}

		updateValue = (value) => {
			throttleJob('sliderChange', () => {
				// intentionally breaking encapsulation to avoid having to specify multiple refs
				const {barNode, knobNode, loaderNode, node} = this.visibleBarNode;
				const {backgroundPercent, max, min, vertical} = this.props;
				const normalizedMax = max != null ? max : Wrapped.defaultProps.max;
				const normalizedMin = min != null ? min : Wrapped.defaultProps.min;
				const proportionLoaded = computeProportionLoaded({backgroundPercent});
				const proportionProgress = computeProportionProgress({value, max: normalizedMax, min: normalizedMin});

				loaderNode.style.transform = computeBarTransform(proportionLoaded, vertical);
				barNode.style.transform = computeBarTransform(proportionProgress, vertical);
				knobNode.style.transform = computeKnobTransform(proportionProgress, vertical, node, knobNode.offsetHeight / 2);
				this.inputNode.value = value;

				// yup, we're mutating state directly! :dealwithit:
				this.state.value = value; // eslint-disable-line react/no-direct-mutation-state
				this.onChange();
			}, 0);
		}

		getInputNode = (node) => {
			this.inputNode = node;
		}

		getSliderNode = (node) => {
			this.sliderNode = node;
		}

		getVisibleBarNode = (node) => {
			this.visibleBarNode = node;
		}

		clickHandler = () => Spotlight.focus(this.sliderNode);

		incrementHandler = () => {
			const {min, max, step} = this.props;
			let increaseAmt = this.state.value + step;

			increaseAmt = R.clamp(min, max, increaseAmt);
			this.updateValue(increaseAmt);
		}

		decrementHandler = () => {
			const {min, max, step} = this.props;
			let decreaseAmt = this.state.value - step;

			decreaseAmt = R.clamp(min, max, decreaseAmt);
			this.updateValue(decreaseAmt);
		}

		render () {
			const handlers = !config.increment ? {} : (
				{
					onIncrement: this.incrementHandler,
					onDecrement: this.decrementHandler
				}
			);

			return (
				<Wrapped
					{...this.props}
					{...handlers}
					onChange={this.handleChange}
					onClick={this.clickHandler}
					inputRef={this.getInputNode}
					sliderRef={this.getSliderNode}
					value={this.state.value}
					visibleBarRef={this.getVisibleBarNode}
				/>
			);
		}
	};
});

export default SliderDecorator;
export {SliderDecorator};
