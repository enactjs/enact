// Type definitions for moonstone/EditableIntegerPicker

import * as React from "react";
import { ChangeableProps as ui_Changeable_ChangeableProps } from "@enact/ui/Changeable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface EditableIntegerPickerBaseProps {
  /**
 * The maximum value selectable by the picker (inclusive).
 * 
 * The range between  `min`  and  `max`  should be evenly divisible by
 step  .
 */
  max: number;
  /**
 * The minimum value selectable by the picker (inclusive).
 * 
 * The range between  `min`  and  `max`  should be evenly divisible by
 step  .
 */
  min: number;
  /**
   * The value for the picker for accessibility read out.
   *
   * By default,  `aria-valuetext`  is set to the current selected child value.
   */
  "aria-valuetext"?: string;
  /**
 * The icon for the decrementer.
 * 
 * All strings supported by  Icon   are supported. Without a
custom icon, the default is used.
 */
  decrementIcon?: string;
  /**
 * Disables the picker and prevents  events  
from firing.
 */
  disabled?: boolean;
  /**
   * Displays the input field instead of the picker components.
   */
  editMode?: boolean;
  /**
 * The icon for the incrementer.
 * 
 * All strings supported by  Icon   are supported. Without a
custom icon, the default is used.
 */
  incrementIcon?: string;
  /**
   * Called when there the input is blurred.
   */
  onInputBlur?: Function;
  /**
 * Called when the pickerItem is clicked and  `editMode`  is  `false` .
 * 
 * In response, the  `editMode`  should be switched to  `true`  to enable editing. This is
automatically handled by   .
 */
  onPickerItemClick?: Function;
  /**
   * The orientation of the picker.
   */
  orientation?: "horizontal" | "vertical";
  /**
 * Pads the display value with zeros.
 * 
 * The number of zeros used is the number of digits of the value of
 min   or
 max  , whichever is
greater.
 */
  padded?: boolean;
  /**
 * Allow the picker to only increment or decrement by a given value.
 * 
 * For example, a step of  `2`  would cause a picker to increment from 10 to 12 to 14, etc.
It must evenly divide into the range designated by  `min`  and  `max` .
 */
  step?: number;
  /**
   * Unit label to be appended to the value for display.
   */
  unit?: string;
  /**
   * The current value of the Picker.
   */
  value?: number;
  /**
 * The size of the picker.
 * 
 * `'small'` ,  `'medium'` ,  `'large'` , or set to  `null`  to assume auto-sizing.  `'small'`  is
good for numeric pickers,  `'medium'`  for single or short word pickers,  `'large'`  for
maximum-sized pickers.
 * 
 * You may also supply a number which will determine the minumum size of the Picker.
Setting a number to less than the number of characters in your longest value may produce
unexpected results.
 */
  width?: "small" | "medium" | "large" | number;
  /**
   * Allows the picker to increment from the max to min value and vice versa.
   */
  wrap?: boolean;
}
/**
 * A picker component that lets the user select a number in between  `min`  and  `max`  numbers.
 * 
 * This component is not spottable. Developers are encouraged to use
  .
 */

export class EditableIntegerPickerBase extends React.Component<
  EditableIntegerPickerBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface EditableIntegerPickerProps
  extends Merge<
    EditableIntegerPickerBaseProps,
    ui_Changeable_ChangeableProps
  > {}
/**
 * A component that lets the user select a number from a range of numbers.
 * 
 * By default,  `EditableIntegerPicker`  maintains the state of its  `value`  property. Supply the
 `defaultValue`  property to control its initial value. If you wish to directly control updates to
the component, supply a value to  `value`  at creation time and update it in response to  `onChange` 
events.
 */

export class EditableIntegerPicker extends React.Component<
  EditableIntegerPickerProps & React.HTMLProps<HTMLElement>
> {}

export default EditableIntegerPicker;
