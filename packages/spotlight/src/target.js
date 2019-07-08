import last from 'ramda/src/last';

import {
	getAllContainerIds,
	getContainerConfig,
	getContainerFocusTarget,
	getContainersForNode,
	getDefaultContainer,
	getLastContainer,
	isContainer,
	isNavigable,
	isRestrictedContainer
} from './container';
import {
	parseSelector
} from './utils';

function isFocusable (elem) {
	const containers = getContainersForNode(elem);
	let verifySelector = true;

	for (let i = containers.length - 1; i >= 0; i--) {
		const containerId = containers[i];
		if (!isNavigable(elem, containerId, verifySelector)) {
			return false;
		}

		// only verify selector for the first (immediate ancestor) container
		verifySelector = false;
	}
	return true;
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
		if (isNavigable(next, last(nextContainerIds), true)) {
			return next;
		}
	}

	return null;
}

/**
 * Returns the target identified by the selector configured for the container identified by
 * `containerId` for the given `direction`. If the selector is an empty string, the method returns
 * `false` indicating that navigation isn't allowed out of the container in that direction.
 *
 * @param   {String}        containerId  Identifier for a container
 * @param   {String}        direction    Direction to navigate (up, down, left, right)
 *
 * @returns {Node|Boolean}               Target, if found, or `false` if navigation is disallowed
 * @private
 */
function getLeaveForTarget (containerId, direction) {
	const config = getContainerConfig(containerId);

	if (config) {
		const target = !isRestrictedContainer(containerId) && config.leaveFor && config.leaveFor[direction];
		if (typeof target === 'string') {
			if (target === '') {
				return false;
			}
			return getTargetBySelector(target);
		}

		const nextContainerIds = getContainersForNode(target);
		if (isNavigable(target, last(nextContainerIds))) {
			return target;
		}
	}

	return null;
}

function getNavigableTarget (target) {
	if (target === document) return null;

	let parent;
	while (target && (isContainer(target) || !isFocusable(target))) {
		parent = target.parentNode;
		target = parent === document ? null : parent; // calling isNavigable on document is problematic
	}
	return target;
}

function getDataSpotTarget (element, direction) {
	const extSelector = element.getAttribute('data-spot-' + direction);
	if (typeof extSelector === 'string') {
		return getTargetBySelector(extSelector);
	}
}



export {
	getDataSpotTarget,
	getLeaveForTarget,
	getNavigableTarget,
	getTargetByContainer,
	getTargetBySelector,
	isFocusable
};
