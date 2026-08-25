import {CallbackObject} from '../../types';

export interface RegistryController {
	notify: (ev: RegistryEvent) => void;
	unregister: () => void;
}

export type RegistryEvent = {action: string} & CallbackObject;
export type RegistryInstance = (ev?: RegistryEvent) => void;
export type RegistryHandler = (ev: RegistryEvent, instance: RegistryInstance) => void;
export type RegisterFunction = (instance: RegistryInstance) => RegistryController;

/**
 * Handle returned by {@link core/Registry.Registry.create}.
 *
 * @private
 */
export interface RegistryHandle {
	parent: RegisterFunction | null;
	notify: (ev?: RegistryEvent, exclude?: (instance: RegistryInstance) => boolean) => void;
	register: RegisterFunction;
}

/**
 * Allows components to register parents to cascade context changes and trigger functions
 *
 * @type Object
 * @memberof core/Registry
 * @private
 */
const Registry = {
	create: (handler: RegistryHandler): RegistryHandle => {
		const instances: RegistryInstance[] = [];
		let currentParent: RegistryController;

		const registry = {
			set parent (register: RegisterFunction | null) {
				if (currentParent && currentParent.unregister) {
					currentParent.unregister();
				}
				if (register && typeof register === 'function') {
					currentParent = register(registry.notify);
				}
			},
			notify (ev?: RegistryEvent, exclude: (instance: RegistryInstance) => boolean = () => true) {
				instances.filter(exclude).forEach(f => f(ev));
			},
			register (instance: RegistryInstance) {
				if (instances.indexOf(instance) === -1) {
					instances.push(instance);

					if (handler) {
						handler({action: 'register'}, instance);
					}
				}

				return {
					notify (ev: RegistryEvent) {
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
		};

		Object.freeze(registry);

		return registry as RegistryHandle;
	}
};

export default Registry;
export {Registry};
