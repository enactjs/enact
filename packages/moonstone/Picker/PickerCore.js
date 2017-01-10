import * as jobs from '@enact/core/jobs';
import {childrenEquals} from '@enact/core/util';
import Holdable from '@enact/ui/Holdable';
import clamp from 'ramda/src/clamp';
import React from 'react';
import {SlideLeftArranger, SlideTopArranger, ViewManager} from '@enact/ui/ViewManager';
import shouldUpdate from 'recompose/shouldUpdate';
import {validateRange, validateStepped} from '../internal/validators';


import PickerButton from './PickerButton';
import css from './Picker.less';

const PickerViewManager = shouldUpdate((props, nextProps) => {
	return (
		props.index !== nextProps.index ||
		!childrenEquals(props.children, nextProps.children)
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

const jobNames = {
	emulateMouseUp: 'PickerCore.emulateMouseUp'
};

const emulateMouseEventsTimeout = 175;

const HoldablePickerButton = Holdable({resume: true, endHold: 'onLeave'}, PickerButton);

/**
 * The base component for {@link moonstone/Picker.PickerCore}.
 *
 * @class PickerCore
 * @memberof moonstone/Picker
 * @ui
 * @private
 */

const PickerCore = class extends React.Component {
	static displayName = 'PickerCore'

	static propTypes = /** @lends moonstone/Picker.PickerCore.prototype */ {
		/**
		 * Index for internal ViewManager
		 *
		 * @type {Number}
		 * @public
		 */
		index: React.PropTypes.number.isRequired,

		/**
		 * The maximum value selectable by the picker (inclusive).
		 *
		 * @type {Number}
		 * @public
		 */
		max: React.PropTypes.number.isRequired,

		/**
		 * The minimum value selectable by the picker (inclusive).
		 *
		 * @type {Number}
		 * @public
		 */
		min: React.PropTypes.number.isRequired,

		/**
		 * Children from which to pick
		 *
		 * @type {React.node}
		 * @public
		 */
		children: React.PropTypes.node,

		/**
		 * Class name for component
		 *
		 * @type {String}
		 * @public
		 */
		className: React.PropTypes.string,

		/**
		 * Assign a custom icon for the decrementer. All strings supported by [Icon]{Icon} are
		 * supported. Without a custom icon, the default is used, and is automatically changed when
		 * the [orientation]{Icon#orientation} is changed.
		 *
		 * @type {String}
		 * @public
		 */
		decrementIcon: React.PropTypes.string,

		/**
		 * When `true`, the [button]{@glossary button} is shown as disabled and does not
		 * generate tap [events]{@glossary event}.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: React.PropTypes.bool,

		/**
		 * Assign a custom icon for the incrementer. All strings supported by [Icon]{Icon} are
		 * supported. Without a custom icon, the default is used, and is automatically changed when
		 * the [orientation]{Icon#orientation} is changed.
		 *
		 * @type {String}
		 * @public
		 */
		incrementIcon: React.PropTypes.string,

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
		joined: React.PropTypes.bool,

		/**
		 * By default, the picker will animate transitions between items if it has a defined
		 * `width`. Specifying `noAnimation` will prevent any transition animation for the
		 * component.
		 *
		 * @type {Boolean}
		 * @public
		 */
		noAnimation: React.PropTypes.bool,

		/**
		 * A function to run when the control should increment or decrement.
		 *
		 * @type {Function}
		 * @public
		 */
		onChange: React.PropTypes.func,

		/**
		 * Initiate the pressed state
		 *
		 * @type {Function}
		 * @public
		 */
		onMouseDown: React.PropTypes.func,

		/**
		 * End the pressed state
		 *
		 * @type {Function}
		 * @public
		 */
		onMouseUp: React.PropTypes.func,

		/**
		 * Sets the orientation of the picker, whether the buttons are above and below or on the
		 * sides of the value. Must be either `'horizontal'` or `'vertical'`.
		 *
		 * @type {String}
		 * @default 'horizontal'
		 * @public
		 */
		orientation: React.PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * Which button (increment, decrement, or neither) is pressed
		 *
		 * @type {Number|null}
		 * @public
		 */
		pressed: React.PropTypes.oneOfType([
			React.PropTypes.number,
			React.PropTypes.bool
		]),

		/**
		 * Allow the picker to only increment or decrement by a given value. A step of `2` would
		 * cause a picker to increment from 10 to 12 to 14, etc.
		 *
		 * @type {Number}
		 * @default 1
		 * @public
		 */
		step: React.PropTypes.number,

		/**
		 * Index of the selected child
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: React.PropTypes.number,

		/**
		 * Choose a specific size for your picker. `'small'`, `'medium'`, `'large'`, or set to `null` to
		 * assume auto-sizing. `'small'` is good for numeric pickers, `'medium'` for single or short
		 * word pickers, `'large'` for maximum-sized pickers.
		 *
		 * @type {String}
		 * @public
		 */
		width: React.PropTypes.oneOf([null, 'small', 'medium', 'large']),

		/**
		 * Should the picker stop incrementing when the picker reaches the last element? Set `wrap`
		 * to `true` to allow the picker to continue from the opposite end of the list of options.
		 *
		 * @type {Boolean}
		 * @public
		 */
		wrap: React.PropTypes.bool
	}

	static defaultProps = {
		orientation: 'horizontal',
		step: 1,
		value: 0
	}

	constructor (props) {
		super(props);

		if (__DEV__) {
			validateRange(props.value, props.min, props.max, PickerCore.displayName);
			validateStepped(props.value, props.min, props.step, PickerCore.displayName);
			validateStepped(props.max, props.min, props.step, PickerCore.displayName, '"max"');
		}
	}

	componentWillReceiveProps (nextProps) {
		const first = nextProps.min;
		const last = nextProps.max;
		const nextValue = nextProps.value;

		if (__DEV__) {
			validateRange(nextValue, first, last, PickerCore.displayName);
			validateStepped(nextValue, first, nextProps.step, PickerCore.displayName);
			validateStepped(last, first, nextProps.step, PickerCore.displayName, '"max"');
		}
		const wrapToStart = nextProps.wrap && nextProps.value === first && this.props.value === last;
		const wrapToEnd = nextProps.wrap && nextProps.value === last && this.props.value === first;

		if (wrapToStart) {
			this.reverseTransition = false;
		} else if (wrapToEnd) {
			this.reverseTransition = true;
		} else {
			this.reverseTransition = nextProps.value < this.props.value;
		}
	}

	componentWillUnmount () {
		for (const job of Object.keys(jobNames)) {
			jobs.stopJob(jobNames[job]);
		}
	}

	computeNextValue = (delta) => {
		const {min, max, value, wrap} = this.props;
		return wrap ? wrapRange(min, max, value + delta) : clamp(min, max, value + delta);
	}

	isButtonDisabled = (delta) => {
		const {disabled, value} = this.props;
		return disabled || this.computeNextValue(delta) === value;
	}

	handleChange = (dir) => {
		const {disabled, onChange, step} = this.props;
		if (!disabled && onChange) {
			const value = this.computeNextValue(dir * step);
			onChange({value});
		}
	}

	handleDecClick = () => {
		if (!this.isButtonDisabled(this.props.step * -1)) {
			this.handleChange(-1);
		}
	}

	handleIncClick = () => {
		if (!this.isButtonDisabled(this.props.step)) {
			this.handleChange(1);
		}
	}

	handleDown = (dir) => {
		const {joined, onMouseDown} = this.props;
		if (joined && onMouseDown) {
			onMouseDown({pressed: dir});
		}
	}

	handleDecDown = () => this.handleDown(-1)

	handleIncDown = () => this.handleDown(1)

	handleWheel = (ev) => {
		const {onMouseUp, step} = this.props;
		const dir = -Math.sign(ev.deltaY);

		// We'll sometimes get a 0/-0 wheel event we need to ignore or the wheel event has reached
		// the bounds of the picker
		if (dir && !this.isButtonDisabled(step * dir)) {
			// fire the onChange event
			this.handleChange(dir);
			// simulate mouse down
			this.handleDown(dir);
			// set a timer to simulate the mouse up
			jobs.startJob(jobNames.emulateMouseUp, onMouseUp, emulateMouseEventsTimeout);
			// prevent the default scroll behavior to avoid bounce back
			ev.preventDefault();
		}
	}

	handleDecPulse = () => {
		if (!this.isButtonDisabled(this.props.step * -1)) {
			this.handleDecDown();
			this.handleChange(-1);
		}
	}

	handleIncPulse = () => {
		if (!this.isButtonDisabled(this.props.step)) {
			this.handleIncDown();
			this.handleChange(1);
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

	render () {
		const {
			noAnimation,
			children,
			disabled,
			index,
			joined,
			onMouseUp,
			orientation,
			step,
			width,
			...rest
		} = this.props;

		delete rest.decrementIcon;
		delete rest.incrementIcon;
		delete rest.max;
		delete rest.min;
		delete rest.onChange;
		delete rest.onMouseDown;
		delete rest.pressed;
		delete rest.reverseTransition;
		delete rest.value;
		delete rest.wrap;

		const incrementIcon = selectIncIcon(this.props);
		const decrementIcon = selectDecIcon(this.props);

		const decrementerDisabled = this.isButtonDisabled(step * -1);
		const incrementerDisabled = this.isButtonDisabled(step);
		const classes = this.determineClasses(decrementerDisabled, incrementerDisabled);
		let arranger;

		if (width && !disabled) {
			arranger = orientation === 'vertical' ? SlideTopArranger : SlideLeftArranger;
		}

		return (
			<div {...rest} className={classes} disabled={disabled} onWheel={joined ? this.handleWheel : null}>
				<HoldablePickerButton
					className={css.incrementer}
					disabled={incrementerDisabled}
					onClick={this.handleIncClick}
					onMouseDown={this.handleIncDown}
					onMouseUp={onMouseUp}
					onHoldPulse={this.handleIncPulse}
					joined={joined}
					icon={incrementIcon}
				/>
				<PickerViewManager
					arranger={arranger}
					duration={100}
					index={index}
					noAnimation={noAnimation}
					reverseTransition={this.reverseTransition}
					className={css.valueWrapper}
				>
					{children}
				</PickerViewManager>
				<HoldablePickerButton
					className={css.decrementer}
					disabled={decrementerDisabled}
					onClick={this.handleDecClick}
					onMouseDown={this.handleDecDown}
					onMouseUp={onMouseUp}
					onHoldPulse={this.handleDecPulse}
					joined={joined}
					icon={decrementIcon}
				/>
			</div>
		);
	}
};

export default PickerCore;
export {PickerCore};
