// Type definitions for moonstone/Marquee

import { MarqueeProps as ui_Marquee_MarqueeProps } from "@enact/ui/Marquee";
import * as React from "react";
import { MarqueeBaseProps as ui_Marquee_MarqueeBaseProps } from "@enact/ui/Marquee";
import { MarqueeControllerProps as ui_Marquee_MarqueeControllerProps } from "@enact/ui/Marquee";
import { MarqueeDecoratorProps as ui_Marquee_MarqueeDecoratorProps } from "@enact/ui/Marquee";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface MarqueeProps extends ui_Marquee_MarqueeProps {}
/**
 * A block element which will marquee its contents
 */

export class Marquee extends React.Component<
  MarqueeProps & React.HTMLProps<HTMLElement>
> {}

export interface MarqueeBaseProps extends ui_Marquee_MarqueeBaseProps {}
/**
 * Internal component to provide marquee markup
 */

export class MarqueeBase extends React.Component<
  MarqueeBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface MarqueeControllerProps
  extends ui_Marquee_MarqueeControllerProps {}
export function MarqueeController<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & MarqueeControllerProps>;

export interface MarqueeDecoratorProps
  extends ui_Marquee_MarqueeDecoratorProps {}
export function MarqueeDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & MarqueeDecoratorProps>;

export default Marquee;
