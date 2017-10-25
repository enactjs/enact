import hoc from '@enact/core/hoc';
import Cancelable from '@enact/ui/Cancelable';
import Spotlight from '@enact/spotlight';

const defaultConfig = {
	cancel: null
};

const CancelDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {cancel} = config;

	function handleCancel (props) {
		const {index, [cancel]: handler} = props;
		if (index > 0 && handler) {
			// clear Spotlight focus
			const current = Spotlight.getCurrent();
			if (current) {
				current.blur();
			}

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
