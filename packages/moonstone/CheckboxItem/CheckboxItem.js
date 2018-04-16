/**
 * Provides Moonstone-themed item component and interactive togglable checkbox.
 *
 * @module moonstone/CheckboxItem
 * @exports CheckboxItem
 * @exports CheckboxItemBase
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from '../Checkbox';
import ToggleItem from '../ToggleItem';

import componentCss from './CheckboxItem.less';

/**
 * Renders an item with a checkbox component. Useful to show a selected state on an item.
 *
 * @class CheckboxItem
 * @memberof moonstone/CheckboxItem
 * @extends moonstone/ToggleItem.ToggleItem
 * @ui
 * @public
 */
const CheckboxItemBase = kind({
	name: 'CheckboxItem',

	propTypes: /** @lends moonstone/CheckboxItem.CheckboxItem.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `checkboxItem` - The root class name
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object
	},

	styles: {
		css: componentCss,
		className: 'checkboxItem',
		publicClassNames: ['checkboxItem']
	},

	render: (props) => (
		<ToggleItem
			data-webos-voice-intent="SelectCheckItem"
			{...props}
			css={props.css}
			iconComponent={Checkbox}
		/>
	)
});

export default CheckboxItemBase;
export {
	CheckboxItemBase as CheckboxItem,
	CheckboxItemBase
};
