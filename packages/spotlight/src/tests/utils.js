import R from 'ramda';

import {containerAttribute, containerSelector, getSpottableDescendants} from '../container';

const test = (src, callback) => () => {
	const rootId = 'test-root';
	const html = `<div id="${rootId}">${src}</div>`;
	document.body.innerHTML = html;
	
	const root = document.getElementById(rootId);
	callback(root);
};

let _id = 1;

const node = (attributes, content = '') => `<div ${attributes}>${content}</div>`;
const spottable = (content) => node('class="spottable"', content);
const container = (content) => node(`${containerAttribute}=${_id++}`, content);
const uniqueContainer = (id, content) => node(`${containerAttribute}=${id}`, content);

const someNodes = R.useWith(R.compose(R.join(''), R.map), [R.identity, R.range(0)]);
const someSpottables = someNodes(spottable);
const someContainers = someNodes(container);
const someSpottablesAndContainers = R.converge(R.concat, [someSpottables, someContainers]);

const findContainer = (node, containerId) => {
	return node.querySelector(`[${containerAttribute}="${containerId}"]`);
}

export {
	container,
	findContainer,
	node,
	someContainers,
	someNodes,
	someSpottables,
	someSpottablesAndContainers,
	spottable,
	test,
	uniqueContainer
};
