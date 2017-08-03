/**
 * Exports the {@link ui/ToggleItem.ToggleItem} and
 * {@link ui/ToggleItem.ToggleItemBase} components.
 *
 * @module ui/ToggleItem
 */

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import Toggleable from '../Toggleable';
import {ItemOverlay as UiItemOverlay} from '../Item';

import UiToggleIcon, {ToggleIconFactory} from './ToggleIcon';

import componentCss from './ToggleItem.less';

/**
 * {@link ui/ToggleItem.ToggleItem} is a stateless ToggleItem with no styling applied.
 *
 * @class ToggleItem
 * @memberof ui/ToggleItem
 * @ui
 * @public
 */
const ToggleItemBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('UI ToggleItem', componentCss, css);

	/**
	 * {@link ui/ToggleItem.ToggleItemBase} is a component to make a Toggleable Item
	 * (e.g Checkbox, RadioItem). It has a customizable prop for icon, so any ui Icon can be used
	 * to represent the selected state.
	 *
	 * @class ToggleItemBase
	 * @memberof ui/ToggleItem
	 * @ui
	 * @public
	 */
	return kind({
		name: 'ToggleItem',

		propTypes: /** @lends ui/ToggleItem.ToggleItemBase.prototype */ {
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
			 * @type {String|ui/Icon.Icon}
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
			 * The ItemOverlay component to use in this ToggleItem for the base layout.
			 *
			 * @type {Component}
			 * @default {@link ui/ItemOverlay}
			 * @public
			 */
			ItemOverlay: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

			/**
			 * The handler to run when the toggle item is toggled. Developers should
			 * generally use `onToggle` instead.
			 *
			 * @type {Function}
			 */
			onClick: PropTypes.func,

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
			 * The ToggleIcon component to use in this ToggleItem for both the before and after icons.
			 *
			 * @type {Component}
			 * @default {@link ui/ToggleIcon}
			 * @public
			 */
			ToggleIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

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
			ItemOverlay: UiItemOverlay,
			selected: false,
			ToggleIcon: UiToggleIcon,
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
			iconBefore: ({iconClasses, selected, icon, iconPosition, ToggleIcon}) => {
				if (iconPosition === 'before') {
					return (
						<ToggleIcon slot="overlayBefore" className={iconClasses} selected={selected}>
							{icon}
						</ToggleIcon>
					);
				}
			},
			iconAfter: ({iconClasses, selected, icon, iconPosition, ToggleIcon}) => {
				if (iconPosition === 'after') {
					return (
						<ToggleIcon slot="overlayAfter" className={iconClasses} selected={selected}>
							{icon}
						</ToggleIcon>
					);
				}
			}
		},

		render: ({children, iconAfter, iconBefore, ItemOverlay, onToggle, selected, ...rest}) => {
			delete rest.icon;
			delete rest.iconClasses;
			delete rest.iconPosition;
			delete rest.ToggleIcon;
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
});

/**
 * {@link ui/ToggleItem.ToggleItemBase} is a component to make a Toggleable Item
 * (e.g Checkbox, RadioItem). It has a customizable prop for icon, so any ui Icon can be used
 * to represent the selected state.
 *
 * @class ToggleItem
 * @memberof ui/ToggleItem
 * @extends ui/ToggleItem.ToggleItemBase
 * @mixes ui/Toggleable.Toggleable
 * @ui
 * @public
 */
const ToggleItemBase = ToggleItemBaseFactory();


/**
 * {@link ui/ToggleItem.ToggleItemFactory} is Factory wrapper around {@link ui/ToggleItem.ToggleItem}
 * that allows overriding certain classes at design time. See {@link ui/ToggleItem.ToggleItemBaseFactory}.
 *
 * @class ToggleItemFactory
 * @memberof ui/ToggleItem
 * @factory
 * @public
 */
const ToggleItemFactory = (props) => Toggleable(
	{prop: 'selected'},
	ToggleItemBaseFactory(props)
);

const ToggleItem = ToggleItemFactory();


export default ToggleItem;
export {
	ToggleItem,
	ToggleItemBase,
	ToggleItemFactory,
	ToggleItemBaseFactory,
	ToggleIconFactory
};
