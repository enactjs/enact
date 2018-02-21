/**
 * Exports the {@link moonstone/LabeledItem.LabeledItem} component.
 *
 * @module moonstone/LabeledItem
 */

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

import componentCss from './LabeledItem.less';

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
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `icon` - Applied to the icon
		 * * `label` - Applied to the label
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

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
		 * @type {String|Object}
		 * @public
		 */
		titleIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
	},

	styles: {
		css: componentCss,
		className: 'labeleditem',
		publicClassNames: 'icon label'
	},

	render: ({children, css, disabled, label, titleIcon, ...rest}) => (
		<Controller disabled={disabled} {...rest}>
			<div className={css.text}>
				<MarqueeText disabled={disabled} className={css.title}>{children}</MarqueeText>
				{(titleIcon != null) ? <Icon small className={css.icon}>{titleIcon}</Icon> : null}
			</div>
			{(label != null) ? <MarqueeText disabled={disabled} className={css.label}>{label}</MarqueeText> : null}
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
