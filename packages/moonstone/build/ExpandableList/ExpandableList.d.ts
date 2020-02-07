// Type definitions for moonstone/ExpandableList

import { ExpandableItemBaseProps as moonstone_ExpandableItem_ExpandableItemBaseProps } from "@enact/moonstone/ExpandableItem";
import * as React from "react";
import { ExpandableProps as moonstone_ExpandableItem_ExpandableProps } from "@enact/moonstone/ExpandableItem";
import { ChangeableProps as ui_Changeable_ChangeableProps } from "@enact/ui/Changeable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface ExpandableListBaseProps
  extends moonstone_ExpandableItem_ExpandableItemBaseProps {
  /**
 * The items to be displayed in the list. This supports two data types. If an array of
strings is provided, the strings will be used in the generated components as the readable
text. If an array of objects is provided, each object will be spread onto the generated
component with no interpretation. You'll be responsible for setting properties like
 `disabled` ,  `className` , and setting the content using  `children` .
 * 
 * NOTE: When providing an array of objects be sure a unique  `key`  is assigned to each
item.    for more
information.
 */
  children:
    | string[]
    | {
        key: number | string;
        children: string | React.ComponentType;
        [propName: string]: any;
      }[];
  /**
   * The primary text of the item.
   */
  title: string;
  /**
 * When  `true`  and  `select`  is not  `'multiple'` , the expandable will be closed when an item
is selected.
 */
  closeOnSelect?: boolean;
  /**
   * Disables voice control.
   */
  "data-webos-voice-disabled"?: boolean;
  /**
   * Disables ExpandableList and the control becomes non-interactive.
   */
  disabled?: boolean;
  /**
 * The secondary, or supportive text. Typically under the  `title` , a subtitle. If omitted,
the label will be generated as a comma-separated list of the selected items.
 */
  label?: React.ReactNode;
  /**
 * Keeps the expandable open when the user navigates to the  `title`  of the component using
5-way controls and the user must select/tap the title to close the expandable.
 * 
 * This does not affect  `closeOnSelect` .
 */
  noAutoClose?: boolean;
  /**
 * Allows the user to move  Spotlight     past the bottom of the expandable
(when open) using 5-way controls.
 */
  noLockBottom?: boolean;
  /**
   * Text to display when no  `label`  is set.
   */
  noneText?: string;
  /**
 * Called when the expandable is closing. Also called when selecting an item if
 `closeOnSelect`  is  `true` .
 */
  onClose?: Function;
  /**
   * Called when the expandable is opening.
   */
  onOpen?: Function;
  /**
   * Called when an item is selected.
   */
  onSelect?: Function;
  /**
   * Called when the component is removed while retaining focus.
   */
  onSpotlightDisappear?: Function;
  /**
   * Called prior to focus leaving the expandable when the 5-way left key is pressed.
   */
  onSpotlightLeft?: Function;
  /**
   * Called prior to focus leaving the expandable when the 5-way right key is pressed.
   */
  onSpotlightRight?: Function;
  /**
   * Opens the expandable with its contents visible.
   */
  open?: boolean;
  /**
 * Selection mode for the list.
 * *  `'single'`  - Allows for 0 or 1 item to be selected. The selected item may be deselected.
 * *  `'radio'`  - Allows for 0 or 1 item to be selected. The selected item may only be
 deselected by selecting another item.
 * *  `'multiple'`  - Allows 0 to  _n_  items to be selected. Each item may be selected or
 deselected.
 */
  select?: string;
  /**
   * Index or array of indices of the selected item(s).
   */
  selected?: number | number[];
  /**
   * Disables spotlight navigation into the component.
   */
  spotlightDisabled?: boolean;
}
/**
 * A stateless component that renders a    that can be
expanded to show a selectable list of items.
 */

export class ExpandableListBase extends React.Component<
  ExpandableListBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface ExpandableListProps
  extends Merge<
    Merge<ExpandableListBaseProps, moonstone_ExpandableItem_ExpandableProps>,
    ui_Changeable_ChangeableProps
  > {}
/**
 * A component that renders a    that can be expanded to
show a selectable list of items.
 * 
 * By default,  `ExpandableList`  maintains the state of its  `selected`  property. Supply the
 `defaultSelected`  property to control its initial value. If you wish to directly control updates
to the component, supply a value to  `selected`  at creation time and update it in response to
 `onChange`  events.
 * 
 * `ExpandableList`  maintains its open/closed state by default. The initial state can be supplied
using  `defaultOpen` . In order to directly control the open/closed state, supply a value for
 `open`  at creation time and update its value in response to  `onClose` / `onOpen`  events.
 */

export class ExpandableList extends React.Component<
  ExpandableListProps & React.HTMLProps<HTMLElement>
> {}

export default ExpandableList;
