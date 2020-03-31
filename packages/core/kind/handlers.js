class Handlers {
	constructor (handlers) {
		this._handlers = {};

		// cache bound function for each handler
		if (handlers) {
			Object.keys(handlers).forEach(handler => {
				return this.prepareHandler(handler, handlers[handler]);
			});
		}
	}

	get handlers () {
		return this._handlers;
	}

	set (props, context) {
		this.props = props;
		this.context = context;
	}

	/*
		* Caches an event handler on the local `handlers` member
		*
		* @param   {String}    name     Event name
		* @param   {Function}  handler  Event handler
		*
		* @returns {undefined}
		*/
	prepareHandler (prop, handler) {
		this._handlers[prop] = (ev) => {
			return handler(ev, this.props, this.context);
		};
	}
}

export default Handlers;
export {
	Handlers
};
