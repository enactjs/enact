/**
 * Exports the {@link moonstone/LabeledItem.LabeledItem} component.
 *
 * @module moonstone/LabeledItem
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import Icon from '../Icon';
import Item from '../Item';
import {MarqueeController, MarqueeText} from '../Marquee';

const Controller = MarqueeController(Item);

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
		<Controller {...rest}>
			<div className={css.text}>
				<MarqueeText className={css.title}>{children}</MarqueeText>
				{(titleIcon != null) ? <Icon small className={css.icon}>{titleIcon}</Icon> : null}
			</div>
			{(label != null) ? <MarqueeText className={css.label}>{label}</MarqueeText> : null}
		</Controller>
	)
});

export default LabeledItemBase;
export {LabeledItemBase as LabeledItem, LabeledItemBase};
