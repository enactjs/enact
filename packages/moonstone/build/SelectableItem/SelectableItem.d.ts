// Type definitions for moonstone/SelectableItem

import { ToggleItemBaseProps as moonstone_ToggleItem_ToggleItemBaseProps } from "@enact/moonstone/ToggleItem";
import * as React from "react";
import { ToggleItemDecoratorProps as moonstone_ToggleItem_ToggleItemDecoratorProps } from "@enact/moonstone/ToggleItem";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface SelectableItemBaseProps
  extends Omit<moonstone_ToggleItem_ToggleItemBaseProps, "iconComponent"> {
  /**
 * Customizes the component by mapping the supplied collection of CSS class names to the
corresponding internal Elements and states of this component.
 * 
 * The following classes are supported:
 * *  `selectableItem`  - The root class name
 */
  css?: object;
}
/**
 * Renders an  Item   with a circle icon, by default.
 */

export class SelectableItemBase extends React.Component<
  SelectableItemBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface SelectableItemDecoratorProps
  extends moonstone_ToggleItem_ToggleItemDecoratorProps {}
export function SelectableItemDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & SelectableItemDecoratorProps>;

export interface SelectableItemProps
  extends Merge<SelectableItemBaseProps, SelectableItemDecoratorProps> {}
/**
 * A Moonstone-styled item with a toggle icon, marqueed text, and  `Spotlight`  focus.
 */

export class SelectableItem extends React.Component<
  SelectableItemProps & React.HTMLProps<HTMLElement>
> {}

export default SelectableItem;
