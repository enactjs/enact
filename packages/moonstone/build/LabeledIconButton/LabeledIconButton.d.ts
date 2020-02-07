// Type definitions for moonstone/LabeledIconButton

import { LabeledIconProps as ui_LabeledIcon_LabeledIconProps } from "@enact/ui/LabeledIcon";
import * as React from "react";
import { SkinnableProps as moonstone_Skinnable_SkinnableProps } from "@enact/moonstone/Skinnable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface LabeledIconButtonBaseProps
  extends ui_LabeledIcon_LabeledIconProps {
  /**
 * Customizes the component by mapping the supplied collection of CSS class names to the
corresponding internal Elements and states of this component.
 * 
 * The following classes are supported:
 * *  `labeledIconButton`  - The root component class
 * *  `icon`  - The icon component class
 * *  `label`  - The label component class
 * *  `large`  - Applied to a  `size='large'`  button
 * *  `selected`  - Applied to a  `selected`  button
 * *  `small`  - Applied to a  `size='small'`  button
 */
  css?: object;
  /**
   * Flip the icon horizontally, vertically or both.
   */
  flip?: "both" | "horizontal" | "vertical";
  /**
   * The icon displayed within the button.
   */
  icon?: string;
  /**
 * Selects the component.
 * 
 * Setting  `selected`  may be useful when the component represents a toggleable option. The
visual effect may be customized using the
 css   prop.
 */
  selected?: boolean;
}
/**
 * An icon button component with a label.
 */

export class LabeledIconButtonBase extends React.Component<
  LabeledIconButtonBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface LabeledIconButtonDecoratorProps
  extends moonstone_Skinnable_SkinnableProps {}
export function LabeledIconButtonDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & LabeledIconButtonDecoratorProps>;

export interface LabeledIconButtonProps
  extends Merge<LabeledIconButtonBaseProps, LabeledIconButtonDecoratorProps> {}
/**
 * A Moonstone-styled icon button component with a label.
 * 
 * Usage:
 * ```
<LabeledIconButton icon="star" labelPosition="after">
  Favorite
</LabeledIconButton>
```
 */

export class LabeledIconButton extends React.Component<
  LabeledIconButtonProps & React.HTMLProps<HTMLElement>
> {}

export default LabeledIconButton;
