import kind from 'enact-core/kind';
import React from 'react';

import PickerCore from './PickerCore';
import PickerItem from './PickerItem';
import SpottablePicker from './SpottablePicker';

const PickerBase = kind({
	name: 'Picker',

	propTypes: {
		/**
		 * Children from which to pick
		 *
		 * @type {React.node}
		 * @public
		 */
		children: React.PropTypes.node.isRequired,

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
		 * Sets the orientation of the picker, whether the buttons are above and below or on the
		 * sides of the value. Must be either `'horizontal'` or `'vertical'`.
		 *
		 * @type {String}
		 * @default 'horizontal'
		 * @public
		 */
		orientation: React.PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * Index of the selected child
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: React.PropTypes.number,

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
	},

	defaultProps: {
		value: 0,
		orientation: 'horizontal'
	},

	computed: {
		max: ({children}) => children.length - 1,
		children: ({children}) => React.Children.map(children, (child) => {
			return <PickerItem>{child}</PickerItem>;
		})
	},

	render: ({children, max, value, ...rest}) => (
		<PickerCore {...rest} min={0} max={max} index={value} step={1} value={value}>
			{children}
		</PickerCore>
	)
});

const Picker = SpottablePicker(PickerBase);

export default Picker;
export {Picker, PickerBase};
