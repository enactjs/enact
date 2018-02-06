/**
 * Exports the {@link moonstone/LabeledItem.LabeledItem} component.
 *
 * @module moonstone/LabeledItem
 */

import {childrenEquals} from '@enact/core/util';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';
import Touchable from '@enact/ui/Touchable';
import Spottable from '@enact/spotlight/Spottable';

import Icon from '../Icon';
import {ItemBase} from '../Item';
import Skinnable from '../Skinnable';
import {MarqueeController, MarqueeText} from '../Marquee';

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
		 * @type {Node}
		 * @public
		 */
		titleIcon: PropTypes.node
	},

	styles: {
		css,
		className: 'labeleditem'
	},

	computed: {
		label: ({disabled, label}) => (
			typeof label === 'string' ? <MarqueeText disabled={disabled} className={css.label}>{label}</MarqueeText> : label
		),
		titleIcon: ({titleIcon}) => (
			typeof titleIcon === 'string' ? <Icon small className={css.icon}>{titleIcon}</Icon> : titleIcon
		)
	},

	render: ({children, disabled, label, titleIcon, ...rest}) => (
		<Controller disabled={disabled} {...rest}>
			<div className={css.text}>
				<MarqueeText disabled={disabled} className={css.title}>{children}</MarqueeText>
				{titleIcon || null}
			</div>
			{label || null}
		</Controller>
	)
});

const LabeledItem = Pure(
	{propComparators: {
		label: childrenEquals,
		titleIcon: childrenEquals
	}},
	Skinnable(
		LabeledItemBase
	)
);

export default LabeledItem;
export {LabeledItem, LabeledItemBase};
