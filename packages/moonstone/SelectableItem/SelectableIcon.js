/**
 * Provides Moonstone-themed circle component and interactive togglable capabilities.
 *
 * @module moonstone/SelectableIcon
 * @exports SelectableIcon
 * @exports SelectableIconBase
 * @exports SelectableIconDecorator
 */

import kind from '@enact/core/kind';
import React from 'react';
import compose from 'ramda/src/compose';
import Pure from '@enact/ui/internal/Pure';
import ToggleIcon from '@enact/ui/ToggleIcon';

import Icon from '../Icon';
import Skinnable from '../Skinnable';

import componentCss from './SelectableIcon.less';

/**
 * Renders a circle shaped component which supports a Boolean state.
 *
 * @class SelectableIconBase
 * @memberof moonstone/SelectableIcon
 * @extends ui/ToggleIcon.ToggleIcon
 * @ui
 * @public
 */
const SelectableIconBase = kind({
	name: 'SelectableIcon',

	styles: {
		css: componentCss,
		className: 'selectableIcon'
	},

	render: (props) => {
		return (
			<ToggleIcon {...props} css={componentCss} iconClasses={componentCss.dot} iconComponent={Icon}>circle</ToggleIcon>
		);
	}
});

/**
 * Moonstone-specific behaviors to apply to `SelectableIconBase`.
 *
 * @hoc
 * @memberof moonstone/SelectableIcon
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */
const SelectableDecorator = compose(
	Pure,
	Skinnable
);

/**
 * A fully functional, ready-to-use, component.
 *
 * @class SelectableIcon
 * @memberof moonstone/SelectableIcon
 * @extends moonstone/SelectableIcon.SelectableIconBase
 * @mixes moonstone/SelectableIcon.SelectableIconDecorator
 * @ui
 * @public
 */
const Selectable = SelectableDecorator(SelectableIconBase);

export default Selectable;
export {
	Selectable,
	SelectableIconBase,
	SelectableDecorator
};
