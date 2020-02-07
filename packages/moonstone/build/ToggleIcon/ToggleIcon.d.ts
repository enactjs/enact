// Type definitions for moonstone/ToggleIcon

import { ToggleIconProps as ui_ToggleIcon_ToggleIconProps } from "@enact/ui/ToggleIcon";
import * as React from "react";
import { SkinnableProps as moonstone_Skinnable_SkinnableProps } from "@enact/moonstone/Skinnable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface ToggleIconBaseProps extends ui_ToggleIcon_ToggleIconProps {}
/**
 * A component that indicates a boolean state.
 */

export class ToggleIconBase extends React.Component<
  ToggleIconBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface ToggleIconDecoratorProps
  extends moonstone_Skinnable_SkinnableProps {}
export function ToggleIconDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & ToggleIconDecoratorProps>;

export interface ToggleIconProps
  extends Merge<ToggleIconBaseProps, ToggleIconDecoratorProps> {}
/**
 * A customizable Moonstone starting point  Icon   that responds to the
 `selected`  prop.
 */

export class ToggleIcon extends React.Component<
  ToggleIconProps & React.HTMLProps<HTMLElement>
> {}

export default ToggleIcon;
