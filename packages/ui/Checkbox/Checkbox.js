/**
 * Contains the declaration for the {@link ui/Checkbox.Checkbox} component.
 *
 * @module ui/Checkbox
 */

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import {handle, forward} from '@enact/core/handle';
import React from 'react';
import PropTypes from 'prop-types';

import UiIcon from '../Icon';

import componentCss from './Checkbox.less';

/**
 * {@link ui/Checkbox.CheckboxBaseFactory} is Factory wrapper around {@link ui/Checkbox.CheckboxBase}
 * that allows overriding certain classes at design time. The following are properties of the `css`
 * member of the argument to the factory.
 *
 * @class CheckboxBaseFactory
 * @memberof ui/Checkbox
 * @factory
 * @ui
 * @public
 */
const CheckboxBaseFactory = factory({css: componentCss}, ({css}) => {
	/**
	 * {@link ui/Checkbox.Checkbox} represents a Boolean state, and looks like a check mark in a box.
	 *
	 * @class Checkbox
	 * @memberof ui/Checkbox
	 * @ui
	 * @public
	 */
	return kind({
		name: 'Checkbox',

		propTypes: /** @lends ui/Checkbox.Checkbox.prototype */ {
			/**
			 * Sets whether this control is disabled, and non-interactive
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: PropTypes.bool,

			/**
			 * The Icon component to use as the icon for this component.
			 *
			 * @type {Component}
			 * @default {@link ui/Icon}
			 * @public
			 */
			Icon: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

			/**
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
			Icon: UiIcon,
			selected: false
		},

		styles: {
			css,
			className: 'checkbox'
		},

		handlers: {
			onToggle: handle(
				forward('onClick'),
				(ev, {selected, onToggle}) => {
					if (onToggle) {
						onToggle({selected: !selected});
					}
				}
			)
		},

		computed: {
			className: ({selected, styler}) => styler.append({selected})
		},

		render: ({Icon, onToggle, ...rest}) => {
			delete rest.selected;

			return (
				<div {...rest} onClick={onToggle}>
					<Icon className={css.icon}>check</Icon>
				</div>
			);
		}
	});
});

const CheckboxBase = CheckboxBaseFactory();

export default CheckboxBase;
export {
	CheckboxBase as Checkbox,
	CheckboxBase,
	CheckboxBaseFactory as CheckboxFactory,
	CheckboxBaseFactory
};
