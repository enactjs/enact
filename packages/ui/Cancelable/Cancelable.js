import {forKeyCode, forward, handle, stop} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import invariant from 'invariant';
import React from 'react';

import {on, off} from './dispatcher';

const forEscape = forKeyCode(27);

const defaultConfig = {
	onCancel: null,
	modal: false,
	component: null
};

const Cancelable = hoc(defaultConfig, (config, Wrapped) => {
	const {
		onCancel,
		modal,
		component: Component
	} = config;

	const wrap = Component && !modal;

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
				return true;
			} else if (typeof onCancel === 'function') {
				return onCancel(this.props);
			}
		}

		handleModalCancel = handle(
			forEscape,
			this.cancel
		)

		handleKeyUp = handle(
			forEscape,
			forward('onKeyUp', this.props),
			this.cancel,
			stop
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
					wrap && this.renderWrapped() ||
					this.renderUnwrapped();
		}
	};
});

export default Cancelable;
export {Cancelable};
