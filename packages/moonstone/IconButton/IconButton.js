/**
* Exports the {@link moonstone/IconButton.IconButton} and {@link moonstone/IconButton.IconButtonBase}
* components.  The default export is {@link moonstone/IconButton.IconButtonBase}.
*
* @module moonstone/IconButton
*/

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
// import {diffClasses} from '@enact/ui/MigrationAid';
import React from 'react';
import {IconButtonFactory as UiIconButtonFactory} from '@enact/ui/IconButton';
import {ButtonFactory} from '../Button';
import {IconFactory} from '../Icon';

import Skinnable from '../Skinnable';

import componentCss from './IconButton.less';

/**
* {@link moonstone/IconButton.IconButtonFactory} is Factory wrapper around
* {@link moonstone/IconButton.IconButton} that allows overriding certain classes of the base
* `Button` component at design time. See {@link moonstone/Button.ButtonBaseFactory}.
*
* @class IconButtonFactory
* @memberof moonstone/IconButton
* @factory
* @public
*/
const IconButtonBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon IconButton', componentCss, css);

	const UiIconButton = UiIconButtonFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/IconButton.IconButtonFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			iconButton: css.iconButton
		}
	});
	const Button = ButtonFactory({css});
	const Icon = IconFactory({css});
	/**
	 * {@link moonstone/IconButton.IconButton} is a {@link moonstone/Icon.Icon} that acts like a button.
	 * You may specify an image or a font-based icon by setting the children to either the path to the
	 * image or a string from the [IconList]{@link moonstone/Icon.IconList}.
	 *
	 * Usage:
	 * ```
	 * <IconButton onClick={handleClick} small>
	 *     plus
	 * </IconButton>
	 * ```
	 *
	 * @class IconButton
	 * @memberof moonstone/IconButton
	 * @ui
	 * @public
	 */
	return kind({
		name: 'IconButton',

		render: (props) => {
			return (
				<UiIconButton {...props} Button={Button} Icon={Icon} />
			);
		}
	});
});

const IconButtonBase = IconButtonBaseFactory();

const IconButton = Skinnable(
	IconButtonBase
);

const IconButtonFactory = (props) => Skinnable(
	IconButtonBaseFactory(props)
);


export default IconButton;
export {
	IconButton,
	IconButtonBase,
	IconButtonFactory,
	IconButtonBaseFactory
};
