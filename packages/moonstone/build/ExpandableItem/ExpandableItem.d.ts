// Type definitions for moonstone/ExpandableItem

import { ToggleableProps as ui_Toggleable_ToggleableProps } from "@enact/ui/Toggleable";
import { RadioDecoratorProps as ui_RadioDecorator_RadioDecoratorProps } from "@enact/ui/RadioDecorator";
import { CancelableProps as ui_Cancelable_CancelableProps } from "@enact/ui/Cancelable";
import * as React from "react";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface ExpandableConfig extends Object {
  /**
 * When  `true`  and used in conjunction with  `noAutoFocus`  when  `false` , the contents of the
container will receive spotlight focus expanded, even in pointer mode.
 */
  noPointerMode?: boolean;
}
export interface ExpandableProps
  extends Merge<
    Merge<ui_Toggleable_ToggleableProps, ui_RadioDecorator_RadioDecoratorProps>,
    ui_Cancelable_CancelableProps
  > {}
export function Expandable<P>(
  config: ExpandableConfig,
  Component: React.ComponentType<P> | string
): React.ComponentType<P & ExpandableProps>;

export function Expandable<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & ExpandableProps>;

export interface ExpandableConfig extends Object {
  /**
 * When  `true`  and used in conjunction with  `noAutoFocus`  when  `false` , the contents of the
container will receive spotlight focus expanded, even in pointer mode.
 */
  noPointerMode?: boolean;
}
export interface ExpandableProps
  extends Merge<
    Merge<ui_Toggleable_ToggleableProps, ui_RadioDecorator_RadioDecoratorProps>,
    ui_Cancelable_CancelableProps
  > {}
export function Expandable<P>(
  config: ExpandableConfig,
  Component: React.ComponentType<P> | string
): React.ComponentType<P & ExpandableProps>;

export function Expandable<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & ExpandableProps>;

export interface ExpandableItemBaseProps {
  /**
   * The primary text of the item.
   */
  title: string;
  /**
 * Closes the expandable automatically when the user navigates to the  `title` 
of the component using 5-way controls; if  `false` , the user must select/tap the title to
close the expandable.
 */
  autoClose?: boolean;
  /**
   * The contents of the expandable item displayed when  `open`  is  `true` .
   */
  children?: React.ReactNode;
  /**
   * Disables voice control.
   */
  "data-webos-voice-disabled"?: boolean;
  /**
   * The voice control group.
   */
  "data-webos-voice-group-label"?: string;
  /**
   * The voice control intent.
   */
  "data-webos-voice-intent"?: string;
  /**
   * The voice control label.
   */
  "data-webos-voice-label"?: string;
  /**
   * Disables ExpandableItem and the control becomes non-interactive.
   */
  disabled?: boolean;
  /**
   * The secondary, or supportive text. Typically under the  `title` , a subtitle.
   */
  label?: React.ReactNode;
  /**
 * Prevents the user from moving  Spotlight     past the bottom
of the expandable (when open) using 5-way controls.
 */
  lockBottom?: boolean;
  /**
   * Text to display when no  `label`  or  `value`  is set.
   */
  noneText?: string;
  /**
   * Called when a condition occurs which should cause the expandable to close.
   */
  onClose?: Function;
  /**
   * Called when a condition occurs which should cause the expandable to open.
   */
  onOpen?: Function;
  /**
   * Called when the component is removed while retaining focus.
   */
  onSpotlightDisappear?: Function;
  /**
   * Called prior to focus leaving the expandable when the 5-way down key is pressed.
   */
  onSpotlightDown?: Function;
  /**
   * Called prior to focus leaving the expandable when the 5-way left key is pressed.
   */
  onSpotlightLeft?: Function;
  /**
   * Called prior to focus leaving the expandable when the 5-way right key is pressed.
   */
  onSpotlightRight?: Function;
  /**
   * Called prior to focus leaving the expandable when the 5-way up key is pressed.
   */
  onSpotlightUp?: Function;
  /**
   * Opens ExpandableItem with the contents visible.
   */
  open?: boolean;
  /**
   * Controls when  `label`  is shown.
   * *  `'always'`  - The label is always visible
   * *  `'never'`  - The label is never visible
   * *  `'auto'`  - The label is visible when the expandable is closed
   */
  showLabel?: string;
  /**
   * Disables spotlight navigation into the component.
   */
  spotlightDisabled?: boolean;
}
/**
 * A stateless component that renders a    that can be
expanded to show additional contents.
 */

export class ExpandableItemBase extends React.Component<
  ExpandableItemBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface ExpandableItemProps
  extends Merge<ExpandableItemBaseProps, ExpandableProps> {}
/**
 * A component that renders a    that can be expanded to
show additional contents.
 * 
 * `ExpandableItem`  maintains its open/closed state by default. The initial state can be supplied
using  `defaultOpen` . In order to directly control the open/closed state, supply a value for
 `open`  at creation time and update its value in response to  `onClose` / `onOpen`  events.
 */

export class ExpandableItem extends React.Component<
  ExpandableItemProps & React.HTMLProps<HTMLElement>
> {}

export default ExpandableItem;
