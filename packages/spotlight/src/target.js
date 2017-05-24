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
	getNavigableElementsForNode,
	getSpottableDescendants,
	isContainer,
	isNavigable
} from './container';
import navigate from './navigate';
import {
	contains,
	getPointRect,
	getRect,
	getRects,
	parseSelector
} from './utils';

function isFocusable (elem) {
	return getContainersForNode(elem).reduce((focusable, id) => {
		return focusable || isNavigable(elem, id, true);
	}, false);
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
}

function getTargetByDirectionFromElement (direction, element) {
	const extSelector = element.getAttribute('data-spot-' + direction);
	if (typeof extSelector === 'string') {
		return getTargetBySelector(extSelector);
	}

	const currentRect = getRect(element);
	let next = getNavigableElementsForNode(
		element,
		(containerId, container, elements) => {
			const previous = getContainerPreviousTarget(containerId, direction, element);
			if (previous && elements.indexOf(previous) !== -1) {
				return previous;
			} else {
				return navigate(
					currentRect,
					direction,
					getRects(elements),
					getContainerConfig(containerId)
				);
			}
		}
	);

	if (!next) {
		next = getLeaveForTarget(getContainersForNode(element), direction);
	}

	if (next && isContainer(next)) {
		const containerRect = getRect(next);

		if (contains(containerRect, currentRect)) {
			// if the next element is a container AND the current element is *visually*
			// contained within the next element, we need to ignore container `enterTo`
			// preferences and retrieve its spottable descendants and try to navigate to them.
			const nextContainerId = next.dataset.containerId;
			next = navigate(
				currentRect,
				direction,
				getRects(getSpottableDescendants(nextContainerId)),
				getContainerConfig(nextContainerId)
			);
		} else {
			next = getTargetByContainer(next.dataset.containerId);
		}
	}

	return next;
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

function getLeaveForTarget (containerIds, direction) {
	return containerIds
		.reverse()
		.map(getContainerConfig)
		.filter(config => config.leaveFor && typeof config.leaveFor[direction] !== 'undefined')
		.reduce((next, config) => {
			if (next) return next;

			const target = config.leaveFor[direction];
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
		}, null);
}

function getNavigableTarget (target) {
	let parent;
	while (target && (isContainer(target) || !isFocusable(target))) {
		parent = target.parentNode;
		target = parent === document ? null : parent; // calling isNavigable on document is problematic
	}
	return target;
}

function getAllNavigableElements () {
	return getAllContainerIds()
		.map(getSpottableDescendants)
		.reduce(concat, [])
		.filter(n => !isContainer(n));
}

export {
	getNavigableTarget,
	getTargetByContainer,
	getTargetByDirectionFromElement,
	getTargetByDirectionFromPosition,
	getTargetBySelector
};
