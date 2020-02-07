// Type definitions for moonstone/RadioItem

import { ToggleItemProps as moonstone_ToggleItem_ToggleItemProps } from "@enact/moonstone/ToggleItem";
import * as React from "react";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface RadioItemProps
  extends Omit<moonstone_ToggleItem_ToggleItemProps, "iconComponent"> {
  /**
 * Customizes the component by mapping the supplied collection of CSS class names to the
corresponding internal Elements and states of this component.
 * 
 * The following classes are supported:
 * *  `radioItem`  - The root class name
 */
  css?: object;
}
/**
 * Renders an  `Item`  with a radio-dot icon.
 */

export class RadioItem extends React.Component<
  RadioItemProps & React.HTMLProps<HTMLElement>
> {}

export default RadioItem;
