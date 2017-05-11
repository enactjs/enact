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

export {
	matchSelector,
	parseSelector
};
