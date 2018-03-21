import R from 'ramda';

import {containerAttribute} from '../container';

const join = R.unapply(R.join('\n'));

const testScenario = (scenario, callback) => () => {
	const rootId = 'test-root';
	const html = join(
		`<div id="${rootId}">`,
		scenario,
		'</div>'
	);

	document.body.innerHTML = html;

	const root = document.getElementById(rootId);
	try {
		callback(root);
	} catch (e) {
		console.log(html);	// eslint-disable-line no-console
		throw e;
	}
};

let _id = 1;
const generateContainerId = () => `${containerAttribute}=${_id++}`;

const coerceProps = (v) => {
	if (typeof v === 'object') {
		return v;
	} else if (typeof v !== 'undefined') {
		return {children: v};
	}
};

const node = (props) => {
	let children = '';
	let attributes = '';

	Object.keys(props).forEach(key => {
		if (key === 'children') {
			children = props.children;
		} else {
			const value = props[key];
			if (key === 'className') key = 'class';
			attributes += `${key}="${value}" `;
		}
	});

	return `<div ${attributes}>${children}</div>`;
};

const spottable = (props) => node({
	className: 'spottable',
	...coerceProps(props)
});

const container = (props) => node({
	[containerAttribute]: _id++,
	'data-spotlight-container': true,
	...coerceProps(props)
});

const someNodes = R.useWith(R.compose(R.join('\n'), R.map), [R.identity, R.range(0)]);
const someSpottables = someNodes(spottable);
const someContainers = someNodes(container);
const someSpottablesAndContainers = R.converge(R.concat, [someSpottables, someContainers]);

export {
	container,
	generateContainerId,
	join,
	node,
	someContainers,
	someNodes,
	someSpottables,
	someSpottablesAndContainers,
	spottable,
	testScenario
};
