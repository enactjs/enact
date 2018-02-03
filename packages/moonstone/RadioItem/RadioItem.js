/**
 * Provides Moonstone-themed item component and interactive togglable radio icon.
 *
 * @module moonstone/RadioItem
 * @exports RadioItem
 * @exports RadioItemBase
 */

import kind from '@enact/core/kind';
import React from 'react';

import {ToggleIconBase} from '@enact/ui/ToggleIcon';
import ToggleItem from '../ToggleItem';
import Skinnable from '../Skinnable';

import css from './RadioItem.less';

const RadioIcon = Skinnable((props) => <ToggleIconBase css={css} {...props} />);

/**
 * Renders an item with a radio component. Useful to show a selected state on an item.
 *
 * @class RadioItemBase
 * @memberof moonstone/RadioItem
 * @ui
 * @public
 */
const RadioItemBase = kind({
	name: 'RadioItem',

	render: ({...rest}) => (
		<ToggleItem {...rest} css={css} iconComponent={RadioIcon} />
	)
});

export default RadioItemBase;
export {
	RadioItemBase as RadioItem,
	RadioItemBase
};
