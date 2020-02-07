// Type definitions for moonstone/Image

import { ImageProps as ui_Image_ImageProps } from "@enact/ui/Image";
import * as React from "react";
import { SkinnableProps as moonstone_Skinnable_SkinnableProps } from "@enact/moonstone/Skinnable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface ImageBaseProps extends ui_Image_ImageProps {
  /**
 * Customizes the component by mapping the supplied collection of CSS class names to the
corresponding internal Elements and states of this component.
 * 
 * The following classes are supported:
 * *  `image`  - The root component class for Image
 */
  css?: object;
}
/**
 * A Moonstone-styled image component without any behavior
 */

export class ImageBase extends React.Component<
  ImageBaseProps & React.HTMLProps<HTMLElement>
> {}

export interface ImageDecoratorProps
  extends moonstone_Skinnable_SkinnableProps {}
export function ImageDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & ImageDecoratorProps>;

export interface ImageProps
  extends Merge<ImageBaseProps, ImageDecoratorProps> {}
/**
 * A Moonstone-styled image component
 * ```
<Image
  src={{
    'hd': 'https://dummyimage.com/64/e048e0/0011ff',
    'fhd': 'https://dummyimage.com/128/e048e0/0011ff',
    'uhd': 'https://dummyimage.com/256/e048e0/0011ff'
  }}
>
```
 */

export class Image extends React.Component<
  ImageProps & React.HTMLProps<HTMLElement>
> {}

export default Image;
