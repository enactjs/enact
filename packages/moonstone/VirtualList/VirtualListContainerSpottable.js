import curry from 'ramda/src/curry';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

const VirtualListSpotlightContainerConfig = {
	enterTo: 'last-focused',
	/**
	 * Returns the data-index as the key for last focused
	 */
	lastFocusedPersist: (node) => {
		const indexed = node.dataset.index ? node : node.closest('[data-index]');
		if (indexed) {
			return {
				container: false,
				element: true,
				key: indexed.dataset.index
			};
		}
	},
	/**
	 * Restores the data-index into the placeholder if its the only element. Tries to find a
	 * matching child otherwise.
	 */
	lastFocusedRestore: ({key}, all) => {
		if (all.length === 1 && 'vlPlaceholder' in all[0].dataset) {
			all[0].dataset.index = key;

			return all[0];
		}

		return all.reduce((focused, node) => {
			return focused || node.dataset.index === key && node;
		}, null);
	},
	preserveId: true,
	restrict: 'self-first'
};

const CurriedSpotlightContainerDecorator = curry(SpotlightContainerDecorator);

const VirtualListContainerSpottable = CurriedSpotlightContainerDecorator(VirtualListSpotlightContainerConfig);


export default VirtualListContainerSpottable;
export {
	VirtualListContainerSpottable
};
