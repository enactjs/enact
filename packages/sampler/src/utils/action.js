import {action} from '@storybook/addon-actions';

const safeAction = (name, include = ['type']) => {
	const handler = action(name);
	return (ev) => {
		// If it's a React synthetic event, extract the type member and drop the rest
		if (ev.nativeEvent) {
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
