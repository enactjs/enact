import {CallbackObject} from '../types';

class Handlers {
	props;
	context;
	_handlers: CallbackObject;

	constructor (_handlers?: CallbackObject) {
		this.props = {};
		this.context = {};

		this._handlers = {};
		if (_handlers) {
			Object.keys(_handlers).forEach(fn => {
				this._handlers[fn] = (ev: Event) => {
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

export default Handlers;
export {
	Handlers
};
