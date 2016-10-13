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
 * that acts like a button. Icons are stored as single characters in a special symbol font. You may
 * specify an image by setting the `src` property to a URL indicating the image file's location or a
 * child string from the [IconList]{@link module:@enact/moonstone/Icon~IconList} (e.g. 'plus').
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
		 * The background-color opacity of this icon button; valid values are `'opaque'`,
		 * `'translucent'`, and `'transparent'`.
		 *
		 * @type {String}
		 * @default 'opaque'
		 * @public
		 */
		backgroundOpacity: PropTypes.oneOf(['opaque', 'translucent', 'transparent']),

		/**
		 * String description of the icon to be used. All strings supported by
		 * [Icon]{module:@enact/moonstone/Icon~Icon} are supported.
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
		* URL specifying path to icon image.
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
