import utilEvent from '@enact/ui/Scrollable/utilEvent';
import {useEffect} from 'react';

const usePreventScroll = (props, instances, context) => {
	cosnt {uiScrollableContainerRef} = instances;
	const {type} = context;

	// Hooks

	useEffect(() => {
		const {rtl} = props;
		const containerNode = uiScrollableContainerRef.current;

		if (type === 'JS' && containerNode) {
			const preventScroll = () => {
				containerNode.scrollTop = 0;
				containerNode.scrollLeft = rtl ? containerNode.scrollWidth : 0;
			};

			utilEvent('scroll').addEventListener(containerNode, preventScroll);

			return () => {
				// remove a function for preventing native scrolling by Spotlight
				utilEvent('scroll').removeEventListener(containerNode, preventScroll);
			};
		}
	}, [containerNode, type]);
};

export default usePreventScroll;
export {
	usePreventScroll
};
