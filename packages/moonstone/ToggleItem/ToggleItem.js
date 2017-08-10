/**
 * An [Item]{@link moonstone/Item} with a togglable [Icon]{@link moonstone/Icon} which can be customized. This is
 * used as the basis for many other components: {@link moonstone/CheckboxItem}, {@link moonstone/RadioItem}, etc.
 *
 * @module moonstone/ToggleItem
 * @exports ToggleItem
 * @exports ToggleItemBase
 * @exports ToggleItemBaseFactory
 * @exports ToggleItemFactory
 */

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import React from 'react';
// import {diffClasses} from '@enact/ui/MigrationAid';
import {ToggleItemFactory as UiToggleItemFactory} from '@enact/moonstone/ToggleItem';

import {ItemOverlayFactory} from '../Item';

import {ToggleIconFactory} from './ToggleIcon';

import componentCss from './ToggleItem.less';

/**
 * A factory for customizing the visual style of [ToggleItemBase]{@link moonstone/ToggleItem.ToggleItemBase}.
 *
 * @class ToggleItemBaseFactory
 * @memberof moonstone/ToggleItem
 * @factory
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
		name: 'uiToggleItem',

		render: (props) => {
			return (
				<UiToggleItem {...props} ItemOverlay={ItemOverlay} ToggleIcon={ToggleIcon} />
			);
		}
	});
});


/**
 * A stateless [ToggleItem]{@link moonstone/ToggleItem.ToggleItem}, with no HOCs applied.
 *
 * @class ToggleItemBase
 * @extends moonstone/ToggleItem.ToggleItemBase
 * @memberof moonstone/ToggleItem
 * @ui
 * @public
 */
const ToggleItemBase = ToggleItemBaseFactory();

/**
 * A factory for customizing the visual style of [ToggleItem]{@link moonstone/ToggleItem.ToggleItem}.
 * @see {@link moonstone/ToggleItem.ToggleItemBaseFactory}.
 *
 * @class ToggleItemFactory
 * @memberof moonstone/ToggleItem
 * @factory
 * @public
 */

/**
 * A ready-to-use {@link moonstone/ToggleItem}.
 *
 * @class ToggleItem
 * @memberof moonstone/ToggleItem
 * @extends ui/ToggleItem.ToggleItemBase
 * @ui
 * @public
 */

export default ToggleItemBase;
export {
	ToggleItemBase as ToggleItem,
	ToggleItemBase,
	ToggleItemBaseFactory as ToggleItemFactory,
	ToggleItemBaseFactory
};
