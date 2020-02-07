// Type definitions for moonstone/MediaOverlay

import * as React from "react";
import { SpottableProps as spotlight_Spottable_SpottableProps } from "@enact/spotlight/Spottable";
import { SlottableProps as ui_Slottable_SlottableProps } from "@enact/ui/Slottable";
import { SkinnableProps as moonstone_Skinnable_SkinnableProps } from "@enact/moonstone/Skinnable";
import { MediaOverlayBaseProps as moonstone_mediaOverlay_MediaOverlayBaseProps } from "@enact/moonstone/mediaOverlay";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface MediaOverlayBaseProps {
  /**
 * Any children  `<source>`  tag elements will be sent directly to the media element as
sources.
 */
  source?: React.ReactNode;
  /**
 * Customizes the component by mapping the supplied collection of CSS class names to the
corresponding internal Elements and states of this component.
 * 
 * The following classes are supported:
 * *  `image`  - class name for image
 * *  `textLayout`  - class name for text layout
 */
  css?: object;
  /**
   * Image path for image overlay.
   *
   * NOTE: When image is displayed, media is not displayed even though it is playing.
   */
  imageOverlay?: string | object;
  /**
 * Media component to use.
 * 
 * The default ( `'video'` ) renders an  `HTMLVideoElement` . Custom media components must have
a similar API structure, exposing the following APIs:
 * 
 * Methods:
 * *  `load()`  - load media
 */
  mediaComponent?: string | React.ComponentType;
  /**
   * Placeholder for image overlay.
   */
  placeholder?: string;
  /**
   * Text to display over media.
   */
  text?: string;
  /**
   * Aligns the  `text`  vertically within the component.
   *
   * Allowed values are:
   * *  `"center"` , the default, aligns the text in the middle
   * *  `"start"`  aligns the text to the top
   * *  `"end"`  aligns the text to the bottom
   */
  textAlign?: string;
}
/**
 * A media component with image and text overlay support.
 */

export class MediaOverlayBase extends React.Component<
  MediaOverlayBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface MediaOverlayDecoratorProps
  extends Merge<
    Merge<spotlight_Spottable_SpottableProps, ui_Slottable_SlottableProps>,
    moonstone_Skinnable_SkinnableProps
  > {}
export function MediaOverlayDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & MediaOverlayDecoratorProps>;

export interface MediaOverlayProps
  extends Merge<
    moonstone_mediaOverlay_MediaOverlayBaseProps,
    MediaOverlayDecoratorProps
  > {}
/**
 * A Moonstone-styled  `Media`  component.
 * 
 * Usage:
 * ```
<MediaOverlay>
    <source type='' src=''/>
</MediaOverlay>
```
 */

export class MediaOverlay extends React.Component<
  MediaOverlayProps & React.HTMLProps<HTMLElement>
> {}

export default MediaOverlay;
