/**
 * Provides an unstyled icon component that handles interaction and toggles state between activated
 * and deactivated. Visually, it may be to be customized by a theme or application to represent any
 * state.
 *
 * @module ui/ToggleIcon
<<<<<<< a82120248fddd60e46637d2ed6cc6e95a475794a
 * @exports ToggleIcon
 * @exports ToggleIconBase
 * @exports ToggleIconDecorator
 */

import kind from '@enact/core/kind';
import React from 'react';
import compose from 'ramda/src/compose';
=======
 */

import kind from '@enact/core/kind';
import {handle, forward} from '@enact/core/handle';
import React from 'react';
>>>>>>> Migrated ToggleIcon, adapted Checkbox and Switch to use it as well
import PropTypes from 'prop-types';

import Toggleable from '../Toggleable';
import Touchable from '../Touchable';

import componentCss from './ToggleIcon.less';

<<<<<<< a82120248fddd60e46637d2ed6cc6e95a475794a
/**
 * Represents a Boolean state, and can accept any icon to toggle.
 *
 * @class ToggleIconBase
=======
const TouchableDiv = Touchable('div');

/**
 * Represents a Boolean state, and can accept any icon to toggle.
 *
 * @class ToggleIcon
>>>>>>> Migrated ToggleIcon, adapted Checkbox and Switch to use it as well
 * @memberof ui/ToggleIcon
 * @ui
 * @public
 */
const ToggleIconBase = kind({
	name: 'ui:ToggleIcon',

<<<<<<< a82120248fddd60e46637d2ed6cc6e95a475794a
	propTypes: /** @lends ui/ToggleIcon.ToggleIconBase.prototype */ {
		/**
		 * The icon to use for this component.
		 *
		 * @see ui/Icon.Icon.children
=======
	propTypes: /** @lends ui/ToggleIcon.ToggleIcon.prototype */ {
		/**
		 * The icon to use for this component.
		 * See [Icon's documentation]{@link ui/Icon.Icon#children} for details.
		 *
		 *
		 * @see ui/Icon#children
>>>>>>> Migrated ToggleIcon, adapted Checkbox and Switch to use it as well
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
<<<<<<< a82120248fddd60e46637d2ed6cc6e95a475794a
=======
		 * The handler to run when the component is toggled.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @param {String} event.selected - Selected value of item.
		 * @param {*} event.value - Value passed from `value` prop.
		 * @public
		 */
		onToggle: PropTypes.func,

		/**
>>>>>>> Migrated ToggleIcon, adapted Checkbox and Switch to use it as well
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

<<<<<<< a82120248fddd60e46637d2ed6cc6e95a475794a
=======
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

>>>>>>> Migrated ToggleIcon, adapted Checkbox and Switch to use it as well
	computed: {
		className: ({selected, styler}) => styler.append({selected})
	},

<<<<<<< a82120248fddd60e46637d2ed6cc6e95a475794a
	render: ({children, css, iconComponent: IconComponent, ...rest}) => {
		delete rest.selected;

		return (
			<div {...rest}>
				<IconComponent className={css.icon}>{children}</IconComponent>
			</div>
=======
	render: ({children, css, iconComponent: IconComponent, onToggle, ...rest}) => {
		delete rest.selected;

		return (
			<TouchableDiv {...rest} onTap={onToggle}>
				<IconComponent className={css.icon}>{children}</IconComponent>
			</TouchableDiv>
>>>>>>> Migrated ToggleIcon, adapted Checkbox and Switch to use it as well
		);
	}
});

<<<<<<< a82120248fddd60e46637d2ed6cc6e95a475794a
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
<<<<<<< 7b81833bc35c1128ce6515cc510c336dfe4310e6
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
=======
const ToggleIconDecorator = compose(
	Toggleable({toggleProp: 'onTap'}),
>>>>>>> Toggleable better supports alternate usages, docs updated, and much documentation fixed.
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
<<<<<<< 7b81833bc35c1128ce6515cc510c336dfe4310e6
=======
 * @param {*} event.value - Value passed from `value` prop.
>>>>>>> Toggleable better supports alternate usages, docs updated, and much documentation fixed.
 * @public
 */

=======
const ToggleIconDecorator = Toggleable({prop: 'selected'});

const ToggleIcon = ToggleIconDecorator(ToggleIconBase);

>>>>>>> Migrated ToggleIcon, adapted Checkbox and Switch to use it as well
export default ToggleIcon;
export {
	ToggleIcon,
	ToggleIconBase,
	ToggleIconDecorator
};
