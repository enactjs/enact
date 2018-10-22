import last from 'ramda/src/last';

import {
	getAllContainerIds,
	getContainerConfig,
	getContainerFocusTarget,
	getContainerNode,
	getContainerPreviousTarget,
	getContainersForNode,
	getDefaultContainer,
	getLastContainer,
	getNavigableContainersForNode,
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

function getSpottableDescendantsWithoutContainers (containerId, containerIds) {
	return getSpottableDescendants(containerId).filter(n => {
		return !isContainer(n) || containerIds.indexOf(n.dataset.spotlightId) === -1;
	});
}

function filterRects (elementRects, boundingRect) {
	if (!boundingRect) {
		return elementRects;
	}

	// remove elements that are outside of boundingRect, if specified
	return elementRects.filter(rect => {
		if (isContainer(rect.element)) {
			// For containers, test intersection since they may be larger than the bounding rect
			return intersects(boundingRect, rect);
		} else {
			// For elements, use contains with the center to include mostly visible elements
			return contains(boundingRect, rect.center);
		}
	}).map(rect => {
		let topUpdate = rect.top < boundingRect.top;
		let bottomUpdate = rect.bottom > boundingRect.bottom;
		let leftUpdate = rect.left < boundingRect.left;
		let rightUpdate = rect.right > boundingRect.right;

		// if the element's rect is larger than the bounding rect, clamp it to the bounding rect and
		// recalculate the center based on the new bounds.
		if (topUpdate || bottomUpdate || leftUpdate || rightUpdate) {
			const updated = {...rect, center: {...rect.center}};

			if (topUpdate) updated.top = boundingRect.top;
			if (bottomUpdate) updated.bottom = boundingRect.bottom;
			if (leftUpdate) updated.left = boundingRect.left;
			if (rightUpdate) updated.right = boundingRect.right;

			if (leftUpdate || rightUpdate) {
				const centerX = updated.left + (updated.right - updated.left) / 2;
				updated.center.x = updated.center.left = updated.center.right = centerX;
			}

			if (topUpdate || bottomUpdate) {
				const centerY = updated.top + (updated.bottom - updated.top) / 2;
				updated.center.y = updated.center.top = updated.center.bottom = centerY;
			}

			return updated;
		}

		return rect;
	});
}

function getContainerContainingRect (elementRects, elementRect) {
	// find candidates that are containers and *visually* contain element
	const overlapping = elementRects.filter(rect => {
		return isContainer(rect.element) && contains(rect, elementRect);
	});

	// if the next element is a container AND the current element is *visually* contained within
	// one of the candidate element, we need to ignore container `enterTo` preferences and
	// retrieve its spottable descendants and try to navigate to them.
	if (overlapping.length) {
		return overlapping[0].element.dataset.spotlightId;
	}

	return false;
}

function getOverflowContainerRect (containerId) {
	// if the target container has overflowing content, update the boundingRect to match its
	// bounds to prevent finding elements within the container's hierarchy but not visible.
	// This filter only applies when waterfalling to prevent filtering out elements that share
	// a container tree with `element`
	const nextConfig = getContainerConfig(containerId);
	if (nextConfig && nextConfig.overflow) {
		return getContainerRect(containerId);
	}
}

function getTargetInContainerByDirectionFromPosition (direction, containerId, positionRect, elementContainerIds, boundingRect) {
	const elements = getSpottableDescendantsWithoutContainers(containerId, elementContainerIds);
	let elementRects = filterRects(getRects(elements), boundingRect);

	let next = null;

	while (elementRects.length > 0) {
		const overlappingContainerId = getContainerContainingRect(elementRects, positionRect);

		// if the pointer is within a container that is a candidate element, we need to ignore container
		// `enterTo` preferences and retrieve its spottable descendants and try to navigate to them.
		if (overlappingContainerId) {
			next = getTargetInContainerByDirectionFromPosition(
				direction,
				overlappingContainerId,
				positionRect,
				elementContainerIds,
				boundingRect
			);

			if (!next) {
				// filter out the container and try again
				elementRects = elementRects.filter(rect => {
					return rect.element.dataset.spotlightId !== overlappingContainerId;
				});
				continue;
			}

			// found a target so break out and return
			break;
		}

		// try to navigate from position to one of the candidates in containerId
		next = navigate(
			positionRect,
			direction,
			elementRects,
			getContainerConfig(containerId)
		);

		// if we match a container, recurse into it
		if (next && isContainer(next)) {
			const nextContainerId = next.dataset.spotlightId;

			// need to cache this reference so we can filter it out later if necessary
			const lastNavigated = next;

			next = getTargetInContainerByDirectionFromPosition(
				direction,
				nextContainerId,
				positionRect,
				elementContainerIds,
				getOverflowContainerRect(nextContainerId) || boundingRect
			);

			if (!next) {
				// filter out the container and try again
				elementRects = elementRects.filter(rect => rect.element !== lastNavigated);
				continue;
			}
		}

		// If we've met every condition and haven't explicitly retried the search via `continue`,
		// break out and return
		break;
	}

	return next;
}


function getTargetInContainerByDirectionFromElement (direction, containerId, element, elementRect, elementContainerIds, boundingRect) {
	const elements = getSpottableDescendantsWithoutContainers(containerId, elementContainerIds);

	// shortcut for previous target from element if it were saved
	const previous = getContainerPreviousTarget(containerId, direction, element);
	if (previous && elements.indexOf(previous) !== -1) {
		return previous;
	}

	// `spotlightOverflow` is a private, and likely temporary, API to allow a component within an
	// spotlight container with `overflow: true` to be treated as if it were outside of the
	// container. The result is that the candidates, `elements` are filtered by the bounds of the
	// overflow container effectively hiding those that have overflowed and are visually hidden.
	//
	// Currently only used by moonstone/Scroller.Scrollbar as a means to allow 5-way navigation to
	// escape the Scrollable from paging controls rather than focusing contents that are out of view
	if (element.dataset.spotlightOverflow === 'ignore') {
		boundingRect = getOverflowContainerRect(containerId) || boundingRect;
	}

	let elementRects = filterRects(getRects(elements), boundingRect);

	let next = null;

	while (elementRects.length > 0) {
		const overlappingContainerId = getContainerContainingRect(elementRects, elementRect);

		// if the next element is a container AND the current element is *visually* contained within
		// one of the candidate elements, we need to ignore container `enterTo` preferences and
		// retrieve its spottable descendants and try to navigate to them.
		if (overlappingContainerId) {
			next = getTargetInContainerByDirectionFromElement(
				direction,
				overlappingContainerId,
				element,
				elementRect,
				elementContainerIds,
				boundingRect
			);

			if (!next) {
				// filter out the container and try again
				elementRects = elementRects.filter(rect => {
					return rect.element.dataset.spotlightId !== overlappingContainerId;
				});
				continue;
			}

			// found a target so break out and return
			break;
		}

		// try to navigate from element to one of the candidates in containerId
		next = navigate(
			elementRect,
			direction,
			elementRects,
			getContainerConfig(containerId)
		);

		// if we match a container,
		if (next && isContainer(next)) {
			const nextContainerId = next.dataset.spotlightId;

			// need to cache this reference so we can filter it out later if necessary
			const lastNavigated = next;

			// and it is restricted, return its target
			if (isRestrictedContainer(nextContainerId)) {
				next = getTargetByContainer(nextContainerId);
			} else {
				// otherwise, recurse into it
				next = getTargetInContainerByDirectionFromElement(
					direction,
					nextContainerId,
					element,
					elementRect,
					elementContainerIds,
					getOverflowContainerRect(nextContainerId) || boundingRect
				);
			}

			if (!next) {
				elementRects = elementRects.filter(rect => rect.element !== lastNavigated);
				continue;
			}
		}

		// If we've met every condition and haven't explicitly retried the search via `continue`,
		// break out and return
		break;
	}

	return next;
}

function getTargetByDirectionFromElement (direction, element) {
	const extSelector = element.getAttribute('data-spot-' + direction);
	if (typeof extSelector === 'string') {
		return getTargetBySelector(extSelector);
	}

	const elementRect = getRect(element);

	return getNavigableContainersForNode(element)
		.reduceRight((result, containerId, index, elementContainerIds) => {
			result = result || getTargetInContainerByDirectionFromElement(
				direction,
				containerId,
				element,
				elementRect,
				elementContainerIds
			);

			if (!result) {
				result = getLeaveForTarget(containerId, direction);

				// To support a `leaveFor` configuration with navigation disallowed in the current
				// `direction`, we return the current element to prevent further searches for a
				// target in this reduction.
				if (result === false) {
					result = element;
				}
			}

			return result;
		}, null);
}

function getTargetByDirectionFromPosition (direction, position, containerId) {
	const pointerRect = getPointRect(position);

	return getNavigableContainersForNode(getContainerNode(containerId))
		.reduceRight((result, id, index, elementContainerIds) => {
			return result ||
				getTargetInContainerByDirectionFromPosition(
					direction,
					id,
					pointerRect,
					elementContainerIds
				);
		}, null);
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
	getTargetBySelector,
	isFocusable
};
