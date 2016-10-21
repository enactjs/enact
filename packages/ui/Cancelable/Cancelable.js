/**
 * Exports the {@link module:@enact/ui/Cancelable~Cancelable} Higher-order Component (HOC).
 *
 * @module @enact/ui/Cancelable
 */

import {forward, handle, stopImmediate} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import invariant from 'invariant';
import React from 'react';

import {forCancel, addCancelHandler, removeCancelHandler} from './cancelHandler';
import {on, off} from './dispatcher';

const defaultConfig = {
	onCancel: null,
	modal: false,
	component: null
};

/**
 * {@link module:@enact/ui/Cancelable~Cancelable} is a Higher-order Component that allows mapping
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
 * @ui
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

	return class extends React.Component {
		static displayName = 'Cancelable';

		componentDidMount () {
			if (modal) {
				on('keyup', this.handleModalCancel);
			}
		}

		componentWillUnmount () {
			if (modal) {
				off('keyup', this.handleModalCancel);
			}
		}

		cancel = () => {
			if (typeof onCancel === 'string' && typeof this.props[onCancel] === 'function') {
				this.props[onCancel]();
			} else if (typeof onCancel === 'function') {
				return onCancel(this.props);
			} else {
				return true;
			}
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

		renderWrapped () {
			return (
				<Component onKeyUp={this.handleKeyUp}>
					<Wrapped {...this.props} />
				</Component>
			);
		}

		renderUnwrapped () {
			return (
				<Wrapped {...this.props} onKeyUp={this.handleKeyUp} />
			);
		}

		renderModal () {
			return (
				<Wrapped {...this.props} />
			);
		}

		render () {
			return	modal && this.renderModal() ||
					Component && this.renderWrapped() ||
					this.renderUnwrapped();
		}
	};
});

export default Cancelable;
export {
	addCancelHandler,
	Cancelable,
	removeCancelHandler
};
