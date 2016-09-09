import kind from 'enyo-core/kind';
import React, {PropTypes} from 'react';

import Icon from '../Icon';

import css from './Switch.less';

/**
* Contains the declaration for the {@link module:moonstone/Switch~Switch} kind.
* @module moonstone/Switch
*/

/**
* {@link module:moonstone/Switch~Switch} represents a Boolean state, and looks like a switch in
* either the 'on' or 'off' positions.
*
* @class Switch
* @ui
* @public
*/
const SwitchBase = kind({
	/** @lends module:moonstone/Switch~Switch.prototype */
	name: 'Switch',

	propTypes: {
		/**
		 * Sets whether this control is animated during change.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		animated: PropTypes.bool,

		/**
		 * Sets whether this control is in the "on" or "off" state. `true` for on, `false` for "off".
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		checked: PropTypes.bool,

		/**
		 * Sets whether this control is disabled, and non-interactive
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool
	},

	defaultProps: {
		animated: true,
		checked: false,
		disabled: false
	},

	styles: {
		css,
		className: 'switch'
	},

	computed: {
		className: ({animated, checked, styler}) => styler.append(
			{animated, checked}
		)
	},

	render: (props) => {
		delete props.animated;
		delete props.checked;

		return (
			<span {...props}>
				<Icon className={css.icon}>circle</Icon>
			</span>
		);
	}
});

export default SwitchBase;
export {SwitchBase as Switch, SwitchBase};
