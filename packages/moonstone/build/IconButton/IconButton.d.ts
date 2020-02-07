// Type definitions for moonstone/IconButton

import { ButtonBaseProps as moonstone_Button_ButtonBaseProps } from "@enact/moonstone/Button";
import { IconButtonBaseProps as ui_IconButton_IconButtonBaseProps } from "@enact/ui/IconButton";
import * as React from "react";
import { TooltipDecoratorProps as moonstone_TooltipDecorator_TooltipDecoratorProps } from "@enact/moonstone/TooltipDecorator";
import { IconButtonDecoratorProps as ui_IconButton_IconButtonDecoratorProps } from "@enact/ui/IconButton";
import { SpottableProps as spotlight_Spottable_SpottableProps } from "@enact/spotlight/Spottable";
import { SkinnableProps as moonstone_Skinnable_SkinnableProps } from "@enact/moonstone/Skinnable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface IconButtonBaseProps
  extends Omit<
    Merge<moonstone_Button_ButtonBaseProps, ui_IconButton_IconButtonBaseProps>,
    "buttonComponent" | "iconComponent"
  > {
  /**
   * The background-color opacity of this icon button.
   *
   * Valid values are:
   * *  `'translucent'` ,
   * *  `'lightTranslucent'` , and
   * *  `'transparent'` .
   */
  backgroundOpacity?: string;
  /**
 * The color of the underline beneath the icon.
 * 
 * This property accepts one of the following color names, which correspond with the
colored buttons on a standard remote control:  `'red'` ,  `'green'` ,  `'yellow'` ,  `'blue'`
 */
  color?: string;
  /**
 * Customizes the component by mapping the supplied collection of CSS class names to the
corresponding internal Elements and states of this component.
 * 
 * The following classes are supported:
 * *  `iconButton`  - The root class name
 * *  `bg`  - The background node of the icon button
 * *  `large`  - Applied to a  `size='large'`  icon button
 * *  `selected`  - Applied to a  `selected`  icon button
 * *  `small`  - Applied to a  `size='small'`  icon button
 */
  css?: object;
}
/**
 * A moonstone-styled icon button without any behavior.
 */

export class IconButtonBase extends React.Component<
  IconButtonBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface IconButtonDecoratorProps
  extends Merge<
    Merge<
      Merge<
        moonstone_TooltipDecorator_TooltipDecoratorProps,
        ui_IconButton_IconButtonDecoratorProps
      >,
      spotlight_Spottable_SpottableProps
    >,
    moonstone_Skinnable_SkinnableProps
  > {}
export function IconButtonDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & IconButtonDecoratorProps>;

export interface IconButtonProps
  extends Merge<IconButtonBaseProps, IconButtonDecoratorProps> {}
/**
 * `IconButton`  does not have  `Marquee`  like  `Button`  has, as it should not contain text.
 * 
 * Usage:
 * ```
<IconButton onClick={handleClick} size="small">
    plus
</IconButton>
```
 */

export class IconButton extends React.Component<
  IconButtonProps & React.HTMLProps<HTMLElement>
> {}

export default IconButton;
