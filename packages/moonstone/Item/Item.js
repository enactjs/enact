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
import {ItemBase as UIItemBase} from '@enact/ui/Item';
import {childrenEquals} from '@enact/core/util';
import {forProp, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import compose from 'ramda/src/compose';
import React from 'react';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';
import Slottable from '@enact/ui/Slottable';
import {RemeasurableDecorator} from '@enact/ui/Remeasurable';
import Toggleable from '@enact/ui/Toggleable';
import Spottable from '@enact/spotlight/Spottable';
import {MarqueeDecorator} from '../Marquee';
import Skinnable from '../Skinnable';
import {ItemOverlayBase} from './ItemOverlay';

import componentCss from './Item.less';

/**
 * A moonstone-styled item without any behavior.
 *
 * @class itemBase
 * @memberof moonstone/item
 * @ui
 * @public
 */
const ItemBase = kind({
	name: 'Item',

	propTypes: /** @lends moonstone/Item.ItemBase.prototype */ {
		/**
		 * The node to be displayed as the main content of the item.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node.isRequired,

		/**
		 * Controls the visibility state of the overlays. One, both, or neither overlay can be
		 * shown when the item is focused. Choosing `'after'` will leave `overlayBefore` visible
		 * at all times; only `overlayAfter` will have its visibility toggled on focus.  Valid
		 * values are `'before'`, `'after'` and `'both'`. Omitting the property will result in
		 * no-auto-hiding for either overlay. They will both be present regardless of focus.
		 *
		 * @type {Boolean}
		 * @public
		 */
		autoHide: PropTypes.node,


		/**
		 * The type of component to use to render the item. May be a DOM node name (e.g 'div',
		 * 'span', etc.) or a custom component.
		 *
		 * @type {String|Node}
		 * @default 'div'
		 * @public
		 */
		component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `item` - The root class name
		 * * `disabled` - Applied to a `disabled` item
		 * * `inline` - Applied to a `inline` item
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Applies a disabled visual state to the item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Applies inline styling to the item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		inline: PropTypes.bool
	},

	defaultProps: {
		component: 'div',
		disabled: false,
		inline: false
	},

	styles: {
		css: componentCss,
		className:'item',
		publicClassNames: ['item']
	},

	computed: {
		className: ({inline, styler}) => styler.append({inline})
	},

	handlers: {
		onClick: handle(
			forProp('disabled', false),
			forward('onClick')
		)
	},

	render: ({component: Component, css, disabled, ...rest}) => {
		return (
			<UIItemBase
				css={css}
				component={Component}
				aria-disabled={disabled}
				disabled={disabled}
				{...rest}
			/>
		);
	}
});

// cache the MarqueeDecorator so it can be used for Item and ItemOverlay
const ItemMarqueeDecorator = MarqueeDecorator({className: componentCss.content, invalidateProps: ['inline', 'autoHide', 'remeasure']});

/**
 * Moonstone-specific item behaviors to apply to [Item]{@link moonstone/Item.ItemBase}.
 *
 * @class Item
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
	ItemMarqueeDecorator,
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
 * @mixes moonstone/Item.ItemDecorator
 * @ui
 * @public
 */
const Item = ItemDecorator(ItemBase);



/**
 * Moonstone-specific item with overlay behaviors to apply to [Item]{@link moonstone/ItemOverlay.ItemOverlayBase}.
 *
 *
 * @class ItemOverlay
 * @memberof moonstone/Item
 * @mixes spotlight.Spottable
 * @mixes moonstone/Marquee.MarqueeDecorator
 * @mixes moonstone/Skinnable
 * @mixes ui/Toggleable
 * @ui
 * @public
 */

const ItemOverlayDecorator = compose(
	Slottable({slots: ['overlayAfter', 'overlayBefore']}),
	Pure(
		{propComparators: {
			overlayBefore: childrenEquals,
			overlayAfter: childrenEquals
		}}),
	Toggleable(
		{prop: 'remeasure', activate: 'onFocus', deactivate: 'onBlur', toggle: null}
	),
	Spottable,
	RemeasurableDecorator({trigger: 'remeasure'}),
	ItemMarqueeDecorator,
	Skinnable
);

/**
 * A Moonstone-styled item with built-in support for overlays.
 *
 * ```
 *	<ItemOverlay autoHide="both">
 *		<overlayBefore>
 *			<Icon>flag</Icon>
 *			<Icon>star</Icon>
 *		</overlayBefore>
 *		An Item that will show some icons before and after this text when spotted
 *		<Icon slot="overlayAfter">trash</Icon>
 *	</ItemOverlay>
 * ```
 *
 * @class Item
 * @memberof moonstone/Item
 * @mixes moonstone/Item.ItemDecorator
 * @ui
 * @public
 */
const ItemOverlay = ItemOverlayDecorator(ItemOverlayBase);

export default Item;
export {
	Item,
	ItemBase,
	ItemOverlay,
	ItemOverlayDecorator
};
