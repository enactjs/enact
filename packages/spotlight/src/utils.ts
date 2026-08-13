import curry from 'ramda/src/curry';
import warning from 'warning';

import {getContainerNode} from './container';
import type {ExtSelector} from '../types/ExtSelector';
import type {Position} from '../types/Position';
import type {Rect, RectCenter} from '../types/Rect';

type ElementMatchesSelectorThis = Element | Document;

let elementMatchesSelector = function (this: ElementMatchesSelectorThis, selector: string): boolean {
	const root = (this as Element).parentNode || (this as Element & {document: ParentNode}).document;
	const matchedNodes = root.querySelectorAll(selector);
	return ([].slice.call(matchedNodes) as Element[]).indexOf(this as Element) >= 0;
};
if (typeof window === 'object') {
	elementMatchesSelector = window.Element.prototype.matches ||
		elementMatchesSelector;
}

const matchSelector = curry((selector: ExtSelector, elem: Element): boolean => {
	if (typeof selector === 'string') {
		return elementMatchesSelector.call(elem, selector);
	} else if (typeof selector === 'object' && selector !== null && 'length' in selector && selector.length) {
		return Array.prototype.indexOf.call(selector as ArrayLike<Element>, elem) >= 0;
	} else if (typeof selector === 'object' && selector !== null && 'nodeType' in selector && (selector as Element).nodeType === 1) {
		return elem === selector;
	}
	return false;
}) as {
	(selector: ExtSelector, elem: Element): boolean;
	(selector: ExtSelector): (elem: Element) => boolean;
};

function parseSelector (selector: ExtSelector): Element[] {
	let result: Element[] = [];
	try {
		if (typeof selector === 'string') {
			result = [].slice.call(document.querySelectorAll(selector));
		} else if (typeof selector === 'object' && selector !== null && 'length' in selector && selector.length) {
			result = [].slice.call(selector as ArrayLike<Element>);
		} else if (typeof selector === 'object' && selector !== null && 'nodeType' in selector && (selector as Element).nodeType === 1) {
			result = [selector as Element];
		}
	} catch {
		warning(true, `parseSelector failed for selector: ${selector}`);
	}

	return result;
}

type IntersectionType = 'intersects' | 'contains';

const testIntersection = (type: IntersectionType, containerRect: Rect, elementRect: Rect): boolean => {
	const {
		left: L,
		right: R,
		top: T,
		bottom: B
	} = containerRect;

	const {
		left: l,
		right: r,
		top: t,
		bottom: b
	} = elementRect;

	if (type === 'intersects') {
		// Test intersection by eliminating the area of the element that is outside of the container
		return !(b < T || t > B || r < L || l > R);
	} else if (type === 'contains') {
		const epsilon = 1;

		// Test whether all bounds are within the container
		return (
			r > L - epsilon && r < R + epsilon && // right
			l > L - epsilon && l < R + epsilon && // left
			t > T - epsilon && t < B + epsilon && // top
			b > T - epsilon && b < B + epsilon    // bottom
		);
	}

	return true;
};

const intersects = curry((containerRect: Rect, elementRect: Rect): boolean => {
	return testIntersection('intersects', containerRect, elementRect);
}) as {
	(containerRect: Rect, elementRect: Rect): boolean;
	(containerRect: Rect): (elementRect: Rect) => boolean;
};

const contains = curry((containerRect: Rect, elementRect: Rect): boolean => {
	return testIntersection('contains', containerRect, elementRect);
}) as {
	(containerRect: Rect, elementRect: Rect): boolean;
	(containerRect: Rect): (elementRect: Rect) => boolean;
};

