import {matchSelector, parseSelector} from './utils';

const spottableClass = 'spottable';

const containerAttribute = 'data-container-id';
const containerConfigs   = new Map();
const containerKey       = 'containerId';
const containerPrefix    = 'container-';
const containerSelector  = `[${containerAttribute}]`;
const rootContainerId    = 'spotlightRootDecorator';

let _ids = 0;

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
	navigableFilter: null
};

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
 * @param  {Node}     node   Node to check
 *
 * @return {Boolean}        `true` if `node` is a spotlight container
 */
const isContainerNode = (node) => {
	return node && node.dataset && containerKey in node.dataset;
};

/**
 * Walks up the node hierarchy calling `fn` on each node that is a container
 *
 * @param  {Node}     node  Node from which to start the search
 * @param  {Function} fn    Called once for each container with the container node as the first
 *                          argument. The return value is accumulated in the array returned by
 *                          `mapContainers`
 *
 * @return {Array}          Array of values returned by `fn` in order of outermost container to
 *                          innermost container
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
 * @param  {String}  id  Container ID
 *
 * @return {Object}      Container config
 */
const getContainerConfig = (id) => {
	return containerConfigs.get(id);
};

/**
 * Determines if node or a container id represents a spotlight container
 *
 * @param  {Node|String}  nodeOrId  Node or container ID
 *
 * @return {Boolean}                `true` if `nodeOrId` represents a spotlight container
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
 * @param  {Node}     node  Spottable node or spotlight container
 *
 * @return {Boolean}        `true` if all container ancestors are enabled
 */
const isContainerEnabled = (node) => {
	return mapContainers(node, container => {
		return container.dataset.containerDisabled !== 'true';
	}).reduce((acc, v) => acc && v, true);
};

const getContainerId = (node) => node.dataset[containerKey];

const getContainerSelector = (node) => {
	if (isContainerNode(node)) {
		return `[${containerAttribute}="${getContainerId(node)}"]`;
	}

	return '';
};

const getSubContainerSelector = (node) => {
	if (isContainerNode(node)) {
		return `${getContainerSelector(node)} ${containerSelector}`;
	}

	return containerSelector;
};

const getContainerNode = (containerId) => {
	if (!containerId) {
		return null;
	} else if (containerId === rootContainerId) {
		return document;
	}

	return document.querySelector(`[${containerAttribute}="${containerId}"]`);
};

const navigableFilter = (node, containerId) => {
	const config = getContainerConfig(containerId);
	if (config && typeof config.navigableFilter === 'function') {
		if (config.navigableFilter(node, containerId) === false) {
			return false;
		}
	}

	return true;
};

const getSpottableDescendants = (containerId) => {
	const node = getContainerNode(containerId);

	// if it's falsey or is a disabled container, return an empty set
	if (!node || (isContainerNode(node) && !isContainerEnabled(node))) {
		return [];
	}

	const spottableSelector = `.${spottableClass}`;
	const subContainerSelector = getSubContainerSelector(node);
	const spottable = querySelector(
		node,
		spottableSelector,
		`${subContainerSelector} ${spottableSelector}`
	);
	const containers = querySelector(
		node,
		`${getContainerSelector(node)} ${containerSelector}:not([data-container-disabled="true"])`,
		`${subContainerSelector} ${containerSelector}`
	);

	const candidates = [
		...spottable,
		...containers
	];

	return candidates.filter(n => navigableFilter(n, containerId));
};

/**
 * Returns an array of ids for containers that wrap the element, in order of outer-to-inner, with
 * the last array item being the immediate container id of the element.
 *
 * @param  {Node}      node  Node from which to start the search
 *
 * @return {String[]}        Array on container IDs
 */
function getContainersForNode (node) {
	const containers = mapContainers(node, getContainerId);
	containers.unshift(rootContainerId);

	return containers;
}

// CONTAINER CONFIG MGMT //

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

const removeContainer = (containerId) => {
	containerConfigs.delete(containerId);
};

const configureDefaults = (config) => {
	GlobalConfig = mergeConfig(GlobalConfig, config);
};

const isNavigable = (node, containerId, verify) => {
	if (!node) {
		return false;
	}

	const config = getContainerConfig(containerId);
	if (verify && !matchSelector(node, config.selector)) {
		return false;
	}

	return navigableFilter(node, containerId);
};

const getAllContainerIds = () => containerConfigs.keys();

function getContainerDefaultElement (containerId) {
	let defaultElement = getContainerConfig(containerId).defaultElement;
	if (!defaultElement) {
		return null;
	}
	if (typeof defaultElement === 'string') {
		defaultElement = parseSelector(defaultElement)[0];
	}
	if (isNavigable(defaultElement, containerId, true)) {
		return defaultElement;
	}
	return null;
}

function getContainerLastFocusedElement (containerId) {
	const {lastFocusedElement, lastFocusedIndex} = getContainerConfig(containerId);

	let element = lastFocusedElement;
	if (!element && lastFocusedIndex >= 0) {
		const spottableChildren = getSpottableDescendants(containerId);
		element = spottableChildren[lastFocusedIndex];
	}

	return isNavigable(element, containerId, true) ? element : null;
}

function setContainerLastFocusedElement (elem, containerIds) {
	for (let i = 0, containers = containerIds.length; i < containers; ++i) {
		getContainerConfig(containerIds[i]).lastFocusedElement = elem;
	}
}

export {
	// Remove
	getAllContainerIds,

	// Maybe
	getContainersForNode,
	getContainerConfig,
	getContainerDefaultElement,
	getContainerLastFocusedElement,
	setContainerLastFocusedElement,

	// Keep
	containerAttribute,
	configureDefaults,
	configureContainer,
	getSpottableDescendants,
	isContainer,
	isNavigable,
	removeContainer,
	rootContainerId
};
