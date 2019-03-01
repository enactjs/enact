/**
 * An unstyled item component that accepts multiple positions of children.
 *
 * Using the usual `children` prop, as well as two additional props: `slotBefore`, and `slotAfter`.
 * It is able to be customized by a theme or application.
 *
 * @module ui/SlotItem
 * @exports SlotItem
 * @exports SlotItemBase
 * @exports SlotItemDecorator
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import Slottable from '../Slottable';

import componentCss from './SlotItem.module.less';
import ForwardRef from '../ForwardRef';

/**
 * A ui-styled `SlotItem` without any behavior.
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
		 * This component will receive the `inline` prop and any additional unhandled props provided
		 * to `SlotItem`. A derivative of [Item]{@link ui/Item.Item} is recommended.
		 *
		 * @type {Function}
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
		 * Called with a reference to `component`
		 *
		 * @private
		 */
		componentRef: PropTypes.func,

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
		css: PropTypes.object,

		/**
		 * Applies inline styling to the component.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		inline: PropTypes.bool,

		/**
		 * The layout technique for `SlotItem`.
		 *
		 * `"flex"` is applied as a default and gives basic flex support to the wrapping elements.
		 * This may be set to `null` to define your own layout method.
		 *
		 * @type {String}
		 * @default 'flex'
		 * @public
		 */
		layout: PropTypes.oneOf(['flex']),

		/**
		 * Nodes to be inserted after `children` and hidden using `autoHide`.
		 *
		 * If nothing is specified, nothing, not even an empty container, is rendered in this place.
		 *
		 * @type {Node}
		 * @public
		 */
		slotAfter: PropTypes.node,

		/**
		 * Nodes to be inserted before `children` and hidden using `autoHide`.
		 *
		 * If nothing is specified, nothing, not even an empty container, is rendered in this place.
		 *
		 * @type {Node}
		 * @public
		 */
		slotBefore: PropTypes.node
	},

	defaultProps: {
		inline: false,
		layout: 'flex'
	},

	styles: {
		css: componentCss,
		className: 'slotItem',
		publicClassNames: true
	},

	computed: {
		className: ({inline, layout, styler}) => styler.append(layout, {inline}),
		slotBefore: ({slotBefore, autoHide, styler}) => (slotBefore ?
			<div className={styler.join('slot', 'before', {hidden: (autoHide === 'before' || autoHide === 'both')})}>
				{slotBefore}
			</div> : null
		),
		slotAfter: ({slotAfter, autoHide, styler}) => (slotAfter ?
			<div className={styler.join('slot', 'after', {hidden: (autoHide === 'after' || autoHide === 'both')})}>
				{slotAfter}
			</div> : null
		)
	},

	render: ({children, component: Component, componentRef, inline, slotAfter, slotBefore, ...rest}) => {
		delete rest.autoHide;
		delete rest.layout;

		return (
			<Component
				ref={componentRef}
				{...rest}
				inline={inline}
			>
				{slotBefore}
				{children}
				{slotAfter}
			</Component>
		);
	}
});

/**
 * A ui-specific higher-order component (HOC) with slot behaviors to apply to [SlotItem]{@link ui/SlotItem.SlotItemBase}.
 *
 * @class SlotItemDecorator
 * @memberof ui/SlotItem
 * @mixes ui/Slottable.Slottable
 * @hoc
 * @public
 */
const SlotItemDecorator = compose(
	ForwardRef({prop: 'componentRef'}),
	Slottable({slots: ['slotAfter', 'slotBefore']})
);

/**
 * A ui-styled item with built-in support for slots.
 *
 * Example:
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
