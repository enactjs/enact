import {useMonitorEvents} from './useMonitorEvents';

const useKey = () => {
	const {
		deleteMonitorEventTarget,
		setMonitorEventTarget
	} = useMonitorEvents();

	return {
		deleteMonitorEventTarget,
		setMonitorEventTarget
	};
}

export {
	useKey
};
