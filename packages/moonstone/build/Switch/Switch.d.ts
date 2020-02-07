// Type definitions for moonstone/Switch

import { ToggleIconProps as moonstone_ToggleIcon_ToggleIconProps } from "@enact/moonstone/ToggleIcon";
import * as React from "react";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface SwitchProps extends moonstone_ToggleIcon_ToggleIconProps {
  /**
   * Disables animation.
   */
  noAnimation?: boolean;
}
/**
 * Renders the base level DOM structure of the component.
 */

export class Switch extends React.Component<
  SwitchProps & React.HTMLProps<HTMLElement>
> {}

export default Switch;
