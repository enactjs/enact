/**
 * Contains the declaration for the {@link moonstone/FormCheckbox.FormCheckbox} component.
 *
 * @module moonstone/FormCheckbox
 */

import kind from '@enact/core/kind';
import {handle, forward} from '@enact/core/handle';
import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon';

import css from './FormCheckbox.less';

/**
 * {@link moonstone/FormCheckbox.FormCheckbox} represents a Boolean state, and looks like a check
 * mark in a circle. It also has built-in spotlight support and is intended for use in a specialized
 * [Item]{@link moonstone/Item} that does not visually respond to focus, so this can show focus instead.
 *
 * @class FormCheckbox
 * @memberof moonstone/FormCheckbox
 * @ui
 * @public
 */
const FormCheckboxBase = kind({
	name: 'FormCheckbox',

	propTypes: /** @lends moonstone/FormCheckbox.FormCheckbox.prototype */ {
		/**
		 * Sets whether this control is disabled, and non-interactive
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

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
		selected: false,
		disabled: false
	},

	styles: {
		css,
		className: 'formCheckbox'
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

	render: ({onToggle, ...rest}) => {
		delete rest.selected;

		return (
			<div {...rest} onClick={onToggle}>
				<Icon className={css.icon}>check</Icon>
			</div>
		);
	}
});

export default FormCheckboxBase;
export {FormCheckboxBase as FormCheckbox, FormCheckboxBase};
