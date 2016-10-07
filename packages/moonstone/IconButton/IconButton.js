/**
 * Exports the {@link module:@enact/moonstone/IconButton~IconButton} component.
 *
 * @module @enact/moonstone/IconButton
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import Button from '../Button';
import Icon from '../Icon';

import css from './IconButton.less';

/**
 * {@link module:@enact/moonstone/IconButton~IconButton} is a {@link module:@enact/moonstone/Icon~Icon}
 * that acts like a button. Icons are stored as single characters in a special symbol font. Specify
 * the icon image by setting the [children]{@link module:@enact/moonstone/IconButton~IconButton#children}
 * property to a string representing an icon name.
 *
 * See {@link module:@enact/moonstone/Icon~Icon} for more information on the available font-based icons,
 * as well as specifications for icon image assets.
 *
 * @class IconButton
 * @ui
 * @public
 */
const IconButtonBase = kind({
	name: 'IconButton',

	propTypes: {
		/**
		 * The string corresponding to an icon button.
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string.isRequired,

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
		 * When `true`, the [button]{@glossary button} is shown as disabled and does not
		 * generate tap [events]{@glossary event}.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * A boolean parameter affecting the minimum width of the button. When `true`,
		 * the minimum width will be set to 180px (or 130px if [small]{@link module:moonstone/Button~Button#small}
		 * is `true`). If `false`, the minimum width will be set to the current value of
		 * `@moon-button-height` (thus forcing the button to be no smaller than a circle with
		 * diameter `@moon-button-height`).
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		minWidth: PropTypes.bool,

		/**
		 * Applies a pressed visual effect to the icon button
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		pressed: PropTypes.bool,

		/**
		 * Applies a selected visual effect to the icon button
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
		backgroundOpacity: 'opaque',
		disabled: false,
		minWidth: true,
		pressed: false,
		selected: false,
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
			<Button {...rest} small={small} minWidth={false}>
				<Icon small={small} className={css.icon}>{children}</Icon>
			</Button>
		);
	}
});

export default IconButtonBase;
export {IconButtonBase as IconButton, IconButtonBase};
