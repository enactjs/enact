/**
 * An unstyled icon component that handles interaction and toggles state between activated
 * and deactivated.
 *
 * Visually, it may be to be customized by a theme or application to represent any
 * state.
 *
 * @module ui/ToggleIcon
 * @exports ToggleIcon
 * @exports ToggleIconBase
 * @exports ToggleIconDecorator
 */

import kind from '@enact/core/kind';
import EnactPropTypes from '@enact/core/internal/prop-types';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import Toggleable from '../Toggleable';
import Touchable from '../Touchable';

import componentCss from './ToggleIcon.module.less';

/**
 * Represents a Boolean state, and can accept any icon to toggle.
 *
 * @class ToggleIconBase
 * @memberof ui/ToggleIcon
 * @ui
 * @public
 */
const ToggleIconBase = kind({
	name: 'ui:ToggleIcon',

	propTypes: /** @lends ui/ToggleIcon.ToggleIconBase.prototype */ {
		/**
		 * The icon to use for this component.
		 *
		 * @see ui/Icon.Icon.children
		 * @type {String|Object}
		 * @public
		 */
		children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `toggleIcon` - The root class name
		 * * `icon` - The background node of the button
		 * * `selected` - Applied to a `selected` button
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Disables `ToggleIcon`.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		* CSS classes to be used on the Icon component
		*
		* @type {String}
		* @public
		*/
		iconClasses: PropTypes.string,

		/**
		 * The component used to render the icon.
		 *
		 * @type {String|Component}
		 * @default 'div'
		 * @public
		 */
		iconComponent: EnactPropTypes.renderable,

		/**
		 * Sets whether this control is in the 'on' or 'off' state. `true` for 'on', `false` for 'off'.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		selected: PropTypes.bool
	},

	defaultProps: {
		disabled: false,
		iconComponent: 'div',
		selected: false
	},

	styles: {
		css: componentCss,
		className: 'toggleIcon',
		publicClassNames: true
	},

	handlers: {
		onTouchEnd: (ev) => {
			ev.stopPropagation();
		}
	},

	computed: {
		className: ({selected, styler}) => styler.append({selected}),
		iconClassName: ({iconClasses, css}) => iconClasses ? `${css.icon} ${iconClasses}` : css.icon
	},

	render: ({children, iconComponent: IconComponent, iconClassName, ...rest}) => {
		delete rest.selected;
		delete rest.iconClasses;

		return (
			<div {...rest}>
				<IconComponent className={iconClassName}>{children}</IconComponent>
			</div>
		);
	}
});

/**
 * Adds support for the `onToggle` prop callback to be fired when the `onTap` (touch-safe `onClick`)
 * event executes.
 *
 * @class ToggleIconDecorator
 * @memberof ui/ToggleIcon
 * @mixes ui/Toggleable.Toggleable
 * @mixes ui/Touchable.Touchable
 * @ui
 * @public
 */
const ToggleIconDecorator = compose(
	Toggleable({toggleProp: 'onTap'}),
	Touchable
);

/**
 * Represents a Boolean state, and can accept any icon to toggle.
 *
 * @class ToggleIcon
 * @memberof ui/ToggleIcon
 * @extends ui/ToggleIcon.ToggleIconBase
 * @mixes ui/ToggleIcon.ToggleIconDecorator
 * @ui
 * @public
 */
const ToggleIcon = ToggleIconDecorator(ToggleIconBase);

/**
 * The handler to run when the component is toggled.
 *
 * @name onToggle
 * @memberof ui/ToggleIcon.ToggleIcon.prototype
 * @type {Function}
 * @param {Object} event
 * @param {String} event.selected - Selected value of item.
 * @public
 */

export default ToggleIcon;
export {
	ToggleIcon,
	ToggleIconBase,
	ToggleIconDecorator
};
