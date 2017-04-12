const spottableClass = 'spottable';

const containerAttribute = 'data-container-id';
const containerSelector = `[${containerAttribute}]`;
const containerDatasetKey = 'containerId';

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
const GlobalConfig = {
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

function generateId () {
	let id;
	/* eslint no-constant-condition: ["error", { "checkLoops": false }] */
	while (true) {
		id = _containerPrefix + String(++_ids);
		if (!_containers.get(id)) {
			break;
		}
	}
	return id;
}

const getContainerConfig = (id) => {
	return Object.assign({}, GlobalConfig, _containers.get(id));
};

const isContainer = (node) => {
	return node && containerDatasetKey in node.dataset;
};

const isContainerEnabled = (node) => {
	return isContainer(node) && node.dataset.containerDisabled !== 'true';
};

const getContainerId = (node) => node.dataset.containerId;

const getContainerSelector = (node) => {
	if (isContainer(node)) {
		return `[${containerAttribute}="${getContainerId(node)}"]`;
	}

	return '';
};

const getSubContainerSelector = (node) => {
	if (isContainer(node)) {
		return `${getContainerSelector(node)} ${containerSelector}`;
	}

	return containerSelector;
};

const getSpottableDescendants = (node) => {
	// if it's falsey or is a disabled container, return an empty set
	if (!node || (isContainer(node) && !isContainerEnabled(node))) return [];

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

	return [
		...spottable,
		...containers
	];
};

const getContainer = (containerId) => {
	return document.querySelector(`[${containerAttribute}="${containerId}"]`);
};

const setContainerConfig = (containerId, config) => {
	let existingConfig;

	if (containerId && config) {
		existingConfig = _containers.get(containerId);
		if (!existingConfig) {
			throw new Error('Container "' + containerId + '" doesn\'t exist!');
		}
	}

	for (let key in config) {
		if (typeof GlobalConfig[key] !== 'undefined') {
			if (containerId) {
				existingConfig[key] = config[key];
			} else if (typeof config[key] !== 'undefined') {
				GlobalConfig[key] = config[key];
			}
		}
	}

	if (containerId) {
		// remove "undefined" items
		_containers.set(containerId, Object.assign({}, existingConfig));
	}
};

export {
	containerAttribute,
	containerSelector,
	containerDatasetKey,
	generateId,
	getContainer,
	getContainerConfig,
	getSpottableDescendants,
	isContainer,
	setContainerConfig
};
