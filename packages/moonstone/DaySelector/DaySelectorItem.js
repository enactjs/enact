import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import ToggleItem from '../ToggleItem';

import DaySelectorCheckbox from './DaySelectorCheckbox';

import css from './DaySelectorItem.less';

/**
 * An extension of [Item]{@link moonstone/Item.Item} that can be toggled between two states via its
 * `selected` prop.
 *
 * By default, `DaySelectorItem` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onToggle` events.
 *
 * @class DaySelectorItem
 * @memberof moonstone/DaySelector
 * @ui
 * @private
 */
const DaySelectorItem = kind({
	name: 'DaySelectorItem',

	propTypes: /** @lends moonstone/DaySelector.DaySelectorItem.prototype */ {
		/**
		 * The string to be displayed as the main content of the checkbox item.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		children: PropTypes.string.isRequired,

		/**
		 * When `true`, applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Specifies on which side (`before` or `after`) of the text the icon appears.
		 *
		 * @type {String}
		 * @default 'before'
		 * @public
		 */
		iconPosition: PropTypes.oneOf(['before', 'after']),

		/**
		 * When `true`, an inline visual effect is applied to the button.
		 *
		 * @type {Boolean}
		 * @public
		 */
		inline: PropTypes.bool,

		/**
		 * The handler to run when the checkbox item is toggled.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @param {String} event.selected - Selected value of item.
		 * @param {*} event.value - Value passed from `value` prop.
		 * @public
		 */
		onToggle: PropTypes.func,

		/**
		 * When `true`, a check mark icon is applied to the button.
		 *
		 * @type {Boolean}
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * The value that will be sent to the `onToggle` handler.
		 *
		 * @type {String|Number}
		 * @default ''
		 * @public
		 */
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
	},

	defaultProps: {
		iconPosition: 'before',
		value: ''
	},

	styles: {
		css,
		className: 'daySelectorItem'
	},

	computed: {
		className: ({selected, styler}) => styler.append({selected})
	},

	render: (props) => (
		<ToggleItem {...props} iconComponent={DaySelectorCheckbox} />
	)
});

export default DaySelectorItem;
export {DaySelectorItem};
