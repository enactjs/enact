/**
 * Exports the {@link ui/IconButton.IconButton} and {@link ui/IconButton.IconButtonBase} components
 * and the {@link ui/IconButton.IconButtonDecorator} Higher-order Component (HOC).  The default
 * export is {@link ui/IconButton.IconButton}.
 *
 * @example
 * <IconButton small>flag</IconButton>
 *
 * @module ui/IconButton
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import Touchable from '../Touchable';

import css from './IconButton.less';

/**
 * {@link ui/IconButton.IconButtonBase} is a ui-styled button without any behavior.
 *
 * @class IconButtonBase
 * @memberof ui/IconButton
 * @ui
 * @public
 */
const IconButtonBase = kind({
	name: 'IconButton',

	propTypes: /** @lends ui/IconButton.IconButtonBase.prototype */ {
		icon: PropTypes.string.isRequired,

		/**
		 * The component used to render the button
		 *
		 * This is the root component and will receive all props except `icon`.
		 *
		 * @type {Function}
		 * @public
		 */
		buttonComponent: PropTypes.func,

		/**
		 * The icon displayed within the button.
		 *
		 * @see {@link ui/Icon.Icon#children}
		 * @type {String|Object}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Appends CSS classes to the nodes and components with
		 * {@link ui/IconButton.IconButtonBase}.
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Disables the {@link ui/IconButton.IconButtonBase}
		 * 
		 * When `true`, the [button]{@glossary button} is shown as disabled and does not
		 * generate `onClick` [events]{@glossary event}.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The component used to render the [icon]{@link ui/IconButton.IconButtonBase.icon}.
		 *
		 * This component will receive the `small` property set on the IconButton as well as the
		 * `icon` class to customize its styling.
		 *
		 * @type {Function}
		 * @public
		 */
		iconComponent: PropTypes.func,

		/**
		 * Applies the `pressed` CSS class to the {@link ui/IconButton.IconButtonBase}
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		pressed: PropTypes.bool,

		/**
		 * Applies the `selected` CSS class to the {@link ui/IconButton.IconButtonBase}
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * Applies the `small` CSS class to the {@link ui/IconButton.IconButtonBase}
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
		css,
		className: 'iconButton',
		publicClassNames: true
	},

	computed: {
		className: ({small, styler}) => styler.append({small}),
		// support either `icon` or `children` for the icon string, favoring `icon`
		icon: ({children, icon}) => icon || children
	},

	render: ({buttonComponent: Button, children, icon, iconComponent: Icon, small, ...rest}) => {
		return (
			<Button {...rest} small={small} minWidth={false}>
				<Icon small={small} className={css.icon}>{icon}</Icon>
				{children}
			</Button>
		);
	}
});


/**
 * {@link ui/IconButton.IconButtonDecorator} adds ui-specific button behaviors to an
 * [IconButton]{@link ui/IconButton.IconButtonBase}.
 *
 * @hoc
 * @memberof ui/IconButton
 * @mixes ui/Touchable.Touchable
 * @public
 */
const IconButtonDecorator = Touchable({activeProp: 'pressed'});

/**
 * An {@link ui/Icon.Icon} that acts like a button.  You may specify an image or a font-based
 * icon by setting the children to either the path to the image or a string from the
 * [IconList]{@link ui/Icon.IconList}. `IconButton` does not have `Marquee` or `Uppercase`
 * like `Button` has, as it should not contain text.
 *
 * Usage:
 * ```
 * <IconButton onClick={handleClick} small>
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
