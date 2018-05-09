/**
 * Provides Moonstone-themed item component and interactive togglable circle.
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
 * Renders an item with a circle shaped component. Useful to show a selected state on an item.
 *
 * @class SelectableItem
 * @memberof moonstone/SelectableItem
 * @extends moonstone/ToggleItem.ToggleItemBase
 * @ui
 * @public
 */
const SelectableItemBase = kind({
	name: 'SelectableItem',

	propTypes: /** @lends moonstone/SelectableItem.SelectableItem.prototype */ {
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
 * Adds interactive functionality to `SelectableItemBase`
 *
 * @class SelectableItemDecorator
 * @memberof moostone/SelectableItem
 * @mixes moostone/ToggleItem.ToggleItemDecorator
 * @hoc
 * @public
 */
const SelectableItemDecorator = ToggleItemDecorator({invalidateProps: ['inline', 'selected']});

/**
 * A Moonstone-styled item with circle shaped component with built-in support for toggling,
 * marqueed text, and `Spotlight` focus.
 *
 * Usage:
 * ```
 * <SelectableItem>Toggle Me</SelectableItem>
 * ```
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
