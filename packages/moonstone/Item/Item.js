/**
 * Provides Moonstone-themed item components and behaviors. Useful for content in lists.
 *
 * @example
 * <Item>Hello Enact!</Item>
 *
 * @module moonstone/Item
 * @exports Item
 * @exports ItemBase
 * @exports ItemDecorator
 */
import UiItem from '@enact/ui/Item';
import kind from '@enact/core/kind';
import compose from 'ramda/src/compose';
import React from 'react';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';
import Spottable from '@enact/spotlight/Spottable';

import {MarqueeDecorator} from '../Marquee';
import Skinnable from '../Skinnable';

import componentCss from './Item.less';

/**
 * A moonstone-styled item without any behavior.
 *
 * @class ItemBase
 * @memberof moonstone/Item
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
		className: 'item',
		publicClassNames: 'item'
	},

	render: ({css, ...rest}) => {
		return (
			<UiItem
				{...rest}
				css={css}
			/>
		);
	}
});

/**
 * Moonstone-specific item behaviors to apply to [Item]{@link moonstone/Item.ItemBase}.
 *
 * @class ItemDecorator
 * @memberof moonstone/Item
 * @mixes spotlight.Spottable
 * @mixes moonstone/Marquee.MarqueeDecorator
 * @mixes moonstone/Skinnable
 * @ui
 * @public
 */
const ItemDecorator = compose(
	Pure,
	Spottable,
	MarqueeDecorator({className: componentCss.content, invalidateProps: ['inline', 'autoHide', 'remeasure']}),
	Skinnable
);

/**
 * A Moonstone-styled item with built-in support for marqueed text, and Spotlight focus.
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
const Item = ItemDecorator(ItemBase);

export default Item;
export {
	Item,
	ItemBase,
	ItemDecorator
};
