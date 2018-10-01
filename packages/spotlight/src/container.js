/**
 * Exports methods and members for creating and maintaining spotlight containers.
 *
 * @module spotlight/container
 * @private
 */

import and from 'ramda/src/and';
import concat from 'ramda/src/concat';
import {coerceArray} from '@enact/core/util';
import intersection from 'ramda/src/intersection';
import last from 'ramda/src/last';

import {contains, matchSelector, getContainerRect, getRect} from './utils';

const containerAttribute = 'data-spotlight-id';
const containerConfigs   = new Map();
const containerKey       = 'spotlightId';
const disabledKey        = 'spotlightContainerDisabled';
const containerPrefix    = 'container-';
const containerSelector  = '[data-spotlight-container]';
const rootContainerId    = 'spotlightRootDecorator';
const reverseDirections = {
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
let GlobalConfig = {
	// set to false for unmounted containers to omit them from searches
	active: true,
	continue5WayHold: false,
	defaultElement: '',     // <extSelector> except "@" syntax.
	enterTo: '',            // '', 'last-focused', 'default-element'
	lastFocusedElement: null,
	lastFocusedKey: null,
	lastFocusedPersist: (node, all) => {
		const container = typeof node === 'string';
		return {
			container,
			element: !container,
			key: container ? node : all.indexOf(node)
		};
	},
	lastFocusedRestore: ({container, key}, all) => {
		return container ? key : all[key];
	},
	leaveFor: null,         // {left: <extSelector>, right: <extSelector>, up: <extSelector>, down: <extSelector>}
	navigableFilter: null,
	obliqueMultiplier: 5,
	onEnterContainer: null,     // @private - notify the container when entering via 5-way
	onLeaveContainer: null,      // @private - notify the container when leaving via 5-way
	onLeaveContainerFail: null,  // @private - notify the container when failing to leave via 5-way
	overflow: false,
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
const querySelector = (node, includeSelector, excludeSelector) => {
	const include = Array.prototype.slice.call(node.querySelectorAll(includeSelector));
	const exclude = node.querySelectorAll(excludeSelector);

	for (let i = 0; i < exclude.length; i++) {
		const index = include.indexOf(exclude.item(i));
		if (index >= 0) {
			include.splice(index, 1);
		}
	}

	return include;
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
const isContainerNode = (node) => {
	return node && node.dataset && 'spotlightContainer' in node.dataset;
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
const mapContainers = (node, fn) => {
	const result = [];

	while (node && node !== document) {
		if (isContainerNode(node)) {
			result.unshift(fn(node));
		}
		node = node.parentNode;
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
const getContainerConfig = (id) => {
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
const isContainer = (nodeOrId) => {
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
const isContainerEnabled = (node) => {
	return mapContainers(node, container => {
		return container.dataset[disabledKey] !== 'true';
	}).reduce(and, true);
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
const getContainerId = (node) => node.dataset[containerKey];

/**
 * Generates a CSS selector string for a current container if `node` is a container
 *
 * @param   {Node}    node  Container Node
 *
 * @returns {String}        CSS selector
 * @memberof spotlight/container
 * @private
 */
const getContainerSelector = (node) => {
	if (isContainerNode(node)) {
		return `[${containerAttribute}="${getContainerId(node)}"]`;
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
const getSubContainerSelector = (node) => {
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
const getContainerNode = (containerId) => {
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
const navigableFilter = (node, containerId) => {
	const config = getContainerConfig(containerId);
	if (config && typeof config.navigableFilter === 'function') {
		if (config.navigableFilter(node, containerId) === false) {
			return false;
		}
	}

	return true;
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
const getSpottableDescendants = (containerId) => {
	const node = getContainerNode(containerId);

	// if it's falsy or is a disabled container, return an empty set
	if (!node || (isContainerNode(node) && !isContainerEnabled(node))) {
		return [];
	}

	const {selector, selectorDisabled} = getContainerConfig(containerId) || {};

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

	return candidates.filter(n => navigableFilter(n, containerId));
};

/**
 * Recursively get spottable descendants by including elements within sub-containers that do not
 * have `enterTo` configured
 *
 * @param   {String}    containerId          ID of container
 * @param   {String[]}  [excludedContainers] IDs of containers to exclude from result set
 *
 * @returns {Node[]}                         Array of spottable elements and containers
 * @memberof spotlight/container
 * @private
 */
const getDeepSpottableDescendants = (containerId, excludedContainers) => {
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
		.reduce(concat, []);
};

/**
 * Determines if a container allows 5-way key hold to be preserved or not.
 *
 * @param {String} containerId Container Id
 * @returns {Boolean} `true` if a container is 5 way holdable
 * @memberof spotlight/container
 * @private
 */
const isContainer5WayHoldable = (containerId) => {
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
function getContainersForNode (node) {
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
function getNavigableContainersForNode (node) {
	const containerIds = getContainersForNode(node);

	// find first self-only container id
	const selfOnlyIndex = containerIds
		.map(getContainerConfig)
		.filter(config => config != null)
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
function generateId () {
	let id;
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
const mergeConfig = (current, updated) => {
	if (!updated) return current;

	let cfg = null;

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
const configureContainer = (...args) => {
	let containerId, config;

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

	config = mergeConfig(containerConfigs.get(containerId) || {...GlobalConfig}, config);
	containerConfigs.set(containerId, config);

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
const addContainer = (...args) => {
	const containerId = configureContainer(...args);
	const config = getContainerConfig(containerId);
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
const removeContainer = (containerId) => {
	containerConfigs.delete(containerId);
};

/**
 * Removes all containers
 *
 * @returns {undefined}
 * @memberof spotlight/container
 * @public
 */
const removeAllContainers = () => {
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
const configureDefaults = (config) => {
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
const isNavigable = (node, containerId, verify) => {
	if (!node || (node.offsetWidth <= 0 && node.offsetHeight <= 0)) {
		return false;
	}

	const containerNode = getContainerNode(containerId);
	if (containerNode !== document && containerNode.dataset[disabledKey] === 'true') {
		return false;
	}

	const config = getContainerConfig(containerId);
	if (verify && config && config.selector && !isContainer(node) && !matchSelector(config.selector, node)) {
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
const getAllContainerIds = () => {
	const ids = [];
	const keys = containerConfigs.keys();

	// PhantomJS-friendly iterator->array conversion
	let id;
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
 * @param   {String}  containerId  ID of container
 *
 * @returns {Node|null}                 Default focus element
 * @memberof spotlight/container
 * @public
 */
function getContainerDefaultElement (containerId) {
	const config = getContainerConfig(containerId);

	let defaultElementSelector = config && config.defaultElement;
	if (!defaultElementSelector) {
		return null;
	}

	defaultElementSelector = coerceArray(defaultElementSelector);
	const spottables = getDeepSpottableDescendants(containerId);

	return defaultElementSelector.reduce((result, selector) => {
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
function getContainerLastFocusedElement (containerId) {
	const config = getContainerConfig(containerId);

	if (!config || !config.lastFocusedElement) {
		return null;
	}

	// lastFocusedElement may be a container ID so try to convert it to a node to test navigability
	const {lastFocusedElement} = config;
	let node = lastFocusedElement;
	if (typeof node === 'string') {
		node = getContainerNode(lastFocusedElement);
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
function setContainerLastFocusedElement (node, containerIds) {
	let lastFocusedElement = node;
	for (let i = containerIds.length - 1; i > -1; i--) {
		const id = containerIds[i];
		configureContainer(id, {lastFocusedElement});

		// If any container in the stack is controlling entering focus, use its container id as the
		// lastFocusedElement instead of the node
		const config = getContainerConfig(id);
		if (config.enterTo) {
			lastFocusedElement = id;
		}
	}
}

/**
 * Returns all navigable nodes (spottable nodes or containers) visible from outside the container.
 * If the container is restricting navigation into itself via `enterTo`, this method will attempt to
 * return that element as the only element in an array. If that fails or if navigation is not restricted, it will return an
 * array of all possible navigable nodes.
 *
 * @param   {String} containerId Container ID
 *
 * @returns {Node[]}             Navigable elements within container
 * @memberof spotlight/container
 * @public
 */
function getContainerNavigableElements (containerId) {
	if (!isContainer(containerId)) {
		return [];
	}

	const config = getContainerConfig(containerId);

	const enterLast = config.enterTo === 'last-focused';
	const enterDefault = config.enterTo === 'default-element';
	let next;

	// if the container has a preferred entry point, try to find it first
	if (enterLast) {
		next = getContainerLastFocusedElement(containerId);
	} else if (enterDefault) {
		next = getContainerDefaultElement(containerId);
	}

	// if there isn't a preferred entry or it wasn't found, try to find something to spot
	if (!next) {
		next = (!enterDefault && getContainerDefaultElement(containerId)) ||
				getSpottableDescendants(containerId);
	}

	return next ? coerceArray(next) : [];
}

/**
 * Determines the preferred focus target, traversing any sub-containers as necessary, for the given
 * container.
 *
 * @param   {String}  containerId  ID of container
 *
 * @returns {Node}                 Preferred target as either a DOM node or container-id
 * @memberof spotlight/container
 * @public
 */
function getContainerFocusTarget (containerId) {
	// deferring restoration until it's requested to allow containers to prepare first
	restoreLastFocusedElement(containerId);

	let next = getContainerNavigableElements(containerId);

	// If multiple candidates returned, we need to find the first viable target since some may
	// be empty containers which should be skipped.
	return next.reduce((result, element) => {
		if (result) {
			return result;
		} else if (isContainer(element)) {
			const nextId = isContainerNode(element) ? getContainerId(element) : element;
			return getContainerFocusTarget(nextId);
		}

		const {overflow} = getContainerConfig(containerId);
		if (!overflow || contains(getContainerRect(containerId), getRect(element))) {
			return element;
		}
	}, null) || null;
}

function getContainerPreviousTarget (containerId, direction, destination) {
	const config = getContainerConfig(containerId);

	if (config &&
		config.rememberSource &&
		config.previous &&
		config.previous.reverse === direction &&
		config.previous.destination === destination
	) {
		return config.previous.target;
	}
}

function setContainerPreviousTarget (containerId, direction, destination, target) {
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
function persistLastFocusedElement (containerId) {
	const cfg = getContainerConfig(containerId);
	if (cfg) {
		const {lastFocusedElement} = cfg;
		if (lastFocusedElement) {
			const all = getDeepSpottableDescendants(containerId);
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
function restoreLastFocusedElement (containerId) {
	const cfg = getContainerConfig(containerId);
	if (cfg && cfg.lastFocusedKey) {
		const all = getDeepSpottableDescendants(containerId);
		const lastFocusedElement = cfg.lastFocusedRestore(cfg.lastFocusedKey, all);

		// restore lastFocusedElement and release lastFocusedKey
		cfg.lastFocusedKey = null;
		cfg.lastFocusedElement = lastFocusedElement;
	}
}

function unmountContainer (containerId) {
	const config = getContainerConfig(containerId);

	if (config) {
		config.active = false;
		persistLastFocusedElement(containerId);

		if (typeof config.defaultElement !== 'string') {
			config.defaultElement = null;
		}
	}
}

function isActiveContainer (containerId) {
	const config = getContainerConfig(containerId);
	return config && config.active;
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
function isRestrictedContainer (containerId, restrict = 'self-only') {
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
function containsContainer (outerContainerId, innerContainerId) {
	const outer = getContainerNode(outerContainerId);
	const inner = getContainerNode(innerContainerId);

	return Boolean(outer && inner && outer.contains(inner));
}

/**
 * Determines if `containerId` may become the active container.
 *
 * @param {String} containerId Spotlight container to which focus is leaving
 * @returns	{Boolean} `true` if the active container can change to `containerId`
 * @private
 */
function mayActivateContainer (containerId) {
	const currentContainerId = getLastContainer();

	// If the current container is restricted to 'self-only' and if the next container to be
	// activated is not inside the currently activated container, the next container should not be
	// activated.
	return (
		!isRestrictedContainer(currentContainerId) ||
		containsContainer(currentContainerId, containerId)
	);
}

function getDefaultContainer () {
	return isActiveContainer(_defaultContainerId) ? _defaultContainerId : '';
}

function setDefaultContainer (containerId) {
	if (!containerId) {
		_defaultContainerId = '';
	} else if (!getContainerConfig(containerId)) {
		throw new Error('Container "' + containerId + '" doesn\'t exist!');
	} else {
		_defaultContainerId = containerId;
	}
}

function getLastContainer () {
	return isActiveContainer(_lastContainerId) ? _lastContainerId : '';
}

function setLastContainer (containerId) {
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
function setLastContainerFromTarget (current, target) {
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

function isWithinOverflowContainer (target, containerIds = getContainersForNode(target)) {
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
function notifyLeaveContainer (direction, current, currentContainerIds, next, nextContainerIds) {
	currentContainerIds.forEach(containerId => {
		if (!nextContainerIds.includes(containerId)) {
			const config = getContainerConfig(containerId);

			if (config && config.onLeaveContainer) {
				config.onLeaveContainer({
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
function notifyLeaveContainerFail (direction, current, currentContainerIds) {
	currentContainerIds.forEach(containerId => {
		const config = getContainerConfig(containerId);

		if (config && config.onLeaveContainerFail) {
			config.onLeaveContainerFail({
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
function notifyEnterContainer (direction, previous, previousContainerIds, current, currentContainerIds) {
	currentContainerIds.forEach(containerId => {
		if (!previousContainerIds.includes(containerId)) {
			const config = getContainerConfig(containerId);

			if (config && config.onEnterContainer) {
				config.onEnterContainer({
					type: 'onEnterContainer',
					direction,
					target: current,
					relatedTarget: previous
				});
			}
		}
	});
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
	getContainerPreviousTarget,
	getDefaultContainer,
	getLastContainer,
	getNavigableContainersForNode,
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
