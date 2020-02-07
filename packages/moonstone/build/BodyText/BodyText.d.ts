// Type definitions for moonstone/BodyText

import { BodyTextProps as ui_BodyText_BodyTextProps } from "@enact/ui/BodyText";
import * as React from "react";
import { SkinnableProps as moonstone_Skinnable_SkinnableProps } from "@enact/moonstone/Skinnable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface BodyTextBaseProps extends ui_BodyText_BodyTextProps {
  /**
 * Centers the contents.
 * 
 * Applies the  `centered`  CSS class which can be customized by
 theming  .
 */
  centered?: boolean;
  /**
 * Customizes the component by mapping the supplied collection of CSS class names to the
corresponding internal Elements and states of this component.
 * 
 * The following classes are supported:
 * *  `bodyText`  - The root class name
 */
  css?: object;
  /**
 * Toggles multi-line ( `false` ) vs single-line ( `true` ) behavior.  `noWrap`  mode
automatically enables    so long text isn't permanently occluded.
 */
  noWrap?: boolean;
  /**
 * Sets the text size to one of the preset sizes.
Available sizes: 'large' (default) and 'small'.
 */
  size?: "small" | "large";
}
/**
 * A simple text block component.
 * 
 * This component is most often not used directly but may be composed within another component as it
is within  BodyText  .
 */

export class BodyTextBase extends React.Component<
  BodyTextBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface BodyTextDecoratorProps
  extends moonstone_Skinnable_SkinnableProps {}
export function BodyTextDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & BodyTextDecoratorProps>;

export interface BodyTextProps
  extends Merge<BodyTextBaseProps, BodyTextDecoratorProps> {}
/**
 * A simple text block component, ready to use in Moonstone applications.
 * 
 * `BodyText`  may be used to display a block of text and is sized and spaced appropriately for a
Moonstone application.
 * 
 * Usage:
 * ```
<BodyText>
 I have a Ham radio. There are many like it, but this one is mine.
</BodyText>
```
 */

export class BodyText extends React.Component<
  BodyTextProps & React.HTMLProps<HTMLElement>
> {}

export default BodyText;
