/**
 * Contains the declaration for the {@link moonstone/Switch.Switch} component.
 *
 * @module moonstone/Switch
 */

import kind from '@enact/core/kind';
import {withArgs as handle, forward} from '@enact/core/handle';
import React, {PropTypes} from 'react';

import Icon from '../Icon';

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
		onToggle: PropTypes.bool,

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

	computed: {
		className: ({animated, selected, styler}) => styler.append(
			{animated, selected}
		),
		onToggle: handle(forward('onClick'), ({selected, onToggle}) => () => {
			if (onToggle) {
				onToggle({selected: !selected});
			}
		})
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

export default SwitchBase;
export {SwitchBase as Switch, SwitchBase};
