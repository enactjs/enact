/**
 * Provides a special kind of {@link moonstone/IconButton} which accepts the same formats from
 * {@link moonstone/Icon} but renders the Icon in a pressable {@link moonstone/IconButton}.
 *
 * @example
 * <IconButton>gear</IconButton>
 *
 * @module moonstone/IconButton
 * @exports IconButton
 * @exports IconButtonBaseFactory
 * @exports IconButtonDecorator
 * @exports IconButtonFactory
 */

import compose from 'ramda/src/compose';
import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';
import React from 'react';
import UiIconButtonFactory from '@enact/ui/IconButtonFactory';

import {ButtonBaseFactory} from '../Button';
import {IconFactory} from '../Icon';
import {TooltipDecorator} from '../TooltipDecorator';
import Skinnable from '../Skinnable';
import Touchable from '../internal/Touchable';

import componentCss from './IconButton.less';

/**
 * A factory for customizing the visual style of [IconButton]{@link moonstone/IconButton.IconButton}.
 *
 * @class IconButtonBaseFactory
 * @memberof moonstone/IconButton
 * @factory
 * @public
 */
const IconButtonBaseFactory = factory({css: componentCss}, (config) => {
	const {css} = config;

	const UiButton = ButtonBaseFactory(config);
	const UiIcon = IconFactory(config);
	const UiIconButton = UiIconButtonFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/IconButton.IconButtonBaseFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			iconButton: css.iconButton
		}
	});

	/**
	 * {@link moonstone/IconButton.IconButton} is an [Icon]{@link moonstone/Icon.Icon} that acts
	 * like a button.  You may specify an image or a font-based icon by setting the children to
	 * either the path to the image or a string from the [IconList]{@link moonstone/Icon.IconList}.
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
				<UiIconButton {...props} Button={UiButton} Icon={UiIcon} />
			);
		}
	});
});

/**
 * A pre-configured Higher-Order Component (HOC) which adds `IconButton` behavior to a component.
 *
 * @class IconButtonDecorator
 * @memberof moonstone/IconButton
 * @hoc
 * @public
 */
const IconButtonDecorator = compose(
	TooltipDecorator({tooltipDestinationProp: 'tooltipNode'}),
	Touchable,
	Spottable,
	Skinnable
);

/**
 * A factory for customizing the visual style of [IconButton]{@link moonstone/IconButton.IconButton}.
 * @see {@link moonstone/IconButton.IconButtonBaseFactory}.
 *
 * @class IconButtonFactory
 * @memberof moonstone/IconButton
 * @factory
 * @public
 */
const IconButtonFactory = compose(IconButtonDecorator, IconButtonBaseFactory);

/**
 * A ready-to-use IconButton, with HOCs applied.
 *
 * @class IconButton
 * @memberof moonstone/IconButton
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
	IconButtonDecorator,
	IconButtonBaseFactory,
	IconButtonFactory
};
