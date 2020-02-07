// Type definitions for moonstone/CheckboxItem

import { ToggleItemProps as moonstone_ToggleItem_ToggleItemProps } from "@enact/moonstone/ToggleItem";
import * as React from "react";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface CheckboxItemProps
  extends Omit<moonstone_ToggleItem_ToggleItemProps, "iconComponent"> {
  /**
 * Customizes the component by mapping the supplied collection of CSS class names to the
corresponding internal Elements and states of this component.
 * 
 * The following classes are supported:
 * *  `checkboxItem`  - The root class name
 */
  css?: object;
}
/**
 * An item with a checkbox component, ready to use in Moonstone applications.
 * 
 * `CheckboxItem`  may be used to allow the user to select a single option or used as part of a
 Group   when multiple  selections   are possible.
 * 
 * Usage:
 * ```
<CheckboxItem
	defaultSelected={selected}
	onToggle={handleToggle}
>
 Item with a Checkbox
</CheckboxItem>
```
 */

export class CheckboxItem extends React.Component<
  CheckboxItemProps & React.HTMLProps<HTMLElement>
> {}

export default CheckboxItem;
