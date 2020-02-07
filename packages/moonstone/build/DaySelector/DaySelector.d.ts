// Type definitions for moonstone/DaySelector

import * as React from "react";
import { ChangeableProps as ui_Changeable_ChangeableProps } from "@enact/ui/Changeable";
import { SkinnableProps as moonstone_Skinnable_SkinnableProps } from "@enact/moonstone/Skinnable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface DaySelectorBaseProps {
  /**
   * Disables DaySelector and the control becomes non-interactive.
   */
  disabled?: boolean;
  /**
   * Called when an day is selected or unselected.
   *
   * The event payload will be an object with the following members:
   * *  `selected`  - An array of numbers representing the selected days, 0 indexed
   * *  `content`  - Localized string representing the selected days
   */
  onSelect?: Function;
  /**
   * An array of numbers (0-indexed) representing the selected days of the week.
   */
  selected?: number | number[];
}
/**
 * A Moonstone styled inline day of the week selection component.
 * 
 * This component is most often not used directly but may be composed within another component as it
is within  DaySelector  .
 */

export class DaySelectorBase extends React.Component<
  DaySelectorBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface DaySelectorDecoratorProps
  extends Merge<
    ui_Changeable_ChangeableProps,
    moonstone_Skinnable_SkinnableProps
  > {
  /**
   * The format for names of days used in the label.
   */
  dayNameLength?: string;
  /**
   * Applies a disabled style and prevents interacting with the component.
   */
  disabled?: boolean;
  /**
   * The text displayed in the label when every day is selected.
   */
  everyDayText?: string;
  /**
   * The text displayed in the label when every weekeday is selected.
   */
  everyWeekdayText?: string;
  /**
   * The text displayed in the label when every weekend day is selected.
   */
  everyWeekendText?: string;
  /**
   * Called when an day is selected or unselected.
   *
   * The event payload will be an object with the following members:
   * *  `selected`  - An array of numbers representing the selected days, 0 indexed
   * *  `content`  - Localized string representing the selected days
   */
  onSelect?: Function;
  /**
   * An array of numbers (0-indexed) representing the selected days of the week.
   */
  selected?: number | number[];
}
export function DaySelectorDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & DaySelectorDecoratorProps>;

export interface DaySelectorProps
  extends Merge<DaySelectorBaseProps, DaySelectorDecoratorProps> {}
/**
 * An inline day of the week selection component, ready to use in Moonstone applications.
 * 
 * `DaySelector`  may be used to select one or more days of the week from a horizontal list of
abbreviated day names.
 * 
 * By default,  `DaySelector`  maintains the state of its  `selected`  property. Supply the
 `defaultSelected`  property to control its initial value. If you wish to directly control updates
to the component, supply a value to  `selected`  at creation time and update it in response to
 `onChange`  events.
 * 
 * Usage:
 * ```
<DaySelector
  defaultSelected={[2, 3]}
  longDayLabels
  onSelect={handleSelect}
/>
```
 */

export class DaySelector extends React.Component<
  DaySelectorProps & React.HTMLProps<HTMLElement>
> {}

export default DaySelector;
