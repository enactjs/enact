import hoc from '@enact/core/hoc';
import Cancelable from '@enact/ui/Cancelable';
import Spotlight from '@enact/spotlight';

import css from './Panels.less';

const defaultConfig = {
	cancel: null
};

const CancelDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {cancel} = config;

	function handleCancel (ev, props) {
		const {index, [cancel]: handler} = props;

		if (index > 0 && handler && !document.querySelector(`.${css.transitioning}`)) {
			// clear Spotlight focus
			const current = Spotlight.getCurrent();
			if (current) {
				current.blur();
			}

			handler({
				index: index - 1
			});

			ev.stopPropagation();
		}
	}

	return Cancelable(
		{modal: true, onCancel: handleCancel},
		Wrapped
	);
});

export default CancelDecorator;
export {CancelDecorator};
