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
 * that acts like a button. You may specify an image, by setting the `src` property, or a font-based
 * icon, by setting the child to a string from the [IconList]{@link module:@enact/moonstone/Icon~IconList}.
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
 * @ui
 * @public
 */
const IconButtonBase = kind({
	name: 'IconButton',

	propTypes: {
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
		 * A string that represents an icon from the [IconList]{@link module:@enact/moonstone/Icon~IconList}.
		 * Can also be an HTML entity string, Unicode reference or hex value (in the form '0x...').
		 *
		 * @type {String}
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
		small: PropTypes.bool,

		/**
		 * URL specifying path to an icon image or an object representing a resolution independent resource (See
		 * {@link module:@enact/ui/resolution}).
		 * If both `src` and `children` are specified, they will both be rendered.
		 *
		 * @type {String|Object}
		 * @public
		 */
		src: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
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

	render: ({children, small, src, ...rest}) => {
		return (
			<Button {...rest} small={small} minWidth={false} marqueeDisabled>
				<Icon small={small} className={css.icon} src={src}>{children}</Icon>
			</Button>
		);
	}
});

export default IconButtonBase;
export {IconButtonBase as IconButton, IconButtonBase};
