// Type definitions for moonstone/Scroller

import { ScrollerBaseProps as ui_Scroller_ScrollerBaseProps } from "@enact/ui/Scroller";
import * as React from "react";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface ScrollerBaseProps extends ui_Scroller_ScrollerBaseProps {
  /**
 * Allows 5-way navigation to the scrollbar controls. By default, 5-way will
not move focus to the scrollbar controls.
 */
  focusableScrollbar?: boolean;
  /**
 * Unique identifier for the component.
 * 
 * When defined and when the  `Scroller`  is within a  Panel  , the
 `Scroller`  will store its scroll position and restore that position when returning to the
 `Panel` .
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
 * A Moonstone-styled base component for  Scroller  .
In most circumstances, you will want to use the
 SpotlightContainerDecorator  
and the Scrollable version,  Scroller  .
 */

export class ScrollerBase extends React.Component<
  ScrollerBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface ScrollerProps extends ScrollerBaseProps {}
/**
 * A Moonstone-styled Scroller, Scrollable applied.
 * 
 * Usage:
 * ```
<Scroller>Scroll me.</Scroller>
```
 */

export class Scroller extends React.Component<
  ScrollerProps & React.HTMLProps<HTMLElement>
> {}

export default Scroller;
