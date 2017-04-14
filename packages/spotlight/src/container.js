import {matchSelector, parseSelector} from './utils';

const spottableClass = 'spottable';

const containerAttribute = 'data-container-id';
const containerSelector = `[${containerAttribute}]`;
const containerKey = 'containerId';

const rootContainerId = 'spotlightRootDecorator';

const querySelector = (node, includeSelector, excludeSelector) => {
	const include = Array.prototype.slice.call(node.querySelectorAll(includeSelector));
	const exclude = node.querySelectorAll(excludeSelector);

	// console.log(includeSelector, include.length);
	// console.log(excludeSelector, exclude.length);

	for (let i = 0; i < exclude.length; i++) {
		const index = include.indexOf(exclude.item(i));
		if (index >= 0) {
			include.splice(index, 1);
		}
	}

	return include;
};


/*
 * config
 */
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

const _containerPrefix = 'container-';
const _containers = new Map();
let _ids = 0;


const getContainerConfig = (id) => {
	return _containers.get(id);
};

const isContainerNode = (node) => {
	return node && node.dataset && containerKey in node.dataset;
};

const isContainer = (nodeOrId) => {
	if (typeof nodeOrId === 'string') {
		return _containers.has(nodeOrId);
	}

	return isContainerNode(nodeOrId);
};

const isContainerEnabled = (node) => {
	return isContainerNode(node) && node.dataset.containerDisabled !== 'true';
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

const getContainer = (containerId) => {
	if (containerId === rootContainerId) {
		return document;
	}

	return document.querySelector(`[${containerAttribute}="${containerId}"]`);
};

const navigableFilter = (node, containerId) => {
	const config = getContainerConfig(containerId);
	if (typeof config.navigableFilter === 'function') {
		if (config.navigableFilter(node, containerId) === false) {
			return false;
		}
	}

	return true;
};

const getSpottableDescendants = (containerId) => {
	const node = containerId ? getContainer(containerId) : document;

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

	// console.log('spottable', spottable.length);
	// console.log('containers', containers.length);

	const candidates = [
		...spottable,
		...containers
	];

	return candidates.filter(n => navigableFilter(n, containerId));
};

// returns an array of ids for containers that wrap the element, in order of outer-to-inner, with
// the last array item being the immediate container id of the element.
function getContainersForNode (node) {
	const containers = [rootContainerId];

	while (node && (node = node.parentNode) !== document) {
		if (isContainerNode(node)) {
			containers.splice(1, 0, getContainerId(node));
		}
	}

	return containers;

	// original code:
	// const containerIds = [..._containers.keys()];
	// const matches = [];

	// for (let i = 0, containers = containerIds.length; i < containers; ++i) {
	// 	const id = containerIds[i];
	// 	const config = getContainerConfig(id);
	// 	if (!config.selectorDisabled && matchSelector(node, config.selector)) {
	// 		matches.push(id);
	// 	}
	// }
	// return matches;
}

// CONTAINER CONFIG MGMT //

function generateId () {
	let id;
	/* eslint no-constant-condition: ["error", { "checkLoops": false }] */
	while (true) {
		id = _containerPrefix + String(++_ids);
		if (!getContainer(id)) {
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

	config = mergeConfig(_containers.get(containerId) || GlobalConfig, config);
	_containers.set(containerId, config);

	return containerId;
};

const removeContainer = (containerId) => {
	_containers.delete(containerId);
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

const getAllContainerIds = () => _containers.keys();

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
