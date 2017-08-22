/**
 * This [Item]{@link moonstone/Item} derives from {@link moonstone/ToggleItem} but with the visual
 * styling of a standard radio-style item. This will typically be used inside of a
 * [Group]{@link ui/Group} component to facilitate the only-one-at-a-time nature of radio buttons.
 *
 * By default, `RadioItem` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onToggle` events.
 *
 * @module moonstone/RadioItem
 * @exports RadioItem
 * @exports RadioItemBase
 * @exports RadioItemBaseFactory
 * @exports RadioItemFactory
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
 * A factory for customizing the visual style of [RadioItemBase]{@link moonstone/RadioItem.RadioItemBase}.
 *
 * @class RadioItemBaseFactory
 * @memberof moonstone/RadioItem
 * @factory
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

/**
 * A stateless [RadioItem]{@link moonstone/RadioItem.RadioItem}, with no HOCs applied.
 *
 * @class RadioItemBase
 * @extends ui/RadioItem.RadioItemBase
 * @memberof moonstone/RadioItem
 * @ui
 * @public
 */
const RadioItemBase = RadioItemBaseFactory();

/**
 * A factory for customizing the visual style of [RadioItem]{@link moonstone/RadioItem.RadioItem}.
 * @see {@link moonstone/RadioItem.RadioItemBaseFactory}.
 *
 * @class RadioItemFactory
 * @memberof moonstone/RadioItem
 * @factory
 * @public
 */
const RadioItemFactory = (props) => Skinnable(
	Toggleable(
		{prop: 'selected'},
		RadioItemBaseFactory(props)
	)
);

/**
 * A ready-to-use {@link ui/RadioItem}, with HOCs applied.
 *
 *
 * @class RadioItem
 * @memberof moonstone/RadioItem
 * @extends moonstone/RadioItem.RadioItemBase
 * @mixes moonstone/Skinnable.Skinnable
 * @mixes ui/Toggleable.Toggleable
 * @ui
 * @public
 */
const RadioItem = RadioItemFactory();

export default RadioItem;
export {
	RadioItem,
	RadioItemBase,
	RadioItemFactory,
	RadioItemBaseFactory
};
