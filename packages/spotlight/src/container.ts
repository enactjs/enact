/**
 * Exports methods and members for creating and maintaining spotlight containers.
 *
 * @module spotlight/container
 * @private
 */

import and from 'ramda/src/and';
import concat from 'ramda/src/concat';
import {isWindowReady} from '@enact/core/snapshot';
import {coerceArray} from '@enact/core/util';
import intersection from 'ramda/src/intersection';
import last from 'ramda/src/last';

import {contains, matchSelector, getContainerRect, getRect, intersects, isStandardFocusable} from './utils';
import type {
	ContainerConfig,
	ContainerConfigUpdate,
	LastFocusedPersistResult
} from '../types/ContainerConfig';
import type {ContainerTarget} from '../types/ContainerTarget';
import type {Direction} from '../types/Direction';
import type {PreferredEnterTo} from '../types/PreferredEnterTo';

/** Shape of the private, per-container bookkeeping stored in `config.previous`. */
interface PreviousTarget {
	target: ContainerTarget;
	destination: ContainerTarget;
	reverse: Direction;
}

/** Event-like object passed to the `onEnterContainer`/`onLeaveContainer`/`onLeaveContainerFail` callbacks. */
interface ContainerNavigationEvent {
	type: string;
	direction: Direction;
	target: Document | Element | null | undefined;
	relatedTarget: Document | Element | null | undefined;
}

const containerAttribute = 'data-spotlight-id';
const containerConfigs   = new Map<string, ContainerConfig>();
const containerKey       = 'spotlightId';
const disabledKey        = 'spotlightContainerDisabled';
const containerPrefix    = 'container-';
const containerSelector  = '[data-spotlight-container]';
const rootContainerId    = 'spotlightRootDecorator';
const reverseDirections: Record<Direction, Direction> = {
	'left': 'right',
	'up': 'down',
	'right': 'left',
	'down': 'up'
};

// Incrementer for container IDs
let _ids = 0;

let _defaultContainerId = '';
let _lastContainerId = '';

// Note: an <extSelector> can be one of following types:
// - a valid selector string for "querySelectorAll"
// - a NodeList or an array containing DOM elements
// - a single DOM element
// - a string "@<containerId>" to indicate the specified container
// - a string "@" to indicate the default container
let GlobalConfig: ContainerConfig = {
	// set to false for unmounted containers to omit them from searches
	active: true,
	continue5WayHold: false,
	defaultElement: '',     // <extSelector> except "@" syntax.
	enterTo: null,            // null, 'last-focused', 'default-element'
	isStandardFocusableMode: false,     // @private - set to true to focus standard focusable element
	lastFocusedElement: null,
	lastFocusedKey: null,
	lastFocusedPersist: (node: Element | string, all: (Element | string)[]): LastFocusedPersistResult => {
		const container = typeof node === 'string';
		return {
			container,
			element: !container,
			key: container ? node : all.indexOf(node)
		};
	},
	lastFocusedRestore: ({container, key}: LastFocusedPersistResult, all: (Element | string)[]): Element | string | undefined => {
		return container ? (key as string) : all[key as number];
	},
	leaveFor: null,         // {left: <extSelector>, right: <extSelector>, up: <extSelector>, down: <extSelector>}
	navigableFilter: null,
	obliqueMultiplier: 5,
	onEnterContainer: null,     // @private - notify the container when entering via 5-way
	onLeaveContainer: null,      // @private - notify the container when leaving via 5-way
	onLeaveContainerFail: null,  // @private - notify the container when failing to leave via 5-way
	overflow: false,
	partition: false, // use the container bounds for partitioning when leaving
	positionTargetOnFocus: false, // @private - use the container for the position target when its descendants is focused
	rememberSource: false,
	restrict: 'self-first', // 'self-first', 'self-only', 'none'
	selector: '',           // can be a valid <extSelector> except "@" syntax.
	selectorDisabled: false,
	straightMultiplier: 1,
	straightOnly: false,
	straightOverlapThreshold: 0.5,
	tabIndexIgnoreList: 'a, input, select, textarea, button, iframe, [contentEditable=true]'
};

/**
 * Calculates nodes within `node` that match `includeSelector` and do not match `excludeSelector`
 *
 * @param   {Node}    node             DOM Node to query
 * @param   {String}  includeSelector  CSS selector of nodes to include
 * @param   {String}  excludeSelector  CSS selector for nodes to exclude
 *
 * @returns {Node[]}                   Array of nodes
 * @memberof spotlight/container
 * @private
 */
const querySelector = (node: Document | Element, includeSelector: string, excludeSelector: string): Element[] => {
	const focusables = GlobalConfig.isStandardFocusableMode ?
		Array.prototype.filter.call(node.getElementsByTagName('*'), isStandardFocusable) as Element[] :
		[];
	const include = new Set<Element>([...node.querySelectorAll(includeSelector), ...focusables]);

	const exclude = node.querySelectorAll(excludeSelector);

	for (let i = 0; i < exclude.length; i++) {
		include.delete(exclude[i]);
	}

	return Array.from(include);
};

