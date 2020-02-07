// Type definitions for moonstone/FormCheckboxItem

import { ToggleItemProps as moonstone_ToggleItem_ToggleItemProps } from "@enact/moonstone/ToggleItem";
import * as React from "react";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface FormCheckboxItemProps
  extends Omit<moonstone_ToggleItem_ToggleItemProps, "iconComponent"> {
  /**
 * Customizes the component by mapping the supplied collection of CSS class names to the
corresponding internal Elements and states of this component.
 * 
 * The following classes are supported:
 * *  `formCheckboxItem`  - The root class name
 */
  css?: object;
}
/**
 * Renders a form item with a checkbox component. Useful to show a selected state on an item inside a form.
 */

export class FormCheckboxItem extends React.Component<
  FormCheckboxItemProps & React.HTMLProps<HTMLElement>
> {}

export default FormCheckboxItem;
