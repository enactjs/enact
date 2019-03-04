/**
 * An unstyled item component and behaviors to be customized by a theme or application.
 *
 * @module ui/Item
 * @exports Item
 * @exports ItemBase
 * @exports ItemDecorator
 */

import kind from '@enact/core/kind';
import EnactPropTypes from '@enact/core/internal/prop-types';
import PropTypes from 'prop-types';
import React from 'react';

import Touchable from '../Touchable';

import componentCss from './Item.module.less';

/**
 * A basic list item component structure without any behaviors applied to it.
 *
 * It also has support for overlay to place things before and after the main content.
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
		children: PropTypes.node,

		/**
		 * The type of component to use to render the item. May be a DOM node name (e.g 'div',
		 * 'span', etc.) or a custom component.
		 *
		 * @type {String|Component}
		 * @default 'div'
		 * @public
		 */
		component: EnactPropTypes.renderable,

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
		 * Applies a disabled state to the item.
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
		inline: false
	},

	styles: {
		css: componentCss,
		className: 'item',
		publicClassNames: true
	},

	computed: {
		className: ({inline, styler}) => styler.append({inline})
	},

	render: ({component: Component, disabled, children, ...rest}) => {
		delete rest.inline;

		return (
			<Component
				{...rest}
				aria-disabled={disabled}
				disabled={disabled}
			>
				{children}
			</Component>
		);
	}
});

/**
 * A higher-order component that adds touch support to the component it wraps.
 *
 * @hoc
 * @memberof ui/Item
 * @mixes ui/Touchable.Touchable
 * @public
 */
const ItemDecorator = Touchable;

/**
 * A minimally-styled ready-to-use list item component with touch support.
 *
 * @class Item
 * @extends ui/Item.ItemBase
 * @memberof ui/Item
 * @mixes ui/Item.ItemDecorator
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
