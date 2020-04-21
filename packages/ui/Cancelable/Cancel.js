import {forward, handle, stop, stopImmediate} from '@enact/core/handle';

import {dispatchCancelToConfig, forCancel} from './cancelHandler';

class Cancel {
	constructor ({onCancel, ...config}) {
		this.props = config; // {...props, dispatchCancelToConfig: dispatchCancelToConfig(onCancel)};
		this.context = {}; // Needed to get the ture value as the return value of the `hasPropsAndContext`.

		this.dispatchCancelToConfig = dispatchCancelToConfig(onCancel);
	}

	handleCancel = handle(
		forCancel,
		forward('onCancel'),
		() => (this.dispatchCancelToConfig(this.props)),
		stop,
		stopImmediate
	)

	handleKeyUp = handle(
		// nesting handlers for DRYness. note that if any conditions return false in
		// this.handleCancel(), this handler chain will stop too
		this.handleCancel
	).bind(this)
}

export default Cancel;
export {
	Cancel
};