/**
 * Determines if `node` is a spotlight container
 *
 * @param   {Node}     node   Node to check
 *
 * @returns {Boolean}        `true` if `node` is a spotlight container
 * @memberof spotlight/container
 * @private
 */
const isContainerNode = (node: unknown): boolean => {
	return Boolean(node && (node as HTMLElement).dataset && 'spotlightContainer' in (node as HTMLElement).dataset);
};

/**
 * Walks up the node hierarchy calling `fn` on each node that is a container
 *
 * @param   {Node}     node  Node from which to start the search
 * @param   {Function} fn    Called once for each container with the container node as the first
 *                           argument. The return value is accumulated in the array returned by
 *                           `mapContainers`
 *
 * @returns {Array}          Array of values returned by `fn` in order of outermost container to
 *                           innermost container
 * @memberof spotlight/container
 * @private
 */
const mapContainers = <T>(node: Document | Element | null | undefined, fn: (node: Element) => T): T[] => {
	const result: T[] = [];
	let current = node;

	while (current && current !== document) {
		if (isContainerNode(current)) {
			result.unshift(fn(current as Element));
		}
		current = current.parentNode as Document | Element | null;
	}

	return result;
};

/**
 * Returns the container config for `containerId`
 *
 * @param   {String}  id  Container ID
 *
 * @returns {Object}      Container config
 * @memberof spotlight/container
 * @private
 */
const getContainerConfig = (id: string): ContainerConfig | undefined => {
	return containerConfigs.get(id);
};

/**
 * Determines if node or a container id represents a spotlight container
 *
 * @param   {Node|String}  nodeOrId  Node or container ID
 *
 * @returns {Boolean}                `true` if `nodeOrId` represents a spotlight container
 * @memberof spotlight/container
 * @private
 */
const isContainer = (nodeOrId: unknown): boolean => {
	if (typeof nodeOrId === 'string') {
		return containerConfigs.has(nodeOrId);
	}

	return isContainerNode(nodeOrId);
};

/**
 * Determines if any of the containers at or above `node` are disabled and, if so, returns `false`.
 *
 * @param   {Node}     node  Spottable node or spotlight container
 *
 * @returns {Boolean}        `true` if all container ancestors are enabled
 * @memberof spotlight/container
 * @private
 */
const isContainerEnabled = (node: Document | Element): boolean => {
	return mapContainers(node, container => {
		return (container as HTMLElement).dataset[disabledKey] !== 'true';
	}).reduce(and, true) as boolean;
};

/**
 * Returns the container ID for `node`
 *
 * @param   {Node}    node  Container Node
 *
 * @returns {String}        Container ID
 * @memberof spotlight/container
 * @private
 */
const getContainerId = (node: Element): string => (node as HTMLElement).dataset[containerKey] as string;

/**
 * Generates a CSS selector string for a current container if `node` is a container
 *
 * @param   {Node}    node  Container Node
 *
 * @returns {String}        CSS selector
 * @memberof spotlight/container
 * @private
 */
const getContainerSelector = (node: Document | Element): string => {
	if (isContainerNode(node)) {
		return `[${containerAttribute}="${getContainerId(node as Element)}"]`;
	}

	return '';
};

/**
 * Generates a CSS selector string for containers within `node` if it is a container
 *
 * @param   {Node}    node  Container Node
 *
 * @returns {String}        CSS selector
 * @memberof spotlight/container
 * @private
 */
const getSubContainerSelector = (node: Document | Element): string => {
	if (isContainerNode(node)) {
		return `${getContainerSelector(node)} ${containerSelector}`;
	}

	return containerSelector;
};

/**
 * Returns the node for a container
 *
 * @param   {String}  containerId  ID of container
 *
 * @returns {Node}                 DOM node of the container
 * @memberof spotlight/container
 * @private
 */
const getContainerNode = (containerId: string): Document | Element | null => {
	if (!containerId) {
		return null;
	} else if (containerId === rootContainerId) {
		return document;
	}

	return document.querySelector(`[${containerAttribute}="${containerId}"]`);
};

/**
 * Calls the `navigableFilter` function for the container if defined.
 *
 * @param   {Node}    node         DOM node to check if it is navigable
 * @param   {String}  containerId  ID of container
 *
 * @returns {Boolean}              `true` if it passes the `navigableFilter` method or if that
 *                                  method is not defined for the container
 * @memberof spotlight/container
 * @private
 */