function getIntersectionRect (container: Element, element: Element): Rect {
	const {
		left: L,
		top: T,
		width: W,
		height: H
	} = container.getBoundingClientRect();
	const {
		left: l,
		top: t,
		width: w,
		height: h
	} = element.getBoundingClientRect();
	const intersectionRect: Rect = {
		element,
		left: Math.max(l, L),
		right: Math.min(l + w, L + W),
		top: Math.max(t, T),
		bottom: Math.min(t + h, T + H),
		width: 0,
		height: 0,
		center: {
			x: 0,
			y: 0,
			left: 0,
			right: 0,
			top: 0,
			bottom: 0
		}
	};
	intersectionRect.width = intersectionRect.right - intersectionRect.left;
	intersectionRect.height = intersectionRect.bottom - intersectionRect.top;
	intersectionRect.center = {
		x: intersectionRect.left + Math.floor(intersectionRect.width / 2),
		y: intersectionRect.top + Math.floor(intersectionRect.height / 2),
		left: 0,
		right: 0,
		top: 0,
		bottom: 0
	};
	intersectionRect.center.left = intersectionRect.center.right = intersectionRect.center.x;
	intersectionRect.center.top = intersectionRect.center.bottom = intersectionRect.center.y;

	return intersectionRect;
}

function getRect (elem: Element): Rect {
	const cr = elem.getBoundingClientRect();
	const rect: Rect = {
		left: cr.left,
		top: cr.top,
		width: cr.width,
		height: cr.height,
		right: cr.left + cr.width,
		bottom: cr.top + cr.height,
		element: elem,
		center: {
			x: 0,
			y: 0,
			left: 0,
			right: 0,
			top: 0,
			bottom: 0
		}
	};
	rect.center = {
		x: rect.left + Math.floor(rect.width / 2),
		y: rect.top + Math.floor(rect.height / 2),
		left: 0,
		right: 0,
		top: 0,
		bottom: 0
	};
	rect.center.left = rect.center.right = rect.center.x;
	rect.center.top = rect.center.bottom = rect.center.y;
	return rect;
}

function getPointRect (position: Position): Rect {
	const {x, y} = position;
	const center: RectCenter = {
		x,
		y,
		left: x,
		right: x,
		top: y,
		bottom: y
	};
	return {
		left: x,
		top: y,
		width: 0,
		height: 0,
		right: x,
		bottom: y,
		center
	};
}

function getRects (candidates: Element[]): Rect[] {
	if (candidates && candidates.length > 0) {
		return candidates.map(getRect);
	}

	return [];
}


function getViewportRect (): Rect {
	const {innerWidth: width, innerHeight: height} = window;
	const x = width / 2;
	const y = height / 2;
	const center: RectCenter = {
		x,
		y,
		left: x,
		right: x,
		top: y,
		bottom: y
	};

	return {
		left: 0,
		top: 0,
		width,
		height,
		right: width,
		bottom: height,
		center
	};
}

function getContainerRect (containerId: string): Rect | null {
	const containerNode = getContainerNode(containerId);

	if (!containerNode) {
		return null;
	}

	if (containerNode === document) {
		return getViewportRect();
	}

	return getRect(containerNode as Element);
}

// For details see: https://html.spec.whatwg.org/multipage/interaction.html#focusable-area
function isStandardFocusable (element: HTMLElement | Element): boolean {
	const htmlElement = element as HTMLElement & {disabled?: boolean};

	if (htmlElement.tabIndex < 0) {
		// If the tabIndex value is negative, it is not focusable
		return false;
	} else if (isElementHidden(element)) {
		return false;
	} else if (['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'OPTGROUP', 'OPTION', 'FIELDSET'].includes(element.tagName) && htmlElement.disabled) {
		// If the element is actually disabled, it is not focusable
		return false;
	} else if (element.tagName === 'A' && element.getAttribute('href') !== null) {
		// Anchor element that has a href attribute is focusable
		return true;
	} else if (element.tagName === 'INPUT' && (htmlElement as HTMLInputElement).type !== 'hidden') {
		// Input element whose type attribute is not hidden is focusable
		return true;
	} else if (htmlElement.tabIndex >= 0 || !element.parentElement) {
		// If the tabIndex value is more than 0, it is focusable
		// If element is document or iframe, it is focusable
		return true;
	} else {
		return false;
	}
}

function isElementHidden (element: Element): boolean {
	const elemRect = element.getBoundingClientRect();
	if ((elemRect.width <= 1 && elemRect.height <= 1) || elemRect.x < -3840 || elemRect.y < -2160 || element.getAttribute('hidden')) {
		return true;
	} else {
		return false;
	}
}

export {
	contains,
	getContainerRect,
	getIntersectionRect,
	getPointRect,
	getRect,
	getRects,
	intersects,
	isStandardFocusable,
	matchSelector,
	parseSelector
};
