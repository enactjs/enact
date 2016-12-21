import hoc from '@enact/core/hoc';
import React from 'react';

/**
 * The `contextTypes` published by {@link ui/RadioDecorator.RadioControllerDecorator} to interact
 * with {@link ui/RadioDecorator.RadioDecorator} instances.
 *
 * @type {Object}
 * @private
 */
const contextTypes = {
	/**
	 * Called by a {@link ui/RadioDecorator.RadioDecorator} when it is activated
	 *
	 * @type {Function}
	 */
	activateRadioItem: React.PropTypes.func,

	/**
	 * Called by a {@link ui/RadioDecorator.RadioDecorator} when it is deactivated
	 *
	 * @type {Function}
	 */
	deactivateRadioItem: React.PropTypes.func,

	/**
	 * Called by a {@link ui/RadioDecorator.RadioDecorator} when it is mounted to register it for
	 * deactivations.
	 *
	 * @type {Function}
	 */
	registerRadioItem: React.PropTypes.func,

	/**
	 * Called by a {@link ui/RadioDecorator.RadioDecorator} when it will be unmounted to deregister
	 * it for deactivations.
	 *
	 * @type {Function}
	 */
	deregisterRadioItem: React.PropTypes.func
};

/**
 * {@link ui/RadioDecorator.RadioControllerDecorator} is a Higher-order Component that establishes
 * a radio group context for its descendants. Any descendants that are wrapped by
 * {@link ui/RadioDecorator.RadioDecorator} will be mutually exclusive.
 *
 * @class RadioControllerDecorator
 * @memberof ui/RadioDecorator
 * @hoc
 * @public
 */
const RadioControllerDecorator = hoc((config, Wrapped) => {

	return class extends React.Component {
		static displayName = 'RadioControllerDecorator'

		static childContextTypes = contextTypes

		constructor (props) {
			super(props);

			this.active = null;
			this.radioItems = [];
		}

		getChildContext () {
			return {
				activateRadioItem: this.activate,
				deactivateRadioItem: this.deactivate,
				registerRadioItem: this.register,
				deregisterRadioItem: this.deregister
			};
		}

		activate = (item) => {
			// if the active radio item isn't item and item is active, try to deactivate all the
			// other radio items
			if (this.active && this.active !== item) {
				this.radioItems.forEach(radioItem => {
					if (radioItem !== item && typeof radioItem.deactivate === 'function') {
						radioItem.deactivate();
					}
				});
			}

			this.active = item;
		}

		deactivate = (item) => {
			if (this.active === item) {
				this.active = null;
			}
		}

		register = (item) => {
			if (this.radioItems.indexOf(item) === -1) {
				this.radioItems.push(item);
			}
		}

		deregister = (item) => {
			const index = this.radioItems.indexOf(item);
			if (index !== -1) {
				this.radioItems.splice(index, 1);
			}
		}

		render () {
			return <Wrapped {...this.props} />;
		}
	};
});

export default RadioControllerDecorator;
export {
	contextTypes,
	RadioControllerDecorator
};
