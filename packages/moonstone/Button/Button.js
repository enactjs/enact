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
import UiButton from '@enact/ui/Button';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import Icon from '../Icon';
import {MarqueeDecorator} from '../Marquee';
import Skinnable from '../Skinnable';
import {TooltipDecorator} from '../TooltipDecorator';

import componentCss from './Button.less';

const ButtonBase = kind({
	name: 'Button',

	propTypes: {
		/**
		 * The background-color opacity of this button. Valid values are
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
		 * This property accepts one of the following color names, which correspond with the
		 * colored buttons on a standard remote control: `'red'`, `'green'`, `'yellow'`, `'blue'`
		 *
		 * @type {String}
		 * @public
		 */
		color: PropTypes.oneOf([null, 'red', 'green', 'yellow', 'blue']),

		/**
		 * Allows override of classes `'bg'` and `'selected'`.
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

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
		publicClassNames: ['bg', 'selected']
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
			<UiButton
				{...rest}
				css={css}
				iconComponent={Icon}
			/>
		);
	}
});

/**
 * {@link moonstone/Button.ButtonDecorator} adds moonstone-related button behaviors to a
 * {@link moonstone/Button.ButtonBase}.
 *
 * @hoc
 * @memberof moonstone/Button
 * @mixes i18n/Uppercase.Uppercase
 * @mixes moonstone/TooltipDecorator.TooltipDecorator
 * @mixes moonstone/Marquee.MarqueeDecorator
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

/**
 * {@link moonstone/Button.Button} is a Button with Moonstone styling, Spottable and
 * Touchable applied.
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
