/**
 * Unstyled button components and behaviors to be customized by a theme or application.
 *
 * @module ui/Button
 * @exports Button
 * @exports ButtonBase
 * @exports ButtonDecorator
 */

import kind from '@enact/core/kind';
import deprecate from '@enact/core/internal/deprecate';
import EnactPropTypes from '@enact/core/internal/prop-types';
import PropTypes from 'prop-types';
import React from 'react';

import Touchable from '../Touchable';

import componentCss from './Button.module.less';

const deprecateSmall = deprecate((small) => small ? 'small' : 'large',  {
	name: 'ui/Button.ButtonBase#small',
	replacedBy: 'the `size` prop',
	message: 'Use `size="small" instead`.',
	since: '2.6.0',
	until: '3.0.0'
});

function getSize (size, small) {
	small = typeof small !== 'undefined' ? deprecateSmall(small) : 'large';
	return size || small;
}

/**
 * A basic button component structure without any behaviors applied to it.
 *
 * @class ButtonBase
 * @memberof ui/Button
 * @ui
 * @public
 */
const ButtonBase = kind({
	name: 'ui:Button',

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
		 * * `large` - Applied when `size` prop is `'large'`
		 * * `minWidth` - Applied when `minWidth` prop is `true`
		 * * `pressed` - Applied when `pressed` prop is `true`
		 * * `selected` - Applied when `selected` prop is `true`
		 * * `small` - Applied when `size` prop is `'small'`
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Applies the `disabled` class.
		 *
		 * When `true`, the button is shown as disabled.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The icon displayed within the Button.
		 *
		 * The icon will be displayed before the natural reading order of the text, regardless
		 * of locale. Any string that is valid for its {@link ui/Button.Button.iconComponent} is
		 * valid here. If `icon` is specified as a string and `iconButton` is undefined, the icon is
		 * not rendered.
		 *
		 * This also supports a custom icon, in the form of a DOM node or a Component,
		 * with the caveat that if you supply a custom icon, you are responsible for sizing and
		 * locale positioning of the custom component.
		 *
		 * @type {Node}
		 * @public
		 */
		icon: PropTypes.node,

		/**
		 * The component used to render the [icon]{@link ui/Button.ButtonBase.icon}.
		 *
		 * This component will receive the `size` property set on the Button as well as the `icon`
		 * class to customize its styling. If [icon]{@link ui/Button.ButtonBase.icon} is not a
		 * string, this property is not used.
		 *
		 * @type {Component}
		 * @public
		 */
		iconComponent: EnactPropTypes.component,

		/**
		 * Enforces a minimum width for the component.
		 *
		 * Applies the `minWidth` CSS class which can be customized by
		 * [theming]{@link /docs/developer-guide/theming/}.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		minWidth: PropTypes.bool,

		/**
		 * Indicates the component is depressed.
		 *
		 * Applies the `pressed` CSS class which can be customized by
		 * [theming]{@link /docs/developer-guide/theming/}.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		pressed: PropTypes.bool,

		/**
		 * Indicates the component is selected.
		 *
		 * Applies the `selected` CSS class which can be customized by
		 * [theming]{@link /docs/developer-guide/theming/}.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * The size of the `Button`.
		 *
		 * Applies either the `small` or `large` CSS class which can be customized by
		 * [theming]{@link /docs/developer-guide/theming/}.
		 *
		 * @type {('small'|'large')}
		 * @public
		 */
		size: PropTypes.string,

		/**
		 * Reduces the size of the component.
		 *
		 * @type {Boolean}
		 * @default false
		 * @deprecated replaced by prop `size='small'`
		 * @public
		 */
		small: PropTypes.bool
	},

	defaultProps: {
		disabled: false,
		minWidth: true,
		pressed: false,
		selected: false
	},

	styles: {
		css: componentCss,
		className: 'button',
		publicClassNames: true
	},

	computed: {
		className: ({icon, minWidth, pressed, selected, size, small, styler}) => styler.append({
			hasIcon: (!!icon),
			minWidth,
			pressed,
			selected
		}, getSize(size, small)),
		icon: ({css, icon, iconComponent: Icon, size, small}) => {
			return (typeof icon === 'string' && Icon) ? (
				<Icon size={getSize(size, small)} className={css.icon}>{icon}</Icon>
			) : icon;
		}
	},

	render: ({children, css, disabled, icon, ...rest}) => {
		delete rest.iconComponent;
		delete rest.minWidth;
		delete rest.pressed;
		delete rest.selected;
		delete rest.size;
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
 * A higher-order component that adds touch support to a [ButtonBase]{@link ui/Button.ButtonBase}.
 *
 * @hoc
 * @memberof ui/Button
 * @mixes ui/Touchable.Touchable
 * @public
 */
const ButtonDecorator = Touchable({activeProp: 'pressed'});

/**
 * A minimally-styled button component with touch support.
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
