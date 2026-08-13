import type {
	ContainerConfig,
	EnterTo,
	LeaveFor,
	NavigableFilter,
	Restrict
} from './ContainerConfig';
import type {ExtSelector} from './ExtSelector';

/**
 * Container configuration passed to {@link spotlight/SpotlightContainerDecorator.SpotlightContainer}.
 */
export type SpotlightContainerRuntimeConfig = Partial<
	Pick<
		ContainerConfig,
		'continue5WayHold' | 'defaultElement' | 'enterTo' | 'leaveFor' | 'restrict'
	>
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
export interface SpotlightContainerDecoratorConfig {
	continue5WayHold: boolean;
	defaultElement: ExtSelector;
	enterTo: EnterTo;
	leaveFor: LeaveFor;
	navigableFilter: NavigableFilter;
	preserveId: boolean;
	restrict: Restrict;
}

/**
 * Default configuration for
 * {@link spotlight/SpotlightRootDecorator.SpotlightRootDecorator}.
 */
export interface SpotlightRootDecoratorConfig {
	focusEffectClass: string | null;
	noAutoFocus: boolean;
	rootId: string;
}
