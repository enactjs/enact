/**
 * Exports the {@link moonstone/Item.Item} and {@link moonstone/Item.ItemBase} components.
 *
 * @module moonstone/Item
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';
import Slottable from '@enact/ui/Slottable';
import {Spottable} from '@enact/spotlight';

import {MarqueeDecorator} from '../Marquee';

import OverlayDecorator from './OverlayDecorator';

import css from './Item.less';

/**
 * {@link moonstone/Item.ItemBase} is a Moonstone-styled control that can display
 * simple text or a set of controls. Most developers will want to use the spottable
 * version: {@link moonstone/Item.Item}.
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
		 * The node to be displayed as the main content of the item.
		 *
		 * @type {React.node}
		 * @public
		 */
		children: PropTypes.node.isRequired,

		/**
		 * The type of component to use to render the item. May be a DOM node name (e.g 'div',
		 * 'span', etc.) or a custom component.
		 *
		 * @type {String|Function}
		 * @default moonstone/Marquee.MarqueeText
		 * @public
		 */
		component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

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
		css,
		className: 'item'
	},

	computed: {
		className: ({inline, styler}) => styler.append({inline})
	},

	render: ({component: Component, ...rest}) => {
		delete rest.inline;

		return (
			<Component {...rest} />
		);
	}
});

// cache the MarqueeDecorator so it can be used for Item and ItemOverlay
const ItemMarqueeDecorator = MarqueeDecorator({className: css.content, recalculateOnPropChange: 'inline'});

/**
 * {@link moonstone/Item.Item} is a focusable Moonstone-styled control that can display
 * simple text or a set of controls.
 *
 * @class Item
 * @memberof moonstone/Item
 * @mixes spotlight/Spottable
 * @ui
 * @public
 */
const Item = Spottable(
	ItemMarqueeDecorator(
		ItemBase
	)
);

/**
 * {@link moonstone/Item.ItemOverlay} is a focusable Moonstone-styled control that can display
 * simple text or a set of controls along with overlays before and/or after the contents.
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
 * @class ItemOverlay
 * @memberof moonstone/Item
 * @mixes spotlight/Spottable, moonstone/Item.OverlayDecorator
 * @ui
 * @public
 */
const ItemOverlay = Spottable(
	Slottable(
		{slots: ['overlayAfter', 'overlayBefore']},
		ItemMarqueeDecorator(
			OverlayDecorator(
				ItemBase
			)
		)
	)
);

export default Item;
export {
	Item,
	ItemBase,
	ItemOverlay
};
