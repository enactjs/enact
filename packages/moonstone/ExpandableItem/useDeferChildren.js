import {Job} from '@enact/core/util';
import React from 'react';

function useJob (callback, timeout) {
	const [state] = React.useState({});
	state.job = state.job || new Job(callback, timeout);

	React.useEffect(() => {
		return () => state.job.stop();
	});

	return state.job;
}

function useDeferChildren (hidden) {
	const [hideChildren, setState] = React.useState(hidden);
	const hide = () => setState(false);
	const job = useJob(hide);

	return {
		hideChildren,
		onBlur: () => job.stop(),
		onFocus: () => hideChildren && job.idle()
	};
}

export default useDeferChildren;
export {
	useDeferChildren
};
