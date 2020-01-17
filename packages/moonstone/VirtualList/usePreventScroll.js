import {useEffect} from 'react';

const usePreventScroll = (props, instances, dependencies) => {
	/*
	 * Dependencies
	 */

	const {rtl} = props;
	const {containerNode, type} = dependencies;

	/*
	 * Hooks
	 */

	useEffect(() => {
		if (type === 'JS' && containerNode) {
			const preventScroll = () => {
				containerNode.scrollTop = 0;
				containerNode.scrollLeft = rtl ? containerNode.scrollWidth : 0;
			};

			if (containerNode && containerNode.addEventListener) {
				containerNode.addEventListener('scroll', preventScroll);
			}

			return () => {
				// remove a function for preventing native scrolling by Spotlight
				if (containerNode && containerNode.removeEventListener) {
					containerNode.removeEventListener('scroll', preventScroll);
				}
			};
		}
	}, [containerNode, rtl, type]);
};

export default usePreventScroll;
export {
	usePreventScroll
};
