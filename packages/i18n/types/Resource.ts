import type {IlibCallbackOptions} from './IlibCallbackOptions';

/**
 * A resource loader invoked after a locale change.
 *
 * Not independently reused elsewhere — kept alongside `Resource`, the type that composes it.
 */
type ResourceFn = (options: IlibCallbackOptions<unknown>) => unknown;

/**
 * A resource loader paired with an optional `onLoad` callback, invoked once the loader's
 * result (or its resolved `Promise`) is available.
 *
 * Not independently reused elsewhere — kept alongside `Resource`, the type that composes it.
 */
interface ResourceDescriptor {
	resource: ResourceFn;
	onLoad?: (res: unknown) => void;
}

/**
 * A single entry in an `I18nConfig.resources` array: either a loader function directly, or a
 * `{resource, onLoad}` pair.
 *
 * Used by `I18nDecorator/I18n.ts` and `I18nDecorator/I18nDecorator.tsx`.
 */
type Resource = ResourceFn | ResourceDescriptor | null | undefined;

export type {Resource, ResourceDescriptor, ResourceFn};
