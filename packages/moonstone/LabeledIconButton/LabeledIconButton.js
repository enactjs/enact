/**
 * An [Icon]{@link moonstone/Icon.Icon} that acts like a [Button]{@link moonstone/Button.Button}
 * decorated with a label.
 *
 * You may specify an image or a font-based icon by setting the `icon` to either the path
 * to the image or a string from an [iconList]{@link moonstone/Icon.IconBase.iconList}.
 *
 * @example
 * <LabeledIconButton icon="star" labelPosition="after">
 *   Favorite
 * </LabeledIconButton>
 *
 * @module moonstone/LabeledIconButton
 * @exports LabeledIconButton
 * @exports LabeledIconButtonBase
 * @exports LabeledIconButtonDecorator
 */

import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';
import {IconButtonDecorator as UiIconButtonDecorator} from '@enact/ui/IconButton';
import UiLabeledIcon from '@enact/ui/LabeledIcon';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import {IconButtonBase} from '../IconButton';
import Skinnable from '../Skinnable';

import componentCss from './LabeledIconButton.module.less';

const IconButton = compose(
	UiIconButtonDecorator,
	Spottable,
	Skinnable
)(IconButtonBase);

/**
 * An icon button component with a label.
 *
 * @class LabeledIconButtonBase
 * @memberof moonstone/LabeledIconButton
 * @extends ui/LabeledIcon.LabeledIcon
 * @ui
 * @public
 */
const LabeledIconButtonBase = kind({
	name: 'LabeledIconButton',

	propTypes: /** @lends moonstone/LabeledIconButton.LabeledIconButtonBase.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `labeledIconButton` - The root component class
		 * * `icon` - The icon component class
		 * * `label` - The label component class
		 * * `large` - Applied to a `size='large'` button
		 * * `selected` - Applied to a `selected` button
		 * * `small` - Applied to a `size='small'` button
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * The icon displayed within the button.
		 *
		 * @type {String}
		 * @public
		 */
		icon: PropTypes.string,

		/**
		 * Selects the component.
		 *
		 * Setting `selected` may be useful when the component represents a toggleable option. The
		 * visual effect may be customized using the
		 * [css]{@link moonstone/LabeledIconButton.LabeledIconButtonBase.css} prop.
		 *
		 * @type {Boolean}
		 * @public
		 */
		selected: PropTypes.bool
	},

	styles: {
		css: componentCss,
		className: 'labeledIconButton',
		publicClassNames: ['labeledIconButton', 'icon', 'label', 'selected', 'small']
	},

	render: ({css, icon, selected, ...rest}) => {
		return UiLabeledIcon.inline({
			...rest,
			icon: (
				<IconButton selected={selected}>
					{icon}
				</IconButton>
			),
			css
		});
	}
});

/**
 * Adds Moonstone specific behaviors to [LabeledIconButtonBase]{@link moonstone/LabeledIconButton.LabeledIconButtonBase}.
 *
 * @hoc
 * @memberof moonstone/LabeledIconButton
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */
const LabeledIconButtonDecorator = compose(
	Pure,
	Skinnable
);

/**
 * A Moonstone-styled icon button component with a label.
 *
 * Usage:
 * ```
 * <LabeledIconButton icon="star" labelPosition="after">
 *   Favorite
 * </LabeledIconButton>
 * ```
 *
 * @class LabeledIconButton
 * @memberof moonstone/LabeledIconButton
 * @extends moonstone/LabeledIconButton.LabeledIconButtonBase
 * @mixes moonstone/LabeledIconButton.LabeledIconButtonDecorator
 * @ui
 * @public
 */
const LabeledIconButton = LabeledIconButtonDecorator(LabeledIconButtonBase);

export default LabeledIconButton;
export {
	LabeledIconButton,
	LabeledIconButtonBase,
	LabeledIconButtonDecorator
};
