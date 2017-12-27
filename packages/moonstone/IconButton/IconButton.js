/**
 * An {@link moonstone/Icon.Icon} that acts like a button.
 *
 * @module moonstone/IconButton
 * @exports IconButton
 * @exports IconButtonBase
 * @exports IconButtonBaseFactory
 * @exports IconButtonFactory
 */

import kind from '@enact/core/kind';
import {IconButtonBase as UiIconButtonBase} from '@enact/ui/IconButton';
import Pure from '@enact/ui/internal/Pure';
import Spottable from '@enact/spotlight/Spottable';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import {ButtonBase} from '../Button';
import Icon from '../Icon';
import Skinnable from '../Skinnable';
import TooltipDecorator from '../TooltipDecorator';
import Touchable from '../internal/Touchable';

import componentCss from './IconButton.less';

/**
 * {@link moonstone/IconButton.IconButtonBase} is a moonstone-styled button without any behavior.
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
		 * * `'opaque'`,
		 * * `'translucent'`,
		 * * `'lightTranslucent'`, and
		 * * `'transparent'`.
		 *
		 * @type {String}
		 * @default 'opaque'
		 * @public
		 */
		backgroundOpacity: PropTypes.oneOf(['opaque', 'translucent', 'lightTranslucent', 'transparent']),

		/**
		 * The color of the underline beneath the icon.
		 *
		 * This property accepts one of the following color names, which correspond with the
		 * colored buttons on a standard remote control: `'red'`, `'green'`, `'yellow'`, `'blue'`
		 *
		 * @type {String}
		 * @public
		 */
		color: PropTypes.oneOf([null, 'red', 'green', 'yellow', 'blue']),

		/**
		 * Customizes the component and its internal nodes by exposing the class names for nodes and
		 * states that may be augmented by authors.
		 *
		 * The following classes are supported:
		 * * `iconButton` - The root class name
		 * * `bg` - The background node of the icon button
		 * * `selected` - Applied to a `selected` icon button
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Disables the `pressed` animation
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * An optional node to receive the tooltip from `TooltipDecorator`.
		 *
		 * @type {Node}
		 * @private
		 */
		tooltipNode: PropTypes.node
	},

	defaultProps: {
		noAnimation: false
	},

	styles: {
		css: componentCss,
		publicClassNames: ['iconButton', 'bg', 'selected']
	},

	computed: {
		className: ({color, styler}) => styler.append(color)
	},

	render: ({children, css, tooltipNode, ...rest}) => {
		return (
			<UiIconButtonBase
				{...rest}
				buttonComponent={ButtonBase}
				css={css}
				icon={children}
				iconComponent={Icon}
			>
				{tooltipNode}
			</UiIconButtonBase>
		);
	}
});


/**
 * {@link moonstone/IconButton.IconButtonDecorator} adds Moonstone-specific button behaviors to an
 * [IconButton]{@link moonstone/IconButton.IconButtonBase}.
 *
 * @hoc
 * @memberof moonstone/IconButton
 * @mixes moonstone/TooltipDecorator.TooltipDecorator
 * @mixes ui/Touchable.Touchable
 * @mixes spotlight/Spottable.Spottable
 * @public
 */
const IconButtonDecorator = compose(
	Pure,
	TooltipDecorator({tooltipDestinationProp: 'tooltipNode'}),
	Touchable,
	Spottable,
	Skinnable
);

/**
 * An {@link moonstone/Icon.Icon} that acts like a button.  You may specify an image or a font-based
 * icon by setting the children to either the path to the image or a string from the
 * [IconList]{@link moonstone/Icon.IconList}. `IconButton` does not have `Marquee` or `Uppercase`
 * like `Button` has, as it should not contain text.
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
