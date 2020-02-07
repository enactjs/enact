// Type definitions for moonstone/ExpandableInput

import { ExpandableItemBaseProps as moonstone_ExpandableItem_ExpandableItemBaseProps } from "@enact/moonstone/ExpandableItem";
import * as React from "react";
import { ExpandableProps as moonstone_ExpandableItem_ExpandableProps } from "@enact/moonstone/ExpandableItem";
import { ChangeableProps as ui_Changeable_ChangeableProps } from "@enact/ui/Changeable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface ExpandableInputBaseProps
  extends moonstone_ExpandableItem_ExpandableItemBaseProps {
  /**
   * The primary text of the item.
   */
  title: string;
  /**
   * Disables ExpandableInput and the control becomes non-interactive.
   */
  disabled?: boolean;
  /**
   * The icon to be placed at the end of the input.
   */
  iconAfter?: string;
  /**
   * The icon to be placed at the beginning of the input.
   */
  iconBefore?: string;
  /**
   * Text to display when no  `value`  is set.
   */
  noneText?: string;
  /**
   * Called when the expandable value is changed.
   */
  onChange?: Function;
  /**
   * Called when a condition occurs which should cause the expandable to close.
   */
  onClose?: Function;
  /**
   * Called when the component is removed while retaining focus.
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
   * Opens the control, with the contents visible.
   */
  open?: boolean;
  /**
   * The placeholder text to display.
   */
  placeholder?: string;
  /**
   * Disables spotlight navigation in the component.
   */
  spotlightDisabled?: boolean;
  /**
   * The type of input. Accepted values correspond to the standard HTML5 input types.
   */
  type?: string;
  /**
   * The value of the input.
   */
  value?: string | number;
}
/**
 * A stateless component that expands to render a   .
 */

export class ExpandableInputBase extends React.Component<
  ExpandableInputBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface ExpandableInputProps
  extends Merge<
    Merge<ExpandableInputBaseProps, moonstone_ExpandableItem_ExpandableProps>,
    ui_Changeable_ChangeableProps
  > {}
/**
 * A stateful component that expands to render a   .
 * 
 * By default,  `ExpandableInput`  maintains the state of its  `value`  property. Supply the
 `defaultValue`  property to control its initial value. If you wish to directly control updates
to the component, supply a value to  `value`  at creation time and update it in response to
 `onChange`  events.
 * 
 * `ExpandableInput`  is an expandable component and it maintains its open/closed state by default.
The initial state can be supplied using  `defaultOpen` . In order to directly control the
open/closed state, supply a value for  `open`  at creation time and update its value in response to
 `onClose` / `onOpen`  events.
 */

export class ExpandableInput extends React.Component<
  ExpandableInputProps & React.HTMLProps<HTMLElement>
> {}

export default ExpandableInput;
