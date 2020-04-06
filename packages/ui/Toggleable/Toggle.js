import {adaptEvent, forProp, forward, handle, not, returnsTrue} from '@enact/core/handle';

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

	setContext (value, onToggle) {
		this.context.value = value;
		this.context.onToggle = onToggle;
	}

	get value () {
		return Boolean(this.context.value);
	}

	handleActivate = handle(
		isEnabled,
		adaptEvent((ev, props) => makeEvent(props, true), forward('onToggle')),
		returnsTrue((ev, props, context) => context.onToggle(true))
	).bindAs(this, 'handleActivate')

	handleDeactivate = handle(
		isEnabled,
		adaptEvent((ev, props) => makeEvent(props, false), forward('onToggle')),
		returnsTrue((ev, props, context) => context.onToggle(false))
	).bindAs(this, 'handleDeactivate')

	handleToggle = handle(
		isEnabled,
		adaptEvent((ev, props, {value}) => makeEvent(props, !value), forward('onToggle')),
		returnsTrue((ev, props, {onToggle, value}) => onToggle(!value))
	).bindAs(this, 'handleToggle')
}

export default Toggle;
export {
	Toggle
};
