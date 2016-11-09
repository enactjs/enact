/**
 * Exports the {@link moonstone/ToggleItem.ToggleItem} component.
 *
 * @module moonstone/ToggleItem
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import Icon from '../Icon';
import Item from '../Item';
import {MarqueeDecorator} from '../Marquee';

import css from './ToggleItem.less';

/**
 * {@link moonstone/ToggleItem.ToggleItem} is a component to make a Toggleable Item
 * (e.g Checkbox, RadioItem). It has a customizable prop for icon, so any Moonstone Icon can be used
 * to represent the checked state.
 *
 * @class ToggleItem
 * @memberof moonstone/ToggleItem
 * @ui
 * @public
 */
const ToggleItemBase = kind({
	name: 'ToggleItem',

	propTypes: /** @lends moonstone/ToggleItem.ToggleItem.prototype */ {
		/**
		 * The string to be displayed as the main content of the toggle item.
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.node.isRequired,

		/**
		 * Applies a "checked" visual state to the toggle item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		checked: PropTypes.bool,

		/**
		 * Applies a disabled visual state to the toggle item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Icon property accepts a string or an Icon Element. This is the icon that
		 * will display when checked.
		 *
		 * @type {String}
		 * @default ''
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
		 * @param {String} event.checked - Checked value of item.
		 * @param {*} event.value - Value passed from `value` prop.
		 * @public
		 */
		onToggle: PropTypes.func,

		/**
		 * The value that will be sent to the `onToggle` handler.
		 * @type {*}
		 * @default ''
		 * @public
		 */
		value: PropTypes.any
	},

	defaultProps: {
		checked: false,
		disabled: false,
		icon: '',
		iconClasses: '',
		inline: false,
		value: ''
	},

	styles: {
		css,
		className: 'toggleItem'
	},

	computed: {
		className: ({inline, styler}) => styler.append({inline}),
		icon: ({checked, icon, iconClasses, styler}) => {
			if (React.isValidElement(icon)) {
				return icon;
			}

			return <Icon className={styler.join(css.icon, iconClasses, {checked})}>{icon}</Icon>;
		},
		onToggle: ({onToggle, onClick, checked, disabled, value}) => {
			if (!disabled && (onToggle || onClick)) {
				return (ev) => {
					if (onToggle) onToggle({checked: !checked, value});
					if (onClick) onClick(ev);
				};
			}
		}
	},

	render: ({children, icon, onToggle, ...rest}) => {
		delete rest.iconClasses;
		delete rest.inline;

		return (
			<Item {...rest} component='div' onClick={onToggle}>
				{icon}
				{children}
			</Item>
		);
	}
});

const ToggleItem = MarqueeDecorator(
	{className: css.content},
	ToggleItemBase
);

export default ToggleItem;
export {ToggleItem, ToggleItemBase};
