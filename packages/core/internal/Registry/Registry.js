/**
 * Allows components to register parents to cascade context changes and trigger functions
 *
 * @class Registry
 * @memberof ui/Registry
 * @ui
 * @private
 */
const Registry = {
	create: () => {
		const instances = [];
		let currentParent;
		const registry = {
			setParent (parent) {
				if (currentParent) {
					currentParent.unregister(registry.notify);
				}
				if (parent && parent.register) {
					parent.register(registry.notify);
					currentParent = parent;
				}
			},
			notify (ev) {
				instances.forEach(f => f(ev));
			},
			register (instance) {
				if (instances.indexOf(instance) === -1) {
					instances.push(instance);
				}
			},
			unregister (instance) {
				const i = instances.indexOf(instance);
				if (i >= 0) {
					instances.splice(i, 1);
				}
			}
		};

		return registry;
	}
};

export default Registry;
export {Registry};
