// Type definitions for moonstone/TooltipDecorator

import * as React from "react";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface TooltipBaseProps {
  /**
   * The node to be displayed as the main content of the tooltip.
   */
  children: React.ReactNode;
  /**
 * Position of tooltip arrow in relation to the activator.
 * 
 * Note that  `'left'` ,  `'center'` ,  `'right'`  are applicable when direction is in vertical
orientation (i.e.  `'above'` ,  `'below'` ), and  `'top'` ,  `'middle'` , and  `'bottom'`  are
applicable when direction is in horizontal orientation (i.e.  `'left'` ,  `'right'` )
 */
  arrowAnchor?: "left" | "center" | "right" | "top" | "middle" | "bottom";
  /**
   * Direction of label in relation to the activator.
   */
  direction?: "above" | "below" | "left" | "right";
  /**
 * A value representing the amount to offset the label portion of the tooltip.
 * 
 * In a "center" aligned tooltip, the label may be desirable to offset to one side or the
other. This prop accepts a value betwen -0.5 and 0.5 (representing 50% to the left or
right). This defaults to 0 offset (centered). It also automatically caps the value so it
never positions the tooltip label past the anchored arrow. If the tooltip label or arrow
has non-rectangular geometry (rounded corners, a wide tail, etc), you'll need to manually
account for that in your provided offset value.
 */
  labelOffset?: number;
  /**
   * Style object for tooltip position.
   */
  position?: object;
  /**
 * Anchors the tooltip relative to its container.
 * 
 * Reconfigures the component to anchor itself to the designated edge of its container.
When this is not specified, the implication is that the component is "absolutely"
positioned, relative to the viewport, rather than its parent layer.
 */
  relative?: boolean;
  /**
   * Called when the tooltip mounts/unmounts, giving a reference to the DOM.
   */
  tooltipRef?: Function;
  /**
 * The width of tooltip content in pixels (px).
 * 
 * If the content goes over the given width, then it will automatically wrap. When  `null` ,
content does not wrap.
 */
  width?: number | any;
}
/**
 * A stateless tooltip component with Moonstone styling applied.
 */

export class TooltipBase extends React.Component<
  TooltipBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface TooltipDecoratorConfig extends Object {
  /**
 * The boundary around the screen which the tooltip should never cross, typically involving
flipping to an alternate orientation or adjusting its offset to remain on screen.
The default of 24 is derived from a standard 12px screen-keepout size plus the standard
Spotlight-outset (12px) margin/padding value which keeps elements and text aligned inside a
 Panel  . Note: This value will be scaled according to the
resolution.
 */
  screenEdgeKeepout?: number;
  /**
 * The name of the property which will receive the tooltip node.
 * 
 * By default,  `TooltipDecorator`  will add a new child to the wrapped component, following any
other children passed in. If a component needs to, it can specify another property to receive
the tooltip and the  `children`  property will not be modified.
 */
  tooltipDestinationProp?: string;
}
export interface TooltipDecoratorProps {
  /**
   * Disables the component but does not affect tooltip operation.
   */
  disabled?: boolean;
  /**
   * Time to wait (in milliseconds) before showing tooltip on hover.
   */
  tooltipDelay?: number;
  /**
 * Position of the tooltip with respect to the wrapped component.
 * _Value_ _Tooltip Direction_ `'above'` Above component, flowing to the right `'above center'` Above component, centered `'above left'` Above component, flowing to the left `'above right'` Above component, flowing to the right `'below'` Below component, flowing to the right `'below center'` Below component, centered `'below left'` Below component, flowing to the left `'below right'` Below component, flowing to the right `'left bottom'` Left of the component, contents at the bottom `'left middle'` Left of the component, contents middle aligned `'left top'` Left of the component, contents at the top `'right bottom'` Right of the component, contents at the bottom `'right middle'` Right of the component, contents middle aligned `'right top'` Right of the component, contents at the top 
 * `TooltipDectorator`  attempts to choose the best direction to meet layout and language
requirements. Left and right directions will reverse for RTL languages. Additionally,
the tooltip will reverse direction if it will prevent overflowing off the viewport
 */
  tooltipPosition?:
    | "above"
    | "above center"
    | "above left"
    | "above right"
    | "below"
    | "below center"
    | "below left"
    | "below right"
    | "left bottom"
    | "left middle"
    | "left top"
    | "right bottom"
    | "right middle"
    | "right top";
  /**
   * Properties to be passed to tooltip component.
   */
  tooltipProps?: object;
  /**
 * Positions the tooltip relative to its container.
 * 
 * Determines whether your tooltip should position itself relative to its container or
relative to the screen (absolute positioning on the floating layer). When setting to
 `true` , to enable relative positioning, it may be important to specify the
 `tooltipDestinationProp`  key in this HoC's config object. A relatively positioned
Tooltip for a  `Button` , for example, must be placed in the  `decoration`  prop.
 * 
 * It may be necessary to assign the CSS rule  `position`  to the containing element so
relatively positioned Tooltip has a frame to "stick to" the edge of.
 * 
 * Anchoring points can be visualized as follows:
 * ```
┌───◎───┐
◎       ◎
└───◎───┘
```
 */
  tooltipRelative?: boolean;
  /**
   * Tooltip content.
   */
  tooltipText?: React.ReactNode;
  /**
 * The interval (in milliseconds) to recheck the math for a currently showing tooltip's
positioning and orientation. Useful if your anchor element moves.
 */
  tooltipUpdateDelay?: number;
  /**
 * The width of tooltip content in pixels (px).
 * 
 * If the content goes over the given width, it will automatically wrap. When  `null` ,
content does not wrap.
 */
  tooltipWidth?: number | any;
}
export function TooltipDecorator<P>(
  config: TooltipDecoratorConfig,
  Component: React.ComponentType<P> | string
): React.ComponentType<P & TooltipDecoratorProps>;

export function TooltipDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & TooltipDecoratorProps>;

export interface TooltipProps {}
/**
 * A tooltip component with Moonstone styling applied.
 */

export class Tooltip extends React.Component<
  TooltipProps & React.HTMLProps<HTMLElement>
> {}

export default TooltipDecorator;
