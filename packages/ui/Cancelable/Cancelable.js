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
import PropTypes from 'prop-types';

import {addModal, removeModal} from './modalHandler';
import {forCancel, addCancelHandler, removeCancelHandler} from './cancelHandler';

/**
 * Default config for {@link ui/Cancelable.Cancelable}
 *
 * @memberof ui/Cancelable.Cancelable
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * If it is a string, the cancel handler will attempt to invoke a function passed as a prop of
	 * that name. If it is a function, that function will be called with the current props as the
	 * only argument.
	 *
	 * If the function handles the cancel action, it should returning `true` to prevent container or
	 * `modal` Cancelable instances from also handling the action.
	 *
	 * @type {String|Function}
	 * @required
	 * @memberof ui/Cancelable.Cancelable.defaultConfig
	 */
	onCancel: null,

	/**
	 * When `true`, the Cancelable instance will handle cancel events globally that successfully
	 * bubble up to `window` regardless of which component is focused.
	 *
	 * `modal` cancel handlers are processed in reverse of the order they are created such that the
	 * innermost instance (in terms of the component hierarchy) have the first opportunity to handle
	 * the event before its container components.
	 *
	 * @type {String}
	 * @default false
	 * @memberof ui/Cancelable.Cancelable.defaultConfig
	 */
	modal: false,

	/**
	 * When set, the Wrapped component will be contained within an instance of `component`. This may
	 * be necessary if the props passed to Wrapped are not placed on the root element.
	 *
	 * @type {String|Function}
	 * @default null
	 * @memberof ui/Cancelable.Cancelable.defaultConfig
	 */
	component: null
};

// Add keymap for escape key
add('cancel', 27);

/**
 * {@link ui/Cancelable.Cancelable} is a Higher-order Component that allows mapping
 * a cancel key event to existing event handler either directly or via a custom function which can
 * adapt the event payload.
 *
 * The `onCancel` config option is required.
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

	invariant(onCancel, 'onCancel must be specified with Cancelable');

	const onCancelIsString = typeof onCancel === 'string';
	const onCancelIsFunction = typeof onCancel === 'function';
	const dispatchCancelToConfig = function (ev, props) {
		if (onCancelIsString && typeof props[onCancel] === 'function') {
			props[onCancel]();
			return true;
		} else if (onCancelIsFunction) {
			return onCancel(props);
		}
	};

	return class extends React.Component {
		static displayName = 'Cancelable';

		static propTypes = /** @lends ui/Cancelable.Cancelable.prototype */ {
			onCancel: PropTypes.func
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

		handle = handle.bind(this)

		handleCancel = this.handle(
			forCancel,
			forward('onCancel'),
			dispatchCancelToConfig,
			stopImmediate
		)

		handleKeyUp = this.handle(
			forward('onKeyUp'),
			// nesting handlers for DRYness. note that if any conditions return false in
			// this.handleCancel(), this handler chain will stop too
			this.handleCancel
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
