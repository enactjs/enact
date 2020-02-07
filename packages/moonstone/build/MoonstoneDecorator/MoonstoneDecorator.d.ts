// Type definitions for moonstone/MoonstoneDecorator

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N;

export interface AccessibilityDecoratorProps {
  /**
 * Enables additional features to help users visually differentiate components.
 * 
 * The UI library will be responsible for using this information to adjust
the components' contrast to this preset.
 */
  highContrast?: boolean;
  /**
 * Sets the goal size of the text.
 * 
 * The UI library will be responsible for using this
information to adjust the components' text sizes to this preset.
Current presets are  `'normal'`  (default), and  `'large'` .
 */
  textSize?: string;
}
export function AccessibilityDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & AccessibilityDecoratorProps>;

export interface MoonstoneDecoratorProps {}
export function MoonstoneDecorator<P>(
  Component: React.ComponentType<P> | string
): React.ComponentType<P & MoonstoneDecoratorProps>;

export default MoonstoneDecorator;
