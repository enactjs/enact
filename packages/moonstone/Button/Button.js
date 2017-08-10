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
// import {diffClasses} from '@enact/ui/MigrationAid';
import Uppercase from '@enact/i18n/Uppercase';
import Spottable from '@enact/spotlight/Spottable';
import Pressable from '@enact/ui/Pressable';
import {ButtonBaseFactory as UiButtonBaseFactory} from '@enact/ui/Button';
import React from 'react';
import PropTypes from 'prop-types';

import {MarqueeDecorator} from '../Marquee';
import {TooltipDecorator} from '../TooltipDecorator';

import Icon from '../Icon';
import Skinnable from '../Skinnable';

import componentCss from './Button.less';

/**
 * A factory for customizing the visual style of [ButtonBase]{@link moonstone/Button.ButtonBase}.
 *
 * @class ButtonBaseFactory
 * @memberof moonstone/Button
 * @factory
 * @public
 */
const ButtonBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon Button', componentCss, css);

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
			 * Transformation to apply to the text of the Button. By default, text is transformed
			 * to uppercase.
			 *
			 * @see i18n/Uppercase#casing
			 * @type {String}
			 * @default 'upper'
			 * @public
			 */
			casing: PropTypes.oneOf(['upper', 'preserve', 'word', 'sentence'])
		},

		defaultProps: {
			casing: 'upper'
		},

		render: (props) => (
			<MoonstoneButtonBase {...props} Icon={Icon} />
		)
	});
});

/**
 * A stateless [Button]{@link moonstone/Button.Button}, with no HOCs applied.
 *
 * @class ButtonBase
 * @extends ui/ButtonBase
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
const ButtonFactory = (props) => Uppercase(
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

/**
 * A ready-to-use {@link ui/Button}, with HOCs applied.
 *
 * @class Button
 * @memberof moonstone/Button
 * @extends moonstone/ButtonBase
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
