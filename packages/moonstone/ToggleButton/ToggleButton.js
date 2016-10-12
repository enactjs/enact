/**
 * Exports the {@link module:@enact/moonstone/ToggleButton~ToggleButton} component.
 *
 * @module @enact/moonstone/ToggleButton
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import Button from '../Button';

import css from './ToggleButton.less';

/**
* {@link module:@enact/moonstone/ToggleButton~ToggleButton} is an {@link module:enact/moonstone/Button~Button} that is {@link module:enact/ui/Toggleable~Togleable}.
*
* @class ToggleButton
* @extends module:enact/moonstone/Button~Button
* @ui
* @public
*/
const ToggleButtonBase = kind({

	propTypes: {
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
		 * The string to be displayed as the main content of the toggle button.
		 * If `toggleOffLabel` and/or `toggleOnLabel` are provided, they will
		 * be used for the respective states.
		 *
		 * @type {node}
		 * @public
		 */
		children: PropTypes.node,

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
		 * the minimum width will be set to 180px (or 130px if `small`
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
		 * When `true` a pressed visual effect is applied to the button
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		pressed: PropTypes.bool,

		/**
		 * Boolean indicating whether toggle button is currently in the 'on' state.
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
		 * Button text displayed in the 'off' state. If not specified, `children` will be used for 'off' button text.
		 *
		 * @type {String}
		 * @default ''
		 * @public
		 */
		toggleOffLabel: PropTypes.string,

		/**
		 * Button text displayed in the 'on' state. If not specified, `children` will be used for 'on' button text.
		 *
		 * @type {String}
		 * @default ''
		 * @public
		 */
		toggleOnLabel: PropTypes.string
	},

	defaultProps: {
		backgroundOpacity: 'opaque',
		disabled: false,
		minWidth: true,
		pressed: false,
		selected: false,
		small: false,
		toggleOffLabel: '',
		toggleOnLabel: ''
	},

	styles: {
		css,
		className: 'toggleButton'
	},

	computed: {
		className: ({selected, small, styler}) => styler.append({selected, small}),
		children: ({children, selected, toggleOnLabel, toggleOffLabel}) => {
			let c = children;
			if (selected && toggleOnLabel) {
				c = toggleOnLabel;
			} else if (!selected && toggleOffLabel) {
				c = toggleOffLabel;
			}
			return c;
		}
	},

	render: (props) => {
		delete props.toggleOffLabel;
		delete props.toggleOnLabel;

		return (
			<Button {...props} />
		);
	}
});

export default ToggleButtonBase;
export {ToggleButtonBase as ToggleButton, ToggleButtonBase};
