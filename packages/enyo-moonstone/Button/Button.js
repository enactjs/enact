import kind from 'enyo-core/kind';
import Uppercase from 'enyo-i18n/Uppercase';
import {Spottable} from 'enyo-spotlight';
import Pressable from 'enyo-ui/Pressable';
import React, {PropTypes} from 'react';

import css from './Button.less';

/**
* {@link module:moonstone/Button~Button} is an {@link module:enyo/Button~Button} with Moonstone styling applied.
* The color of the button may be customized by specifying a background color.
*
* For more information, see the documentation on
* [Buttons]{@linkplain $dev-guide/building-apps/controls/buttons.html} in the
* Enyo Developer Guide.
*
* @class Button
* @see module:enyo-i18n/Uppercase~Uppercase
* @extends module:enyo/Button~Button
* @mixes module:moonstone/MarqueeSupport~MarqueeSupport
* @ui
* @public
*/
const ButtonBase = kind({
	name: 'Button',

	propTypes: {
		children: PropTypes.node.isRequired,

		/**
		* The background-color opacity of this button; valid values are `'opaque'`, `'translucent'`,
		* and `'transparent'`.
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
		 * Applies a pressed visual effect to the button
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		pressed: PropTypes.bool,

		/**
		 * Applies a selected visual effect to the button
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
		classes: 'button'
	},

	computed: {
		className: ({backgroundOpacity, minWidth, pressed, selected, small, styler}) => styler.append(
			{pressed, small, minWidth, selected},
			backgroundOpacity
		)
	},

	render: ({children, ...rest}) => {
		delete rest.backgroundOpacity;
		delete rest.minWidth;
		delete rest.pressed;
		delete rest.selected;
		delete rest.small;

		return (
			<button {...rest}>
				<span className={css.client}>{children}</span>
			</button>
		);
	}
});

const UcButtonBase = Uppercase(ButtonBase);

const Button = Spottable(Pressable(UcButtonBase));

export default Button;
export {Button, UcButtonBase as ButtonBase};
