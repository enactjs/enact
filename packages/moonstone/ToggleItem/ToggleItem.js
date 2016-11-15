/**
 * Exports the {@link moonstone/ToggleItem.ToggleItem} and
 * {@link moonstone/ToggleItem.ToggleItemBase} components.
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
 * {@link moonstone/ToggleItem.ToggleItemBase} is a component to make a Toggleable Item
 * (e.g Checkbox, RadioItem). It has a customizable prop for icon, so any Moonstone Icon can be used
 * to represent the selected state. Most developers will want to use
 * the marqueeable version: {@link moonstone/ToggleItem.ToggleItem}
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
		 * Icon property accepts a string or an Icon Element. This is the icon that
		 * will display when selected.
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
		 * @default ''
		 * @public
		 */
		value: PropTypes.any
	},

	defaultProps: {
		disabled: false,
		icon: '',
		iconClasses: '',
		inline: false,
		selected: false,
		value: ''
	},

	styles: {
		css,
		className: 'toggleItem'
	},

	computed: {
		className: ({inline, styler}) => styler.append({inline}),
		icon: ({selected, icon, iconClasses, styler}) => {
			if (React.isValidElement(icon)) {
				return icon;
			}

			return <Icon className={styler.join(css.icon, iconClasses, {selected})}>{icon}</Icon>;
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

/**
 * {@link moonstone/ToggleItem.ToggleItem} is a component to make a Toggleable Item
 * (e.g Checkbox, RadioItem). It has a customizable prop for icon, so any Moonstone Icon can be used
 * to represent the selected state.
 *
 * @class ToggleItem
 * @memberof moonstone/ToggleItem
 * @ui
 * @mixes moonstone/marquee.MarqueeDecorator
 * @public
 */
const ToggleItem = MarqueeDecorator(
	{className: css.content},
	ToggleItemBase
);

export default ToggleItem;
export {ToggleItem, ToggleItemBase};
