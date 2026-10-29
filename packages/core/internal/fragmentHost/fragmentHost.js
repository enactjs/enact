/* global Node */

// HostComponent, HostText, and HostSingleton. Matches React's fragment traversal,
// which visits first-level host children and looks through composite components.
const HOST_COMPONENT = 5;
const HOST_TEXT = 6;
const OFFSCREEN = 22;
const HOST_SINGLETON = 27;
const ELEMENT_NODE = 1;

const emptyFragmentRect = {
	bottom: 0,
	height: 0,
	left: 0,
	right: 0,
	top: 0,
	width: 0
};

let missingFiberReported = false;

const reportMissingFragmentFiber = () => {
	const message = 'Fragment ref is missing `_fragmentFiber`. React internals changed and the host node cannot be resolved. Re-check getFragmentHostNode on every React upgrade.';

	if (process.env.NODE_ENV !== 'production') {
		throw new Error(message);
	}

	if (!missingFiberReported) {
		missingFiberReported = true;
		// eslint-disable-next-line no-console
		console.error(message);
	}

	return null;
};

const findHostElement = (child) => {
	for (; child; child = child.sibling) {
		if (child.tag === HOST_COMPONENT || child.tag === HOST_SINGLETON) {
			const node = child.stateNode;
			if (node && node.nodeType === ELEMENT_NODE && !node.hasAttribute('data-withref-target')) {
				return node;
			}
			continue;
		}

		if (child.tag === HOST_TEXT) {
			continue;
		}

		// A hidden Activity/Offscreen fiber has a non-null memoizedState. Skip it.
		if (child.tag === OFFSCREEN && child.memoizedState != null) {
			continue;
		}

		const nested = findHostElement(child.child);
		if (nested) {
			return nested;
		}
	}

	return null;
};

/**
 * First host element owned by a fragment ref.
 *
 * `FragmentInstance` does not expose its DOM children. This reads React's private
 * `_fragmentFiber` and must be re-checked on every React upgrade. The fragmentHost
 * specs render through real React, so a break shows up in CI.
 *
 * If a fragment ref exists but `_fragmentFiber` is missing, this throws in
 * development and logs once with `console.error` in production.
 *
 * @param {import('react').FragmentInstance|null|undefined} fragment
 * @returns {Element|null}
 * @private
 */
const getFragmentHostNode = (fragment) => {
	if (!fragment) {
		return null;
	}

	const fiber = fragment._fragmentFiber;
	if (!fiber) {
		return reportMissingFragmentFiber();
	}

	return findHostElement(fiber.child);
};

/**
 * Union of a fragment's first-level client rects.
 *
 * Matches `Element#getBoundingClientRect` for a single host child. A zero-size rect
 * keeps its position. An empty list is a zero box, same as `getBoundingClientRect`.
 *
 * @param {import('react').FragmentInstance|null|undefined} fragment
 * @returns {DOMRect|{bottom: Number, height: Number, left: Number, right: Number, top: Number, width: Number}|null}
 * @private
 */
const getFragmentBoundingClientRect = (fragment) => {
	if (!fragment || typeof fragment.getClientRects !== 'function') {
		return null;
	}

	const rects = fragment.getClientRects();
	if (!rects || rects.length === 0) {
		return {...emptyFragmentRect};
	}

	let top = Infinity;
	let right = -Infinity;
	let bottom = -Infinity;
	let left = Infinity;

	for (let i = 0; i < rects.length; i++) {
		const rect = rects[i];
		top = Math.min(top, rect.top);
		right = Math.max(right, rect.right);
		bottom = Math.max(bottom, rect.bottom);
		left = Math.min(left, rect.left);
	}

	return {
		bottom,
		height: bottom - top,
		left,
		right,
		top,
		width: right - left
	};
};

/**
 * Whether `node` is contained by the fragment.
 *
 * `FragmentInstance` has no `contains()`. `CONTAINED_BY` covers the host child and
 * its descendants.
 *
 * @param {import('react').FragmentInstance|null|undefined} fragment
 * @param {Node|null|undefined} node
 * @returns {Boolean}
 * @private
 */
const fragmentContains = (fragment, node) => {
	if (!fragment || !node || typeof fragment.compareDocumentPosition !== 'function') {
		return false;
	}

	return Boolean(fragment.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY);
};

export {
	fragmentContains,
	getFragmentBoundingClientRect,
	getFragmentHostNode
};
