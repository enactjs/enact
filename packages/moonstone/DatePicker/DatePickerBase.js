import {$L} from '@enact/i18n';
import kind from '@enact/core/kind';
import React from 'react';

import {DateComponentRangePicker} from '../internal/DateComponentPicker';
import {ExpandableItemBase} from '../ExpandableItem';

import css from './DatePicker.less';
import {dateComponentPickers} from '../internal/DateComponentPicker/DateComponentPicker.less';

/**
 * {@link moonstone/DatePicker.DatePickerBase} is the stateless functional date picker
 * component. Should not be used directly but may be composed within another component as it is
 * within {@link moonstone/DatePicker.DatePicker}.
 *
 * @class DatePickerBase
 * @memberof moonstone/DatePicker
 * @ui
 * @private
 */
const DatePickerBase = kind({
	name: 'DatePickerBase',

	propTypes:  /** @lends moonstone/DatePicker.DatePickerBase.prototype */ {
		/**
		 * The `day` component of the Date
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		day: React.PropTypes.number.isRequired,

		/**
		 * The number of days in the month
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		maxDays: React.PropTypes.number.isRequired,

		/**
		 * The number of months in the year
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		maxMonths: React.PropTypes.number.isRequired,

		/**
		 * The `month` component of the Date
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		month: React.PropTypes.number.isRequired,

		/**
		 * The order in which the component pickers are displayed. Should be an array of 3 strings
		 * containing one of `'m'`, `'d'`, and `'y'`.
		 *
		 * @type {String[]}
		 * @required
		 * @public
		 */
		order: React.PropTypes.arrayOf(React.PropTypes.oneOf(['m', 'd', 'y'])).isRequired,

		/**
		 * The primary text of the item.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		title: React.PropTypes.string.isRequired,

		/**
		 * The `year` component of the Date
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		year: React.PropTypes.number.isRequired,

		/**
		 * The maximum selectable `year` value
		 *
		 * @type {Number}
		 * @default 2099
		 * @public
		 */
		maxYear: React.PropTypes.number,

		/**
		 * The minimum selectable `year` value
		 *
		 * @type {Number}
		 * @default 1900
		 * @public
		 */
		minYear: React.PropTypes.number,

		/**
		 * When `true`, omits the labels below the pickers
		 *
		 * @type {Boolean}
		 * @public
		 */
		noLabels: React.PropTypes.bool,

		/**
		 * Handler for changes in the `date` component of the Date
		 *
		 * @type {Function}
		 * @public
		 */
		onChangeDate: React.PropTypes.func,

		/**
		 * Handler for changes in the `month` component of the Date
		 *
		 * @type {Function}
		 * @public
		 */
		onChangeMonth: React.PropTypes.func,

		/**
		 * Handler for changes in the `year` component of the Date
		 *
		 * @type {Function}
		 * @public
		 */
		onChangeYear: React.PropTypes.func,

		/**
		 * The handler to run when the component is removed while retaining focus.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightDisappear: React.PropTypes.func,

		/**
		 * When `true`, the control is rendered in the expanded state, with the contents visible
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: React.PropTypes.bool,

		/**
		 * When `true`, the component cannot be navigated using spotlight.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		spotlightDisabled: React.PropTypes.bool
	},

	defaultProps: {
		maxYear: 2099,
		minYear: 1900,
		spotlightDisabled: false
	},

	styles: {
		css,
		className: 'datePicker'
	},

	render: ({day, maxDays, maxMonths, maxYear, minYear, month, noLabels, onChangeDate, onChangeMonth, onChangeYear, onSpotlightDisappear, order, spotlightDisabled, year, ...rest}) => {

		return (
			<ExpandableItemBase {...rest} showLabel="always" autoClose={false} lockBottom={false} onSpotlightDisappear={onSpotlightDisappear} spotlightDisabled={spotlightDisabled}>
				<div className={dateComponentPickers}>
					{order.map(picker => {
						switch (picker) {
							case 'd':
								return (
									<DateComponentRangePicker
										ariaEnable={rest.open}
										key="day-picker"
										label={noLabels ? null : $L('day')}
										max={maxDays}
										min={1}
										onChange={onChangeDate}
										onSpotlightDisappear={onSpotlightDisappear}
										spotlightDisabled={spotlightDisabled}
										value={day}
										width={2}
										wrap
									/>
								);
							case 'm':
								return (
									<DateComponentRangePicker
										ariaEnable={rest.open}
										key="month-picker"
										label={noLabels ? null : $L('month')}
										max={maxMonths}
										min={1}
										onChange={onChangeMonth}
										onSpotlightDisappear={onSpotlightDisappear}
										spotlightDisabled={spotlightDisabled}
										value={month}
										width={2}
										wrap
									/>
								);
							case 'y':
								return (
									<DateComponentRangePicker
										ariaEnable={rest.open}
										className={css.year}
										key="year-picker"
										label={noLabels ? null : $L('year')}
										max={maxYear}
										min={minYear}
										onChange={onChangeYear}
										onSpotlightDisappear={onSpotlightDisappear}
										spotlightDisabled={spotlightDisabled}
										value={year}
										width={4}
									/>
								);
						}

						return null;
					})}
				</div>
			</ExpandableItemBase>
		);
	}
});

export default DatePickerBase;
export {DatePickerBase};
