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
		...Button.propTypes,
		/**
		 * The string to be displayed as the main content of the toggle button.
		 * If both 'toggleOffLabel' and 'toggleOnLabel' are provided, they will
		 * be used instead.
		 *
		 * @type {String}
		 * @public
		 */
		// overriding isRequired for children since it may be generated by ToggleButton
		children: PropTypes.node,

		/**
		* Boolean indicating whether toggle button is currently in the 'on' state.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		selected: PropTypes.bool, // This is overlap from button

		/**
		* Button text displayed in the 'off' state. If not specified, the children will be used for button text.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		toggleOffLabel: PropTypes.string,

		/**
		* Button text displayed in the 'on' state. If not specified, the children will be used for button text.
		*
		* @type {String}
		* @default ''
		* @public
		*/
		toggleOnLabel: PropTypes.string
	},

	defaultProps: {
		...Button.defaultProps,
		toggleOffLabel: '',
		toggleOnLabel: '',
		selected: false
	},

	styles: {
		css,
		className: 'toggleButton'
	},

	computed: {
		className: ({selected, small, styler}) => styler.append({selected, small}),
		children: ({children, selected, toggleOnLabel, toggleOffLabel}) => {
			let c;
			if (!toggleOnLabel || !toggleOffLabel) {
				c = children;
			} else {
				c = selected ? toggleOnLabel : toggleOffLabel;
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
