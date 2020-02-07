// Type definitions for moonstone/DatePicker

import { ExpandableItemBaseProps as moonstone_ExpandableItem_ExpandableItemBaseProps } from "@enact/moonstone/ExpandableItem";
import * as React from "react";
import { ToggleableProps as ui_Toggleable_ToggleableProps } from "@enact/ui/Toggleable";
import { RadioDecoratorProps as ui_RadioDecorator_RadioDecoratorProps } from "@enact/ui/RadioDecorator";
import { ChangeableProps as ui_Changeable_ChangeableProps } from "@enact/ui/Changeable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface DatePickerBaseProps
  extends moonstone_ExpandableItem_ExpandableItemBaseProps {
  /**
   * The  `day`  component of the Date.
   *
   * The value should be a number between 1 and  `maxDays` .
   */
  day: number;
  /**
   * The number of days in the month.
   */
  maxDays: number;
  /**
   * The number of months in the year.
   */
  maxMonths: number;
  /**
   * The  `month`  component of the Date.
   *
   * The value should be a number between 1 and  `maxMonths` .
   */
  month: number;
  /**
   * The order in which the component pickers are displayed.
   *
   * The value should be an array of 3 strings containing one of  `'m'` ,  `'d'` , and  `'y'` .
   */
  order: string[];
  /**
   * The primary text of the item.
   */
  title: string;
  /**
   * The  `year`  component of the Date.
   */
  year: number;
  /**
   * Disables voice control.
   */
  "data-webos-voice-disabled"?: boolean;
  /**
   * The "aria-label" for the day picker.
   */
  dayAriaLabel?: string;
  /**
 * The label displayed below the day picker.
 * 
 * This prop will also be appended to the current value and set as "aria-valuetext" on the
picker when the value changes.
 */
  dayLabel?: string;
  /**
   * The maximum selectable  `year`  value.
   */
  maxYear?: number;
  /**
   * The minimum selectable  `year`  value.
   */
  minYear?: number;
  /**
   * The "aria-label" for the month picker.
   */
  monthAriaLabel?: string;
  /**
 * The label displayed below the month picker.
 * 
 * This prop will also be appended to the current value and set as "aria-valuetext" on the
picker when the value changes.
 */
  monthLabel?: string;
  /**
   * Omits the labels below the pickers.
   */
  noLabels?: boolean;
  /**
   * Called when the  `date`  component of the Date changes.
   */
  onChangeDate?: Function;
  /**
   * Called when the  `month`  component of the Date changes.
   */
  onChangeMonth?: Function;
  /**
   * Called when the  `year`  component of the Date changes.
   */
  onChangeYear?: Function;
  /**
   * Called when the user requests the expandable close.
   */
  onClose?: Function;
  /**
   * Called when the component is removed when it had focus.
   */
  onSpotlightDisappear?: Function;
  /**
   * Called prior to focus leaving the expandable when the 5-way left key is pressed.
   */
  onSpotlightLeft?: Function;
  /**
   * Called prior to focus leaving the expandable when the 5-way right key is pressed.
   */
  onSpotlightRight?: Function;
  /**
   * Disables 5-way spotlight from navigating into the component.
   */
  spotlightDisabled?: boolean;
  /**
   * The "aria-label" for the year picker.
   */
  yearAriaLabel?: string;
  /**
 * The label displayed below the year picker.
 * 
 * This prop will also be appended to the current value and set as "aria-valuetext" on the
picker when the value changes.
 */
  yearLabel?: string;
}
/**
 * A date selection component.
 * 
 * This component is most often not used directly but may be composed within another component as it
is within  DatePicker  .
 */

export class DatePickerBase extends React.Component<
  DatePickerBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface DatePickerProps
  extends Omit<
    Merge<
      Merge<
        Merge<DatePickerBaseProps, ui_Toggleable_ToggleableProps>,
        ui_RadioDecorator_RadioDecoratorProps
      >,
      ui_Changeable_ChangeableProps
    >,
    "day" | "maxDays" | "maxMonths" | "month" | "order" | "year"
  > {
  /**
   * The initial value used when  `open`  is not set.
   */
  defaultOpen?: boolean;
  /**
   * The initial value used when  `value`  is not set.
   */
  defaultValue?: Date;
  /**
   * Opens the component to display the date component pickers.
   */
  open?: boolean;
  /**
   * The selected date
   */
  value?: Date;
}
/**
 * An expand date selection component, ready to use in Moonstone applications.
 * 
 * `DatePicker`  may be used to select the year, month, and day. It uses a standard  `Date`  object for
its  `value`  which can be shared as the  `value`  for a
 TimePicker   to select both a date and time.
 * 
 * By default,  `DatePicker`  maintains the state of its  `value`  property. Supply the
 `defaultValue`  property to control its initial value. If you wish to directly control updates
to the component, supply a value to  `value`  at creation time and update it in response to
 `onChange`  events.
 * 
 * `DatePicker`  is an expandable component and it maintains its open/closed state by default. The
initial state can be supplied using  `defaultOpen` . In order to directly control the open/closed
state, supply a value for  `open`  at creation time and update its value in response to
 `onClose` / `onOpen`  events.
 * 
 * Usage:
 * ```
<DatePicker
 defaultValue={selectedDate}
 onChange={handleChange}
 title="Select Date"
/>
```
 */

export class DatePicker extends React.Component<
  DatePickerProps & React.HTMLProps<HTMLElement>
> {}

export default DatePicker;
