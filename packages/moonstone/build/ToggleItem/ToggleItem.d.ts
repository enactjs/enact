// Type definitions for moonstone/ToggleItem

import * as React from "react";
import { ToggleItemDecoratorProps as ui_ToggleItem_ToggleItemDecoratorProps } from "@enact/ui/ToggleItem";
import { SpottableProps as spotlight_Spottable_SpottableProps } from "@enact/spotlight/Spottable";
import { MarqueeDecoratorProps as moonstone_Marquee_MarqueeDecoratorProps } from "@enact/moonstone/Marquee";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface ToggleItemBaseProps {
  /**
   * The content to be displayed as the main content of the toggle item.
   */
  children: React.ReactNode;
  /**
 * The icon component to render in this item.
 * 
 * This component receives the  `selected`  prop and value, and must therefore respond to it in some
way. It is recommended to use  ToggleIcon   for this.
 */
  iconComponent: React.ComponentType | JSX.Element;
  /**
 * Customizes the component by mapping the supplied collection of CSS class names to the
corresponding internal Elements and states of this component.
 * 
 * The following classes are supported:
 * *  `toggleItem`  - The root class name
 */
  css?: object;
  /**
 * Overrides the icon of the  `iconComponent`  component.
 * 
 * This accepts any string that the  Icon   component supports,
provided the recommendations of  `iconComponent`  are followed.
 */
  icon?: string;
}
/**
 * A Moonstone-styled toggle  Item   without any behavior.
 */

export class ToggleItemBase extends React.Component<
  ToggleItemBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface ToggleItemDecoratorConfig extends Object {
  /**
 * Invalidate the distance of marquee text if any property (like 'inline') changes.
Expects an array of props which on change trigger invalidateMetrics.
 */
  invalidateProps?: string[];
}
export interface ToggleItemDecoratorProps
  extends Merge<
    Merge<
      ui_ToggleItem_ToggleItemDecoratorProps,
      spotlight_Spottable_SpottableProps
    >,
    moonstone_Marquee_MarqueeDecoratorProps
  > {}
export function ToggleItemDecorator<P>(
  config: ToggleItemDecoratorConfig,
  Component: React.ComponentType<P> | string
): React.ComponentType<P & ToggleItemDecoratorProps>;

export function ToggleItemDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & ToggleItemDecoratorProps>;

export interface ToggleItemProps
  extends Merge<ToggleItemBaseProps, ToggleItemDecoratorProps> {
  /**
 * The Icon to render in this item.
 * 
 * This component receives the  `selected`  prop and value, and must therefore respond to it in some
way. It is recommended to use  ToggleIcon   for this.
 */
  iconComponent: React.ComponentType | JSX.Element;
}
/**
 * A Moonstone-styled item with built-in support for toggling, marqueed text, and  `Spotlight`  focus.
 * 
 * This is not intended to be used directly, but should be extended by a component that will
customize this component's appearance by supplying an  `iconComponent`  prop.
 */

export class ToggleItem extends React.Component<
  ToggleItemProps & React.HTMLProps<HTMLElement>
> {}

export default ToggleItem;
