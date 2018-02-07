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
		 * The type of component to use to render the item.
		 *
		 * Must be a custom component as it needs to accept the following props: `slotBefore`,
		 * `slotAfter`, and `css`. A derivative of [Item]{@link ui/Item.Item} is recommended.
		 *
		 * @type {Component}
		 * @required
		 * @public
		 */
		component: PropTypes.func.isRequired,

		/**
		 * Controls the visibility state of the slots.
		 *
		 * One, both, or neither slot can be shown. Choosing `'after'` will leave `slotBefore`
		 * visible at all times; only `slotAfter` will have its visibility toggled.  Valid values
		 * are `'before'`, `'after'` and `'both'`. Omitting the property will result in
		 * no-auto-hiding for either slot so they will both be present.
		 *
		 * In order for `autoHide` to have a visual affect, the `hidden` class must be tied to
		 * another condition such as focus.
		 *
		 * ```
		 * .slot.hidden:not(:focus) {
		 *   display: none;
		 * }
		 * ```
		 *
		 * @type {Boolean}
		 * @public
		 */
		autoHide: PropTypes.oneOf(['after', 'before', 'both']),

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `slotItem` - The root class name
		 * * `slot` - Applied to both slots
		 * * `after` - Applied to the slot that falls after the content
		 * * `before` - Applied to the slot that falls before the content
		 * * `hidden` - Applied to a slot when that slot is supposed to be hidden, according to
		 *              `autoHide` prop
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

	render: ({children, component: Component, css, slotAfter, slotBefore, ...rest}) => {
		delete rest.autoHide;

		return (
			<Component
				{...rest}
				css={css}
			>
				{slotBefore}
				{children}
				{slotAfter}
			</Component>
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
 *	<SlotItem component={Item} autoHide="both">
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
