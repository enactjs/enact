// Type definitions for moonstone/ContextualPopupDecorator

import * as React from "react";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface ContextualPopupDecoratorConfig extends Object {
  /**
   * `ContextualPopup`  without the arrow.
   */
  noArrow?: boolean;
  /**
   * Disables passing the  `skin`  prop to the wrapped component.
   */
  noSkin?: boolean;
  /**
 * The prop in which to pass the value of  `open`  state of ContextualPopupDecorator to the
wrapped component.
 */
  openProp?: string;
}
export interface ContextualPopupDecoratorProps {
  /**
 * The component rendered within the
 ContextualPopup  .
 */
  popupComponent: React.ComponentType;
  /**
   * Limits the range of voice control to the popup.
   */
  "data-webos-voice-exclusive"?: boolean;
  /**
   * Direction of popup with respect to the wrapped component.
   */
  direction?: string;
  /**
 * Disables closing the popup when the user presses the cancel key or taps outside the
popup.
 */
  noAutoDismiss?: boolean;
  /**
 * Called when the user has attempted to close the popup.
 * 
 * This may occur either when the close button is clicked or when spotlight focus
moves outside the boundary of the popup. Setting  `spotlightRestrict`  to  `'self-only'` 
will prevent Spotlight focus from leaving the popup.
 */
  onClose?: Function;
  /**
   * Called when the popup is opened.
   */
  onOpen?: Function;
  /**
   * Displays the contextual popup.
   */
  open?: boolean;
  /**
 * CSS class name to pass to the
 ContextualPopup  .
 * 
 * This is commonly used to set width and height of the popup.
 */
  popupClassName?: string;
  /**
   * An object containing properties to be passed to popup component.
   */
  popupProps?: object;
  /**
 * The container ID to use with Spotlight.
 * 
 * The spotlight container for the popup isn't created until it is open. To configure
the container using  `Spotlight.set()` , handle the  `onOpen`  event which is fired after
the popup has been created and opened.
 */
  popupSpotlightId?: string;
  /**
   * Shows the close button.
   */
  showCloseButton?: boolean;
  /**
 * The current skin for this component.
 * 
 * When  `noSkin`  is set on the config object,  `skin`  will only be applied to the
 ContextualPopup   and not
to the popup's activator component.
 */
  skin?: string;
  /**
 * Restricts or prioritizes spotlight navigation.
 * 
 * Allowed values are:
 * *  `'none'`  - Spotlight can move freely within and beyond the popup
 * *  `'self-first'`  - Spotlight should prefer components within the popup over
components beyond the popup, or
 * *  `'self-only'`  - Spotlight can only be set within the popup
 */
  spotlightRestrict?: string;
}
export function ContextualPopupDecorator<P>(
  config: ContextualPopupDecoratorConfig,
  Component: React.ComponentType<P> | string
): React.ComponentType<P & ContextualPopupDecoratorProps>;

export function ContextualPopupDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & ContextualPopupDecoratorProps>;

export interface ContextualPopupProps {
  /**
   * The contents of the popup.
   */
  children: React.ReactNode;
  /**
   * Style object for arrow position.
   */
  arrowPosition?: object;
  /**
   * Style object for container position.
   */
  containerPosition?: object;
  /**
   * Called with the reference to the container node.
   */
  containerRef?: Function;
  /**
   * Direction of ContextualPopup.
   *
   * Can be one of:  `'up'` ,  `'down'` ,  `'left'` , or  `'right'` .
   */
  direction?: "up" | "down" | "left" | "right";
  /**
   * Called when the close button is clicked.
   */
  onCloseButtonClick?: Function;
  /**
   * Shows the arrow.
   */
  showArrow?: boolean;
  /**
   * Shows the close button.
   */
  showCloseButton?: boolean;
}
/**
 * A popup component used by
 ContextualPopupDecorator   to
wrap its  popupComponent  .
 * 
 * `ContextualPopup`  is usually not used directly but is made available for unique application use
cases.
 */

export class ContextualPopup extends React.Component<
  ContextualPopupProps & React.HTMLProps<HTMLElement>
> {}

export default ContextualPopupDecorator;
