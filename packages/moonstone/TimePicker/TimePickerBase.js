import {$L} from '@enact/i18n';
import kind from '@enact/core/kind';
import React from 'react';

import {DateComponentPicker, DateComponentRangePicker} from '../internal/DateComponentPicker';
import {ExpandableItemBase} from '../ExpandableItem';

import css from './TimePicker.less';
import {dateComponentPickers} from '../internal/DateComponentPicker/DateComponentPicker.less';

// values to use in hour picker for 24 and 12 hour locales
const hours24 = [
	'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
	'12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'
];
const hours12 = [
	'12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
	'12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'
];

/**
* {@link moonstone/TimePicker.TimePickerBase} is the stateless functional time picker
* component. Should not be used directly but may be composed within another component as it is
* within {@link moonstone/TimePicker.TimePicker}.
*
* @class TimePickerBase
* @memberof moonstone/TimePicker
* @ui
* @private
*/
const TimePickerBase = kind({
	name: 'TimePickerBase',

	propTypes: /** @lends moonstone/TimePicker.TimePickerBase.prototype */ {
		/**
		 * The `hour` component of the Date
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		hour: React.PropTypes.number.isRequired,

		/**
		 * The `meridiem` component of the time
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		meridiem: React.PropTypes.number.isRequired,

		/**
		 * Array of meridiem labels to display
		 *
		 * @type {String[]}
		 * @required
		 * @public
		 */
		meridiems: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,

		/**
		 * The `minute` component of the time
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		minute: React.PropTypes.number.isRequired,

		/**
		 * The order in which the component pickers are displayed. Should be an array of 2 or 3
		 * strings containing one of `'h'`, `'k'`, `'m'`, and `'a'`.
		 *
		 * @type {String[]}
		 * @required
		 * @public
		 */
		order: React.PropTypes.arrayOf(React.PropTypes.oneOf(['h', 'k', 'm', 'a'])).isRequired,

		/**
		 * When `true`, prevents the hour picker from animation. Useful when changing the meridiem
		 * for locales that only have 2 meridiems.
		 *
		 * @type {Boolean}
		 * @public
		 */
		noHourAnimation: React.PropTypes.bool,

		/**
		 * When `true`, omits the labels below the pickers
		 *
		 * @type {Boolean}
		 * @public
		 */
		noLabels: React.PropTypes.bool,

		/**
		 * Handler for changes in the `hour` component of the time
		 *
		 * @type {Function}
		 * @public
		 */
		onChangeHour: React.PropTypes.func,

		/**
		 * Handler for changes in the `meridiem` component of the time
		 *
		 * @type {Function}
		 * @public
		 */
		onChangeMeridiem: React.PropTypes.func,

		/**
		 * Handler for changes in the `minute` component of the time
		 *
		 * @type {Function}
		 * @public
		 */
		onChangeMinute: React.PropTypes.func
	},

	styles: {
		css,
		className: 'timePicker'
	},

	computed: {
		hasMeridiem: ({order}) => order.indexOf('a') >= 0
	},

	render: ({hasMeridiem, hour, meridiem, meridiems, minute, noHourAnimation, noLabels, onChangeHour, onChangeMeridiem, onChangeMinute, order, ...rest}) => {
		return (
			<ExpandableItemBase {...rest} showLabel="always" autoClose={false} lockBottom={false}>
				<div className={dateComponentPickers}>
					<div className={css.timeComponents}>
						{order.map(picker => {
							switch (picker) {
								case 'h':
								case 'k':
									return (
										<DateComponentPicker
											key="hour-picker"
											label={noLabels ? null : $L('hour')}
											noAnimation={noHourAnimation}
											onChange={onChangeHour}
											reverse
											value={hour}
											width={2}
											wrap
										>
											{hasMeridiem ? hours12 : hours24}
										</DateComponentPicker>
									);
								case 'm':
									return (
										<DateComponentRangePicker
											key="minute-picker"
											label={noLabels ? null : $L('minute')}
											max={59}
											min={0}
											onChange={onChangeMinute}
											padded
											value={minute}
											width={2}
											wrap
										/>
									);
							}

							return null;
						})}
					</div>
					{!hasMeridiem ? null : (
						// eslint-disable-next-line react/jsx-indent
						<DateComponentPicker
							key="meridiem-picker"
							label={noLabels ? null : $L('meridiem')}
							onChange={onChangeMeridiem}
							value={meridiem}
							width="small"
							wrap
						>
							{meridiems}
						</DateComponentPicker>
					)}
				</div>
			</ExpandableItemBase>
		);
	}
});

export default TimePickerBase;
export {TimePickerBase};
