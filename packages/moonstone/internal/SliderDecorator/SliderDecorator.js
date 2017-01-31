/**
 * Exports the {@link moonstone/internal/SliderDecorator.SliderDecorator} HOC
 *
 * @module moonstone/internal/SliderDecorator
 * @private
 */

import hoc from '@enact/core/hoc';
import {throttleJob} from '@enact/core/jobs';
import Spotlight from '@enact/spotlight';
import clamp from 'ramda/src/clamp';
import React, {PropTypes} from 'react';
import {forward} from '@enact/core/handle';

import {validateRange} from '../validators';

import {
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
	changeDelay: 20
};

// Set-up event forwarding
const forwardChange = forward('onChange');
const forwardMouseMove = forward('onMouseMove');
const forwardMouseLeave  = forward('onMouseLeave');

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
	return class SliderDecoratorClass extends React.Component {
		static displayName = 'SliderDecorator';

		static propTypes = /** @lends moonstone/internal/SliderDecorator.SliderDecorator.prototype */{
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
			 * @private
			 */
			detachedKnob: PropTypes.bool,

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
			value: PropTypes.number,

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

			this.current5WayValue = null;
			this.jobName = `sliderChange${now()}`;
			this.knobPosition = null;
			this.normalizedMax = props.max != null ? props.max : Wrapped.defaultProps.max;
			this.normalizedMin = props.min != null ? props.min : Wrapped.defaultProps.min;
			this.state = {
				active: false,
				value: clamp(this.normalizedMin, this.normalizedMax, props.value)
			};
			if (__DEV__) {
				validateRange(props.value, props.min, props.max, SliderDecoratorClass.displayName);
				validateRange(props.backgroundProgress, 0, 1, SliderDecoratorClass.displayName,
					'backgroundProgress', 'min', 'max');
			}
		}

		componentDidMount () {
			this.updateUI();
		}

		componentWillReceiveProps ({backgroundProgress, min, max, value: _value}) {
			if ((min !== this.props.min) || (max !== this.props.max) ||
					(_value !== this.state.value)) {
				this.normalizedMax = max != null ? max : Wrapped.defaultProps.max;
				this.normalizedMin = min != null ? min : Wrapped.defaultProps.min;
				const value = clamp(this.normalizedMin, this.normalizedMax, _value);
				this.setState({value});
			}
			if (__DEV__) {
				validateRange(_value, min, max, SliderDecoratorClass.displayName);
				validateRange(backgroundProgress, 0, 1, SliderDecoratorClass.displayName,
					'backgroundProgress', 'min', 'max');
			}
		}

		componentDidUpdate () {
			this.updateUI();
		}

		throttleUpdateValue = (value) => {
			throttleJob(this.jobName, () => {
				this.inputNode.value = value;
				this.setState({value});
				forwardChange({value}, this.props);
			}, config.changeDelay);
		}

		throttleUpdateValueByAmount = (amount) => {
			const {min, max} = this.props;
			let value = this.state.value + amount;

			value = clamp(min, max, value);
			this.throttleUpdateValue(value);
		}

		moveKnobByAmount (amount) {
			const value = this.current5WayValue === null ? this.state.value : this.current5WayValue;
			this.current5WayValue = value + amount;
			this.knobPosition = computeProportionProgress({
				max: this.normalizedMax,
				min: this.normalizedMin,
				value: this.current5WayValue
			});
			this.updateUI();
		}

		updateUI = () => {
			// intentionally breaking encapsulation to avoid having to specify multiple refs
			const {barNode, knobNode, loaderNode, node} = this.sliderBarNode;
			const {backgroundProgress, vertical} = this.props;
			const {value} = this.state;
			const proportionProgress = computeProportionProgress({value, max: this.normalizedMax, min: this.normalizedMin});
			const knobProgress = this.knobPosition != null ? this.knobPosition : proportionProgress;

			loaderNode.style.transform = computeBarTransform(backgroundProgress, vertical);
			barNode.style.transform = computeBarTransform(proportionProgress, vertical);
			// If we know the knob should be in a custom place, use that place; otherwise, sync it with the progress.
			knobNode.style.transform = computeKnobTransform(knobProgress, vertical, node);
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

		handleChange = (ev) => {
			ev.preventDefault();
			const parseFn = (ev.target.value % 1 !== 0) ? parseFloat : parseInt,
				value = parseFn(ev.target.value);
			this.throttleUpdateValue(value);
		}

		handleMouseMove = (ev) => {
			// We don't want to run this code if any mouse button is being held down. That indicates dragging.
			if (ev.buttons || this.props.vertical) {
				forwardMouseMove(ev, this.props);
				return;
			}

			const node = this.sliderBarNode.node;

			// Don't let the positional value exceed the bar width, and account for the dead-space padding
			const min = parseFloat(window.getComputedStyle(this.inputNode).paddingLeft);
			const pointer = ev.clientX - this.inputNode.getBoundingClientRect().left;
			const knob = (clamp(min, min + node.offsetWidth, pointer) - min) / node.offsetWidth;

			this.current5WayValue = (this.normalizedMax - this.normalizedMin) * knob;

			// Update our instance's knowledge of where the knob should be
			this.knobPosition = knob;

			this.updateUI();
			forwardMouseMove(ev, this.props);
		}

		handleMouseLeave = (ev) => {
			this.knobPosition = null;
			this.updateUI();
			forwardMouseLeave(ev, this.props);
		}

		handleClick = () => {
			if (Spotlight.getCurrent() !== this.sliderNode) {
				Spotlight.focus(this.sliderNode);
			}
		}

		handleActivate = () => {
			if (this.props.detachedKnob) {
				if (this.current5WayValue !== null) {
					const value = clamp(this.props.min, this.props.max, this.current5WayValue);
					this.current5WayValue = null;
					this.throttleUpdateValue(value);
				}
			} else {
				this.setState({
					active: !this.state.active
				});
			}
		}

		handleBlur = () => {
			if (this.current5WayValue !== null) {
				this.current5WayValue = null;
				this.knobPosition = null;
				this.updateUI();
			}
		}

		handleIncrement = () => {
			const {detachedKnob, knobStep, step} = this.props;
			const amount = typeof knobStep === 'number' ? knobStep : step;
			if (detachedKnob) {
				this.moveKnobByAmount(amount);
			} else {
				this.throttleUpdateValueByAmount(amount);
			}
		}

		handleDecrement = () => {
			const {detachedKnob, knobStep, step} = this.props;
			const amount = typeof knobStep === 'number' ? knobStep : step;
			if (detachedKnob) {
				this.moveKnobByAmount(-amount);
			} else {
				this.throttleUpdateValueByAmount(-amount);
			}
		}

		render () {
			const props = Object.assign({}, this.props);
			delete props.knobStep;

			return (
				<Wrapped
					{...props}
					active={this.state.active}
					inputRef={this.getInputNode}
					onActivate={this.handleActivate}
					onBlur={this.handleBlur}
					onChange={this.handleChange}
					onClick={this.handleClick}
					onDecrement={this.handleDecrement}
					onIncrement={this.handleIncrement}
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
