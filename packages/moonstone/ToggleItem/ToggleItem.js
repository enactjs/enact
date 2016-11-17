/**
 * Exports the {@link moonstone/ToggleItem.ToggleItem} and
 * {@link moonstone/ToggleItem.ToggleItemBase} components.
 *
 * @module moonstone/ToggleItem
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';
import {Toggleable} from '@enact/ui/Toggleable';

import Icon from '../Icon';
import Item from '../Item';

import css from './ToggleItem.less';

const ToggleIcon = kind({
	name: 'ToggleIcon',

	propTypes: /** @lends moonstone/ToggleItem.ToggleItemBase.prototype */ {
		selected: PropTypes.bool
	},

	defaultProps: {
		selected: false
	},

	styles: {
		css,
		className: 'icon'
	},

	computed: {
		className: ({selected, styler}) => styler.append({selected})
	},

	render: ({children, ...rest}) => {
		if (React.isValidElement(children)) {
			return children;
		}
		return <Icon {...rest}>{children}</Icon>;
	}
});

// Only return an icon component if one is necessary
// eslint-disable-next-line enact/prop-types, enact/display-name
const getIcon = (icon) => ({iconClasses, selected, ...rest}) => {
	return (rest[icon]) ? <ToggleIcon className={iconClasses} selected={selected}>{rest[icon]}</ToggleIcon> : null;
};

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
		 * Icon property accepts a string or an Icon Element. This is the icon that
		 * will display at the beginning of the item when selected.
		 *
		 * @type {String|Element}
		 * @default null
		 * @public
		 */
		beginningIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

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
		 * will display at the ending of the item when selected.
		 *
		 * @type {String|Element}
		 * @default null
		 * @public
		 */
		endingIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

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
		 * @default null
		 * @public
		 */
		value: PropTypes.any
	},

	defaultProps: {
		beginningIcon: null,
		disabled: false,
		endingIcon: null,
		iconClasses: '',
		inline: false,
		selected: false,
		value: null
	},

	styles: {
		css,
		className: 'toggleItem'
	},

	computed: {
		beginningIcon: getIcon('beginningIcon'),
		endingIcon: getIcon('endingIcon'),
		onToggle: ({onToggle, onClick, selected, disabled, value}) => {
			if (!disabled && (onToggle || onClick)) {
				return (ev) => {
					if (onToggle) onToggle({selected: !selected, value});
					if (onClick) onClick(ev);
				};
			}
		}
	},

	render: ({beginningIcon, endingIcon, onToggle, ...rest}) => {
		delete rest.iconClasses;
		delete rest.value;

		return (
			<Item {...rest} beginningOverlay={beginningIcon} endingOverlay={endingIcon} onClick={onToggle} />
		);
	}
});

const ToggleItem = Toggleable({prop: 'selected'}, ToggleItemBase);

export default ToggleItem;
export {ToggleItem, ToggleItemBase};
