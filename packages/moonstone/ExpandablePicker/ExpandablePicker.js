/**
 * Moonstone styled expandable picker.
 *
 * @example
 * <ExpandablePicker
 *   joined
 *   title="Choose an option"
 *   width="medium"
 * >
 *   {['Option 1', 'Option 2', 'Option 3']}
 * </ExpandablePicker>
 *
 * @module moonstone/ExpandablePicker
 * @exports ExpandablePicker
 * @exports ExpandablePickerBase
 */

import Changeable from '@enact/ui/Changeable';
import kind from '@enact/core/kind';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import React from 'react';

import {Expandable, ExpandableItemBase} from '../ExpandableItem';
import IconButton from '../IconButton';
import Picker from '../Picker';
import {extractVoiceProps} from '../internal/util';

import ExpandablePickerDecorator from './ExpandablePickerDecorator';

import css from './ExpandablePicker.module.less';

/**
 * A stateless component that renders a list of items into a picker that allows the user to select
 * only a single item at a time. It supports increment/decrement buttons for selection.
 *
 * @class ExpandablePickerBase
 * @memberof moonstone/ExpandablePicker
 * @extends moonstone/ExpandableItem.ExpandableItemBase
 * @ui
 * @public
 */
const ExpandablePickerBase = kind({
	name: 'ExpandablePicker',

	propTypes: /** @lends moonstone/ExpandablePicker.ExpandablePickerBase.prototype */ {
		/**
		 * Picker value list.
		 *
		 * @type {Node}
		 * @required
		 * @public
		 */
		children: PropTypes.node.isRequired,

		/**
		 * The "aria-label" for the the check button.
		 *
		 * @type {String}
		 * @public
		 */
		checkButtonAriaLabel: PropTypes.string,

		/**
		 * Disables voice control.
		 *
		 * @type {Boolean}
		 * @memberof moonstone/ExpandablePicker.ExpandablePickerBase.prototype
		 * @public
		 */
		'data-webos-voice-disabled': PropTypes.bool,

		/**
		 * The `data-webos-voice-group-label` for ExpandableItem and Picker.
		 *
		 * @type {String}
		 * @memberof moonstone/ExpandablePicker.ExpandablePickerBase.prototype
		 * @public
		 */
		'data-webos-voice-group-label': PropTypes.string,

		/**
		 * The "aria-label" for the decrement button.
		 *
		 * @type {String}
		 * @default 'previous item'
		 * @public
		 */
		decrementAriaLabel: PropTypes.string,

		/**
		 * A custom icon for the decrementer.
		 *
		 * All strings supported by [Icon]{@link moonstone/Icon.Icon} are supported. Without a
		 * custom icon, the default is used, and is automatically changed when the
		 * [orientation]{@link moonstone/Picker.Picker#orientation} is changed.
		 *
		 * @type {string}
		 * @public
		 */
		decrementIcon: PropTypes.string,

		/**
		 * Disables ExpandablePicker and the control becomes non-interactive.
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
		 * A custom icon for the incrementer.
		 *
		 * All strings supported by [Icon]{@link moonstone/Icon.Icon} are supported. Without a
		 * custom icon, the default is used, and is automatically changed when the
		 * [orientation]{@link moonstone/Picker.Picker#orientation} is changed.
		 *
		 * @type {String}
		 * @public
		 */
		incrementIcon: PropTypes.string,

		/**
		 * Allows the user to use the arrow keys to adjust the picker's value.
		 *
		 * Key presses are captured in the directions of the increment and decrement buttons but
		 * others are unaffected. A non-joined Picker allows navigation in any direction, but
		 * requires individual ENTER presses on the incrementer and decrementer buttons. Pointer
		 * interaction is the same for both formats.
		 *
		 * @type {Boolean}
		 * @public
		 */
		joined: PropTypes.bool,

		/**
		 * Prevents any transition animation for the component.
		 *
		 * @type {Boolean}
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * Called when the control should increment or decrement.
		 *
		 * @type {Function}
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * Called when a condition occurs which should cause the expandable to close.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * Called when an item is picked.
		 *
		 * @type {Function}
		 * @public
		 */
		onPick: PropTypes.func,

		/**
		 * Called when the component is removed while retaining focus.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightDisappear: PropTypes.func,

		/**
		 * Called prior to focus leaving the expandable when the 5-way down key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightDown: PropTypes.func,

		/**
		 * Called prior to focus leaving the expandable when the 5-way left key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightLeft: PropTypes.func,

		/**
		 * Called prior to focus leaving the expandable when the 5-way right key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightRight: PropTypes.func,

		/**
		 * Opens ExpandablePicker with the contents visible.
		 *
		 * @type {Boolean}
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * Orientation of the picker.
		 *
		 * Controls whether the buttons are arranged horizontally or vertically around the value.
		 *
		 * * Values: `'horizontal'`, `'vertical'`
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
		 * Sets current locale to RTL.
		 *
		 * @type {Boolean}
		 * @private
		 */
		rtl: PropTypes.bool,

		/**
		 * Disables spotlight navigation into the component.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		spotlightDisabled: PropTypes.bool,

		/**
		 * Index of the selected child.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: PropTypes.number,

		/*
		 * The width of the picker.
		 *
		 * A number can be used to set the minimum number of characters to be shown. Setting a
		 * number to less than the number of characters in the longest value will cause the width to
		 * grow for the longer values.
		 *
		 * A string can be used to select from pre-defined widths:
		 * * `'small'` - numeric values
		 * * `'medium'` - single or short words
		 * * `'large'` - maximum-sized pickers taking full width of its parent
		 *
		 * By default, the picker will size according to the longest valid value.
		 *
		 * @type {String}
		 * @public
		 */
		width: PropTypes.oneOf([null, 'small', 'medium', 'large']),

		/*
		 * Allows picker to continue from the start of the list after it reaches the end and
		 * vice-versa.
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

		const voiceProps = extractVoiceProps(rest);
		const isVoiceDisabled = voiceProps['data-webos-voice-disabled'];

		return (
			<ExpandableItemBase
				{...voiceProps}
				{...rest}
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
					data-webos-voice-disabled={isVoiceDisabled}
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
					data-webos-voice-disabled={isVoiceDisabled}
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
 * A stateful component that renders a list of items into a picker that allows the user to select
 * only a single item at a time. It supports increment/decrement buttons for selection.
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
 * @extends moonstone/ExpandablePicker.ExpandablePickerBase
 * @ui
 * @mixes moonstone/ExpandableItem.Expandable
 * @mixes ui/Changeable.Changeable
 * @public
 */
const ExpandablePicker = Pure(
	I18nContextDecorator(
		{rtlProp: 'rtl'},
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
