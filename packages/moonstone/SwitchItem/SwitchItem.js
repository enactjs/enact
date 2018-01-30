/**
 * Provides Moonstone-themed item component and interactive togglable switch.
 *
 * @module moonstone/SwitchItem
 * @exports SwitchItem
 * @exports SwitchItemBase
 * @exports SwitchItemDecorator
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import Pure from '@enact/ui/internal/Pure';
import Toggleable from '@enact/ui/Toggleable';

import {ToggleItemBase} from '../ToggleItem';
import Switch from '../Switch';

import css from './SwitchItem.less';

/**
 * Renders an item with a switch component. Useful to show an on/off state.
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
		// eslint-disable-next-line enact/display-name
		toggleIcon: ({selected, disabled}) => () => (
			<Switch selected={selected} disabled={disabled} className={css.switch} />
		)
	},

	render: (props) => (
		<ToggleItemBase {...props} iconPosition="after" />
	)
});

/**
 * Represents a Boolean state of an item with a switch
 *
 * @class SwitchItem
 * @memberof ui/SwitchItem
 * @mixes ui/Toggleable.Toggleable
 * @ui
 * @public
 */
const SwitchItem = compose(
	Pure,
	Toggleable({prop: 'selected'})
)(SwitchItemBase);

export default SwitchItem;
export {SwitchItem, SwitchItemBase};
