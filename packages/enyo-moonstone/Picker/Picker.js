import {kind, hoc} from 'enyo-core';
import {Spottable} from 'enyo-spotlight';
import Pressable from 'enyo-ui/Pressable';
import R from 'ramda';
import React, {PropTypes} from 'react';

import Icon from '../Icon';
import IconButton from '../IconButton';

import css from './Picker.less';

const wrapRange = (min, max, value) => {
	const size = max - min + 1;
	const v = value - min;
	return (size + (v % size)) % size + min;
};

const onDown = (which) => ({joined, onMouseDown}) => (ev) => {
	if (joined && onMouseDown) {
		onMouseDown({pressed: which});
		ev.stopPropagation();
	}
};

const isButtonDisabled = (delta) => ({disabled, min, max, value, wrap}) => (disabled || (!wrap && R.clamp(min, max, value + delta) === value));

const selectIcon = (icon, v, h) => (props) => (props[icon] || (props.orientation === 'vertical' ? v : h));

const selectIncIcon = selectIcon('incrementIcon', 'arrowlargeup', 'arrowlargeright');

const selectDecIcon = selectIcon('decrementIcon', 'arrowlargedown', 'arrowlargeleft');

// Components
const PickerCore = kind({
	name: 'PickerCore',

	propTypes: {
		/**
		 * The initial value displayed in the picker.
		 *
		 * @type {Node}
		 * @required
		 * @public
		 */
		displayValue: PropTypes.node.isRequired,

		/**
		 * Assign a custom icon for the decrementer. All strings supported by [Icon]{Icon} are
		 * supported. Without a custom icon, the default is used, and is automatically changed when
		 * the [orientation]{Icon#orientation} is changed.
		 *
		 * @type {string}
		 * @default null
		 * @public
		 */
		decrementIcon: PropTypes.string,

		/**
		 * When `true`, the [button]{@glossary button} is shown as disabled and does not
		 * generate tap [events]{@glossary event}.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Assign a custom icon for the incrementer. All strings supported by [Icon]{Icon} are
		 * supported. Without a custom icon, the default is used, and is automatically changed when
		 * the [orientation]{Icon#orientation} is changed.
		 *
		 * @type {string}
		 * @default null
		 * @public
		 */
		incrementIcon: PropTypes.string,

		/**
		 * Determines the user interaction of the control. A joined picker allows the user to use
		 * the arrow keys to adjust the picker's value. The user may no longer use those arrow keys
		 * to navigate, while this control is focused. A non-joined control allows full navigation,
		 * but requires individual ENTER presses on the incrementer and decrementer buttons.
		 * Pointer interaction is the same for both formats.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		joined: PropTypes.bool,

		/**
		 * The maximum value selectable by the picker (inclusive).
		 *
		 * @type {[Number}
		 * @default 0
		 * @public
		 */
		max: PropTypes.number,

		/**
		 * The minimum value selectable by the picker (inclusive).
		 *
		 * @type {[Number}
		 * @default 0
		 * @public
		 */
		min: PropTypes.number,

		/**
		 * A function to run when the control decrements.
		 *
		 * @type {Function}
		 * @default null
		 * @public
		 */
		onDecrement: PropTypes.func,

		/**
		 * A function to run when the control increments.
		 *
		 * @type {Function}
		 * @default null
		 * @public
		 */
		onIncrement: PropTypes.func,

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
		 * @public
		 */
		value: PropTypes.number,

		/*
		 * Choose a specific size for your picker. `'small'`, `'medium'`, `'large'`, or set to `null` to
		 * assume auto-sizing. `'small'` is good for numeric pickers, `'medium'` for single or short
		 * word pickers, `'large'` for maximum-sized pickers.
		 *
		 * @type {String}
		 * @default null
		 * @public
		 */
		width: PropTypes.oneOf([null, 'small', 'medium', 'large']),

		/*
		 * Should the picker stop incrementing when the picker reaches the last element? Set `wrap`
		 * to true to allow the picker to continue from the opposite end of the list of options.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		wrap: PropTypes.bool
	},

	defaultProps: {
		disabled: false,
		joined: false,
		max: 0,
		min: 0,
		orientation: 'horizontal',
		step: 1,
		value: 0,
		wrap: false
	},

	styles: {
		css,
		classes: 'picker'
	},

	computed: {
		className: (props) => {
			const {joined, orientation, pressed, step, styler, width} = props;
			return styler.append(
				orientation,
				width,
				{
					joined,
					decrementing: (!isButtonDisabled(step * -1)(props) && pressed === 'decrement'),
					incrementing: (!isButtonDisabled(step)(props) && pressed === 'increment')
				}
			);
		},
		ButtonType: (props) => props.joined ? Icon : IconButton,
		decrementIcon: selectDecIcon,
		incrementIcon: selectIncIcon,
		decrementerDisabled: (props) => isButtonDisabled(props.step * -1)(props),
		incrementerDisabled: (props) => isButtonDisabled(props.step)(props),
		onIncDown: onDown('increment'),
		onDecDown: onDown('decrement'),
		onChange: ({min, max, disabled, value, wrap, onChange}) => (n) => {
			if (!disabled && onChange) {
				const next = wrap ? wrapRange(min, max, value + n) : R.clamp(min, max, value + n);
				return () => onChange({
					value: next
				});
			}
		}
	},

	render: ({ButtonType, decrementerDisabled, decrementIcon, displayValue, incrementerDisabled, incrementIcon, onChange, onIncDown, onDecDown, onMouseUp, step, ...rest}) => {
		delete rest.joined;
		delete rest.pressed;

		return (
			<div {...rest}>
				<span className={css.incrementer} disabled={incrementerDisabled} onClick={onChange(step)} onMouseDown={onIncDown} onMouseUp={onMouseUp}>
					<ButtonType disabled={incrementerDisabled}>{incrementIcon}</ButtonType>
				</span>
				<div className={css.valueWrapper}>
					<span className={css.value}>{displayValue}</span>
				</div>
				<span className={css.decrementer} disabled={decrementerDisabled} onClick={onChange(step * -1)} onMouseDown={onDecDown} onMouseUp={onMouseUp}>
					<ButtonType disabled={decrementerDisabled}>{decrementIcon}</ButtonType>
				</span>
			</div>
		);
	}
});

const PickerBase = kind({
	name: 'Picker',

	computed: {
		max: ({children}) => children.length - 1,
		displayValue: ({children, value}) => {
			return children[value];
		}
	},

	render: (props) => (
		<PickerCore {...props} min={0} />
	)
});

const SpottablePickerHoC = hoc(null, (config, Wrapped) => {
	return class SpottablePicker extends React.Component {
		render () {
			const Component = this.props.joined ? Spottable(Pressable(Wrapped)) : Wrapped;
			return <Component {...this.props} />;
		}
	};
});

const Picker = SpottablePickerHoC(PickerBase);

export default Picker;
export {Picker, PickerBase, PickerCore, SpottablePickerHoC};
