// Type definitions for moonstone/DayPicker

import { ExpandableListBaseProps as moonstone_ExpandableList_ExpandableListBaseProps } from "@enact/moonstone/ExpandableList";
import * as React from "react";
import { ExpandableProps as moonstone_ExpandableItem_ExpandableProps } from "@enact/moonstone/ExpandableItem";
import { ChangeableProps as ui_Changeable_ChangeableProps } from "@enact/ui/Changeable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface DayPickerBaseProps
  extends Omit<moonstone_ExpandableList_ExpandableListBaseProps, "children"> {}
/**
 * A day of the week selection component.
 * 
 * This component is most often not used directly but may be composed within another component as it
is within  DayPicker  .
 */

export class DayPickerBase extends React.Component<
  DayPickerBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface DayPickerProps
  extends Omit<
    Merge<
      Merge<DayPickerBaseProps, moonstone_ExpandableItem_ExpandableProps>,
      ui_Changeable_ChangeableProps
    >,
    "onChange" | "value" | "defaultValue"
  > {
  /**
   * The primary text label for the component.
   */
  title: string;
  /**
   * Called when the user requests the expandable close.
   */
  onClose?: Function;
  /**
   * Called when the user requests the expandable open.
   */
  onOpen?: Function;
  /**
   * Called when an day is selected or unselected.
   *
   * The event payload will be an object with the following members:
   * *  `selected`  - An array of numbers representing the selected days, 0 indexed
   * *  `content`  - Localized string representing the selected days
   */
  onSelect?: Function;
  /**
   * Opens the component to display the day selection components.
   */
  open?: boolean;
  /**
   * An array of numbers (0-indexed) representing the selected days of the week.
   */
  selected?: number | number[];
  /**
 * The "aria-label" for the component.
 * 
 * By default, "aria-label" is set to the title and the full names of the selected days or
the custom text when the weekend, week days, or all days is selected.
 */
  "aria-label"?: string;
  /**
   * The initial value used when  `open`  is not set.
   */
  defaultOpen?: boolean;
  /**
   * The initial value used when  `selected`  is not set.
   */
  defaultSelected?: number | number[];
  /**
   * Disables DayPicker and the control becomes non-interactive.
   */
  disabled?: boolean;
  /**
   * The text displayed in the label when every day is selected
   */
  everyDayText?: string;
  /**
   * The text displayed in the label when every weekeday is selected
   */
  everyWeekdayText?: string;
  /**
   * The text displayed in the label when every weekend day is selected
   */
  everyWeekendText?: string;
}
/**
 * An expandable day of the week selection component, ready to use in Moonstone applications.
 * 
 * `DayPicker`  may be used to select one or more days of the week. Upon selection, it will display
the short names of each day selected or customizable strings when selecting  every
day  ),  every
weekday  , and  every weekend
day  .
 * 
 * By default,  `DayPicker`  maintains the state of its  `selected`  property. Supply the
 `defaultSelected`  property to control its initial value. If you wish to directly control updates
to the component, supply a value to  `selected`  at creation time and update it in response to
 `onChange`  events.
 * 
 * `DayPicker`  is an expandable component and it maintains its open/closed state by default. The
initial state can be supplied using  `defaultOpen` . In order to directly control the open/closed
state, supply a value for  `open`  at creation time and update its value in response to
 `onClose` / `OnOpen`  events.
 * 
 * Usage:
 * ```
<DayPicker
  defaultOpen
  defaultSelected={[2, 3]}
  onSelect={handleSelect}
  title="Select a Day"
/>
```
 */

export class DayPicker extends React.Component<
  DayPickerProps & React.HTMLProps<HTMLElement>
> {}

export default DayPicker;
