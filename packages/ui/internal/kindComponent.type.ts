import type {ComponentType} from 'react';

/**
 * The real shape of a component produced by `@enact/core/kind`, parameterized by its actual props
 * type. `@enact/core/kind`'s own `KindComponent` type omits the props generic entirely (so it
 * defaults to `{}`), which is accurate for what `kind()` can statically infer -- it doesn't derive
 * a props shape from `propTypes` -- but means every JSX consumer of a raw `kind()` result needs a
 * cast like this to pass real props to it.
 *
 * @private
 */
type TypedKindComponent<P = Record<string, any>> = ComponentType<P> & {
	/** Renders `props` without mounting a full component instance; used by callers (typically
	 * other `kind()`-produced components) that need this component's rendered output inline. */
	inline?: (props: P, context?: any) => any;
	computed?: Record<string, any>;
	defaultProps?: Partial<P>;
};

export type {TypedKindComponent};
