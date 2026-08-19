import type {ContainerConfigUpdate} from './ContainerConfig';
import type {Direction} from './Direction';
import type {FocusOptions} from './FocusOptions';
import type {Position} from './Position';

/**
 * Public API exposed by {@link spotlight.Spotlight}.
 */
export interface SpotlightApi {
	initialize(containerDefaults?: ContainerConfigUpdate | null): void;
	terminate(): void;
	clear(): void;
	set(...args: (string | ContainerConfigUpdate)[]): string;
	add(...args: (string | ContainerConfigUpdate)[]): string;
	unmount(containerId: string): void;
	remove(containerId: string): boolean;
	disableSelector(containerId: string): boolean;
	enableSelector(containerId: string): boolean;
	pause(): void;
	resume(): void;
	focus(elem?: string | Element | null, options?: FocusOptions): boolean;
	move(direction: string, selector?: string): boolean;
	setDefaultContainer(containerId?: string): void;
	getActiveContainer(): string;
	setActiveContainer(containerId?: string | null): void;
	getPausedInstance(): string | null;
	getPointerMode(): boolean;
	setPointerMode(pointerMode: boolean): void;
	isMuted(elem?: Element | null): boolean;
	isPaused(): boolean;
	isSpottable(elem?: Element | null): boolean;
	getCurrent(): Element | undefined;
	getSpottableDescendants(containerId: string): Element[];
	focusNextFromPoint(direction: Direction, position: Position): boolean;
	resetKeyHoldState(): void;
}
