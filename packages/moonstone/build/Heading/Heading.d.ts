// Type definitions for moonstone/Heading

import * as React from "react";
import { MarqueeDecoratorProps as moonstone_Marquee_MarqueeDecoratorProps } from "@enact/moonstone/Marquee";
import { SkinnableProps as moonstone_Skinnable_SkinnableProps } from "@enact/moonstone/Skinnable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface HeadingBaseProps {
  /**
   * Adds a horizontal-rule (line) under the component
   */
  showLine?: boolean;
  /**
   * The size of the spacing around the Heading.
   *
   * Allowed values include:
   * *  `'auto'`  - Value is based on the  `size`  prop for automatic usage.
   * *  `'large'`  - Specifically assign the  `'large'`  spacing.
   * *  `'medium'`  - Specifically assign the  `'medium'`  spacing.
   * *  `'small'`  - Specifically assign the  `'small'`  spacing.
   * *  `'none'`  - No spacing at all. Neighboring elements will directly touch the Heading.
   */
  spacing?: "auto" | "large" | "medium" | "small" | "none";
}
/**
 * A labeled Heading component.
 * 
 * This component is most often not used directly but may be composed within another component as it
is within  Heading  .
 */

export class HeadingBase extends React.Component<
  HeadingBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface HeadingDecoratorProps
  extends Merge<
    moonstone_Marquee_MarqueeDecoratorProps,
    moonstone_Skinnable_SkinnableProps
  > {}
export function HeadingDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & HeadingDecoratorProps>;

export interface HeadingProps
  extends Merge<HeadingBaseProps, HeadingDecoratorProps> {
  /**
   * Marquee animation trigger.
   *
   * Allowed values include:
   * *  `'hover'`  - Marquee begins when the pointer enters the component
   * *  `'render'`  - Marquee begins when the component is rendered
   */
  marqueeOn?: string;
}
/**
 * A labeled Heading component, ready to use in Moonstone applications.
 * 
 * `Heading`  may be used as a header to group related components.
 * 
 * Usage:
 * ```
<Heading
  spacing="medium"
>
  Related Settings
</Heading>
<CheckboxItem>A Setting</CheckboxItem>
<CheckboxItem>A Second Setting</CheckboxItem>
```
 */

export class Heading extends React.Component<
  HeadingProps & React.HTMLProps<HTMLElement>
> {}

export default Heading;
