// Type definitions for moonstone/RangePicker

import * as React from "react";
import { ChangeableProps as ui_Changeable_ChangeableProps } from "@enact/ui/Changeable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface RangePickerBaseProps {
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
   * Current value.
   */
  value: number;
  /**
   * The  `aria-valuetext`  for the picker.
   *
   * By default,  `aria-valuetext`  is set to the current selected child value.
   */
  "aria-valuetext"?: string;
  /**
   * Children from which to pick.
   */
  children?: React.ReactNode;
  /**
   * Class name for component.
   */
  className?: string;
  /**
 * A custom icon for the decrementer.
 * 
 * All strings supported by  Icon   are supported. Without a
custom icon, the default is used, and is automatically changed when the
 orientation   is changed.
 */
  decrementIcon?: string;
  /**
   * Disables the picker.
   */
  disabled?: boolean;
  /**
 * A custom icon for the incrementer.
 * 
 * All strings supported by  Icon   are supported. Without a
custom icon, the default is used, and is automatically changed when the
 orientation   is changed.
 */
  incrementIcon?: string;
  /**
 * Allows the user can use the arrow keys to adjust the picker's value.
 * 
 * The user may no longer use those arrow keys to navigate while this control is focused.
A default control allows full navigation, but requires individual ENTER presses on the
incrementer and decrementer buttons. Pointer interaction is the same for both formats.
 */
  joined?: boolean;
  /**
 * Disables animation.
 * 
 * By default, the picker will animate transitions between items, provided a  `width`  is
defined.
 */
  noAnimation?: boolean;
  /**
   * Called when  `value`  changes.
   */
  onChange?: Function;
  /**
   * Orientation of the picker.
   *
   * Controls whether the buttons are arranged horizontally or vertically around the value.
   * *  Values:  `'horizontal'` ,  `'vertical'`
   */
  orientation?: string;
  /**
 * Pads the display value with zeros up to the number of digits of  `min`  or max`, whichever
is greater.
 */
  padded?: boolean;
  /**
 * The smallest value change allowed for the picker.
 * 
 * For example, a step of  `2`  would cause the picker to increment from 0 to 2 to 4, etc.
It must evenly divide into the range designated by  `min`  and  `max` .
 */
  step?: number;
  /**
 * The width of the picker.
 * 
 * A number can be used to set the minimum number of characters to be shown. Setting a
number to less than the number of characters in the longest value will cause the width to
grow for the longer values.
 * 
 * A string can be used to select from pre-defined widths:
 * *  `'small'`  - numeric values
 * *  `'medium'`  - single or short words
 * *  `'large'`  - maximum-sized pickers taking full width of its parent
 * 
 * By default, the picker will size according to the longest valid value.
 */
  width?: string | number;
  /**
 * Allows picker to continue from the start of the list after it reaches the end and
vice-versa.
 */
  wrap?: boolean;
}
/**
 * RangePicker base component.
 */

export class RangePickerBase extends React.Component<
  RangePickerBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface RangePickerProps extends ui_Changeable_ChangeableProps {
  /**
   * Default value
   */
  defaultValue?: number;
}
/**
 * A component that lets the user select a number from a range of numbers.
 * 
 * By default,  `RangePicker`  maintains the state of its  `value`  property. Supply the  `defaultValue` 
property to control its initial value. If you wish to directly control updates to the component,
supply a value to  `value`  at creation time and update it in response to  `onChange`  events.
 */

export class RangePicker extends React.Component<
  RangePickerProps & React.HTMLProps<HTMLElement>
> {}

export default RangePicker;
