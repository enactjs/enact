// Type definitions for moonstone/Dialog

import * as React from "react";
import { SlottableProps as ui_Slottable_SlottableProps } from "@enact/ui/Slottable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface DialogBaseProps {
  /**
   * Buttons to be included within the header of the component.
   *
   * Typically, these buttons would be used to close or take action on the dialog.
   */
  buttons?: JSX.Element | JSX.Element[];
  /**
   * The contents of the body of the component.
   */
  children?: React.ReactNode;
  /**
   * Disables animating the dialog on or off screen.
   */
  noAnimation?: boolean;
  /**
   * Omits the dividing line between the header and body of the component.
   */
  noDivider?: boolean;
  /**
 * Called when the user requests to close the dialog.
 * 
 * These actions include pressing the cancel key or tapping on the close button. It is the
responsibility of the callback to set the  `open`  property to  `false` .
 */
  onClose?: Function;
  /**
   * Called after the transition to hide the dialog has finished.
   */
  onHide?: Function;
  /**
   * Opens the dialog.
   */
  open?: boolean;
  /**
 * The types of scrim shown behind the dialog.
 * 
 * Allowed values include:
 * *  `'transparent'`  - The scrim is invisible but prevents pointer events for components
below it.
 * *  `'translucent'`  - The scrim is visible and both obscures and prevents pointer events
for components below it.
 * *  `'none'`  - No scrim is present and pointer events are allowed outside the dialog.
 */
  scrimType?: string;
  /**
   * Shows the close button within the component.
   */
  showCloseButton?: boolean;
  /**
   * The primary text displayed within the header
   */
  title?: string;
  /**
   * The secondary text displayed below the  `title`  within the header.
   *
   * Will not display if  `title`  is not set.
   */
  titleBelow?: string;
}
/**
 * A modal dialog component.
 * 
 * This component is most often not used directly but may be composed within another component as it
is within  Dialog  .
 */

export class DialogBase extends React.Component<
  DialogBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface DialogProps
  extends Merge<DialogBaseProps, ui_Slottable_SlottableProps> {}
/**
 * A modal dialog component, ready to use in Moonstone applications.
 * 
 * `Dialog`  may be used to interrupt a workflow to receive feedback from the user. The dialong
consists of a title, a subtitle, a message, and an area for additional
 buttons  .
 * 
 * Usage:
 * ```
<Dialog
  open={this.state.open}
  showCloseButton
  title="An Important Dialog"
  titleBelow="Some important context to share about the purpose"
>
  <BodyText>You can include other Moonstone components here. </BodyText>
  <buttons>
    <Button>Button 1</Button>
    <Button>Button 2</Button>
  </buttons>
</Dialog>
```
 */

export class Dialog extends React.Component<
  DialogProps & React.HTMLProps<HTMLElement>
> {}

export default Dialog;
