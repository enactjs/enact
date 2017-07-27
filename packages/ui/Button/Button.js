/**
 * Exports the {@link ui/Button.Button} and {@link ui/Button.ButtonBase}
 * components.  The default export is {@link ui/Button.Button}.
 *
 * @example
 * <Button small>Click me</Button>
 *
 * @module ui/Button
 */

import factory from '@enact/core/factory';
import {forProp, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';
import Pressable from '@enact/ui/Pressable';
import React from 'react';
import PropTypes from 'prop-types';

import Icon from '@enact/moonstone/Icon';
import {MarqueeDecorator} from '@enact/moonstone/Marquee';
import {TooltipDecorator} from '@enact/moonstone/TooltipDecorator';

import componentCss from './Button.less';

/**
 * {@link ui/Button.ButtonBaseFactory} is Factory wrapper around {@link ui/Button.ButtonBase}
 * that allows overriding certain classes at design time. The following are properties of the `css`
 * member of the argument to the factory.
 *
 * Usage:
 * ```
 * import css from './CustomButton.less';
 * import {ButtonFactory} from '@enact/ui/Button';
 * const Button = ButtonFactory({
 *     css: {
 *         bg: css.bg,
 *         selected: css.selected
 *     }
 * });
 * ```
 *
 * @class ButtonBaseFactory
 * @memberof ui/Button
 * @factory
 * @ui
 * @public
 */
const ButtonBaseFactory = factory({css: componentCss}, ({css}) => {
	/**
	 * {@link ui/Button.ButtonBase} is a stateless Button with ui styling
	 * applied. In most circumstances, you will want to use the Pressable and Spottable version:
	 * {@link ui/Button.Button}
	 *
	 * @class ButtonBase
	 * @memberof ui/Button
	 * @ui
	 * @public
	 */
	return kind({
		name: 'Button',

		propTypes: /** @lends ui/Button.ButtonBase.prototype */ {
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
			 * Transformation to apply to the text of the Button. By default, text is transformed
			 * to uppercase.
			 *
			 * @see i18n/Uppercase#casing
			 * @type {String}
			 * @default 'upper'
			 * @public
			 */
			casing: PropTypes.oneOf(['upper', 'preserve', 'word', 'sentence']),

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
			 * Include an [icon]{@link ui/Icon.Icon} in your [button]{@link ui/Button.Button}.
			 * The icon will be displayed before the natural reading order of the text, regardless
			 * of locale. Any string that is valid for the `Icon` component is valid here. `icon` is
			 * outside the marqueeable content so it will not scroll along with the text content of
			 * your button. This also supports a custom icon, in the form of a DOM node or a
			 * Component, with the caveat that if you supply a custom icon, you are responsible for
			 * sizing and locale positioning of the custom component.
			 *
			 * @type {Node}
			 * @public
			 */
			icon: PropTypes.node,

			/**
			 * A boolean parameter affecting the minimum width of the button. When `true`,
			 * the minimum width will be set to 180px (or 130px if [small]{@link ui/Button.Button#small}
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
			css,
			className: 'button'
		},

		computed: {
			className: ({backgroundOpacity, color, minWidth, pressed, selected, small, styler}) => styler.append(
				{pressed, small, minWidth, selected},
				backgroundOpacity, color
			),
			icon: ({icon, small}) =>
				(typeof icon === 'string' ? <Icon className={css.icon} small={small}>{icon}</Icon> : icon)
		},

		handlers: {
			onClick: handle(
				forProp('disabled', false),
				forward('onClick')
			)
		},

		render: ({children, disabled, icon, ...rest}) => {
			delete rest.backgroundOpacity;
			delete rest.color;
			delete rest.minWidth;
			delete rest.pressed;
			delete rest.selected;
			delete rest.small;

			return (
				<div role="button" {...rest} aria-disabled={disabled} disabled={disabled}>
					<div className={css.bg} />
					<div className={css.client}>{icon}{children}</div>
				</div>
			);
		}
	});
});

/**
 * {@link ui/Button.ButtonFactory} is Factory wrapper around {@link ui/Button.Button}
 * that allows overriding certain classes at design time. See {@link ui/Button.ButtonBaseFactory}.
 *
 * @class ButtonFactory
 * @memberof ui/Button
 * @factory
 * @public
 */
const ButtonFactory = factory(props => {
	const Base = ButtonBaseFactory(props);
	/**
	 * {@link ui/Button.Button} is a Button with ui styling, Spottable and
	 * Pressable applied.  If the Button's child component is text, it will be uppercased unless
	 * `casing` is set.
	 *
	 * Usage:
	 * ```
	 * <Button>Press me!</Button>
	 * ```
	 *
	 * @class Button
	 * @memberof ui/Button
	 * @mixes i18n/Uppercase.Uppercase
	 * @mixes moonstone/TooltipDecorator.TooltipDecorator
	 * @mixes moonstone/Marquee.MarqueeDecorator
	 * @mixes ui/Pressable.Pressable
	 * @mixes spotlight/Spottable.Spottable
	 * @ui
	 * @public
	 */
	return TooltipDecorator(
		MarqueeDecorator(
			{className: componentCss.marquee},
			Pressable(
				Spottable(
					Base
				)
			)
		)
	);
});

const ButtonBase = ButtonBaseFactory();
const Button = ButtonFactory();

export default Button;
export {
	Button,
	ButtonBase,
	ButtonFactory,
	ButtonBaseFactory
};
