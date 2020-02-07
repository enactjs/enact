// Type definitions for moonstone/ToggleButton

import { ButtonProps as moonstone_Button_ButtonProps } from "@enact/moonstone/Button";
import * as React from "react";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface ToggleButtonBaseProps extends moonstone_Button_ButtonProps {
  /**
   * The background-color opacity of this button.
   * *  Values:  `'translucent'` ,  `'lightTranslucent'` ,  `'transparent'`
   */
  backgroundOpacity?: string;
  /**
 * The string to be displayed as the main content of the toggle button.
 * 
 * If  `toggleOffLabel`  and/or  `toggleOnLabel`  are provided, they will be used for the
respective states.
 */
  children?: React.ReactNode;
  /**
   * Disables the button.
   */
  disabled?: boolean;
  /**
 * Enforces a minimum width on the Button.
 * 
 * _NOTE_ : This property's default is  `true`  and must be explicitly set to  `false`  to allow
the button to shrink to fit its contents.
 */
  minWidth?: boolean;
  /**
   * Applies a pressed visual effect.
   */
  pressed?: boolean;
  /**
   * Indicates the button is 'on'.
   */
  selected?: boolean;
  /**
 * The size of the button.
 * 
 * A  `'small'`  button will have a larger tap target than its apparent size to allow it to be
clicked more easily.
 */
  size?: "small" | "large";
  /**
   * Button text displayed in the 'off' state.
   *
   * If not specified,  `children`  will be used for 'off' button text.
   */
  toggleOffLabel?: string;
  /**
   * Button text displayed in the 'on' state.
   *
   * If not specified,  `children`  will be used for 'on' button text.
   */
  toggleOnLabel?: string;
}
/**
 * A stateless  Button   that can be toggled by changing its
 `selected`  property.
 */

export class ToggleButtonBase extends React.Component<
  ToggleButtonBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface ToggleButtonProps extends ToggleButtonBaseProps {}
/**
 * A toggleable button.
 * 
 * By default,  `ToggleButton`  maintains the state of its  `selected`  property.
Supply the  `defaultSelected`  property to control its initial value. If you
wish to directly control updates to the component, supply a value to  `selected`  at creation time
and update it in response to  `onToggle`  events.
 */

export class ToggleButton extends React.Component<
  ToggleButtonProps & React.HTMLProps<HTMLElement>
> {}

export default ToggleButton;
