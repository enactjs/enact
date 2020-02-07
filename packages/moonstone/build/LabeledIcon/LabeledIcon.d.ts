// Type definitions for moonstone/LabeledIcon

import * as React from "react";
import { SkinnableProps as moonstone_Skinnable_SkinnableProps } from "@enact/moonstone/Skinnable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface LabeledIconBaseProps {
  /**
 * Customizes the component by mapping the supplied collection of CSS class names to the
corresponding internal Elements and states of this component.
 * 
 * The following classes are supported:
 * *  `labeledIcon`  - The root component class
 * *  `label`  - The label component class
 * *  `icon`  - The icon component class
 */
  css?: object;
}
/**
 * A basic LabeledIcon component structure without any behaviors applied to it.
 */

export class LabeledIconBase extends React.Component<
  LabeledIconBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface LabeledIconDecoratorProps
  extends moonstone_Skinnable_SkinnableProps {}
export function LabeledIconDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & LabeledIconDecoratorProps>;

export interface LabeledIconProps
  extends Merge<LabeledIconBaseProps, LabeledIconDecoratorProps> {}
/**
 * A Moonstone-styled icon component with a label.
 * 
 * Usage:
 * ```
<LabeledIcon icon="star" labelPosition="after">
  Favorite
</LabeledIcon>
```
 */

export class LabeledIcon extends React.Component<
  LabeledIconProps & React.HTMLProps<HTMLElement>
> {}

export default LabeledIcon;
