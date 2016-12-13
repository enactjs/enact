import hoc from '@enact/core/hoc';

import Changeable from '../Changeable';

const defaultConfig = {
	activate: 'onOpen',
	prop: 'active'
};

const RadioContainerDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const RadioContainer = Changeable(
		{change: config.activate, prop: config.prop},
		Wrapped
	);

	RadioContainer.displayName = 'RadioContainerDecorator';

	return RadioContainer;
});

export default RadioContainerDecorator;
export {RadioContainerDecorator};
