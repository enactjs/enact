import hoc from '@enact/core/hoc';
import Cancelable from '@enact/ui/Cancelable';

const defaultConfig = {
	cancel: null
};

const CancelDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {cancel} = config;

	function handleCancel (props) {
		const {index, [cancel]: handler} = props;
		if (index > 0 && handler) {
			handler({
				index: index - 1
			});

			return true;
		}
	}

	return Cancelable(
		{modal: true, onCancel: handleCancel},
		Wrapped
	);
});

export default CancelDecorator;
export {CancelDecorator};
