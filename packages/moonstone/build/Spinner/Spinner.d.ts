// Type definitions for moonstone/Spinner

import { SpinnerBaseProps as ui_Spinner_SpinnerBaseProps } from "@enact/ui/Spinner";
import * as React from "react";
import { SkinnableProps as moonstone_Skinnable_SkinnableProps } from "@enact/moonstone/Skinnable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface SpinnerBaseProps extends ui_Spinner_SpinnerBaseProps {
  /**
 * Customizes the component by mapping the supplied collection of CSS class names to the
corresponding internal Elements and states of this component.
 * 
 * The following classes are supported:
 * *  `spinner`  - The root component class, unless there is a scrim. The scrim and floating
layer can be a sibling or parent to this root "spinner" element.
 */
  css?: object;
  /**
 * Customize the size of this component.
 * 
 * Recommended usage is "medium" (default) for standalone and popup scenarios, while "small"
is best suited for use inside other elements, like   .
 */
  size?: "medium" | "small";
  /**
   * Removes the background color (making it transparent).
   */
  transparent?: boolean;
}
/**
 * The base component, defining all of the properties.
 */

export class SpinnerBase extends React.Component<
  SpinnerBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface SpinnerProps
  extends Merge<SpinnerBaseProps, SpinnerDecoratorProps> {
  /**
 * Determines how far the click-blocking should extend.
 * 
 * It can be either  `'screen'` ,  `'container'` , or  `null` .  `'screen'`  pauses spotlight.
Changing this property to  `'screen'`  after creation is not supported.
 */
  blockClickOn?: string;
}
/**
 * A Moonstone-styled Spinner.
 */

export class Spinner extends React.Component<
  SpinnerProps & React.HTMLProps<HTMLElement>
> {}

export interface SpinnerDecoratorProps
  extends moonstone_Skinnable_SkinnableProps {}
export function SpinnerDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & SpinnerDecoratorProps>;

export default Spinner;
