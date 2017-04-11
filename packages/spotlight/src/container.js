const spottableSelector = '.spottable';

const containerAttribute = 'data-container-id';
const containerSelector = `[${containerAttribute}]`;
const containerDatasetKey = 'containerId';

const querySelector = (node, selector, excludeSelector) => {
	const all = Array.prototype.slice.call(node.querySelectorAll(selector));
	const exclude = node.querySelectorAll(excludeSelector);

	for (let i = 0; i < exclude.length; i++) {
		const index = all.indexOf(exclude.item(i));
		all.splice(index, 1);
	}

	return all;
};

const isContainer = (node) => {
	return node && containerDatasetKey in node.dataset;
};

const getContainerId = (node) => node.dataset.containerId;

const getSubContainerSelector = (node) => {
	if (isContainer(node)) {
		return `${containerSelector}:not([${containerAttribute}="${getContainerId(node)}"])`;
	}

	return containerSelector;
};

const getSpottableDescendants = (node) => {
	const subContainerSelector = getSubContainerSelector(node);
	const spottable = querySelector(node, spottableSelector, `${subContainerSelector} ${spottableSelector}`);
	const containers = querySelector(node, containerSelector, `${subContainerSelector} ${containerSelector}`);

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