const navigableFilter = (node: Document | Element | null, containerId: string): boolean => {
	const nodeStyle = node && isWindowReady() && window.getComputedStyle(node as Element);
	const config = getContainerConfig(containerId);

	if (!nodeStyle || nodeStyle.display === 'none' || nodeStyle.visibility === 'hidden') {
		return false;
	}

	if (config && typeof config.navigableFilter === 'function') {
		const filter = config.navigableFilter as (elem: Element, containerId?: string) => boolean | void;
		if (filter(node as Element, containerId) === false) {
			return false;
		}
	}

	return true;
};

/**
 * Determines nodes that are owned by `node` based on `aria-owns`.
 *
 * @param   {Node}   node          Owner
 *
 * @returns {Node[]}               Array of owned nodes
 * @memberof spotlight/container
 * @private
 */
const getOwnedNodes = (node: Document | Element | null, selector: unknown): Element[] => {
	// if node is document, it will not have getAttribute and therefore can't have aria-owns
	const owns = (node as Element | null)?.getAttribute?.('aria-owns');
	if (owns) {
		const ids = owns.split(' ');
		return ids
			.map(id => (id ? document.getElementById(id) : null))
			.filter((n): n is HTMLElement => Boolean(n))
			.filter(n => isContainerNode(n) || matchSelector(selector as string, n));
	}

	return [];
};

/**
 * Determines all spottable elements and containers that are directly contained by the container
 * identified by `containerId` and no other subcontainers.
 *
 * @param   {String}  containerId  ID of container
 *
 * @returns {Node[]}               Array of spottable elements and containers.
 * @memberof spotlight/container
 * @public
 */
const getSpottableDescendants = (containerId: string): Element[] => {
	const node = getContainerNode(containerId);

	// if it's falsy or is a disabled container, return an empty set
	if (!node || (isContainerNode(node) && !isContainerEnabled(node))) {
		return [];
	}

	const {selector, selectorDisabled} = getContainerConfig(containerId) || ({} as Partial<ContainerConfig>);

	if (!selector || selectorDisabled) {
		return [];
	}

	const spottableSelector = selector;
	const subContainerSelector = getSubContainerSelector(node);
	const candidates = querySelector(
		node,
		`${spottableSelector}, ${getContainerSelector(node)} ${containerSelector}:not([data-spotlight-container-disabled="true"])`,
		`${subContainerSelector} ${spottableSelector}, ${subContainerSelector} ${containerSelector}`
	);

	candidates.push(...getOwnedNodes(node, selector));

	return candidates.filter(n => navigableFilter(n, containerId));
};

/**
 * Recursively get spottable descendants by including elements within sub-containers that do not
 * have `enterTo` configured
 *
 * @param   {String}    containerId          	ID of container
 * @param   {String[]}  [excludedContainers] 	IDs of containers to exclude from result set
 *
 * @returns {Node[]}                         	Array of spottable elements and containers
 * @memberof spotlight/container
 * @private
 */
const getDeepSpottableDescendants = (containerId: string, excludedContainers?: string[], _all?: boolean): Element[] => {
	return getSpottableDescendants(containerId)
		.map(n => {
			if (isContainer(n)) {
				const id = getContainerId(n);
				const config = getContainerConfig(id);

				if (excludedContainers && excludedContainers.indexOf(id) >= 0) {
					return [];
				} else if (config && !config.enterTo) {
					return getDeepSpottableDescendants(id, excludedContainers);
				}
			}

			return [n];
		})
		.reduce(concat, [] as Element[]) as Element[];
};

/**
 * Determines if a container allows 5-way key hold to be preserved or not.
 *
 * @param {String} containerId Container Id
 * @returns {Boolean} `true` if a container is 5 way holdable
 * @memberof spotlight/container
 * @private
 */
const isContainer5WayHoldable = (containerId: string): boolean => {
	const config = getContainerConfig(containerId);
	return (config && config.continue5WayHold) || false;
};

/**
 * Returns an array of ids for containers that wrap the element, in order of outer-to-inner, with
 * the last array item being the immediate container id of the element.
 *
 * @param   {Node}      node  Node from which to start the search
 *
 * @returns {String[]}        Array on container IDs
 * @memberof spotlight/container
 * @private
 */
function getContainersForNode (node: Document | Element | null | undefined): string[] {
	const containers = mapContainers(node, getContainerId);
	containers.unshift(rootContainerId);

	return containers;
}

/**
 * Returns an array of ids for containers that wrap the element, in order of outer-to-inner, with
 * the last array item being the immediate container id of the element. The container ids are
 * limited to only those between `node` and the first restrict="self-only" container.
 *
 * @param   {Node}      node  Node from which to start the search
 *
 * @returns {String[]}        Array on container IDs
 * @memberof spotlight/container
 * @private
 */
