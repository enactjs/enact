/**
 * Moonstone styled button components and behaviors.
 *
 * @example
 * <Button small>Hello Enact!</Button>
 *
 * @module moonstone/Button
 * @exports Button
 * @exports ButtonBase
 * @exports ButtonDecorator
 */

import deprecate from '@enact/core/internal/deprecate';
import {forProp, forward, handle} from '@enact/core/handle';
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

// Called when `tooltip` props are used
const deprecation = deprecate(() => {}, {
	message: 'Tooltip props require the button to be wrapped by TooltipDecorator',
	since: '2.0.0'
});

/**
 * A button component.
 *
 * This component is most often not used directly but may be composed within another component as it
 * is within [Button]{@link moonstone/Button.Button}.
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
		 * The background opacity of this button.
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
		 * The color of the underline beneath button's content.
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

	handlers: {
		onClick: handle(
			forProp('disabled', false),
			forward('onClick')
		)
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

		if (__DEV__ && Object.keys(rest).some(s => s.indexOf('tooltip') === 0)) {
			deprecation();
		}

		return UiButtonBase.inline({
			'data-webos-voice-intent': 'Select',
			...rest,
			css: css,
			iconComponent: Icon
		});
	}
});

/**
 * Applies Moonstone specific behaviors to [Button]{@link moonstone/Button.ButtonBase} components.
 *
 * @hoc
 * @memberof moonstone/Button
 * @extends moonstone/Button.ButtonBase
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
 * A button component, ready to use in Moonstone applications.
 *
 * Usage:
 * ```
 * <Button
 * 	backgroundOpacity="translucent"
 * 	color="blue"
 * >
 * 	Press me!
 * </Button>
 * ```
 *
 * @class Button
 * @memberof moonstone/Button
 * @extends moonstone/Button.ButtonBase
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
