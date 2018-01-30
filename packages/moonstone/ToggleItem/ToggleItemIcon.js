/**
 * Provides default dynamic ToggleItemIcon with interactive togglable capabilities and the ability to select an icon.
 *
 * @module moonstone/ToggleItemIcon
 * @exports ToggleItemIcon
 * @exports ToggleItemIconBase
 * @exports ToggleItemIconDecorator
 */

import kind from '@enact/core/kind';
import React from 'react';
import compose from 'ramda/src/compose';
import Pure from '@enact/ui/internal/Pure';
import ToggleIcon from '@enact/ui/ToggleIcon';

import Icon from '../Icon';
import Skinnable from '../Skinnable';

import componentCss from './ToggleItemIcon.less';

/**
 * Renders the icon of your choice inside the toggleItemIcon.
 *
 * @class ToggleItemIconBase
 * @memberof moonstone/ToggleItemIcon
 * @extends ui/ToggleItemIcon.ToggleItemIcon
 * @ui
 * @public
 */
const ToggleItemIconBase = kind({
	name: 'ToggleItemIcon',

	render: ({children, ...rest}) => {
		return (
			<ToggleIcon {...rest} css={componentCss} iconClasses={componentCss.icon} iconComponent={Icon}>{children}</ToggleIcon>
		);
	}
});

/**
 * Moonstone-specific behaviors to apply to `ToggleItemIconBase`.
 *
 * @hoc
 * @memberof moonstone/ToggleItemIcon
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
 * @class ToggleItemIcon
 * @memberof moonstone/ToggleItemIcon
 * @extends moonstone/ToggleItemIcon.ToggleItemIconBase
 * @mixes moonstone/ToggleItemIcon.ToggleItemIconDecorator
 * @ui
 * @public
 */
const Selectable = SelectableDecorator(ToggleItemIconBase);

export default Selectable;
export {
	Selectable,
	ToggleItemIconBase,
	SelectableDecorator
};