function getNavigableContainersForNode (node: Document | Element | null | undefined): string[] {
	const containerIds = getContainersForNode(node);

	// find first self-only container id
	const selfOnlyIndex = containerIds
		.map(getContainerConfig)
		.filter((config): config is ContainerConfig => config != null)
		.reduceRight((index, config, i) => {
			if (index === -1 && config.restrict === 'self-only') {
				return i;
			}

			return index;
		}, -1);

	// if we found one (and it's not the root), slice those off and return
	if (selfOnlyIndex > 0) {
		return containerIds.slice(selfOnlyIndex);
	}

	return containerIds;
}

/**
 * Generates a new unique identifier for a container
 *
 * @returns {String} Container ID
 * @memberof spotlight/container
 * @private
 */
function generateId (): string {
	let id: string;
	/* eslint no-constant-condition: ["error", { "checkLoops": false }] */
	while (true) {
		id = containerPrefix + String(++_ids);
		if (!isContainer(id)) {
			break;
		}
	}
	return id;
}

/**
 * Merges two container configurations while only allowing keys from `updated` which are defined in
 * `GlobalConfig`
 *
 * @param   {Object}  current  Current container configuration
 * @param   {Object}  updated  Updated configuration which may only be a partial configuration
 *
 * @returns {Object}           Merged configuration
 * @memberof spotlight/container
 * @private
 */
const mergeConfig = (current: ContainerConfig, updated?: ContainerConfigUpdate | null): ContainerConfig => {
	if (!updated) return current;

	let cfg: ContainerConfig | null = null;

	Object.keys(updated).forEach(key => {
		if (key in GlobalConfig && current[key] !== updated[key]) {
			if (cfg == null) {
				cfg = Object.assign({}, current);
			}
			cfg[key] = updated[key];
		}
	});

	return cfg || current;
};

/**
 * Adds or updates a container. When a container id is not specified, it will be generated.
 *
 * @param   {String|Object}  containerIdOrConfig  Either a string container id or a configuration
 *                                                object.
 * @param   {Object}         [config]             Container configuration when `containerIdOrConfig`
 *                                                is a string. When omitted, the container will have
 *                                                the default `GlobalConfig`.
 *
 * @returns {String}                              The container id
 * @memberof spotlight/container
 * @public
 */
const configureContainer = (...args: (string | ContainerConfigUpdate)[]): string => {
	let containerId: string | undefined;
	let config: ContainerConfigUpdate | undefined;

	if (typeof args[0] === 'object') {
		config = args[0];
		containerId = config.id;
	} else if (typeof args[0] === 'string') {
		containerId = args[0];
		if (typeof args[1] === 'object') {
			config = args[1];
		}
	}

	if (!containerId) {
		containerId = generateId();
	}

	const mergedConfig = mergeConfig(containerConfigs.get(containerId) || {...GlobalConfig}, config);
	containerConfigs.set(containerId, mergedConfig);

	return containerId;
};

/**
 * Adds a container and marks it active. When a container id is not specified, it will be generated.
 *
 * @param   {String|Object}  containerIdOrConfig  Either a string container id or a configuration
 *                                                object.
 * @param   {Object}         [config]             Container configuration when `containerIdOrConfig`
 *                                                is a string. When omitted, the container will have
 *                                                the default `GlobalConfig`.
 *
 * @returns {String}                              The container id
 * @memberof spotlight/container
 * @public
 */
const addContainer = (...args: (string | ContainerConfigUpdate)[]): string => {
	const containerId = configureContainer(...args);
	const config = getContainerConfig(containerId) as ContainerConfig;
	config.active = true;

	return containerId;
};

/**
 * Removes a container
 *
 * @param   {String}     containerId  ID of the container to remove
 *
 * @returns {undefined}
 * @memberof spotlight/container
 * @public
 */
const removeContainer = (containerId: string): void => {
	containerConfigs.delete(containerId);
};

/**
 * Removes all containers
 *
 * @returns {undefined}
 * @memberof spotlight/container
 * @public
 */
const removeAllContainers = (): void => {
	containerConfigs.clear();
};

/**
 * Configures the `GlobalConfig` for containers
 *
 * @param   {Object}  config  New global configuration. Cannot introduce new keys
 *
 * @returns {undefined}
 * @memberof spotlight/container
 * @public
 */
const configureDefaults = (config?: ContainerConfigUpdate | null): void => {
	GlobalConfig = mergeConfig(GlobalConfig, config);
};

/**
 * Determines if `node` is a navigable element within the container identified by `containerId`.
 *
 * @param   {Node}     node         DOM node to check if it is navigable
 * @param   {String}   containerId  ID of the container containing `node`
 * @param   {Boolean}  verify       `true` to verify the node matches the container's `selector`
 *
 * @returns {Boolean}               `true` if `node` is navigable
 * @memberof spotlight/container
 * @public
 */
