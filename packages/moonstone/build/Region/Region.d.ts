// Type definitions for moonstone/Region

import * as React from "react";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface RegionProps {
  /**
 * Title placed within an instance of  Heading   before the
children.
 */
  title: string;
  /**
   * The aria-label for the region.
   *
   * If unset, it defaults to the value of  `title`
   */
  "aria-label"?: string;
  /**
   * Contents of the region.
   */
  children?: React.ReactNode;
}
/**
 * A component for grouping other components.
 */

export class Region extends React.Component<
  RegionProps & React.HTMLProps<HTMLElement>
> {}

export default Region;
