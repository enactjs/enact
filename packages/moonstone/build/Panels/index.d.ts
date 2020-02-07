// Type definitions for moonstone/Panels

import * as React from "react";
import { Arranger as ui_ViewManager_Arranger } from "@enact/ui/ViewManager";
import { RoutableProps as ui_Routable_RoutableProps } from "@enact/ui/Routable";
import { RouteProps as ui_Routable_RouteProps } from "@enact/ui/Routable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface PanelProps {
  /**
 * The "aria-label" for the Panel.
 * 
 * By default, the panel will be labeled by its  Header  .
When  `aria-label`  is set, it will be used instead to provide an accessibility label for
the panel.
 */
  "aria-label"?: string;
  /**
 * Sets the strategy used to automatically focus an element within the panel upon render.
 * *  "none" - Automatic focus is disabled
 * *  "last-focused" - The element last focused in the panel with be restored
 * *  "default-element" - The first spottable component within the body will be focused
 * *  Custom Selector - A custom CSS selector may also be provided which will be used to find
the target within the Panel
 * 
 * When used within  Panels  , this prop may be set by
 `Panels`  to "default-element" when navigating "forward" to a higher index. This behavior
may be overridden by setting  `autoFocus`  on the  `Panel`  instance as a child of  `Panels` 
or by wrapping  `Panel`  with a custom component and overriding the value passed by
 `Panels` .
 * ```
// Panel within CustomPanel will always receive "last-focused"
const CustomPanel = (props) => <Panel {...props} autoFocus="last-focused" />;

// The first panel will always receive "last-focused". The second panel will receive
// "default-element" when navigating from the first panel but `autoFocus` will be unset
// when navigating from the third panel and as a result will default to "last-focused".
const MyPanels = () => (
  <Panels>
    <Panel autoFocus="last-focused" />
    <Panel />
    <Panel />
  </Panels>
);
```
 */
  autoFocus?: string;
  /**
 * Header for the panel.
 * 
 * This is usually passed by the  Slottable   API by using a
 Header   component as a child of the Panel.
 */
  header?: Header;
  /**
 * Hides the body components.
 * 
 * When a Panel is used within  `Panels`  ,
 `ActivityPanels`  , or
 `AlwaysViewingPanels`  ,
this property will be set automatically to  `true`  on render and  `false`  after animating
into view.
 */
  hideChildren?: boolean;
  /**
 * Prevents the component from restoring any framework shared state.
 * 
 * When  `false` , the default, Panel will store state for some framework components in order to
restore that state when returning to the Panel. Setting this prop to  `true`  will suppress that
behavior and not store or retrieve any framework component state.
 */
  noSharedState?: boolean;
}
/**
 * A Panel is the standard view container used inside a  Panels   view
manager instance.
 * 
 * Panels   will typically contain several instances of these and
transition between them.
 */

export class Panel extends React.Component<
  PanelProps & React.HTMLProps<HTMLElement>
> {}

export interface PanelsProps {
  /**
 * Set of functions that control how the panels are transitioned into and out of the
viewport.
 */
  arranger?: ui_ViewManager_Arranger;
  /**
 * An object containing properties to be passed to each child.
 * 
 * `aria-owns`  will be added or updated to this object to add the close button to the
accessibility tree of each panel.
 */
  childProps?: object;
  /**
   * `Panels`   to be rendered
   */
  children?: React.ReactNode;
  /**
   * Sets the hint string read when focusing the application close button.
   */
  closeButtonAriaLabel?: string;
  /**
   * The background opacity of the application close button.
   * *  Values:  `'translucent'` ,  `'lightTranslucent'` ,  `'transparent'`
   */
  closeButtonBackgroundOpacity?: string;
  /**
   * A slot to insert additional Panels-level buttons into the global-navigation area.
   */
  controls?: React.ReactNode;
  /**
 * Unique identifier for the Panels instance.
 * 
 * When defined,  `Panels`  will manage the presentation state of  `Panel`  instances in order
to restore it when returning to the  `Panel` . See
 noSharedState   for more details on shared
state.
 */
  id?: string;
  /**
   * Index of the active panel
   */
  index?: number;
  /**
   * Disables panel transitions.
   */
  noAnimation?: boolean;
  /**
   * Indicates the close button will not be rendered on the top right corner.
   */
  noCloseButton?: boolean;
  /**
 * Prevents maintaining shared state for framework components within this  `Panels`  instance.
 * 
 * When  `false` , each  `Panel`  will track the state of some framework components in order to
restore that state when the Panel is recreated. For example, the scroll position of a
 `moonstone/Scroller`  within a  `Panel`  will be saved and restored when returning to that
 `Panel` .
 * 
 * This only applied when navigating "back" (to a lower index) to  `Panel` . When navigating
"forwards" (to a higher index), the  `Panel`  and its contained components will use their
default state.
 */
  noSharedState?: boolean;
  /**
   * Called when the app close button is clicked.
   */
  onApplicationClose?: Function;
  /**
   * Called with cancel/back key events.
   */
  onBack?: Function;
}
/**
 * Basic Panels component without breadcrumbs or default  arranger
 */

