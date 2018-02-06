/**
 * Provides Moonstone-themed item component that accepts multiple positions of children, using the
 * usual `children` prop, as well as two additional props: `overlayBefore`, and `overlayAfter`.
 * It is able to be customized by a theme or application.
 *
 * @module moonstone/SlotItem
 * @exports SlotItem
 * @exports SlotItemBase
 * @exports SlotItemDecorator
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {childrenEquals} from '@enact/core/util';
import {SlotItemBase as UiSlotItemBase, SlotItemDecorator as UiSlotItemDecorator} from '@enact/ui/SlotItem';
import {RemeasurableDecorator} from '@enact/ui/Remeasurable';
import Toggleable from '@enact/ui/Toggleable';
import Pure from '@enact/ui/internal/Pure';
import Spottable from '@enact/spotlight/Spottable';

import {MarqueeDecorator} from '../Marquee';
import Skinnable from '../Skinnable';

import Item from '../Item';

import componentCss from './SlotItem.less';

/**
 * A moonstone-styled SlotItem without any behavior.
 *
 * @class SlotItemBase
 * @memberof moonstone/Item
 * @extends moonstone/Item.Item
 * @ui
 * @public
 */
const SlotItemBase = kind({
	name: 'SlotItem',

	propTypes: /** @lends moonstone/Item.SlotItemBase.prototype */ {
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
		publicClassNames: 'slotItem'
	},

	render: (props) => {
		return (
			<UiSlotItemBase
				{...props}
				component={Item}
				css={props.css}
			/>
		);
	}
});

/**
 * Moonstone-specific item with overlay behaviors to apply to [Item]{@link moonstone/SlotItem.SlotItemBase}.
 *
 * @class SlotItemDecorator
 * @memberof moonstone/Item
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
 *	<SlotItem autoHide="both">
 *		<overlayBefore>
 *			<Icon>flag</Icon>
 *			<Icon>star</Icon>
 *		</overlayBefore>
 *		An Item that will show some icons before and after this text when spotted
 *		<Icon slot="overlayAfter">trash</Icon>
 *	</SlotItem>
 * ```
 *
 * @class SlotItem
 * @memberof moonstone/Item
 * @extends moonstone/Item.SlotItemBase
 * @mixes moonstone/Item.SlotItemDecorator
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
