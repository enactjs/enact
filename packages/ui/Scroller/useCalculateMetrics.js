import {platform} from '@enact/core/platform';
import {useEffect, useRef} from 'react';

const useCalculateMetrics = (props, instances) => {
	const {uiChildContainerRef} = instances;

	// Mutable value

	const variables = useRef({
		scrollBounds: {
			clientHeight: 0,
			clientWidth: 0,
			maxLeft: 0,
			maxTop: 0,
			scrollHeight: 0,
			scrollWidth: 0
		}
	});

	// Hooks

	useEffect(() => {
		calculateMetrics();
	});

	// Functions

	function calculateMetrics () {
		const
			{scrollBounds} = variables.current,
			{scrollWidth, scrollHeight, clientWidth, clientHeight} = uiChildContainerRef.current;

		scrollBounds.scrollWidth = scrollWidth;
		scrollBounds.scrollHeight = scrollHeight;
		scrollBounds.clientWidth = clientWidth;
		scrollBounds.clientHeight = clientHeight;
		scrollBounds.maxLeft = Math.max(0, scrollWidth - clientWidth);
		scrollBounds.maxTop = Math.max(0, scrollHeight - clientHeight);
	}

	function getRtlPositionX (x) {
		if (props.rtl) {
			return (platform.ios || platform.safari) ? -x : variables.current.scrollBounds.maxLeft - x;
		}

		return x;
	}

	function getScrollBounds () {
		return variables.current.scrollBounds;
	}

	// Return

	return {
		calculateMetrics,
		getRtlPositionX,
		getScrollBounds
	};
};

export default useCalculateMetrics;
export {
	useCalculateMetrics
};
