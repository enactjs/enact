/**
 * Exports the {@link ui/Item.Item} and {@link ui/Item.ItemBase} components.
 *
 * @module ui/Item
 */

import {forProp, forward, handle} from '@enact/core/handle';
import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Spottable from '@enact/spotlight/Spottable';
// import {diffClasses} from '@enact/ui/MigrationAid';

import {MarqueeDecorator} from '../Marquee';
import Slottable from '../Slottable';

import OverlayDecorator, {OverlayDecoratorFactory} from './OverlayDecorator';
import {OverlayFactory} from './Overlay';

import componentCss from './Item.less';

let ItemMarqueeDecorator;
/**
 * {@link ui/Item.ItemBaseFactory} is Factory wrapper around {@link ui/Item.ItemBase} that allows
 * overriding certain classes at design time. The following are properties of the `css` member of
 * the argument to the factory.
 *
 * @class ItemBaseFactory
 * @memberof ui/Item
 * @factory
 * @ui
 * @public
 */
// const ItemBaseFactory = factory({css: componentCss, components: {MarqueeDecorator}}, ({css, components}) => {
const ItemBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('UI Item', componentCss, css);

	// cache the MarqueeDecorator so it can be used for Item and ItemOverlay
	// ItemMarqueeDecorator = components.MarqueeDecorator({className: css.content, invalidateProps: ['inline', 'autoHide']});
	ItemMarqueeDecorator = MarqueeDecorator({className: css.content, invalidateProps: ['inline', 'autoHide']});

	/**
	 * {@link ui/Item.ItemBase} is an unstyled control that can display simple text or a set of
	 * controls. Most developers will want to use the spottable version: {@link ui/Item.Item}.
	 *
	 * @class ItemBase
	 * @memberof ui/Item
	 * @ui
	 * @public
	 */
	return kind({
		name: 'Item',

		propTypes: /** @lends ui/Item.ItemBase.prototype */ {
			/**
			 * The node to be displayed as the main content of the item.
			 *
			 * @type {Node}
			 * @public
			 */
			children: PropTypes.node.isRequired,

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

		handlers: {
			onClick: handle(
				forProp('disabled', false),
				forward('onClick')
			)
		},

		render: ({component: Component, disabled, ...rest}) => {
			delete rest.inline;

			return (
				<Component
					{...rest}
					aria-disabled={disabled}
					disabled={disabled}
				/>
			);
		}
	});
});

const ItemBase = ItemBaseFactory();

/**
 * {@link ui/Item.Item} is a focusable ui-styled control that can display
 * simple text or a set of controls.
 *
 * @class Item
 * @memberof ui/Item
 * @mixes spotlight.Spottable
 * @mixes ui/Marquee.MarqueeDecorator
 * @ui
 * @public
 */
const Item = Spottable(
	ItemMarqueeDecorator(
		ItemBase
	)
);

const ItemFactory = (props) => Spottable(
	ItemMarqueeDecorator(
		ItemBase(props)
	)
);

/**
 * {@link ui/Item.ItemOverlay} is a focusable ui-styled control that can display
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
 * @memberof ui/Item
 * @mixes spotlight.Spottable
 * @mixes ui/Marquee.MarqueeDecorator
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

const ItemOverlayFactory = (props) => Spottable(
	Slottable(
		{slots: ['overlayAfter', 'overlayBefore']},
		ItemMarqueeDecorator(
			OverlayDecorator(
				ItemBaseFactory(props)
			)
		)
	)
);

export default Item;
export {
	Item,
	ItemBase,
	ItemFactory,
	ItemBaseFactory,
	ItemOverlay,
	ItemOverlayFactory,
	ItemMarqueeDecorator,
	OverlayDecorator,
	OverlayDecoratorFactory,
	OverlayFactory
};
