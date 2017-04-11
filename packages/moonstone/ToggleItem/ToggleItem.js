/**
 * Exports the {@link moonstone/ToggleItem.ToggleItem} and
 * {@link moonstone/ToggleItem.ToggleItemBase} components.
 *
 * @module moonstone/ToggleItem
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';
import Toggleable from '@enact/ui/Toggleable';

import {ItemOverlay} from '../Item';

import ToggleIcon from './ToggleIcon';

import css from './ToggleItem.less';

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
		 * @type {String|moonstone/Icon.Icon}
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

		/**
		 * Specifies on which side (`before` or `after`) of the text the icon appears.
		 *
		 * @type {String}
		 * @default 'before'
		 * @public
		 */
		iconPosition: PropTypes.oneOf(['before', 'after']),

		/**
		 * Applies inline styling to the toggle item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		inline: PropTypes.bool,

		/**
		 * The handler to run when the toggle item is toggled. Developers should
		 * generally use `onToggle` instead.
		 *
		 * @type {Function}
		 */
		onClick: React.PropTypes.func,

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
		iconPosition: 'before',
		inline: false,
		selected: false,
		value: null
	},

	styles: {
		css,
		className: 'toggleItem'
	},

	handlers: {
		onToggle: (ev, {onToggle, onClick, selected, disabled, value}) => {
			if (!disabled && (onToggle || onClick)) {
				if (onToggle) onToggle({selected: !selected, value});
				if (onClick) onClick(ev);
			}
		}
	},

	computed: {
		iconBefore: ({iconClasses, selected, icon, iconPosition}) => {
			if (iconPosition === 'before') {
				return (
					<ToggleIcon slot="overlayBefore" className={iconClasses} selected={selected}>
						{icon}
					</ToggleIcon>
				);
			}
		},
		iconAfter: ({iconClasses, selected, icon, iconPosition}) => {
			if (iconPosition === 'after') {
				return (
					<ToggleIcon slot="overlayAfter" className={iconClasses} selected={selected}>
						{icon}
					</ToggleIcon>
				);
			}
		}
	},

	render: ({children, iconAfter, iconBefore, onToggle, selected, ...rest}) => {
		delete rest.icon;
		delete rest.iconClasses;
		delete rest.iconPosition;
		delete rest.value;

		return (
			<ItemOverlay
				role="checkbox"
				{...rest}
				aria-checked={selected}
				onClick={onToggle}
			>
				{iconBefore}
				{children}
				{iconAfter}
			</ItemOverlay>
		);
	}
});


/**
 * {@link moonstone/ToggleItem.ToggleItemBase} is a component to make a Toggleable Item
 * (e.g Checkbox, RadioItem). It has a customizable prop for icon, so any Moonstone Icon can be used
 * to represent the selected state.
 *
 * @class ToggleItem
 * @memberof moonstone/ToggleItem
 * @extends moonstone/ToggleItem.ToggleItemBase
 * @mixes ui/Toggleable.Toggleable
 * @ui
 * @public
 */
const ToggleItem = Toggleable(
	{prop: 'selected'},
	ToggleItemBase
);

export default ToggleItem;
export {ToggleItem, ToggleItemBase};
