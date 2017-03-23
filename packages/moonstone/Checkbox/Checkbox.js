/**
 * Contains the declaration for the {@link moonstone/Checkbox.Checkbox} component.
 *
 * @module moonstone/Checkbox
 */

import kind from '@enact/core/kind';
import {handle, forward} from '@enact/core/handle';
import React, {PropTypes} from 'react';

import Icon from '../Icon';

import css from './Checkbox.less';

/**
 * {@link moonstone/Checkbox.Checkbox} represents a Boolean state, and looks like a check mark in a box.
 *
 * @class Checkbox
 * @memberof moonstone/Checkbox
 * @ui
 * @public
 */
const CheckboxBase = kind({
	name: 'Checkbox',

	propTypes: /** @lends moonstone/Checkbox.Checkbox.prototype */ {
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

	render: ({onToggle, ...rest}) => {
		delete rest.selected;

		return (
			<div {...rest} onClick={onToggle}>
				<Icon className={css.icon}>check</Icon>
			</div>
		);
	}
});

export default CheckboxBase;
export {CheckboxBase as Checkbox, CheckboxBase};
