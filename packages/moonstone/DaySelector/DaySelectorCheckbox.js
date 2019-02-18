import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon';
import Skinnable from '../Skinnable';

import css from './DaySelectorCheckbox.module.less';

/**
 * A component that represents the selected state of a day within a
 * {@link moonstone/DaySelector.DaySelector}. It has built-in spotlight support and is intended for
 * use in a specialized [Item]{@link moonstone/Item} that does not visually respond to focus, so
 * this can show focus instead.
 *
 * @class DaySelectorCheckbox
 * @memberof moonstone/DaySelector
 * @ui
 * @private
 */
const DaySelectorCheckboxBase = kind({
	name: 'DaySelectorCheckbox',

	propTypes: /** @lends moonstone/DaySelector.DaySelectorCheckbox.prototype */ {
		/**
		 * Sets whether this control is disabled, and non-interactive
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Sets whether this control is in the "on" or "off" state. `true` for on, `false` for "off".
		 *
		 * @type {Boolean}
		 * @public
		 */
		selected: PropTypes.bool
	},

	styles: {
		css,
		className: 'daySelectorCheckbox'
	},

	computed: {
		className: ({selected, styler}) => styler.append({selected})
	},

	render: ({...rest}) => {
		delete rest.selected;
		return (
			<div {...rest}>
				<Icon className={css.icon}>check</Icon>
			</div>
		);
	}
});

const DaySelectorCheckbox = Skinnable(DaySelectorCheckboxBase);

export default DaySelectorCheckbox;
export {
	DaySelectorCheckbox,
	DaySelectorCheckboxBase
};
