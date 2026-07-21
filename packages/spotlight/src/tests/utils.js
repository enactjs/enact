import {containerAttribute} from '../container';

const join = (...args) => args.join('\n');

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
	let tag = 'div';

	Object.keys(props).forEach(key => {
		if (key === 'children') {
			children = props.children;
		} else if (key === 'tag') {
			tag = props[key];
		} else if (key === 'valueOnlyAttribute') {
			attributes += `${props[key]} `;
		} else {
			const value = props[key];
			if (key === 'className') key = 'class';
			attributes += `${key}="${value}" `;
		}
	});

	return `<${tag} ${attributes}>${children}</${tag}>`;
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

const someNodes = (fn, count) => Array.from({length: count}, (_, i) => fn(i)).join('\n');
const someSpottables = (count) => someNodes(spottable, count);
const someContainers = (count) => someNodes(container, count);
const someSpottablesAndContainers = (count) => {
	return someSpottables(count) + '\n' + someContainers(count);
};

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
