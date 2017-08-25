/**
 * Exports the {@link ui/IconButton.IconButton} component.
 *
 * @module ui/IconButton
 */

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
// import {diffClasses} from '@enact/ui/MigrationAid';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';
import PropTypes from 'prop-types';

import UiButtonFactory from '../ButtonFactory';
import UiIcon from '../Icon';

import componentCss from './IconButton.less';

const OptimizedIcon = onlyUpdateForKeys(['small', 'children'])(UiIcon);

/**
 * {@link ui/IconButton.IconButtonFactory} is Factory wrapper around
 * {@link ui/IconButton.IconButton} that allows overriding certain classes of the base
 * `Button` component at design time. See {@link ui/ButtonFactory.ButtonBaseFactory}.
 *
 * @class IconButtonFactory
 * @memberof ui/IconButton
 * @factory
 * @public
 */
const IconButtonBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('UI IconButton', componentCss, css);

	const UiButton = UiButtonFactory({css});
	/**
	 * {@link ui/IconButton.IconButton} is a {@link ui/Icon.Icon} that acts like a button.
	 * You may specify an image or a font-based icon by setting the children to either the path to the
	 * image or a string from the [IconList]{@link ui/Icon.IconList}.
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
	 * @ui
	 * @public
	 */
	return kind({
		name: 'IconButton',

		propTypes: /** @lends ui/IconButton.IconButton.prototype */ {
			/**
			 * The background-color opacity of this icon button; valid values are `'opaque'`,
			 * `'translucent'`, and `'transparent'`.
			 *
			 * @type {String}
			 * @default 'opaque'
			 * @public
			 */
			backgroundOpacity: PropTypes.oneOf(['opaque', 'translucent', 'transparent']),

			/**
			 * The Button component to use as the basis for this Button.
			 *
			 * @type {Component}
			 * @default Button Component
			 * @public
			 */
			Button: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

			/**
			 * The icon displayed within the button.
			 *
			 * @see {@link ui/Icon.Icon#children}
			 * @type {String|Object}
			 * @public
			 */
			children: PropTypes.string,

			/**
			 * This property accepts one of the following color names, which correspond with the
			 * colored buttons on a standard remote control: `'red'`, `'green'`, `'yellow'`, `'blue'`
			 *
			 * @type {String}
			 * @public
			 */
			color: PropTypes.oneOf([null, 'red', 'green', 'yellow', 'blue']),

			/**
			 * When `true`, the [button]{@glossary button} is shown as disabled and does not
			 * generate `onClick` [events]{@glossary event}.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: PropTypes.bool,

			/**
			 * The Icon component to use in this IconButton.
			 *
			 * @type {Component}
			 * @default {@link ui/Icon}
			 * @public
			 */
			Icon: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

			/**
			 * When `true`, a pressed visual effect is applied to the icon button
			 *
			 * @type {Boolean}
			 * @public
			 */
			pressed: PropTypes.bool,

			/**
			 * When `true`, a selected visual effect is applied to the icon button
			 *
			 * @type {Boolean}
			 * @public
			 */
			selected: PropTypes.bool,

			/**
			 * A boolean parameter affecting the size of the button. If `true`, the
			 * button's diameter will be set to 60px. However, the button's tap target
			 * will still have a diameter of 78px, with an invisible DOM element
			 * wrapping the small button to provide the larger tap zone.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			small: PropTypes.bool
		},

		defaultProps: {
			Button: UiButton,
			Icon: OptimizedIcon,
			small: false
		},

		styles: {
			css,
			className: 'iconButton'
		},

		computed: {
			className: ({color, small, styler}) => styler.append({small}, color)
		},

		render: ({Button, children, Icon, small, ...rest}) => {
			return (
				<Button {...rest} small={small} minWidth={false} marqueeDisabled>
					<Icon small={small} className={css.icon}>{children}</Icon>
				</Button>
			);
		}
	});
});

const IconButtonBase = IconButtonBaseFactory();

export default IconButtonBase;
export {
	IconButtonBase as IconButton,
	IconButtonBase,
	IconButtonBaseFactory as IconButtonFactory,
	IconButtonBaseFactory
};
