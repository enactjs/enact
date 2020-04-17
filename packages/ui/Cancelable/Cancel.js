import {forward, handle, stop, stopImmediate} from '@enact/core/handle';

import {forCancel} from './cancelHandler';

class Cancel {
	constructor (props) {
		this.props = props;
		this.context = {}; // Needed to get the ture value as the return value of the `hasPropsAndContext`.
	}

	handleCancel = handle(
		forCancel,
		forward('onCancel'),
		(ev) => (this.props.dispatchCancelToConfig(ev, this.props)),
		stop,
		stopImmediate
	)

	handleKeyUp = handle(
		forward('onKeyUp'),
		// nesting handlers for DRYness. note that if any conditions return false in
		// this.handleCancel(), this handler chain will stop too
		this.handleCancel
	).bind(this)
}

export default Cancel;
export {
    Cancel
};
