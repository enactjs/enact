/**
 * Exports the {@link moonstone/Button.Button} and {@link moonstone/Button.ButtonBase}
 * components.  The default export is {@link moonstone/Button.Button}.
 *
 * @module moonstone/Button
 */

// import React from 'react';
// import kind from '@enact/core/kind';
import factory from '@enact/core/factory';
import {ButtonFactory as UiButtonFactory} from '@enact/ui/Button';

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
// const ButtonFactoryBASIC = factory(({css}) => UiButtonFactory({css: /** @lends moonstone/Button.ButtonBaseFactory.prototype */ {
// 	...componentCss,
// 	/**
// 	 * Classes to apply to the background of the button, used on a child of button
// 	 * @type {String}
// 	 * @public
// 	 */
// 	// bg: css.bg,
// 	// client: css.client,

// 	/**
// 	 * Classes to apply to the selected state of the button, applied to the base element
// 	 * @type {String}
// 	 * @public
// 	 */
// 	selected: css.selected
// }}));

const ButtonFactory = factory(({css}) => {

	if (css.bg) console.log('Moon css.bg:', css.bg);

	/* Replace classes in this step */
	const Base = UiButtonFactory({

		css: /** @lends moonstone/Button.ButtonBaseFactory.prototype */ {
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
		}});

	return Base;
});

const Button = ButtonFactory({css: componentCss});

export default Button;
export {Button, ButtonFactory};
