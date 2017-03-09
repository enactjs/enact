/**
 * Exports the {@link moonstone/Button.Button} and {@link moonstone/Button.ButtonBase}
 * components.  The default export is {@link moonstone/Button.Button}.
 *
 * @module moonstone/Button
 */

import factory from '@enact/core/factory';
import {forProp, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import Uppercase from '@enact/i18n/Uppercase';
import {Spottable} from '@enact/spotlight';
import Pressable from '@enact/ui/Pressable';
import React, {PropTypes} from 'react';

import {MarqueeDecorator} from '../Marquee';
import {TooltipDecorator} from '../TooltipDecorator';

import componentCss from './Button.less';

/**
 * {@link moonstone/Button.ButtonBaseFactory} is Factory wrapper around {@link moonstone/Button.ButtonBase}
 * that allows overriding certain classes at design time. The following are properties of the `css`
 * member of the argument to the factory.
 *
 * Usage:
 * ```
 * import css from './CustomButton.less';
 * import {ButtonFactory} from '@enact/moonstone/Button';
 * const Button = ButtonFactory({
 *     css: {
 *         bg: css.bg,
 *         selected: css.selected
 *     }
 * });
 * ```
 *
 * @class ButtonBaseFactory
 * @memberof moonstone/Button
 * @factory
 * @public
 */
const ButtonBaseFactory = factory({css: componentCss}, ({css}) =>

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
	kind({
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
			 * This property accepts one of the following color names, which correspond with the
			 * colored buttons on a standard remote control: `'red'`, `'green'`, `'yellow'`, `'blue'`
			 *
			 * @type {String}
			 * @public
			 */
			color: PropTypes.oneOf([null, 'red', 'green', 'yellow', 'blue']),

			/**
			 * When `true`, the [button]{@glossary button} is shown as disabled and does not
			 * generate `onClick` [events]{@glossary event}.
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
			small: false
		},

		styles: {
			css: /** @lends moonstone/Button.ButtonBaseFactory.prototype */ {
				...componentCss,
				/**
				 * Classes to apply to the background of the button, used on a child of button
				 * @type {String}
				 * @public
				 */
				bg: css.bg,

				/**
				 * Classes to apply to the selected state of the button, applied to the base element
				 * @type {String}
				 * @public
				 */
				selected: css.selected
			},
			className: 'button'
		},

		computed: {
			className: ({backgroundOpacity, color, minWidth, pressed, selected, small, styler}) => styler.append(
				{pressed, small, minWidth, selected},
				backgroundOpacity, color
			)
		},

		handlers: {
			onClick: handle(
				forProp('disabled', false),
				forward('onClick')
			)
		},

		render: ({children, disabled, ...rest}) => {
			// Do not add the ARIA attribute if the selected prop is omitted to avoid the potentially
			// confusing readout for the common case of a standalone Button or IconButton.
			if ('selected' in rest) {
				rest['aria-pressed'] = rest.selected;
			}

			delete rest.backgroundOpacity;
			delete rest.color;
			delete rest.minWidth;
			delete rest.pressed;
			delete rest.selected;
			delete rest.small;

			return (
				<div role="button" {...rest} aria-disabled={disabled} disabled={disabled}>
					<div className={css.bg} />
					<div className={css.client}>{children}</div>
				</div>
			);
		}
	})
);

/**
 * {@link moonstone/Button.ButtonFactory} is Factory wrapper around {@link moonstone/Button.Button}
 * that allows overriding certain classes at design time. See {@link moonstone/Button.ButtonBaseFactory}.
 *
 * @class ButtonFactory
 * @memberof moonstone/Button
 * @factory
 * @public
 */
const ButtonFactory = factory(css => {
	const Base = ButtonBaseFactory(css);
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
	 * @mixes i18n/Uppercase.Uppercase
	 * @mixes moonstone/TooltipDecorator.TooltipDecorator
	 * @mixes spotlight.Spottable
	 * @mixes ui/Pressable.Pressable
	 * @ui
	 * @public
	 */
	return Uppercase(
		TooltipDecorator(
			MarqueeDecorator(
				{className: componentCss.marquee},
				Pressable(
					Spottable(
						{selectionAnimationDelay: 200},
						Base
					)
				)
			)
		)
	);
});

const ButtonBase = ButtonBaseFactory();
const Button = ButtonFactory();

export default Button;
export {Button, ButtonBase, ButtonBaseFactory, ButtonFactory};
