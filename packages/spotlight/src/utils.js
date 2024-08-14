import curry from 'ramda/src/curry';
import warning from 'warning';

import {getContainerNode} from './container';

let elementMatchesSelector = function (selector) {
	const matchedNodes = (this.parentNode || this.document).querySelectorAll(selector);
	return [].slice.call(matchedNodes).indexOf(this) >= 0;
};
if (typeof window === 'object') {
	elementMatchesSelector = window.Element.prototype.matches ||
		elementMatchesSelector;
}

const matchSelector = curry((selector, elem) => {
	if (typeof selector === 'string') {
		return elementMatchesSelector.call(elem, selector);
	} else if (typeof selector === 'object' && selector.length) {
		return selector.indexOf(elem) >= 0;
	} else if (typeof selector === 'object' && selector.nodeType === 1) {
		return elem === selector;
	}
	return false;
});

function parseSelector (selector) {
	let result = [];
	try {
		if (typeof selector === 'string') {
			result = [].slice.call(document.querySelectorAll(selector));
		} else if (typeof selector === 'object' && selector.length) {
			result = [].slice.call(selector);
		} else if (typeof selector === 'object' && selector.nodeType === 1) {
			result = [selector];
		}
	} catch (ex) {
		warning(true, `parseSelector failed for selector: ${selector}`);
	}

	return result;
}

const testIntersection = (type, containerRect, elementRect) => {
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

const intersects = curry((containerRect, elementRect) => {
	return testIntersection('intersects', containerRect, elementRect);
});

const contains = curry((containerRect, elementRect) => {
	return testIntersection('contains', containerRect, elementRect);
});

function getIntersectionRect (container, element) {
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
	const intersectionRect = {
		element,
		left: Math.max(l, L),
		right: Math.min(l + w, L + W),
		top: Math.max(t, T),
		bottom: Math.min(t + h, T + H)
	};
	intersectionRect.width = intersectionRect.right - intersectionRect.left;
	intersectionRect.height = intersectionRect.bottom - intersectionRect.top;
	intersectionRect.center = {
		x: intersectionRect.left + Math.floor(intersectionRect.width / 2),
		y: intersectionRect.top + Math.floor(intersectionRect.height / 2)
	};
	intersectionRect.center.left = intersectionRect.center.right = intersectionRect.center.x;
	intersectionRect.center.top = intersectionRect.center.bottom = intersectionRect.center.y;

	return intersectionRect;
}

function getRect (elem) {
	const cr = elem.getBoundingClientRect();
	const rect = {
		left: cr.left,
		top: cr.top,
		width: cr.width,
		height: cr.height
	};
	rect.element = elem;
	rect.right = rect.left + rect.width;
	rect.bottom = rect.top + rect.height;
	rect.center = {
		x: rect.left + Math.floor(rect.width / 2),
		y: rect.top + Math.floor(rect.height / 2)
	};
	rect.center.left = rect.center.right = rect.center.x;
	rect.center.top = rect.center.bottom = rect.center.y;
	return rect;
}

function getPointRect (position) {
	const {x, y} = position;
	return {
		left: x,
		top: y,
		width: 0,
		height: 0,
		right: x,
		bottom: y,
		center: {
			x,
			y,
			left: x,
			right: x,
			top: y,
			bottom: y
		}
	};
}

function getRects (candidates) {
	if (candidates && candidates.length > 0) {
		return candidates.map(getRect);
	}

	return [];
}


function getViewportRect () {
	const {innerWidth: width, innerHeight: height} = window;
	const x = width / 2;
	const y = height / 2;

	return {
		left: 0,
		top: 0,
		width,
		height,
		right: width,
		bottom: height,
		center: {
			x,
			y,
			left: x,
			right: x,
			top: y,
			bottom: y
		}
	};
}

function getContainerRect (containerId) {
	const containerNode = getContainerNode(containerId);

	if (!containerNode) {
		return null;
	}

	if (containerNode === document) {
		return getViewportRect();
	}

	return getRect(containerNode);
}

// For details see: https://html.spec.whatwg.org/multipage/interaction.html#focusable-area
function isStandardFocusable (element) {
	if (element.tabIndex < 0) {
		// If the tabIndex value is negative, it is not focusable
		return false;
	} else if (isElementHidden(element)) {
		return false;
	} else if (['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'OPTGROUP', 'OPTION', 'FIELDSET'].includes(element.tagName) && element.disabled) {
		// If the element is actually disabled, it is not focusable
		return false;
	} else if (element.tagName === 'A' && element.getAttribute('href') !== null) {
		// Anchor element that has an href attribute is focusable
		return true;
	} else if (element.tagName === 'INPUT' && element.type !== 'hidden') {
		// Input element whose type attribute is not hidden is focusable
		return true;
	} else if (element.tabIndex >= 0 || !element.parentElement) {
		// If the tabIndex value is more than 0, it is focusable
		// If element is document or iframe, it is focusable
		return true;
	} else {
		return false;
	}
}

function isElementHidden (element) {
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
