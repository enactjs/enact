// Type definitions for moonstone/Popup

import * as React from "react";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface PopupBaseProps {
  /**
   * The contents to be displayed in the body of the popup.
   */
  children: React.ReactNode;
  /**
   * Sets the hint string read when focusing the popup close button.
   */
  closeButtonAriaLabel?: string;
  /**
   * Disables transition animation.
   */
  noAnimation?: boolean;
  /**
   * Called when the close button is clicked.
   */
  onCloseButtonClick?: Function;
  /**
   * Called after the popup's "hide" transition finishes.
   */
  onHide?: Function;
  /**
   * Called after the popup's "show" transition finishes.
   */
  onShow?: Function;
  /**
   * Controls the visibility of the Popup.
   *
   * By default, the Popup and its contents are not rendered until  `open` .
   */
  open?: boolean;
  /**
   * Shows the close button.
   */
  showCloseButton?: boolean;
  /**
   * The container id for   .
   */
  spotlightId?: string;
  /**
 * Restricts or prioritizes navigation when focus attempts to leave the popup.
 * 
 * It can be either  `'none'` ,  `'self-first'` , or  `'self-only'` .
 * 
 * Note: The ready-to-use  Popup   component only supports
 `'self-first'`  and  `'self-only'` .
 */
  spotlightRestrict?: string;
}
/**
 * The base popup component.
 */

export class PopupBase extends React.Component<
  PopupBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface PopupProps {
  /**
   * Hint string read when focusing the popup close button.
   */
  closeButtonAriaLabel?: string;
  /**
   * Disables transition animation.
   */
  noAnimation?: boolean;
  /**
   * Indicates that the popup will not trigger  `onClose`  on the  _ESC_  key press.
   */
  noAutoDismiss?: boolean;
  /**
 * Called on:
 * *  pressing  `ESC`  key,
 * *  clicking on the close button, or
 * *  moving spotlight focus outside the boundary of the popup when  `spotlightRestrict`  is
 `'self-first'` .
 * 
 * It is the responsibility of the callback to set the  `open`  property to  `false` .
 */
  onClose?: Function;
  /**
   * Called after hide transition has completed, and immediately with no transition.
   */
  onHide?: Function;
  /**
   * Called when a key is pressed.
   */
  onKeyDown?: Function;
  /**
 * Called after show transition has completed, and immediately with no transition.
 * 
 * Note: The function does not run if Popup is initially opened and
 noAnimation   is  `true` .
 */
  onShow?: Function;
  /**
   * Controls the visibility of the Popup.
   *
   * By default, the Popup and its contents are not rendered until  `open` .
   */
  open?: boolean;
  /**
 * Scrim type.
 * *  Values:  `'transparent'` ,  `'translucent'` , or  `'none'` .
 * 
 * `'none'`  is not compatible with  `spotlightRestrict`  of  `'self-only'` , use a transparent scrim
to prevent mouse focus when using popup.
 */
  scrimType?: string;
  /**
   * Shows a close button.
   */
  showCloseButton?: boolean;
  /**
 * Restricts or prioritizes navigation when focus attempts to leave the popup.
 * *  Values:  `'self-first'` , or  `'self-only'` .
 * 
 * Note: If  `onClose`  is not set, then this has no effect on 5-way navigation. If the popup
has no spottable children, 5-way navigation will cause the Popup to fire  `onClose` .
 */
  spotlightRestrict?: string;
}
/**
 * A stateful component that renders a popup in a
 FloatingLayer  .
 */

export class Popup extends React.Component<
  PopupProps & React.HTMLProps<HTMLElement>
> {}

export default Popup;
