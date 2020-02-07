// Type definitions for moonstone/Item

import { ItemBaseProps as ui_Item_ItemBaseProps } from "@enact/ui/Item";
import * as React from "react";
import { MarqueeDecoratorProps as moonstone_Marquee_MarqueeDecoratorProps } from "@enact/moonstone/Marquee";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface ItemBaseProps extends ui_Item_ItemBaseProps {
  /**
 * Customizes the component by mapping the supplied collection of CSS class names to the
corresponding internal Elements and states of this component.
 * 
 * The following classes are supported:
 * *  `item`  - The root class name
 */
  css?: object;
}
/**
 * A Moonstone styled item without any behavior.
 */

export class ItemBase extends React.Component<
  ItemBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface ItemDecoratorProps
  extends moonstone_Marquee_MarqueeDecoratorProps {}
export function ItemDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & ItemDecoratorProps>;

export interface ItemProps extends Merge<ItemBaseProps, ItemDecoratorProps> {}
/**
 * A Moonstone styled item with built-in support for marqueed text, and Spotlight focus.
 * 
 * Usage:
 * ```
<Item>Item Content</Item>
```
 */

export class Item extends React.Component<
  ItemProps & React.HTMLProps<HTMLElement>
> {}

export default Item;
