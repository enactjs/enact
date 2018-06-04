/**
 * Provides Moonstone-themed button components and behaviors.
 *
 * @example
 * <Button small>Hello Enact!</Button>
 *
 * @module moonstone/Button
 * @exports Button
 * @exports ButtonBase
 * @exports ButtonDecorator
 */

import kind from '@enact/core/kind';
import Uppercase from '@enact/i18n/Uppercase';
import Spottable from '@enact/spotlight/Spottable';
import {ButtonBase as UiButtonBase, ButtonDecorator as UiButtonDecorator} from '@enact/ui/Button';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import Icon from '../Icon';
import {MarqueeDecorator} from '../Marquee';
import Skinnable from '../Skinnable';

import componentCss from './Button.less';

/**
 * A moonstone-styled button without any behavior.
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
		 * * `'translucent'`,
		 * * `'lightTranslucent'`, and
		 * * `'transparent'`.
		 *
		 * @type {String}
		 * @public
		 */
		backgroundOpacity: PropTypes.oneOf(['translucent', 'lightTranslucent', 'transparent']),

		/**
		 * The color of the underline beneath button's content. Used for `IconButton`.
		 *
		 * Accepts one of the following color names, which correspond with the colored buttons on a
		 * standard remote control: `'red'`, `'green'`, `'yellow'`, `'blue'`.
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
		 * * `button` - The root class name
		 * * `bg` - The background node of the button
		 * * `selected` - Applied to a `selected` button
		 * * `small` - Applied to a `small` button
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object
	},

	styles: {
		css: componentCss,
		publicClassNames: ['button', 'bg', 'selected', 'small']
	},

	computed: {
		className: ({backgroundOpacity, color, styler}) => styler.append(
			backgroundOpacity,
			color
		)
	},

	render: ({css, ...rest}) => {
		delete rest.backgroundOpacity;
		delete rest.color;

		return (
			<UiButtonBase
				data-webos-voice-intent="Select"
				{...rest}
				css={css}
				iconComponent={Icon}
			/>
		);
	}
});

/**
 * Moonstone-specific button behaviors to apply to [Button]{@link moonstone/Button.ButtonBase}.
 *
 * @hoc
 * @memberof moonstone/Button
 * @mixes i18n/Uppercase.Uppercase
 * @mixes moonstone/Marquee.MarqueeDecorator
 * @mixes ui/Button.ButtonDecorator
 * @mixes spotlight/Spottable.Spottable
 * @mixes ui/Skinnable.Skinnable
 * @public
 */
const ButtonDecorator = compose(
	Pure,
	Uppercase,
	MarqueeDecorator({className: componentCss.marquee}),
	UiButtonDecorator,
	Spottable,
	Skinnable
);

/**
 * A Moonstone-styled button with built-in support for uppercasing, marqueed text, and
 * Spotlight focus.
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
