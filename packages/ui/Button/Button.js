/**
 * Exports the [Button]{@link ui/Button.Button} and [ButtonBase]{@link ui/Button.ButtonBase} components and
 * the [ButtonDecorator]{@link ui/Button.ButtonDecorator} Higher-order Component (HOC).
 *
 * The default export is [Button]{@link ui/Button.Button}.
 *
 * @module ui/Button
 */

import {forProp, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import Touchable from '../Touchable';

import componentCss from './Button.less';

/**
 * [ButtonBase]{@link ui/Button.ButtonBase} is a basic button component structure without any behaviors
 * applied to it.
 *
 * @class ButtonBase
 * @memberof ui/Button
 * @ui
 * @public
 */
const ButtonBase = kind({
	name: 'ui/Button',

	propTypes: /** @lends ui/Button.ButtonBase.prototype */ {
		children: PropTypes.node.isRequired,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `button` - The root component class
		 * * `bg` - The background node of the button
		 * * `client` - The content node of the button
		 * * `icon` - The icon node, when `icon` is set
		 * * `minWidth` - Applied to `minWidth` button
		 * * `pressed` - Applied to a pressed
		 * * `selected` - Applied to a `selected` button
		 * * `small` - Applied to a `small` button
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Disables the [ButtonBase]{@link ui/Button.ButtonBase}
		 *
		 * When `true`, the [button]{@glossary button} is shown as disabled and does not
		 * generate `onClick` [events]{@glossary event}.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The icon displayed within the [button][ButtonBase]{@link ui/Button.ButtonBase}.
		 *
		 * The icon will be displayed before the natural reading order of the text, regardless
		 * of locale. Any string that is valid for the `Icon` component is valid here. This also
		 * supports a custom icon, in the form of a DOM node or a Component, with the caveat that if
		 * you supply a custom icon, you are responsible for sizing and locale positioning of the
		 * custom component.
		 *
		 * @type {Node}
		 * @public
		 */
		icon: PropTypes.node,

		/**
		 * The component used to render the [icon]{@link ui/Button.ButtonBase.icon}.
		 *
		 * This component will receive the `small` property set on the Button as well as the `icon`
		 * class to customize its styling.
		 *
		 * @type {Function}
		 * @public
		 */
		iconComponent: PropTypes.func,

		/**
		 * Applies the `minWidth` CSS class to the [ButtonBase]{@link ui/Button.ButtonBase}
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		minWidth: PropTypes.bool,

		/**
		 * Applies the `pressed` CSS class to the [ButtonBase]{@link ui/Button.ButtonBase}
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		pressed: PropTypes.bool,

		/**
		 * Applies the `selected` CSS class to the [ButtonBase]{@link ui/Button.ButtonBase}
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * Applies the `small` CSS class to the [ButtonBase]{@link ui/Button.ButtonBase}
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		small: PropTypes.bool
	},

	defaultProps: {
		disabled: false,
		minWidth: true,
		pressed: false,
		selected: false,
		small: false
	},

	styles: {
		css: componentCss,
		className: 'button',
		publicClassNames: true
	},

	computed: {
		className: ({minWidth, pressed, selected, small, styler}) => styler.append({
			pressed,
			small,
			minWidth,
			selected
		}),
		icon: ({css, icon, iconComponent: Icon, small}) => {
			return (typeof icon === 'string' && Icon) ? (
				<Icon small={small} className={css.icon}>{icon}</Icon>
			) : icon;
		}
	},

	handlers: {
		onClick: handle(
			forProp('disabled', false),
			forward('onClick')
		)
	},

	render: ({children, css, disabled, icon, ...rest}) => {
		delete rest.iconComponent;
		delete rest.minWidth;
		delete rest.pressed;
		delete rest.selected;
		delete rest.small;

		return (
			<div role="button" {...rest} aria-disabled={disabled} disabled={disabled}>
				<div className={css.bg} />
				<div className={css.client}>{icon}{children}</div>
			</div>
		);
	}
});

/**
 * [ButtonDecorator]{@link ui/Button.ButtonDecorator} adds touch support to a
 * [Button]{@link ui/Button.Button}
 *
 * @hoc
 * @memberof ui/Button
 * @ui
 * @public
 */
const ButtonDecorator = Touchable({activeProp: 'pressed'});

/**
 * [Button]{@link ui/Button.Button} is minimally-styled button component with touch support.
 *
 * @class Button
 * @extends ui/Button.ButtonBase
 * @memberof ui/Button
 * @mixes ui/Button.ButtonDecorator
 * @ui
 * @public
 */
const Button = ButtonDecorator(ButtonBase);

export default Button;
export {
	Button,
	ButtonBase,
	ButtonDecorator
};
