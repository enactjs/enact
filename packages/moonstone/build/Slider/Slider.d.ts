// Type definitions for moonstone/Slider

import { SliderBaseProps as ui_Slider_SliderBaseProps } from "@enact/ui/Slider";
import * as React from "react";
import { ChangeableProps as ui_Changeable_ChangeableProps } from "@enact/ui/Changeable";
import { SpottableProps as spotlight_Spottable_SpottableProps } from "@enact/spotlight/Spottable";
import { SkinnableProps as moonstone_Skinnable_SkinnableProps } from "@enact/moonstone/Skinnable";
import { SlottableProps as ui_Slottable_SlottableProps } from "@enact/ui/Slottable";
import { SliderDecoratorProps as ui_Slider_SliderDecoratorProps } from "@enact/ui/Slider";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface SliderBaseProps
  extends Omit<ui_Slider_SliderBaseProps, "progressBarComponent"> {
  /**
 * Activates the component when focused so that it may be manipulated via the directional
input keys.
 */
  activateOnFocus?: boolean;
  /**
   * Sets the knob to selected state and allows it to move via 5-way controls.
   */
  active?: boolean;
  /**
 * Customizes the component by mapping the supplied collection of CSS class names to the
corresponding internal Elements and states of this component.
 * 
 * The following classes are supported:
 * *  `slider`  - The root component class
 */
  css?: object;
  /**
 * Indicates that the slider has gained focus and if the tooltip is present, it will be
shown.
 */
  focused?: boolean;
  /**
 * The amount to increment or decrement the position of the knob via 5-way controls.
 * 
 * It must evenly divide into the range designated by  `min`  and  `max` . If not specified,
 `step`  is used for the default value.
 */
  knobStep?: number;
  /**
 * The maximum value of the slider.
 * 
 * The range between  `min`  and  `max`  should be evenly divisible by
 step  .
 */
  max?: number;
  /**
 * The minimum value of the slider.
 * 
 * The range between  `min`  and  `max`  should be evenly divisible by
 step  .
 */
  min?: number;
  /**
   * The handler when the knob is activated or deactivated by selecting it via 5-way
   */
  onActivate?: Function;
  /**
 * Called when a key is pressed down while the slider is focused.
 * 
 * When a directional key is pressed down and the knob is active (either by first
pressing enter or when  `activateOnFocus`  is enabled), the Slider will increment or
decrement the current value and emit an  `onChange`  event. This default behavior can be
prevented by calling  `preventDefault()`  on the event passed to this callback.
 */
  onKeyDown?: Function;
  /**
 * Called when a key is released while the slider is focused.
 * 
 * When the enter key is released and  `activateOnFocus`  is not enabled, the slider will be
activated to enable incrementing or decrementing the value via directional keys. This
default behavior can be prevented by calling  `preventDefault()`  on the event passed to
this callback.
 */
  onKeyUp?: Function;
  /**
   * The amount to increment or decrement the value.
   *
   * It must evenly divide into the range designated by  `min`  and  `max` .
   */
  step?: number;
  /**
 * Enables the built-in tooltip
 * 
 * To customize the tooltip, pass either a custom tooltip component or an instance of
 SliderTooltip   with additional props configured.
 * ```
<Slider
  tooltip={
    <SliderTooltip percent side="after" />
  }
/>
```
 
 * The tooltip may also be passed as a child via the  `"tooltip"`  slot. See
 Slottable   for more information on how slots can be used.
 * ```
<Slider>
  <SliderTooltip percent side="after" />
</Slider>
```
 
 * If a custom tooltip is provided, it will receive the following props:
 * *  `children`  - The  `value`  prop from the slider
 * *  `visible`  -  `true`  if the tooltip should be displayed
 * *  `orientation`  - The value of the  `orientation`  prop from the slider
 * *  `proportion`  - A number between 0 and 1 representing the proportion of the  `value`  in
terms of  `min`  and  `max`
 */
  tooltip?: boolean | JSX.Element | Function;
  /**
   * The value of the slider.
   *
   * Defaults to the value of  `min` .
   */
  value?: number;
}
/**
 * Range-selection input component.
 */

export class SliderBase extends React.Component<
  SliderBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface SliderDecoratorProps
  extends Merge<
    Merge<
      Merge<
        Merge<
          ui_Changeable_ChangeableProps,
          spotlight_Spottable_SpottableProps
        >,
        moonstone_Skinnable_SkinnableProps
      >,
      ui_Slottable_SlottableProps
    >,
    ui_Slider_SliderDecoratorProps
  > {}
export function SliderDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & SliderDecoratorProps>;

export interface SliderProps extends SliderDecoratorProps {
  /**
 * Overrides the  `aria-valuetext`  for the slider.
 * 
 * By default,  `aria-valuetext`  is set to the current value. This should only be used when
the parent controls the value of the slider directly through the props.
 */
  "aria-valuetext"?: string | number;
}
/**
 * Slider input with Moonstone styling,  `Spottable`  ,
 Touchable   and  `SliderDecorator`  
applied.
 * 
 * By default,  `Slider`  maintains the state of its  `value`  property. Supply the  `defaultValue` 
property to control its initial value. If you wish to directly control updates to the
component, supply a value to  `value`  at creation time and update it in response to  `onChange` 
events.
 */

export class Slider extends React.Component<
  SliderProps & React.HTMLProps<HTMLElement>
> {}

export interface SliderTooltipProps {}
/**
 * A  Tooltip   specifically adapted for use with
 IncrementSlider  ,
 ProgressBar  , or
 Slider  .
 */

export class SliderTooltip extends React.Component<
  SliderTooltipProps & React.HTMLProps<HTMLElement>
> {}

export default Slider;
