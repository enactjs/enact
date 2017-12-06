/**
 * Exports the {@link moonstone/Button.Button} and {@link moonstone/Button.ButtonBase}
 * components.  The default export is {@link moonstone/Button.Button}.
 *
 * @example
 * <Button small>Click me</Button>
 *
 * @module moonstone/Button
 */

import compose from 'ramda/src/compose';
import kind from '@enact/core/kind';
import Uppercase from '@enact/i18n/Uppercase';
import Spottable from '@enact/spotlight/Spottable';
import Pure from '@enact/ui/internal/Pure';
import UiButton from '@enact/ui/Button';
import React from 'react';

import Icon from '../Icon';
import {MarqueeDecorator} from '../Marquee';
import {TooltipDecorator} from '../TooltipDecorator';
import Skinnable from '../Skinnable';

import componentCss from './Button.less';

const ButtonBase = kind({
	name: 'Button',
	styles: {
		css: componentCss,
		publicClassNames: true
	},

	render: (props) => {
		return (
			<UiButton
				{...props}
				css={props.css}
				iconComponent={Icon}
			/>
		);
	}
});

/**
 * {@link moonstone/Button.Button} is a Button with Moonstone styling, Spottable and
 * Touchable applied.  If the Button's child component is text, it will be uppercased unless
 * `casing` is set.
 *
 * Usage:
 * ```
 * <Button>Press me!</Button>
 * ```
 *
 * @class Button
 * @memberof moonstone/Button
 * @mixes i18n/Uppercase.Uppercase
 * @mixes moonstone/TooltipDecorator.TooltipDecorator
 * @mixes moonstone/Marquee.MarqueeDecorator
 * @mixes ui/Touchable.Touchable
 * @mixes spotlight/Spottable.Spottable
 * @ui
 * @public
 */
const ButtonDecorator = compose(
	Pure,
	Uppercase,
	TooltipDecorator,
	MarqueeDecorator({className: componentCss.marquee}),
	Spottable,
	Skinnable
);

const Button = ButtonDecorator(ButtonBase);

export default Button;
export {
	Button,
	ButtonBase,
	ButtonDecorator
};
