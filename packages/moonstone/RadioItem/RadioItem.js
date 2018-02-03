/**
 * Provides Moonstone-themed item component and interactive togglable radio icon.
 *
 * @module moonstone/RadioItem
 * @exports RadioItem
 * @exports RadioItemBase
 * @exports RadioItemDecorator
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import Pure from '@enact/ui/internal/Pure';
import Toggleable from '@enact/ui/Toggleable';

import {ToggleItemBase} from '../ToggleItem';
import Skinnable from '../Skinnable';

import css from './RadioItem.less';

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

	propTypes: /** @lends moonstone/RadioItem.RadioItemBase.prototype */ {
		/**
		 * The string to be displayed as the main content of the radio item.
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string.isRequired,

		/**
		 * Applies a disabled visual state to the radio item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Applies inline styling to the radio item.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		inline: PropTypes.bool,

		/**
		 * The handler to run when the radio item is toggled.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @param {String} event.selected - Selected value of item.
		 * @param {*} event.value - Value passed from `value` prop.
		 * @public
		 */
		onToggle: PropTypes.func,

		/**
		 * Applies a filled circle icon to the radio item.
		 *
		 * @type {Boolean}
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * The value that will be sent to the `onToggle` handler.
		 *
		 * @type {*}
		 * @default ''
		 * @public
		 */
		value: PropTypes.any
	},

	defaultProps: {
		disabled: false,
		inline: false,
		value: ''
	},

	styles: {
		css,
		className: 'radioItem'
	},

	computed: {
		// eslint-disable-next-line enact/display-name
		toggleIcon: ({selected, styler}) => () => {
			const className = styler.join(css.dot, {selected});

			return (
				<div className={className} />
			);
		}
	},

	render: (props) => (
		<ToggleItemBase {...props} />
	)
});


/**
 * Represents a Boolean state of an item with a checkbox
 *
 * @class RadioItem
 * @memberof moonstone/RadioItem
 * @mixes ui/Toggleable.Toggleable
 * @ui
 * @public
 */

const RadioItem = compose(
	Pure,
	Toggleable({prop: 'selected'}),
	Skinnable
)(RadioItemBase);

export default RadioItem;
export {RadioItem, RadioItemBase};
