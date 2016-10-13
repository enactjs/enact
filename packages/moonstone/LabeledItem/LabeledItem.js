/**
 * Exports the {@link module:@enact/moonstone/LabeledItem~LabeledItem} component.
 *
 * @module @enact/moonstone/LabeledItem
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import Item from '../Item';
import {MarqueeDecorator} from '../Marquee';

import css from './LabeledItem.less';

/**
 * {@link module:@enact/moonstone/LabeledItem~LabeledItem} is a focusable Moonstone-styled component
 * that combines marquee-enabled text content with a text label.
 *
 * @class LabeledItem
 * @ui
 * @public
 */
const LabeledItemBase = kind({
	name: 'LabeledItem',

	propTypes: {
		/**
		 * The node to be displayed as the main text of the item.
		 *
		 * @type {React.node}
		 * @required
		 * @public
		 */
		children: PropTypes.node.isRequired,

		/**
		 * The label to be displayed along with the text.
		 *
		 * @type {String|Number}
		 * @default null
		 * @public
		 */
		label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
	},

	styles: {
		css,
		className: 'labeleditem'
	},

	render: ({children, label, ...rest}) => (
		<Item {...rest} component='div'>
			{children}
			{(label != null) ? (<div className={css.label}>{label}</div>) : null}
		</Item>
	)
});

const LabeledItem = MarqueeDecorator(
	{className: css.text},
	LabeledItemBase
);

export default LabeledItem;
export {LabeledItem, LabeledItemBase};
