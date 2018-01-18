/**
 * Provides Moonstone-themed pill-shaped toggle switch component component with interactive
 * togglable capabilities.
 *
 * @module moonstone/Switch
 * @exports Switch
 * @exports SwitchBase
 * @exports SwitchDecorator
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import ToggleIcon from '@enact/ui/ToggleIcon';
import compose from 'ramda/src/compose';
import Pure from '@enact/ui/internal/Pure';

import Icon from '../Icon';
import Skinnable from '../Skinnable';

import css from './Switch.less';


/**
 * Renders the base level DOM structure of the component.
 *
 * @class SwitchBase
 * @memberof moonstone/Switch
 * @extends moonstone/ToggleIcon.ToggleIcon
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
		animated: PropTypes.bool
	},

	defaultProps: {
		animated: true
	},

	styles: {
		css,
		className: 'switch',
		publicClassNames: ['switch']
	},

	computed: {
		className: ({animated, styler}) => styler.append(
			{animated}
		)
	},

	render: ({...rest}) => {
		delete rest.animated;
		return (
			<ToggleIcon css={css} iconComponent={Icon} {...rest}>circle</ToggleIcon>
		);
	}
});

/**
 * Moonstone-specific behaviors to apply to `SwitchBase`.
 *
 * @hoc
 * @memberof moonstone/Switch
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */
const SwitchDecorator = compose(
	Pure,
	Skinnable
);

/**
 * A fully functional, ready-to-use, component.
 *
 * @class Switch
 * @memberof moonstone/Switch
 * @extends moonstone/Switch.SwitchBase
 * @mixes moonstone/Switch.SwitchDecorator
 * @ui
 * @public
 */
const Switch = SwitchDecorator(SwitchBase);

export default Switch;
export {
	Switch,
	SwitchBase,
	SwitchDecorator
};
