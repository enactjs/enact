import utilEvent from '@enact/ui/Scrollable/utilEvent';
import {useEffect} from 'react';

const usePreventScroll = (props, instances, context) => {
	const {uiChildContainerRef} = instances;
	const {type} = context;

	// Hooks

	useEffect(() => {
		const {rtl} = props;
		const containerNode = uiChildContainerRef.current;

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
	}, [props, type]); // eslint-disable-line react-hooks/exhaustive-deps
};

export default usePreventScroll;
export {
	usePreventScroll
};
