import useClass from '../useClass';

class Handlers {
	constructor (_handlers) {
		this.props = {};
		this.context = {};

		this._handlers = {};
		if (_handlers) {
			Object.keys(_handlers).forEach(fn => {
				this._handlers[fn] = (ev) => {
					return _handlers[fn](ev, this.props, this.context);
				};
				this._handlers[fn].displayName = fn;
			});
		}
	}

	get handlers () {
		return this._handlers;
	}

	setContext (props = {}, context = {}) {
		this.props = props;
		this.context = context;
	}
}

/**
 * Creates a map of event handlers with consistent references across renders.
 *
 * Each function in the `handlers` will receive the first argument passed by the downstream caller
 * along with the latest `props` and `context` values passed to `useHandlers`. This is designed to
 * work well with {@link core/handle} which generates handlers with this function signature.
 *
 * @param {Object.<String, Function>} handlers  Map of handler names to functions.
 * @params {any}                      [props]   Typically, the props for the component but that is
 *                                              not required.
 * @params {any}                      [context] Additional data or methods the handlers may need.
 * @returns {Object}                            A map of bound handlers
 * @private
 */
function useHandlers (handlers, props, context) {
	const h = useClass(Handlers, handlers);
	h.setContext(props, context);

	return h.handlers;
}

export default useHandlers;
export {
	useHandlers
};
