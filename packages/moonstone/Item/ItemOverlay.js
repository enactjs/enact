/**
 * Provides Moonstone-themed ItemOverlayBase components and behaviors.
 *
 * @module moonstone/ItemOverlay
 * @exports ItemOverlay
 * @exports ItemOverlayBase
 * @exports ItemOverlayDecorator
 */

import {ItemOverlay as UIItemOverlay} from '@enact/ui/Item';
import {forProp, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Overlay from './Overlay';


import OverlayCSS from './Overlay.less';
import ComponentCss from './Item.less';

/**
 * A moonstone-styled ItemOverlay without any behavior.
 *
 * @class ItemOverlayBase
 * @memberof moonstone/ItemOverlay
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
		css: Object.assign({}, ComponentCss, OverlayCSS, {item: `${ComponentCss.item} ${OverlayCSS.item}`}),
		className:'item',
		publicClassNames: ['item']
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

	render: ({component: Component, css, disabled, ...rest}) => {
		return (
			<UIItemOverlay
				css={css}
				component={Component}
				aria-disabled={disabled}
				disabled={disabled}
				{...rest}
			/>
		);
	}
});

/**
 * A Moonstone-styled item with overlay. Typically used in lists.
 *
 *
 * @class ItemOverlay
 * @memberof moonstone/ItemOverlay
 * @ui
 * @public
 */
const ItemOverlay = ItemOverlayBase;

export default ItemOverlayBase;

export {
	ItemOverlay,
	ItemOverlayBase
};
