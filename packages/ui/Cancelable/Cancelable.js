/**
 * Exports the {@link ui/Cancelable.Cancelable} Higher-order Component (HOC).
 *
 * @module ui/Cancelable
 */

import {forward, handle, stopImmediate} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {add} from '@enact/core/keymap';
import invariant from 'invariant';
import React from 'react';

import {addModal, removeModal} from './modalHandler';
import {forCancel, addCancelHandler, removeCancelHandler} from './cancelHandler';

const defaultConfig = {
	onCancel: null,
	modal: false,
	component: null
};

// Add keymap for escape key
add('cancel', 27);

/**
 * {@link ui/Cancelable.Cancelable} is a Higher-order Component that allows mapping
 * a cancel key event to existing event handler either directly or via a custom function which can
 * adapt the event payload.
 *
 * The `onCancel` config option is required. If it is a string, the cancel handler will attempt to
 * invoke a function passed as a prop of that name. If it is a function, that function will be
 * called with the current props as the only argument.
 *
 * If the `modal` config option is true, any valid key press will invoke the cancel handler
 * If the `component` config option is set, the Wrapped component will contained within an instance
 * of `component`. This may be necessary if the props passed to Wrapped are not placed on the root
 * element.
 *
 * @class Cancelable
 * @memberof ui/Cancelable
 * @hoc
 * @public
 */
const Cancelable = hoc(defaultConfig, (config, Wrapped) => {
	const {
		onCancel,
		modal,
		component: Component
	} = config;
	const forwardKeyUp = forward('onKeyUp');

	invariant(onCancel, 'onCancel must be specified with Cancelable');

	const onCancelIsString = typeof onCancel === 'string';
	const onCancelIsFunction = typeof onCancel === 'function';
	const dispatchCancelToConfig = function (props) {
		if (onCancelIsString && typeof props[onCancel] === 'function') {
			props[onCancel]();
		} else if (onCancelIsFunction) {
			return onCancel(props);
		} else {
			return true;
		}
	};

	return class extends React.Component {
		static displayName = 'Cancelable';

		static propTypes = /** @lends ui/Cancelable.Cancelable.prototype */ {
			onCancel: React.PropTypes.func
		}

		componentWillMount () {
			if (modal) {
				addModal(this);
			}
		}

		componentWillUnmount () {
			if (modal) {
				removeModal(this);
			}
		}

		cancel = () => {
			if (this.props.onCancel) {
				this.props.onCancel();
			}

			return dispatchCancelToConfig(this.props);
		}

		handleModalCancel = handle(
			forCancel,
			this.cancel,
			stopImmediate
		)

		handleKeyUp = handle(
			(ev) => forwardKeyUp(ev, this.props),
			forCancel,
			this.cancel,
			stopImmediate
		)

		renderWrapped (props) {
			return (
				<Component onKeyUp={this.handleKeyUp}>
					<Wrapped {...props} />
				</Component>
			);
		}

		renderUnwrapped (props) {
			return (
				<Wrapped {...props} onKeyUp={this.handleKeyUp} />
			);
		}

		renderModal (props) {
			return (
				<Wrapped {...props} />
			);
		}

		render () {
			const props = Object.assign({}, this.props);
			delete props.onCancel;

			return	modal && this.renderModal(props) ||
					Component && this.renderWrapped(props) ||
					this.renderUnwrapped(props);
		}
	};
});

export default Cancelable;
export {
	addCancelHandler,
	Cancelable,
	removeCancelHandler
};
