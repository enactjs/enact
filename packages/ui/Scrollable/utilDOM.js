import warning from 'warning';

// At the end, wes should not use DOM APIs as well as the APIs in the `utilDOM`. If we use them, we have to try to remove them first if possible.

const utilDOM = (function () {
	// Functions

	function containsDangerously (ref, target) {
		if (!target) {
			return false;
		} else if (ref.current) {
			warning(ref.current.contains, 'The `contains` function of the Ref is not supported.');

			return ref.current.contains(target);
		} else if (ref) {
			warning(ref.contains, 'The `contains` function of the Ref is not supported.');

			return ref.contains(target);
		}

		return false;
	}

	// TBD
	// Need to define functions for the following DOM APIs
	// getBoundingClientRect
	// dataset.spotlightId
	// getRect
	// setAttribute
	// removeAttribute
	// scrollLeft
	// scrollTop
	function datasetDangerously () {}
	function getBoundingClientRectDangerously () {}
	function getRectDangerously () {}
	function removeAttributeDangerously () {}
	function setAttributeDangerously () {}
	const scrollLeftDangerously = 0;
	const scrollTopDangerously = 0;

	// Return

	return {
		containsDangerously,
		datasetDangerously,
		getBoundingClientRectDangerously,
		getRectDangerously,
		removeAttributeDangerously,
		scrollLeftDangerously,
		scrollTopDangerously,
		setAttributeDangerously
	};
})();

export default utilDOM;
export {
	utilDOM
};
