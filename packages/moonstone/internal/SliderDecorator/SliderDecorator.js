/**
 * Exports the {@link moonstone/internal/SliderDecorator.SliderDecorator} HOC
 *
 * @module moonstone/internal/SliderDecorator
 * @private
 */

import hoc from '@enact/core/hoc';
import {throttleJob} from '@enact/core/jobs';
import Spotlight from '@enact/spotlight';
import {checkDefaultBounds} from '@enact/ui/validators/PropTypeValidators';
import clamp from 'ramda/src/clamp';
import React, {PropTypes} from 'react';
import {withArgs as handle, forward} from '@enact/core/handle';

import {
	computeProportionBackground,
	computeProportionProgress,
	computeBarTransform,
	computeKnobTransform
} from './util';

/**
 * Returns a timestamp for the current time using `window.performance.now()` if available and
 * falling back to `Date.now()`.
 *
 * @returns	{Number}	Timestamp
 */
const now = function () {
	if (typeof window === 'object') {
		return window.performance.now();
	} else {
		return Date.now();
	}
};

/**
 * Default config for {@link moonstone/SliderDecorator.SliderDecorator}.
 *
 * @memberof moonstone/internal/SliderDecorator
 * @hocconfig
 * @private
 */
const defaultConfig = {
	/**
	 * Configures the time in milliseconds to throttle consecutive change events.
	 *
	 * @type {Number}
	 * @default 20
	 * @memberof moonstone/internal/SliderDecorator.defaultConfig
	 */
	changeDelay: 20,

	/**
	 * When `true`, increment and decrement handlers are connected.
	 *
	 * @type {Boolean}
	 * @default false
	 * @memberof moonstone/internal/SliderDecorator.defaultConfig
	 */
	handlesIncrements: false
};

// Set-up event forwarding
const
	forwardChange     = forward('onChange'),
	forwardMouseMove  = forward('onMouseMove');

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

		static propTypes = /** @lends moonstone/SliderDecorator.SliderDecorator.prototype */ {
			/**
			 * Background progress, as a percentage.
			 *
			 * @type {Number}
			 * @default 0
			 * @public
			 */
			backgroundPercent: PropTypes.number,

			/**
			 * The slider can change its behavior to have the knob follow the cursor as it moves
			 * across the slider, without applying the position. A click or drag behaves the same.
			 * This is primarily used by media playback. Setting this to `true` enables this behavior.
			 *
			 * @type {Boolean}
			 * @default false
			 * @private
			 */
			detachedKnob: PropTypes.bool,

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
			 * The value of the slider.
			 *
			 * @type {Number}
			 * @default 0
			 * @public
			 */
			value: checkDefaultBounds,

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
			max: 100,
			min: 0,
			step: 1,
			pressed: false,
			value: 0,
			vertical: false
		};

		constructor (props) {
			super(props);

			this.jobName = `sliderChange${now()}`;
			this.state = {
				value: props.value
			};
		}

		componentWillReceiveProps (nextProps) {
			if (nextProps.value !== this.props.value) {
				this.updateValue(nextProps.value);
			}
		}

		onChange = (value) => {
			if (this.props.onChange) {
				this.props.onChange({value});
			}
		}

		handleChange = (ev) => {
			ev.preventDefault();
			const parseFn = (ev.target.value % 1 !== 0) ? 'parseFloat' : 'parseInt',
				value = Number[parseFn](ev.target.value);
			this.submitValue(value);
			forwardChange(ev, this.props);
		}

		handleMouseMove = (ev) => {
			if (ev.buttons || this.props.vertical) return;	// We don't want to run this code if any mouse button is being held down. That indicates dragging.

			const {knobNode, node} = this.sliderBarNode,
				{vertical} = this.props,
				knobRadius = (knobNode.offsetWidth / 2),
				barWidth = node.offsetWidth,
				cs = window.getComputedStyle(this.inputNode),
				inputPaddingLeft = parseFloat(cs.paddingLeft),
				// Don't let the positional value exceed the bar width, and account for the dead-space padding
				offsetX = clamp(inputPaddingLeft, inputPaddingLeft + barWidth, ev.clientX - knobRadius),
				knobOffsetX = offsetX - knobRadius,
				knobProportion = knobOffsetX / barWidth;

			// console.log('mousemove:', ev.buttons, offsetX, knobOffsetX, barWidth, knobProportion);
			knobNode.style.transform = computeKnobTransform(knobProportion, vertical, node);
			forwardMouseMove(ev, this.props);
		}

		submitValue = (value) => {
			throttleJob(this.jobName, () => this.updateValue(value), config.changeDelay);
		}

		updateValue = (value) => {
			// intentionally breaking encapsulation to avoid having to specify multiple refs
			const {barNode, knobNode, loaderNode, node} = this.sliderBarNode;
			const {backgroundPercent, max, min, vertical} = this.props;
			const normalizedMax = max != null ? max : Wrapped.defaultProps.max;
			const normalizedMin = min != null ? min : Wrapped.defaultProps.min;
			const proportionBackground = computeProportionBackground({backgroundPercent});
			const proportionProgress = computeProportionProgress({value, max: normalizedMax, min: normalizedMin});

			loaderNode.style.transform = computeBarTransform(proportionBackground, vertical);
			barNode.style.transform = computeBarTransform(proportionProgress, vertical);
			knobNode.style.transform = computeKnobTransform(proportionProgress, vertical, node);
			this.inputNode.value = value;
			this.setState({value});
			this.onChange(value);
		}

		getInputNode = (node) => {
			this.inputNode = node;
		}

		getSliderNode = (node) => {
			this.sliderNode = node;
		}

		getSliderBarNode = (node) => {
			this.sliderBarNode = node;
		}

		clickHandler = () => Spotlight.focus(this.sliderNode)

		incrementHandler = () => {
			this.changeValue(1);
		}

		decrementHandler = () => {
			this.changeValue(-1);
		}

		changeValue = (direction) => {
			const {min, max, step} = this.props;
			let value = this.state.value + (step * direction);

			value = clamp(min, max, value);
			this.submitValue(value);
		}

		render () {
			const handlers = !config.handlesIncrements ? null : {
				onIncrement: this.incrementHandler,
				onDecrement: this.decrementHandler
			};

			return (
				<Wrapped
					{...this.props}
					{...handlers}
					inputRef={this.getInputNode}
					onChange={this.handleChange}
					onClick={this.clickHandler}
					onMouseMove={this.props.detachedKnob ? this.handleMouseMove : null}
					sliderBarRef={this.getSliderBarNode}
					sliderRef={this.getSliderNode}
					value={this.state.value}
				/>
			);
		}
	};
});

export default SliderDecorator;
export {SliderDecorator};
