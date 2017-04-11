import R from 'ramda';

import {containerAttribute} from '../container';

const testScenario = (scenario, callback) => () => {
	const rootId = 'test-root';
	const html = `<div id="${rootId}">${scenario}</div>`;
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

const findContainer = (root, containerId) => {
	return root.querySelector(`[${containerAttribute}="${containerId}"]`);
};

export {
	container,
	findContainer,
	node,
	someContainers,
	someNodes,
	someSpottables,
	someSpottablesAndContainers,
	spottable,
	testScenario,
	uniqueContainer
};
