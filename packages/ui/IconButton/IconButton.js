/**
 * An [Icon]{@link ui/Icon.Icon} that acts like a [Button]{@link ui/Button.Button}.
 *
 * You may specify an image or a font-based icon by setting the `children` to either the path
 * to the image or a string from an [iconList]{@link ui/Icon.Icon.iconList}. This is unstyled,
 * but can easily be extended and customized by a theme or application.
 *
 * @module ui/IconButton
 * @exports IconButton
 * @exports IconButtonBase
 * @exports IconButtonDecorator
 */

import kind from '@enact/core/kind';
import deprecate from '@enact/core/internal/deprecate';
import EnactPropTypes from '@enact/core/internal/prop-types';
import PropTypes from 'prop-types';
import React from 'react';

import ComponentOverride from '../ComponentOverride';
import Touchable from '../Touchable';

import componentCss from './IconButton.module.less';

const deprecateSmall = deprecate((small) => small ? 'small' : 'large',  {
	name: 'ui/IconButton.IconButtonBase#small',
	replacedBy: 'the `size` prop',
	message: 'Use `size="small"` instead.',
	since: '2.6.0',
	until: '3.0.0'
});

function getSize (size, small) {
	small = typeof small !== 'undefined' ? deprecateSmall(small) : 'large';
	return size || small;
}

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
		 * This is the root component used to render the button and will receive all props except
		 * `icon`.
		 *
		 * @type {Component|Element}
		 * @required
		 * @public
		 */
		buttonComponent: EnactPropTypes.componentOverride.isRequired,

		/**
		 * The component used to render the [icon]{@link ui/IconButton.IconButtonBase.icon}.
		 *
		 * This component will receive the `size` property set on the `IconButton` as well as the
		 * `icon` class to customize its styling.
		 *
		 * @type {Component}
		 * @required
		 * @public
		 */
		iconComponent: EnactPropTypes.component.isRequired,

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
		 * * `large` - Applied when `size` prop is `'large'`
		 * * `small` - Applied when `size` prop is `'small'`
		 * * `pressed` - Applied when `pressed` prop is `true`
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Disables IconButton.
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
		 * The icon displayed within the IconButton.
		 *
		 * If not specified, `children` is used as the icon value instead.
		 *
		 * @type {String}
		 * @public
		 */
		icon: PropTypes.string,

		/**
		 * Applies the `pressed` CSS class.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		pressed: PropTypes.bool,

		/**
		 * Applies the `selected` CSS class.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * The size of the button.
		 *
		 * Applies either the `small` or `large` CSS class which can be customized by
		 * [theming]{@link /docs/developer-guide/theming/}.
		 *
		 * @type {('small'|'large')}
		 * @default 'large'
		 * @public
		 */
		size: PropTypes.string,

		/**
		 * Applies the `small` CSS class.
		 *
		 * @type {Boolean}
		 * @deprecated replaced by prop `size='small'`
		 * @public
		 */
		small: PropTypes.bool
	},

	defaultProps: {
		disabled: false,
		pressed: false,
		selected: false
		// size: 'large' // we won't set default props for `size` yet to support `small` prop
	},

	styles: {
		css: componentCss,
		className: 'iconButton',
		publicClassNames: true
	},

	computed: {
		className: ({size, small, styler}) => styler.append(getSize(size, small))
	},

	render: ({buttonComponent, children, css, icon, iconComponent: Icon, size, small, ...rest}) => {
		// To support the simpler use case of only specifying the icon as the children within
		// <IconButton>, this falls back on using children if icon isn't specified.
		if (!icon && children) {
			icon = children;
			children = null;
		}

		return ComponentOverride({
			...rest,
			component: buttonComponent,
			size: getSize(size, small),
			minWidth: false,
			children: [
				<Icon key="icon" size={getSize(size, small)} className={css.icon}>{icon}</Icon>,
				...React.Children.toArray(children)
			]
		});
	}
});


/**
 * A higher-order component that adds universal button behaviors to an [IconButtonBase]{@link ui/IconButton.IconButtonBase}.
 *
 * @hoc
 * @memberof ui/IconButton
 * @mixes ui/Touchable.Touchable
 * @public
 */
const IconButtonDecorator = Touchable({activeProp: 'pressed'});

/**
 * A minimally styled, but interactive, Button ready for customization by a theme.
 *
 * Example:
 * ```
 * <IconButton size="small">
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
