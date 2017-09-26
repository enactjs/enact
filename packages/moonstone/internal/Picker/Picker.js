import {forward} from '@enact/core/handle';
import clamp from 'ramda/src/clamp';
import equals from 'ramda/src/equals';
import {is} from '@enact/core/keymap';
import {Job} from '@enact/core/util';
import React from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import {SlideLeftArranger, SlideTopArranger, ViewManager} from '@enact/ui/ViewManager';
import {getDirection} from '@enact/spotlight';

import Skinnable from '../../Skinnable';
import {validateRange, validateStepped} from '../validators';
import DisappearSpotlightDecorator from '../DisappearSpotlightDecorator';

import IdProvider from '../IdProvider';
import $L from '../$L';
import PickerButton from './PickerButton';

import css from './Picker.less';

const isDown = is('down');
const isLeft = is('left');
const isRight = is('right');
const isUp = is('up');

const PickerViewManager = shouldUpdate((props, nextProps) => {
	return (
		props.index !== nextProps.index ||
		!equals(props.children, nextProps.children)
	);
})(ViewManager);

const wrapRange = (min, max, value) => {
	if (value > max) {
		return min;
	} else if (value < min) {
		return max;
	} else {
		return value;
	}
};

const selectIcon = (icon, v, h) => (props) => (props[icon] || (props.orientation === 'vertical' ? v : h));

const selectIncIcon = selectIcon('incrementIcon', 'arrowlargeup', 'arrowlargeright');

const selectDecIcon = selectIcon('decrementIcon', 'arrowlargedown', 'arrowlargeleft');

// Set-up event forwarding
const forwardBlur = forward('onBlur'),
	forwardFocus = forward('onFocus'),
	forwardKeyDown = forward('onKeyDown'),
	forwardKeyUp = forward('onKeyUp'),
	forwardMouseDown = forward('onMouseDown'),
	forwardMouseUp = forward('onMouseUp'),
	forwardWheel = forward('onWheel');

/**
 * The base component for {@link moonstone/internal/Picker.Picker}.
 *
 * @class Picker
 * @memberof moonstone/internal/Picker
 * @ui
 * @private
 */

