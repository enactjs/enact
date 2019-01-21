/**
 * Allows components to register parents to cascade context changes and trigger functions
 *
 * @type Object
 * @memberof core/Registry
 * @private
 */
const Registry = {
	create: () => {
		const instances = [];
		let currentParent;

		const subscriber = Object.freeze({
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
		});

		const registry = Object.freeze({
			set parent (parent) {
				if (currentParent && currentParent.unregister) {
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
			get subscriber () {
				return subscriber;
			}
		});

		return registry;
	}
};

export default Registry;
export {Registry};
