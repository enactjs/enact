import {forKey, forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import $L from '../internal/$L';
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
 * {@link moonstone/TimePicker/TimePickerBase.HourPicker} is a utility component to prevent the
 * animation of the picker when the display text doesn't change for 12-hour locales.
 *
 * @class HourPicker
 * @memberof moonstone/TimePicker/TimePickerBase
 * @ui
 * @private
 */
class HourPicker extends React.Component {
	static propTypes = {
		children: PropTypes.arrayOf(PropTypes.string),
		value: PropTypes.number
	}

	constructor () {
		super();

		this.state = {
			noAnimation: false
		};
	}

	componentWillReceiveProps (nextProps) {
		const {children, value} = this.props;
		const {children: nextChildren, value: nextValue} = nextProps;

		this.setState({
			noAnimation: children[value] === nextChildren[nextValue]
		});
	}

	render () {
		return (
			<DateComponentPicker {...this.props} {...this.state} />
		);
	}
}

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
		hour: PropTypes.number.isRequired,

		/**
		 * The `minute` component of the time
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		minute: PropTypes.number.isRequired,

		/**
		 * The order in which the component pickers are displayed. Should be an array of 2 or 3
		 * strings containing one of `'h'`, `'k'`, `'m'`, and `'a'`.
		 *
		 * @type {String[]}
		 * @required
		 * @public
		 */
		order: PropTypes.arrayOf(PropTypes.oneOf(['h', 'k', 'm', 'a'])).isRequired,

		/**
		 * The primary text of the item.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		title: PropTypes.string.isRequired,

		/**
		 * The `meridiem` component of the time
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		meridiem: PropTypes.number,

		/**
		 * String of meridiem for picker label
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		meridiemLabel: PropTypes.string,

		/**
		 * Array of meridiem labels to display
		 *
		 * @type {String[]}
		 * @required
		 * @public
		 */
		meridiems: PropTypes.arrayOf(PropTypes.string),

		/**
		 * When `true`, omits the labels below the pickers
		 *
		 * @type {Boolean}
		 * @public
		 */
		noLabels: PropTypes.bool,

		/**
		 * Handler for changes in the `hour` component of the time
		 *
		 * @type {Function}
		 * @public
		 */
		onChangeHour: PropTypes.func,

		/**
		 * Handler for changes in the `meridiem` component of the time
		 *
		 * @type {Function}
		 * @public
		 */
		onChangeMeridiem: PropTypes.func,

		/**
		 * Handler for changes in the `minute` component of the time
		 *
		 * @type {Function}
		 * @public
		 */
		onChangeMinute: PropTypes.func,

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
		spotlightDisabled: false
	},

	styles: {
		css,
		className: 'timePicker'
	},

	handlers: {
		handlePickerKeyDown: handle(
			forKey('enter'),
			forward('onClose')
		)
	},

	computed: {
		hasMeridiem: ({order}) => order.indexOf('a') >= 0
	},

	render: ({
		handlePickerKeyDown,
		hasMeridiem,
		hour,
		meridiem,
		meridiemLabel,
		meridiems,
		minute,
		noLabels,
		onChangeHour,
		onChangeMeridiem,
		onChangeMinute,
		onSpotlightDisappear,
		onSpotlightLeft,
		onSpotlightRight,
		order,
		rtl,
		spotlightDisabled,
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
					<div className={css.timeComponents}>
						{order.map((picker, index) => {
							// although we create a component array based on the provided
							// order, we ultimately force order in CSS for RTL
							const isFirst = index === 0;
							const isLast = index === order.length - 1;
							// meridiem will always be the left-most control in RTL, regardless of the provided order
							const isLeft = rtl && picker === 'a' || isFirst && !rtl;
							// minute will always be the right-most control in RTL, regardless of the provided order
							const isRight = rtl && picker === 'm' || isLast && !rtl;

							switch (picker) {
								case 'h':
								case 'k':
									return (
										<HourPicker
											className={css.hourComponents}
											key="hour-picker"
											label={noLabels ? null : $L('hour')}
											onChange={onChangeHour}
											onSpotlightDisappear={onSpotlightDisappear}
											onSpotlightLeft={isLeft ? onSpotlightLeft : null}
											onSpotlightRight={isRight ? onSpotlightRight : null}
											spotlightDisabled={spotlightDisabled}
											value={hour}
											width={2}
											wrap
										>
											{hasMeridiem ? hours12 : hours24}
										</HourPicker>
									);
								case 'm':
									return (
										<DateComponentRangePicker
											className={css.minutesComponents}
											key="minute-picker"
											label={noLabels ? null : $L('minute')}
											max={59}
											min={0}
											onChange={onChangeMinute}
											onSpotlightDisappear={onSpotlightDisappear}
											onSpotlightLeft={isLeft ? onSpotlightLeft : null}
											onSpotlightRight={isRight ? onSpotlightRight : null}
											spotlightDisabled={spotlightDisabled}
											padded
											value={minute}
											width={2}
											wrap
										/>
									);
								case 'a':
									return (
										<DateComponentPicker
											aria-valuetext={meridiems ? meridiems[meridiem] : null}
											className={css.meridiemComponent}
											key="meridiem-picker"
											label={noLabels ? null : meridiemLabel}
											onChange={onChangeMeridiem}
											onSpotlightDisappear={onSpotlightDisappear}
											onSpotlightLeft={isLeft ? onSpotlightLeft : null}
											onSpotlightRight={isRight ? onSpotlightRight : null}
											reverse
											spotlightDisabled={spotlightDisabled}
											value={meridiem}
											width={4}
											wrap
										>
											{meridiems}
										</DateComponentPicker>
									);
							}

							return null;
						})}
					</div>
				</div>
			</ExpandableItemBase>
		);
	}
});

export default TimePickerBase;
export {TimePickerBase};
