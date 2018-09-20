import last from 'ramda/src/last';

import {
	getAllContainerIds,
	getContainerConfig,
	getContainerFocusTarget,
	getContainerId,
	getContainerPreviousTarget,
	getContainersForNode,
	getDefaultContainer,
	getLastContainer,
	isContainer,
	isNavigable
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

function isRestrictedContainer (containerId) {
	const config = getContainerConfig(containerId);
	return config && (config.enterTo === 'last-focused' || config.enterTo === 'default-element');
}

function getTargetInContainerByDirectionFromElement (direction, element, spatNavContainer, checkedNode) {
	//console.log("getTargetInContainerByDirectionFromElement()");
	//console.log(new Error().stack);
	//console.log(spatNavContainer);

	// Get all candidate elements in spatNavContainer.
	let candidates = spatNavContainer.focusableAreas({mode:'all'});

	//  Exclude element which is checked already.
	candidates.filter((candidate) => !checkedNode.has(candidate));

	// shortcut for previous target from element if it were saved
	const previous = getContainerPreviousTarget(getContainerId(spatNavContainer), direction, element);
	if (previous && candidates.indexOf(previous) !== -1) {
		return previous;
	}

	while (candidates.length > 0) {
		console.log(candidates);
		// Get best candidate
		let bestCandidate = element.spatNavSearch(direction, candidates, spatNavContainer);
		console.log(bestCandidate);

		if (bestCandidate && !isContainer(bestCandidate) && isFocusable(bestCandidate)) {
		//console.log(bestCandidate);
			// bestCandidate is spottable element.
			return bestCandidate;
		} else if (bestCandidate) {
			// If bestCandidate is container or scrollable div, delegate focus.
			let containerId = getContainerId(bestCandidate);

			// if we match a container and has restrict configuration, return its target.
			// otherwise, recurse into it
			let childBestCandidate = (isRestrictedContainer(containerId) && getTargetByContainer(containerId)) ||
							getTargetInContainerByDirectionFromElement(direction, element, bestCandidate, checkedNode);

			if (childBestCandidate) {
				// If there is target element in childContainer, return the element.
				return childBestCandidate;
			} else  {
				// No target element in childContainer. Can't delegate to any node.
				let index = candidates.indexOf(bestCandidate);
				if (index > -1) {
					// Exclude childContainer in candidates.
					candidates.splice(index, 1);
				}
			}
		} else {
			// There is no best candidate element in spatNavContainer
			// Check again with child focusable element in spatNavContainer.
			// Because, spatnav filter candidate which overlapped with current element.
			let newCandidate = [];
			for (let candidate of candidates) {
				checkedNode.add(candidate);
				if (isContainer(candidate)) {
					newCandidate = newCandidate.concat(candidate.focusableAreas({mode:'all'}));
				}
			}
			//console.log(candidates);
			newCandidate.filter((candidate) => !checkedNode.has(candidate));
			candidates = newCandidate;
			//console.log(candidates);
		}
	}
	// There is no target element in spatNavContainer
	//console.log('return null');
	return null;
}

function getTargetByDirectionFromElement (direction, element) {
	const extSelector = element.getAttribute('data-spot-' + direction);
	if (typeof extSelector === 'string') {
		return getTargetBySelector(extSelector);
	}
	let spatNavContainer = element.getSpatnavContainer();
	// spatNavContainer could be a scrollable div not wrapped with SpotlightContainerDecorator

	let checkedNode = new Set();

	while (spatNavContainer) {
		//console.log(spatNavContainer);

		// Get all candidate from container
		let next = getTargetInContainerByDirectionFromElement(direction, element, spatNavContainer, checkedNode);
		if (next) {
			return next;
		}
		const containerId = getContainerId(spatNavContainer);
		if (containerId) {
			// Current is container wrapped with SpotlightContainerDecorator
			const leaveForTarget = getLeaveForTarget(containerId, direction);
			if (leaveForTarget) {
				return leaveForTarget;
			} else if (leaveForTarget === false) {
				// To support a `leaveFor` configuration with navigation disallowed in the current
				// `direction`, we return the current element to prevent further searches for a
				// target in this reduction.
				return null;
			}
		}

		// // Search again from outer container. Exclude searched container
		//console.log(spatNavContainer);
		checkedNode.add(spatNavContainer);
		spatNavContainer = spatNavContainer.getSpatnavContainer();
		//console.log(spatNavContainer);
	}
	return null;
}

function getTargetByDirectionFromPosition (direction, position, containerId) {
	// TODO : Can't support this function using spatial navigation polyfil
	// TODO : check the usability
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
		const target = config.restrict !== 'self-only' && config.leaveFor && config.leaveFor[direction];
		if (target === false) {
			// self-only container
			return false;
		}

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

export {
	getNavigableTarget,
	getTargetByContainer,
	getTargetByDirectionFromElement,
	getTargetByDirectionFromPosition,
	getTargetBySelector
};
