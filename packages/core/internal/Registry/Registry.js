/**
 * Allows components to register parents to cascade context changes and trigger functions
 *
 * @type Object
 * @memberof core/Registry
 * @private
 */
const Registry = {
	create: (handler) => {
		const instances = [];
		let currentParent;

		const registry = Object.freeze({
			set parent (register) {
				if (currentParent && currentParent.unregister) {
					currentParent.unregister();
				}
				if (register && register.notify) {
					currentParent = register(registry.notify);
				}
			},
			notify (ev, exclude = () => true) {
				instances.filter(exclude).forEach(f => f(ev));
			},
			register (instance) {
				if (instances.indexOf(instance) === -1) {
					instances.push(instance);

					if (handler) {
						handler({action: 'register'}, instance);
					}
				}

				return {
					notify (ev) {
						if (handler) {
							handler(ev, instance);
						}
					},
					unregister () {
						const i = instances.indexOf(instance);
						if (i >= 0) {
							instances.splice(i, 1);

							if (handler) {
								handler({action: 'register'}, instance);
							}
						}
					}
				};
			}
		});

		return registry;
	}
};

export default Registry;
export {Registry};
