import useEvent from '@enact/ui/Scrollable/useEvent';
import {useEffect} from 'react';

const usePreventScroll = (props, instances, context) => {
	const {rtl} = props;
	const {containerNode, type} = context;

	// Hooks

	useEffect(() => {
		if (type === 'JS' && containerNode) {
			const preventScroll = () => {
				containerNode.scrollTop = 0;
				containerNode.scrollLeft = rtl ? containerNode.scrollWidth : 0;
			};

			useEvent('scroll').addEventListener(containerNode, preventScroll);

			return () => {
				// remove a function for preventing native scrolling by Spotlight
				useEvent('scroll').removeEventListener(containerNode, preventScroll);
			};
		}
	}, [containerNode, rtl, type]);
};

export default usePreventScroll;
export {
	usePreventScroll
};
