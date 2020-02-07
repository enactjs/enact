// Type definitions for moonstone/GridListImageItem

import { GridListImageItemProps as ui_GridListImageItem_GridListImageItemProps } from "@enact/ui/GridListImageItem";
import * as React from "react";
import { MarqueeControllerProps as moonstone_Marquee_MarqueeControllerProps } from "@enact/moonstone/Marquee";
import { SpottableProps as spotlight_Spottable_SpottableProps } from "@enact/spotlight/Spottable";
import { SkinnableProps as moonstone_Skinnable_SkinnableProps } from "@enact/moonstone/Skinnable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface GridListImageItemBaseProps
  extends ui_GridListImageItem_GridListImageItemProps {
  /**
 * Customizes the component by mapping the supplied collection of CSS class names to the
corresponding internal Elements and states of this component.
 * 
 * The following classes are supported:
 * *  `icon`  - The icon component class for default selection overlay
 * *  `image`  - The image component class
 * *  `selected`  - Applied when  `selected`  prop is  `true`
 * *  `caption`  - The caption component class
 * *  `subCaption`  - The subCaption component class
 */
  css?: object;
  /**
   * The voice control intent.
   */
  "data-webos-voice-intent"?: string;
  /**
 * Placeholder image used while  source  
is loaded.
 */
  placeholder?: string;
  /**
 * Applies a selected visual effect to the image, but only if  `selectionOverlayShowing` 
is also  `true` .
 */
  selected?: boolean;
  /**
 * The custom selection overlay component to render. A component can be a stateless functional
component,  `kind()`  or React component. The following is an example with custom selection
overlay kind.
 * 
 * Usage:
 * ```
const SelectionOverlay = kind({
	render: () => <div>custom overlay</div>
});

<GridListImageItem selectionOverlay={SelectionOverlay} />
```
 */
  selectionOverlay?: Function;
}
/**
 * A Moonstone styled base component for  GridListImageItem  .
 */

export class GridListImageItemBase extends React.Component<
  GridListImageItemBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface GridListImageItemDecoratorProps
  extends Merge<
    Merge<
      moonstone_Marquee_MarqueeControllerProps,
      spotlight_Spottable_SpottableProps
    >,
    moonstone_Skinnable_SkinnableProps
  > {}
export function GridListImageItemDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & GridListImageItemDecoratorProps>;

export interface GridListImageItemProps
  extends Merge<GridListImageItemBaseProps, GridListImageItemDecoratorProps> {}
/**
 * A moonstone-styled grid list image item, Marquee and Spottable applied.
 * 
 * Usage:
 * ```
<GridListImageItem
	caption="image0"
	source="http://placehold.it/300x300/9037ab/ffffff&text=Image0"
	subCaption="sub-image0"
/>
```
 */

export class GridListImageItem extends React.Component<
  GridListImageItemProps & React.HTMLProps<HTMLElement>
> {}

export default GridListImageItem;
