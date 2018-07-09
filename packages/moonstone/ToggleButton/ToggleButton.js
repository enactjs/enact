/**
 * Exports the {@link moonstone/ToggleButton.ToggleButton} component.
 *
 * @module moonstone/ToggleButton
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';
import Toggleable from '@enact/ui/Toggleable';

import Button from '../Button';
import Skinnable from '../Skinnable';

import css from './ToggleButton.less';

/**
 * {@link moonstone/ToggleButton.ToggleButtonBase} is a stateless [Button]{@link moonstone/Button.Button}
 * that can be toggled by changing its `selected` property
 *
 * @class ToggleButtonBase
 * @memberof moonstone/ToggleButton
 * @extends moonstone/Button.Button
 * @ui
 * @public
 */
const ToggleButtonBase = kind({
	name: 'ToggleButton',

	propTypes: /** @lends moonstone/ToggleButton.ToggleButtonBase.prototype */ {
		/**
		 * The background-color opacity of this button; valid values are `'translucent'`,
		 * `'lightTranslucent'` and `'transparent'`.
		 *
		 * @type {String}
		 * @public
		 */
		backgroundOpacity: PropTypes.oneOf(['translucent', 'lightTranslucent', 'transparent']),

		/**
		 * The string to be displayed as the main content of the toggle button.
		 * If `toggleOffLabel` and/or `toggleOnLabel` are provided, they will
		 * be used for the respective states.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * When `true`, the button is shown as disabled and does not generate
		 * `onClick` [events]{@link /docs/developer-guide/glossary/#event}.
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
		disabled: false,
		minWidth: true,
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

	render: ({selected, ...rest}) => {
		delete rest.toggleOffLabel;
		delete rest.toggleOnLabel;

		return (
			<Button data-webos-voice-intent="SetToggleItem" {...rest} aria-pressed={selected} selected={selected} />
		);
	}
});

/**
 * {@link moonstone/ToggleButton.ToggleButton} is a [Button]{@link moonstone/Button.Button} that is [Toggleable]{@link ui/Toggleable.Toggleable}.
 *
 * By default, `ToggleButton` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onToggle` events.
 *
 * @class ToggleButton
 * @memberof moonstone/ToggleButton
 * @extends moonstone/ToggleButton.ToggleButtonBase
 * @ui
 * @mixes ui/Toggleable
 * @public
 */
const ToggleButton = Pure(
	Toggleable(
		{prop: 'selected', toggleProp: 'onTap'},
		Skinnable(
			ToggleButtonBase
		)
	)
);

export default ToggleButton;
export {
	ToggleButton,
	ToggleButtonBase
};
