// Type definitions for moonstone/LabeledItem

import { ItemBaseProps as moonstone_Item_ItemBaseProps } from "@enact/moonstone/Item";
import { SpottableProps as spotlight_Spottable_SpottableProps } from "@enact/spotlight/Spottable";
import { TouchableProps as ui_Touchable_TouchableProps } from "@enact/ui/Touchable";
import { MarqueeControllerProps as moonstone_Marquee_MarqueeControllerProps } from "@enact/moonstone/Marquee";
import * as React from "react";
import { SkinnableProps as moonstone_Skinnable_SkinnableProps } from "@enact/moonstone/Skinnable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface LabeledItemBaseProps
  extends Merge<
    Merge<
      Merge<moonstone_Item_ItemBaseProps, spotlight_Spottable_SpottableProps>,
      ui_Touchable_TouchableProps
    >,
    moonstone_Marquee_MarqueeControllerProps
  > {
  /**
   * The node to be displayed as the main content of the item.
   */
  children: React.ReactNode;
  /**
 * Customizes the component by mapping the supplied collection of CSS class names to the
corresponding internal Elements and states of this component.
 * 
 * The following classes are supported:
 * *  `labeledItem`  - The root class name
 * *  `icon`  - Applied to the icon
 * *  `label`  - Applied to the label
 */
  css?: object;
  /**
   * Applies a disabled style and the control becomes non-interactive.
   */
  disabled?: boolean;
  /**
   * The label to be displayed along with the text.
   */
  label?: React.ReactNode;
  /**
   * Determines what triggers the  `LabelItem` 's marquee to start its animation.
   */
  marqueeOn?: "focus" | "hover" | "render";
  /**
   * Icon to be displayed next to the title text.
   */
  titleIcon?: string | object;
}
/**
 * A focusable component that combines marquee-able text content with a synchronized
marquee-able text label.
 */

export class LabeledItemBase extends React.Component<
  LabeledItemBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface LabeledItemProps
  extends Merge<LabeledItemBaseProps, moonstone_Skinnable_SkinnableProps> {}
/**
 * A Moonstone styled labeled item with built-in support for marqueed text and Spotlight focus.
 */

export class LabeledItem extends React.Component<
  LabeledItemProps & React.HTMLProps<HTMLElement>
> {}

export default LabeledItem;
