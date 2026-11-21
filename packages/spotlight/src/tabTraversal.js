/**
 * Tab key linear focus traversal for Spotlight.
 *
 * @module spotlight/tabTraversal
 * @private
 */

import last from 'ramda/src/last';

import {isPaused} from '../Pause';

import {
	getContainerConfig,
	getContainerId,
	getContainerNode,
	getContainersForNode,
	getLastContainer,
	getOwnedSelfOnlyContainerIds,
	getPopupOwnerElement,
	getSpottableDescendantsForTab,
	isContainer,
	isNavigableForTab,
	rootContainerId
} from './container';

import {getNearestTargetFromPosition, getTargetByContainer} from './target';
import {getContainerRect, getRect} from './utils';

// Vertical centers within this distance share a Tab row; horizontal position breaks ties.
const TAB_ROW_THRESHOLD = 24;

// CSS class applied by @enact/i18n I18nDecorator to the app root for RTL locales.
const I18N_RTL_CLASS = 'enact-locale-right-to-left';

let _linearTargetsCache = null;

export function runWithLinearTargetsCache (fn) {
	_linearTargetsCache = new Map();
	try {
		return fn();
	} finally {
		_linearTargetsCache = null;
	}
}

/*
 * Whether the document uses right-to-left layout for Tab ordering.
 *
 * Intentionally does not import @enact/i18n:
 * - `locale.isRtlLocale` is callback-based and depends on ilib; Tab handling needs a
 *   synchronous answer on every keydown without adding that heavyweight dependency to spotlight.
 * - `util.isRtlText` detects RTL characters in a string, not page layout direction.
 *
 * Instead, read layout direction already reflected on the DOM by the app or I18nDecorator:
 * the `dir` attribute when set, and the `enact-locale-right-to-left` class on the app root.
 */
function isRtlDocument () {
	const root = document.documentElement;
	const body = document.body;
	const dir = (root && root.dir) || (body && body.dir);

	if (typeof dir === 'string' && dir.toLowerCase() === 'rtl') {
		return true;
	}

	if (root?.classList.contains(I18N_RTL_CLASS) || body?.classList.contains(I18N_RTL_CLASS)) {
		return true;
	}

	return Boolean(document.querySelector('.' + I18N_RTL_CLASS));
}

/*
 * Chooses the subtree root for Tab linear traversal. When focus sits inside a portaled
 * `self-only` container (e.g. contextual popup list), descendants of the app root do not
 * include that subtree, so using the root container would mix in unrelated controls. The
 * innermost `self-only` ancestor matches the modal boundary the user is in.
 */
export function getLinearTabSearchContainerId (focused) {
	if (isPaused()) {
		return getLastContainer() || rootContainerId;
	}
	if (!focused) {
		return rootContainerId;
	}
	const ids = getContainersForNode(focused);
	for (let i = ids.length - 1; i > 0; i--) {
		const cfg = getContainerConfig(ids[i]);
		if (cfg && cfg.restrict === 'self-only') {
			return ids[i];
		}
	}

	return rootContainerId;
}

/*
 * Whether point (aX,aY) comes before (bX,bY) in the same top-to-bottom, left-to-right order
 * used by `getLinearTargetsInContainer` (must stay in sync with that sort).
 */
export function comesBeforeInTabOrder (aX, aY, bX, bY, isRtl) {
	if (Math.abs(aY - bY) > TAB_ROW_THRESHOLD) {
		return aY < bY;
	}
	if (aX !== bX) {
		return isRtl ? aX > bX : aX < bX;
	}

	return false;
}

export function resolveTargetToOpenPopupItem (target, currentPopupContainerId, isForward) {
	const ownerNode = target?.closest?.('[aria-owns]');
	if (!ownerNode || ownerNode === document.body) {
		return target;
	}

	for (const popupContainerId of getOwnedSelfOnlyContainerIds(ownerNode, currentPopupContainerId)) {
		const popupTargets = getLinearTargetsInContainer(popupContainerId);
		const popupTargetEntry = isForward ? popupTargets[0] : popupTargets[popupTargets.length - 1];
		const popupTarget = popupTargetEntry?.target || getTargetByContainer(popupContainerId);
		if (popupTarget) {
			return popupTarget;
		}
	}

	return target;
}

export function isTargetInSelfOnlyContainer (target) {
	if (!target) {
		return false;
	}

	// Use DOM ancestry only. `getContainersForNode()` may include containers connected via
	// `aria-owns`, which would incorrectly mark popup owner controls as inside self-only popups.
	const containerNode = target.closest?.('[data-spotlight-container][data-spotlight-id]');
	if (!containerNode) {
		return false;
	}

	const containerId = getContainerId(containerNode);
	if (!containerId || containerId === rootContainerId) {
		return false;
	}

	const config = getContainerConfig(containerId);
	return Boolean(config && config.restrict === 'self-only');
}

