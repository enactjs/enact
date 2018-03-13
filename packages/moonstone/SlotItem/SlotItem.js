/**
 * Provides Moonstone-themed item component that accepts multiple positions of children, using the
 * usual `children` prop, as well as two additional props: `slotBefore`, and `slotAfter`.
 * It is able to be customized by a theme or application.
 *
 * @module moonstone/SlotItem
 * @exports SlotItem
 * @exports SlotItemBase
 * @exports SlotItemDecorator
 */

import compose from '@enact/core/internal/fp/compose';
import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';
import Pure from '@enact/ui/internal/Pure';
import {RemeasurableDecorator} from '@enact/ui/Remeasurable';
import {SlotItemBase as UiSlotItemBase, SlotItemDecorator as UiSlotItemDecorator} from '@enact/ui/SlotItem';
import {ItemDecorator as UiItemDecorator} from '@enact/ui/Item';
import Toggleable from '@enact/ui/Toggleable';
import PropTypes from 'prop-types';
import React from 'react';

import {ItemBase} from '../Item';
import {MarqueeDecorator} from '../Marquee';
import Skinnable from '../Skinnable';

import componentCss from './SlotItem.less';

/**
 * A moonstone-styled SlotItem without any behavior.
 *
 * @class SlotItemBase
 * @memberof moonstone/SlotItem
 * @extends ui/SlotItem.SlotItemBase
 * @mixes moonstone/Item.ItemBase
 * @ui
 * @public
 */
const SlotItemBase = kind({
	name: 'SlotItem',

	propTypes: /** @lends moonstone/SlotItem.SlotItemBase.prototype */ {
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
		publicClassNames: ['slotItem']
	},

	render: (props) => {
		return (
			<UiSlotItemBase
				{...props}
				component={ItemBase}
				css={props.css}
			/>
		);
	}
});

/**
 * Moonstone-specific item with overlay behaviors to apply to [Item]{@link moonstone/SlotItem.SlotItemBase}.
 *
 * @class SlotItemDecorator
 * @memberof moonstone/SlotItem
 * @mixes ui/SlotItem.SlotItemDecorator
 * @mixes ui/Toggleable
 * @mixes spotlight.Spottable
 * @mixes ui/Remeasurable.RemeasurableDecorator
 * @mixes moonstone/Marquee.MarqueeDecorator
 * @mixes moonstone/Skinnable
 * @hoc
 * @public
 */
const SlotItemDecorator = compose(
	UiSlotItemDecorator,
	Pure,
	Toggleable(
		{prop: 'remeasure', activate: 'onFocus', deactivate: 'onBlur', toggle: null}
	),
	UiItemDecorator, // (Touchable)
	Spottable,
	RemeasurableDecorator({trigger: 'remeasure'}),
	MarqueeDecorator({className: componentCss.content, invalidateProps: ['inline', 'autoHide', 'remeasure']}),
	Skinnable
);

/**
 * A Moonstone-styled item with built-in support for overlays.
 *
 * ```
 *	<SlotItem autoHide="both">
 *		<slotBefore>
 *			<Icon>flag</Icon>
 *			<Icon>star</Icon>
 *		</slotBefore>
 *		An Item that will show some icons before and after this text when spotted
 *		<Icon slot="slotAfter">trash</Icon>
 *	</SlotItem>
 * ```
 *
 * @class SlotItem
 * @memberof moonstone/SlotItem
 * @extends moonstone/SlotItem.SlotItemBase
 * @mixes moonstone/SlotItem.SlotItemDecorator
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
