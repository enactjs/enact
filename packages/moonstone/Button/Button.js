/**
 * Exports the {@link moonstone/Button.Button} and {@link moonstone/Button.ButtonBase}
 * components.  The default export is {@link moonstone/Button.Button}.
 *
 * @module moonstone/Button
 */

import factory from '@enact/core/factory';
import {ButtonFactory as UiButtonFactory} from '@enact/ui/Button';
import Uppercase from '@enact/i18n/Uppercase';

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
const ButtonBaseFactory = factory({css: componentCss}, ({css}) => UiButtonFactory({
	/* Replace classes in this step */
	css: /** @lends moonstone/Button.ButtonFactory.prototype */ {
		...componentCss,
		/**
		 * Classes to apply to the background of the button, used on a child of button
		 * @type {String}
		 * @public
		 */
		bg: css.bg,
		// client: css.client,

		/**
		 * Classes to apply to the selected state of the button, applied to the base element
		 * @type {String}
		 * @public
		 */
		selected: css.selected
	}
}));

const ButtonBase = ButtonBaseFactory();

const Button = Uppercase(
	ButtonBase
);

const ButtonFactory = (props) => Uppercase(
	ButtonBaseFactory(props)
);

export default Button;
export {
	Button,
	// ButtonBase,
	ButtonFactory,
	ButtonBaseFactory
};
