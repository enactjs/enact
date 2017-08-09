/**
 * Exports the {@link moonstone/CheckboxItem.CheckboxItem} component.
 *
 * @module moonstone/CheckboxItem
 */

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import UiCheckbox from '../Checkbox';
import Toggleable from '../Toggleable';
import {ToggleItemBaseFactory as UiToggleItemFactory} from '../ToggleItem';

/**
 * {@link ui/CheckboxItem.CheckboxItemBaseFactory} is Factory wrapper around
 * {@link ui/CheckboxItem.CheckboxItemBase} that allows overriding certain classes at design time.
 * The following are properties of the `css` member of the argument to the factory.
 *
 * @class CheckboxItemBaseFactory
 * @memberof ui/CheckboxItem
 * @factory
 * @ui
 * @public
 */
const CheckboxItemBaseFactory = factory({css: {}}, ({css}) => {
	const UiToggleItem = UiToggleItemFactory({css});

	/**
	 * {@link moonstone/CheckboxItem.CheckboxItemBase} is a component that
	 * is an Item that is Toggleable. It has two states: `true` (selected) & `false`
	 * (unselected). It uses a check icon to represent its selected state.
	 *
	 * @class CheckboxItemBase
	 * @memberof moonstone/CheckboxItem
	 * @ui
	 * @public
	 */
	return kind({
		name: 'CheckboxItem',

		propTypes: /** @lends moonstone/CheckboxItem.CheckboxItemBase.prototype */ {
			/**
			 * The string to be displayed as the main content of the checkbox item.
			 *
			 * @type {String}
			 * @public
			 */
			children: PropTypes.string.isRequired,

			/**
			 * The Checkbox component to use in this CheckboxItem.
			 *
			 * @type {Component}
			 * @default {@link ui/Checkbox}
			 * @public
			 */
			Checkbox: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

			/**
			 * When `true`, applies a disabled style and the control becomes non-interactive.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: PropTypes.bool,

			/**
			 * Specifies on which side (`before` or `after`) of the text the icon appears.
			 *
			 * @type {String}
			 * @default 'before'
			 * @public
			 */
			iconPosition: PropTypes.oneOf(['before', 'after']),

			/**
			 * When `true`, an inline visual effect is applied to the CheckboxItem.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			inline: PropTypes.bool,

			/**
			 * The handler to run when the checkbox item is toggled.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @param {String} event.selected - Selected value of item.
			 * @param {*} event.value - Value passed from `value` prop.
			 * @public
			 */
			onToggle: PropTypes.func,

			/**
			 * When `true`, a check mark icon is applied to the CheckboxItem.
			 *
			 * @type {Boolean}
			 * @public
			 */
			selected: PropTypes.bool,

			/**
			 * The ToggleItem component to use as the basis for this component.
			 *
			 * @type {Component}
			 * @default {@link ui/ToggleItem}
			 * @public
			 */
			ToggleItem: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

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
			Checkbox: UiCheckbox,
			disabled: false,
			iconPosition: 'before',
			inline: false,
			ToggleItem: UiToggleItem,
			value: ''
		},

		computed: {
			icon: ({Checkbox, selected, disabled}) => (
				<Checkbox selected={selected} disabled={disabled} />
			)
		},

		render: ({ToggleItem, ...rest}) => {
			delete rest.Checkbox;
			return (
				<ToggleItem {...rest} />
			);
		}
	});
});

const CheckboxItemBase = CheckboxItemBaseFactory();

/**
 * {@link moonstone/CheckboxItem.CheckboxItem} is a component that is an Item that is Toggleable. It
 * has two states: `true` (selected) & `false` (unselected). It uses a check icon to represent its
 * selected state.
 *
 * By default, `CheckboxItem` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onToggle` events.
 *
 * @class CheckboxItem
 * @memberof moonstone/CheckboxItem
 * @ui
 * @public
 */
const CheckboxItem = Toggleable(
	{prop: 'selected'},
	CheckboxItemBase
);

/**
 * {@link ui/CheckboxItem.CheckboxItemFactory} is Factory wrapper around
 * {@link ui/CheckboxItem.CheckboxItem} that allows overriding certain classes at design time.
 * See {@link ui/CheckboxItem.CheckboxItemBaseFactory}.
 *
 * @class CheckboxItemFactory
 * @memberof ui/CheckboxItem
 * @factory
 * @public
 */
const CheckboxItemFactory = factory(props => {
	const Base = CheckboxItemBaseFactory(props);
	/**
	 * {@link ui/CheckboxItem.CheckboxItem} is a CheckboxItem with no styling, Toggleable applied.
	 *
	 * @class CheckboxItem
	 * @memberof ui/CheckboxItem
	 * @mixes ui/Toggleable.Toggleable
	 * @ui
	 * @public
	 */
	return Toggleable(
		{prop: 'selected'},
		Base
	);
});

export default CheckboxItem;
export {
	CheckboxItem,
	CheckboxItemBase,
	CheckboxItemFactory,
	CheckboxItemBaseFactory
};
