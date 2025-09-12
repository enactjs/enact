import clamp from 'ramda/src/clamp';
import last from 'ramda/src/last';

import {
	getAllContainerIds,
	getContainerConfig,
	getContainerFocusTarget,
	getContainerId,
	getContainerNode,
	getContainerPreviousTarget,
	getContainersForNode,
	getDeepSpottableDescendants,
	getDefaultContainer,
	getLastContainer,
	getNavigableContainersForNode, getSpottableDescendants,
	isContainer,
	isNavigable,
	rootContainerId
} from './container';
import navigate from './navigate';
import {
	contains,
	getContainerRect,
	getIntersectionRect,
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

function getTargetByContainer (containerId, enterTo) {
	return getContainersToSearch(containerId)
		.reduce((next, id) => {
			return next || getContainerFocusTarget(id, enterTo);
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

		if (isContainer(next)) {
			return getTargetByContainer(getContainerId(next));
		}

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

function getTargetInContainerByDirectionFromPosition (direction, containerId, positionRect, elementContainerIds, boundingRect, visibleElements) {
	const spottableDescendants = getDeepSpottableDescendants(containerId);
	const elements = visibleElements ? getVisibleElementsFromContainer(spottableDescendants) : spottableDescendants;
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

		const nextContainerId = getContainersForNode(next).pop();
		// check if we want to navigate to another container
		if (next && containerId !== nextContainerId) {
			// verify is the element from another container is visible
			if (isElementVisibleInContainer(next, nextContainerId)) {
				return next;
			} else {
				// otherwise, recurse into it but only through the elements that are visible
				next = getTargetInContainerByDirectionFromPosition(
					direction,
					containerId,
					positionRect,
					elementContainerIds,
					boundingRect,
					true
				);
			}
		}

		// If we've met every condition and haven't explicitly retried the search via `continue`,
		// break out and return
		break;
	}

	return next;
}


function getTargetInContainerByDirectionFromElement (direction, containerId, element, elementRect, elementContainerIds, boundingRect, visibleElements) {
	const elements = visibleElements ? getSpottableDescendants(containerId) : getDeepSpottableDescendants(containerId);

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

		// If one of the downstream containers is configured for partition, we use that
		// container's bounds as the partition rect for navigation.
		const partitionContainer = elementContainerIds
			.slice(elementContainerIds.indexOf(containerId) + 1)
			.find(id => {
				const cfg = getContainerConfig(id);
				return cfg && cfg.partition;
			});

		let partitionRect = elementRect;
		if (partitionContainer) {
			partitionRect = getContainerRect(partitionContainer);
		}

		// try to navigate from element to one of the candidates in containerId
		next = navigate(
			elementRect,
			direction,
			elementRects,
			getContainerConfig(containerId),
			partitionRect
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

		const nextContainerId = getContainersForNode(next).pop();
		// check if we want to navigate to another container
		if (next && containerId !== nextContainerId) {
			// verify is the element from another container is visible
			if (isElementVisibleInContainer(next, nextContainerId)) {
				return next;
			} else {
				// otherwise, try to navigate to an element that is visible in its container
				next = navigate(
					elementRect,
					direction,
					elementRects.filter(({element}) => {
						const containerId = getContainersForNode(element).pop();
						return isElementVisibleInContainer(element, containerId);
					}),
					getContainerConfig(containerId),
					partitionRect
				);
			}
		}

		// If we've met every condition and haven't explicitly retried the search via `continue`,
		// break out and return
		break;
	}

	return next;
}

function getTargetByDirectionFromElement (direction, element, getIntersectRectOfElem = false) {
	const extSelector = element.getAttribute('data-spot-' + direction);
	if (typeof extSelector === 'string') {
		return getTargetBySelector(extSelector);
	}

	const elementContainerId = getContainersForNode(element).pop();

	const next = getNavigableContainersForNode(element)
		.reduceRight((result, containerId, index, elementContainerIds) => {
			result = result || getTargetInContainerByDirectionFromElement(
				direction,
				containerId,
				element,
				getIntersectRectOfElem ? getIntersectionRect(getContainerNode(elementContainerId), element) : getRect(element),
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

	// If the reduce above returns the original element,
	// check if the element is clipped by an overflow container. If true, find the target by direction with the intersection rect of the element.
	// If the reduce above returns the original element again, it means it hit a `leaveFor` config that
	// prevents navigation so we enforce that here by returning null.
	if (next !== element) {
		return next;
	} else if (elementContainerId !== rootContainerId && getContainerConfig(elementContainerId)?.overflow && !getIntersectRectOfElem) {
		return getTargetByDirectionFromElement(direction, element, true);
	} else {
		return null;
	}
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

const getOffsetDistanceToTargetFromPosition = (distance, direction, {x, y}, {left, right, top, bottom}) => {
	if (direction === 'left' || direction === 'right') {
		if (y > bottom) {
			distance += y - bottom;
		} else if (y < top) {
			distance += top - y;
		}
	} else if (x > right) {
		distance += x - right;
	} else if (x < left) {
		distance += left - x;
	}

	return distance;
};

const getDistanceToTargetFromPosition = (direction, position, elementRect) => {
	const {x, y} = position;
	let distance;

	if (direction === 'left') {
		distance = x - elementRect.right;
	} else if (direction === 'right') {
		distance = elementRect.left - x;
	} else if (direction === 'up') {
		distance = y - elementRect.bottom;
	} else if (direction === 'down') {
		distance = elementRect.top - y;
	}

	return getOffsetDistanceToTargetFromPosition(clamp(0, Math.abs(distance), distance), direction, position, elementRect);
};

const getNearestTargetsInContainerFromPosition = (position, containerId) => {
	return ['up', 'left', 'right', 'down'].reduce((result, direction) => {
		const target = getTargetByDirectionFromPosition(direction, position, containerId);

		if (target) {
			result.push({
				direction,
				target
			});
		}

		return result;
	}, []);
};

const getNearestTargetInContainerFromPosition = (position, containerId) => {
	const targets = getNearestTargetsInContainerFromPosition(position, containerId);

	if (!targets.length) {
		return;
	}

	targets.forEach((item) => {
		const {direction, target} = item;
		item.distance = getDistanceToTargetFromPosition(direction, position, getRect(target));
	});

	targets.sort((a, b) => a.distance - b.distance);
	return targets[0].target;
};

const getNearestTargetFromPosition = (position, containerId) => (
	getNavigableTarget(document.elementFromPoint(position.x, position.y)) ||
	getNearestTargetInContainerFromPosition(position, containerId)
);

const getVisibleElementsFromContainer = (elements) => {
	return elements.filter((element) => {
		const containerId = getContainersForNode(element).pop();
		return isElementVisibleInContainer(element, containerId);
	});
}

const isElementVisibleInContainer = (element, containerId) => {
	const {
		top: containerTop,
		right: containerRight,
		bottom: containerBottom,
		left: containerLeft
	} = getContainerRect(containerId);
	const {
		top: elementTop,
		right: elementRight,
		bottom: elementBottom,
		left: elementLeft
	} = element.getBoundingClientRect();

	const isVerticallyVisible = elementBottom >= containerTop && elementTop <= containerBottom;
	const isHorizontallyVisible = elementRight >= containerLeft && elementLeft <= containerRight;

	return isVerticallyVisible && isHorizontallyVisible;
};

export {
	getNavigableTarget,
	getNearestTargetFromPosition,
	getTargetByContainer,
	getTargetByDirectionFromElement,
	getTargetByDirectionFromPosition,
	getTargetBySelector,
	isFocusable
};
