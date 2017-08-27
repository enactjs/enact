/**
 * Exports the {@link moonstone/LabeledItem.LabeledItem} component.
 *
 * @module moonstone/LabeledItem
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Spottable from '@enact/spotlight/Spottable';

import Icon from '../Icon';
import {ItemBase} from '../Item';
import Skinnable from '../Skinnable';
import {MarqueeController, MarqueeText} from '../Marquee';
import Touchable from '../internal/Touchable';

const Item = MarqueeController(
	{marqueeOnFocus: true},
	Touchable(
		Spottable(
			ItemBase
		)
	)
);

import css from './LabeledItem.less';

/**
 * {@link moonstone/LabeledItem.LabeledItemBase} is a focusable Moonstone-styled component
 * that combines marquee-able text content with a synchronized marquee-able text label.
 *
 * @class LabeledItemBase
 * @memberof moonstone/LabeledItem
 * @ui
 * @public
 */
const LabeledItemBase = kind({
	name: 'LabeledItem',

	propTypes: /** @lends moonstone/LabeledItem.LabeledItemBase.prototype */ {
		/**
		 * The node to be displayed as the main content of the item.
		 *
		 * @type {Node}
		 * @required
		 * @public
		 */
		children: PropTypes.node.isRequired,

		/**
		 * The label to be displayed along with the text.
		 *
		 * @type {Node}
		 * @public
		 */
		label: PropTypes.node,

		/**
		 * Icon to be displayed next to the title text.
		 *
		 * @type {String}
		 * @public
		 */
		titleIcon: PropTypes.string
	},

	styles: {
		css,
		className: 'labeleditem'
	},

	render: ({children, label, titleIcon, ...rest}) => (
		<Item {...rest}>
			<div className={css.text}>
				<MarqueeText className={css.title}>{children}</MarqueeText>
				{(titleIcon != null) ? <Icon small className={css.icon}>{titleIcon}</Icon> : null}
			</div>
			{(label != null) ? <MarqueeText className={css.label}>{label}</MarqueeText> : null}
		</Item>
	)
});

const LabeledItem = Skinnable(LabeledItemBase);

export default LabeledItem;
export {LabeledItem, LabeledItemBase};
