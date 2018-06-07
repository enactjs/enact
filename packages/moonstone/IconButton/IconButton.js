/**
 * An [Icon]{@link moonstone/Icon.Icon} that acts like a [Button]{@link moonstone/Button.Button}.
 * You may specify an image or a font-based icon by setting the `children` to either the path
 * to the image or a string from an [iconList]{@link moonstone/Icon.IconBase.iconList}.
 *
 * @example
 * <IconButton small>plus</IconButton>
 *
 * @module moonstone/IconButton
 * @exports IconButton
 * @exports IconButtonBase
 * @exports IconButtonDecorator
 */

import kind from '@enact/core/kind';
import {IconButtonBase as UiIconButtonBase, IconButtonDecorator as UiIconButtonDecorator} from '@enact/ui/IconButton';
import Pure from '@enact/ui/internal/Pure';
import Spottable from '@enact/spotlight/Spottable';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import {ButtonBase} from '../Button';
import Icon from '../Icon';
import Skinnable from '../Skinnable';

import componentCss from './IconButton.less';

/**
 * A moonstone-styled icon button without any behavior.
 *
 * @class IconButtonBase
 * @memberof moonstone/IconButton
 * @ui
 * @public
 */
const IconButtonBase = kind({
	name: 'IconButton',

	propTypes: /** @lends moonstone/IconButton.IconButtonBase.prototype */ {
		/**
		 * The background-color opacity of this icon button
		 *
		 * Valid values are:
		 * * `'translucent'`,
		 * * `'lightTranslucent'`, and
		 * * `'transparent'`.
		 *
		 * @type {String}
		 * @public
		 */
		backgroundOpacity: PropTypes.oneOf(['translucent', 'lightTranslucent', 'transparent']),

		/**
		 * The color of the underline beneath the icon.
		 *
		 * This property accepts one of the following color names, which correspond with the
		 * colored buttons on a standard remote control: `'red'`, `'green'`, `'yellow'`, `'blue'`
		 *
		 * @type {String}
		 * @public
		 */
		color: PropTypes.oneOf(['red', 'green', 'yellow', 'blue']),

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `iconButton` - The root class name
		 * * `bg` - The background node of the icon button
		 * * `selected` - Applied to a `selected` icon button
		 * * `small` - Applied to a `small` icon button
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * The icon displayed within the [Button]{@link moonstone/IconButton.IconButtonBase}.
		 *
		 * If not specified, `children` is used as the icon value instead.
		 *
		 * @type {Node}
		 * @public
		 */
		icon: PropTypes.string
	},

	styles: {
		css: componentCss,
		publicClassNames: ['iconButton', 'bg', 'selected', 'small']
	},

	computed: {
		className: ({color, styler}) => styler.append(color)
	},

	render: ({children, css, icon, ...rest}) => {

		// To support the simpler use case of only specifying the icon as the children within
		// <IconButton>, this falls back on using children if icon isn't specified.
		if (!icon && children) {
			icon = children;
			children = null;
		}

		return (
			<UiIconButtonBase
				data-webos-voice-intent="Select"
				{...rest}
				buttonComponent={<ButtonBase css={css} />}
				css={css}
				icon={icon}
				iconComponent={Icon}
			>
				{children}
			</UiIconButtonBase>
		);
	}
});

/**
 * Moonstone-specific button behaviors to apply to
 * [IconButton]{@link moonstone/IconButton.IconButtonBase}.
 *
 * @hoc
 * @memberof moonstone/IconButton
 * @mixes moonstone/TooltipDecorator.TooltipDecorator
 * @mixes ui/IconButton.IconButtonDecorator
 * @mixes spotlight/Spottable.Spottable
 * @mixes ui/Skinnable.Skinnable
 * @public
 */
const IconButtonDecorator = compose(
	Pure,
	UiIconButtonDecorator,
	Spottable,
	Skinnable
);

/**
 * `IconButton` does not have `Marquee` or `Uppercase` like `Button` has, as it should not contain
 * text.
 *
 * Usage:
 * ```
 * <IconButton onClick={handleClick} small>
 *     plus
 * </IconButton>
 * ```
 *
 * @class IconButton
 * @memberof moonstone/IconButton
 * @extends moonstone/IconButton.IconButtonBase
 * @mixes moonstone/IconButton.IconButtonDecorator
 * @ui
 * @public
 */
const IconButton = IconButtonDecorator(IconButtonBase);

export default IconButton;
export {
	IconButton,
	IconButtonBase,
	IconButtonDecorator
};
