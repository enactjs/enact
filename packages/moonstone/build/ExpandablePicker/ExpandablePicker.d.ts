// Type definitions for moonstone/ExpandablePicker

import { ExpandableItemBaseProps as moonstone_ExpandableItem_ExpandableItemBaseProps } from "@enact/moonstone/ExpandableItem";
import * as React from "react";
import { ExpandableProps as moonstone_ExpandableItem_ExpandableProps } from "@enact/moonstone/ExpandableItem";
import { ChangeableProps as ui_Changeable_ChangeableProps } from "@enact/ui/Changeable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface ExpandablePickerBaseProps
  extends moonstone_ExpandableItem_ExpandableItemBaseProps {
  /**
   * Picker value list.
   */
  children: React.ReactNode;
  /**
   * The "aria-label" for the the check button.
   */
  checkButtonAriaLabel?: string;
  /**
   * Disables voice control.
   */
  "data-webos-voice-disabled"?: boolean;
  /**
   * The  `data-webos-voice-group-label`  for ExpandableItem and Picker.
   */
  "data-webos-voice-group-label"?: string;
  /**
   * The "aria-label" for the decrement button.
   */
  decrementAriaLabel?: string;
  /**
 * A custom icon for the decrementer.
 * 
 * All strings supported by  Icon   are supported. Without a
custom icon, the default is used, and is automatically changed when the
 orientation   is changed.
 */
  decrementIcon?: string;
  /**
   * Disables ExpandablePicker and the control becomes non-interactive.
   */
  disabled?: boolean;
  /**
   * The "aria-label" for the increment button.
   */
  incrementAriaLabel?: string;
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
   * Prevents any transition animation for the component.
   */
  noAnimation?: boolean;
  /**
   * Called when the control should increment or decrement.
   */
  onChange?: Function;
  /**
   * Called when a condition occurs which should cause the expandable to close.
   */
  onClose?: Function;
  /**
   * Called when an item is picked.
   */
  onPick?: Function;
  /**
   * Called when the component is removed while retaining focus.
   */
  onSpotlightDisappear?: Function;
  /**
   * Called prior to focus leaving the expandable when the 5-way down key is pressed.
   */
  onSpotlightDown?: Function;
  /**
   * Called prior to focus leaving the expandable when the 5-way left key is pressed.
   */
  onSpotlightLeft?: Function;
  /**
   * Called prior to focus leaving the expandable when the 5-way right key is pressed.
   */
  onSpotlightRight?: Function;
  /**
   * Opens ExpandablePicker with the contents visible.
   */
  open?: boolean;
  /**
   * Orientation of the picker.
   *
   * Controls whether the buttons are arranged horizontally or vertically around the value.
   * *  Values:  `'horizontal'` ,  `'vertical'`
   */
  orientation?: string;
  /**
   * The "aria-label" for the picker.
   */
  pickerAriaLabel?: string;
  /**
   * Disables spotlight navigation into the component.
   */
  spotlightDisabled?: boolean;
  /**
   * Index of the selected child.
   */
  value?: number;
}
/**
 * A stateless component that renders a list of items into a picker that allows the user to select
only a single item at a time. It supports increment/decrement buttons for selection.
 */

export class ExpandablePickerBase extends React.Component<
  ExpandablePickerBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface ExpandablePickerProps
  extends Merge<
    Merge<ExpandablePickerBaseProps, moonstone_ExpandableItem_ExpandableProps>,
    ui_Changeable_ChangeableProps
  > {}
/**
 * A stateful component that renders a list of items into a picker that allows the user to select
only a single item at a time. It supports increment/decrement buttons for selection.
 * 
 * By default,  `ExpandablePicker`  maintains the state of its  `value`  property. Supply the
 `defaultValue`  property to control its initial value. If you wish to directly control updates
to the component, supply a value to  `value`  at creation time and update it in response to
 `onPick`  events.
 * 
 * `ExpandablePicker`  maintains its open/closed state by default. The initial state can be supplied
using  `defaultOpen` . In order to directly control the open/closed state, supply a value for
 `open`  at creation time and update its value in response to  `onClose` / `onOpen`  events.
 */

export class ExpandablePicker extends React.Component<
  ExpandablePickerProps & React.HTMLProps<HTMLElement>
> {}

export default ExpandablePicker;
