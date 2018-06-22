/**
 * Moonstone styled checkbox components.
 *
 * @example
 * <Checkbox />
 *
 * @module moonstone/Checkbox
 * @exports Checkbox
 * @exports CheckboxBase
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import ToggleIcon from '../ToggleIcon';
import Icon from '@enact/ui/Icon';

import css from './Checkbox.less';

/**
 * A checkbox component
 *
 * May be used independently but more commonly used as part of [CheckboxItem]
 * {@link moonstone/CheckboxItem}.
 *
 * Usage:
 * ```
 * <Checkbox
 * 	selected
 * />
 * ```
 *
 * @class Checkbox
 * @memberof moonstone/Checkbox
 * @extends moonstone/ToggleIcon.ToggleIcon
 * @ui
 * @public
 */
const CheckboxBase = kind({
	name: 'Checkbox',

	propTypes: /** @lends moonstone/Checkbox.Checkbox.prototype */ {
		/**
		 * The icon displayed when `selected`.
		 *
		 * @see moonstone/Icon.Icon.children
		 * @type {String|Object}
		 * @default	'check'
		 * @public
		 */
		children: PropTypes.string
	},

	defaultProps: {
		children: 'check'
	},

	render: ({children, ...rest}) => {
		return (
			<ToggleIcon
				{...rest}
				css={css}
				iconComponent={Icon}
			>
				{children}
			</ToggleIcon>
		);
	}
});

export default CheckboxBase;
export {
	CheckboxBase as Checkbox,
	CheckboxBase
};
