/**
 * Exports the {@link moonstone/ExpandablePicker.ExpandablePicker} and
 * {@link moonstone/ExpandablePicker.ExpandablePickerBase} components. The default export is
 * {@link moonstone/ExpandablePicker.ExpandablePicker}.
 *
 * @module moonstone/ExpandablePicker
 */

import kind from '@enact/core/kind';
import Changeable from '@enact/ui/Changeable';
import React from 'react';
import pure from 'recompose/pure';

import {Expandable, ExpandableItemBase} from '../ExpandableItem';
import IconButton from '../IconButton';
import Picker from '../Picker';

/**
 * {@link moonstone/ExpandablePicker.ExpandablePickerBase} is a stateless component that
 * renders a list of items into a picker that allows the user to select only a single item at
 * a time. It supports increment/decrement buttons for selection.
 *
 * @class ExpandablePickerBase
 * @memberof moonstone/ExpandablePicker
 * @ui
 * @public
 */
const ExpandablePickerBase = kind({
	name: 'ExpandablePicker',

	propTypes: /** @lends moonstone/ExpandablePicker.ExpandablePickerBase.prototype */ {
		/**
		 * Children from which to pick
		 *
		 * @type {Node}
		 * @public
		 */
		children: React.PropTypes.node.isRequired,

		/**
		 * A custom icon for the decrementer. All strings supported by [Icon]{Icon} are
		 * supported. Without a custom icon, the default is used, and is automatically changed when
		 * the [orientation]{Icon#orientation} is changed.
		 *
		 * @type {string}
		 * @public
		 */
		decrementIcon: React.PropTypes.string,

		/**
		 * When `true`, applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: React.PropTypes.bool,

		/**
		 * A custom icon for the incrementer. All strings supported by [Icon]{Icon} are
		 * supported. Without a custom icon, the default is used, and is automatically changed when
		 * the [orientation]{Icon#orientation} is changed.
		 *
		 * @type {string}
		 * @public
		 */
		incrementIcon: React.PropTypes.string,

		/**
		 * The user interaction of the control. A joined picker allows the user to use
		 * the arrow keys to adjust the picker's value. The user may no longer use those arrow keys
		 * to navigate while this control is focused. A non-joined control allows full navigation,
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
		 * Callback to be called when the control should increment or decrement.
		 *
		 * @type {Function}
		 * @public
		 */
		onChange: React.PropTypes.func,

		/**
		 * Callback to be called when an item is picked.
		 *
		 * @type {Function}
		 * @public
		 */
		onPick: React.PropTypes.func,

		/**
		 * The orientation of the picker, i.e. whether the buttons are above and below or on the
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
		 * The size of the picker: `'small'`, `'medium'`, `'large'`, or set to `null` to
		 * assume auto-sizing. `'small'` is good for numeric pickers, `'medium'` for single or short
		 * word pickers, `'large'` for maximum-sized pickers.
		 *
		 * @type {String}
		 * @public
		 */
		width: React.PropTypes.oneOf([null, 'small', 'medium', 'large']),

		/*
		 * Whether the picker stops incrementing when it reaches the last element. Set `wrap`
		 * to `true` to allow the picker to continue from the opposite end of the list of options.
		 *
		 * @type {Boolean}
		 * @public
		 */
		wrap: React.PropTypes.bool
	},

	computed: {
		label: ({children, value}) => React.Children.toArray(children)[value],
		onChange: ({onChange, onClose, value}) => {
			return () => {
				if (onClose) {
					onClose();
				}

				if (onChange) {
					onChange({value});
				}
			};
		}
	},

	render: (props) => {
		const {
			children,
			decrementIcon,
			disabled,
			incrementIcon,
			joined,
			noAnimation,
			onChange,
			onPick,
			orientation,
			value,
			width,
			wrap,
			...rest
		} = props;

		return (
			<ExpandableItemBase {...rest} disabled={disabled}>
				<Picker
					disabled={disabled}
					onChange={onPick}
					value={value}
					decrementIcon={decrementIcon}
					incrementIcon={incrementIcon}
					joined={joined}
					noAnimation={noAnimation}
					orientation={orientation}
					width={width}
					wrap={wrap}
				>
					{children}
				</Picker>
				<IconButton onClick={onChange}>check</IconButton>
			</ExpandableItemBase>
		);
	}
});

/**
 * {@link moonstone/ExpandablePicker.ExpandablePickerBase} is a stateful component that
 * renders a list of items into a picker that allows the user to select only a single item at
 * a time. It supports increment/decrement buttons for selection.
 *
 * @class ExpandablePicker
 * @memberof moonstone/ExpandablePicker
 * @ui
 * @mixes recompose/pure
 * @mixes moonstone/ExpandableItem.Expandable
 * @mixes ui/Changeable.Changeable
 * @public
 */
const ExpandablePicker = pure(
	Expandable(
		Changeable(
			// override `change` so we can separate handling onChange for the Picker and onChange for the
			// ExpandablePicker
			{mutable: true, change: 'onPick'},
			ExpandablePickerBase
		)
	)
);

export default ExpandablePicker;
export {ExpandablePicker, ExpandablePickerBase};
