import hoc from '@enact/core/hoc';
import deprecate from '@enact/core/internal/deprecate';
import Registry from '@enact/core/internal/Registry';
import {createContext, Component} from 'react';

const RadioContext = createContext();

/**
 * A higher-order component that establishes a radio group context for its descendants.
 *
 * Any descendants that are wrapped by {@link ui/RadioDecorator.RadioDecorator} will be mutually exclusive.
 *
 * @class RadioControllerDecorator
 * @memberof ui/RadioDecorator
 * @hoc
 * @public
 * @deprecated Will be removed in 5.0.0.
 */
const RadioControllerDecorator = hoc((config, Wrapped) => {

	return class extends Component {
		static displayName = 'RadioControllerDecorator';

		constructor (props) {
			super(props);

			this.active = null;
			this.registry = Registry.create(this.handleNotify.bind(this));
		}

		handleNotify (ev, instance) {
			if (ev.action === 'activate') {
				this.activate(instance);
			} else if (ev.action === 'deactivate') {
				this.deactivate(instance);
			}
		}

		activate (item) {
			// if the active radio item isn't item and item is active, try to deactivate all the
			// other radio items
			if (this.active && this.active !== item) {
				this.registry.notify({action: 'deactivate'}, i => i === this.active);
			}

			this.active = item;
		}

		deactivate (item) {
			if (this.active === item) {
				this.active = null;
			}
		}

		render () {
			deprecate({
				name: 'ui/RadioDecorator.RadioControllerDecorator',
				until: '5.0.0'
			});
			return (
				<RadioContext.Provider value={this.registry.register}>
					<Wrapped {...this.props} />
				</RadioContext.Provider>
			);
		}
	};
});

export default RadioControllerDecorator;
export {
	RadioContext,
	RadioControllerDecorator
};
