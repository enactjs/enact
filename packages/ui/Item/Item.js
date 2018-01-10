/**
 * Provides an unstyled item component and behaviors to be customized by a theme or application.
 *
 * @module ui/Item
 * @exports Item
 * @exports ItemBase
 * @exports ItemDecorator
 * @exports ItemOverlay,
 * @exports ItemOverlayDecorator
 */

import {forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Touchable from '../Touchable';
import ComponentCSS from './Item.less';

/**
 * [ItemBase]{@link ui/Item.ItemBase} is a basic item component structure without any behaviors
 * applied to it. It also has support for overlay to place things before and after the main content.
 *
 * @class ItemBase
 * @memberof ui/Item
 * @ui
 * @public
 */
const ItemBase = kind({
	name: 'ui:Item',

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
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `item` - The root class name
		 * * `inline` - Applied when `inline` prop is true
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Applies inline styling to the item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		inline: PropTypes.bool,

		/**
		 * Overlay for content to be applied after content.
		 *
		 * @type {Boolean}
		 * @public
		 */
		overlayAfter: PropTypes.node,

		/**
		 * Overlay for content to be applied before content.
		 *
		 * @type {Boolean}
		 * @public
		 */
		overlayBefore: PropTypes.node

	},

	defaultProps: {
		component: 'div',
		inline: false
	},

	styles: {
		css: ComponentCSS,
		className: 'item',
		publicClassNams: ['item', 'overlay']
	},

	computed: {
		className: ({inline, styler}) => styler.append({inline})
	},

	handlers: {
		onClick: handle(
			forward('onClick')
		)
	},

	render: ({component: Component, overlayBefore, overlayAfter, css, children, ...rest}) => {
		delete rest.inline;

		return (
			<Component css={css} {...rest}>
				{overlayBefore}
				{children}
				{overlayAfter}
			</Component>
		);
	}
});

/**
 * [ItemDecorator]{@link ui/Item.ItemDecorator} adds touch support to a
 * [Item]{@link ui/Item.Item}
 *
 * @hoc
 * @memberof ui/Item
 * @mixes ui/Touchable.Touchable
 * @public
 */
const ItemDecorator = Touchable;
const Item = ItemDecorator(ItemBase);

/**
 * [ItemOverlayDecorator]{@link ui/Item.ItemOverlayDecorator} adds slottable support to a
 * [Item]{@link ui/Item.Item}
 *
 * @hoc
 * @memberof ui/Item
 * @mixes ui/Slottable.Slottable
 * @public
 */
const ItemOverlayDecorator = (Wrapped) => Wrapped;

/**
 * [ItemOverlay]{@link ui/Item.ItemOverlay} is a minimally-styled item with
 * touchable, overlay, and slottable support
 * [Item]{@link ui/Item.Item}
 *
 * @hoc
 * @memberof ui/Item
 * @public
 */
const ItemOverlay = Item;

export default Item;
export {
	Item,
	ItemBase,
	ItemDecorator,
	ItemOverlay,
	ItemOverlayDecorator
};
