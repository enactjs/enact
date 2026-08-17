import type {Direction} from './Direction';
import type {ExtSelector} from './ExtSelector';

export type EnterTo = 'last-focused' | 'default-element' | null;

export type Restrict = 'self-first' | 'self-only' | 'none';

export type LeaveFor = Partial<Record<Direction, ExtSelector>> | null;

export type NavigableFilter = ((elem: Element) => boolean | void) | null;

export interface LastFocusedPersistResult {
	container: boolean;
	element: boolean;
	key: string | number;
}

export type LastFocusedPersist = (
	node: Element | string,
	all: (Element | string)[]
) => LastFocusedPersistResult;

export type LastFocusedRestore = (
	state: LastFocusedPersistResult,
	all: (Element | string)[]
) => Element | string | undefined;

/**
 * Event-like object passed to container enter/leave navigation callbacks.
 */
export interface ContainerNavigationEvent {
	type: string;
	direction: Direction;
	target: Document | Element | null | undefined;
	relatedTarget: Document | Element | null | undefined;
}

/**
 * Per-container and global spotlight configuration.
 */
export interface ContainerConfig {
	active: boolean;
	continue5WayHold: boolean;
	defaultElement: ExtSelector;
	enterTo: EnterTo;
	isStandardFocusableMode: boolean;
	lastFocusedElement: Element | string | null;
	lastFocusedKey: LastFocusedPersistResult | string | number | null;
	lastFocusedPersist: LastFocusedPersist;
	lastFocusedRestore: LastFocusedRestore;
	leaveFor: LeaveFor;
	navigableFilter: NavigableFilter;
	obliqueMultiplier: number;
	onEnterContainer: ((ev: ContainerNavigationEvent) => void) | null;
	onLeaveContainer: ((ev: ContainerNavigationEvent) => void) | null;
	onLeaveContainerFail: ((ev: Omit<ContainerNavigationEvent, 'relatedTarget'>) => void) | null;
	overflow: boolean;
	partition: boolean;
	positionTargetOnFocus: boolean;
	rememberSource: boolean;
	restrict: Restrict;
	selector: ExtSelector;
	selectorDisabled: boolean;
	straightMultiplier: number;
	straightOnly: boolean;
	straightOverlapThreshold: number;
	tabIndexIgnoreList: string;
	[key: string]: unknown;
}

export type ContainerConfigUpdate = Partial<ContainerConfig> & {
	id?: string;
};