const isNavigable = (node: Document | Element | null | undefined, containerId: string, verify?: boolean): boolean => {
	if (!node || (
		// jsdom reports all nodes as having no size so we must skip this condition in our tests
		process.env.NODE_ENV !== 'test' &&
		(node as HTMLElement).offsetWidth <= 0 && (node as HTMLElement).offsetHeight <= 0
	)) {
		return false;
	}

	const containerNode = getContainerNode(containerId);
	if (containerNode !== document && (containerNode as HTMLElement).dataset[disabledKey] === 'true') {
		return false;
	}

	const config = getContainerConfig(containerId);
	if (verify && config && config.selector && !isContainer(node) && !matchSelector(config.selector, node as Element) && !(GlobalConfig.isStandardFocusableMode && isStandardFocusable(node as Element))) {
		return false;
	}

	return navigableFilter(node, containerId);
};

/**
 * Returns the IDs of all containers
 *
 * @returns {String[]}  Array of container IDs
 * @memberof spotlight/container
 * @private
 */
const getAllContainerIds = (): string[] => {
	const ids: string[] = [];
	const keys = containerConfigs.keys();

	// PhantomJS-friendly iterator->array conversion
	let id: IteratorResult<string> | undefined;
	while ((id = keys.next()) && !id.done) {
		if (isActiveContainer(id.value)) {
			ids.push(id.value);
		}
	}

	return ids;
};

/**
 * Returns the default focus element for a container
 *
 * @param   {String}                                       containerId        Container ID
 * @param   {('last-focused'|'default-element'|'topmost')} [preferredEnterTo] Prefer the given enterTo configuration
 *
 * @returns {Node|null}                 Default focus element
 * @memberof spotlight/container
 * @public
 */
function getContainerDefaultElement (containerId: string, preferredEnterTo?: PreferredEnterTo): Element | null | undefined {
	const config = getContainerConfig(containerId);

	const configuredDefaultElement = config && config.defaultElement;
	if (!configuredDefaultElement) {
		return null;
	}

	// `defaultElement` is documented as an <extSelector> but, in practice, is only ever a CSS
	// selector string, a single Element, or an array of either.
	const defaultElementSelector: (string | Element)[] = coerceArray(
		configuredDefaultElement as string | Element | (string | Element)[]
	);

	// If a preferred enterTo has been provided, we will favor it by making it first in search array
	if (preferredEnterTo && typeof preferredEnterTo === 'string' && preferredEnterTo !== 'default-element') {
		defaultElementSelector.unshift(preferredEnterTo);
	}

	const spottables = getDeepSpottableDescendants(containerId);

	return defaultElementSelector.reduce((result: Element | null | undefined, selector) => {
		if (result) {
			return result;
		}

		if (typeof selector === 'string') {
			return spottables.filter(elem => {
				return matchSelector(selector, elem) && isNavigable(elem, containerId, true);
			})[0];
		}

		// FIXME: There is some prior implicit support for `defaultElement` to be an element rather
		// than a selector. This continues that support but should eventually be removed.
		return selector;
	}, null);
}

/**
 * Gets the element last focused within the container.
 *
 * @param   {String}       containerId  ID of container
 *
 * @returns {Node|String|null}               DOM Node last focused
 * @memberof spotlight/container
 * @public
 */
function getContainerLastFocusedElement (containerId: string): Element | string | null {
	const config = getContainerConfig(containerId);

	if (!config || !config.lastFocusedElement) {
		return null;
	}

	// lastFocusedElement may be a container ID so try to convert it to a node to test navigability
	const {lastFocusedElement} = config;
	let node: Document | Element | string | null = lastFocusedElement;
	if (typeof node === 'string') {
		node = getContainerNode(node);
	}

	return isNavigable(node, containerId, true) ? lastFocusedElement : null;
}

/**
 * Sets the element last focused within the container
 *
 * @param   {Node}      node         DOM node last focused
 * @param   {String[]}  containerId  ID of container
 *
 * @returns {undefined}
 * @memberof spotlight/container
 * @public
 */
function setContainerLastFocusedElement (node: Element | string, containerIds: string[]): void {
	let lastFocusedElement: Element | string = node;
	for (let i = containerIds.length - 1; i > -1; i--) {
		const id = containerIds[i];
		configureContainer(id, {lastFocusedElement});

		// If any container in the stack is controlling entering focus, use its container id as the
		// lastFocusedElement instead of the node
		const config = getContainerConfig(id) as ContainerConfig;
		if (config.enterTo) {
			lastFocusedElement = id;
		}
	}
}

/**
 * Returns all navigable nodes (spottable nodes or containers) visible from outside the container.
 * If the container is restricting navigation into itself via `enterTo`, this method will attempt to
 * return that element as the only element in an array. If that fails or if navigation is not
 * restricted, it will return an array of all possible navigable nodes.
 *
 * @param   {String}                                       containerId        Container ID
 * @param   {('last-focused'|'default-element'|'topmost')} [preferredEnterTo] Prefer the given enterTo configuration
 *
 * @returns {Node[]}             Navigable elements within container
 * @memberof spotlight/container
 * @public
 */
