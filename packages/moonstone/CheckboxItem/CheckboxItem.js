/**
 * Exports the {@link moonstone/CheckboxItem.CheckboxItem} and
 * {@link moonstone/CheckboxItem.CheckboxItemBase} components.
 * The default export is {@link moonstone/CheckboxItem.CheckboxItemBase}.
 *
 * @module moonstone/CheckboxItem
 */

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import React from 'react';
// import {diffClasses} from '@enact/ui/MigrationAid';
import {CheckboxItemFactory as UiCheckboxItemFactory} from '@enact/ui/CheckboxItem';

import {CheckboxFactory} from '../Checkbox';
import Skinnable from '../Skinnable';
import {ToggleItemBase} from '../ToggleItem';

// import componentCss from './CheckboxItem.less';

/**
 * {@link moonstone/CheckboxItem.CheckboxItemFactory} is Factory wrapper around
 * {@link moonstone/CheckboxItem.CheckboxItem} that allows overriding certain classes of the base
 * `Checkbox` components at design time. See {@link moonstone/Checkbox.CheckboxBaseFactory}.
 *
 * @class CheckboxItemFactory
 * @memberof moonstone/CheckboxItem
 * @factory
 * @public
 */
const CheckboxItemBaseFactory = factory({css: {}}, ({css}) => {
	// diffClasses('Moon CheckboxItem', componentCss, css);

	const UiCheckboxItem = UiCheckboxItemFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/CheckboxItem.CheckboxItemFactory.prototype */ {
			// ...componentCss,
			// Include the component class name so it too may be overridden.
			checkboxItem: css.checkboxItem
		}
	});
	const Checkbox = CheckboxFactory({css});

	/**
	 * {@link moonstone/CheckboxItem.CheckboxItemBase} is a component that is an Item that is
	 * Toggleable. It has two states: `true` (selected) & `false` (unselected). It uses a check icon to
	 * represent its selected state.
	 *
	 * @class CheckboxItemBase
	 * @memberof moonstone/CheckboxItem
	 * @ui
	 * @public
	 */
	return kind({
		name: 'CheckboxItem',

		render: (props) => {
			return (
				<UiCheckboxItem {...props} Checkbox={Checkbox} ToggleItem={ToggleItemBase} />
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
const CheckboxItem = Skinnable(
	CheckboxItemBase
);

const CheckboxItemFactory = (props) => Skinnable(
	CheckboxItemBaseFactory(props)
);


export default CheckboxItem;
export {
	CheckboxItem,
	CheckboxItemBase,
	CheckboxItemFactory,
	CheckboxItemBaseFactory
};
