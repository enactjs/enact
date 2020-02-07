// Type definitions for moonstone/Input

import * as React from "react";
import { ChangeableProps as ui_Changeable_ChangeableProps } from "@enact/ui/Changeable";
import { SpottableProps as spotlight_Spottable_SpottableProps } from "@enact/spotlight/Spottable";
import { SkinnableProps as moonstone_Skinnable_SkinnableProps } from "@enact/moonstone/Skinnable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface InputBaseProps {
  /**
   * Disables Input and becomes non-interactive.
   */
  disabled?: boolean;
  /**
   * Blurs the input when the "enter" key is pressed.
   */
  dismissOnEnter?: boolean;
  /**
   * The icon to be placed at the end of the input.
   */
  iconAfter?: string;
  /**
   * The icon to be placed at the beginning of the input.
   */
  iconBefore?: string;
  /**
 * Indicates  value   is invalid and shows
 invalidMessage  , if set.
 */
  invalid?: boolean;
  /**
 * The tooltip text to be displayed when the input is
 invalid  .
 * 
 * If this value is  _falsy_ , the tooltip will not be shown.
 */
  invalidMessage?: string;
  /**
   * Called when blurred.
   */
  onBlur?: Function;
  /**
   * Called when the input value is changed.
   */
  onChange?: Function;
  /**
   * Called when clicked.
   */
  onClick?: Function;
  /**
   * Called when focused.
   */
  onFocus?: Function;
  /**
   * Called when a key is pressed down.
   */
  onKeyDown?: Function;
  /**
   * Text to display when  value   is not set.
   */
  placeholder?: string;
  /**
   * The size of the input field.
   */
  size?: "large" | "small";
  /**
   * The type of input.
   *
   * Accepted values correspond to the standard HTML5 input types.
   */
  type?: string;
  /**
   * The value of the input.
   */
  value?: string | number;
}
/**
 * A Moonstone styled input component.
 * 
 * It supports start and end icons. Note that this base component is not stateless as many other
base components are. However, it does not support Spotlight. Apps will want to use
  .
 */

export class InputBase extends React.Component<
  InputBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface InputProps
  extends Merge<
    Merge<
      Merge<InputBaseProps, ui_Changeable_ChangeableProps>,
      spotlight_Spottable_SpottableProps
    >,
    moonstone_Skinnable_SkinnableProps
  > {
  /**
 * Focuses the internal input when the component gains 5-way focus.
 * 
 * By default, the internal input is not editable when the component is focused via 5-way and must
be selected to become interactive. In pointer mode, the input will be editable when clicked.
 */
  autoFocus?: boolean;
  /**
   * Applies a disabled style and prevents interacting with the component.
   */
  disabled?: boolean;
  /**
   * Sets the initial value.
   */
  defaultValue?: string;
  /**
   * Blurs the input when the "enter" key is pressed.
   */
  dismissOnEnter?: boolean;
  /**
   * Called when the internal input is focused.
   */
  onActivate?: Function;
  /**
   * Called when the internal input loses focus.
   */
  onDeactivate?: Function;
  /**
   * Called when the component is removed when it had focus.
   */
  onSpotlightDisappear?: Function;
  /**
   * Disables spotlight navigation into the component.
   */
  spotlightDisabled?: boolean;
}
/**
 * A Spottable, Moonstone styled input component with embedded icon support.
 * 
 * By default,  `Input`  maintains the state of its  `value`  property. Supply the  `defaultValue` 
property to control its initial value. If you wish to directly control updates to the component,
supply a value to  `value`  at creation time and update it in response to  `onChange`  events.
 */

export class Input extends React.Component<
  InputProps & React.HTMLProps<HTMLElement>
> {}

export default Input;
