/**
 * Exports the {@link moonstone/ToggleItem.ToggleItem} and
 * {@link moonstone/ToggleItem.ToggleItemBase} components.
 *
 * @module moonstone/ToggleItem
 */

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import React from 'react';
// import {diffClasses} from '@enact/ui/MigrationAid';
import {ToggleItemFactory as UiToggleItemFactory} from '@enact/ui/ToggleItem';

import {ItemOverlayFactory} from '../Item';

import {ToggleIconFactory} from './ToggleIcon';

import componentCss from './ToggleItem.less';


/**
 * {@link moonstone/ToggleItem.ToggleItemBaseFactory} is Factory wrapper around
 * {@link moonstone/ToggleItem.ToggleItemBase} that allows overriding certain classes at design
 * time. The following are properties of the `css` member of the argument to the factory.
 *
 * @class ToggleItemBaseFactory
 * @memberof moonstone/ToggleItem
 * @factory
 * @ui
 * @public
 */
const ToggleItemBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon ToggleItem', componentCss, css);

	const UiToggleItem = UiToggleItemFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/ToggleItem.ToggleItemFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			toggleItem: css.toggleItem
		}
	});
	const ToggleIcon = ToggleIconFactory({css});
	const ItemOverlay = ItemOverlayFactory({css});

	return kind({
		name: 'MoonstoneToggleItem',

		render: (props) => {
			return (
				<UiToggleItem {...props} ItemOverlay={ItemOverlay} ToggleIcon={ToggleIcon} />
			);
		}
	});
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
const ToggleItemBase = ToggleItemBaseFactory();

export default ToggleItemBase;
export {
	ToggleItemBase as ToggleItem,
	ToggleItemBase,
	ToggleItemBaseFactory as ToggleItemFactory,
	ToggleItemBaseFactory
};
