import warning from 'warning';

// HostComponent, HostText, and HostSingleton. Matches React's fragment traversal,
// which visits first-level host children and looks through composite components.
const HOST_COMPONENT = 5;
const HOST_TEXT = 6;
const OFFSCREEN = 22;
const HOST_SINGLETON = 27;
const ELEMENT_NODE = 1;

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

// WithRef's walk: from the hidden marker, find the node stamped with the same id,
// then the ancestor that is a direct child of the marker's parent.
const findOutermostFromMarker = (marker) => {
	if (!marker || marker.nodeType !== ELEMENT_NODE || !marker.hasAttribute('data-withref-target')) {
		return null;
	}

	const attributeSelector = `[data-withref-id="${marker.getAttribute('data-withref-target')}"]`;
	const parent = marker.parentElement;
	const targetNode = parent && parent.querySelector(attributeSelector);
	for (let current = targetNode; current; current = current.parentElement) {
		if (current.parentElement === marker.parentElement) {
			return current;
		}
	}

	return null;
};

let fallbackSerial = 0;

// Stable id for the hidden marker. `useId` values contain ":" and break the attribute selector.
const createFragmentFallbackId = () => {
	fallbackSerial += 1;
	return `fragment-host-${fallbackSerial}`;
};

/**
 * First host element owned by a fragment ref.
 *
 * `FragmentInstance` does not expose its DOM children. Spottable and ViewManager
 * still need that element (`classList`, `setAttribute`, `Element.animate`, and
 * `children` for the rendered view). The hidden-marker walk used to return this
 * same outermost node.
 *
 * If React no longer provides `_fragmentFiber`, warn and use that marker walk.
 * The worst case is the previous WithRef behavior, not a silent null.
 *
 * @param {import('react').FragmentInstance|Element|null|undefined} fragment
 * @param {Element|null|undefined} marker Hidden `data-withref-target` sibling.
 * @returns {Element|null}
 * @private
 */
const getFragmentHostNode = (fragment, marker) => {
	if (fragment && fragment.nodeType === ELEMENT_NODE) {
		return findOutermostFromMarker(fragment);
	}

	const fiber = fragment && fragment._fragmentFiber;
	if (fiber) {
		return findHostElement(fiber.child);
	}

	if (fragment) {
		warning(
			false,
			'Fragment ref is missing `_fragmentFiber`. Falling back to the hidden WithRef marker.'
		);
	}

	return findOutermostFromMarker(marker);
};

export default getFragmentHostNode;
export {
	createFragmentFallbackId,
	getFragmentHostNode
};
