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

	render: (props) => {
		return (
			<ToggleIcon {...props} css={componentCss}>circle</ToggleIcon>
		);
	}
});

export default SelectableIconBase;
export {
	SelectableIconBase as Selectable,
	SelectableIconBase
};
