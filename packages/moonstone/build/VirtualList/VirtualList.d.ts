// Type definitions for moonstone/VirtualList

import * as React from "react";
import { gridListItemSizeShape as ui_VirtualList_gridListItemSizeShape } from "@enact/ui/VirtualList";
import { VirtualListBaseProps as ui_VirtualList_VirtualListBaseProps } from "@enact/ui/VirtualList";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface VirtualListProps extends VirtualListBaseProps {
  /**
 * Size of an item for the VirtualList; valid value is a number generally.
For different item size, value is an object that has  `minSize` 
and  `size`  as properties.
If the direction for the list is vertical, itemSize means the height of an item.
For horizontal, it means the width of an item.
 * 
 * Usage:
 * ```
<VirtualList itemSize={ri.scale(72)} />
```
 */
  itemSize: number | ui_VirtualList_itemSizesShape;
}
/**
 * A Moonstone-styled scrollable and spottable virtual list component.
 */

export class VirtualList extends React.Component<
  VirtualListProps & React.HTMLProps<HTMLElement>
> {}

export interface VirtualGridListProps extends VirtualListBaseProps {
  /**
 * Size of an item for the VirtualGridList; valid value is an object that has  `minWidth` 
and  `minHeight`  as properties.
 * 
 * Usage:
 * ```
<VirtualGridList
	itemSize={{
		minWidth: ri.scale(180),
		minHeight: ri.scale(270)
	}}
/>
```
 */
  itemSize: ui_VirtualList_gridListItemSizeShape;
}
/**
 * A Moonstone-styled scrollable and spottable virtual grid list component.
 */

export class VirtualGridList extends React.Component<
  VirtualGridListProps & React.HTMLProps<HTMLElement>
> {}

export interface VirtualListBaseProps
  extends ui_VirtualList_VirtualListBaseProps {
  /**
 * The  `render`  function called for each item in the list.
 * 
 * NOTE: The list does NOT always render a component whenever its render function is called
due to performance optimization.
 * 
 * Usage:
 * ```
renderItem = ({index, ...rest}) => {
	return (
		<MyComponent index={index} {...rest} />
	);
}
```
 */
  itemRenderer: Function;
  /**
   * Size of the data.
   */
  dataSize?: number;
  /**
 * Allows 5-way navigation to the scrollbar controls. By default, 5-way will
not move focus to the scrollbar controls.
 */
  focusableScrollbar?: boolean;
  /**
 * Allows 5-way navigation to the scrollbar controls. By default, 5-way will
not move focus to the scrollbar controls.
 */
  focusableScrollbar?: boolean;
  /**
   * The ARIA role for the list.
   */
  role?: string;
  /**
   * Spacing between items.
   */
  spacing?: number;
  /**
 * When it's  `true`  and the spotlight focus cannot move to the given direction anymore by 5-way keys,
a list is scrolled with an animation to the other side and the spotlight focus moves in wraparound manner.
 * 
 * When it's  `'noAnimation'` , the spotlight focus moves in wraparound manner as same as when it's  `true` 
except that a list is scrolled without an animation.
 */
  wrap?: boolean | string;
  /**
 * Unique identifier for the component.
 * 
 * When defined and when the  `VirtualList`  is within a  Panel  ,
the  `VirtualList`  will store its scroll position and restore that position when returning to
the  `Panel` .
 */
  id?: string;
  /**
   * Sets the hint string read when focusing the next button in the vertical scroll bar.
   */
  scrollDownAriaLabel?: string;
  /**
   * Sets the hint string read when focusing the previous button in the horizontal scroll bar.
   */
  scrollLeftAriaLabel?: string;
  /**
   * Sets the hint string read when focusing the next button in the horizontal scroll bar.
   */
  scrollRightAriaLabel?: string;
  /**
   * Sets the hint string read when focusing the previous button in the vertical scroll bar.
   */
  scrollUpAriaLabel?: string;
}
/**
 * A Moonstone-styled base component for  VirtualList   and
 VirtualGridList  .
 */

export class VirtualListBase extends React.Component<
  VirtualListBaseProps & React.HTMLProps<HTMLElement>
> {}

export default VirtualList;
