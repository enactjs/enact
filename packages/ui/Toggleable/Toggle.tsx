import {forProp, forwardCustom, handle, not, returnsTrue} from '@enact/core/handle';

import {useToggleConfig} from './useToggle';

export type ToggleProps = useToggleConfig & Record<string, any>;

export interface ToggleContext {
	value?: boolean;
	onToggle?: (value: boolean) => void;
}

const isEnabled = not(forProp('disabled', true));
const makeEvent = (config: Partial<useToggleConfig>, value: boolean) => ({
	[config.prop || 'selected']: value
});

class Toggle {
	props: ToggleProps;
	context: ToggleContext;

	constructor (config: useToggleConfig) {
		// remapping to props for better compatibility with core/handle and binding
		this.props = config;
		this.context = {};
	}

	setContext (props: Partial<ToggleProps>, value: boolean, onToggle: (value: boolean) => void) {
		this.props = {...this.props, ...props};
		this.context.value = value;
		this.context.onToggle = onToggle;
	}

	get value () {
		return Boolean(this.context.value);
	}

	handleActivate = handle<ToggleContext>(
		isEnabled,
		forwardCustom('onToggle', (ev, props) => makeEvent(props, true)),
		returnsTrue((ev, props, context) => context.onToggle(true))
	).bindAs(this, 'handleActivate');

	handleDeactivate = handle<ToggleContext>(
		isEnabled,
		forwardCustom('onToggle', (ev, props) => makeEvent(props, false)),
		returnsTrue((ev, props, context) => context.onToggle(false))
	).bindAs(this, 'handleDeactivate');

	handleToggle = handle<ToggleContext>(
		isEnabled,
		forwardCustom('onToggle', (ev, props, {value}) => makeEvent(props, !value)),
		returnsTrue((ev, props, {onToggle, value}) => onToggle(!value))
	).bindAs(this, 'handleToggle');
}

export default Toggle;
export {
	Toggle
};
