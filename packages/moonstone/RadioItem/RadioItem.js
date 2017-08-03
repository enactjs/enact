/**
 * Exports the {@link moonstone/RadioItem.RadioItem} component.
 *
 * @module moonstone/RadioItem
 */

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import React from 'react';
// import {diffClasses} from '@enact/ui/MigrationAid';
import {RadioItemFactory as UiRadioItemFactory} from '@enact/ui/RadioItem';
import Toggleable from '@enact/ui/Toggleable';

import {ToggleItemBaseFactory} from '../ToggleItem';
import Skinnable from '../Skinnable';

import componentCss from './RadioItem.less';

/**
 * {@link moonstone/RadioItem.RadioItem} is a stateless RadioItem with Moonstone styling applied.
 *
 * @class RadioItem
 * @memberof moonstone/RadioItem
 * @ui
 * @public
 */
const RadioItemBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon RadioItem', componentCss, css);

	const UiRadioItem = UiRadioItemFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/RadioItem.RadioItemFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			radioItem: css.radioItem
		}
	});
	const ToggleItemBase = ToggleItemBaseFactory({css});

	return kind({
		name: 'MoonstoneRadioItem',

		render: (props) => {
			return (
				<UiRadioItem {...props} ToggleItem={ToggleItemBase} />
			);
		}
	});
});

const RadioItemBase = RadioItemBaseFactory();

/**
 * {@link moonstone/RadioItem.RadioItem} is a component that combines a
 * {@link ui/Toggleable.Toggleable} radio selector and an Item. It has two selected states `true` &
 * `false`.
 *
 * By default, `RadioItem` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onToggle` events.
 *
 * @class RadioItem
 * @memberof moonstone/RadioItem
 * @mixes moonstone/Skinnable.Skinnable
 * @ui
 * @public
 */
const RadioItem = Skinnable(
	Toggleable(
		{prop: 'selected'},
		RadioItemBase
	)
);

const RadioItemFactory = (props) => Skinnable(
	Toggleable(
		{prop: 'selected'},
		RadioItemBaseFactory(props)
	)
);


export default RadioItem;
export {
	RadioItem,
	RadioItemBase,
	RadioItemFactory,
	RadioItemBaseFactory
};
