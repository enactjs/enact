/**
 * Exports the {@link moonstone/DatePicker.DatePicker} and {@link moonstone/DatePicker.DatePickerBase}
 * components.
 *
 * @module moonstone/DatePicker
 */

import {Expandable} from '../ExpandableItem';

import DatePickerBase from './DatePickerBase';
import DatePickerController from './DatePickerController';

/**
 * {@link moonstone/DatePicker.DatePicker} allows the selection (or simply display) of
 * a day, month, and year.
 *
 * Set the [value]{@link moonstone/DatePicker.DatePicker#value} property to a standard
 * JavaScript {@glossary Date} object to initialize the picker.
 *
 * @class DatePicker
 * @memberof moonstone/DatePicker
 * @ui
 * @public
 */
const DatePicker = Expandable(DatePickerController);

export default DatePicker;
export {DatePicker, DatePickerBase, DatePickerController};
