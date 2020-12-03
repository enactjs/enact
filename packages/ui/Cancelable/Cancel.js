import {handle, stop, stopImmediate} from '@enact/core/handle';

import {dispatchCancelToConfig, forCancel} from './cancelHandler';

class Cancel {
	constructor ({onCancel}) {
		this.dispatch = dispatchCancelToConfig(onCancel);
	}

	setContext (props) {
		this.props = props;
	}

	handle = handle.bind(this);

	handleCancel = handle(
		() => (this.dispatch(this.props)),
		stop,
		stopImmediate
	);
}

export default Cancel;
export {
	Cancel,
	forCancel as isCancel
};
