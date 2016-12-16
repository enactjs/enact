/**
 * Exports the {@link moonstone/IconButton.IconButton} component.
 *
 * @module moonstone/IconButton
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import Button from '../Button';
import Icon from '../Icon';

import css from './IconButton.less';

/**
 * {@link moonstone/IconButton.IconButton} is a {@link moonstone/Icon.Icon}
 * that acts like a button. You may specify an image, by setting the `src` property, or a font-based
 * icon, by setting the child to a string from the [IconList]{@link moonstone/Icon.IconList}.
 * If both `src` and children are specified, both will be rendered.
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
const IconButtonBase = kind({
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
		 * When `true`, the [button]{@glossary button} is shown as disabled and does not
		 * generate tap [events]{@glossary event}.
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
		 * @default false
		 * @public
		 */
		pressed: PropTypes.bool,

		/**
		 * When `true`, a selected visual effect is applied to the icon button
		 *
		 * @type {Boolean}
		 * @default false
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
		css,
		className: 'iconButton'
	},

	computed: {
		className: ({small, styler}) => styler.append({small})
	},

	render: ({children, small, ...rest}) => {
		return (
			<Button {...rest} small={small} minWidth={false} marqueeDisabled>
				<Icon small={small} className={css.icon}>{children}</Icon>
			</Button>
		);
	}
});

export default IconButtonBase;
export {IconButtonBase as IconButton, IconButtonBase};
