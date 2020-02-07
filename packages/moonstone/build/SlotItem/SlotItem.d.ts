// Type definitions for moonstone/SlotItem

import { SlotItemBaseProps as ui_SlotItem_SlotItemBaseProps } from "@enact/ui/SlotItem";
import { ItemBaseProps as moonstone_Item_ItemBaseProps } from "@enact/moonstone/Item";
import * as React from "react";
import { SlotItemDecoratorProps as ui_SlotItem_SlotItemDecoratorProps } from "@enact/ui/SlotItem";
import { MarqueeDecoratorProps as moonstone_Marquee_MarqueeDecoratorProps } from "@enact/moonstone/Marquee";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface SlotItemBaseProps
  extends Omit<
    Merge<ui_SlotItem_SlotItemBaseProps, moonstone_Item_ItemBaseProps>,
    "component"
  > {
  /**
 * Customizes the component by mapping the supplied collection of CSS class names to the
corresponding internal Elements and states of this component.
 * 
 * The following classes are supported:
 * *  `slotItem`  - The root class name
 */
  css?: object;
}
/**
 * A moonstone-styled SlotItem without any behavior.
 */

export class SlotItemBase extends React.Component<
  SlotItemBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface SlotItemDecoratorProps
  extends Merge<
    ui_SlotItem_SlotItemDecoratorProps,
    moonstone_Marquee_MarqueeDecoratorProps
  > {}
export function SlotItemDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & SlotItemDecoratorProps>;

export interface SlotItemProps
  extends Merge<SlotItemBaseProps, SlotItemDecoratorProps> {}
/**
 * A Moonstone-styled item with built-in support for overlays.
 * ```
<SlotItem autoHide="both">
	<slotBefore>
		<Icon>flag</Icon>
		<Icon>star</Icon>
	</slotBefore>
	An Item that will show some icons before and after this text when spotted
	<Icon slot="slotAfter">trash</Icon>
</SlotItem>
```
 */

export class SlotItem extends React.Component<
  SlotItemProps & React.HTMLProps<HTMLElement>
> {}

export default SlotItem;
