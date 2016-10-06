import {SlideLeftArranger, SlideBottomArranger, ViewManager} from '@enact/ui/ViewManager';
import R from 'ramda';
import React from 'react';

import Icon from '../Icon';
import IconButton from '../IconButton';

import {steppedNumber} from './PickerPropTypes';
import css from './Picker.less';

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

// Components
const PickerCore = class extends React.Component {
	static displayName = 'PickerCore'

	static propTypes = {
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
		max: steppedNumber.isRequired,

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
		 * @type {string}
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
		 * @type {string}
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
		 * By default, the picker will animation transitions between items if it has a defined
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
		 * @type {String|null}
		 * @public
		 */
		pressed: React.PropTypes.oneOfType([
			React.PropTypes.string,
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
		value: steppedNumber,

		/*
		 * Choose a specific size for your picker. `'small'`, `'medium'`, `'large'`, or set to `null` to
		 * assume auto-sizing. `'small'` is good for numeric pickers, `'medium'` for single or short
		 * word pickers, `'large'` for maximum-sized pickers.
		 *
		 * @type {String}
		 * @public
		 */
		width: React.PropTypes.oneOf([null, 'small', 'medium', 'large']),

		/*
		 * Should the picker stop incrementing when the picker reaches the last element? Set `wrap`
		 * to true to allow the picker to continue from the opposite end of the list of options.
		 *
		 * @type {Boolean}
		 * @public
		 */
		wrap: React.PropTypes.bool
	}

	static defaultProps = {
		step: 1,
		value: 0
	}

	componentWillReceiveProps (nextProps) {
		const first = nextProps.min;
		const last = nextProps.max;

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

	isButtonDisabled = (delta) => {
		const {disabled, min, max, value, wrap} = this.props;
		return disabled || (!wrap && R.clamp(min, max, value + delta) === value);
	}

	handleChange = (n) => {
		const {min, max, disabled, value, wrap, onChange} = this.props;
		if (!disabled && onChange) {
			const next = wrap ? wrapRange(min, max, value + n) : R.clamp(min, max, value + n);
			onChange({
				value: next
			});
		}
	}

	handleDecClick = () => {
		const disabled = this.isButtonDisabled(this.props.step * -1);
		if (!disabled) {
			this.handleChange(-this.props.step);
		}
	}

	handleIncClick = () => {
		const disabled = this.isButtonDisabled(this.props.step);
		if (!disabled) {
			this.handleChange(this.props.step);
		}
	}

	handleDown = (which, ev) => {
		const {joined, onMouseDown} = this.props;
		if (joined && onMouseDown) {
			onMouseDown({pressed: which});
			ev.stopPropagation();
		}
	}

	handleDecDown = (ev) => this.handleDown('decrement', ev)

	handleIncDown = (ev) => this.handleDown('increment', ev)

	determineClasses () {
		const {joined, orientation, pressed, step, width} = this.props;
		return [
			css.picker,
			css[orientation],
			css[width],
			joined ? css.joined : null,
			!this.isButtonDisabled(step * -1) && pressed === 'decrement' ? css.decrementing : null,
			!this.isButtonDisabled(step) && pressed === 'increment' ? css.incrementing : null,
			this.props.className
		].join(' ');
	}

	// eslint-disable-next-line react/prop-types, react/display-name
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
		delete rest.pressed;
		delete rest.reverseTransition;
		delete rest.value;
		delete rest.wrap;

		const ButtonType = joined ? Icon : IconButton;
		const incrementIcon = selectIncIcon(this.props);
		const decrementIcon = selectDecIcon(this.props);

		const decrementerDisabled = this.isButtonDisabled(step * -1);
		const incrementerDisabled = this.isButtonDisabled(step);
		const classes = this.determineClasses();

		let arranger;
		if (width && !disabled) {
			arranger = orientation === 'vertical' ? SlideBottomArranger : SlideLeftArranger;
		}

		return (
			<div {...rest} className={classes} disabled={disabled}>
				<span className={css.incrementer} disabled={incrementerDisabled} onClick={this.handleIncClick} onMouseDown={this.handleIncDown} onMouseUp={onMouseUp}>
					<ButtonType disabled={incrementerDisabled}>{incrementIcon}</ButtonType>
				</span>
				<ViewManager arranger={arranger} duration={200} index={index} noAnimation={noAnimation} reverseTransition={this.reverseTransition} className={css.valueWrapper}>
					{children}
				</ViewManager>
				<span className={css.decrementer} disabled={decrementerDisabled} onClick={this.handleDecClick} onMouseDown={this.handleDecDown} onMouseUp={onMouseUp}>
					<ButtonType disabled={decrementerDisabled}>{decrementIcon}</ButtonType>
				</span>
			</div>
		);
	}
};

export default PickerCore;
export {PickerCore};
