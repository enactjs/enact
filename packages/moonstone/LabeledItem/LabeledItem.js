/**
 * Exports the {@link moonstone/LabeledItem.LabeledItem} component.
 *
 * @module moonstone/LabeledItem
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';
import Spottable from '@enact/spotlight/Spottable';

import Icon from '../Icon';
import {ItemBase} from '../Item';
import {Marquee, MarqueeController} from '../Marquee';
import Skinnable from '../Skinnable';
import Touchable from '../internal/Touchable';

const Controller = MarqueeController(
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
		 * When `true`, applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

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

	render: ({children, disabled, label, titleIcon, ...rest}) => (
		<Controller disabled={disabled} {...rest}>
			<div className={css.text}>
				<Marquee disabled={disabled} className={css.title}>{children}</Marquee>
				{(titleIcon != null) ? <Icon small className={css.icon}>{titleIcon}</Icon> : null}
			</div>
			{(label != null) ? <Marquee disabled={disabled} className={css.label}>{label}</Marquee> : null}
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
