import R from 'ramda';

import {containerAttribute} from '../container';

const join = R.unapply(R.join('\n')) as (...parts: string[]) => string;

type NodeProps = Record<string, string | number | boolean | undefined> & {
	children?: string;
	tag?: string;
	valueOnlyAttribute?: string;
	className?: string;
};

type NodeFactory = (props?: string | NodeProps | number) => string;

const testScenario = (scenario: string, callback: (root: HTMLElement) => void) => (): void => {
	const rootId = 'test-root';
	const html = join(
		`<div id="${rootId}">`,
		scenario,
		'</div>'
	);

	document.body.innerHTML = html;

	const root = document.getElementById(rootId);
	if (!root) {
		throw new Error(`Test root #${rootId} not found`);
	}

	try {
		callback(root);
	} catch (e) {
		console.log(html);	// eslint-disable-line no-console
		throw e;
	}
};

let _id = 1;
const generateContainerId = (): string => `${containerAttribute}=${_id++}`;

const coerceProps = (v?: string | NodeProps | number): NodeProps | undefined => {
	if (typeof v === 'object') {
		return v;
	} else if (typeof v !== 'undefined') {
		return {children: String(v)};
	}
};

const node = (props: NodeProps): string => {
	let children = '';
	let attributes = '';
	let tag = 'div';

	Object.keys(props).forEach(key => {
		if (key === 'children') {
			children = props.children as string;
		} else if (key === 'tag') {
			tag = props[key] as string;
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

const spottable = (props?: string | NodeProps | number): string => node({
	className: 'spottable',
	...coerceProps(props)
});

const container = (props?: string | NodeProps | number): string => node({
	[containerAttribute]: _id++,
	'data-spotlight-container': true,
	...coerceProps(props)
});

const someNodes = (fn: NodeFactory, count: number): string =>
	Array.from({length: count}, (_, index) => fn(index)).join('\n');

const someSpottables = (count: number): string => someNodes(spottable, count);
const someContainers = (count: number): string => someNodes(container, count);
const someSpottablesAndContainers = (count: number): string =>
	someNodes(spottable, count) + someNodes(container, count);

type RectLike = Pick<DOMRect, 'top' | 'left' | 'width' | 'height'> & Partial<DOMRect>;
const toDOMRect = (rect: RectLike): DOMRect => rect as DOMRect;

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
	testScenario,
	toDOMRect
};
