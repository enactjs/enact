
import {adaptEvent, forProp, forward, handle, not} from '@enact/core/handle';

import useControlledState from '../useControlledState';

const isEnabled = not(forProp('disabled', true));
const handleEvent = (adapter) => handle(
	isEnabled,
	adaptEvent(
		(ev, props, context) => ({
			selected: adapter(ev, props, context)
		}),
		forward('onToggle')
	),
	(ev, props, context) => {
		context.onToggle(adapter(ev, props, context));
		return true;
	}
);

const handleToggle = handleEvent((ev, props, {value}) => !value).named('handleToggle');
const handleActivate = handleEvent(() => true).named('handleActivate');
const handleDeactivate = handleEvent(() => false).named('handleDeactivate');

// eslint-disable-next-line no-shadow
function useToggle (props) {
	const [value, onToggle] = useControlledState(props.defaultSelected, props.selected, typeof props.selected !== 'undefined');
	const context = {
		value,
		onToggle
	};

	return {
		onActivate: (ev) => handleActivate(ev, props, context),
		onDeactivate: (ev) => handleDeactivate(ev, props, context),
		onToggle: (ev) => handleToggle(ev, props, context),
		selected: Boolean(value)
	};
}

export default useToggle;
export {
	useToggle
};
