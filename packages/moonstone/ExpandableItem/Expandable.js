import Cancelable from '@enact/ui/Cancelable';
import R from 'ramda';
import Toggleable from '@enact/ui/Toggleable';

const handleCancel = function (props) {
	if (props.open) {
		props.onClose();
	} else {
		// Return `true` to allow event to propagate to containers for unhandled cancel
		return true;
	}
};

const Expandable = R.compose(
	Toggleable({activate: 'onOpen', deactivate: 'onClose', mutable: true, prop: 'open'}),
	Cancelable({component: 'span', onCancel: handleCancel})
);

export default Expandable;
export {Expandable};
