/**
 * Provides Moonstone styled item with a label below.
 *
 * @example
 * <LabeledItem label="Label">Hello LabeledItem</LabeledItem>
 *
 * @module moonstone/LabeledItem
 * @exports LabeledItem
 * @exports LabeledItemBase
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';
import Touchable from '@enact/ui/Touchable';
import Spottable from '@enact/spotlight/Spottable';

import Icon from '../Icon';
import {ItemBase} from '../Item';
import {Marquee, MarqueeController} from '../Marquee';
import Skinnable from '../Skinnable';

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
 * A focusable component that combines marquee-able text content with a synchronized
 * marquee-able text label.
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
		 * * `labeledItem` - The root class name
		 * * `icon` - Applied to the icon
		 * * `label` - Applied to the label
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Applies a disabled style and the control becomes non-interactive.
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
		className: 'labeledItem',
		publicClassNames: ['labeledItem', 'icon', 'label']
	},

	render: ({children, css, disabled, label, titleIcon, ...rest}) => (
		<Controller disabled={disabled} {...rest} css={css}>
			<div className={css.text}>
				<Marquee disabled={disabled} className={css.title}>{children}</Marquee>
				{(titleIcon != null) ? <Icon small className={css.icon}>{titleIcon}</Icon> : null}
			</div>
			{(label != null) ? <Marquee disabled={disabled} className={css.label}>{label}</Marquee> : null}
		</Controller>
	)
});

/**
 * A Moonstone styled labeled item with built-in support for marqueed text, and Spotlight focus.
 *
 * @class LabeledItem
 * @memberof moonstone/LabeledItem
 * @extends moonstone/LabeledItem.LabeledItemBase
 * @mixes moonstone/Skinnable.Skinnable
 * @ui
 * @public
 */
const LabeledItem = Pure(
	Skinnable(
		LabeledItemBase
	)
);

export default LabeledItem;
export {LabeledItem, LabeledItemBase};
