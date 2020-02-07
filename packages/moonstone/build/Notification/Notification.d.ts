// Type definitions for moonstone/Notification

import * as React from "react";
import { SlottableProps as ui_Slottable_SlottableProps } from "@enact/ui/Slottable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface NotificationBaseProps {
  /**
 * Buttons for the Notification.
 * 
 * These typically close or take action in the Notification. Buttons must have their
 `size`  property set to  `'small'`  and will be coerced to  `'small'`  if not specified.
 */
  buttons?: JSX.Element | JSX.Element[];
  /**
   * The contents for the body of the Notification.
   */
  children?: React.ReactNode;
  /**
 * Customizes the component by mapping the supplied collection of CSS class names to the
corresponding internal Elements and states of this component.
 * 
 * The following classes are supported:
 * *  `notification`  - The root class name
 */
  css?: object;
  /**
   * Indicates that the notification will not trigger  `onClose`  on the  _ESC_  key press.
   */
  noAutoDismiss?: boolean;
  /**
 * Called when a closing action is invoked by the user.
 * 
 * These actions include pressing  _ESC_  key or clicking on the close button. It is the
responsibility of the callback to set the  `open`  state to  `false` .
 */
  onClose?: Function;
  /**
   * Controls the visibility of the Notification.
   *
   * By default, the Notification and its contents are not rendered until  `open` .
   */
  open?: boolean;
  /**
   * Determines the technique used to cover the screen when the notification is present.
   * *  Values:  `'transparent'` ,  `'translucent'` , or  `'none'` .
   */
  scrimType?: string;
}
/**
 * A Moonstone styled notification component.
 * 
 * It provides a notification modal which can be opened and closed, overlaying an app. Apps will
want to use   .
 */

export class NotificationBase extends React.Component<
  NotificationBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface NotificationProps extends ui_Slottable_SlottableProps {}
/**
 * A Moonstone styled modal component with a message, and an area for additional controls.
 */

export class Notification extends React.Component<
  NotificationProps & React.HTMLProps<HTMLElement>
> {}

export default Notification;
