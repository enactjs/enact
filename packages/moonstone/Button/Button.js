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
import PropTypes from 'prop-types';

import Icon from '../Icon';
import {MarqueeDecorator} from '../Marquee';
import {TooltipDecorator} from '../TooltipDecorator';
import Skinnable from '../Skinnable';

import componentCss from './Button.less';

const ButtonIcon = (props) => <Icon css={componentCss} {...props} />;

const ButtonBase = kind({
	name: 'Button',

	propTypes: {
		/**
		 * The background-color opacity of this button; valid values are `'opaque'`, `'translucent'`,
		 * `'lightTranslucent'`, and `'transparent'`.
		 *
		 * @type {String}
		 * @default 'opaque'
		 * @public
		 */
		backgroundOpacity: PropTypes.oneOf(['opaque', 'translucent', 'lightTranslucent', 'transparent']),

		/**
		 * This property accepts one of the following color names, which correspond with the
		 * colored buttons on a standard remote control: `'red'`, `'green'`, `'yellow'`, `'blue'`
		 *
		 * @type {String}
		 * @public
		 */
		color: PropTypes.oneOf([null, 'red', 'green', 'yellow', 'blue']),

		/**
		 * When `true`, the button does not animate on press
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAnimation: PropTypes.bool
	},

	styles: {
		css: componentCss,
		publicClassNames: true
	},

	computed: {
		className: ({backgroundOpacity, color, noAnimation, styler}) => styler.append(backgroundOpacity, color, {noAnimation})
	},

	render: ({css, ...rest}) => {
		delete rest.backgroundOpacity;
		delete rest.color;
		delete rest.noAnimation;

		return (
			<UiButton
				{...rest}
				css={css}
				iconComponent={ButtonIcon}
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
