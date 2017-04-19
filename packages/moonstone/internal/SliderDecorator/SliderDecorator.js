/**
 * Exports the {@link moonstone/internal/SliderDecorator.SliderDecorator} HOC
 *
 * @module moonstone/internal/SliderDecorator
 * @private
 */

import $L from '@enact/i18n/$L';
import hoc from '@enact/core/hoc';
import {Job} from '@enact/core/util';
import Spotlight from '@enact/spotlight';
import clamp from 'ramda/src/clamp';
import React from 'react';
import PropTypes from 'prop-types';
import {forward} from '@enact/core/handle';
import {hintComposer} from '@enact/ui/A11yDecorator';

import {validateRange} from '../validators';

import {
	computeProportionProgress,
	computeBarTransform,
	computeKnobTransform
} from './util';

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
const forwardBlur = forward('onBlur');
const forwardChange = forward('onChange');
const forwardClick = forward('onClick');
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
			 * Accessibility pre-hint
			 *
			 * @type {String}
			 * @public
			 */
			accessibilityHint: React.PropTypes.string,

			/**
			 * Accessibility hint
			 *
			 * @type {String}
			 * @public
			 */
			accessibilityPreHint: React.PropTypes.string,

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
			 * When `true`, the component is shown as disabled and does not generate events
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: PropTypes.bool,

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
			this.knobPosition = null;
			this.normalizeBounds(props);

			const value = this.clamp(props.value);
			const valueText = props['aria-valuetext'] || hintComposer(props.accessibilityHint, props.accessibilityPreHint, value);

			this.state = {
				active: false,
				value: value,
				valueText: valueText
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

		componentWillReceiveProps (nextProps) {
			const {'aria-valuetext': ariaValueText, accessibilityHint, accessibilityPreHint, backgroundProgress, max, min, value} = nextProps;

			if ((min !== this.props.min) || (max !== this.props.max) || (value !== this.state.value)) {
				this.normalizeBounds(nextProps);
				const clampedValue = this.clamp(value);
				const valueText = ariaValueText || hintComposer(accessibilityHint, accessibilityPreHint, value);

				this.setState({
					value: clampedValue,
					valueText: valueText
				});
			}

			if (__DEV__) {
				validateRange(value, min, max, SliderDecoratorClass.displayName);
				validateRange(backgroundProgress, 0, 1, SliderDecoratorClass.displayName,
					'backgroundProgress', 'min', 'max');
			}
		}

		componentDidUpdate () {
			this.updateUI();
		}

		componentWillUnmount () {
			this.updateValueJob.stop();
		}

		normalizeBounds (props) {
			this.normalizedMax = props.max != null ? props.max : Wrapped.defaultProps.max;
			this.normalizedMin = props.min != null ? props.min : Wrapped.defaultProps.min;
		}

		clamp (value) {
			return clamp(this.normalizedMin, this.normalizedMax, value);
		}

		updateValueJob = new Job((value) => {
			this.inputNode.value = value;
			const valueText = this.props['aria-valuetext'] || hintComposer(this.props.accessibilityHint, this.props.accessibilityPreHint, value);
			this.setState({
				value,
				valueText: valueText
			});
			forwardChange({value}, this.props);
		}, config.changeDelay)

		throttleUpdateValue = (value) => {
			this.updateValueJob.throttle(value);
		}

		throttleUpdateValueByAmount = (amount) => {
			this.throttleUpdateValue(this.clamp(this.state.value + amount));
		}

		moveKnobByAmount (amount) {
			const value = this.current5WayValue === null ? this.state.value : this.current5WayValue;
			this.current5WayValue = this.clamp(value + amount);
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
			knobNode.dataset.climax = knobProgress > 0.5 ? 'falling' : 'rising';
			this.notifyKnobMove(knobProgress, knobProgress !== proportionProgress);
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

		notifyKnobMove = (proportion, detached) => {
			const {disabled, detachedKnob, onKnobMove} = this.props;
			if (!disabled && detachedKnob && onKnobMove) {
				onKnobMove({
					proportion,
					detached
				});
			}
		}

		handleChange = (ev) => {
			if (this.props.disabled) return;

			ev.preventDefault();
			const parseFn = (ev.target.value % 1 !== 0) ? parseFloat : parseInt,
				value = parseFn(ev.target.value);
			this.throttleUpdateValue(value);

		}

		handleMouseMove = (ev) => {
			forwardMouseMove(ev, this.props);

			// We don't want to run this code if any mouse button is being held down. That indicates dragging.
			if (this.props.disabled || ev.buttons || this.props.vertical) return;

			const node = this.sliderBarNode.node;

			// Don't let the positional value exceed the bar width, and account for the dead-space padding
			const min = parseFloat(window.getComputedStyle(this.inputNode).paddingLeft);
			const pointer = ev.clientX - this.inputNode.getBoundingClientRect().left;
			const knob = (clamp(min, min + node.offsetWidth, pointer) - min) / node.offsetWidth;

			this.current5WayValue = (this.normalizedMax - this.normalizedMin) * knob;

			// Update our instance's knowledge of where the knob should be
			this.knobPosition = knob;

			this.updateUI();
		}

		handleMouseLeave = (ev) => {
			forwardMouseLeave(ev, this.props);

			if (this.props.disabled) return;

			this.knobPosition = null;
			this.updateUI();
		}

		handleClick = (ev) => {
			forwardClick(ev, this.props);

			if (!this.props.disabled && Spotlight.getCurrent() !== this.sliderNode) {
				Spotlight.focus(this.sliderNode);
			}
		}

		handleActivate = () => {
			const {'aria-valuetext': ariaValueText, accessibilityHint, accessibilityPreHint, detachedKnob, disabled, vertical} = this.props;

			if (disabled) return;

			if (detachedKnob) {
				if (this.current5WayValue !== null) {
					this.throttleUpdateValue(this.clamp(this.current5WayValue));
					this.current5WayValue = null;
				}
			} else {
				const verticalHint = $L('change a value with up down button');
				const horizontalHint = $L('change a value with left right button');
				const active = !this.state.active;

				let valueText = ariaValueText || hintComposer(accessibilityHint, accessibilityPreHint, this.state.value);
				if (active) {
					valueText = vertical ? verticalHint : horizontalHint;
				}

				this.setState({active, valueText});
			}
		}

		handleBlur = (ev) => {
			forwardBlur(ev, this.props);

			if (this.current5WayValue !== null) {
				this.current5WayValue = null;
				this.knobPosition = null;
				this.updateUI();
			}
		}

		handleIncrement = () => {
			if (this.props.disabled) return;

			const {detachedKnob, knobStep, step} = this.props;
			const amount = typeof knobStep === 'number' ? knobStep : step;
			if (detachedKnob) {
				this.moveKnobByAmount(amount);
			} else {
				this.throttleUpdateValueByAmount(amount);
			}
		}

		handleDecrement = () => {
			if (this.props.disabled) return;

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
					role='slider'
					{...props}
					active={this.state.active}
					aria-disabled={this.props.disabled}
					aria-valuetext={this.state.valueText}
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