function getContainerNavigableElements (containerId: string, preferredEnterTo?: PreferredEnterTo): ContainerTarget[] {
	if (!isContainer(containerId)) {
		return [];
	}

	const config = getContainerConfig(containerId) as ContainerConfig;
	const {enterTo, overflow} = config;

	const enterLast = preferredEnterTo === 'last-focused' || (enterTo === 'last-focused' && !preferredEnterTo);
	let next: ContainerTarget | ContainerTarget[] | null | undefined;

	// if the container has a preferred entry point, try to find it first
	if (enterLast) {
		next = getContainerLastFocusedElement(containerId);
	}

	// try default element if last focused can't be focused
	if (!next) {
		next = getContainerDefaultElement(containerId, preferredEnterTo);
	}

	if (!next) {
		let spottables: ContainerTarget[] = overflow ?
			// overflow requires deep recursion to handle selecting the children of unrestricted
			// containers or restricted containers larger than the container
			getDeepSpottableDescendants(containerId) :
			getSpottableDescendants(containerId);

		// if there isn't a preferred entry on an overflow container, filter the visible elements
		if (overflow) {
			const containerRect = getContainerRect(containerId);
			let filtered: Element[] | null = containerRect ? (spottables as Element[]).filter(element => {
				const elementRect = getRect(element);
				if (isContainer(element)) {
					return intersects(containerRect, elementRect);
				}

				return contains(containerRect, getRect(element));
			}) : null;

			if (filtered && preferredEnterTo === 'topmost') {
				filtered.sort((a, b) => (getRect(a).top - getRect(b).top));
			}

			next = filtered;
		}

		// otherwise, return all spottables within the container
		if (!next) {
			next = spottables;
		}
	}

	return next ? coerceArray(next as ContainerTarget | ContainerTarget[]) : [];
}

/**
 * Determines the preferred focus target, traversing any sub-containers as necessary, for the given
 * container.
 *
 * @param   {String}                                       containerId        Container ID
 * @param   {('last-focused'|'default-element'|'topmost')} [preferredEnterTo] Prefer the given enterTo configuration
 *
 * @returns {Node}                 Preferred target as either a DOM node or container-id
 * @memberof spotlight/container
 * @public
 */
function getContainerFocusTarget (containerId: string, preferredEnterTo?: PreferredEnterTo): ContainerTarget | null {
	// deferring restoration until it's requested to allow containers to prepare first
	restoreLastFocusedElement(containerId);

	const next = getContainerNavigableElements(containerId, preferredEnterTo);
	// If multiple candidates returned, we need to find the first viable target since some may
	// be empty containers which should be skipped.
	return next.reduce((result: ContainerTarget | null, element) => {
		if (result) {
			return result;
		} else if (isContainer(element)) {
			const nextId = isContainerNode(element) ? getContainerId(element as Element) : element;
			if (nextId !== containerId) return getContainerFocusTarget(nextId as string);
		}

		return element;
	}, null) || null;
}

function getContainerPreviousTarget (containerId: string, direction: Direction, destination: ContainerTarget): ContainerTarget | undefined {
	const config = getContainerConfig(containerId);
	const previous = config && (config.previous as PreviousTarget | undefined);

	if (config &&
		config.rememberSource &&
		previous &&
		previous.reverse === direction &&
		previous.destination === destination
	) {
		return previous.target;
	}
}

function setContainerPreviousTarget (containerId: string, direction: Direction, destination: ContainerTarget, target: ContainerTarget): void {
	const config = getContainerConfig(containerId);

	if (config && config.rememberSource) {
		configureContainer(containerId, {
			previous: {
				target,
				destination,
				reverse: reverseDirections[direction]
			}
		});
	}
}

/**
 * Saves the last focused element into `lastFocusedKey` using a container-defined serialization
 * method configured in `lastFocusedPersist`.
 *
 * @param   {String}     containerId  ID of container
 *
 * @returns {undefined}
 * @memberof spotlight/container
 * @public
 */
function persistLastFocusedElement (containerId: string): void {
	const cfg = getContainerConfig(containerId);
	if (cfg) {
		const {lastFocusedElement} = cfg;
		if (lastFocusedElement) {
			const all = getDeepSpottableDescendants(containerId, [], true);
			const lastFocusedKey = cfg.lastFocusedPersist(lastFocusedElement, all);

			// store lastFocusedKey and release node reference to lastFocusedElement
			cfg.lastFocusedKey = lastFocusedKey;
			cfg.lastFocusedElement = null;
		}
	}
}

