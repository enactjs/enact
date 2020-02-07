// Type definitions for moonstone/FormCheckbox

import { ToggleIconProps as moonstone_ToggleIcon_ToggleIconProps } from "@enact/moonstone/ToggleIcon";
import * as React from "react";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface FormCheckboxProps
  extends moonstone_ToggleIcon_ToggleIconProps {
  /**
   * The icon to be shown when selected.
   *
   * May be specified as either:
   * *  A string that represents an icon from the  iconList  ,
   * *  An HTML entity string, Unicode reference or hex value (in the form '0x...'),
   * *  A URL specifying path to an icon image, or
   * *  An object representing a resolution independent resource (See   ).
   */
  children?: string;
}
/**
 * A component that represents a Boolean state, and looks like a check mark in a circle.
 */

export class FormCheckbox extends React.Component<
  FormCheckboxProps & React.HTMLProps<HTMLElement>
> {}

export default FormCheckbox;
