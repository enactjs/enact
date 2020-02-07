// Type definitions for moonstone/Checkbox

import { ToggleIconProps as moonstone_ToggleIcon_ToggleIconProps } from "@enact/moonstone/ToggleIcon";
import * as React from "react";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface CheckboxProps extends moonstone_ToggleIcon_ToggleIconProps {
  /**
   * The icon displayed when  `selected` .
   */
  children?: string | object;
}
/**
 * A checkbox component, ready to use in Moonstone applications.
 * 
 * `Checkbox`  may be used independently to represent a toggleable state but is more commonly used as
part of  CheckboxItem  .
 * 
 * Usage:
 * ```
<Checkbox selected />
```
 */

export class Checkbox extends React.Component<
  CheckboxProps & React.HTMLProps<HTMLElement>
> {}

export default Checkbox;
