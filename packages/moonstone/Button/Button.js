/**
 * Exports the {@link moonstone/Button.Button} and {@link moonstone/Button.ButtonBase}
 * components.  The default export is {@link moonstone/Button.Button}.
 *
 * @example
 * <Button small>Click me</Button>
 *
 * @module moonstone/Button
 */

import kind from '@enact/core/kind';
import Uppercase from '@enact/i18n/Uppercase';
import Spottable from '@enact/spotlight/Spottable';
import {ButtonBase as UiButtonBase} from '@enact/ui/Button';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import Icon from '../Icon';
import {MarqueeDecorator} from '../Marquee';
import Skinnable from '../Skinnable';
import TooltipDecorator from '../TooltipDecorator';
import Touchable from '../internal/Touchable';


import componentCss from './Button.less';

/**
 * {@link moonstone/Button.ButtonBase} is a moonstone-styled button without any behavior.
 *
 * @class ButtonBase
 * @memberof moonstone/Button
 * @ui
 * @public
 */
const ButtonBase = kind({
	name: 'Button',

	propTypes: /** @lends moonstone/Button.ButtonBase.prototype */ {
		/**
		 * The background-color opacity of this button.
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
		backgroundOpacity: PropTypes.oneOf([
			'opaque',
			'translucent',
			'lightTranslucent',
			'transparent'
		]),

		/**
		 * The color of the underline beneath button's content.
		 *
		 * Accepts one of the following color names, which correspond with the colored buttons on a
		 * standard remote control: `'red'`, `'green'`, `'yellow'`, `'blue'`.
		 *
		 * @type {String}
		 * @public
		 */
		color: PropTypes.oneOf([null, 'red', 'green', 'yellow', 'blue']),

		/**
		 * Appends CSS classes to the nodes and components with {@link moonstone/Button.ButtonBase}.
		 *
		 * The following classes are supported:
		 * * `button` - The root class name
		 * * `bg` - The background node of the button
		 * * `selected` - Applied to a `selected` button
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Disables the `pressed` animation.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAnimation: PropTypes.bool
	},

	styles: {
		css: componentCss,
		publicClassNames: ['button', 'bg', 'selected']
	},

	computed: {
		className: ({backgroundOpacity, color, noAnimation, styler}) => styler.append(
			backgroundOpacity,
			color,
			{noAnimation}
		)
	},

	render: ({css, ...rest}) => {
		delete rest.backgroundOpacity;
		delete rest.color;
		delete rest.noAnimation;

		return (
			<UiButtonBase
				{...rest}
				css={css}
				iconComponent={Icon}
			/>
		);
	}
});

/**
 * {@link moonstone/Button.ButtonDecorator} adds Moonstone-specific button behaviors to a
 * [Button]{@link moonstone/Button.ButtonBase}.
 *
 * @hoc
 * @memberof moonstone/Button
 * @mixes i18n/Uppercase.Uppercase
 * @mixes moonstone/TooltipDecorator.TooltipDecorator
 * @mixes moonstone/Marquee.MarqueeDecorator
 * @mixes ui/Touchable.Touchable
 * @mixes spotlight/Spottable.Spottable
 * @public
 */
const ButtonDecorator = compose(
	Pure,
	Uppercase,
	TooltipDecorator,
	MarqueeDecorator({className: componentCss.marquee}),
	Touchable,
	Spottable,
	Skinnable
);

/**
 * {@link moonstone/Button.Button} is a Moonstone-styled button with built-in support for
 * uppercasing, tooltips, marqueed text, and Spotlight focus.
 *
 * Usage:
 * ```
 * <Button>Press me!</Button>
 * ```
 *
 * @class Button
 * @memberof moonstone/Button
 * @mixes moonstone/Button.ButtonDecorator
 * @ui
 * @public
 */
const Button = ButtonDecorator(ButtonBase);

export default Button;
export {
	Button,
	ButtonBase,
	ButtonDecorator
};
