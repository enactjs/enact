/**
 * Exports the {@link moonstone/ExpandablePicker.ExpandablePicker} and
 * {@link moonstone/ExpandablePicker.ExpandablePickerBase} components. The default export is
 * {@link moonstone/ExpandablePicker.ExpandablePicker}.
 *
 * @module moonstone/ExpandablePicker
 */

import Changeable from '@enact/ui/Changeable';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';
import {Subscription} from '@enact/core/internal/PubSub';

import {Expandable, ExpandableItemBase} from '../ExpandableItem';
import IconButton from '../IconButton';
import Picker from '../Picker';

import ExpandablePickerDecorator from './ExpandablePickerDecorator';

import css from './ExpandablePicker.less';

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
		 * @required
		 * @public
		 */
		children: PropTypes.node.isRequired,

		/**
		 * The `data-webos-voice-group-label` for ExpandableItem and Picker.
		 *
		 * @type {String}
		 * @memberof moonstone/ExpandablePicker.ExpandablePickerBase.prototype
		 * @public
		 */
		'data-webos-voice-group-label': PropTypes.string,

		/**
		 * The "aria-label" for the the check button.
		 *
		 * @type {String}
		 * @public
		 */
		checkButtonAriaLabel: PropTypes.string,

		/**
		 * The "aria-label" for the decrement button.
		 *
		 * @type {String}
		 * @default 'previous item'
		 * @public
		 */
		decrementAriaLabel: PropTypes.string,

		/**
		 * A custom icon for the decrementer. All strings supported by [Icon]{Icon} are
		 * supported. Without a custom icon, the default is used, and is automatically changed when
		 * the [orientation]{Icon#orientation} is changed.
		 *
		 * @type {string}
		 * @public
		 */
		decrementIcon: PropTypes.string,

		/**
		 * When `true`, applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The "aria-label" for the increment button.
		 *
		 * @type {String}
		 * @default 'next item'
		 * @public
		 */
		incrementAriaLabel: PropTypes.string,

		/**
		 * A custom icon for the incrementer. All strings supported by [Icon]{Icon} are
		 * supported. Without a custom icon, the default is used, and is automatically changed when
		 * the [orientation]{Icon#orientation} is changed.
		 *
		 * @type {String}
		 * @public
		 */
		incrementIcon: PropTypes.string,

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
		 * Callback to be called when the control should increment or decrement.
		 *
		 * @type {Function}
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * Callback to be called when a condition occurs which should cause the expandable to close
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * Callback to be called when an item is picked.
		 *
		 * @type {Function}
		 * @public
		 */
		onPick: PropTypes.func,

		/**
		 * The handler to run when the component is removed while retaining focus.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightDisappear: PropTypes.func,

		/**
		 * The handler to run prior to focus leaving the expandable when the 5-way down key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightDown: PropTypes.func,

		/**
		 * The handler to run prior to focus leaving the expandable when the 5-way left key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightLeft: PropTypes.func,

		/**
		 * The handler to run prior to focus leaving the expandable when the 5-way right key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightRight: PropTypes.func,

		/**
		 * When `true`, the control is rendered in the expanded state, with the contents visible
		 *
		 * @type {Boolean}
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * The orientation of the picker, i.e. whether the buttons are above and below or on the
		 * sides of the value. Must be either `'horizontal'` or `'vertical'`.
		 *
		 * @type {String}
		 * @default 'horizontal'
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * The "aria-label" for the picker.
		 *
		 * @type {String}
		 * @public
		 */
		pickerAriaLabel: PropTypes.string,

		/**
		 * When `true`, current locale is RTL
		 *
		 * @type {Boolean}
		 * @private
		 */
		rtl: PropTypes.bool,

		/**
		 * When `true`, the component cannot be navigated using spotlight.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		spotlightDisabled: PropTypes.bool,

		/**
		 * Index of the selected child
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: PropTypes.number,

		/*
		 * The size of the picker: `'small'`, `'medium'`, `'large'`, or set to `null` to
		 * assume auto-sizing. `'small'` is good for numeric pickers, `'medium'` for single or short
		 * word pickers, `'large'` for maximum-sized pickers.
		 *
		 * @type {String}
		 * @public
		 */
		width: PropTypes.oneOf([null, 'small', 'medium', 'large']),

		/*
		 * Whether the picker stops incrementing when it reaches the last element. Set `wrap`
		 * to `true` to allow the picker to continue from the opposite end of the list of options.
		 *
		 * @type {Boolean}
		 * @public
		 */
		wrap: PropTypes.bool
	},

	defaultProps: {
		spotlightDisabled: false,
		value: 0
	},

	styles: {
		css,
		className: 'expandablePicker'
	},

	handlers: {
		onChange: (ev, {onChange, onClose, value}) => {
			if (onClose) {
				onClose();
			}

			if (onChange) {
				onChange({value});
			}
		}
	},

	computed: {
		label: ({children, value}) => React.Children.toArray(children)[value]
	},

	render: (props) => {
		const {
			'data-webos-voice-group-label': voiceGroupLabel,
			checkButtonAriaLabel,
			children,
			decrementAriaLabel,
			decrementIcon,
			disabled,
			incrementAriaLabel,
			incrementIcon,
			joined,
			noAnimation,
			onChange,
			onPick,
			onSpotlightDisappear,
			onSpotlightDown,
			onSpotlightLeft,
			onSpotlightRight,
			open,
			orientation,
			pickerAriaLabel,
			rtl,
			spotlightDisabled,
			value,
			width,
			wrap,
			...rest
		} = props;

		return (
			<ExpandableItemBase
				{...rest}
				data-webos-voice-group-label={voiceGroupLabel}
				disabled={disabled}
				onSpotlightDisappear={onSpotlightDisappear}
				onSpotlightDown={!open ? onSpotlightDown : null}
				onSpotlightLeft={onSpotlightLeft}
				onSpotlightRight={onSpotlightRight}
				open={open}
				spotlightDisabled={spotlightDisabled}
			>
				<Picker
					aria-label={pickerAriaLabel}
					className={css.picker}
					data-webos-voice-group-label={voiceGroupLabel}
					decrementAriaLabel={decrementAriaLabel}
					decrementIcon={decrementIcon}
					disabled={disabled}
					incrementAriaLabel={incrementAriaLabel}
					incrementIcon={incrementIcon}
					joined={joined}
					noAnimation={noAnimation}
					onChange={onPick}
					onSpotlightDisappear={onSpotlightDisappear}
					onSpotlightDown={onSpotlightDown}
					onSpotlightLeft={!rtl ? onSpotlightLeft : null}
					onSpotlightRight={rtl ? onSpotlightRight : null}
					orientation={orientation}
					spotlightDisabled={spotlightDisabled}
					value={value}
					width={width}
					wrap={wrap}
				>
					{children}
				</Picker>
				<IconButton
					aria-label={checkButtonAriaLabel}
					className={css.button}
					onSpotlightDisappear={onSpotlightDisappear}
					onSpotlightDown={onSpotlightDown}
					onSpotlightLeft={rtl ? onSpotlightLeft : null}
					onSpotlightRight={!rtl ? onSpotlightRight : null}
					onTap={onChange}
					small
					spotlightDisabled={spotlightDisabled}
				>check</IconButton>
			</ExpandableItemBase>
		);
	}
});

/**
 * {@link moonstone/ExpandablePicker.ExpandablePicker} is a stateful component that
 * renders a list of items into a picker that allows the user to select only a single item at
 * a time. It supports increment/decrement buttons for selection.
 *
 * By default, `ExpandablePicker` maintains the state of its `value` property. Supply the
 * `defaultValue` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `value` at creation time and update it in response to
 * `onPick` events.
 *
 * `ExpandablePicker` maintains its open/closed state by default. The initial state can be supplied
 * using `defaultOpen`. In order to directly control the open/closed state, supply a value for
 * `open` at creation time and update its value in response to `onClose`/`onOpen` events.
 *
 * @class ExpandablePicker
 * @memberof moonstone/ExpandablePicker
 * @ui
 * @mixes moonstone/ExpandableItem.Expandable
 * @mixes ui/Changeable.Changeable
 * @public
 */
const ExpandablePicker = Pure(
	Subscription(
		{channels: ['i18n'], mapMessageToProps: (channel, {rtl}) => ({rtl})},
		Expandable(
			Changeable(
				ExpandablePickerDecorator(
					ExpandablePickerBase
				)
			)
		)
	)
);

export default ExpandablePicker;
export {ExpandablePicker, ExpandablePickerBase};
