import {forProp, forwardCustom, handle, not, returnsTrue} from '@enact/core/handle';

const isEnabled = not(forProp('disabled', true));
const makeEvent = (config, value) => ({
	[config.prop || 'selected']: value
});

class Toggle {
	constructor (config) {
		// remapping to props for better compatibility with core/handle and binding
		this.props = config;
		this.context = {};
	}

	setContext (props, value, onToggle) {
		this.props = {...this.props, ...props};
		this.context.value = value;
		this.context.onToggle = onToggle;
	}

	get value () {
		return Boolean(this.context.value);
	}

	handleActivate = handle(
		isEnabled,
		forwardCustom('onToggle', (ev, props) => makeEvent(props, true)),
		returnsTrue((ev, props, context) => context.onToggle(true))
	).bindAs(this, 'handleActivate');

	handleDeactivate = handle(
		isEnabled,
		forwardCustom('onToggle', (ev, props) => makeEvent(props, false)),
		returnsTrue((ev, props, context) => context.onToggle(false))
	).bindAs(this, 'handleDeactivate');

	handleToggle = handle(
		isEnabled,
		forwardCustom('onToggle', (ev, props, {value}) => makeEvent(props, !value)),
		returnsTrue((ev, props, {onToggle, value}) => onToggle(!value))
	).bindAs(this, 'handleToggle');
}

export default Toggle;
export {
	Toggle
};
