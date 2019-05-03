import hoc from '@enact/core/hoc';
import React from 'react';

const SharedState = React.createContext(null);

const SharedStateDecorator = hoc({idProp: 'id'}, (config, Wrapped) => {
	const {idProp} = config;

	return class extends React.Component {
		static displayName = 'SharedStateDecorator'

		static contextType = SharedState

		constructor (props) {
			super(props);

			this.data = {};
			this.sharedState = {
				set: (key, value) => {
					const {[idProp]: id} = this.props;

					if (!id) return;

					this.loadFromContext();
					this.data[id] = this.data[id] || {};
					this.data[id][key] = value;
				},

				get: (key) => {
					const {[idProp]: id} = this.props;

					this.loadFromContext();
					return this.data[id] && this.data[id][key];
				},

				delete: (key) => {
					const {[idProp]: id} = this.props;
					if (id && this.data[id]) {
						delete this.data[id][key];
					}
				}
			};
		}

		componentDidMount () {
			this.loadFromContext();
		}

		loadFromContext () {
			if (!this.loadedFromContext && this.context) {
				const {[idProp]: id} = this.props;
				const data = this.context.get(id);

				if (data) {
					this.data = data;
				} else {
					this.context.set(id, this.data);
				}

				this.loadedFromContext = true;
			}
		}

		render () {
			return (
				<SharedState.Provider value={this.sharedState}>
					<Wrapped {...this.props} />
				</SharedState.Provider>
			);
		}
	};
});

export default SharedStateDecorator;
export {
	SharedState,
	SharedStateDecorator
};
