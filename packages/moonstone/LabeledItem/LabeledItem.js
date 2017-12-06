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
import Skinnable from '../Skinnable';
import {MarqueeController, MarqueeText} from '../Marquee';

const Controller = MarqueeController({marqueeOnFocus: true}, Pure(Spottable(ItemBase)));

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
		icon: ({titleIcon}) => {
			if (titleIcon != null) {
				if (typeof titleIcon === 'string') {
					return <Icon small className={css.icon}>{titleIcon}</Icon>;
				} else {
					return titleIcon;
				}
			} else {
				return null;
			}
		},
		label: ({disabled, label}) => {
			if (label != null) {
				if (typeof titleIcon === 'string') {
					return <MarqueeText disabled={disabled} className={css.label}>{label}</MarqueeText>;
				} else {
					return label;
				}
			} else {
				return null;
			}
		}
	},

	render: ({children, disabled, icon, label, ...rest}) => {
		delete rest.titleIcon;
		return (
			<Controller disabled={disabled} {...rest}>
				<div className={css.text}>
					<MarqueeText disabled={disabled} className={css.title}>{children}</MarqueeText>
					{icon}
				</div>
				{label}
			</Controller>
		);
	}
});

const LabeledItem = Pure(
	Skinnable(
		LabeledItemBase
	)
);

export default LabeledItem;
export {LabeledItem, LabeledItemBase};
