/**
 * Exports the {@link moonstone/Item.Item} and {@link moonstone/Item.ItemBase} components.
 *
 * @module moonstone/Item
 */

import factory from '@enact/core/factory';
// import {diffClasses} from '@enact/ui/MigrationAid';
import {ItemBaseFactory as UiItemBaseFactory, ItemMarqueeDecorator} from '@enact/ui/Item';
import Slottable from '@enact/ui/Slottable';
import Spottable from '@enact/spotlight/Spottable';

// import {MarqueeDecorator} from '../Marquee';
import Skinnable from '../Skinnable';

import OverlayDecorator from './OverlayDecorator';

import componentCss from './Item.less';

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
const ItemBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon Item', componentCss, css);

	return UiItemBaseFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/Item.ItemFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			item: css.item
		}
		// components: {MarqueeDecorator}
	});
});

const ItemBase = ItemBaseFactory();

//
// DEV-NOTE: Technically our MarqueeDecorator is coming from UI, not Moonstone. Research must be
// done to determine the best way to support this component in UI and Moonstone
//
// const ItemMarqueeDecorator = MarqueeDecorator({className: marqueeContentClassName, invalidateProps: ['inline', 'autoHide']});

/**
 * {@link moonstone/Item.Item} is a focusable Moonstone-styled control that can display
 * simple text or a set of controls.
 *
 * @class Item
 * @memberof moonstone/Item
 * @mixes spotlight.Spottable
 * @mixes moonstone/Marquee.MarqueeDecorator
 * @ui
 * @public
 */
const Item = Spottable(
	ItemMarqueeDecorator(
		Skinnable(
			ItemBase
		)
	)
);

const ItemFactory = (props) => Spottable(
	ItemMarqueeDecorator(
		Skinnable(
			ItemBaseFactory(props)
		)
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
 * @mixes spotlight.Spottable
 * @mixes moonstone/Marquee.MarqueeDecorator
 * @ui
 * @public
 */
const ItemOverlay = Spottable(
	Slottable(
		{slots: ['overlayAfter', 'overlayBefore']},
		ItemMarqueeDecorator(
			OverlayDecorator(
				Skinnable(
					ItemBase
				)
			)
		)
	)
);

const ItemOverlayFactory = (props) => Spottable(
	Slottable(
		{slots: ['overlayAfter', 'overlayBefore']},
		ItemMarqueeDecorator(
			OverlayDecorator(
				Skinnable(
					ItemBaseFactory(props)
				)
			)
		)
	)
);

export default Item;
export {
	Item,
	ItemFactory,
	ItemBase,
	ItemBaseFactory,
	ItemOverlay,
	ItemOverlayFactory
};
