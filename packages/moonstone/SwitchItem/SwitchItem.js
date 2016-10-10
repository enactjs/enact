import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import {ToggleItemBase} from '../ToggleItem';
import Switch from '../Switch';

import css from './SwitchItem.less';

const SwitchItemBase = kind({
	name: 'SwitchItem',

	propTypes: {
		/**
		 * The string to be displayed as the main content of the switch item.
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string.isRequired,

		/**
		 * When `true`, a "checked" visual state is applied to the switch item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		checked: PropTypes.bool,

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
		 * @param {String} event.checked - Checked value of item.
		 * @param {*} event.value - Value passed from `value` prop.
		 * @public
		 */
		onToggle: PropTypes.func,

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
		checked: false,
		disabled: false
	},

	styles: {
		css,
		className: 'switchItem'
	},

	computed: {
		iconElem: ({checked, disabled}) => (
			<Switch checked={checked} disabled={disabled} className={css.switch} />
		)
	},

	render: ({iconElem, ...rest}) => (
		<ToggleItemBase {...rest} icon={iconElem} />
	)
});

export default SwitchItemBase;
export {SwitchItemBase as SwitchItem, SwitchItemBase};
