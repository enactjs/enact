/**
 * Preferred entry point used when resolving the focus target within a container. A superset
 * of {@link spotlight/types/ContainerConfig.EnterTo} used internally to also support entering at
 * the topmost visible candidate.
 */
export type PreferredEnterTo = 'last-focused' | 'default-element' | 'topmost';
