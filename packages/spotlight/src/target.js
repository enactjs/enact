import concat from 'ramda/src/concat';
import last from 'ramda/src/last';

import {
	getAllContainerIds,
	getContainerConfig,
	getContainerFocusTarget,
	getContainerPreviousTarget,
	getContainersForNode,
	getDefaultContainer,
	getLastContainer,
	getSpottableDescendants,
	isContainer,
	isNavigable
} from './container';
import navigate from './navigate';
import {
	contains,
	getContainerRect,
	getPointRect,
	getRect,
	getRects,
	intersects,
	parseSelector
} from './utils';

function isFocusable (elem) {
	return getContainersForNode(elem).reduce((focusable, id) => {
		return focusable || isNavigable(elem, id, true);
	}, false);
}

function getAllNavigableElements () {
	return getAllContainerIds()
		.map(getSpottableDescendants)
		.reduce(concat, [])
		.filter(n => !isContainer(n));
}

function getContainersToSearch (containerId) {
	let range = [];
	let addRange = function (id) {
		const config = getContainerConfig(id);
		if (id && range.indexOf(id) < 0 &&
				config && !config.selectorDisabled) {
			range.push(id);
		}
	};

	if (containerId) {
		addRange(containerId);
	} else {
		addRange(getDefaultContainer());
		addRange(getLastContainer());
		[...getAllContainerIds()].map(addRange);
	}

	return range;
}

function getTargetByContainer (containerId) {
	return getContainersToSearch(containerId)
		.reduce((next, id) => {
			return next || getContainerFocusTarget(id);
		}, null);
}

function getTargetBySelector (selector) {
	if (!selector) return null;

	if (selector.charAt(0) === '@') {
		const containerId = selector.length === 1 ? null : selector.substr(1);

		return getTargetByContainer(containerId);
	}

	const next = parseSelector(selector)[0];
	if (next) {
		const nextContainerIds = getContainersForNode(next);
		if (isNavigable(next, last(nextContainerIds))) {
			return next;
		}
	}

	return null;
}

function isRestrictedContainer (containerId) {
	const config = getContainerConfig(containerId);
	return config.enterTo === 'last-focused' || config.enterTo === 'defaultElement';
}

function getTargetInContainerByDirectionFromElement (direction, containerId, element, elementRect, elementContainerIds, boundingRect) {
	const elements = getSpottableDescendants(containerId).filter(n => {
		return !isContainer(n) || elementContainerIds.indexOf(n.dataset.containerId) === -1;
	});

	// shortcut for previous target from element if it were saved
	const previous = getContainerPreviousTarget(containerId, direction, element);
	if (previous && elements.indexOf(previous) !== -1) {
		return previous;
	}

	let elementRects = getRects(elements);
	if (boundingRect) {
		// remove elements that are outside of boundingRect, if specified
		elementRects = elementRects.filter(rect => {
			if (isContainer(rect.element)) {
				// For containers, test intersection since they may be larger than the bounding rect
				return intersects(boundingRect, rect);
			} else {
				// For elements, use contains so that partially visible elements are not focused
				return contains(boundingRect, rect);
			}
		});
	}

	// find candidates that are containers and *visually* contain element
	const overlapping = elementRects.filter(rect => {
		return isContainer(rect.element) && contains(rect, elementRect);
	});

	// if the next element is a container AND the current element is *visually* contained within
	// one of the candidate element, we need to ignore container `enterTo` preferences and
	// retrieve its spottable descendants and try to navigate to them.
	if (overlapping.length) {
		return getTargetInContainerByDirectionFromElement(
			direction,
			overlapping[0].element.dataset.containerId,
			element,
			elementRect,
			elementContainerIds,
			boundingRect
		);
	}

	// try to navigate from element to one of the candidates in containerId
	const next = navigate(
		elementRect,
		direction,
		elementRects,
		getContainerConfig(containerId)
	);

	// if we match a container,
	if (next && isContainer(next)) {
		const nextContainerId = next.dataset.containerId;

		// and it is restricted, return its target
		if (isRestrictedContainer(nextContainerId)) {
			return getTargetByContainer(nextContainerId);
		}

		// if the target container has overflowing content, update the boundingRect to match its
		// bounds to prevent finding elements within the container's hierarchy but not visible.
		// This filter only applies when waterfalling to prevent filtering out elements that share
		// a container tree with `element`
		const nextConfig = getContainerConfig(nextContainerId);
		if (nextConfig.overflow) {
			boundingRect = getContainerRect(nextContainerId);
		}

		// otherwise, recurse into it
		return getTargetInContainerByDirectionFromElement(
			direction,
			nextContainerId,
			element,
			elementRect,
			elementContainerIds,
			boundingRect
		);
	}

	return next;
}

function getTargetByDirectionFromElement (direction, element) {
	const extSelector = element.getAttribute('data-spot-' + direction);
	if (typeof extSelector === 'string') {
		return getTargetBySelector(extSelector);
	}

	const elementRect = getRect(element);

	return getContainersForNode(element)
		.reduceRight((result, containerId, index, elementContainerIds) => {
			return result ||
				getTargetInContainerByDirectionFromElement(
					direction,
					containerId,
					element,
					elementRect,
					elementContainerIds
				) ||
				getLeaveForTarget(containerId, direction);
		}, null);
}

function getTargetByDirectionFromPosition (direction, position, containerId) {
	const config = getContainerConfig(containerId);
	let candidates;

	if (config.restrict === 'self-only' || config.restrict === 'self-first') {
		candidates = getSpottableDescendants(containerId);
	} else {
		candidates = getAllNavigableElements();
	}

	return navigate(
		getPointRect(position),
		direction,
		getRects(candidates),
		config
	);
}

function getLeaveForTarget (containerId, direction) {
	const config = getContainerConfig(containerId);

	const target = config.leaveFor && config.leaveFor[direction];
	if (typeof target === 'string') {
		if (target === '') {
			return null;
		}
		return getTargetBySelector(target);
	}

	const nextContainerIds = getContainersForNode(target);
	if (isNavigable(target, last(nextContainerIds))) {
		return target;
	}

	return null;
}

function getNavigableTarget (target) {
	let parent;
	while (target && (isContainer(target) || !isFocusable(target))) {
		parent = target.parentNode;
		target = parent === document ? null : parent; // calling isNavigable on document is problematic
	}
	return target;
}

export {
	getNavigableTarget,
	getTargetByContainer,
	getTargetByDirectionFromElement,
	getTargetByDirectionFromPosition,
	getTargetBySelector
};
