/**
 * An [Icon]{@link ui/Icon.Icon} that acts like a [Button]{@link ui/Button.Button}.
 * You may specify an image or a font-based icon by setting the `children` to either the path
 * to the image or a string from an [iconList]{@link ui/Icon.IconBase.iconList}. This is unstyled,
 * but can easily be extended and customized by a theme or application.
 *
 * @module ui/IconButton
 * @exports IconButton
 * @exports IconButtonBase
 * @exports IconButtonDecorator
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import ComponentOverride from '../ComponentOverride';
import Touchable from '../Touchable';

import componentCss from './IconButton.less';

/**
 * A ui-styled button without any behavior.
 *
 * @class IconButtonBase
 * @memberof ui/IconButton
 * @ui
 * @public
 */
const IconButtonBase = kind({
	name: 'ui:IconButton',

	propTypes: /** @lends ui/IconButton.IconButtonBase.prototype */ {
		/**
		 * The component used to render the button
		 *
		 * This is the root component and will receive all props except `icon`.
		 *
		 * @type {Function|Element}
		 * @required
		 * @public
		 */
		buttonComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,

		/**
		 * The component used to render the [icon]{@link ui/IconButton.IconButtonBase.icon}.
		 *
		 * This component will receive the `small` property set on the IconButton as well as the
		 * `icon` class to customize its styling.
		 *
		 * @type {Function}
		 * @required
		 * @public
		 */
		iconComponent: PropTypes.func.isRequired,

		/**
		 * Additional children that follow the icon.
		 *
		 * If `icon` isn't specified but `children` is, `children` is used as the icon's value.
		 *
		 * @see {@link ui/Icon.Icon#children}
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `iconButton` - The root component class
		 * * `icon` - The [icon component]{@link ui/IconButton.IconButtonBase.iconComponent} class
		 * * `small` - Applied when `small` prop is `true`
		 * * `pressed` - Applied when `pressed` prop is `true`
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Disables the [IconButton]{@link ui/IconButton.IconButtonBase}
		 *
		 * When `true`, the button is shown as disabled and does not generate
		 * `onClick` [events]{@link /docs/developer-guide/glossary/#event}.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The icon displayed within the [button]{@link ui/IconButton.IconButtonBase}.
		 *
		 * If not specified, `children` is used as the icon value instead.
		 *
		 * @type {String}
		 * @public
		 */
		icon: PropTypes.string,

		/**
		 * Applies the `pressed` CSS class to the [IconButton]{@link ui/IconButton.IconButtonBase}
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		pressed: PropTypes.bool,

		/**
		 * Applies the `selected` CSS class to the [IconButton]{@link ui/IconButton.IconButtonBase}
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * Applies the `small` CSS class to the [IconButton]{@link ui/IconButton.IconButtonBase}
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		small: PropTypes.bool
	},

	defaultProps: {
		disabled: false,
		pressed: false,
		selected: false,
		small: false
	},

	styles: {
		css: componentCss,
		className: 'iconButton',
		publicClassNames: true
	},

	computed: {
		className: ({small, styler}) => styler.append({small})
	},

	render: ({buttonComponent, children, css, icon, iconComponent: Icon, small, ...rest}) => {

		// To support the simpler use case of only specifying the icon as the children within
		// <IconButton>, this falls back on using children if icon isn't specified.
		if (!icon && children) {
			icon = children;
			children = null;
		}

		return ComponentOverride({
			...rest,
			component: buttonComponent,
			small: small,
			minWidth: false,
			children: [
				<Icon small={small} className={css.icon}>{icon}</Icon>,
				children
			]
		});
	}
});


/**
 * Adds universal button behaviors to an [IconButtonBase]{@link ui/IconButton.IconButtonBase}.
 *
 * @hoc
 * @memberof ui/IconButton
 * @mixes ui/Touchable.Touchable
 * @public
 */
const IconButtonDecorator = Touchable({activeProp: 'pressed'});

/**
 * A minimally styled, but interactable, Button ready for customization by a theme.
 *
 * Usage:
 * ```
 * <IconButton small>
 *     plus
 * </IconButton>
 * ```
 *
 * @class IconButton
 * @memberof ui/IconButton
 * @extends ui/IconButton.IconButtonBase
 * @mixes ui/IconButton.IconButtonDecorator
 * @ui
 * @public
 */
const IconButton = IconButtonDecorator(IconButtonBase);

export default IconButton;
export {
	IconButton,
	IconButtonBase,
	IconButtonDecorator
};
