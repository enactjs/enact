/**
 * Provides Moonstone-themed item component and interactive togglable circle.
 *
 * @module moonstone/SelectableItem
 * @exports SelectableItem
 * @exports SelectableItemBase
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import ToggleItem from '../ToggleItem';

import SelectableIcon from './SelectableIcon';

import componentCss from './SelectableItem.less';

/**
 * Renders an item with a circle shaped component. Useful to show a selected state on an item.
 *
 * @class SelectableItem
 * @memberof moonstone/SelectableItem
 * @extends moonstone/ToggleItem.ToggleItem
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
		<ToggleItem
			data-webos-voice-intent="SelectCheckItem"
			{...props}
			css={props.css}
			iconComponent={SelectableIcon}
		/>
	)
});

export default SelectableItemBase;
export {
	SelectableItemBase as SelectableItem,
	SelectableItemBase
};
