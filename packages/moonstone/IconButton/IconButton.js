/**
 * Exports the {@link moonstone/IconButton.IconButton} component.
 *
 * @module moonstone/IconButton
 */

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';
import PropTypes from 'prop-types';

import {ButtonFactory} from '../Button';
import Icon from '../Icon';

import componentCss from './IconButton.less';

const OptimizedIcon = onlyUpdateForKeys(['small', 'children'])(Icon);

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
	const Button = ButtonFactory({css});
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

		propTypes: /** @lends moonstone/IconButton.IconButton.prototype */ {
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
			 * The icon displayed within the button.
			 *
			 * @see {@link moonstone/Icon.Icon#children}
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
			small: false
		},

		styles: {
			css: componentCss,
			className: 'iconButton'
		},

		computed: {
			className: ({color, small, styler}) => styler.append({small}, color)
		},

		render: ({children, small, ...rest}) => {
			return (
				<Button {...rest} aria-label={children} small={small} minWidth={false} marqueeDisabled>
					<OptimizedIcon small={small} className={css.icon}>{children}</OptimizedIcon>
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
