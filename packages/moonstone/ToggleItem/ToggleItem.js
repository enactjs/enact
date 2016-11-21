/**
 * Exports the {@link moonstone/ToggleItem.ToggleItem} and
 * {@link moonstone/ToggleItem.ToggleItemBase} components.
 *
 * @module moonstone/ToggleItem
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import {ItemOverlay} from '../Item';

import css from './ToggleItem.less';
import ToggleIcon from './ToggleIcon';

/**
 * {@link moonstone/ToggleItem.ToggleItemBase} is a component to make a Toggleable Item
 * (e.g Checkbox, RadioItem). It has a customizable prop for icon, so any Moonstone Icon can be used
 * to represent the selected state.
 *
 * @class ToggleItemBase
 * @memberof moonstone/ToggleItem
 * @ui
 * @public
 */
const ToggleItemBase = kind({
	name: 'ToggleItem',

	propTypes: /** @lends moonstone/ToggleItem.ToggleItemBase.prototype */ {
		/**
		 * The string to be displayed as the main content of the toggle item.
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.node.isRequired,

		/**
		 * Applies a disabled visual state to the toggle item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Icon property accepts a string or an Icon Element.
		 *
		 * @type {String|Element}
		 * @default null
		 * @public
		 */
		icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

		/**
		 * CSS classes for Icon
		 *
		 * @type {String}
		 * @default ''
		 * @public
		 */
		iconClasses: PropTypes.string,

		iconPosition: PropTypes.oneOf(['start', 'end']),

		/**
		 * Applies inline styling to the toggle item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		inline: PropTypes.bool,

		/**
		 * The handler to run when the toggle item is toggled.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @param {String} event.selected - Selected value of item.
		 * @param {*} event.value - Value passed from `value` prop.
		 * @public
		 */
		onToggle: PropTypes.func,

		/**
		 * Applies the provided `icon` when the this is `true`.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * The value that will be sent to the `onToggle` handler.
		 * @type {*}
		 * @default null
		 * @public
		 */
		value: PropTypes.any
	},

	defaultProps: {
		disabled: false,
		iconClasses: '',
		iconPosition: 'start',
		inline: false,
		selected: false,
		value: null
	},

	styles: {
		css,
		className: 'toggleItem'
	},

	computed: {
		beginningIcon: ({iconClasses, selected, icon, iconPosition}) => {
			if (iconPosition === 'start') {
				return (
					<ToggleIcon slot="beginningOverlay" className={iconClasses} selected={selected}>
						{icon}
					</ToggleIcon>
				);
			}
		},
		endingIcon: ({iconClasses, selected, icon, iconPosition}) => {
			if (iconPosition === 'end') {
				return (
					<ToggleIcon slot="endingOverlay" className={iconClasses} selected={selected}>
						{icon}
					</ToggleIcon>
				);
			}
		},
		onToggle: ({onToggle, onClick, selected, disabled, value}) => {
			if (!disabled && (onToggle || onClick)) {
				return (ev) => {
					if (onToggle) onToggle({selected: !selected, value});
					if (onClick) onClick(ev);
				};
			}
		}
	},

	render: ({beginningIcon, children, endingIcon, onToggle, ...rest}) => {
		delete rest.icon;
		delete rest.iconClasses;
		delete rest.iconPosition;
		delete rest.selected;
		delete rest.value;

		return (
			<ItemOverlay {...rest} onClick={onToggle} autoHide="no">
				{beginningIcon}
				{children}
				{endingIcon}
			</ItemOverlay>
		);
	}
});

export default ToggleItemBase;
export {ToggleItemBase as ToggleItem, ToggleItemBase};
