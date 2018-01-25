/**
 * Provides Moonstone-themed ItemOverlayBase components and behaviors.
 *
 * @module moonstone/Item
 * @exports ItemOverlayBase
 */

import {Item as UIItemOverlay} from '@enact/ui/Item';
import {forProp, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {childrenEquals} from '@enact/core/util';
import Slottable from '@enact/ui/Slottable';
import {MarqueeDecorator} from '../Marquee';
import {RemeasurableDecorator} from '@enact/ui/Remeasurable';
import Toggleable from '@enact/ui/Toggleable';
import Pure from '@enact/ui/internal/Pure';
import Spottable from '@enact/spotlight/Spottable';
import Skinnable from '../Skinnable';

import Overlay from './Overlay';

import componentCss from './Item.less';

/**
 * A moonstone-styled ItemOverlay without any behavior.
 *
 * @class ItemOverlayBase
 * @memberof moonstone/Item
 * @ui
 * @public
 */
const ItemOverlayBase = kind({
	name: 'ItemOverlay',

	propTypes: /** @lends moonstone/Item.ItemOverlayBase.prototype */ {
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
		className:'item'
	},

	computed: {
		className: ({inline, styler}) => styler.append({inline}),
		overlayBefore: ({overlayBefore, css, autoHide}) => ( overlayBefore ?
			<Overlay className={css.before} hidden={autoHide === 'before' || autoHide === 'both'}>
				{overlayBefore}
			</Overlay> : null
		),
		overlayAfter: ({overlayAfter, css, autoHide}) => ( overlayAfter ?
			<Overlay className={css.after} hidden={autoHide === 'after' || autoHide === 'both'}>
				{overlayAfter}
			</Overlay> : null
		)
	},

	handlers: {
		onClick: handle(
			forProp('disabled', false),
			forward('onClick')
		)
	},

	render: ({css, ...rest}) => {
		return (
			<UIItemOverlay
				{...rest}
				css={css}
			/>
		);
	}
});

/**
 * Moonstone-specific item with overlay behaviors to apply to [Item]{@link moonstone/ItemOverlay.ItemOverlayBase}.
 *
 * @class ItemOverlayDecorator
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
