/**
 * Contains the declaration for the {@link moonstone/SwitchItem.SwitchItem} component.
 *
 * @module moonstone/SwitchItem
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';
import Toggleable from '@enact/ui/Toggleable';

import {ToggleItemBase} from '../ToggleItem';
import Switch from '../Switch';

import css from './SwitchItem.less';

/**
 * {@link moonstone/SwitchItem.SwitchItemBase} represents a Boolean state. It displays a descriptive
 * text and has a switch that represents the on/off state.
 *
 * @class SwitchItemBase
 * @memberof moonstone/SwitchItem
 * @ui
 * @public
 */
const SwitchItemBase = kind({
	name: 'SwitchItem',

	propTypes: /** @lends moonstone/SwitchItem.SwitchItemBase.prototype */ {
		/**
		 * The string to be displayed as the main content of the switch item.
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string.isRequired,

		/**
		 * When `true`, a disabled visual state is applied to the switch item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * When true, inline styling is applied to the switch item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		inline: PropTypes.bool,

		/**
		 * The handler to run when the switch item is toggled.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @param {String} event.selected - Selected value of item.
		 * @param {*} event.value - Value passed from `value` prop.
		 * @public
		 */
		onToggle: PropTypes.func,

		/**
		 * When `true`, the dispalyed "switch" icon is set to the "on" position.
		 *
		 * @type {Boolean}
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * The value that will be sent to the `onToggle` handler.
		 *
		 * @type {String|Number}
		 * @default ''
		 * @public
		 */
		value: PropTypes.any
	},

	defaultProps: {
		disabled: false
	},

	styles: {
		css,
		className: 'switchItem'
	},

	computed: {
		icon: ({selected, disabled}) => (
			<Switch selected={selected} disabled={disabled} className={css.switch} />
		)
	},

	render: (props) => (
		<ToggleItemBase {...props} iconPosition="after" />
	)
});

/**
 * {@link moonstone/SwitchItem.SwitchItem} represents a Boolean state. It displays a descriptive
 * text and has a switch that represents the on/off state.
 *
 * By default, `SwitchItem` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onToggle` events.
 *
 * @class SwitchItem
 * @memberof moonstone/SwitchItem
 * @mixes ui/Toggleable.Toggleable
 * @ui
 * @public
 */
const SwitchItem = Toggleable(
	{prop: 'selected'},
	SwitchItemBase
);

export default SwitchItem;
export {SwitchItem, SwitchItemBase};
