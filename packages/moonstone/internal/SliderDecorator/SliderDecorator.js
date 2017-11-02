/**
 * Exports the {@link moonstone/internal/SliderDecorator.SliderDecorator} HOC
 *
 * @module moonstone/internal/SliderDecorator
 * @private
 */

import {contextTypes} from '@enact/core/internal/PubSub';
import hoc from '@enact/core/hoc';
import {Job} from '@enact/core/util';
import Spotlight from '@enact/spotlight';
import clamp from 'ramda/src/clamp';
import React from 'react';
import PropTypes from 'prop-types';
import {forward} from '@enact/core/handle';

import $L from '../$L';
import {validateRange} from '../validators';

import {
	computeProportionProgress,
	computeBarTransform,
	computeKnobTransform,
	parseNumber
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
const forwardFocus = forward('onFocus');
const forwardMouseDown = forward('onMouseDown');
const forwardMouseEnter = forward('onMouseEnter');
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

		static contextTypes = contextTypes

		static propTypes = /** @lends moonstone/internal/SliderDecorator.SliderDecorator.prototype */{
			/**
			 * Overrides the `aria-valuetext` for the slider. By default, `aria-valuetext` is set
			 * to the current value. This should only be used when the parent controls the value of
			 * the slider directly through the props.
			 *
			 * @type {String|Number}
			 * @memberof moonstone/internal/SliderDecorator.SliderDecorator.prototype
			 * @public
			 */
			'aria-valuetext': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

			/**
			 * Background progress, as a proportion between `0` and `1`.
			 *
			 * @type {Number}
			 * @default 0
			 * @public
			 */
			backgroundProgress: PropTypes.number,

			/**
			 * Default value applied at construction when the value prop is `undefined` or `null`.
			 *
			 * @type {Number}
			 * @public
			 */
			defaultValue: PropTypes.number,

			/**
			 * The slider can change its behavior to have the knob follow the cursor as it moves
			 * across the slider, without applying the position. A click or drag behaves the same.
			 * This is primarily used by media playback. Setting this to `true` enables this behavior.
			 *
			 * @type {Boolean}
			 * @private
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
			 * The amount to increment or decrement the value.
			 *
			 * @type {Number}
			 * @default 1
			 * @public
			 */
			step: PropTypes.number,

			/**
			 * Enables the built-in tooltip.
			 *
			 * @type {Boolean}
			 * @public
			 */
			tooltip: PropTypes.bool,

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
		};

		static defaultProps = {
			max: 100,
			min: 0,
			step: 1,
			vertical: false
		};

		constructor (props) {
			super(props);

			this.current5WayValue = null;
			this.knobPosition = null;
			this.normalizeBounds(props);
			this.detachedKnobPosition = 0;
			this.willChange = false;
			this.prevValue = null; // temp value stored for mouse down and drag

			let value, controlled = false;

			if (props.value != null) {
				controlled = true;
				value = props.value;
			} else {
				value = props.defaultValue || 0;
			}

			const valueText = props['aria-valuetext'] != null ? props['aria-valuetext'] : value;

			this.state = {
				active: false,
				controlled,
				knobAfterMidpoint: false,
				focused: false,
				value: this.clamp(value),
				valueText
			};

			if (__DEV__) {
				validateRange(props.value, props.min, props.max, SliderDecoratorClass.displayName);
				validateRange(props.backgroundProgress, 0, 1, SliderDecoratorClass.displayName,
					'backgroundProgress', 'min', 'max');
			}
		}

		componentWillMount () {
			if (this.context.Subscriber) {
				this.context.Subscriber.subscribe('resize', this.handleResize);
			}
		}

		componentDidMount () {
			this.updateUI();
		}

		componentWillReceiveProps (nextProps) {
			const {'aria-valuetext': ariaValueText, backgroundProgress, max, min, value} = nextProps;

			if ((min !== this.props.min) || (max !== this.props.max) || (value !== this.state.value) || (ariaValueText !== this.state.valueText)) {
				this.normalizeBounds(nextProps);
				const clampedValue = this.clamp(this.state.controlled ? value : this.state.value);
				const valueText = ariaValueText != null ? ariaValueText : clampedValue;
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
			if (this.context.Subscriber) {
				this.context.Subscriber.unsubscribe('resize', this.handleResize);
			}
		}

		normalizeBounds (props) {
			this.normalizedMax = props.max != null ? props.max : Wrapped.defaultProps.max;
			this.normalizedMin = props.min != null ? props.min : Wrapped.defaultProps.min;
		}

		clamp (value) {
			return clamp(this.normalizedMin, this.normalizedMax, value);
		}

		updateValueJob = new Job((value) => {
			const valueText = this.props['aria-valuetext'] != null ? this.props['aria-valuetext'] : value;
			this.inputNode.value = value;
			if (this.state.controlled) {
				// FIXME: Temporarily store value for mouse down to properly fire `onChange` for controlled slider.
				// The value will not change as componentWillReceiveProps sets state again with props.value, however
				// the "changed" value needs to be fired on mouse up.
				this.changedControlledValue = value;
			}

			this.setState({
				value,
				valueText
			});
			if (this.willChange) {
				forwardChange({value}, this.props);
				this.willChange = false;
				this.prevValue = value;
			}
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

		moveKnobByPointer (position) {
			const node = this.sliderBarNode.node;

			// Don't let the positional value exceed the bar width, and account for the dead-space padding
			const min = parseFloat(window.getComputedStyle(this.inputNode).paddingLeft);
			const pointer = position - this.inputNode.getBoundingClientRect().left;
			const knob = (clamp(min, min + node.offsetWidth, pointer) - min) / node.offsetWidth;

			this.current5WayValue = (this.normalizedMax - this.normalizedMin) * knob;

			// Update our instance's knowledge of where the knob should be
			this.knobPosition = knob;

			this.updateUI();
		}

		updateUI = () => {
			// intentionally breaking encapsulation to avoid having to specify multiple refs
			const {barNode, knobNode, loaderNode, node} = this.sliderBarNode;
			const {backgroundProgress, vertical} = this.props;
			const {value} = this.state;
			const proportionProgress = computeProportionProgress({value, max: this.normalizedMax, min: this.normalizedMin});
			const knobProgress = this.knobPosition != null ? this.knobPosition : proportionProgress;
			const currentKnobAfterMidpoint = knobProgress > 0.5;

			loaderNode.style.transform = computeBarTransform(backgroundProgress, vertical);
			barNode.style.transform = computeBarTransform(proportionProgress, vertical);
			// If we know the knob should be in a custom place, use that place; otherwise, sync it with the progress.
			knobNode.style.transform = computeKnobTransform(knobProgress, vertical, node);
			// Cannot upgrade `transform` to the newer, faster `setProperty` due to lack of support from PhantomJS
			// const knobTransform = computeKnobTransform(knobProgress, vertical, node);
			// knobNode.style.setProperty('transform', knobTransform);
			knobNode.style.setProperty('--knob-progress', knobProgress);
			knobNode.dataset.knobAfterMidpoint = currentKnobAfterMidpoint ? 'true' : 'false';

			if (currentKnobAfterMidpoint !== this.state.knobAfterMidpoint && this.props.tooltip) {
				// This dictates tooltip's correct left/right positioning
				this.setState({knobAfterMidpoint: currentKnobAfterMidpoint});
			}

			if (knobProgress !== this.detachedKnobPosition) {
				this.notifyKnobMove(knobProgress, knobProgress !== proportionProgress);
				this.detachedKnobPosition = knobProgress;
			}
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

		handleResize = () => {
			if (this.sliderBarNode) {
				this.updateUI();
			}
		}

		handleChange = (ev) => {
			if (this.props.disabled) return;

			ev.preventDefault();
			ev.stopPropagation(); // we don't want input's onChange synthetic event to propagate

			const value = parseNumber(ev.target.value);
			this.throttleUpdateValue(value);

			this.knobPosition = null;
		}

		handleMouseDown = (ev) => {
			forwardMouseDown(ev, this.props);
			this.prevValue = this.state.value;
		}

		handleMouseEnter = (ev) => {
			forwardMouseEnter(ev, this.props);

			if (!this.props.detachedKnob || this.props.disabled || this.props.vertical) return;

			this.moveKnobByPointer(ev.clientX);
		}

		handleMouseMove = (ev) => {
			forwardMouseMove(ev, this.props);
			this.willChange = Boolean(ev.buttons);

			// We don't want to run this code if any mouse button is being held down. That indicates dragging.
			if (!this.props.detachedKnob || this.props.disabled || ev.buttons || this.props.vertical) return;

			this.moveKnobByPointer(ev.clientX);
		}

		handleMouseLeave = (ev) => {
			forwardMouseLeave(ev, this.props);

			if (!this.props.detachedKnob || this.props.disabled) return;

			this.knobPosition = null;
			this.updateUI();
		}

		handleClick = (ev) => {
			forwardClick(ev, this.props);

			if (!this.props.disabled && Spotlight.getCurrent() !== this.sliderNode) {
				Spotlight.focus(this.sliderNode);
			}

			if (ev.target.nodeName === 'INPUT') {
				const value = parseNumber(this.state.controlled ? this.changedControlledValue : this.state.value);
				if (this.prevValue !== value) {
					forwardChange({value}, this.props);
					this.prevValue = null;
				}
			}
		}

		handleActivate = () => {
			const {'aria-valuetext': ariaValueText, detachedKnob, disabled, vertical} = this.props;

			if (disabled) return;

			if (detachedKnob) {
				if (this.current5WayValue !== null) {
					this.willChange = true;
					this.throttleUpdateValue(this.clamp(this.current5WayValue));

					// only clear knobPosition when not in
					if (!Spotlight.getPointerMode()) {
						this.knobPosition = null;
					}
				}
			} else {
				const verticalHint = $L('change a value with up down button');
				const horizontalHint = $L('change a value with left right button');
				const active = !this.state.active;

				let valueText = ariaValueText != null ? ariaValueText : this.state.value;
				if (active) {
					valueText = vertical ? verticalHint : horizontalHint;
				}

				this.setState({active, valueText});
			}
		}

		handleBlur = (ev) => {
			forwardBlur(ev, this.props);

			// on mouseup, slider manually focuses the slider from its input causing a blur event to
			// bubble here. if this is the case, focus hasn't effectively changed so we ignore it.
			if (
				ev.relatedTarget && (
					(ev.target === this.sliderNode && ev.relatedTarget === this.inputNode) ||
					(ev.target === this.inputNode && ev.relatedTarget === this.sliderNode)
				)
			) return;

			if (this.current5WayValue !== null) {
				this.current5WayValue = null;
				this.knobPosition = null;
				this.updateUI();
			}

			this.setState({
				focused: false
			});
		}

		handleIncrement = () => {
			if (this.props.disabled) return;

			const {detachedKnob, knobStep, step} = this.props;
			const amount = typeof knobStep === 'number' ? knobStep : step;
			if (detachedKnob) {
				this.moveKnobByAmount(amount);
			} else {
				this.willChange = true;
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
				this.willChange = true;
				this.throttleUpdateValueByAmount(-amount);
			}
		}

		handleFocus = (ev) => {
			forwardFocus(ev, this.props);

			if (this.props.detachedKnob) {
				this.current5WayValue = null;
				this.moveKnobByAmount(0);
			}

			this.setState({
				focused: true
			});
		}

		render () {
			const props = Object.assign({}, this.props);
			delete props.knobStep;

			return (
				<Wrapped
					role="slider"
					{...props}
					active={this.state.active}
					aria-disabled={this.props.disabled}
					aria-valuetext={this.state.valueText}
					focused={this.state.focused}
					inputRef={this.getInputNode}
					knobAfterMidpoint={this.state.knobAfterMidpoint}
					onActivate={this.handleActivate}
					onBlur={this.handleBlur}
					onChange={this.handleChange}
					onClick={this.handleClick}
					onDecrement={this.handleDecrement}
					onFocus={this.handleFocus}
					onIncrement={this.handleIncrement}
					onMouseDown={this.handleMouseDown}
					onMouseEnter={this.handleMouseEnter}
					onMouseLeave={this.handleMouseLeave}
					onMouseMove={this.handleMouseMove}
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
