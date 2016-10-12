import {handle, forKeyCode, forward, stop} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import React from 'react';
import invariant from 'invariant';

const forEscape = forKeyCode(27);

let listening = [];
const notify = handle(forEscape, () => {
	listening.forEach(o => o.cancel());
});

const listen = function (obj) {
	listening.push(obj);
	if (listening.length === 1) {
		document.addEventListener('keyup', notify);
	}
};

const stopListening = function (obj) {
	listening.remove(obj);
	if (listening.length === 0) {
		document.removeEventListener('keyup', notify);
	}
};

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
				listen(this);
			}
		}

		componentWillUnmount () {
			if (modal) {
				stopListening(this);
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
