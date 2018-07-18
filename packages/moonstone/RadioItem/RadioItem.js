/**
 * Provides Moonstone-themed Item component and interactive togglable radio icon.
 *
 * @example
 * <RadioItem>Item</RadioItem>
 *
 * @module moonstone/RadioItem
 * @exports RadioItem
 * @exports RadioItemBase
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import ToggleIcon from '../ToggleIcon';
import ToggleItem from '../ToggleItem';

import componentCss from './RadioItem.less';

/**
 * Renders an `Item` with a radio-dot component.
 *
 * @class RadioItem
 * @memberof moonstone/RadioItem
 * @extends moonstone/ToggleItem.ToggleItem
 * @ui
 * @public
 */
const RadioItemBase = kind({
	name: 'RadioItem',

	propTypes: /** @lends moonstone/RadioItem.RadioItem.prototype */ {
		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `radioItem` - The root class name
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object
	},

	styles: {
		css: componentCss,
		className: 'radioItem',
		publicClassNames: ['radioItem']
	},

	render: (props) => (
		<ToggleItem
			data-webos-voice-intent="SelectRadioItem"
			{...props}
			css={props.css}
			iconComponent={
				<ToggleIcon css={componentCss} />
			}
		/>
	)
});

export default RadioItemBase;
export {
	RadioItemBase as RadioItem,
	RadioItemBase
};
