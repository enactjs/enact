// Type definitions for moonstone/Button

import { ButtonBaseProps as ui_Button_ButtonBaseProps } from "@enact/ui/Button";
import * as React from "react";
import { MarqueeDecoratorProps as moonstone_Marquee_MarqueeDecoratorProps } from "@enact/moonstone/Marquee";
import { ButtonDecoratorProps as ui_Button_ButtonDecoratorProps } from "@enact/ui/Button";
import { SpottableProps as spotlight_Spottable_SpottableProps } from "@enact/spotlight/Spottable";
import { SkinnableProps as moonstone_Skinnable_SkinnableProps } from "@enact/moonstone/Skinnable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface ButtonBaseProps extends ui_Button_ButtonBaseProps {
  /**
   * The background opacity of this button.
   *
   * Valid values are:
   * *  `'translucent'` ,
   * *  `'lightTranslucent'` , and
   * *  `'transparent'` .
   */
  backgroundOpacity?: "translucent" | "lightTranslucent" | "transparent";
  /**
 * The color of the underline beneath button's content.
 * 
 * Accepts one of the following color names, which correspond with the colored buttons on a
standard remote control:  `'red'` ,  `'green'` ,  `'yellow'` ,  `'blue'` .
 */
  color?: "red" | "green" | "yellow" | "blue";
  /**
 * Customizes the component by mapping the supplied collection of CSS class names to the
corresponding internal Elements and states of this component.
 * 
 * The following classes are supported:
 * *  `button`  - The root class name
 * *  `bg`  - The background node of the button
 * *  `large`  - Applied to a  `size='large'`  button
 * *  `selected`  - Applied to a  `selected`  button
 * *  `small`  - Applied to a  `size='small'`  button
 */
  css?: object;
  /**
   * Specifies on which side ( `'before'`  or  `'after'` ) of the text the icon appears.
   */
  iconPosition?: "before" | "after";
  /**
   * The size of the button.
   */
  size?: "large" | "small";
  /**
 * Enforces a minimum width on the Button.
 * 
 * _NOTE_ : This property's default is  `true`  and must be explicitly set to  `false`  to allow
the button to shrink to fit its contents.
 */
  minWidth?: boolean;
}
/**
 * A button component.
 * 
 * This component is most often not used directly but may be composed within another component as it
is within  Button  .
 */

export class ButtonBase extends React.Component<
  ButtonBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface ButtonDecoratorProps
  extends Merge<
    Merge<
      Merge<
        moonstone_Marquee_MarqueeDecoratorProps,
        ui_Button_ButtonDecoratorProps
      >,
      spotlight_Spottable_SpottableProps
    >,
    moonstone_Skinnable_SkinnableProps
  > {}
export function ButtonDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & ButtonDecoratorProps>;

export interface ButtonProps
  extends Merge<ButtonBaseProps, ButtonDecoratorProps> {}
/**
 * A button component, ready to use in Moonstone applications.
 * 
 * Usage:
 * ```
<Button
	backgroundOpacity="translucent"
	color="blue"
>
	Press me!
</Button>
```
 */

export class Button extends React.Component<
  ButtonProps & React.HTMLProps<HTMLElement>
> {}

export default Button;
