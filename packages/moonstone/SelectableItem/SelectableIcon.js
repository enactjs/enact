// Not actually an exported module
/*
 * Provides Moonstone-themed circle component and interactive togglable capabilities.
 *
 * @module moonstone/SelectableIcon
 * @exports SelectableIcon
 * @exports SelectableIconBase
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import ToggleIcon from '../ToggleIcon';

import componentCss from './SelectableIcon.less';

/**
 * Renders a circle shaped component which supports a Boolean state.
 *
 * @class SelectableIconBase
 * @memberof moonstone/SelectableIcon
 * @extends moonstone/ToggleIcon.ToggleIcon
 * @ui
 * @private
 */
const SelectableIconBase = kind({
	name: 'SelectableIcon',

	propTypes: {
		children: PropTypes.string
	},

	defaultProps: {
		children: 'circle'
	},

	render: ({children, ...rest}) => {
		return (
			<ToggleIcon {...rest} css={componentCss}>{children}</ToggleIcon>
		);
	}
});

export default SelectableIconBase;
export {
	SelectableIconBase as Selectable,
	SelectableIconBase
};
