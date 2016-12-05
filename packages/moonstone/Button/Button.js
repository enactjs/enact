/**
 * Exports the {@link moonstone/Button.Button} and {@link moonstone/Button.ButtonBase}
 * components.  The default export is {@link moonstone/Button.Button}.
 *
 * @module moonstone/Button
 */

import kind from '@enact/core/kind';
import Uppercase from '@enact/i18n/Uppercase';
import {Spottable} from '@enact/spotlight';
import Pressable from '@enact/ui/Pressable';
import React, {PropTypes} from 'react';

import {MarqueeDecorator} from '../Marquee';

import css from './Button.less';

/**
 * {@link moonstone/Button.ButtonBase} is a stateless Button with Moonstone styling
 * applied. In most circumstances, you will want to use the Pressable and Spottable version:
 * {@link moonstone/Button.Button}
 *
 * @class ButtonBase
 * @memberof moonstone/Button
 * @ui
 * @public
 */
const ButtonBase = kind({
	name: 'Button',

	propTypes: /** @lends moonstone/Button.ButtonBase.prototype */ {
		children: PropTypes.node.isRequired,

		/**
		 * The background-color opacity of this button; valid values are `'opaque'`, `'translucent'`,
		 * and `'transparent'`.
		 *
		 * @type {String}
		 * @default 'opaque'
		 * @public
		 */
		backgroundOpacity: PropTypes.oneOf(['opaque', 'translucent', 'transparent']),

		/**
		 * When `true`, the [button]{@glossary button} is shown as disabled and does not
		 * generate tap [events]{@glossary event}.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * A boolean parameter affecting the minimum width of the button. When `true`,
		 * the minimum width will be set to 180px (or 130px if [small]{@link moonstone/Button.Button#small}
		 * is `true`). If `false`, the minimum width will be set to the current value of
		 * `@moon-button-height` (thus forcing the button to be no smaller than a circle with
		 * diameter `@moon-button-height`).
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		minWidth: PropTypes.bool,

		/**
		 * When `true`, a pressed visual effect is applied to the button
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		pressed: PropTypes.bool,

		/**
		 * When `true`, a selected visual effect is applied to the button
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * A boolean parameter affecting the size of the button. If `true`, the
		 * button's diameter will be set to 60px. However, the button's tap target
		 * will still have a diameter of 78px, with an invisible DOM element
		 * wrapping the small button to provide the larger tap zone.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		small: PropTypes.bool
	},

	defaultProps: {
		backgroundOpacity: 'opaque',
		disabled: false,
		minWidth: true,
		pressed: false,
		selected: false,
		small: false
	},

	styles: {
		css,
		className: 'button'
	},

	computed: {
		className: ({backgroundOpacity, minWidth, pressed, selected, small, styler}) => styler.append(
			{pressed, small, minWidth, selected},
			backgroundOpacity
		)
	},

	render: ({children, ...rest}) => {
		delete rest.backgroundOpacity;
		delete rest.minWidth;
		delete rest.pressed;
		delete rest.selected;
		delete rest.small;

		return (
			<button {...rest}>
				<div className={css.bg} />
				<span className={css.client}>{children}</span>
			</button>
		);
	}
});

/**
 * {@link moonstone/Button.Button} is a Button with Moonstone styling, Spottable and
 * Pressable applied.  If the Button's child component is text, it will be uppercased unless
 * `preserveCase` is set.
 *
 * Usage:
 * ```
 * <Button>Press me!</Button>
 * ```
 *
 * @class Button
 * @memberof moonstone/Button
 * @see i18n/Uppercase
 * @mixes spotlight/Spottable
 * @mixes ui/Pressable
 * @ui
 * @public
 */
const Button = Uppercase(
	MarqueeDecorator(
		{className: css.marquee},
		Pressable(
			Spottable(
				ButtonBase
			)
		)
	)
);

export default Button;
export {Button, ButtonBase};
