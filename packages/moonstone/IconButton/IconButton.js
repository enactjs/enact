/**
 * Provides a special kind of {@link moonstone/IconButton} which accepts the same formats from
 * {@link moonstone/Icon} but renders the Icon in a pressable {@link moonstone/IconButton}.
 *
 * @example
 * <Button>gear</IconButton>
 *
 * @module moonstone/IconButton
 * @exports IconButton
 * @exports IconButtonBase
 * @exports IconButtonBaseFactory
 * @exports IconButtonFactory
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
 * A factory for customizing the visual style of [IconButtonBase]{@link moonstone/IconButton.IconButtonBase}.
 *
 * @class IconButtonBaseFactory
 * @memberof moonstone/IconButton
 * @factory
 * @public
 */
const IconButtonBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon IconButton', componentCss, css);

	const UiIconButton = UiIconButtonFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/IconButton.IconButtonBaseFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			iconButton: css.iconButton
		}
	});
	const Button = ButtonFactory({css});
	const Icon = IconFactory({css});
	/**
	 * {@link moonstone/IconButton.IconButton} is a {@link moonstone/Icon.Icon} that acts like a Iconbutton.
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

/**
 * A stateless [IconButton]{@link moonstone/IconButton.IconButton}, with no HOCs applied.
 *
 * @class IconButtonBase
 * @extends ui/IconButton.IconButtonBase
 * @memberof moonstone/IconButton
 * @ui
 * @public
 */
const IconButtonBase = IconButtonBaseFactory();

/**
 * A factory for customizing the visual style of [IconButton]{@link moonstone/IconButton.IconButton}.
 * @see {@link moonstone/IconButton.IconButtonBaseFactory}.
 *
 * @class IconButtonFactory
 * @memberof moonstone/IconButton
 * @factory
 * @public
 */
const IconButtonFactory = (props) => Skinnable(
	IconButtonBaseFactory(props)
);

/**
 * A ready-to-use IconButton, with HOCs applied.
 *
 * @class IconButton
 * @memberof moonstone/IconButton
 * @extends moonstone/IconButton.IconButtonBase
 * @mixes i18n/Uppercase
 * @mixes moonstone/TooltipDecorator
 * @mixes ui/Pressable
 * @mixes spotlight/Spottable
 * @mixes moonstone/Skinnable
 * @ui
 * @public
 */
const IconButton = IconButtonFactory();

export default IconButton;
export {
	IconButton,
	IconButtonBase,
	IconButtonFactory,
	IconButtonBaseFactory
};
