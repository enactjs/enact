/**
 * Exports the {@link ui/ButtonFactory.ButtonFactory} and {@link ui/ButtonFactory.ButtonBaseFactory}
 * components. The default export is {@link ui/ButtonFactory.ButtonFactory}.
 *
 * @module ui/ButtonFactory
 * @exports ButtonFactory
 * @exports ButtonBaseFactory
 */

import factory from '@enact/core/factory';
import {forProp, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';
import React from 'react';
import PropTypes from 'prop-types';

import {IconFactory} from '../Icon';
import {MarqueeDecorator} from '../Marquee';
import Pressable from '../Pressable';
import {TooltipDecorator} from '../TooltipDecorator';

import componentCss from './ButtonFactory.less';

/**
 * The Base Factory generates the most basic form of the component. In most circumstances, you
 * will want to use the standard factory component which has already been extended with interactive
 * features like focus and state management, etc.
 * The Factory allows its consumer to overriding certain classes at design time.
 * The following are properties of the `css` member of the argument to the factory.
 *
 * Using Factory to create a custom styled component:
 * ```
 * import css from './CustomButton.less';
 * import ButtonFactory from '@enact/ui/ButtonFactory';
 * const Button = ButtonFactory({
 *     css: {
 *         bg: css.bg,
 *         selected: css.selected
 *     }
 * });
 * ```
 *
 * @class ButtonBaseFactory
 * @memberof ui/ButtonFactory
 * @factory
 * @ui
 * @public
 */
const ButtonBaseFactory = factory({css: componentCss}, ({css}) => {
	const CustomIcon = IconFactory({css});

	return kind({
		name: 'Button',

		propTypes: /** @lends ui/ButtonFactory.ButtonBaseFactory.prototype */ {
			children: PropTypes.node.isRequired,

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
			 * Include an [icon]{@link ui/Icon.Icon} in your [button]{@link ui/ButtonFactory.ButtonFactory}.
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
			 * The Icon component to use in this Button.
			 *
			 * @type {Component}
			 * @default {@link ui/Icon}
			 * @public
			 */
			Icon: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

			/**
			 * A boolean parameter affecting the minimum width of the button. When `true`, the
			 * Button will not be smaller than the minimum width defined by the theme.
			 * Having a minimum width allows features like Marquee to take effect, text to be
			 * centered, and the button not unintentionally becoming a circle shape when the intent
			 * was for a "pill" or rectangle shape.
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
			 * Typically components are designed at a single specific size. Some UX scenarios
			 * require a denser set of information or controls be on the screen.
			 * A `small` version of this Button may be appropriate for information-dense layouts.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			small: PropTypes.bool
		},

		defaultProps: {
			disabled: false,
			Icon: CustomIcon,
			minWidth: true,
			pressed: false,
			small: false
		},

		styles: {
			css,
			className: 'button'
		},

		computed: {
			className: ({minWidth, pressed, selected, small, styler}) => styler.append(
				{pressed, small, minWidth, selected}
			),
			icon: ({icon, Icon, small}) =>
				(typeof icon === 'string' ? <Icon className={css.icon} small={small}>{icon}</Icon> : icon)
		},

		handlers: {
			onClick: handle(
				forProp('disabled', false),
				forward('onClick')
			)
		},

		render: ({children, disabled, icon, ...rest}) => {
			delete rest.Icon;
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
 * A full-featured component factory with minimum-to-function styling applied, ready to be styled
 * and used by a theme. The classes from [ButtonBaseFactory]{@link ui/ButtonFactory.ButtonBaseFactory}
 * are also available here.
 *
 * Usage:
 * ```
 * <Button>Press me!</Button>
 * ```
 *
 * @class ButtonFactory
 * @memberof ui/ButtonFactory
 * @mixes i18n/Uppercase.Uppercase
 * @mixes ui/TooltipDecorator.TooltipDecorator
 * @mixes ui/Marquee.MarqueeDecorator
 * @mixes ui/Pressable.Pressable
 * @mixes spotlight/Spottable.Spottable
 * @factory
 * @ui
 * @public
 */
const ButtonFactory = factory(props => {
	const Base = ButtonBaseFactory(props);
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

export default ButtonFactory;
export {
	ButtonFactory,
	ButtonBaseFactory
};
