/**
 * Provides Moonstone styled item components and behaviors. Useful for content in lists.
 *
 * @example
 * <Item>Hello Enact!</Item>
 *
 * @module moonstone/Item
 * @exports Item
 * @exports ItemBase
 * @exports ItemDecorator
 */

import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';
import {ItemBase as UiItemBase, ItemDecorator as UiItemDecorator} from '@enact/ui/Item';
// import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import {MarqueeDecorator} from '../Marquee';
import ReplaceableOnFocus from '../internal/ReplaceableOnFocus';
import Skinnable from '../Skinnable';

import componentCss from './Item.module.less';

/**
 * A Moonstone styled item without any behavior.
 *
 * @class ItemBase
 * @memberof moonstone/Item
 * @extends ui/Item.ItemBase
 * @ui
 * @public
 */
const ItemBase = kind({
	name: 'Item',

	propTypes: /** @lends moonstone/Item.ItemBase.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `item` - The root class name
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object
	},

	styles: {
		css: componentCss,
		publicClassNames: 'item'
	},

	render: ({css, ...rest}) => {
		return UiItemBase.inline({
			'data-webos-voice-intent': 'Select',
			...rest,
			css
		});
	}
});

/**
 * Moonstone specific item behaviors to apply to [Item]{@link moonstone/Item.ItemBase}.
 *
 * @class ItemDecorator
 * @hoc
 * @memberof moonstone/Item
 * @mixes spotlight.Spottable
 * @mixes moonstone/Marquee.MarqueeDecorator
 * @mixes moonstone/Skinnable
 * @ui
 * @public
 */
const ItemDecorator = compose(
	UiItemDecorator,
	Spottable,
	MarqueeDecorator({invalidateProps: ['inline', 'autoHide']}),
	Skinnable
);

const ItemFull = ItemDecorator(ItemBase);
const ItemLightDecorator = compose(
	Spottable,
	Skinnable
);
const ItemLight = ItemLightDecorator(ItemBase);

/**
 * A Moonstone styled item with built-in support for marqueed text, and Spotlight focus.
 *
 * Usage:
 * ```
 * <Item>Item Content</Item>
 * ```
 *
 * @class Item
 * @memberof moonstone/Item
 * @extends moonstone/Item.ItemBase
 * @mixes moonstone/Item.ItemDecorator
 * @ui
 * @public
 */
const Item = (props) => (
	<ReplaceableOnFocus
		{...props}
		initialComponent={ItemLight}
		updatedComponent={ItemFull}
	/>
);

export default Item;
export {
	Item,
	ItemBase,
	ItemDecorator
};
