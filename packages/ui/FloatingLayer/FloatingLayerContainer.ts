import Registry, {type RegistryEvent, type RegistryHandle} from '@enact/core/internal/Registry';

interface FloatingLayerContainerConfig {
	floatLayerId?: string;
}

class FloatingLayerContainer {
	registry: RegistryHandle;
	floatingLayer: HTMLElement | null;
	config: FloatingLayerContainerConfig;

	constructor (config: FloatingLayerContainerConfig) {
		const {floatLayerId} = config;

		this.registry = Registry.create(this.handleNotify);
		this.floatingLayer = null;

		this.config = {floatLayerId};
	}

	load () {
		this.notifyMount();
	}

	getFloatingLayer = (): HTMLElement | null => {
		// FIXME: if a component that resides in the floating layer is rendered at the same time
		// as the floating layer, this.floatingLayer may not have been initialized yet since
		// componentDidMount runs inside-out. As a fallback, we search by id but this could
		// introduce issues (e.g. for duplicate layer ids).
		return (
			this.floatingLayer ||
			(typeof document !== 'undefined' && this.config.floatLayerId && document.getElementById(this.config.floatLayerId)) ||
			null
		);
	};

	handleNotify = (ev: RegistryEvent) => {
		const {action} = ev;
		if (action === 'register') {
			this.notifyMount();
		} else if (action === 'closeAll') {
			this.handleCloseAll();
		}
	};

	handleCloseAll () {
		this.registry.notify({action: 'close'});
	}

	notifyMount () {
		this.registry.notify({
			action: 'mount',
			floatingLayer: this.getFloatingLayer()
		});
	}

	setFloatingLayer = (node: HTMLElement | null) => {
		this.floatingLayer = node;
	};
}

export default FloatingLayerContainer;
export {
	FloatingLayerContainer
};
