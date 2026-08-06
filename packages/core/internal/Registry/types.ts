import {CallbackObject} from '../../types';

export interface RegistryController {
	notify: (ev?: RegistryEvent) => void;
	unregister: () => void;
}

export type RegistryEvent = {action: string} & CallbackObject;

export type RegistryInstance = (ev?: RegistryEvent) => void;

export type RegistryHandler = (ev: RegistryEvent, instance: RegistryInstance) => void;

export type RegisterFunction = (instance: RegistryInstance) => RegistryController;