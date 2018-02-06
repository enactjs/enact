/**
 * Provides an unstyled item component that accepts multiple positions of children, using the usual
 * `children` prop, as well as two additional props: `slotBefore`, and `slotAfter`.
 * It is able to be customized by a theme or application.
 *
 * @module ui/SlotItem
 * @exports SlotItem
 * @exports SlotItemBase
 * @exports SlotItemDecorator
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import Slottable from '../Slottable';

import componentCss from './SlotItem.less';

/**
 * A ui-styled SlotItem without any behavior.
 *
 * @class SlotItemBase
 * @memberof ui/SlotItem
 * @ui
 * @public
 */
const SlotItemBase = kind({
	name: 'SlotItem',

	propTypes: /** @lends ui/SlotItem.SlotItemBase.prototype */ {
		/**
		 * The type of component to use to render the item. Must be a custom component as it needs
		 * to accept the following props: `slotBefore`, `slotAfter`, and `css`.
		 * A derivitive of [Item]{@link ui/Item.Item} is recommended.
		 *
		 * @type {Component}
		 * @required
		 * @public
		 */
		component: PropTypes.func.isRequired,

		/**
		 * Controls the visibility state of the slots. One, both, or neither slot can be
		 * shown when the item is focused. Choosing `'slotAfter'` will leave `slotBefore` visible
		 * at all times; only `slotAfter` will have its visibility toggled on focus.  Valid
		 * values are `'slotBefore'`, `'slotAfter'` and `'both'`. Omitting the property will result in
		 * no-auto-hiding for either slot. They will both be present regardless of focus.
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
		 * * `slotItem` - The root class name
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object
	},

	styles: {
		css: componentCss,
		className: 'slotItem',
		publicClassNames: true
	},

	computed: {
		slotBefore: ({slotBefore, autoHide, styler}) => ( slotBefore ?
			<div className={styler.join('slot', 'before', {hidden: (autoHide === 'before' || autoHide === 'both')})}>
				{slotBefore}
			</div> : null
		),
		slotAfter: ({slotAfter, autoHide, styler}) => ( slotAfter ?
			<div className={styler.join('slot', 'after', {hidden: (autoHide === 'after' || autoHide === 'both')})}>
				{slotAfter}
			</div> : null
		)
	},

	render: ({component: Component, css, ...rest}) => {
		delete rest.autoHide;
		return (
			<Component
				{...rest}
				css={css}
			/>
		);
	}
});

/**
 * ui-specific item with slot behaviors to apply to [SlotItem]{@link ui/SlotItem.SlotItemBase}.
 *
 * @class SlotItemDecorator
 * @memberof ui/SlotItem
 * @mixes ui/Slottable.Slottable
 * @hoc
 * @public
 */
const SlotItemDecorator = Slottable({slots: ['slotAfter', 'slotBefore']});

/**
 * A ui-styled item with built-in support for slots.
 *
 * ```
 *	<SlotItem autoHide="both">
 *		<slotBefore>
 *			<Icon>flag</Icon>
 *			<Icon>star</Icon>
 *		</slotBefore>
 *		An Item that will show some icons slotBefore and slotAfter this text when spotted
 *		<Icon slot="slotAfter">trash</Icon>
 *	</SlotItem>
 * ```
 *
 * @class SlotItem
 * @memberof ui/SlotItem
 * @extends ui/SlotItem.SlotItemBase
 * @mixes ui/SlotItem.SlotItemDecorator
 * @ui
 * @public
 */
const SlotItem = SlotItemDecorator(SlotItemBase);

export default SlotItem;
export {
	SlotItem,
	SlotItemBase,
	SlotItemDecorator
};
