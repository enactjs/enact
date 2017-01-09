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
import {forward} from '@enact/core/handle';

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
 * @private
 */
const now = function () {
	if (typeof window === 'object') {
		return window.performance.now();
	} else {
		return Date.now();
	}
};

/**
 * Default config for {@link moonstone/internal/SliderDecorator.SliderDecorator}.
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
	forwardChange      = forward('onChange'),
	forwardMouseMove   = forward('onMouseMove'),
	forwardMouseLeave  = forward('onMouseLeave');

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

		static propTypes = /** @lends moonstone/internal/SliderDecorator.SliderDecorator.prototype */{
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
			this.knobPosition = null;
			this.state = {
				value: props.value
			};
		}

		componentDidMount () {
			this.updateUI(this.state.value);
		}

		componentWillReceiveProps (nextProps) {
			this.updateValue(nextProps.value);
		}

		componentDidUpdate (prevProps) {
			if (prevProps.vertical !== this.props.vertical) {
				this.updateUI(this.state.value);
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
			// We don't want to run this code if any mouse button is being held down. That indicates dragging.
			if (ev.buttons || this.props.vertical) {
				forwardMouseLeave(ev, this.props);
				return;
			}

			const node = this.sliderBarNode.node;

			// Don't let the positional value exceed the bar width, and account for the dead-space padding
			const min = parseFloat(window.getComputedStyle(this.inputNode).paddingLeft);
			const pointer = ev.clientX - this.inputNode.getBoundingClientRect().left;
			const knob = (clamp(min, min + node.offsetWidth, pointer) - min) / node.offsetWidth;

			// Update our instance's knowledge of where the knob should be
			this.knobPosition = knob;

			this.updateUI(this.state.value);
			forwardMouseMove(ev, this.props);
		}

		handleMouseLeave = (ev) => {
			this.knobPosition = null;
			this.updateUI(this.state.value);
			forwardMouseLeave(ev, this.props);
		}

		submitValue = (value) => {
			throttleJob(this.jobName, () => this.updateValue(value), config.changeDelay);
		}

		updateUI = (value) => {
			// intentionally breaking encapsulation to avoid having to specify multiple refs
			const {barNode, knobNode, loaderNode, node} = this.sliderBarNode;
			const {backgroundPercent, max, min, vertical} = this.props;
			const normalizedMax = max != null ? max : Wrapped.defaultProps.max;
			const normalizedMin = min != null ? min : Wrapped.defaultProps.min;
			const proportionBackground = computeProportionBackground({backgroundPercent});
			const proportionProgress = computeProportionProgress({value, max: normalizedMax, min: normalizedMin});
			const knobProgress = this.knobPosition != null ? this.knobPosition : proportionProgress;

			loaderNode.style.transform = computeBarTransform(proportionBackground, vertical);
			barNode.style.transform = computeBarTransform(proportionProgress, vertical);
			// If we know the knob should be in a custom place, use that place; otherwise, sync it with the progress.
			knobNode.style.transform = computeKnobTransform(knobProgress, vertical, node);
		}

		updateValue = (value) => {
			this.updateUI(value);
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
					onMouseLeave={this.props.detachedKnob ? this.handleMouseLeave : null}
					onMouseMove={this.props.detachedKnob ? this.handleMouseMove : null}
					scrubbing={(this.knobPosition != null)}
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
