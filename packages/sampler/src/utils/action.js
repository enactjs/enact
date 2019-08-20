import {action} from '@storybook/addon-actions';

const safeAction = (name, include = ['type']) => {
	const handler = action(name);
	return (ev) => {
		// Ducktyping for React synthetic event to extract the specified members to improve
		// serialization perf
		if (ev && ev.nativeEvent) {
			ev = Object.keys(ev).filter(key => include.includes(key)).reduce((acc, key) => {
				acc[key] = ev[key];

				return acc;
			}, {});
		}

		handler(ev);
	};
};

export default safeAction;
export {
	safeAction as action
};
