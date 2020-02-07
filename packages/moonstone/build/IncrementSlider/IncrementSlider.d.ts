// Type definitions for moonstone/IncrementSlider

import { SliderBaseProps as moonstone_Slider_SliderBaseProps } from "@enact/moonstone/Slider";
import { SkinnableProps as moonstone_Skinnable_SkinnableProps } from "@enact/moonstone/Skinnable";
import { SpottableProps as spotlight_Spottable_SpottableProps } from "@enact/spotlight/Spottable";
import * as React from "react";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface IncrementSliderBaseProps
  extends Merge<
    Merge<moonstone_Slider_SliderBaseProps, moonstone_Skinnable_SkinnableProps>,
    spotlight_Spottable_SpottableProps
  > {
  /**
   * Sets the knob to selected state and allows it to move via 5-way controls.
   */
  active?: boolean;
  /**
 * Prevents read out of both the slider and the increment and decrement
buttons.
 */
  "aria-hidden"?: boolean;
  /**
 * Overrides the  `aria-valuetext`  for the slider. By default,  `aria-valuetext`  is set
to the current value. This should only be used when the parent controls the value of
the slider directly through the props.
 */
  "aria-valuetext"?: string | number;
  /**
   * Background progress, as a proportion between  `0`  and  `1` .
   */
  backgroundProgress?: number;
  /**
   * Disables voice control.
   */
  "data-webos-voice-disabled"?: boolean;
  /**
   * The  `data-webos-voice-group-label`  for the IconButton of IncrementSlider.
   */
  "data-webos-voice-group-label"?: string;
  /**
   * Sets the hint string read when focusing the decrement button.
   */
  decrementAriaLabel?: string;
  /**
 * Assign a custom icon for the decrementer. All strings supported by  Icon   are
supported. Without a custom icon, the default is used, and is automatically changed when
 vertical   is changed.
 */
  decrementIcon?: string;
  /**
   * Disables the slider and prevents events from firing.
   */
  disabled?: boolean;
  /**
   * Shows the tooltip, when present.
   */
  focused?: boolean;
  /**
   * Sets the hint string read when focusing the increment button.
   */
  incrementAriaLabel?: string;
  /**
 * Assign a custom icon for the incrementer. All strings supported by  Icon   are
supported. Without a custom icon, the default is used, and is automatically changed when
 vertical   is changed.
 */
  incrementIcon?: string;
  /**
 * The amount to increment or decrement the position of the knob via 5-way controls.
 * 
 * It must evenly divide into the range designated by  `min`  and  `max` . If not specified,
 `step`  is used for the default value.
 */
  knobStep?: number;
  /**
 * The maximum value of the increment slider.
 * 
 * The range between  `min`  and  `max`  should be evenly divisible by
 step  .
 */
  max?: number;
  /**
 * The minimum value of the increment slider.
 * 
 * The range between  `min`  and  `max`  should be evenly divisible by
 step  .
 */
  min?: number;
  /**
   * Hides the slider bar fill and prevents highlight when spotted.
   */
  noFill?: boolean;
  /**
   * Called when the knob is activated or deactivated by selecting it via 5-way.
   */
  onActivate?: Function;
  /**
   * Called when the value is changed.
   */
  onChange?: Function;
  /**
   * Called when the component is removed while retaining focus.
   */
  onSpotlightDisappear?: Function;
  /**
   * Called prior to focus leaving the component when the 5-way down key is pressed.
   */
  onSpotlightDown?: Function;
  /**
   * Called prior to focus leaving the component when the 5-way left key is pressed.
   */
  onSpotlightLeft?: Function;
  /**
   * Called prior to focus leaving the component when the 5-way right key is pressed.
   */
  onSpotlightRight?: Function;
  /**
   * Called prior to focus leaving the component when the 5-way up key is pressed.
   */
  onSpotlightUp?: Function;
  /**
 * Sets the orientation of the slider, whether the slider moves left and right or up and
down. Must be either  `'horizontal'`  or  `'vertical'` .
 */
  orientation?: string;
  /**
   * Disables spotlight navigation into the component.
   */
  spotlightDisabled?: boolean;
  /**
   * The amount to increment or decrement the value.
   *
   * It must evenly divide into the range designated by  `min`  and  `max` .
   */
  step?: number;
  /**
 * Enables the built-in tooltip
 * 
 * To customize the tooltip, pass either a custom Tooltip component or an instance of
 IncrementSliderTooltip   with
additional props configured.
 * ```
<IncrementSlider
  tooltip={
    <IncrementSliderTooltip percent side="after" />
  }
/>
```
 
 * The tooltip may also be passed as a child via the  `"tooltip"`  slot. See
 Slottable   for more information on how slots can be used.
 * ```
<IncrementSlider>
  <IncrementSliderTooltip percent side="after" />
</IncrementSlider>
```
 */
  tooltip?: boolean | JSX.Element | Function;
  /**
   * The value of the increment slider.
   *
   * Defaults to the value of  `min` .
   */
  value?: number;
}
/**
 * A stateless Slider with IconButtons to increment and decrement the value. In most circumstances,
you will want to use the stateful version:   .
 */

export class IncrementSliderBase extends React.Component<
  IncrementSliderBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface IncrementSliderProps extends IncrementSliderBaseProps {}
/**
 * An IncrementSlider with Moonstone styling and SliderDecorator applied with IconButtons to
increment and decrement the value.
 * 
 * By default,  `IncrementSlider`  maintains the state of its  `value`  property. Supply the
 `defaultValue`  property to control its initial value. If you wish to directly control updates
to the component, supply a value to  `value`  at creation time and update it in response to
 `onChange`  events.
 */

export class IncrementSlider extends React.Component<
  IncrementSliderProps & React.HTMLProps<HTMLElement>
> {}

export interface IncrementSliderTooltipProps {}
/**
 * A  Tooltip   specifically adapted for use with
 IncrementSlider  ,
 ProgressBar  , or
 Slider  .
 * 
 * See  
 */

export class IncrementSliderTooltip extends React.Component<
  IncrementSliderTooltipProps & React.HTMLProps<HTMLElement>
> {}

export default IncrementSlider;
