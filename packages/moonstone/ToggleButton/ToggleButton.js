/**
 * Provides a Moonstone-themed toggle button component and behaviors.
 *
 * @example
 * <ToggleButton>Toggle me</ToggleButton>
 *
 * @module moonstone/ToggleButton
 * @exports ToggleButton
 * @exports ToggleButtonBase
 */

import kind from '@enact/core/kind';
import deprecate from '@enact/core/internal/deprecate';
import React from 'react';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';
import Toggleable from '@enact/ui/Toggleable';

import Button from '../Button';
import Skinnable from '../Skinnable';

import css from './ToggleButton.module.less';

/**
 * A stateless [Button]{@link moonstone/Button.Button} that can be toggled by changing its
 * `selected` property.
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
		 * The background-color opacity of this button.
		 *
		 * * Values: `'translucent'`, `'lightTranslucent'`, `'transparent'`
		 *
		 * @type {String}
		 * @public
		 */
		backgroundOpacity: PropTypes.oneOf(['translucent', 'lightTranslucent', 'transparent']),

		/**
		 * The string to be displayed as the main content of the toggle button.
		 *
		 * If `toggleOffLabel` and/or `toggleOnLabel` are provided, they will be used for the
		 * respective states.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Disables the button.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Enforces a minimum width on the Button.
		 *
		 * *NOTE*: This property's default is `true` and must be explicitly set to `false` to allow
		 * the button to shrink to fit its contents.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		minWidth: PropTypes.bool,

		/**
		 * Applies a pressed visual effect.
		 *
		 * @type {Boolean}
		 * @public
		 */
		pressed: PropTypes.bool,

		/**
		 * Indicates the button is 'on'.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * Applies the appropriate styling for size of the component.
		 * The button will have a larger tap target than its apparent size to allow it to be clicked
		 * more easily.
		 *
		 * Takes `small` or `medium`.
		 * Other sizes can be defined and customized by
		 * [theming]{@link /docs/developer-guide/theming/}.
		 *
		 * @type {String}
		 * @default medium
		 * @public
		 */
		size: PropTypes.string,

		/**
		 * Reduces the size of the button.
		 *
		 * @type {Boolean}
		 * @default false
		 * @deprecated replaced by prop `size='small'`
		 * @public
		 */
		small: PropTypes.bool,

		/**
		 * Button text displayed in the 'off' state.
		 *
		 * If not specified, `children` will be used for 'off' button text.
		 *
		 * @type {String}
		 * @default ''
		 * @public
		 */
		toggleOffLabel: PropTypes.string,

		/**
		 * Button text displayed in the 'on' state.
		 *
		 * If not specified, `children` will be used for 'on' button text.
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
		className: ({selected, size, small, styler}) => styler.append({selected, small}, !size && small ? 'small' : size || 'medium'),
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

	render: ({selected, small, ...rest}) => {
		delete rest.toggleOffLabel;
		delete rest.toggleOnLabel;

		if (small) {
			const deprecateSmall = deprecate(() => {},  {
				name: 'moonstone/ToggleButton.ToggleButtonBase#small',
				replacedBy: 'the `size` prop',
				message: 'Use `size="small" instead`.',
				since: '2.6.0',
				until: '3.0.0'
			});
			deprecateSmall();
		}

		return (
			<Button data-webos-voice-intent="SetToggleItem" {...rest} aria-pressed={selected} selected={selected} />
		);
	}
});

/**
 * A toggleable button.
 *
 * By default, `ToggleButton` maintains the state of its `selected` property.
 * Supply the `defaultSelected` property to control its initial value. If you
 * wish to directly control updates to the component, supply a value to `selected` at creation time
 * and update it in response to `onToggle` events.
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