export function findLinearTabExitTargetInTargets (targets, ax, ay, isRtl, isForward) {
	const orderedTargets = isForward ? targets : [...targets].reverse();

	for (const {target, x: cx, y: cy} of orderedTargets) {
		if (!target || isTargetInSelfOnlyContainer(target)) {
			continue;
		}
		const inOrder = isForward ?
			comesBeforeInTabOrder(ax, ay, cx, cy, isRtl) :
			comesBeforeInTabOrder(cx, cy, ax, ay, isRtl);
		if (inOrder) {
			// Do not defer popup owners; resolveTargetToOpenPopupItem redirects into open popups.
			return target;
		}
	}

	return null;
}

/*
 * After Tab reaches the end (or start) of a `self-only` popup list, pick the next spottable
 * outside the popup: the immediate successor (or predecessor) in the same global linear order
 * as the root container, so grids work for horizontal and vertical neighbors.
 */
export function findLinearTabExitTarget (focusedElement, selfOnlyContainerId, isForward) {
	const containerNode = getContainerNode(selfOnlyContainerId);
	if (!containerNode) {
		return null;
	}

	const popupOwner = getPopupOwnerElement(containerNode);
	const focusCenter = getRect(focusedElement).center;
	const isRtl = isRtlDocument();
	const rootTargets = getLinearTargetsInContainer(rootContainerId);

	const pickExitTarget = (x, y, searchForward) => {
		const candidate = findLinearTabExitTargetInTargets(
			rootTargets,
			x,
			y,
			isRtl,
			searchForward
		);
		return candidate ?
			resolveTargetToOpenPopupItem(candidate, selfOnlyContainerId, isForward) :
			null;
	};

	if (isForward) {
		const exitTarget = pickExitTarget(focusCenter.x, focusCenter.y, true);
		if (exitTarget) {
			return exitTarget;
		}
	}

	if (popupOwner) {
		const ownerRect = getRect(popupOwner);
		// top+1 keeps row-level neighbors in the same TAB_ROW_THRESHOLD band as a tall owner button.
		const exitTarget = pickExitTarget(ownerRect.center.x, ownerRect.top + 1, isForward);
		if (exitTarget) {
			return exitTarget;
		}
	}

	if (!isForward) {
		return pickExitTarget(focusCenter.x, focusCenter.y, false);
	}

	return null;
}

/*
 * Innermost `partition: true` spotlight container ancestor of `target`, if any.
 * Matches 5-way navigation: controls in a partition group (e.g. TabLayout sidebar tabs)
 * share the container bounds instead of individual positions for ordering.
 */
function getInnermostPartitionContainerId (target) {
	let node = target;

	while (node && node !== document) {
		if (isContainer(node)) {
			const containerId = getContainerId(node);
			if (containerId && getContainerConfig(containerId)?.partition) {
				return containerId;
			}
		}
		node = node.parentNode;
	}

	return null;
}

/*
 * Whether `target` lies outside the DOM subtree of a `partition` container. TabLayout sidebar
 * tabs and main-panel controls are siblings — comparing viewport x/y alone can interleave them
 * when rows overlap; DOM containment keeps the whole partition group ahead of outside content.
 */
function isOutsidePartitionContainer (target, partitionContainerId) {
	const partitionNode = getContainerNode(partitionContainerId);

	return Boolean(partitionNode && !partitionNode.contains(target));
}

function compareVisualTabOrder (a, b, isRtl) {
	if (comesBeforeInTabOrder(a.x, a.y, b.x, b.y, isRtl)) {
		return -1;
	}
	if (comesBeforeInTabOrder(b.x, b.y, a.x, a.y, isRtl)) {
		return 1;
	}

	return a.order - b.order;
}

function compareTabOrderEntries (a, b, isRtl) {
	const partitionA = a.partitionId;
	const partitionB = b.partitionId;

	if (partitionA && partitionA === partitionB) {
		return a.order - b.order;
	}

	const partitionRectA = partitionA ? getContainerRect(partitionA) : null;
	const partitionRectB = partitionB ? getContainerRect(partitionB) : null;

	if (partitionA && !partitionB) {
		if (isOutsidePartitionContainer(b.target, partitionA)) {
			return -1;
		}

		return compareVisualTabOrder(a, b, isRtl);
	}

	if (!partitionA && partitionB) {
		if (isOutsidePartitionContainer(a.target, partitionB)) {
			return 1;
		}

		return compareVisualTabOrder(a, b, isRtl);
	}

	if (partitionA && partitionB) {
		const visual = compareVisualTabOrder(
			{
				order: a.order,
				x: partitionRectA.center.x,
				y: partitionRectA.top + 1
			},
			{
				order: b.order,
				x: partitionRectB.center.x,
				y: partitionRectB.top + 1
			},
			isRtl
		);

		return visual || a.order - b.order;
	}

	return compareVisualTabOrder(a, b, isRtl);
}

