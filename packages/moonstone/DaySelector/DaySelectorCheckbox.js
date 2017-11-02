/**
 * Contains the declaration for the {@link moonstone/DaySelectorCheckbox.DaySelectorCheckbox} component.
 *
 * @module moonstone/DaySelectorCheckbox
 */

import kind from '@enact/core/kind';
import {handle, forward} from '@enact/core/handle';
import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon';
import Skinnable from '../Skinnable';
import Touchable from '../internal/Touchable';

import css from './DaySelectorCheckbox.less';
const TouchableDiv = Touchable('div');

/**
 * {@link moonstone/DaySelectorCheckbox.DaySelectorCheckbox} represents a Boolean state, and looks like a check
 * mark in a circle. It also has built-in spotlight support and is intended for use in a specialized
 * [Item]{@link moonstone/Item} that does not visually respond to focus, so this can show focus instead.
 *
 * @class DaySelectorCheckbox
 * @memberof moonstone/DaySelectorCheckbox
 * @ui
 * @public
 */
const DaySelectorCheckboxBase = kind({
	name: 'DaySelectorCheckbox',

	propTypes: /** @lends moonstone/DaySelectorCheckbox.DaySelectorCheckbox.prototype */ {
		/**
		 * Sets whether this control is disabled, and non-interactive
		 *
		 * @type {Boolean}
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
		 * @public
		 */
		selected: PropTypes.bool
	},

	styles: {
		css,
		className: 'daySelectorCheckbox'
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

	computed: {
		className: ({selected, styler}) => styler.append({selected})
	},

	render: ({onToggle, ...rest}) => {
		delete rest.selected;
		return (
			<TouchableDiv {...rest} onTap={onToggle}>
				<Icon className={css.icon}>check</Icon>
			</TouchableDiv>
		);
	}
});

const DaySelectorCheckbox = Skinnable(DaySelectorCheckboxBase);

export default DaySelectorCheckbox;
export {DaySelectorCheckbox, DaySelectorCheckboxBase};
