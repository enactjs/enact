import type {
	ContainerConfig,
	NavigableFilter
} from './ContainerConfig';

type SpotlightContainerConfigKeys =
	| 'continue5WayHold'
	| 'defaultElement'
	| 'enterTo'
	| 'leaveFor'
	| 'restrict';

/**
 * Container configuration passed to {@link spotlight/SpotlightContainerDecorator.SpotlightContainer}.
 */
export type SpotlightContainerRuntimeConfig = Partial<
	Pick<ContainerConfig, SpotlightContainerConfigKeys>
>;

/**
 * Configuration passed to {@link spotlight/SpotlightContainerDecorator.SpotlightContainer}.
 */
export interface SpotlightContainerConfig {
	containerConfig?: SpotlightContainerRuntimeConfig;
	navigableFilter?: NavigableFilter;
	preserveId?: boolean;
}

/**
 * Default configuration for
 * {@link spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator}.
 */
export type SpotlightContainerDecoratorConfig = Pick<
	ContainerConfig,
	SpotlightContainerConfigKeys | 'navigableFilter'
> & {
	preserveId: boolean;
};

/**
 * Default configuration for
 * {@link spotlight/SpotlightRootDecorator.SpotlightRootDecorator}.
 */
export interface SpotlightRootDecoratorConfig {
	focusEffectClass: string | null;
	noAutoFocus: boolean;
	rootId: string;
}