export function getLinearTargetContainerId (target) {
	// Prefer DOM ancestry over getContainersForNode so aria-owns owners stay in root Tab order.
	const containerNode = target?.closest?.('[data-spotlight-container][data-spotlight-id]');
	if (containerNode) {
		const domContainerId = getContainerId(containerNode);
		if (domContainerId) {
			return domContainerId;
		}
	}

	const containerIds = getContainersForNode(target);
	return last(containerIds);
}

export function getLinearTargetsInContainer (containerId) {
	if (_linearTargetsCache?.has(containerId)) {
		return _linearTargetsCache.get(containerId);
	}

	const isRtl = isRtlDocument();
	const visitedContainers = new Set();
	const visitedTargets = new Set();

	const gatherSpottableLeaves = (id) => {
		if (!id || visitedContainers.has(id)) {
			return [];
		}

		visitedContainers.add(id);

		return getSpottableDescendantsForTab(id).reduce((result, candidate) => {
			if (isContainer(candidate)) {
				const nestedContainerId = getContainerId(candidate);
				result.push(...gatherSpottableLeaves(nestedContainerId));
			} else if (!visitedTargets.has(candidate)) {
				visitedTargets.add(candidate);
				result.push(candidate);
			}

			return result;
		}, []);
	};

	const targets = gatherSpottableLeaves(containerId)
		.filter((target) => {
			const targetContainerId = getLinearTargetContainerId(target);
			return isNavigableForTab(target, targetContainerId, true);
		})
		.map((target, order) => {
			const {center} = getRect(target);
			return {
				order,
				partitionId: getInnermostPartitionContainerId(target),
				target,
				x: center.x,
				y: center.y
			};
		})
		.sort((a, b) => compareTabOrderEntries(a, b, isRtl));

	if (_linearTargetsCache) {
		_linearTargetsCache.set(containerId, targets);
	}

	return targets;
}

export function createTabTraversal ({
	focusElement,
	getCurrent,
	restoreFocus
}) {
	function spotLinear (isForward) {
		let currentFocusedElement = getCurrent();

		if (!currentFocusedElement) {
			if (!restoreFocus()) {
				return false;
			}
			currentFocusedElement = getCurrent();
			if (!currentFocusedElement) {
				return false;
			}
		}

		const searchContainerId = getLinearTabSearchContainerId(currentFocusedElement);
		const linearTargets = getLinearTargetsInContainer(searchContainerId);
		if (!linearTargets.length) {
			return false;
		}
		let currentIndex = linearTargets.findIndex(({target}) => target === currentFocusedElement);
		if (currentIndex < 0) {
			const nearestTarget = getNearestTargetFromPosition(getRect(currentFocusedElement).center, searchContainerId);
			currentIndex = nearestTarget ?
				linearTargets.findIndex(({target}) => target === nearestTarget) :
				-1;
			// When no nearest target can be found (e.g. position is NaN), keep currentIndex at -1
			// so that nextIndex = -1 + 1 = 0, landing on the first element in the list.
			// Treating 0 as the virtual "current" would skip the first element entirely.
		}

		const nextIndex = currentIndex + (isForward ? 1 : -1);
		const scopeIsSelfOnly = searchContainerId !== rootContainerId &&
			getContainerConfig(searchContainerId)?.restrict === 'self-only';

		if (nextIndex >= linearTargets.length) {
			if (scopeIsSelfOnly && isForward) {
				const exitTarget = findLinearTabExitTarget(
					currentFocusedElement,
					searchContainerId,
					true
				);
				if (exitTarget) {
					return focusElement(exitTarget, getContainersForNode(exitTarget));
				}
			}
			if (searchContainerId === rootContainerId && linearTargets.length > 1) {
				const wrapTarget = linearTargets[0].target;
				return focusElement(wrapTarget, getContainersForNode(wrapTarget));
			}
			return false;
		}
		if (nextIndex < 0) {
			if (scopeIsSelfOnly && !isForward) {
				const exitTarget = findLinearTabExitTarget(
					currentFocusedElement,
					searchContainerId,
					false
				);
				if (exitTarget) {
					return focusElement(exitTarget, getContainersForNode(exitTarget));
				}
			}
			if (searchContainerId === rootContainerId && linearTargets.length > 1) {
				const wrapTarget = linearTargets[linearTargets.length - 1].target;
				return focusElement(wrapTarget, getContainersForNode(wrapTarget));
			}
			return false;
		}

		const nextTarget = linearTargets[nextIndex].target;
		return focusElement(nextTarget, getContainersForNode(nextTarget));
	}

	return {runWithLinearTargetsCache, spotLinear};
}
