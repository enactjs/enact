/**
 * Provides a Moonstone-themed [Item]{@link moonstone/Item} with an icon that toggles on and off.
 *
 * @example
 * <SelectableItem>Click Me</SelectableItem>
 *
 * @module moonstone/SelectableItem
 * @exports SelectableItem
 * @exports SelectableItemBase
 * @exports SelectableItemDecorator
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import {ToggleItemBase, ToggleItemDecorator} from '../ToggleItem';

import SelectableIcon from './SelectableIcon';

import componentCss from './SelectableItem.less';

/**
 * Renders an [Item]{@link moonstone/Item} with a circle icon, by default.
 *
 * @class SelectableItemBase
 * @memberof moonstone/SelectableItem
 * @extends moonstone/ToggleItem.ToggleItemBase
 * @omit iconComponent
 * @ui
 * @public
 */
const SelectableItemBase = kind({
	name: 'SelectableItem',

	propTypes: /** @lends moonstone/SelectableItem.SelectableItemBase.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `selectableItem` - The root class name
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object
	},

	styles: {
		css: componentCss,
		className: 'selectableItem',
		publicClassNames: ['selectableItem']
	},

	render: (props) => (
		<ToggleItemBase
			data-webos-voice-intent="SelectCheckItem"
			{...props}
			css={props.css}
			iconComponent={SelectableIcon}
		/>
	)
});

/**
 * Adds interactive toggle functionality to `SelectableItemBase`.
 *
 * @class SelectableItemDecorator
 * @memberof moonstone/SelectableItem
 * @mixes moonstone/ToggleItem.ToggleItemDecorator
 * @hoc
 * @public
 */
const SelectableItemDecorator = ToggleItemDecorator({invalidateProps: ['inline', 'selected']});

/**
 * A Moonstone-styled item with a toggle icon, marqueed text, and `Spotlight` focus.
 *
 * @class SelectableItem
 * @memberof moonstone/SelectableItem
 * @extends moonstone/SelectableItem.SelectableItemBase
 * @mixes moonstone/SelectableItem.SelectableItemDecorator
 * @ui
 * @public
 */
const SelectableItem = SelectableItemDecorator(SelectableItemBase);

export default SelectableItem;
export {
	SelectableItem,
	SelectableItemBase,
	SelectableItemDecorator
};
