import hoc from '@enact/core/hoc';
import React from 'react';

const contextTypes = {
	activateRadioItem: React.PropTypes.func,
	deactivateRadioItem: React.PropTypes.func,
	registerRadioItem: React.PropTypes.func,
	unregisterRadioItem: React.PropTypes.func
};

const RadioContainerDecorator = hoc((config, Wrapped) => {

	return class extends React.Component {
		static displayName = 'RadioContainerDecorator'

		static childContextTypes = contextTypes

		static propTypes = /** @lends ui/RadioContainerDecorator.RadioContainerDecorator.prototype */ {
			/**
			 * Controls whether the component is disabled.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: React.PropTypes.bool	// eslint-disable-line react/sort-prop-types
		}

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
				unregisterRadioItem: this.unregister
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

		unregister = (item) => {
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

export default RadioContainerDecorator;
export {
	contextTypes,
	RadioContainerDecorator
};
