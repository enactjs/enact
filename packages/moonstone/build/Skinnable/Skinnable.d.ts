// Type definitions for moonstone/Skinnable

import { SkinnableProps as ui_Skinnable_SkinnableProps } from "@enact/ui/Skinnable";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface SkinnableProps extends ui_Skinnable_SkinnableProps {
  /**
 * Select a skin by name by specifying this property.
 * 
 * Available Moonstone skins are  `"dark"`  (default) and  `"light"` . This may be changed at runtime.
All components already use their defaults, but a skin may be changed via this prop or by using
 `Skinnable`  directly and a config object.
 * 
 * Example:
 * ```
<Button skin="light">
```
 */
  skin?: string;
}
export function Skinnable<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & SkinnableProps>;

export default Skinnable;