/**
 * Restores the last focused element from `lastFocusedKey` using a container-defined deserialization
 * method configured in `lastFocusedRestore`.
 *
 * @param   {String}     containerId  ID of container
 *
 * @returns {undefined}
 * @memberof spotlight/container
 * @public
 */
function restoreLastFocusedElement (containerId: string): void {
	const cfg = getContainerConfig(containerId);
	if (cfg && cfg.lastFocusedKey) {
		const all = getDeepSpottableDescendants(containerId, [], true);
		const lastFocusedElement = cfg.lastFocusedRestore(cfg.lastFocusedKey as LastFocusedPersistResult, all);

		// restore lastFocusedElement and release lastFocusedKey
		cfg.lastFocusedKey = null;
		cfg.lastFocusedElement = lastFocusedElement ?? null;
	}
}

function unmountContainer (containerId: string): void {
	const config = getContainerConfig(containerId);

	if (config) {
		config.active = false;
		persistLastFocusedElement(containerId);

		if (typeof config.defaultElement !== 'string') {
			config.defaultElement = null;
		}
	}
}

function isActiveContainer (containerId: string): boolean {
	const config = getContainerConfig(containerId);
	return Boolean(config && config.active);
}

/**
 * Determines if the provided container has a configured restriction.
 *
 * By default, returns `true` for `'self-only'` restrictions but the type of restriction can be
 * passed as well.
 *
 * @param {String} containerId The container id
 * @param {String} [restrict] The container restriction defaulted to `'self-only'`
 * @returns {Boolean} `true` if the container has the specified restriction
 * @private
 */
function isRestrictedContainer (containerId: string, restrict: string = 'self-only'): boolean {
	const config = getContainerConfig(containerId);

	return Boolean(config && config.restrict === restrict);
}

/**
 * Determines if `innerContainerId` is inside `outerContainerId`.
 *
 * @param {String} outerContainerId The outer container id
 * @param {String} innerContainerId The inner container id
 * @returns {Boolean} `true` if both containers exist and `innerContainerId` is within
 *                    `outerContainerId`
 * @private
 */
function containsContainer (outerContainerId: string, innerContainerId: string): boolean {
	const outer = getContainerNode(outerContainerId);
	const inner = getContainerNode(innerContainerId);

	return Boolean(outer && inner && (outer as Element).contains(inner as Node));
}

/**
 * Determines if `containerId` may become the active container.
 *
 * @param {String} containerId Spotlight container to which focus is leaving
 * @returns	{Boolean} `true` if the active container can change to `containerId`
 * @private
 */
function mayActivateContainer (containerId: string): boolean {
	const currentContainerId = getLastContainer();

	// If the current container or its outer containers are restricted to 'self-only' and
	// if the next container to be activated is not inside the restrict container,
	// the next container should not be activated.
	const currentContainerNode = getContainerNode(currentContainerId);
	const restrictContainer = getContainersForNode(currentContainerNode).reduceRight((result: string | null, outerContainerId) => {
		return result || (isRestrictedContainer(outerContainerId) ? outerContainerId : null);
	}, null);

	return !restrictContainer || containsContainer(restrictContainer, containerId);
}

function getDefaultContainer (): string {
	return isActiveContainer(_defaultContainerId) ? _defaultContainerId : '';
}

function setDefaultContainer (containerId?: string): void {
	if (!containerId) {
		_defaultContainerId = '';
	} else if (!getContainerConfig(containerId)) {
		throw new Error('Container "' + containerId + '" doesn\'t exist!');
	} else {
		_defaultContainerId = containerId;
	}
}

function getLastContainer (): string {
	return isActiveContainer(_lastContainerId) ? _lastContainerId : '';
}

function setLastContainer (containerId?: string | null): void {
	_lastContainerId = containerId || '';
}

/**
 * Updates the last container based on the current focus and target focus.
 *
 * @param {Node} current Currently focused node
 * @param {Node} target  Target node. May or may not be focusable
 * @memberof spotlight/container
 * @public
 */
function setLastContainerFromTarget (current: Document | Element | null | undefined, target: Document | Element | null | undefined): void {
	const currentContainers = getNavigableContainersForNode(current);
	const currentOuterContainerId = currentContainers[0];
	const currentContainerConfig = getContainerConfig(currentOuterContainerId);
	const targetContainers = getContainersForNode(target);
	const targetInnerContainer = last(targetContainers);

	const sharedContainer = last(intersection(currentContainers, targetContainers));

	if (sharedContainer || !currentContainerConfig || currentContainerConfig.restrict !== 'self-only') {
		// If the target shares a container with the current container stack or the current
		// element isn't within a self-only container, use the target's nearest container
		setLastContainer(targetInnerContainer);
	} else {
		// Otherwise, the target is not within the current container stack and the current
		// element was within a 'self-only' container, use the current's outer container
		setLastContainer(currentOuterContainerId);
	}
}

