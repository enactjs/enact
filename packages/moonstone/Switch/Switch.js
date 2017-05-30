/**
 * Contains the declaration for the {@link moonstone/Switch.Switch} component.
 *
 * @module moonstone/Switch
 */

import kind from '@enact/core/kind';
import {handle, forward} from '@enact/core/handle';
import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon';
import Skinnable from '../Skinnable';

import css from './Switch.less';

/**
 * {@link moonstone/Switch.Switch} represents a Boolean state, and looks like a switch in
 * either the 'on' or 'off' positions.
 *
 * @class Switch
 * @memberof moonstone/Switch
 * @ui
 * @public
 */
const SwitchBase = kind({
	name: 'Switch',

	propTypes: /** @lends moonstone/Switch.Switch.prototype */ {
		/**
		 * Sets whether this control is animated during change.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		animated: PropTypes.bool,

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
		animated: true,
		selected: false,
		disabled: false
	},

	styles: {
		css,
		className: 'switch'
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
		className: ({animated, selected, styler}) => styler.append(
			{animated, selected}
		)
	},

	render: ({onToggle, ...rest}) => {
		delete rest.animated;
		delete rest.selected;

		return (
			<span {...rest} onClick={onToggle}>
				<Icon className={css.icon}>circle</Icon>
			</span>
		);
	}
});

const Switch = Skinnable(SwitchBase);

export default Switch;
export {Switch, SwitchBase};
