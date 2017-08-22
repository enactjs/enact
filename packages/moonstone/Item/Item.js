/**
 * A component typically used in list, this supports a variety of options including marqueeing text
 * that is too long, and via optional import, overlays which allow insertion of icons at the start
 * or end of the item which can always be visible or only visible on Item focus.
 *
 * @example
 * <div>
 * 	<Item>An item to use in a list</Item>
 * 	<Item>Another item to use in a list</Item>
 * 	<ItemOverlay>
 * 		A third item to use in a list
 * 		<overlayAfter>
 * 			<Icon>flag</Icon>
 * 		</overlayAfter>
 * 	</ItemOverlay>
 * </div>
 *
 * @module moonstone/Item
 * @exports Item
 * @exports ItemBase
 * @exports ItemBaseFactory
 * @exports ItemFactory
 */

import factory from '@enact/core/factory';
// import {diffClasses} from '@enact/ui/MigrationAid';
import {ItemBaseFactory as UiItemBaseFactory, ItemMarqueeDecorator} from '@enact/ui/Item';
import Slottable from '@enact/ui/Slottable';
import Spottable from '@enact/spotlight/Spottable';

// import {MarqueeDecorator} from '../Marquee';
import Skinnable from '../Skinnable';

import {OverlayDecoratorFactory} from './OverlayDecorator';

import componentCss from './Item.less';
import overlayCss from './Overlay.less';

/**
 * A factory for customizing the visual style of [ItemBase]{@link moonstone/Item.ItemBase}.
 *
 * @class ItemBaseFactory
 * @memberof moonstone/Item
 * @factory
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
		// DEV-NOTE: The commented line below represents the implementation of the branch `feature/component-factory`, currently in review.
		// components: {MarqueeDecorator}
	});
});

/**
 * A stateless [Item]{@link moonstone/Item.Item}, with no HOCs applied.
 *
 * @class ItemBase
 * @extends ui/Item.ItemBase
 * @memberof moonstone/Item
 * @ui
 * @public
 */
const ItemBase = ItemBaseFactory();

//
// DEV-NOTE: Technically our MarqueeDecorator is coming from UI, not Moonstone. Research must be
// done to determine the best way to support this component in UI and Moonstone.
// This can be done at a later time, after the `feature/component-factory` branch is reviewed.
//
// const ItemMarqueeDecorator = MarqueeDecorator({className: marqueeContentClassName, invalidateProps: ['inline', 'autoHide']});

/**
 * A factory for customizing the visual style of [Item]{@link moonstone/Item.Item}.
 * @see {@link moonstone/Item.ItemBaseFactory}.
 *
 * @class ItemFactory
 * @memberof moonstone/Item
 * @mixes spotlight/Spottable
 * @mixes ui/Marquee.MarqueeDecorator
 * @mixes moonstone/Skinnable
 * @factory
 * @public
 */
const ItemFactory = (props) => Spottable(
	ItemMarqueeDecorator(
		Skinnable(
			ItemBaseFactory(props)
		)
	)
);

/**
 * A ready-to-use {@link ui/Item}, with HOCs applied.
 *
 * @class Item
 * @memberof moonstone/Item
 * @extends moonstone/Item.ItemBase
 * @mixes spotlight/Spottable
 * @mixes ui/Marquee.MarqueeDecorator
 * @mixes moonstone/Skinnable
 * @ui
 * @public
 */
const Item = ItemFactory();


const OverlayDecorator = OverlayDecoratorFactory({css: overlayCss});

/**
 * A factory for customizing the visual style of [ItemOverlay]{@link moonstone/Item.ItemOverlay}.
 * @see {@link moonstone/Item.ItemOverlayBaseFactory}.
 *
 * @class ItemOverlayFactory
 * @memberof moonstone/Item
 * @mixes spotlight/Spottable
 * @mixes ui/Slottable
 * @mixes ui/Marquee.MarqueeDecorator
 * @mixes moonstone/Item.OverlayDecorator
 * @mixes moonstone/Skinnable
 * @factory
 * @public
 */
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

/**
 * A ready-to-use {@link ui/Button}, with HOCs applied that can display simple text or a set of
 * controls along with overlays before and/or after the contents.
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
 * @mixes spotlight/Spottable
 * @mixes ui/Slottable
 * @mixes ui/Marquee.MarqueeDecorator
 * @mixes moonstone/Item.OverlayDecorator
 * @mixes moonstone/Skinnable
 * @ui
 * @public
 */
const ItemOverlay = ItemOverlayFactory();


export default Item;
export {
	Item,
	ItemFactory,
	ItemBase,
	ItemBaseFactory,
	ItemOverlay,
	ItemOverlayFactory
};
