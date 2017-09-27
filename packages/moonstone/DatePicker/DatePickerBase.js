import {forKey, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import $L from '../internal/$L';
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
		day: PropTypes.number.isRequired,

		/**
		 * The number of days in the month
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		maxDays: PropTypes.number.isRequired,

		/**
		 * The number of months in the year
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		maxMonths: PropTypes.number.isRequired,

		/**
		 * The `month` component of the Date
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		month: PropTypes.number.isRequired,

		/**
		 * The order in which the component pickers are displayed. Should be an array of 3 strings
		 * containing one of `'m'`, `'d'`, and `'y'`.
		 *
		 * @type {String[]}
		 * @required
		 * @public
		 */
		order: PropTypes.arrayOf(PropTypes.oneOf(['m', 'd', 'y'])).isRequired,

		/**
		 * The primary text of the item.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		title: PropTypes.string.isRequired,

		/**
		 * The `year` component of the Date
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		year: PropTypes.number.isRequired,

		/**
		 * The maximum selectable `year` value
		 *
		 * @type {Number}
		 * @default 2099
		 * @public
		 */
		maxYear: PropTypes.number,

		/**
		 * The minimum selectable `year` value
		 *
		 * @type {Number}
		 * @default 1900
		 * @public
		 */
		minYear: PropTypes.number,

		/**
		 * When `true`, omits the labels below the pickers
		 *
		 * @type {Boolean}
		 * @public
		 */
		noLabels: PropTypes.bool,

		/**
		 * Handler for changes in the `date` component of the Date
		 *
		 * @type {Function}
		 * @public
		 */
		onChangeDate: PropTypes.func,

		/**
		 * Handler for changes in the `month` component of the Date
		 *
		 * @type {Function}
		 * @public
		 */
		onChangeMonth: PropTypes.func,

		/**
		 * Handler for changes in the `year` component of the Date
		 *
		 * @type {Function}
		 * @public
		 */
		onChangeYear: PropTypes.func,

		/**
		 * Callback to be called when a condition occurs which should cause the expandable to close
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * The handler to run when the component is removed while retaining focus.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightDisappear: PropTypes.func,

		/**
		 * The handler to run prior to focus leaving the expandable when the 5-way left key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightLeft: PropTypes.func,

		/**
		 * The handler to run prior to focus leaving the expandable when the 5-way right key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightRight: PropTypes.func,

		/**
		 * When `true`, current locale is RTL
		 *
		 * @type {Boolean}
		 * @private
		 */
		rtl: PropTypes.bool,

		/**
		 * When `true`, the component cannot be navigated using spotlight.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		spotlightDisabled: PropTypes.bool
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

	handlers: {
		handlePickerKeyDown: handle(
			forKey('enter'),
			forward('onClose')
		)
	},

	render: ({
		day,
		handlePickerKeyDown,
		maxDays,
		maxMonths,
		maxYear,
		minYear,
		month,
		noLabels,
		onChangeDate,
		onChangeMonth,
		onChangeYear,
		onSpotlightDisappear,
		onSpotlightLeft,
		onSpotlightRight,
		order,
		rtl,
		spotlightDisabled,
		year,
		...rest
	}) => {

		return (
			<ExpandableItemBase
				{...rest}
				showLabel="always"
				autoClose={false}
				lockBottom={false}
				onSpotlightDisappear={onSpotlightDisappear}
				onSpotlightLeft={onSpotlightLeft}
				onSpotlightRight={onSpotlightRight}
				spotlightDisabled={spotlightDisabled}
			>
				<div className={dateComponentPickers} onKeyDown={handlePickerKeyDown}>
					{order.map((picker, index) => {
						const isFirst = index === 0;
						const isLast = index === order.length - 1;
						const isLeft = isFirst && !rtl || isLast && rtl;
						const isRight = isFirst && rtl || isLast && !rtl;
						switch (picker) {
							case 'd':
								return (
									<DateComponentRangePicker
										key="day-picker"
										label={noLabels ? null : $L('day')}
										max={maxDays}
										min={1}
										onChange={onChangeDate}
										onSpotlightDisappear={onSpotlightDisappear}
										onSpotlightLeft={isLeft ? onSpotlightLeft : null}
										onSpotlightRight={isRight ? onSpotlightRight : null}
										spotlightDisabled={spotlightDisabled}
										value={day}
										width={2}
										wrap
									/>
								);
							case 'm':
								return (
									<DateComponentRangePicker
										key="month-picker"
										label={noLabels ? null : $L('month')}
										max={maxMonths}
										min={1}
										onChange={onChangeMonth}
										onSpotlightDisappear={onSpotlightDisappear}
										onSpotlightLeft={isLeft ? onSpotlightLeft : null}
										onSpotlightRight={isRight ? onSpotlightRight : null}
										spotlightDisabled={spotlightDisabled}
										value={month}
										width={2}
										wrap
									/>
								);
							case 'y':
								return (
									<DateComponentRangePicker
										className={css.year}
										key="year-picker"
										label={noLabels ? null : $L('year')}
										max={maxYear}
										min={minYear}
										onChange={onChangeYear}
										onSpotlightDisappear={onSpotlightDisappear}
										onSpotlightLeft={isLeft ? onSpotlightLeft : null}
										onSpotlightRight={isRight ? onSpotlightRight : null}
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
