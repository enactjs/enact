/**
 * Exports the {@link moonstone/LabeledItem.LabeledItem} component.
 *
 * @module moonstone/LabeledItem
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';
import {Cell, Row} from '@enact/ui/Layout';
import ri from '@enact/ui/resolution';
import Spottable from '@enact/spotlight/Spottable';

import Icon from '../Icon';
import {ItemBase} from '../Item';
import Skinnable from '../Skinnable';
import {MarqueeController, MarqueeText} from '../Marquee';

const Controller = MarqueeController({marqueeOnFocus: true}, Spottable(ItemBase));

import css from './LabeledItem.less';

const iconSize = 48;  // Icon width (36) + the left spotlight outset (12), so the right margin falls outside the component

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

	computed: {
		// relativeIconSize must be calculated after initialization so the `rem` scale is correct.
		relativeIconSize: () => ri.unit(ri.scale(iconSize), 'rem')
	},

	render: ({children, label, relativeIconSize, titleIcon, ...rest}) => (
		<Controller {...rest}>
			<Row align="center" className={css.text} inline>
				<Cell size={`calc(100% - ${(titleIcon != null) ? relativeIconSize : '0px'})`} component={MarqueeText} className={css.title}>{children}</Cell>
				{(titleIcon != null) ? <Cell size={iconSize}><Icon small className={css.icon}>{titleIcon}</Icon></Cell> : null}
			</Row>
			{(label != null) ? <MarqueeText className={css.label}>{label}</MarqueeText> : null}
		</Controller>
	)
});

const LabeledItem = Pure(
	Skinnable(
		LabeledItemBase
	)
);

export default LabeledItem;
export {LabeledItem, LabeledItemBase};