function isWithinOverflowContainer (target: Document | Element | null | undefined, containerIds: string[] = getContainersForNode(target)): boolean {
	return containerIds
		// ignore the root container id which is set to overflow by the root decorator
		.filter(id => id !== rootContainerId)
		// get the config for each container
		.map(getContainerConfig)
		// and check if any are set to overflow
		.some(config => config && config.overflow);
}

/**
 * Notifies any affected containers that focus has left one of their children for another container
 *
 * @param {String} direction up/down/left/right
 * @param {Node} current currently focused element
 * @param {String[]} currentContainerIds Containers for current
 * @param {Node} next To be focused element
 * @param {String[]} nextContainerIds Containers for next
 * @private
 */
function notifyLeaveContainer (direction: Direction, current: Document | Element | null | undefined, currentContainerIds: string[], next: Document | Element | null | undefined, nextContainerIds: string[]): void {
	currentContainerIds.forEach(containerId => {
		if (!nextContainerIds.includes(containerId)) {
			const config = getContainerConfig(containerId);

			if (config && config.onLeaveContainer) {
				const onLeaveContainer = config.onLeaveContainer as unknown as (ev: ContainerNavigationEvent) => void;
				onLeaveContainer({
					type: 'onLeaveContainer',
					direction,
					target: current,
					relatedTarget: next
				});
			}
		}
	});
}

/**
 * Notifies any containers that focus attempted to move but failed to find a target
 *
 * @param {String} direction up/down/left/right
 * @param {Node} current currently focused element
 * @param {String[]} currentContainerIds Containers for current
 * @private
 */
function notifyLeaveContainerFail (direction: Direction, current: Document | Element | null | undefined, currentContainerIds: string[]): void {
	currentContainerIds.forEach(containerId => {
		const config = getContainerConfig(containerId);

		if (config && config.onLeaveContainerFail) {
			const onLeaveContainerFail = config.onLeaveContainerFail as unknown as (ev: Omit<ContainerNavigationEvent, 'relatedTarget'>) => void;
			onLeaveContainerFail({
				type: 'onLeaveContainerFail',
				direction,
				target: current
			});
		}
	});
}

/**
 * Notifies any affected containers that one of their children has received focus.
 *
 * @param {String} direction up/down/left/right
 * @param {Node} previous Previously focused element
 * @param {String[]} previousContainerIds Containers for previous
 * @param {Node} current Currently focused element
 * @param {String[]} currentContainerIds Containers for current
 * @private
 */
function notifyEnterContainer (direction: Direction, previous: Document | Element | null | undefined, previousContainerIds: string[], current: Document | Element | null | undefined, currentContainerIds: string[]): void {
	currentContainerIds.forEach(containerId => {
		if (!previousContainerIds.includes(containerId)) {
			const config = getContainerConfig(containerId);

			if (config && config.onEnterContainer) {
				const onEnterContainer = config.onEnterContainer as unknown as (ev: ContainerNavigationEvent) => void;
				onEnterContainer({
					type: 'onEnterContainer',
					direction,
					target: current,
					relatedTarget: previous
				});
			}
		}
	});
}

/**
 * Returns the closest container that wrap the element and has positionTargetOnFocus configured
 *
 * @param {Node} spotItem Focused element
 * @param {String[]} containerIds Ids for containers that wrap the spotItem element
 * @private
 */
function getPositionTargetOnFocus (spotItem: Document | Element, containerIds: string[] = getContainersForNode(spotItem)): Document | Element {
	return containerIds.reduce((result: Document | Element, containerId) => {
		if (getContainerConfig(containerId)?.positionTargetOnFocus) {
			result = getContainerNode(containerId) as Document | Element;
		}
		return result;
	}, spotItem);
}

export {
	// Remove
	getAllContainerIds,
	getContainerNode,

	// Maybe
	getContainerConfig,
	getContainerDefaultElement,
	getContainerLastFocusedElement,
	getContainerNavigableElements,
	getContainersForNode,
	isContainer5WayHoldable,
	setContainerLastFocusedElement,

	// Keep
	addContainer,
	containerAttribute,
	configureDefaults,
	configureContainer,
	getContainerFocusTarget,
	getContainerId,
	getContainerPreviousTarget,
	getDeepSpottableDescendants,
	getDefaultContainer,
	getLastContainer,
	getNavigableContainersForNode,
	getPositionTargetOnFocus,
	getSpottableDescendants,
	isContainer,
	isNavigable,
	isWithinOverflowContainer,
	mayActivateContainer,
	notifyLeaveContainer,
	notifyLeaveContainerFail,
	notifyEnterContainer,
	removeAllContainers,
	removeContainer,
	rootContainerId,
	setContainerPreviousTarget,
	setDefaultContainer,
	setLastContainer,
	setLastContainerFromTarget,
	unmountContainer
};
