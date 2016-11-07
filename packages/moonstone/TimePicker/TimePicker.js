/**
 * Exports the {@link moonstone/TimePicker.TimePicker},
 * {@link moonstone/TimePicker/TimePickerBase.TimePickerBase}, and
 * {@link moonstone/TimePicker/TimePickerController.TimePickerController} components.
 *
 * @module moonstone/TimePicker
 */

import {Expandable} from '../ExpandableItem';

import TimePickerBase from './TimePickerBase';
import TimePickerController from './TimePickerController';

/**
 * {@link moonstone/TimePicker.TimePicker} allows the selection (or simply display) of a hour,
 * month, and meridiem.
 *
 * Set the [value]{@link moonstone/TimePicker.TimePicker#value} property to a standard JavaScript
 * {@glossary Date} object to initialize the picker.
 *
 * @class TimePicker
 * @memberof moonstone/TimePicker
 * @ui
 * @public
 */
const TimePicker = Expandable(TimePickerController);

export default TimePicker;
export {TimePicker, TimePickerBase, TimePickerController};
