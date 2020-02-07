// Type definitions for moonstone/Picker

import * as React from "react";
import { ChangeableProps as ui_Changeable_ChangeableProps } from "@enact/ui/Changeable";
import { MarqueeControllerProps as moonstone_Marquee_MarqueeControllerProps } from "@enact/moonstone/Marquee";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface PickerBaseProps {
  /**
   * Picker value list.
   */
  children: React.ReactNode;
  /**
   * The  `aria-valuetext`  for the picker.
   *
   * By default,  `aria-valuetext`  is set to the current selected child text.
   */
  "aria-valuetext"?: string;
  /**
 * The voice control labels for the  `children` .
 * 
 * By default,  `data-webos-voice-labels-ext`  is generated from  `children` . However, if
 `children`  is not an array of numbers or strings,  `data-webos-voice-labels-ext`  should be
set to an array of labels.
 */
  "data-webos-voice-labels-ext"?: number[] | string[];
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
 * Allows the user to use the arrow keys to adjust the picker's value.
 * 
 * Key presses are captured in the directions of the increment and decrement buttons but
others are unaffected. A non-joined Picker allows navigation in any direction, but
requires individual ENTER presses on the incrementer and decrementer buttons. Pointer
interaction is the same for both formats.
 */
  joined?: boolean;
  /**
 * Disables marqueeing of items.
 * 
 * By default, each picker item is wrapped by a
 `MarqueeText`  . When this is set, the items will
not be wrapped.
 */
  marqueeDisabled?: boolean;
  /**
   * Disables transition animation.
   */
  noAnimation?: boolean;
  /**
   * Called when the  `value`  changes.
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
   * Index of the selected child.
   */
  value?: number;
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
 * The base  `Picker`  component.
 *
 * This version is not  `spottable`  .
 */

export class PickerBase extends React.Component<
  PickerBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface PickerProps
  extends Merge<
    ui_Changeable_ChangeableProps,
    moonstone_Marquee_MarqueeControllerProps
  > {
  /**
   * Default index of the selected child.
   *
   * _Note_ : Changing  `defaultValue`  after initial render has no effect.
   */
  defaultValue?: number;
}
/**
 * A Picker component that allows selecting values from a list of values.
 * 
 * By default,  `RangePicker`  maintains the state of its  `value`  property. Supply the  `defaultValue` 
property to control its initial value. If you wish to directly control updates to the component,
supply a value to  `value`  at creation time and update it in response to  `onChange`  events.
 */

export class Picker extends React.Component<
  PickerProps & React.HTMLProps<HTMLElement>
> {}

export default Picker;
