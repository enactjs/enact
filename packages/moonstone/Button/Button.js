/**
 * Exports the {@link moonstone/Button.Button} and {@link moonstone/Button.ButtonBase}
 * components.  The default export is {@link moonstone/Button.Button}.
 *
 * @module moonstone/Button
 */

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
// import {diffClasses} from '@enact/ui/MigrationAid';
import {ButtonFactory as UiButtonFactory} from '@enact/ui/Button';
import Skinnable from '@enact/moonstone/Skinnable';
import Uppercase from '@enact/i18n/Uppercase';
import React from 'react';
import PropTypes from 'prop-types';

import componentCss from './Button.less';

/**
 * {@link moonstone/Button.ButtonFactory} is Factory wrapper around {@link moonstone/Button.Button}
 * that allows overriding certain classes at design time. See {@link moonstone/Button.ButtonBaseFactory}.
 *
 * @class ButtonFactory
 * @memberof moonstone/Button
 * @factory
 * @public
 */
const ButtonBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon Button', componentCss, css);

	const MoonstoneButton = UiButtonFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/Button.ButtonFactory.prototype */ {
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
		propTypes: /** @lends moonstone/Button.ButtonFactory.prototype */ {
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

		render: (props) => (
			<MoonstoneButton {...props} />
		)
	});
});

const ButtonBase = ButtonBaseFactory();

const Button = Uppercase(
	Skinnable(
		ButtonBase
	)
);

const ButtonFactory = (props) => Uppercase(
	Skinnable(
		ButtonBaseFactory(props)
	)
);

export default Button;
export {
	Button,
	ButtonBase,
	ButtonFactory,
	ButtonBaseFactory
};
