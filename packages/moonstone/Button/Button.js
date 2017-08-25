/**
 * Provides the usual complement of button-like features: pressing fires callbacks, visual state
 * changes for actuation, marqueeing of text that's too long and some basic customizability.
 *
 * @example
 * <Button small>Click me</Button>
 *
 * @module moonstone/Button
 * @exports Button
 * @exports ButtonBase
 * @exports ButtonBaseFactory
 * @exports ButtonFactory
 */

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import Uppercase from '@enact/i18n/Uppercase';
import Spottable from '@enact/spotlight/Spottable';
import Pressable from '@enact/ui/Pressable';
import {ButtonBaseFactory as UiButtonBaseFactory} from '@enact/ui/ButtonFactory';
import React from 'react';
import PropTypes from 'prop-types';

import {MarqueeDecorator} from '../Marquee';
import {TooltipDecorator} from '../TooltipDecorator';

import Icon from '../Icon';
import Skinnable from '../Skinnable';

import componentCss from './Button.less';

/**
 * A factory for customizing the visual style of [ButtonBase]{@link moonstone/Button.ButtonBase}.
 * The following are CSS classes that may be overridden.
 *
 * Using ButtonFactory to create a custom styled component:
 * ```
 * import css from './CustomButton.less';
 * import {ButtonFactory} from '@enact/moonstone/Button';
 * const MyButton = ButtonFactory({
 *     css: {
 *         bg: css.bg,
 *         selected: css.selected
 *     }
 * });
 *
 * // New component usable like any other:
 * <MyButton>Customized!</MyButton>
 * ```
 *
 * @class ButtonBaseFactory
 * @extends ui/ButtonFactory.ButtonBaseFactory
 * @memberof moonstone/Button
 * @factory
 * @public
 */
const ButtonBaseFactory = factory({css: componentCss}, ({css}) => {
	const MoonstoneButtonBase = UiButtonBaseFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/Button.ButtonBaseFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			button: css.button,

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
		}
	});

	return kind({
		name: 'MoonstoneButton',

		propTypes: /** @lends moonstone/Button.ButtonBase.prototype */ {
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
			color: PropTypes.oneOf([null, 'red', 'green', 'yellow', 'blue'])
		},

		defaultProps: {
			backgroundOpacity: 'opaque'
		},

		styles: {
			css,
			className: 'button'
		},

		computed: {
			className: ({backgroundOpacity, color, styler}) => styler.append(
				backgroundOpacity, color
			)
		},

		render: (props) => {
			delete props.backgroundOpacity;
			delete props.color;

			return <MoonstoneButtonBase {...props} Icon={Icon} />;
		}
	});
});

/**
 * A stateless [ButtonBaseFactory]{@link moonstone/Button.ButtonBaseFactory}, with no HOCs applied.
 *
 * @class ButtonBase
 * @extends moonstone/Button.ButtonBaseFactory
 * @memberof moonstone/Button
 * @ui
 * @public
 */
const ButtonBase = ButtonBaseFactory();

/**
 * A factory for customizing the visual style of [Button]{@link moonstone/Button.Button}.
 * @see {@link moonstone/Button.ButtonBaseFactory}.
 *
 * @class ButtonFactory
 * @memberof moonstone/Button
 * @factory
 * @public
 */
const ButtonFactory = (props) => {
	const NewButton = Uppercase(
		TooltipDecorator(
			MarqueeDecorator(
				{className: componentCss.marquee},
				Pressable(
					Spottable(
						Skinnable(
							ButtonBaseFactory(props)
						)
					)
				)
			)
		)
	);

	NewButton.propTypes = /** @lends moonstone/Button.Button.prototype */ {
		/**
		 * Transformation to apply to the text of the Button. By default, text is transformed
		 * to uppercase.
		 *
		 * @see i18n/Uppercase#casing
		 * @type {String}
		 * @default 'upper'
		 * @public
		 */
		casing: PropTypes.oneOf(['upper', 'preserve', 'word', 'sentence'])
	};

	NewButton.defaultProps = {
		casing: 'upper'
	};
	return NewButton;
};

/**
 * A ready-to-use component based on [ButtonFactory]{@link moonstone/Button.ButtonFactory},
 * with HOCs applied.
 *
 * @class Button
 * @memberof moonstone/Button
 * @extends moonstone/Button.ButtonBase
 * @mixes i18n/Uppercase
 * @mixes moonstone/TooltipDecorator
 * @mixes ui/Pressable
 * @mixes spotlight/Spottable
 * @mixes moonstone/Skinnable
 * @ui
 * @public
 */
const Button = ButtonFactory();

export default Button;
export {
	Button,
	ButtonBase,
	ButtonFactory,
	ButtonBaseFactory
};
