/**
 * Provides an unstyled icon component that handles interaction and toggles state between activated
 * and deactivated. Visually, it may be to be customized by a theme or application to represent any
 * state.
 *
 * @module ui/ToggleIcon
 * @exports ToggleIcon
 * @exports ToggleIconBase
 * @exports ToggleIconDecorator
 */

import kind from '@enact/core/kind';
import React from 'react';
import compose from 'ramda/src/compose';
import PropTypes from 'prop-types';

import Toggleable from '../Toggleable';
import Touchable from '../Touchable';

import componentCss from './ToggleIcon.less';

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
		 * Sets whether this control is disabled, and non-interactive
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The component used to render the icon.
		 *
		 * @type {String|Object}
		 * @default 'div'
		 * @public
		 */
		iconComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

		/**
		 * Sets whether this control is in the "on" or "off" state. `true` for on, `false` for "off".
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

	computed: {
		className: ({selected, styler}) => styler.append({selected})
	},

	render: ({children, css, iconComponent: IconComponent, ...rest}) => {
		delete rest.selected;

		return (
			<div {...rest}>
				<IconComponent className={css.icon}>{children}</IconComponent>
			</div>
		);
	}
});

<<<<<<< a1942e68177a957f1ad9f0dbe0d13eb6557d3ecc
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
=======
const TouchableToggleIcon = hoc((config, Wrapped) => {
	return kind({
		name: 'ui:TouchableToggleIcon',

		propTypes: {
			/**
			 * The handler to run when the component is toggled.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @param {String} event.selected - Selected value of item.
			 * @param {*} event.value - Value passed from `value` prop.
			 * @public
			 */
			onToggle: PropTypes.func
		},

		handlers: {
			onToggle: handle(
				forward('onTap'),
				(ev, {selected, onToggle}) => {
					if (onToggle) {
						onToggle({selected: !selected});
					}
				}
			)
		},

		render: ({onToggle, ...rest}) => {
			return (
				<Wrapped {...rest} onTap={onToggle} />
			);
		}
	});
});

const ToggleIconDecorator = compose(
	Toggleable({prop: 'selected'}),
	TouchableToggleIcon,
>>>>>>> Extracted handlers to a hoc wrapper
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
