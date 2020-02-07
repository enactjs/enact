// Type definitions for moonstone/TimePicker

import * as React from "react";
import { ToggleableProps as ui_Toggleable_ToggleableProps } from "@enact/ui/Toggleable";
import { RadioDecoratorProps as ui_RadioDecorator_RadioDecoratorProps } from "@enact/ui/RadioDecorator";
import { ChangeableProps as ui_Changeable_ChangeableProps } from "@enact/ui/Changeable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface TimePickerBaseProps {
  /**
   * The  `hour`  component of the time.
   */
  hour: number;
  /**
   * The  `minute`  component of the time.
   */
  minute: number;
  /**
   * The order in which the component pickers are displayed.
   *
   * Should be an array of 2 or 3 strings containing one of  `'h'` ,  `'k'` ,  `'m'` , and  `'a'` .
   */
  order: string[];
  /**
   * The primary text of the item.
   */
  title: string;
  /**
   * Disables voice control.
   */
  "data-webos-voice-disabled"?: boolean;
  /**
   * The "aria-label" for the hour picker
   */
  hourAriaLabel?: string;
  /**
   * Sets the hint string read when focusing the hour picker.
   */
  hourLabel?: string;
  /**
   * The  `meridiem`  component of the time.
   */
  meridiem: number;
  /**
   * The "aria-label" for the meridiem picker.
   */
  meridiemAriaLabel?: string;
  /**
   * The hint string read when focusing the meridiem picker.
   */
  meridiemLabel?: string;
  /**
   * Array of meridiem labels to display.
   */
  meridiems: string[];
  /**
   * The "aria-label" for the minute picker.
   */
  minuteAriaLabel?: string;
  /**
   * Sets the hint string read when focusing the minute picker.
   */
  minuteLabel?: string;
  /**
   * Omits the labels below the pickers.
   */
  noLabels?: boolean;
  /**
   * Called on changes in the  `hour`  component of the time.
   */
  onChangeHour?: Function;
  /**
   * Called on changes in the  `meridiem`  component of the time.
   */
  onChangeMeridiem?: Function;
  /**
   * Called on changes in the  `minute`  component of the time.
   */
  onChangeMinute?: Function;
  /**
   * Called when a condition occurs which should cause the expandable to close.
   */
  onClose?: Function;
  /**
   * Called when the component is removed while retaining focus.
   */
  onSpotlightDisappear?: Function;
  /**
   * Called when the focus leaves the expandable when the 5-way left key is pressed.
   */
  onSpotlightLeft?: Function;
  /**
   * Called when the focus leaves the expandable when the 5-way right key is pressed.
   */
  onSpotlightRight?: Function;
  /**
   * Disables spotlight navigation into the component.
   */
  spotlightDisabled?: boolean;
}
/**
 *   is the stateless functional time picker
component. Should not be used directly but may be composed within another component as it is
within   .
 */

export class TimePickerBase extends React.Component<
  TimePickerBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface TimePickerProps
  extends Merge<
    Merge<ui_Toggleable_ToggleableProps, ui_RadioDecorator_RadioDecoratorProps>,
    ui_Changeable_ChangeableProps
  > {
  /**
   * Default value
   */
  defaultValue?: number;
  /**
   * The primary text of the item.
   */
  title: string;
  /**
   * Omits the labels below the pickers.
   */
  noLabels?: boolean;
  /**
   * Called when a condition occurs which should cause the expandable to close.
   */
  onClose?: Function;
  /**
   * The selected date.
   */
  value?: Date;
}
/**
 * A component that allows displaying or selecting time.
 * 
 * Set the  value   property to a standard JavaScript
 Date     object to initialize the picker.
 * 
 * By default,  `TimePicker`  maintains the state of its  `value`  property. Supply the
 `defaultValue`  property to control its initial value. If you wish to directly control updates
to the component, supply a value to  `value`  at creation time and update it in response to
 `onChange`  events.
 * 
 * It is expandable and it maintains its open/closed state by default.  `defaultOpen`  can be used to
set the initial state. For the direct control of its open/closed state, supply a value for
 `open`  at creation time and update its value in response to  `onClose` / `onOpen`  events.
 */

export class TimePicker extends React.Component<
  TimePickerProps & React.HTMLProps<HTMLElement>
> {}

export default TimePicker;
