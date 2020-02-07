// Type definitions for moonstone/Dropdown

import { ButtonProps as moonstone_Button_ButtonProps } from "@enact/moonstone/Button";
import { ContextualPopupDecoratorProps as moonstone_ContextualPopupDecorator_ContextualPopupDecoratorProps } from "@enact/moonstone/ContextualPopupDecorator";
import * as React from "react";
import { ChangeableProps as ui_Changeable_ChangeableProps } from "@enact/ui/Changeable";
import { ToggleableProps as ui_Toggleable_ToggleableProps } from "@enact/ui/Toggleable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface DropdownBaseProps
  extends Omit<
    Merge<
      moonstone_Button_ButtonProps,
      moonstone_ContextualPopupDecorator_ContextualPopupDecoratorProps
    >,
    "popupComponent"
  > {
  /**
 * The selection items to be displayed in the  `Dropdown`  when  `open` .
 * 
 * Takes either an array of strings or an array of objects. When strings, the values will be
used in the generated components as the readable text. When objects, the properties will
be passed onto an  `Item`  component and  `children`  as well as a unique  `key`  property are
required.
 */
  children?:
    | string[]
    | {
        key: number | string;
        children: string | React.ComponentType;
        [propName: string]: any;
      }[];
  /**
   * Disables Dropdown and becomes non-interactive.
   */
  disabled?: boolean;
  /**
   * Called when the Dropdown is closing.
   */
  onClose?: Function;
  /**
   * Called when the Dropdown is opening.
   */
  onOpen?: Function;
  /**
   * Called when an item is selected.
   *
   * The event payload will be an object with the following members:
   * *  `data`  - The value for the option as received in the  `children`  prop
   * *  `selected`  - Number representing the selected option, 0 indexed
   */
  onSelect?: Function;
  /**
   * Displays the items.
   */
  open?: boolean;
  /**
   * Index of the selected item.
   */
  selected?: number;
  /**
 * The primary title text of Dropdown.
The title will be replaced if an item is selected.
 */
  title: string;
  /**
   * The width of Dropdown.
   */
  width?: "huge" | "large" | "x-large" | "medium" | "small" | "tiny";
}
/**
 * A stateless Dropdown component.
 */

export class DropdownBase extends React.Component<
  DropdownBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface DropdownDecoratorProps
  extends Merge<ui_Changeable_ChangeableProps, ui_Toggleable_ToggleableProps> {
  /**
   * Displays the items.
   */
  open?: boolean;
  /**
   * Index of the selected item.
   */
  selected?: number;
  /**
   * The initial selected index when  `selected`  is not defined.
   */
  defaultSelected?: number;
}
export function DropdownDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & DropdownDecoratorProps>;

export interface DropdownProps extends DropdownBaseProps {}
/**
 * A Moonstone Dropdown component.
 * 
 * By default,  `Dropdown`  maintains the state of its  `selected`  property. Supply the
 `defaultSelected`  property to control its initial value. If you wish to directly control updates
to the component, supply a value to  `selected`  at creation time and update it in response to
 `onSelected`  events.
 */

export class Dropdown extends React.Component<
  DropdownProps & React.HTMLProps<HTMLElement>
> {}

export default Dropdown;
