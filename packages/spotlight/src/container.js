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

const isContainer = (node) => {
	return node && containerDatasetKey in node.dataset;
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

export {
	containerAttribute,
	containerSelector,
	containerDatasetKey,
	getSpottableDescendants
};
