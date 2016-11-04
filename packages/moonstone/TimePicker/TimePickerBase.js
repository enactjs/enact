import {$L} from '@enact/i18n';
import kind from '@enact/core/kind';
import React from 'react';

import {DateComponentPicker, DateComponentRangePicker} from '../internal/DateComponentPicker';
import {ExpandableItemBase} from '../ExpandableItem';

import css from './TimePicker.less';

// values to use in hour picker for 24 and 12 hour locales
const hours24 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
				'13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
const hours12 = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
				'1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

/**
* {@link module:@enact/moonstone/TimePicker~TimePickerBase} is the stateless functional date picker
* component. Should not be used directly but may be composed within another component as it is
* within {@link module:@enact/moonstone/TimePicker~TimePicker}.
*
* @class TimePickerBase
* @ui
* @private
*/
const TimePickerBase = kind({
	name: 'TimePicker',

	propTypes: {
		/**
		 * The `hour` component of the Date
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		hour: React.PropTypes.number.isRequired,

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
		 * When `true`, prevents the hour picker from animation. Useful when changing the merdiem
		 * for locales that only have 2 meridiems.
		 *
		 * @type {Boolean}
		 * @public
		 */
		noHourAnimation: React.PropTypes.bool,

		/**
		 * Handler for changes in the `date` component of the time
		 *
		 * @type {Function}
		 * @public
		 */
		onChangeHour: React.PropTypes.func,

		/**
		 * Handler for changes in the `month` component of the time
		 *
		 * @type {Function}
		 * @public
		 */
		onChangeMinute: React.PropTypes.func,

		/**
		 * Handler for changes in the `year` component of the time
		 *
		 * @type {Function}
		 * @public
		 */
		onChangeMeridiem: React.PropTypes.func,

		/**
		 * When `true`, omits the labels below the pickers
		 *
		 * @type {Boolean}
		 * @public
		 */
		noLabels: React.PropTypes.bool
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
			<ExpandableItemBase {...rest} showLabel="always">
				<div className={css.dateComponents}>
					{order.map(picker => {
						switch (picker) {
							case 'h':
							case 'k':
								return (
									<DateComponentPicker
										key="hour-picker"
										label={noLabels || $L('hour')}
										value={hour}
										onChange={onChangeHour}
										noAnimation={noHourAnimation}
										wrap
									>
										{hasMeridiem ? hours12 : hours24}
									</DateComponentPicker>
									);
							case 'm':
								return (
									<DateComponentRangePicker
										key="minute-picker"
										label={noLabels || $L('minute')}
										min={1}
										max={59}
										value={minute}
										onChange={onChangeMinute}
										padded
										wrap
									/>
								);
							case 'a':
								return (
									<DateComponentPicker
										key="meridiem-picker"
										label={noLabels || $L('meridiem')}
										value={meridiem}
										onChange={onChangeMeridiem}
										wrap
									>
										{meridiems}
									</DateComponentPicker>
								);
						}

						return null;
					})}
				</div>
			</ExpandableItemBase>
		);
	}
});

export default TimePickerBase;
export {TimePickerBase};