const PickerBase = class extends React.Component {
	static displayName = 'Picker'

	static propTypes = /** @lends moonstone/internal/Picker.Picker.prototype */ {
		/**
		 * Index for internal ViewManager
		 *
		 * @type {Number}
		 * @public
		 */
		index: PropTypes.number.isRequired,

		/**
		 * The maximum value selectable by the picker (inclusive).
		 *
		 * @type {Number}
		 * @public
		 */
		max: PropTypes.number.isRequired,

		/**
		 * The minimum value selectable by the picker (inclusive).
		 *
		 * @type {Number}
		 * @public
		 */
		min: PropTypes.number.isRequired,

		/**
		 * Overrides the `aria-valuetext` for the picker. By default, `aria-valuetext` is set
		 * to the current selected child and accessibilityHint text.
		 *
		 * @type {String}
		 * @memberof moonstone/internal/Picker.Picker.prototype
		 * @public
		 */
		'aria-valuetext': PropTypes.string,

		/**
		 * Accessibility hint
		 * For example, `hour`, `year`, and `meridiem`
		 *
		 * @type {String}
		 * @default ''
		 * @public
		 */
		accessibilityHint: PropTypes.string,

		/**
		 * Children from which to pick
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Class name for component
		 *
		 * @type {String}
		 * @public
		 */
		className: PropTypes.string,

		/**
		 * Assign a custom icon for the decrementer. All strings supported by [Icon]{Icon} are
		 * supported. Without a custom icon, the default is used, and is automatically changed when
		 * the [orientation]{Icon#orientation} is changed.
		 *
		 * @type {String}
		 * @public
		 */
		decrementIcon: PropTypes.string,

		/**
		 * When `true`, the Picker is shown as disabled and does not generate `onChange`
		 * [events]{@glossary event}.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The picker id reference for setting aria-controls.
		 *
		 * @type {String}
		 * @private
		 */
		id: PropTypes.string,

		/**
		 * Assign a custom icon for the incrementer. All strings supported by [Icon]{Icon} are
		 * supported. Without a custom icon, the default is used, and is automatically changed when
		 * the [orientation]{Icon#orientation} is changed.
		 *
		 * @type {String}
		 * @public
		 */
		incrementIcon: PropTypes.string,

		/**
		 * Determines the user interaction of the control. A joined picker allows the user to use
		 * the arrow keys to adjust the picker's value. The user may no longer use those arrow keys
		 * to navigate, while this control is focused. A split control allows full navigation,
		 * but requires individual ENTER presses on the incrementer and decrementer buttons.
		 * Pointer interaction is the same for both formats.
		 *
		 * @type {Boolean}
		 * @public
		 */
		joined: PropTypes.bool,

		/**
		 * By default, the picker will animate transitions between items if it has a defined
		 * `width`. Specifying `noAnimation` will prevent any transition animation for the
		 * component.
		 *
		 * @type {Boolean}
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * A function to run when the control should increment or decrement.
		 *
		 * @type {Function}
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * A function to run when the decrement button is disabled
		 *
		 * @type {Function}
		 * @private
		 */
		onDecrementSpotlightDisappear: PropTypes.func,

		/**
		 * A function to run when the Increment button is disabled
		 *
		 * @type {Function}
		 * @private
		 */
		onIncrementSpotlightDisappear: PropTypes.func,

		/**
		 * Initiate the pressed state
		 *
		 * @type {Function}
		 * @public
		 */
		onMouseDown: PropTypes.func,

		/**
		 * End the pressed state
		 *
		 * @type {Function}
		 * @public
		 */
		onMouseUp: PropTypes.func,

		/**
		 * The handler to run prior to focus leaving the picker when the 5-way down key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onPickerSpotlightDown: PropTypes.func,

		/**
		 * The handler to run prior to focus leaving the picker when the 5-way left key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onPickerSpotlightLeft: PropTypes.func,

		/**
		 * The handler to run prior to focus leaving the picker when the 5-way right key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onPickerSpotlightRight: PropTypes.func,

		/**
		 * The handler to run prior to focus leaving the picker when the 5-way up key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onPickerSpotlightUp: PropTypes.func,

		/**
		 * Sets the orientation of the picker, whether the buttons are above and below or on the
		 * sides of the value. Must be either `'horizontal'` or `'vertical'`.
		 *
		 * @type {String}
		 * @default 'horizontal'
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * Which button (increment, decrement, or neither) is pressed
		 *
		 * @type {Number|null}
		 * @public
		 */
		pressed: PropTypes.oneOfType([
			PropTypes.number,
			PropTypes.bool
		]),

		/**
		 * When `true`, the picker buttons operate in the reverse direction such that pressing
		 * up/left decrements the value and down/right increments the value. This is more natural
		 * for vertical lists of text options where "up" implies a spatial change rather than
		 * incrementing the value.
		 *
		 * @type {Boolean}
		 * @public
		 */
		reverse: PropTypes.bool,

		/**
		 * When `true`, the component cannot be navigated using spotlight.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		spotlightDisabled: PropTypes.bool,

		/**
		 * Allow the picker to only increment or decrement by a given value. A step of `2` would
		 * cause a picker to increment from 10 to 12 to 14, etc.
		 *
		 * @type {Number}
		 * @default 1
		 * @public
		 */
		step: PropTypes.number,

		/**
		 * Index of the selected child
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: PropTypes.number,

		/**
		 * Choose a specific size for your picker. `'small'`, `'medium'`, `'large'`, or set to `null` to
		 * assume auto-sizing. `'small'` is good for numeric pickers, `'medium'` for single or short
		 * word pickers, `'large'` for maximum-sized pickers.
		 *
		 * You may also supply a number. This number will determine the minumum size of the Picker.
		 * Setting a number to less than the number of characters in your longest value may produce
		 * unexpected results.
		 *
		 * @type {String|Number}
		 * @public
		 */
		width: PropTypes.oneOfType([
			PropTypes.oneOf([null, 'small', 'medium', 'large']),
			PropTypes.number
		]),

		/**
		 * Should the picker stop incrementing when the picker reaches the last element? Set `wrap`
		 * to `true` to allow the picker to continue from the opposite end of the list of options.
		 *
		 * @type {Boolean}
		 * @public
		 */
		wrap: PropTypes.bool
	}

	static defaultProps = {
		accessibilityHint: '',
		orientation: 'horizontal',
		spotlightDisabled: false,
		step: 1,
		value: 0
	}

	constructor (props) {
		super(props);

		this.state = {
			// Set to `true` onFocus and `false` onBlur to prevent setting aria-valuetext (which
			// will notify the user) when the component does not have focus
			active: false
		};

		this.initContainerRef = this.initRef('containerRef');

		if (__DEV__) {
			validateRange(props.value, props.min, props.max, PickerBase.displayName);
			validateStepped(props.value, props.min, props.step, PickerBase.displayName);
			validateStepped(props.max, props.min, props.step, PickerBase.displayName, '"max"');
		}
	}

	componentDidMount () {
		if (this.props.joined) {
			this.containerRef.addEventListener('wheel', this.handleWheel);
		}
	}

	componentWillReceiveProps (nextProps) {
		const first = nextProps.min;
		const last = nextProps.max;
		const nextValue = nextProps.value;

		if (__DEV__) {
			validateRange(nextValue, first, last, PickerBase.displayName);
			validateStepped(nextValue, first, nextProps.step, PickerBase.displayName);
			validateStepped(last, first, nextProps.step, PickerBase.displayName, '"max"');
		}
	}

	componentDidUpdate () {
		if (this.props.joined) {
			this.containerRef.addEventListener('wheel', this.handleWheel);
		} else {
			this.containerRef.removeEventListener('wheel', this.handleWheel);
		}
	}

	componentWillUnmount () {
		this.emulateMouseUp.stop();
		this.throttleInc.stop();
		this.throttleDec.stop();
		this.throttleWheelInc.stop();
		this.throttleWheelDec.stop();
		if (this.props.joined) {
			this.containerRef.removeEventListener('wheel', this.handleWheel);
		}
	}

	computeNextValue = (delta) => {
		const {min, max, value, wrap} = this.props;
		return wrap ? wrapRange(min, max, value + delta) : clamp(min, max, value + delta);
	}

	adjustDirection = (dir) => this.props.reverse ? -dir : dir

	hasReachedBound = (delta) => {
		const {value} = this.props;
		return this.computeNextValue(this.adjustDirection(delta)) === value;
	}

	updateValue = (dir) => {
		const {disabled, onChange, step} = this.props;
		dir = this.adjustDirection(dir);
		this.setTransitionDirection(dir);
		if (!disabled && onChange) {
			const value = this.computeNextValue(dir * step);
			onChange({value});
		}
	}

	handleBlur = (ev) => {
		forwardBlur(ev, this.props);

		this.setState({
			active: false
		});
	}

	handleFocus = (ev) => {
		forwardFocus(ev, this.props);

		this.setState({
			active: true
		});
	}

	setTransitionDirection = (dir) => {
		// change the transition direction based on the button press
		this.reverseTransition = !(dir > 0);
	}

	handleDecrement = () => {
		if (!this.hasReachedBound(-this.props.step)) {
			this.updateValue(-1);
			this.handleDown(-1);
		}
	}

	handleIncrement = () => {
		if (!this.hasReachedBound(this.props.step)) {
			this.updateValue(1);
			this.handleDown(1);
		}
	}

	handleDown = (dir) => {
		const {joined, onMouseDown} = this.props;
		if (joined && onMouseDown) {
			onMouseDown({pressed: dir});
		}
	}

	emulateMouseUp = new Job((ev) => {
		const {onMouseUp} = this.props;
		if (onMouseUp) {
			onMouseUp(ev);
		}
	}, 175)

	handleUp = (ev) => {
		const {joined} = this.props;
		forwardMouseUp(ev, this.props);
		if (joined) {
			this.emulateMouseUp.start();
		}
	}

	handleDecDown = (ev) => {
		if (ev) {
			forwardMouseDown(ev, this.props);
		}
		this.handleDecrement();
	}

	handleIncDown = (ev) => {
		if (ev) {
			forwardMouseDown(ev, this.props);
		}
		this.handleIncrement();
	}

	handleWheel = (ev) => {
		const {joined, step} = this.props;
		forwardWheel(ev, this.props);

		if (joined) {
			const dir = -Math.sign(ev.deltaY);

			// We'll sometimes get a 0/-0 wheel event we need to ignore or the wheel event has reached
			// the bounds of the picker
			if (dir && !this.hasReachedBound(step * dir)) {
				// fire the onChange event
				if (dir > 0) {
					this.throttleWheelInc.throttle();
				} else if (dir < 0) {
					this.throttleWheelDec.throttle();
				}
				// simulate mouse down
				this.handleDown(dir);
				// set a timer to simulate the mouse up
				this.emulateMouseUp.start(ev);
				// prevent the default scroll behavior to avoid bounce back
				ev.preventDefault();
				ev.stopPropagation();
			}
		}
	}

	handleDecPulse = () => {
		if (!this.hasReachedBound(this.props.step * -1)) {
			this.handleDecDown();
			this.updateValue(-1);
		}
	}

	handleIncPulse = () => {
		if (!this.hasReachedBound(this.props.step)) {
			this.handleIncDown();
			this.updateValue(1);
		}
	}

	throttleInc = new Job(this.handleIncrement, 200)

	throttleDec = new Job(this.handleDecrement, 200)

	throttleWheelInc = new Job(this.handleIncrement, 100)

	throttleWheelDec = new Job(this.handleDecrement, 100)

	handleKeyDown = (ev) => {
		const {
			joined,
			onPickerSpotlightDown,
			onPickerSpotlightLeft,
			onPickerSpotlightRight,
			onPickerSpotlightUp,
			orientation
		} = this.props;
		const {keyCode} = ev;
		forwardKeyDown(ev, this.props);

		if (joined) {
			const direction = getDirection(keyCode);

			const directions = {
				up: this.throttleInc.throttle,
				down: this.throttleDec.throttle,
				right: this.throttleInc.throttle,
				left: this.throttleDec.throttle
			};

			const isVertical = orientation === 'vertical' && (isUp(keyCode) || isDown(keyCode));
			const isHorizontal = orientation === 'horizontal' && (isRight(keyCode) || isLeft(keyCode));

			if (isVertical || isHorizontal) {
				directions[direction]();
				ev.preventDefault();
				ev.stopPropagation();
				this.emulateMouseUp.start(ev);
			} else if (orientation === 'horizontal' && isDown(keyCode) && onPickerSpotlightDown) {
				onPickerSpotlightDown(ev);
			} else if (orientation === 'horizontal' && isUp(keyCode) && onPickerSpotlightUp) {
				onPickerSpotlightUp(ev);
			} else if (orientation === 'vertical' && isLeft(keyCode) && onPickerSpotlightLeft) {
				onPickerSpotlightLeft(ev);
			} else if (orientation === 'vertical' && isRight(keyCode) && onPickerSpotlightRight) {
				onPickerSpotlightRight(ev);
			}
		}
	}

	handleKeyUp = (ev) => {
		const {
			joined,
			orientation
		} = this.props;
		const {keyCode} = ev;
		forwardKeyUp(ev, this.props);

		if (joined) {
			const direction = getDirection(keyCode);

			const directions = {
				up: this.throttleInc.stop,
				down: this.throttleDec.stop,
				right: this.throttleInc.stop,
				left: this.throttleDec.stop
			};

			const isVertical = orientation === 'vertical' && (isUp(keyCode) || isDown(keyCode));
			const isHorizontal = orientation === 'horizontal' && (isRight(keyCode) || isLeft(keyCode));

			if (isVertical || isHorizontal) {
				directions[direction]();
			}
		}
	}

	handleDecKeyDown = (ev) => {
		const {keyCode} = ev;
		const {
			onPickerSpotlightDown,
			onPickerSpotlightLeft,
			onPickerSpotlightRight,
			onPickerSpotlightUp,
			orientation,
			step
		} = this.props;

		if (isDown(keyCode) && onPickerSpotlightDown) {
			onPickerSpotlightDown(ev);
		} else if (isLeft(keyCode) && onPickerSpotlightLeft) {
			onPickerSpotlightLeft(ev);
		} else if (isRight(keyCode) && onPickerSpotlightRight && (orientation === 'vertical' || this.hasReachedBound(step))) {
			onPickerSpotlightRight(ev);
		} else if (isUp(keyCode) && onPickerSpotlightUp && (orientation === 'horizontal' || this.hasReachedBound(step))) {
			onPickerSpotlightUp(ev);
		}
	}

	handleIncKeyDown = (ev) => {
		const {keyCode} = ev;
		const {
			onPickerSpotlightDown,
			onPickerSpotlightLeft,
			onPickerSpotlightRight,
			onPickerSpotlightUp,
			orientation,
			step
		} = this.props;

		if (isDown(keyCode) && onPickerSpotlightDown && (orientation === 'horizontal' || this.hasReachedBound(step * -1))) {
			onPickerSpotlightDown(ev);
		} else if (isLeft(keyCode) && onPickerSpotlightLeft && (orientation === 'vertical' || this.hasReachedBound(step * -1))) {
			onPickerSpotlightLeft(ev);
		} else if (isRight(keyCode) && onPickerSpotlightRight) {
			onPickerSpotlightRight(ev);
		} else if (isUp(keyCode) && onPickerSpotlightUp) {
			onPickerSpotlightUp(ev);
		}
	}

	determineClasses (decrementerDisabled, incrementerDisabled) {
		const {joined, orientation, pressed, width} = this.props;
		return [
			css.picker,
			css[orientation],
			css[width],
			joined ? css.joined : null,
			!decrementerDisabled && pressed === -1 ? css.decrementing : null,
			!incrementerDisabled && pressed === 1 ? css.incrementing : null,
			this.props.className
		].join(' ');
	}

	calcValueText () {
		const {accessibilityHint, children, index, value} = this.props;
		let valueText = value;

		// Sometimes this.props.value is not equal to node text content. For example, when `PM`
		// is shown in AM/PM picker, its value is `1` and its node.textContent is `PM`. In this
		// case, Screen readers should read `PM` instead of `1`.
		if (children && Array.isArray(children)) {
			valueText = (children[index]) ? children[index].props.children : value;
		} else if (children && children.props && !children.props.children) {
			valueText = children.props.children;
		}

		if (accessibilityHint) {
			valueText = `${valueText} ${accessibilityHint}`;
		}

		return valueText;
	}

	calcButtonLabel (next, valueText) {
		// no label is necessary when joined
		if (!this.props.joined) {
			return `${valueText} ${next ? $L('next item') : $L('previous item')}`;
		}
	}

	calcDecrementLabel (valueText) {
		return this.calcButtonLabel(this.props.reverse, valueText);
	}

	calcIncrementLabel (valueText) {
		return this.calcButtonLabel(!this.props.reverse, valueText);
	}

	calcJoinedLabel (valueText) {
		const {orientation} = this.props;
		const hint = orientation === 'horizontal' ? $L('change a value with left right button') : $L('change a value with up down button');
		return `${valueText} ${hint}`;
	}

	initRef (prop) {
		return (ref) => {
			this[prop] = ref;
		};
	}

	render () {
		const {active} = this.state;
		const {
			'aria-valuetext': ariaValueText,
			noAnimation,
			children,
			disabled,
			id,
			index,
			joined,
			onDecrementSpotlightDisappear,
			onIncrementSpotlightDisappear,
			orientation,
			spotlightDisabled,
			step,
			width,
			...rest
		} = this.props;

		delete rest.accessibilityHint;
		delete rest.decrementIcon;
		delete rest.incrementIcon;
		delete rest.max;
		delete rest.min;
		delete rest.onChange;
		delete rest.onMouseDown;
		delete rest.onMouseUp;
		delete rest.onPickerSpotlightDown;
		delete rest.onPickerSpotlightLeft;
		delete rest.onPickerSpotlightRight;
		delete rest.onPickerSpotlightUp;
		delete rest.pressed;
		delete rest.reverse;
		delete rest.value;
		delete rest.wrap;

		const incrementIcon = selectIncIcon(this.props);
		const decrementIcon = selectDecIcon(this.props);

		const reachedStart = this.hasReachedBound(step * -1);
		const decrementerDisabled = disabled || reachedStart;
		const reachedEnd = this.hasReachedBound(step);
		const incrementerDisabled = disabled || reachedEnd;
		const classes = this.determineClasses(decrementerDisabled, incrementerDisabled);

		let arranger;
		if (!noAnimation && !disabled) {
			arranger = orientation === 'vertical' ? SlideTopArranger : SlideLeftArranger;
		}

		let sizingPlaceholder = null;
		if (typeof width === 'number' && width > 0) {
			sizingPlaceholder = <div aria-hidden className={css.sizingPlaceholder}>{ '0'.repeat(width) }</div>;
		}

		const valueText = this.calcValueText();
		const decrementerAriaControls = !incrementerDisabled ? id : null;
		const incrementerAriaControls = !decrementerDisabled ? id : null;

		return (
			<div
				{...rest}
				aria-controls={joined ? id : null}
				aria-disabled={disabled}
				aria-label={joined ? this.calcJoinedLabel(valueText) : null}
				className={classes}
				disabled={disabled}
				onBlur={this.handleBlur}
				onFocus={this.handleFocus}
				onKeyDown={this.handleKeyDown}
				onKeyUp={this.handleKeyUp}
				onMouseUp={this.handleUp}
				ref={this.initContainerRef}
			>
				<PickerButton
					aria-controls={!joined ? incrementerAriaControls : null}
					aria-label={this.calcIncrementLabel(ariaValueText != null ? ariaValueText : valueText)}
					className={css.incrementer}
					disabled={incrementerDisabled}
					hidden={reachedEnd}
					icon={incrementIcon}
					joined={joined}
					onHoldPulse={this.handleIncPulse}
					onKeyDown={this.handleIncKeyDown}
					onMouseDown={this.handleIncDown}
					onMouseUp={this.handleUp}
					onSpotlightDisappear={onIncrementSpotlightDisappear}
					spotlightDisabled={spotlightDisabled}
				/>
				<div
					aria-disabled={disabled}
					aria-hidden={!active}
					aria-valuetext={ariaValueText != null ? ariaValueText : valueText}
					className={css.valueWrapper}
					id={id}
					role="spinbutton"
				>
					{sizingPlaceholder}
					<PickerViewManager
						aria-hidden
						arranger={arranger}
						duration={100}
						index={index}
						noAnimation={noAnimation}
						reverseTransition={this.reverseTransition}
					>
						{children}
					</PickerViewManager>
				</div>
				<PickerButton
					aria-controls={!joined ? decrementerAriaControls : null}
					aria-label={this.calcDecrementLabel(ariaValueText != null ? ariaValueText : valueText)}
					className={css.decrementer}
					disabled={decrementerDisabled}
					hidden={reachedStart}
					icon={decrementIcon}
					joined={joined}
					onHoldPulse={this.handleDecPulse}
					onKeyDown={this.handleDecKeyDown}
					onMouseDown={this.handleDecDown}
					onMouseUp={this.handleUp}
					onSpotlightDisappear={onDecrementSpotlightDisappear}
					spotlightDisabled={spotlightDisabled}
				/>
			</div>
		);
	}
};

const Picker = IdProvider(
	{generateProp: null, prefix: 'p_'},
	Skinnable(
		DisappearSpotlightDecorator(
			{events: {
				onDecrementSpotlightDisappear: `.${css.incrementer}`,
				onIncrementSpotlightDisappear: `.${css.decrementer}`
			}},
			PickerBase
		)
	)
);

export default Picker;
export {Picker};
export PickerItem from './PickerItem';
