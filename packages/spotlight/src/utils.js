import curry from 'ramda/src/curry';
import warning from 'warning';

import {getContainerNode} from './container';

let elementMatchesSelector = function (selector) {
	const matchedNodes = (this.parentNode || this.document).querySelectorAll(selector);
	return [].slice.call(matchedNodes).indexOf(this) >= 0;
};
if (typeof window === 'object') {
	elementMatchesSelector = window.Element.prototype.matches ||
		window.Element.prototype.matchesSelector ||
		window.Element.prototype.mozMatchesSelector ||
		window.Element.prototype.webkitMatchesSelector ||
		window.Element.prototype.msMatchesSelector ||
		window.Element.prototype.oMatchesSelector ||
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

	const right = r >= L && r <= R;
	const left = l >= L && l <= R;
	const top = t >= T && t <= B;
	const bottom = b >= T && b <= B;

	if (type === 'intersects') {
		const aroundV = t < T && b > B;
		const aroundH = l < L && r > R;

		return (top || bottom || aroundV) && (left || right || aroundH);
	} else if (type === 'contains') {
		return top && bottom && left && right;
	}

	return true;
};

const intersects = curry((containerRect, elementRect) => {
	return testIntersection('intersects', containerRect, elementRect);
});

const contains = curry((containerRect, elementRect) => {
	return testIntersection('contains', containerRect, elementRect);
});

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

export {
	contains,
	getContainerRect,
	getRect,
	intersects,
	matchSelector,
	parseSelector
};