export class Panels extends React.Component<
  PanelsProps & React.HTMLProps<HTMLElement>
> {}

export interface ActivityPanelsProps {}
/**
 * An instance of Panels in which the Panel uses the entire viewable screen with a single breadcrumb
for the previous panel when viewing any panel beyond the first.
 * 
 * Note  ActivityPanels requires that the  `data-index`  property that all panels variations add to
its children be applied to the root DOM node of each child in order to manage layout correctly.
It is recommended that you spread any extra props on the root node but you may also handle this
property explicitly if necessary.
 */

export class ActivityPanels extends React.Component<
  ActivityPanelsProps & React.HTMLProps<HTMLElement>
> {}

export interface BreadcrumbProps {
  /**
   * Index of the associated panel.
   */
  index: number;
  /**
   * Called when the breadcrumb is clicked.
   *
   * The index of the clicked breadcrumb is passed in the event data.
   */
  onSelect?: Function;
}
/**
 * Vertical, transparent bar used to navigate to a prior Panel.
 * 
 * `ActivityPanels`   has one breadcrumb, and
 `AlwaysViewingPanels`   can have multiple stacked
horizontally.
 */

export class Breadcrumb extends React.Component<
  BreadcrumbProps & React.HTMLProps<HTMLElement>
> {}

export interface RoutableProps extends ui_Routable_RoutableProps {}
export function Routable<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & RoutableProps>;

export interface AlwaysViewingPanelsProps {}
/**
 * An instance of  `Panels`   which restricts the  `Panel`  to the right
half of the screen with the left half used for breadcrumbs that allow navigating to previous
panels. Typically used for overlaying panels over a screen.
 */

export class AlwaysViewingPanels extends React.Component<
  AlwaysViewingPanelsProps & React.HTMLProps<HTMLElement>
> {}

export interface HeaderProps {
  /**
   * Centers the  `title` ,  `titleBelow` , and  `subTitleBelow` .
   *
   * This setting has no effect on the  `type="compact"`  header.
   */
  centered?: boolean;
  /**
   * Children provided are added to the header-components area.
   *
   * A space for controls which live in the header, apart from the body of the panel view.
   */
  children?: JSX.Element | JSX.Element[];
  /**
   * Indents then content and removes separator lines.
   */
  fullBleed?: boolean;
  /**
 * `Input`   element that will replace the  `title` .
 * 
 * This is also a  slot  , so it can be referred
to as if it were JSX.
 * 
 * Note: Only applies to  `type="standard"`  headers.
 * 
 * Example
 * ```
 <Header>
 	<title>Example Header Title</title>
 	<headerInput>
 		<Input dismissOnEnter />
 	</headerInput>
 	<titleBelow>The Adventure Continues</titleBelow>
 	<subTitleBelow>The rebels face attack by imperial forces on the ice planet</subTitleBelow>
 </Header>
```
 */
  headerInput?: React.ReactNode;
  /**
   * Hides the horizontal-rule (line) under the component
   */
  hideLine?: boolean;
  /**
   * Determines what triggers the header content to start its animation.
   */
  marqueeOn?: "focus" | "hover" | "render";
  /**
 * Sub-title displayed at the bottom of the panel.
 * 
 * This is a  `slot`  , so it can be used as a tag-name inside
this component.
 */
  subTitleBelow?: string;
  /**
 * Title of the header.
 * 
 * This is a  `slot`  , so it can be used as a tag-name inside
this component.
 * 
 * Example:
 * ```
 <Header>
 	<title>Example Header Title</title>
 	<titleBelow>The Adventure Continues</titleBelow>
 	<subTitleBelow>The rebels face attack by imperial forces on the ice planet</subTitleBelow>
 </Header>
```
 */
  title?: string;
  /**
 * Text displayed below the title.
 * 
 * This is a  `slot`  , so it can be used as a tag-name inside
this component.
 */
  titleBelow?: string;
  /**
   * Set the type of header to be used.
   */
  type?: "compact" | "dense" | "standard";
}
/**
 * A header component for a Panel with a  `title` ,  `titleBelow` , and  `subTitleBelow`
 */

export class Header extends React.Component<
  HeaderProps & React.HTMLProps<HTMLElement>
> {}

export interface RouteProps extends ui_Routable_RouteProps {}
/**
 * Used with    to define the  `path`  segment and the
 `component`  to render.
 */

export class Route extends React.Component<
  RouteProps & React.HTMLProps<HTMLElement>
> {}

export default Panels;
