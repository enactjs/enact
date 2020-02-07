// Type definitions for moonstone/ProgressBar

import * as React from "react";
import { SkinnableProps as moonstone_Skinnable_SkinnableProps } from "@enact/moonstone/Skinnable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface ProgressBarBaseProps {
  /**
 * Customizes the component by mapping the supplied collection of CSS class names to the
corresponding internal Elements and states of this component.
 * 
 * The following classes are supported:
 * *  `progressBar`  - The root component class
 */
  css?: object;
  /**
   * Highlights the filled portion.
   */
  highlighted?: boolean;
  /**
   * Sets the orientation of the slider.
   * *  Values:  `'horizontal'` ,  `'vertical'`
   */
  orientation?: string;
  /**
   * A number between  `0`  and  `1`  indicating the proportion of the filled portion of the bar.
   */
  progress?: number;
  /**
 * Enables the built-in tooltip.
 * 
 * To customize the tooltip, pass either a custom tooltip component or an instance of
 ProgressBarTooltip   with additional
props configured.
 * 
 * The provided component will receive the following props from  `ProgressBar` :
 * *  `orientation`   - The value of  `orientation`
 * *  `percent`       - Always  `true`  indicating the value should be presented as a percentage
                 rather than an absolute value
 * *  `progress`      - The  `value`  as a proportion between  `min`  and  `max`
 * *  `visible`       - Always  `true`  indicating that the tooltip should be visible
 * 
 * Usage:
 * ```
<ProgressBar
  tooltip={
    <ProgressBarTooltip side="after" />
  }
/>
```
 
 * The tooltip may also be passed as a child via the  `"tooltip"`  slot. See
 Slottable   for more information on how slots can be used.
 * 
 * Usage:
 * ```
<ProgressBar>
  <ProgressBarTooltip side="after" />
</ProgressBar>
```
 */
  tooltip?: boolean | React.ComponentType | JSX.Element;
}
/**
 * Renders a moonstone-styled progress bar.
 */

export class ProgressBarBase extends React.Component<
  ProgressBarBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface ProgressBarTooltipProps {
  /**
   * Sets the orientation of the tooltip based on the orientation of the bar.
   *
   * 'vertical' sends the tooltip to one of the sides, 'horizontal'  positions it above the bar.
   * *  Values:  `'horizontal'` ,  `'vertical'`
   */
  orientation?: string;
  /**
   * Displays the value as a percentage.
   */
  percent?: boolean;
  /**
 * Position of the tooltip with respect to the progress bar.
 * *  For  `orientation="horizontal"`  progress bars, the default value is  `'above'` .
 * *  For  `orientation="vertical"`  progress bars, the default value is  `'before'` .
 * 
 * When using  `'before'`  or  `'after'`  alone or in any of the below combinations,  `'before'` 
will position the tooltip on the side of the current locale's text directionality. In LTR
locales, it will be on the left; in RTL locales, it will be on the right. Similarly,
 `'after'`  will position the tooltip on the oppoosite side: the right side for LTR and
left for RTL.
 * 
 * Valid values when  `orientation="horizontal"`
 * _Value_ _Tooltip Direction_ `'above'` Above component, flowing to the nearest end `'above left'` Above component, flowing to the left `'above before'` Above component, flowing to the start of text `'above right'` Above component, flowing to the right `'above after'` Above component, flowing to the end of text `'below'` Below component, flowing to the nearest end `'below left'` Below component, flowing to the left `'below before'` Below component, flowing to the start of text `'below right'` Below component, flowing to the right `'below after'` Below component, flowing to the end of text 
 * Valid values when  `orientation="vertical"`
 * _Value_ _Tooltip Direction_ `'left'` Left of the component, contents middle aligned `'before'` Start of text side of the component, contents middle aligned `'right'` right of the component, contents middle aligned `'after'` End of text side of the component, contents middle aligned */
  position?:
    | "above"
    | "above before"
    | "above left"
    | "above after"
    | "above right"
    | "below"
    | "below left"
    | "below before"
    | "below right"
    | "below after"
    | "left"
    | "before"
    | "right"
    | "after";
  /**
   * The proportion of the filled part of the bar.
   * *  Should be a number between 0 and 1.
   */
  proportion?: number;
  /**
 * Specify where the tooltip should appear in relation to the ProgressBar/Slider bar.
 * 
 * Allowed values are:
 * *  `'after'`  renders below a  `horizontal`  ProgressBar/Slider and after (respecting the
current locale's text direction) a  `vertical`  ProgressBar/Slider
 * *  `'before'`  renders above a  `horizontal`  ProgressBar/Slider and before (respecting the
current locale's text direction) a  `vertical`  ProgressBar/Slider
 * *  `'left'`  renders to the left of a  `vertical`  ProgressBar/Slider regardless of locale
 * *  `'right'`  renders to the right of a  `vertical`  ProgressBar/Slider regardless of locale
 */
  side?: string;
  /**
   * Visibility of the tooltip
   */
  visible?: boolean;
}
/**
 * A  Tooltip   specifically adapted for use with
 IncrementSlider  ,
 ProgressBar  , or
 Slider  .
 */

export class ProgressBarTooltip extends React.Component<
  ProgressBarTooltipProps & React.HTMLProps<HTMLElement>
> {}

export interface ProgressBarDecoratorProps
  extends moonstone_Skinnable_SkinnableProps {}
export function ProgressBarDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & ProgressBarDecoratorProps>;

export interface ProgressBarProps
  extends Merge<ProgressBarBaseProps, ProgressBarDecoratorProps> {}
/**
 * The ready-to-use Moonstone-styled ProgressBar.
 */

export class ProgressBar extends React.Component<
  ProgressBarProps & React.HTMLProps<HTMLElement>
> {}

export default ProgressBar;
