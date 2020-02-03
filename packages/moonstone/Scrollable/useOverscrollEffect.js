import {Job} from '@enact/core/util';
import {constants} from '@enact/ui/Scrollable';
import {useCallback, useEffect, useRef} from 'react';

const
	{overscrollTypeDone, overscrollTypeNone, overscrollTypeOnce} = constants,
	overscrollRatioPrefix = '--scroll-overscroll-ratio-',
	overscrollTimeout = 300;

const useOverscrollEffect = (props, instances) => {
	const {overscrollRefs, uiScrollAdapter} = instances;

	// Mutable value

	const mutableRef = useRef({
		overscrollJobs: {
			horizontal: {before: null, after: null},
			vertical: {before: null, after: null}
		}
	});

	// Hooks

	const applyOverscrollEffect = useCallback((orientation, edge, type, ratio) => {
		const nodeRef = overscrollRefs[orientation].current;

		if (nodeRef) {
			nodeRef.style.setProperty(overscrollRatioPrefix + orientation + edge, ratio);

			if (type === overscrollTypeOnce) {
				mutableRef.current.overscrollJobs[orientation][edge].start(orientation, edge, overscrollTypeDone, 0);
			}
		}
	}, [overscrollRefs]);

	useEffect(() => {
		function createOverscrollJob (orientation, edge) {
			if (!mutableRef.current.overscrollJobs[orientation][edge]) {
				mutableRef.current.overscrollJobs[orientation][edge] = new Job(applyOverscrollEffect, overscrollTimeout);
			}
		}

		function stopOverscrollJob (orientation, edge) {
			const job = mutableRef.current.overscrollJobs[orientation][edge];

			if (job) {
				job.stop();
			}
		}

		createOverscrollJob('horizontal', 'before');
		createOverscrollJob('horizontal', 'after');
		createOverscrollJob('vertical', 'before');
		createOverscrollJob('vertical', 'after');

		return () => {
			stopOverscrollJob('horizontal', 'before');
			stopOverscrollJob('horizontal', 'after');
			stopOverscrollJob('vertical', 'before');
			stopOverscrollJob('vertical', 'after');
		};
	}, [applyOverscrollEffect]);

	// Functions

	function clearOverscrollEffect (orientation, edge) {
		mutableRef.current.overscrollJobs[orientation][edge].startAfter(overscrollTimeout, orientation, edge, overscrollTypeNone, 0);
		uiScrollAdapter.current.setOverscrollStatus(orientation, edge, overscrollTypeNone, 0);
	}

	function checkAndApplyOverscrollEffectByDirection (direction) {
		const
			orientation = (direction === 'up' || direction === 'down') ? 'vertical' : 'horizontal',
			bounds = uiScrollAdapter.current.getScrollBounds(),
			scrollability = orientation === 'vertical' ? uiScrollAdapter.current.canScrollVertically(bounds) : uiScrollAdapter.current.canScrollHorizontally(bounds);

		if (scrollability) {
			const
				isRtl = uiScrollAdapter.current.rtl,
				edge = (direction === 'up' || !isRtl && direction === 'left' || isRtl && direction === 'right') ? 'before' : 'after';

			uiScrollAdapter.current.checkAndApplyOverscrollEffect(orientation, edge, overscrollTypeOnce);
		}
	}

	// Return

	return {
		applyOverscrollEffect,
		checkAndApplyOverscrollEffectByDirection,
		clearOverscrollEffect
	};
};

export default useOverscrollEffect;
export {
	useOverscrollEffect
};
