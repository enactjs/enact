import useClass from '../internal/useClass';

class Handlers {
	constructor (fns) {
		this.props = {};
		this.context = {};

		this._handlers = {};
		Object.keys(fns).forEach(fn => {
			this._handlers[fn] = (ev) => {
				fns[fn](ev, this.props, this.context);
			};
			this._handlers[fn].displayName = fn;
		});
	}

	get handlers () {
		return this._handlers;
	}

	setContext (props = {}, context = {}) {
		this.props = props;
		this.context = context;
	}
}

function useHandlers (fns, props, context) {
	const h = useClass(Handlers, fns);
	h.setContext(props, context);

	return h;
}

export default useHandlers;
export {
	useHandlers
};
