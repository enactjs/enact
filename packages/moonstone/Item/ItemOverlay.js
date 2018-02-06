// This is a sub-component to moonstone/Item, so it does not have a @module declaration
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {childrenEquals} from '@enact/core/util';
// import Slottable from '@enact/ui/Slottable';
import UiItemOverlay from '@enact/ui/ItemOverlay';
import {RemeasurableDecorator} from '@enact/ui/Remeasurable';
import Toggleable from '@enact/ui/Toggleable';
import Pure from '@enact/ui/internal/Pure';
import Spottable from '@enact/spotlight/Spottable';

import {MarqueeDecorator} from '../Marquee';
import Skinnable from '../Skinnable';

import Item from './Item';
// import Overlay from './Overlay';

import componentCss from './Item.less';

/**
 * A moonstone-styled ItemOverlay without any behavior.
 *
 * @class ItemOverlayBase
 * @memberof moonstone/Item
 * @extends moonstone/Item.ItemBase
 * @ui
 * @public
 */
const ItemOverlayBase = kind({
	name: 'ItemOverlay',

	propTypes: /** @lends moonstone/Item.ItemOverlayBase.prototype */ {
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
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `itemOverlay` - The root class name
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object
	},

	styles: {
		css: componentCss,
		className: 'itemOverlay',
		publicClassNames: 'itemOverlay'
	},

	render: ({css, ...rest}) => {
		delete rest.autoHide;
		return (
			<UiItemOverlay
				{...rest}
				css={css}
				itemComponent={Item}
			/>
		);
	}
});

/**
 * Moonstone-specific item with overlay behaviors to apply to [Item]{@link moonstone/ItemOverlay.ItemOverlayBase}.
 *
 * @class ItemOverlayDecorator
 * @memberof moonstone/Item
 * @mixes ui/Toggleable
 * @mixes spotlight.Spottable
 * @mixes ui/Remeasurable.RemeasurableDecorator
 * @mixes moonstone/Marquee.MarqueeDecorator
 * @mixes moonstone/Skinnable
 * @ui
 * @public
 */
const ItemOverlayDecorator = compose(
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
	MarqueeDecorator({className: componentCss.content, invalidateProps: ['inline', 'autoHide', 'remeasure']}),
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
 * @class ItemOverlay
 * @memberof moonstone/Item
 * @extends moonstone/Item.ItemOverlayBase
 * @mixes moonstone/Item.ItemOverlayDecorator
 * @ui
 * @public
 */
const ItemOverlay = ItemOverlayDecorator(ItemOverlayBase);

export default ItemOverlayBase;
export {
	ItemOverlay,
	ItemOverlayBase,
	ItemOverlayDecorator
};
