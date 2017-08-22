/**
 * An Item that is Toggleable.
 *
 * @example
 * <CheckboxItem>Toggle me</CheckboxItem>
 *
 * @module moonstone/CheckboxItem
 * @export CheckboxItem
 * @export CheckboxItemBase
 * @export CheckboxItemBaseFactory
 * @export CheckboxItemFactory
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
 * A Factory wrapper around {@link moonstone/CheckboxItem.CheckboxItem} that allows overriding
 * certain classes of the base `Checkbox` components at design time.
 *
 * @class CheckboxItemBaseFactory
 * @memberof moonstone/CheckboxItem
 * @factory
 * @public
 */
const CheckboxItemBaseFactory = factory({css: {}}, ({css}) => {
	// diffClasses('Moon CheckboxItem', componentCss, css);

	const UiCheckboxItem = UiCheckboxItemFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/CheckboxItem.CheckboxItemBaseFactory.prototype */ {
			// ...componentCss,
			// Include the component class name so it too may be overridden.
			checkboxItem: css.checkboxItem
		}
	});
	const Checkbox = CheckboxFactory({css});

	return kind({
		name: 'CheckboxItem',

		render: (props) => {
			return (
				<UiCheckboxItem {...props} Checkbox={Checkbox} ToggleItem={ToggleItemBase} />
			);
		}
	});
});

/**
 * A stateless version of `CheckboxItem`, with no HOCs applied.
 *
 * @class CheckboxItemBase
 * @memberof moonstone/CheckboxItem
 * @extends ui/CheckboxItem.CheckboxItemBase
 * @ui
 * @public
 */
const CheckboxItemBase = CheckboxItemBaseFactory();

/**
 * A Factory wrapper around {@link moonstone/CheckboxItem.CheckboxItem} that allows overriding
 * certain classes of the base `Checkbox` components at design time. See
 * {@link moonstone/Checkbox.CheckboxBaseFactory}.
 *
 * @class CheckboxItemFactory
 * @memberof moonstone/CheckboxItem
 * @factory
 * @public
 */
const CheckboxItemFactory = (props) => Skinnable(
	CheckboxItemBaseFactory(props)
);

/**
 * An Item that is Toggleable. It has two states: `true` (selected) & `false` (unselected). It uses
 * a check icon to represent its selected state.
 *
 * By default, `CheckboxItem` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onToggle` events.
 *
 * @class CheckboxItem
 * @memberof moonstone/CheckboxItem
 * @extends moonstone/CheckboxItem.CheckboxItemBase
 * @mixes moonstone/Skinnable
 * @ui
 * @public
 */
const CheckboxItem = CheckboxItemFactory();


export default CheckboxItem;
export {
	CheckboxItem,
	CheckboxItemBase,
	CheckboxItemFactory,
	CheckboxItemBaseFactory
};
