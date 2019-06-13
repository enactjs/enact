import {containerAttribute} from '../container';

const join = (...lines) => lines.join('\n');

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

const someNodes = (fn, length) => Array.from({length}, (v, i) => fn(i)).join('\n');
const someSpottables = (length) => someNodes(spottable, length);
const someContainers = (length) => someNodes(container, length);
const someSpottablesAndContainers = (length) => someSpottables(length) + someContainers(length);

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
