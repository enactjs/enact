import curry from 'ramda/src/curry';

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
	let result;
	if (typeof selector === 'string') {
		result = [].slice.call(document.querySelectorAll(selector));
	} else if (typeof selector === 'object' && selector.length) {
		result = [].slice.call(selector);
	} else if (typeof selector === 'object' && selector.nodeType === 1) {
		result = [selector];
	} else {
		result = [];
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

	const right = r > L && r <= R;
	const left = l >= L && l < R;
	const top = t >= T && t < B;
	const bottom = b > T && b <= B;

	if (type === 'intersects') {
		return (top || bottom) && (left || right);
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

export {
	contains,
	intersects,
	matchSelector,
	parseSelector
};
