/**
 * Exports methods and members for creating and maintaining spotlight containers.
 *
 * @module spotlight/container
 * @private
 */

import and from 'ramda/src/and';
import concat from 'ramda/src/concat';
import {coerceArray} from '@enact/core/util';

import {matchSelector} from './utils';

const containerAttribute = 'data-container-id';
const containerConfigs   = new Map();
const containerKey       = 'containerId';
const containerPrefix    = 'container-';
const containerSelector  = `[${containerAttribute}]`;
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
	selector: '',           // can be a valid <extSelector> except "@" syntax.
	straightOnly: false,
	straightOverlapThreshold: 0.5,
	rememberSource: false,
	selectorDisabled: false,
	defaultElement: '',     // <extSelector> except "@" syntax.
	enterTo: '',            // '', 'last-focused', 'default-element'
	leaveFor: null,         // {left: <extSelector>, right: <extSelector>, up: <extSelector>, down: <extSelector>}
	restrict: 'self-first', // 'self-first', 'self-only', 'none'
	tabIndexIgnoreList: 'a, input, select, textarea, button, iframe, [contentEditable=true]',
	navigableFilter: null,
	overflow: false,
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
	lastFocusedRestore: ({key}, all) => {
		return all[key];
	}
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
	return node && node.dataset && containerKey in node.dataset;
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
		return container.dataset.containerDisabled !== 'true';
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
 * Generates a CSS selector string for a currrent container if `node` is a container
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

	// if it's falsey or is a disabled container, return an empty set
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
		`${spottableSelector}, ${getContainerSelector(node)} ${containerSelector}:not([data-container-disabled="true"])`,
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
				} else if (!config.enterTo) {
					return getDeepSpottableDescendants(id, excludedContainers);
				}
			}

			return [n];
		})
		.reduce(concat, []);
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
	const cfg = Object.assign({}, current);

	if (updated) {
		Object.keys(updated).forEach(key => {
			if (key in GlobalConfig) {
				cfg[key] = updated[key];
			}
		});
	}

	return cfg;
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

	config = mergeConfig(containerConfigs.get(containerId) || GlobalConfig, config);
	containerConfigs.set(containerId, config);

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

	const config = getContainerConfig(containerId);
	if (verify && config.selector && !isContainer(node) && !matchSelector(config.selector, node)) {
		return false;
	}

	return navigableFilter(node, containerId);
};

/**
 * Returns the IDs of all containers
 *
 * @return {String[]}  Array of container IDs
 * @memberof spotlight/container
 * @private
 */
const getAllContainerIds = () => {
	const ids = [];
	const keys = containerConfigs.keys();

	// PhantomJS-friendly iterator->array conversion
	let id;
	while ((id = keys.next()) && !id.done) {
		ids.push(id.value);
	}

	return ids;
};

/**
 * Returns the default focus element for a container
 *
 * @param   {String}  containerId  ID of container
 *
 * @returns {Node}                 Default focus element
 * @memberof spotlight/container
 * @public
 */
function getContainerDefaultElement (containerId) {
	let defaultElement = getContainerConfig(containerId).defaultElement;
	if (!defaultElement) {
		return null;
	}
	if (typeof defaultElement === 'string') {
		defaultElement = getSpottableDescendants(containerId)
			.filter(matchSelector(defaultElement))[0];
	}
	if (isNavigable(defaultElement, containerId, true)) {
		return defaultElement;
	}
	return null;
}

/**
 * Gets the element last focused within the container.
 *
 * @param   {String}  containerId  ID of container
 *
 * @returns {Node}                 DOM Node last focused
 * @memberof spotlight/container
 * @public
 */
function getContainerLastFocusedElement (containerId) {
	const {lastFocusedElement} = getContainerConfig(containerId);

	return isNavigable(lastFocusedElement, containerId, true) ? lastFocusedElement : null;
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

function getNavigableElementsForNode (node, navigate) {
	let selfOnly = false;
	// accumulates navigable elements while the reduce works up the tree
	let elements = [];

	return getContainersForNode(node)
		.reverse()
		.reduce((next, id, index, containerIds) => {
			if (next || selfOnly) return next;

			const {restrict} = getContainerConfig(id);
			selfOnly = restrict === 'self-only';

			elements = elements.concat(getDeepSpottableDescendants(id, containerIds));
			if (restrict === 'self-first' || selfOnly || id === rootContainerId) {
				next = navigate(
					id,
					getContainerNode(id),
					elements
				);
			}

			return next;
		}, null);
}

/**
 * [getContainerNavigableElements description]
 *
 * @param   {String} containerId Container ID
 *
 * @returns {Node[]}             Navigable elements within container
 * @public
 * @memberof spotlight/container
 * @public
 */
function getContainerNavigableElements (containerId) {
	if (!isContainer(containerId)) {
		return false;
	}

	const config = getContainerConfig(containerId);
	const enterLast = config.enterTo === 'last-focused';
	const enterDefault = config.enterTo === 'defaultElement';
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

	const next = getContainerNavigableElements(containerId)[0] || null;
	if (isContainer(next)) {
		const nextId = isContainerNode(next) ? getContainerId(next) : next;
		return getContainerFocusTarget(nextId);
	}

	return next;
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
		persistLastFocusedElement(containerId);

		if (typeof config.defaultElement !== 'string') {
			config.defaultElement = null;
		}
	}
}

function getDefaultContainer () {
	return _defaultContainerId;
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
	return _lastContainerId;
}

function setLastContainer (containerId) {
	_lastContainerId = containerId || '';
}

export {
	// Remove
	getAllContainerIds,
	getContainerNode,

	// Maybe
	getContainersForNode,
	getContainerConfig,
	getContainerDefaultElement,
	getContainerLastFocusedElement,
	getContainerNavigableElements,
	setContainerLastFocusedElement,

	// Keep
	containerAttribute,
	configureDefaults,
	configureContainer,
	getContainerFocusTarget,
	getContainerPreviousTarget,
	getDefaultContainer,
	getLastContainer,
	getNavigableElementsForNode,
	getSpottableDescendants,
	isContainer,
	isNavigable,
	removeAllContainers,
	removeContainer,
	rootContainerId,
	setContainerPreviousTarget,
	setDefaultContainer,
	setLastContainer,
	unmountContainer
};
